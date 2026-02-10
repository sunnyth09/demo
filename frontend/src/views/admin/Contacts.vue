<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý liên hệ</h2>
        <p class="text-muted-foreground">Xem và quản lý phản hồi từ khách hàng</p>
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

      <!-- Pagination (Simple implementation) -->
      <div v-if="pagination.totalPages > 1" class="p-4 border-t border-border flex justify-end gap-2">
        <button 
          @click="changePage(pagination.page - 1)" 
          :disabled="pagination.page <= 1"
          class="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50"
        >
          Trước
        </button>
        <span class="px-3 py-1 text-sm flex items-center">
          Trang {{ pagination.page }} / {{ pagination.totalPages }}
        </span>
        <button 
          @click="changePage(pagination.page + 1)" 
          :disabled="pagination.page >= pagination.totalPages"
          class="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50"
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
import { ref, onMounted } from 'vue';
import { contactApi } from '@/api/contact';
import { toast } from 'vue-sonner';

const contacts = ref([]);
const loading = ref(false);
const pagination = ref({
  page: 1,
  totalPages: 1
});

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
    const res = await contactApi.getAllContacts({ page, limit: 10 });
    if (res.status === 'success') {
      contacts.value = res.data;
      pagination.value = res.pagination;
    }
  } catch (error) {
    console.error(error);
    toast.error('Không thể tải danh sách liên hệ');
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchContacts(page);
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
      fetchContacts(pagination.value.page);
    }
  } catch (error) {
    console.error(error);
    toast.error('Gửi phản hồi thất bại');
  } finally {
    sendingReply.value = false;
  }
};

const deleteContact = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) return;

  try {
    const res = await contactApi.deleteContact(id);
    if (res.status === 'success') {
      toast.success('Xóa thành công');
      fetchContacts(pagination.value.page);
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
