import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'
import { cartApi } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const authStore = useAuthStore()
  
  // Helper to get storage key
  const getGuestKey = () => 'cart_items_guest'

  // Load cart (User -> DB, Guest -> Local)
  const loadCart = async () => {
    if (authStore.isAuthenticated && authStore.user) {
      try {
        const result = await cartApi.getCart(authStore.accessToken)
        if (result.status === 'OK') {
          items.value = result.data
        }
      } catch (error) {
        console.error('Failed to load user cart:', error)
      }
    } else {
      const stored = localStorage.getItem(getGuestKey())
      if (stored) {
        try {
          items.value = JSON.parse(stored)
        } catch (e) {
          items.value = []
        }
      } else {
        items.value = []
      }
    }
  }

  // Save (Guest only)
  const saveToStorage = () => {
    if (!authStore.isAuthenticated) {
      localStorage.setItem(getGuestKey(), JSON.stringify(items.value))
    }
  }

  // Watch for user changes (Login/Logout)
  watch(() => authStore.user, async (newUser, oldUser) => {
    if (newUser) {
      // User logged in: Load user cart from DB (Do NOT sync/merge guest cart)
      await loadCart()
    } else {
      // User logged out: Switch to guest cart
      items.value = [] // Create empty cart for guest
      loadCart()
    }
  }, { immediate: true })

  // Getters
  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const grandTotal = computed(() => items.value.reduce((total, item) => total + item.price * item.quantity, 0))
  const subtotal = computed(() => items.value.filter(i => i.selected !== false).reduce((total, item) => total + item.price * item.quantity, 0))
  
  // Actions
  const addToCart = async (product, quantity = 1) => {
    if (authStore.isAuthenticated) {
        try {
            const result = await cartApi.addToCart(authStore.accessToken, { productId: product.id, quantity })
            if (result.status === 'OK') {
                items.value = result.data
                return true
            }
            return false
        } catch (error) {
            console.error("Add to cart API failed:", error)
            return false
        }
    } else {
        // Guest Logic
        const existingItem = items.value.find(item => item.id === product.id)
        
        // Check stock for guest (if product object has quantity info)
        const limit = product.quantity || 9999
        const currentQty = existingItem ? existingItem.quantity : 0
        
        if (currentQty + quantity > limit) {
             return false // Stock limit reached
        }

        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          items.value.push({
            id: product.id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            slug: product.slug,
            category: product.category_name || product.category || '',
            quantity: quantity,
            stock: product.quantity, // Save stock for guest cart validation
            selected: true 
          })
        }
        saveToStorage()
        return true
    }
  }

  const updateQuantity = async (id, delta) => {
    const item = items.value.find(i => i.id === id)
    if (!item) return false

    const newQuantity = item.quantity + delta
    if (newQuantity < 1) return false
    
    // Guest/Optimistic Stock Check
    if (item.stock && newQuantity > item.stock) {
        return false
    }

    if (authStore.isAuthenticated) {
        try {
            // Optimistic update
            const oldQuantity = item.quantity
            item.quantity = newQuantity
            
            await cartApi.updateItem(authStore.accessToken, { productId: id, quantity: newQuantity })
            // Success
            return true
        } catch (error) {
            console.error("Update quantity API failed:", error)
            item.quantity -= delta // revert on error
            return false
        }
    } else {
        item.quantity = newQuantity
        saveToStorage()
        return true
    }
  }

  const removeItem = async (id) => {
    if (authStore.isAuthenticated) {
        try {
             // Optimistic update
            const oldItems = [...items.value]
            items.value = items.value.filter(i => i.id !== id)
            
            await cartApi.removeItem(authStore.accessToken, { productId: id })
        } catch (error) {
            console.error("Remove item API failed:", error)
            // Revert logic needed if we want strict consistency, but usually fetchCart handles it
            await loadCart()
        }
    } else {
        items.value = items.value.filter(i => i.id !== id)
        saveToStorage()
    }
  }

  const clearCart = async () => {
    if (authStore.isAuthenticated) {
        try {
            items.value = []
            await cartApi.clearCart(authStore.accessToken)
        } catch (error) {
            console.error("Clear cart API failed:", error)
        }
    } else {
        items.value = []
        saveToStorage()
    }
  }

  // Frontend-only actions (Selection) - No need to sync select state to DB for now
  const removePurchasedItems = () => {
    // This is called after order success.
    // If DB, the backend might have already cleared ordered items? 
    // Usually order creation endpoint handles clearing cart.
    // But if we want to clean up manually:
    if (!authStore.isAuthenticated) {
         items.value = items.value.filter(item => item.selected === false)
         saveToStorage()
    } else {
        // Reload cart from DB (which should be empty if order logic cleared it)
        loadCart()
    }
  }

  const toggleSelection = (id) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.selected = !item.selected
      // Not saving selection to DB to keep it simple, but saving to local for guest
      if (!authStore.isAuthenticated) saveToStorage()
    }
  }

  const toggleAll = (checked) => {
    items.value.forEach(item => item.selected = checked)
    if (!authStore.isAuthenticated) saveToStorage()
  }

  const buyNow = async (product, quantity = 1) => {
    // Logic: Unselect all, add item, select item.
    // For DB: complicated. 
    // Simplified: Just add to cart and redirect to checkout with only this item selected?
    // Or just "Add to cart" + "Redirect".
    
    // 1. Unselect all
    items.value.forEach(item => item.selected = false)

    // 2. Add/Update item
    if (authStore.isAuthenticated) {
        await addToCart(product, quantity)
        // Re-find and select
        const item = items.value.find(i => i.id === product.id)
        if (item) item.selected = true
    } else {
         const existingItem = items.value.find(item => item.id === product.id)
        if (existingItem) {
            existingItem.quantity += quantity
            existingItem.selected = true
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                slug: product.slug,
                category: product.category_name,
                quantity: quantity,
                selected: true
            })
        }
        saveToStorage()
    }
  }

  return {
    items,
    totalItems,
    subtotal,
    grandTotal,
    loadCart,
    addToCart,
    buyNow,
    updateQuantity,
    removeItem,
    clearCart,
    removePurchasedItems,
    toggleSelection,
    toggleAll
  }
})
