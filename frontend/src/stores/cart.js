import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const authStore = useAuthStore()
  
  // Helper to get storage key
  const getStorageKey = () => {
    return authStore.user ? `cart_items_user_${authStore.user.id}` : 'cart_items_guest'
  }

  // Load cart from storage
  const loadCart = () => {
    const key = getStorageKey()
    const stored = localStorage.getItem(key)
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

  // Persist to localStorage
  const saveToStorage = () => {
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(items.value))
  }

  // Watch for user changes (Login/Logout)
  watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser) {
      // User logged in: Merge guest cart to user cart
      const guestKey = 'cart_items_guest'
      const guestItemsStr = localStorage.getItem(guestKey)
      
      // Load user cart first
      const userKey = `cart_items_user_${newUser.id}`
      const userItemsStr = localStorage.getItem(userKey)
      let userItems = userItemsStr ? JSON.parse(userItemsStr) : []

      if (guestItemsStr) {
        const guestItems = JSON.parse(guestItemsStr)
        // Merge strategy: Add guest items to user cart
        guestItems.forEach(gItem => {
          const existing = userItems.find(uItem => uItem.id === gItem.id)
          if (existing) {
            existing.quantity += gItem.quantity
          } else {
            userItems.push(gItem)
          }
        })
        
        // Clear guest cart
        localStorage.removeItem(guestKey)
      }
      
      // Set current items to merged user items
      items.value = userItems
      saveToStorage() // Save merged state to user key
    } else {
      // User logged out: Switch to guest cart (empty or previous)
      loadCart()
    }
  }, { immediate: true })

  // Getters
  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  // Subtotal of ALL items (optional, maybe for display)
  const grandTotal = computed(() => items.value.reduce((total, item) => total + item.price * item.quantity, 0))
  // Subtotal of SELECTED items (for checkout)
  const subtotal = computed(() => items.value.filter(i => i.selected !== false).reduce((total, item) => total + item.price * item.quantity, 0))
  
  // Actions
  const addToCart = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        slug: product.slug,
        category: product.category_name,
        quantity: quantity,
        selected: true // Default selected
      })
    }
    saveToStorage()
  }

  const updateQuantity = (id, delta) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta)
      saveToStorage()
    }
  }

  const removeItem = (id) => {
    items.value = items.value.filter(i => i.id !== id)
    saveToStorage()
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const removePurchasedItems = () => {
    // Keep only unselected items
    items.value = items.value.filter(item => item.selected === false)
    saveToStorage()
  }

  // Selection Actions
  const toggleSelection = (id) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }

  const toggleAll = (checked) => {
    items.value.forEach(item => item.selected = checked)
    saveToStorage()
  }

  const buyNow = (product, quantity = 1) => {
    // 1. Unselect all existing items
    items.value.forEach(item => item.selected = false)

    // 2. Add or update the target item
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.selected = true // Select this item
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        slug: product.slug,
        category: product.category_name,
        quantity: quantity,
        selected: true // Select this item
      })
    }
    saveToStorage()
  }

  return {
    items,
    totalItems,
    subtotal,
    grandTotal,
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
