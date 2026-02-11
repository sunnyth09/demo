<template>
  <AlertDialog :open="isOpen" @update:open="handleCancel">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ dialogTitle }}</AlertDialogTitle>
        <AlertDialogDescription>{{ dialogDescription }}</AlertDialogDescription>
      </AlertDialogHeader>

      <!-- Input field cho prompt mode -->
      <div v-if="dialogHasInput" class="px-6 pb-2">
        <textarea
          v-model="dialogInputValue"
          :placeholder="dialogInputPlaceholder"
          class="w-full h-24 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          @keydown.enter.ctrl="handleConfirm"
        ></textarea>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Hủy</AlertDialogCancel>
        <!-- Dùng button thường thay AlertDialogAction vì AlertDialogAction auto-close
             gây race condition: update:open(false) chạy TRƯỚC @click -->
        <button
          @click="handleConfirm"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
          :class="dialogActionClass || 'bg-red-100 text-red-600 hover:bg-red-200'"
        >
          {{ dialogActionLabel }}
        </button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const {
  isOpen, dialogTitle, dialogDescription,
  dialogActionLabel, dialogActionClass,
  dialogHasInput, dialogInputPlaceholder, dialogInputValue,
  handleConfirm, handleCancel,
} = useConfirmDialog()
</script>
