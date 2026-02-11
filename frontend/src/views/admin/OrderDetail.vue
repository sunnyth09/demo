<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/admin/orders"
        class="p-2 rounded-full hover:bg-accent transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </router-link>
      <div>
        <h2 class="text-2xl font-bold">
          Chi tiết đơn hàng #{{
            order?.order_code
              ? order.order_code.slice(0, 8).toUpperCase()
              : order?.id
          }}
        </h2>
        <p class="text-muted-foreground">{{ formatDate(order?.createdAt) }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-muted-foreground">
      Đang tải...
    </div>

    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Tracking + Update -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tracking Timeline -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-6">Trạng thái vận chuyển</h3>

          <!-- Horizontal Timeline (5 main steps) -->
          <div v-if="order.status !== 'cancelled'" class="mb-8">
            <div class="relative">
              <!-- Progress Bar Background -->
              <div
                class="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"
              ></div>

              <!-- Active Progress Bar -->
              <div
                class="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
                :style="{ width: mainProgress + '%' }"
              ></div>

              <!-- Steps -->
              <div class="flex justify-between relative">
                <div
                  v-for="(step, index) in mainSteps"
                  :key="index"
                  class="flex flex-col items-center"
                >
                  <div
                    class="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10"
                    :class="getMainStepClass(index)"
                  >
                    <!-- Icon for each step -->
                    <!-- Step 1: Đặt hàng - Clipboard -->
                    <svg
                      v-if="index === 0"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                      />
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    </svg>
                    <!-- Step 2: Xác nhận - Dollar/Payment -->
                    <svg
                      v-else-if="index === 1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    <!-- Step 3: Đã giao ĐVVC - Truck -->
                    <svg
                      v-else-if="index === 2"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"
                      />
                      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                      <circle cx="7" cy="18" r="2" />
                      <circle cx="17" cy="18" r="2" />
                    </svg>
                    <!-- Step 4: Đang giao - Package -->
                    <svg
                      v-else-if="index === 3"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                      />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                    <!-- Step 5: Hoàn thành - Star -->
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-xs font-medium mt-2 text-center max-w-[80px]"
                    :class="
                      index <= mainStepIndex
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    "
                  >
                    {{ step.label }}
                  </span>
                  <span
                    v-if="step.time"
                    class="text-[10px] text-muted-foreground"
                    >{{ step.time }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Cancelled State -->
          <div
            v-else
            class="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700"
          >
            <div
              class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"
            >
              <span class="text-xl">✕</span>
            </div>
            <div>
              <h4 class="font-bold">Đơn hàng đã bị hủy</h4>
              <p class="text-sm opacity-90">
                {{ formatDateTime(order.cancelled_at) }}
              </p>
              <p v-if="order.cancel_reason" class="text-sm mt-1 italic">
                Lý do: "{{ order.cancel_reason }}"
              </p>
            </div>
          </div>

          <!-- Vertical Timeline (Detail History) -->
          <div class="border-t pt-6">
            <h4 class="font-medium mb-4">Lịch sử cập nhật</h4>
            <div class="space-y-0">
              <div
                v-for="(event, index) in statusHistory"
                :key="index"
                class="flex gap-4"
              >
                <div class="flex flex-col items-center">
                  <div
                    class="w-3 h-3 rounded-full shrink-0"
                    :class="index === 0 ? 'bg-primary' : 'bg-gray-300'"
                  ></div>
                  <div
                    v-if="index < statusHistory.length - 1"
                    class="w-0.5 h-12 bg-gray-200"
                  ></div>
                </div>
                <div class="pb-6">
                  <p
                    class="text-sm font-medium"
                    :class="index === 0 ? 'text-primary' : 'text-gray-700'"
                  >
                    {{ event.label }}
                  </p>
                  <p class="text-xs text-muted-foreground">{{ event.time }}</p>
                  <p
                    v-if="event.description"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ event.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Update Status -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-4">Cập nhật trạng thái</h3>
          <div class="flex flex-wrap gap-4 items-end">
            <!-- Cancellation Request Logic -->
             <div v-if="order.status === 'request_cancel'" class="w-full mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 class="font-bold text-orange-800 flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Yêu cầu hủy đơn hàng
                </h4>
                <p class="text-sm text-orange-700 mb-2">
                  Khách hàng muốn hủy đơn này. Lý do: <strong>{{ order.cancel_reason || 'Không có lý do' }}</strong>
                </p>
                
                <!-- Warning for PAID orders -->
                <div v-if="order.payment_status === 'paid'" class="mb-3 p-3 bg-red-100 text-red-700 rounded border border-red-200 text-sm">
                   <strong>Lưu ý:</strong> Đơn hàng đã thanh toán. Vui lòng <strong>hoàn tiền thủ công</strong> cho khách trước khi duyệt hủy.
                </div>

                <div class="flex gap-2 mt-3">
                  <button 
                     @click="approveCancel" 
                     class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                     Duyệt hủy đơn {{ order.payment_status === 'paid' ? '(Đã hoàn tiền)' : '' }}
                  </button>
                  <button 
                     @click="rejectCancel" 
                     class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                     Từ chối hủy
                  </button>
                </div>
             </div>

            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium mb-2"
                >Trạng thái mới</label
              >
              <select
                v-model="newStatus"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="
                  order.status === 'delivered' || order.status === 'cancelled'
                "
              >
                <option value="request_cancel" disabled>Đang yêu cầu hủy</option>
                <option
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <button
              @click="updateOrderStatus"
              :disabled="
                updating ||
                newStatus === order.status ||
                order.status === 'delivered'
              "
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updating ? "Đang cập nhật..." : "Xác nhận" }}
            </button>
          </div>
          <p
            v-if="order.status === 'delivered'"
            class="text-sm text-green-600 mt-3"
          >
            Đơn hàng đã hoàn thành, không thể thay đổi trạng thái.
          </p>
          <p
            v-if="order.status === 'cancelled'"
            class="text-sm text-red-600 mt-3"
          >
            Đơn hàng đã bị hủy.
          </p>
        </div>

        <!-- Order Items -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-4">
            Sản phẩm ({{ order.items?.length || 0 }})
          </h3>
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-4 p-3 border rounded-lg"
            >
              <div
                class="w-16 h-16 bg-gray-100 rounded-md shrink-0 overflow-hidden"
              >
                <img
                  v-if="item.product?.thumbnail"
                  :src="item.product.thumbnail"
                  :alt="item.product_name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400 text-2xl"
                >
                  📦
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ item.product_name }}</p>
                <p class="text-sm text-muted-foreground">
                  x{{ item.quantity }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-muted-foreground">
                  {{ formatCurrency(item.price) }}
                </p>
                <p class="font-bold text-primary">
                  {{ formatCurrency(item.total_price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Info -->
      <div class="space-y-6">
        <!-- Customer Info -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-4">Thông tin khách hàng</h3>
          <div class="space-y-3 text-sm">
            <div>
              <span class="text-muted-foreground">Người nhận:</span>
              <p class="font-medium">{{ order.customer_name }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Số điện thoại:</span>
              <p class="font-medium">{{ order.customer_phone }}</p>
            </div>
            <div v-if="order.customer_email">
              <span class="text-muted-foreground">Email:</span>
              <p class="font-medium">{{ order.customer_email }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Địa chỉ:</span>
              <p class="font-medium">{{ order.shipping_address }}</p>
            </div>
            <div v-if="order.note">
              <span class="text-muted-foreground">Ghi chú:</span>
              <p
                class="font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded mt-1"
              >
                {{ order.note }}
              </p>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-4">Thanh toán</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Phương thức:</span>
              <span class="font-medium uppercase">{{
                order.payment_method
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Trạng thái:</span>
              <span
                :class="
                  order.payment_status === 'paid'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                "
                class="font-medium"
              >
                {{
                  order.payment_status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"
                }}
              </span>
            </div>
            <div class="border-t pt-3 mt-3">
              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span class="text-primary">{{
                  formatCurrency(order.total_amount)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-card rounded-xl border p-6">
          <h3 class="text-lg font-bold mb-4">Thao tác</h3>
          <div class="space-y-3">
            <button
              v-if="
                order.status !== 'delivered' && order.status !== 'cancelled'
              "
              @click="cancelOrder"
              class="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Hủy đơn hàng
            </button>
            <button
              @click="printOrder"
              class="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              In đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">Không tìm thấy đơn hàng</p>
      <router-link
        to="/admin/orders"
        class="text-primary hover:underline mt-2 inline-block"
        >Quay lại danh sách</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;
const { confirm } = useConfirmDialog()

const order = ref(null);
const loading = ref(true);
const updating = ref(false);
const newStatus = ref("");

const statusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "packing", label: "Đang đóng gói" },
  { value: "picked_up", label: "Đã giao ĐVVC" },
  { value: "in_transit", label: "Đang vận chuyển" },
  { value: "arrived_hub", label: "Đã đến kho" },
  { value: "out_for_delivery", label: "Đang giao hàng" },
  { value: "delivered", label: "Giao thành công" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "request_cancel", label: "Đang yêu cầu hủy" },

];

// Main timeline steps (5 steps)
const mainSteps = computed(() => {
  if (!order.value) return [];
  const o = order.value;
  return [
    { key: "pending", label: "Đặt hàng", time: formatTime(o.createdAt) },
    { key: "confirmed", label: "Xác nhận", time: formatTime(o.confirmed_at) },
    {
      key: "picked_up",
      label: "Đã giao ĐVVC",
      time: formatTime(o.picked_up_at),
    },
    {
      key: "out_for_delivery",
      label: "Đang giao",
      time: formatTime(o.out_for_delivery_at),
    },
    { key: "delivered", label: "Hoàn thành", time: formatTime(o.delivered_at) },
  ];
});

const mainStepIndex = computed(() => {
  if (!order.value) return 0;
  const status = order.value.status;
  const map = {
    pending: 0,
    confirmed: 1,
    packing: 1,
    picked_up: 2,
    in_transit: 2,
    arrived_hub: 2,
    out_for_delivery: 3,
    delivered: 4,
    // Legacy
    processing: 1,
    shipped: 3,
    completed: 4,
  };
  return map[status] ?? 0;
});

const mainProgress = computed(() => {
  return (mainStepIndex.value / 4) * 100;
});

// Vertical timeline - status history
const statusHistory = computed(() => {
  if (!order.value) return [];
  const o = order.value;
  const history = [];

  const statusMap = [
    {
      key: "delivered",
      field: "delivered_at",
      label: "Giao hàng thành công",
      desc: "Đơn hàng đã được giao đến bạn",
    },
    {
      key: "out_for_delivery",
      field: "out_for_delivery_at",
      label: "Đang giao hàng",
      desc: "Shipper đang trên đường giao đến bạn",
    },
    {
      key: "arrived_hub",
      field: "arrived_hub_at",
      label: "Đã đến kho",
      desc: "Đơn hàng đã đến kho gần địa chỉ của bạn",
    },
    {
      key: "in_transit",
      field: "in_transit_at",
      label: "Đang vận chuyển",
      desc: "Đơn hàng đang trên đường vận chuyển",
    },
    {
      key: "picked_up",
      field: "picked_up_at",
      label: "Đã giao cho đơn vị vận chuyển",
      desc: "Đơn hàng đã được giao cho đơn vị vận chuyển",
    },
    {
      key: "packing",
      field: "packing_at",
      label: "Đang đóng gói",
      desc: "Shop đang chuẩn bị đơn hàng của bạn",
    },
    {
      key: "confirmed",
      field: "confirmed_at",
      label: "Đã xác nhận",
      desc: "Shop đã xác nhận đơn hàng",
    },
    {
      key: "pending",
      field: "createdAt",
      label: "Đặt hàng thành công",
      desc: "Đơn hàng đã được tạo",
    },
  ];

  // Add cancelled if applicable
  if (o.cancelled_at) {
    history.push({
      label: "Đã hủy đơn hàng",
      time: formatDateTime(o.cancelled_at),
      description: "Đơn hàng đã bị hủy",
    });
  }

  statusMap.forEach((item) => {
    if (o[item.field]) {
      history.push({
        label: item.label,
        time: formatDateTime(o[item.field]),
        description: item.desc,
      });
    }
  });

  return history;
});

const getMainStepClass = (index) => {
  if (index < mainStepIndex.value)
    return "border-primary bg-primary text-white";
  if (index === mainStepIndex.value)
    return "border-primary bg-white text-primary ring-4 ring-primary/20";
  return "border-gray-200 bg-white text-gray-400";
};

const fetchOrder = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_URL}/orders/admin/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    const json = await res.json();
    if (json.status) {
      order.value = json.data;
      newStatus.value = json.data.status;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async () => {
  if (!newStatus.value || newStatus.value === order.value.status) return;

  updating.value = true;
  try {
    const res = await fetch(
      `${API_URL}/orders/admin/${order.value.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus.value }),
      },
    );
    const json = await res.json();
    if (json.status) {
      await fetchOrder(); // Refresh
      toast.success("Cập nhật trạng thái thành công!");
    } else {
      toast.error(json.message || "Có lỗi xảy ra");
    }
  } catch (e) {
    toast.error("Có lỗi xảy ra");
  } finally {
    updating.value = false;
  }
};

const cancelOrder = async () => {
  const ok = await confirm('Hủy đơn hàng', 'Bạn có chắc muốn xóa/hủy đơn hàng này?', { actionLabel: 'Xác nhận hủy' })
  if (!ok) return
  newStatus.value = "cancelled";
  await updateOrderStatus();
};

const approveCancel = async () => {
   const ok = await confirm('Duyệt hủy đơn', 'Xác nhận duyệt hủy đơn hàng này? Kiểm tra kỹ nếu cần hoàn tiền.', { actionLabel: 'Duyệt hủy' });
   if (!ok) return;
   newStatus.value = 'cancelled';
   await updateOrderStatus();
}

const rejectCancel = async () => {
   const ok = await confirm('Từ chối hủy', 'Từ chối hủy đơn hàng? Trạng thái sẽ trở về "Chờ xác nhận".', { actionLabel: 'Từ chối' });
   if (!ok) return;
   newStatus.value = 'pending';
   await updateOrderStatus();
}

const printOrder = () => {
  window.print();
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "";
const formatTime = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
};

onMounted(fetchOrder);
</script>
