<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="p-6 border-b border-gray-100 flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800">Quản lý Đánh giá & Bình luận</h2>
      <div>
        <input 
          v-model="search" 
          placeholder="Tìm kiếm đánh giá..." 
          class="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm">
            <th class="p-4 border-b">ID</th>
            <th class="p-4 border-b">Người dùng</th>
            <th class="p-4 border-b">Sản phẩm</th>
            <th class="p-4 border-b">Đánh giá</th>
            <th class="p-4 border-b">Nội dung</th>
            <th class="p-4 border-b">Ngày tạo</th>
            <th class="p-4 border-b">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="filteredReviews.length === 0">
            <td colspan="7" class="p-8 text-center text-gray-500">Không tìm thấy đánh giá nào</td>
          </tr>
          <tr v-for="review in filteredReviews" :key="review.id" class="hover:bg-gray-50 text-sm">
            <td class="p-4 border-b text-gray-500">#{{ review.id }}</td>
            <td class="p-4 border-b font-medium text-gray-900">
              {{ review.user?.name || 'Unknown' }}
              <div class="text-xs text-gray-500">{{ review.user?.email }}</div>
            </td>
            <td class="p-4 border-b text-blue-600">
              <router-link :to="`/san-pham/${review.product?.slug || review.product?.id}`" target="_blank">
                {{ review.product?.name || 'Sản phẩm đã xóa' }}
              </router-link>
            </td>
            <td class="p-4 border-b">
              <div class="flex text-yellow-400">
                <span v-for="n in 5" :key="n">{{ n <= review.rating ? '★' : '☆' }}</span>
              </div>
            </td>
            <td class="p-4 border-b max-w-xs truncate" :title="review.comment">
              {{ review.comment }}
            </td>
            <td class="p-4 border-b text-gray-500">
              {{ formatReviewDate(review.created_at) }}
            </td>
            <td class="p-4 border-b">
              <div class="flex flex-col gap-2">
                <div class="relative w-fit">
                  <select 
                    :value="review.is_hidden" 
                    @change="handleStatusChange(review, $event)"
                    class="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold border outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all"
                    :class="review.is_hidden 
                      ? 'bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-200' 
                      : 'bg-green-50 text-green-700 border-green-200 focus:ring-green-200'"
                  >
                    <option :value="false">● Đang hiện</option>
                    <option :value="true">⊘ Đang ẩn</option>
                    <option value="DELETE" class="text-red-600 font-bold">🗑 Xóa vĩnh viễn</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" :class="review.is_hidden ? 'text-gray-500' : 'text-green-600'">
                    <svg class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { formatDate } from '@/utils/format';
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;
const { confirm } = useConfirmDialog()
const reviews = ref([]);
const loading = ref(false);
const search = ref('');

const filteredReviews = computed(() => {
  if (!search.value) return reviews.value;
  const s = search.value.toLowerCase();
  return reviews.value.filter(r => 
    r.user?.name?.toLowerCase().includes(s) || 
    r.comment.toLowerCase().includes(s) || 
    r.product?.name?.toLowerCase().includes(s)
  );
});

const formatReviewDate = (dateString) => {
  return formatDate(dateString);
};

const fetchReviews = async () => {
  loading.value = true;
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.status) {
      reviews.value = json.data;
    }
  } catch (error) {
    console.error('Lỗi tải đánh giá:', error);
  } finally {
    loading.value = false;
  }
};

const handleStatusChange = async (review, event) => {
  const newValue = event.target.value;
  
  // Case: Delete
  if (newValue === 'DELETE') {
    deleteReview(review.id);
    // Reset select to previous value (visually) until delete confirms
    // This is tricky with v-model binding directly to is_hidden which is boolean.
    // We just trigger the dialog.
    return;
  }

  // Case: Status toggle
  // Convert string "true"/"false" from Select to boolean
  const boolValue = newValue === 'true';
  
  // Only call API if value actually changed (it should be, if generated from select)
  if (boolValue !== review.is_hidden) {
    await toggleVisibility(review);
  }
};

const toggleVisibility = async (review) => {
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${review.id}/visibility`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      review.is_hidden = data.data.is_hidden;
      toast.success('Cập nhật trạng thái thành công');
    } else {
      toast.error('Lỗi khi cập nhật trạng thái');
      // Revert if failed (optional, complex with select binding)
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteReview = async (id) => {
  const ok = await confirm('Xóa đánh giá', 'Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn? Hành động này không thể hoàn tác.', { actionLabel: 'Xóa vĩnh viễn' })
  if (!ok) return
  
  try {
    const token = authStore.accessToken;
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      toast.success('Đã xóa đánh giá');
      await fetchReviews();
    } else {
      toast.error('Lỗi khi xóa');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchReviews();
});
</script>
