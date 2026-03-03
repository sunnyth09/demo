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
/**
 * Normalizes image URL to ensure it works across different hostnames
 * by converting old absolute URLs (containing IPs) into relative paths.
 */
export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/100';
  
  // If it's a relative path starting with /minio, return as is
  if (url.startsWith('/minio')) return url;
  
  // If it's another local path starting with / or a base64 string, return as is
  if (url.startsWith('/') || url.startsWith('data:')) return url;
  
  // If it's an absolute URL, try to extract the pathname
  if (url.startsWith('http')) {
    try {
      const parsedUrl = new URL(url);
      // Only modify minio URLs
      if (parsedUrl.pathname.startsWith('/minio')) {
        return parsedUrl.pathname;
      }
    } catch (e) {
      // Ignore URL parse error
    }
    return url; // External HTTP links (like unsplash placeholders)
  }
  
  // If we reach here, it's likely a raw filename stored in DB (e.g. "1771813518...webp")
  return `/minio/products/${url}`;
}
