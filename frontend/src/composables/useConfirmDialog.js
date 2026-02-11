import { ref } from 'vue'

const isOpen = ref(false)
const dialogTitle = ref('')
const dialogDescription = ref('')
const dialogActionLabel = ref('Xác nhận')
const dialogActionClass = ref('')
const dialogHasInput = ref(false)
const dialogInputPlaceholder = ref('')
const dialogInputValue = ref('')

let resolvePromise = null

/**
 * Composable thay thế confirm() và prompt() gốc bằng AlertDialog
 * 
 * Sử dụng:
 *   const { confirm, prompt } = useConfirmDialog()
 *   
 *   // Thay confirm() gốc:
 *   const ok = await confirm('Xác nhận xóa', 'Bạn có chắc muốn xóa?')
 *   if (ok) { ... }
 *   
 *   // Thay prompt() gốc:
 *   const reason = await prompt('Báo cáo', 'Nhập lý do báo cáo')
 *   if (reason) { ... }
 */
export function useConfirmDialog() {
  
  function confirm(title, description, options = {}) {
    dialogTitle.value = title
    dialogDescription.value = description
    dialogActionLabel.value = options.actionLabel || 'Xác nhận'
    dialogActionClass.value = options.actionClass || 'bg-red-100 text-red-600 hover:bg-red-200'
    dialogHasInput.value = false
    dialogInputValue.value = ''
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function prompt(title, description, options = {}) {
    dialogTitle.value = title
    dialogDescription.value = description
    dialogActionLabel.value = options.actionLabel || 'Gửi'
    dialogActionClass.value = options.actionClass || ''
    dialogHasInput.value = true
    dialogInputPlaceholder.value = options.placeholder || 'Nhập nội dung...'
    dialogInputValue.value = ''
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function handleConfirm() {
    const resolve = resolvePromise
    resolvePromise = null
    isOpen.value = false
    if (resolve) {
      resolve(dialogHasInput.value ? dialogInputValue.value : true)
    }
  }

  function handleCancel() {
    const resolve = resolvePromise
    resolvePromise = null
    isOpen.value = false
    dialogInputValue.value = ''
    if (resolve) {
      resolve(dialogHasInput.value ? null : false)
    }
  }

  return {
    // State (dùng trong ConfirmDialog component)
    isOpen,
    dialogTitle,
    dialogDescription,
    dialogActionLabel,
    dialogActionClass,
    dialogHasInput,
    dialogInputPlaceholder,
    dialogInputValue,
    handleConfirm,
    handleCancel,
    // API chính
    confirm,
    prompt,
  }
}
