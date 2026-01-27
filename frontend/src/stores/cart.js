import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Initialize from localStorage
  if (localStorage.getItem('cart_items')) {
    try {
      items.value = JSON.parse(localStorage.getItem('cart_items'))
    } catch (e) {
      items.value = []
    }
  }

  // Persist to localStorage
  const saveToStorage = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }

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

  return {
    items,
    totalItems,
    subtotal,
    grandTotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toggleSelection,
    toggleAll
  }
})
