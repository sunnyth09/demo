<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý liên hệ</h2>
        <p class="text-muted-foreground">Xem và quản lý phản hồi từ khách hàng</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
      <div class="w-full md:w-72 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm tên, email hoặc tiêu đề..." 
          class="w-full h-10 pl-10 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          @input="debouncedSearch"
        />
        <button v-if="searchQuery" @click="searchQuery = ''; fetchContacts(1)" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">✕</button>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          <select 
            v-model="filterStatus"
            @change="fetchContacts(1)"
            class="h-10 pl-9 pr-8 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none text-sm font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="replied">Đã phản hồi</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
      <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Người gửi</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Tiêu đề</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Nội dung</th>
            <th class="text-left p-4 font-medium text-sm whitespace-nowrap">Ngày gửi</th>
            <th class="text-right p-4 font-medium text-sm whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact.id" class="border-t border-border hover:bg-muted/50 transition-colors">
            <td class="p-4 align-top">
              <div class="font-medium">{{ contact.name }}</div>
              <div class="text-sm text-muted-foreground">{{ contact.email }}</div>
              <div class="mt-1">
                <span v-if="contact.status === 'replied'" class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-green-500 bg-green-50 border-green-200">
                  Đã phản hồi
                </span>
                <span v-else class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-yellow-500 bg-yellow-50 border-yellow-200">
                  Chờ xử lý
                </span>
              </div>
            </td>
            <td class="p-4 align-top font-medium text-sm">{{ contact.subject }}</td>
            <td class="p-4 align-top text-sm text-muted-foreground whitespace-pre-wrap">{{ contact.message }}</td>
            <td class="p-4 align-top text-sm text-muted-foreground whitespace-nowrap">{{ formatDate(contact.created_at || contact.createdAt) }}</td>
            <td class="p-4 align-top text-right">
              <button 
                v-if="contact.status !== 'replied'"
                @click="openReplyModal(contact)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-blue-50 text-blue-500 transition-colors"
                title="Phản hồi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="m3 7 9 6 9-6"/></svg>
              </button>
              <button 
                @click="deleteContact(contact.id)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-50 text-red-500 transition-colors ml-1"
                title="Xóa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="contacts.length === 0" class="border-t border-border">
            <td colspan="5" class="p-8 text-center text-muted-foreground">
              Chưa có liên hệ nào.
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalContacts > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị {{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, totalContacts) }} trong tổng số {{ totalContacts }} liên hệ
      </p>
      <div class="flex items-center gap-1">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trước
        </button>
        <template v-for="p in displayedPages" :key="p">
          <span v-if="p === '...'" class="px-2 text-muted-foreground">...</span>
          <button
            v-else
            @click="goToPage(p)"
            :class="[
              'w-9 h-9 text-sm rounded-lg transition-colors',
              p === currentPage 
                ? 'bg-primary text-primary-foreground font-bold' 
                : 'hover:bg-muted border'
            ]"
          >
            {{ p }}
          </button>
        </template>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
        </button>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="showReplyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-background w-full max-w-lg rounded-xl shadow-lg border p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Phản hồi khách hàng</h3>
          <button @click="closeReplyModal" class="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium">Người nhận:</label>
            <div class="text-sm text-muted-foreground">{{ replyingContact?.name }} ({{ replyingContact?.email }})</div>
          </div>
          <div>
            <label class="text-sm font-medium">Tiêu đề gốc:</label>
            <div class="text-sm text-muted-foreground">{{ replyingContact?.subject }}</div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium">Nội dung phản hồi:</label>
            <textarea 
              v-model="replyMessage"
              rows="6"
              class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nhập nội dung phản hồi..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button 
            @click="closeReplyModal"
            class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-muted transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="sendReply"
            :disabled="sendingReply || !replyMessage.trim()"
            class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="sendingReply">Đang gửi...</span>
            <span v-else>Gửi phản hồi</span>
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { contactApi } from '@/api/contact';
import { toast } from 'vue-sonner';
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { confirm } = useConfirmDialog()
const contacts = ref([]);
const loading = ref(false);

// Search & Pagination
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalContacts = ref(0)
const limit = 10

let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchContacts(1)
  }, 300)
}

const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchContacts(page)
}

// Reply State
const showReplyModal = ref(false);
const replyingContact = ref(null);
const replyMessage = ref('');
const sendingReply = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN');
};

const fetchContacts = async (page = 1) => {
  try {
    loading.value = true;
    const params = { page, limit, search: searchQuery.value }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    const res = await contactApi.getAllContacts(params);
    if (res.status === 'success') {
      contacts.value = res.data;
      if (res.pagination) {
        currentPage.value = res.pagination.page
        totalPages.value = res.pagination.totalPages
        totalContacts.value = res.pagination.total
      }
    }
  } catch (error) {
    console.error(error);
    toast.error('Không thể tải danh sách liên hệ');
  } finally {
    loading.value = false;
  }
};

const openReplyModal = (contact) => {
  replyingContact.value = contact;
  replyMessage.value = '';
  showReplyModal.value = true;
};

const closeReplyModal = () => {
  showReplyModal.value = false;
  replyingContact.value = null;
  replyMessage.value = '';
};

const sendReply = async () => {
  if (!replyingContact.value || !replyMessage.value.trim()) return;

  try {
    sendingReply.value = true;
    const res = await contactApi.replyContact(replyingContact.value.id, {
      message: replyMessage.value
    });

    if (res.status === 'success') {
      toast.success('Đã gửi phản hồi thành công');
      closeReplyModal();
      fetchContacts(currentPage.value);
    }
  } catch (error) {
    console.error(error);
    toast.error('Gửi phản hồi thất bại');
  } finally {
    sendingReply.value = false;
  }
};

const deleteContact = async (id) => {
  const ok = await confirm('Xóa liên hệ', 'Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.', { actionLabel: 'Xóa vĩnh viễn', actionClass: 'bg-red-100 text-red-600 hover:bg-red-200' })
  if (!ok) return

  try {
    const res = await contactApi.deleteContact(id);
    if (res.status === 'success') {
      toast.success('Xóa thành công');
      fetchContacts(currentPage.value);
    }
  } catch (error) {
    console.error(error);
    toast.error('Có lỗi xảy ra khi xóa');
  }
};

onMounted(() => {
  fetchContacts();
});
</script>
