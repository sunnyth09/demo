import { ref, onMounted, onBeforeUnmount } from 'vue'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad'
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

/**
 * Composable để tích hợp Cloudflare Turnstile CAPTCHA.
 * 
 * @param {string} containerId - ID của DOM element chứa widget
 * @param {object} options - Tùy chọn bổ sung
 * @param {string} options.theme - 'light' | 'dark' | 'auto' (default: 'auto')
 * @param {string} options.size - 'normal' | 'compact' (default: 'normal')
 * 
 * @returns {{ turnstileToken: Ref<string>, turnstileReady: Ref<boolean>, resetTurnstile: () => void }}
 */
export function useTurnstile(containerId, options = {}) {
  const turnstileToken = ref('')
  const turnstileReady = ref(false)
  let widgetId = null

  const { theme = 'auto', size = 'normal' } = options

  // Chờ window.turnstile sẵn sàng (polling)
  const waitForTurnstile = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
      if (window.turnstile) {
        resolve()
        return
      }

      const interval = 100
      let elapsed = 0
      const timer = setInterval(() => {
        elapsed += interval
        if (window.turnstile) {
          clearInterval(timer)
          resolve()
        } else if (elapsed >= timeout) {
          clearInterval(timer)
          reject(new Error('Turnstile script load timeout'))
        }
      }, interval)
    })
  }

  // Load Turnstile script nếu chưa có
  const loadScript = () => {
    // Script tag đã tồn tại
    const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')
    if (existing) {
      return waitForTurnstile()
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    document.head.appendChild(script)

    return waitForTurnstile()
  }

  // Render widget
  const renderWidget = () => {
    if (!window.turnstile || !SITE_KEY) return

    const container = document.getElementById(containerId)
    if (!container) return

    // Xóa widget cũ nếu có
    if (widgetId !== null) {
      try { window.turnstile.remove(widgetId) } catch (e) { /* ignore */ }
      widgetId = null
    }

    // Xóa nội dung cũ trong container (phòng trường hợp widget bị orphan)
    container.innerHTML = ''

    widgetId = window.turnstile.render(container, {
      sitekey: SITE_KEY,
      theme,
      size,
      callback: (token) => {
        turnstileToken.value = token
        turnstileReady.value = true
      },
      'expired-callback': () => {
        turnstileToken.value = ''
      },
      'error-callback': () => {
        turnstileToken.value = ''
      }
    })

    turnstileReady.value = true
  }

  // Reset widget (sau khi submit thất bại)
  const resetTurnstile = () => {
    turnstileToken.value = ''
    if (widgetId !== null && window.turnstile) {
      try { window.turnstile.reset(widgetId) } catch (e) { /* ignore */ }
    }
  }

  // Lấy token hiện tại (fallback khi callback không fire)
  const getToken = () => {
    if (turnstileToken.value) return turnstileToken.value
    if (widgetId !== null && window.turnstile) {
      try {
        const token = window.turnstile.getResponse(widgetId)
        if (token) {
          turnstileToken.value = token
        }
        return token || ''
      } catch (e) { /* ignore */ }
    }
    return ''
  }

  onMounted(async () => {
    if (!SITE_KEY) {
      console.warn('[Turnstile] VITE_TURNSTILE_SITE_KEY chưa được cấu hình.')
      turnstileReady.value = true
      return
    }

    try {
      await loadScript()
      renderWidget()
    } catch (err) {
      console.error('[Turnstile] Lỗi khi load script:', err)
      turnstileReady.value = true // Cho phép submit nếu script lỗi
    }
  })

  onBeforeUnmount(() => {
    if (widgetId !== null && window.turnstile) {
      try { window.turnstile.remove(widgetId) } catch (e) { /* ignore */ }
      widgetId = null
    }
  })

  return {
    turnstileToken,
    turnstileReady,
    resetTurnstile,
    getToken
  }
}
