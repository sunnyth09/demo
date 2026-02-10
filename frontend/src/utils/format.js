/**
 * Shared formatting utilities for Ocean Books
 */

/**
 * Format number to Vietnamese currency (VND)
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date string to Vietnamese locale
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  return new Date(dateString).toLocaleDateString('vi-VN', defaultOptions)
}

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
