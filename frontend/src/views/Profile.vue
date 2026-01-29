<template>
  <div class="container mx-auto px-4 py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <div class="md:col-span-1">
        <div class="bg-card rounded-xl border p-6 text-center mb-6">
          <div class="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl mx-auto mb-4 font-bold">
            {{ userInitial }}
          </div>
          <h2 class="font-bold text-lg">{{ authStore.user?.name || 'Người dùng' }}</h2>
          <p class="text-sm text-muted-foreground">{{ authStore.user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}</p>
        </div>

        <nav class="bg-card rounded-xl border overflow-hidden">
          <button 
            @click="navigateToTab('profile')" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'profile' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Thông tin tại khoản
          </button>
          <button 
            @click="navigateToTab('orders')" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'orders' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
            Đơn hàng của tôi
          </button>
          <button 
            @click="activeTab = 'wishlist'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'wishlist' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Sản phẩm yêu thích
          </button>
          <button 
            @click="activeTab = 'address'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'address' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Sổ địa chỉ
          </button>
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2 border-transparent hover:bg-muted/50 text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Quản trị Admin
          </router-link>
          <button 
            @click="handleLogout" 
            class="flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2 border-transparent hover:bg-destructive/10 text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Đăng xuất
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-3 space-y-6">
        <!-- Profile Info -->
        <div v-if="activeTab === 'profile'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Thông tin cá nhân</h2>
            <button @click="openProfileModal" class="text-sm text-primary hover:underline">Chỉnh sửa</button>
          </div>
          <div class="grid sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Họ và tên</p>
              <p class="font-medium">{{ authStore.user?.name || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Email</p>
              <p class="font-medium">{{ authStore.user?.email || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Số điện thoại</p>
              <p class="font-medium">{{ authStore.user?.phone || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Vai trò</p>
              <p class="font-medium">
                <span v-if="authStore.user?.role === 'admin'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                  Quản trị viên
                </span>
                <span v-else class="text-muted-foreground">Thành viên</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Ngày tạo tài khoản</p>
              <p class="font-medium">{{ formatDate(authStore.user?.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div v-if="activeTab === 'profile' || activeTab === 'orders'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">{{ activeTab === 'orders' ? 'Tất cả đơn hàng' : 'Đơn hàng gần đây' }}</h2>
            <a v-if="activeTab === 'profile'" href="#" @click.prevent="activeTab = 'orders'" class="text-sm text-primary hover:underline">Xem tất cả</a>
          </div>
          <div v-if="recentOrders.length > 0" class="space-y-4">
            <router-link v-for="order in recentOrders" :key="order.id" :to="`/orders/${order.id}`" class="border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white group block">
              <div class="flex items-center gap-6">
                <!-- Col 1: Basic Info -->
                <div class="w-[200px] shrink-0">
                   <div class="flex items-center gap-2 mb-1">
                      <span class="font-mono font-bold text-lg text-gray-900 group-hover:text-primary transition-colors" :title="order.order_code">#{{ order.order_code ? order.order_code.slice(0, 8).toUpperCase() : order.id }}</span>
                   </div>
                   <p class="text-sm text-muted-foreground mb-1">{{ order.date }}</p>
                   <p class="text-sm font-medium text-gray-500">{{ order.itemsCount }} sản phẩm</p>
                </div>

                <!-- Col 2: Status Message (Center) -->
                <div class="flex-1 px-4 flex justify-center">
                   <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 max-w-sm">
                      <component :is="getStatusIcon(order.status)" :class="['w-5 h-5', getStatusColor(order.status)]" />
                      <span class="text-sm font-medium text-gray-700 line-clamp-1 truncate" :title="getStatusMessage(order.status)">
                        {{ getStatusMessage(order.status) }}
                      </span>
                   </div>
                </div>

                <!-- Col 3: Status & Price & Action -->
                <div class="w-[180px] shrink-0 text-right flex flex-col items-end gap-2">
                   <span :class="['px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset', getStatusClass(order.status)]">
                     {{ getStatusLabel(order.status) }}
                   </span>
                   <p class="font-bold text-primary text-xl">{{ formatCurrency(order.total_amount) }}</p>
                   
                   <button 
                    v-if="order.status === 'cancelled'"
                    @click.prevent="repurchase(order)"
                    class="mt-1 text-xs px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                   >
                    Mua lại
                  </button>
                </div>
              </div>
            </router-link>
          </div>
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
            <p class="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
            <router-link to="/" class="inline-block mt-4 text-primary hover:underline">Mua sắm ngay</router-link>
          </div>
        </div>

        <!-- Wishlist -->
        <div v-if="activeTab === 'wishlist'" class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-bold mb-6">Sản phẩm yêu thích</h2>
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <p class="text-muted-foreground">Chưa có sản phẩm yêu thích</p>
            <router-link to="/" class="inline-block mt-4 text-primary hover:underline">Khám phá sản phẩm</router-link>
          </div>
        </div>

        <!-- Address Book -->
        <div v-if="activeTab === 'address'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Sổ địa chỉ</h2>
            <button 
              @click="openAddAddressModal"
              class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Thêm địa chỉ mới
            </button>
          </div>
          <div v-if="addresses.length > 0" class="space-y-4">
             <div v-for="addr in addresses" :key="addr.id" class="border rounded-lg p-4 relative group">
                <div class="flex justify-between items-start">
                   <div>
                      <p class="font-bold text-gray-900">{{ addr.name }} <span class="font-normal text-gray-500 text-sm">| {{ addr.phone }}</span></p>
                      <p class="text-gray-600 mt-1">{{ addr.street }}</p>
                      <p class="text-gray-600">{{ addr.ward }}, {{ addr.district }}, {{ addr.city }}</p>
                      <span v-if="addr.is_default" class="inline-block mt-2 px-2 py-0.5 border border-primary text-primary text-xs rounded">Mặc định</span>
                   </div>
                   <div class="flex gap-2">
                      <button @click="openEditAddressModal(addr)" class="text-primary hover:underline text-sm">Sửa</button>
                      <button @click="deleteAddress(addr.id)" class="text-red-500 hover:underline text-sm">Xóa</button>
                   </div>
                </div>
             </div>
          </div>
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p class="text-muted-foreground">Chưa có địa chỉ nào</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showProfileModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
       <h3 class="text-lg font-bold mb-4">Chỉnh sửa thông tin</h3>
       <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ và tên</label>
            <input v-model="profileForm.name" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Số điện thoại</label>
            <input v-model="profileForm.phone" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          
          <div class="pt-4 border-t">
             <div class="flex items-center gap-2 mb-4">
               <input v-model="profileForm.isChangePassword" type="checkbox" id="changePass" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
               <label for="changePass" class="text-sm font-medium">Đổi mật khẩu</label>
             </div>
             
             <div v-if="profileForm.isChangePassword" class="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                   <label class="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                   <input v-model="profileForm.oldPassword" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                </div>
                <div>
                   <label class="block text-sm font-medium mb-1">Mật khẩu mới</label>
                   <input v-model="profileForm.newPassword" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                </div>
                <div>
                   <label class="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                   <input v-model="profileForm.confirmPassword" type="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                </div>
             </div>
          </div>
       </div>
       <div class="flex justify-end gap-3 mt-6">
          <button @click="showProfileModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="updateProfile" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu thay đổi</button>
       </div>
    </div>
  </div>

  <!-- Address Modal -->
  <div v-if="showAddressModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAddressModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
       <h3 class="text-lg font-bold mb-4">{{ isEditingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}</h3>
       <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium mb-1">Họ và tên</label>
               <input v-model="addressForm.name" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
             <div>
               <label class="block text-sm font-medium mb-1">Số điện thoại</label>
               <input v-model="addressForm.phone" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
             </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tỉnh / Thành phố</label>
            <select v-model="selectedProvinceId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
               <option value="">Chọn Tỉnh / Thành phố</option>
               <option v-for="item in provinces" :key="item.id" :value="item.id">{{ item.full_name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium mb-1">Quận / Huyện</label>
               <select v-model="selectedDistrictId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Chọn Quận / Huyện</option>
                  <option v-for="item in districts" :key="item.id" :value="item.id">{{ item.full_name }}</option>
               </select>
             </div>
             <div>
               <label class="block text-sm font-medium mb-1">Phường / Xã</label>
               <select v-model="selectedWardId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Chọn Phường / Xã</option>
                  <option v-for="item in wards" :key="item.id" :value="item.id">{{ item.full_name }}</option>
               </select>
             </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Địa chỉ cụ thể</label>
            <input v-model="addressForm.street" type="text" placeholder="Số nhà, tên đường..." class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>
          <div class="flex items-center gap-2">
             <input v-model="addressForm.is_default" type="checkbox" id="dafaultAddr" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
             <label for="dafaultAddr" class="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
          </div>
       </div>
       <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddressModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="saveAddress" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Lưu địa chỉ</button>
       </div>
  </div>
  </div>

  <!-- Order Detail Modal -->
  <div v-if="showOrderModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showOrderModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 m-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
           <h3 class="text-xl font-bold">Chi tiết đơn hàng #{{ selectedOrder?.order_code ? selectedOrder?.order_code.slice(0, 8).toUpperCase() : selectedOrder?.id }}</h3>
           <p class="text-sm text-muted-foreground">{{ selectedOrder?.date }}</p>
        </div>
        <button @click="showOrderModal = false" class="p-2 hover:bg-gray-100 rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="space-y-6">
         <!-- Status -->
         <!-- Order Tracking Timeline -->
         <div v-if="selectedOrder?.status !== 'cancelled'" class="mb-8 px-2">
            <div class="relative mt-4">
              <!-- Progress Bar Background -->
              <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-10"></div>
              
              <!-- Active Progress Bar -->
              <div 
                class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-out"
                :style="{ width: trackingProgress + '%' }"
              ></div>

              <!-- Steps -->
              <div class="flex justify-between w-full">
                <div v-for="(step, index) in trackingSteps" :key="index" class="flex flex-col items-center gap-2">
                   <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10"
                      :class="getStepCircleClass(index)"
                   >
                      <component :is="step.icon" class="w-5 h-5" />
                   </div>
                   <div class="flex flex-col items-center">
                      <span class="text-xs font-semibold whitespace-nowrap" :class="getStepTextClass(index)">{{ step.label }}</span>
                      <span v-if="index <= currentStepIndex" class="text-[10px] text-muted-foreground">{{ step.time }}</span>
                   </div>
                </div>
              </div>
            </div>
         </div>
         
         <div v-else class="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
               <XCircle class="w-6 h-6" />
            </div>
            <div>
               <h4 class="font-bold">Đơn hàng đã bị hủy</h4>
               <p class="text-sm opacity-90">Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.</p>
            </div>
         </div>

         <!-- Status Text (Legacy) -->
         <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Trạng thái hiện tại:</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(selectedOrder?.status)]">
              {{ getStatusLabel(selectedOrder?.status) }}
            </span>
         </div>

         <!-- Shipping Info -->
         <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-bold text-sm mb-3">Thông tin giao hàng</h4>
            <div class="space-y-1 text-sm">
               <p><span class="font-medium">Người nhận:</span> {{ selectedOrder?.customer_name }}</p>
               <p><span class="font-medium">Số điện thoại:</span> {{ selectedOrder?.customer_phone }}</p>
               <p><span class="font-medium">Địa chỉ:</span> {{ selectedOrder?.shipping_address }}</p>
               <p v-if="selectedOrder?.note"><span class="font-medium">Ghi chú:</span> {{ selectedOrder?.note }}</p>
            </div>
         </div>

         <!-- Order Items -->
         <div>
            <h4 class="font-bold text-sm mb-3">Sản phẩm</h4>
            <div class="border rounded-lg overflow-hidden">
               <div v-for="item in selectedOrder?.items" :key="item.id" class="flex items-center gap-4 p-3 border-b last:border-0">
                  <div class="w-16 h-16 bg-gray-200 rounded-md shrink-0 overflow-hidden border">
                     <img v-if="item.product?.thumbnail" :src="item.product.thumbnail" :alt="item.product_name" class="w-full h-full object-cover" />
                     <svg v-else class="w-full h-full text-gray-400 p-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
                  </div>
                  <div class="flex-1">
                     <p class="font-medium line-clamp-2">{{ item.product_name }}</p>
                     <p class="text-sm text-muted-foreground">x{{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                     <p class="font-medium">{{ formatCurrency(item.price) }}</p>
                     <p class="text-sm text-primary font-bold">{{ formatCurrency(item.total_price) }}</p>
                  </div>
               </div>
            </div>
         </div>

         <!-- Summary -->
         <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-sm">
               <span class="text-muted-foreground">Phương thức thanh toán</span>
               <span class="font-medium uppercase">{{ selectedOrder?.payment_method }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold">
               <span>Tổng cộng</span>
               <span class="text-primary">{{ formatCurrency(selectedOrder?.total_amount) }}</span>
            </div>
         </div>
      </div>
      
      <div class="mt-8 flex justify-end gap-3">
         <button 
            v-if="selectedOrder?.status === 'cancelled'"
            @click="repurchase(selectedOrder)"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
         >
            Mua lại đơn này
         </button>
         <button @click="showOrderModal = false" class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { 
  Package, Truck, CheckCircle2, ClipboardList, XCircle 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const API_URL = import.meta.env.VITE_API_URL

const activeTab = ref(route.name === 'orders' ? 'orders' : 'profile')
const recentOrders = ref([])
const showOrderModal = ref(false)
const selectedOrder = ref(null)

const navigateToTab = (tab) => {
  activeTab.value = tab
  if (tab === 'orders') {
    router.push({ name: 'orders' })
  } else if (tab === 'profile') {
    router.push({ name: 'profile' })
  } else {
    // Other tabs don't have dedicated routes yet, or maybe they should. 
    // For now we keep them on profile route but switch tab internally
    // If you want all to be routes, you need to add them to router
    router.push({ name: 'profile' })
  }
}

const openOrderModal = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

// Watch route changes to update activeTab if navigated via URL directly
watch(
  () => route.name, 
  (newRouteName) => {
    if (newRouteName === 'orders') {
      activeTab.value = 'orders'
    } else if (newRouteName === 'profile') {
       // Only reset to profile if we are currently on orders tab
       // If user is on 'wishlist' or 'address', and clicks profile link (which is same route), 
       // we might want to keep it or force profile. 
       // But since those tabs don't have routes, changing url to /profile implies 'profile' tab.
       activeTab.value = 'profile'
    }
  },
  { immediate: true }
)

// Profile Management
const showProfileModal = ref(false)
const profileForm = reactive({
  name: '',
  phone: '', 
  isChangePassword: false,
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const openProfileModal = () => {
  profileForm.name = authStore.user?.name || ''
  profileForm.phone = authStore.user?.phone || ''
  profileForm.isChangePassword = false
  profileForm.oldPassword = ''
  profileForm.newPassword = ''
  profileForm.confirmPassword = ''
  showProfileModal.value = true
}

const updateProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({
        name: profileForm.name,
        phone: profileForm.phone
      })
    })
    
    const json = await res.json()
    if (json.status) {
       // Update store
       authStore.user = json.data
       // Update local storage
       localStorage.setItem('user', JSON.stringify(json.data))
       
       // Handle password change if requested
       if (profileForm.isChangePassword) {
         if (profileForm.newPassword !== profileForm.confirmPassword) {
            alert('Mật khẩu mới không khớp')
            return
         }
         
         const pwdRes = await fetch(`${API_URL}/user/password`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.accessToken}`
            },
            body: JSON.stringify({
              oldPassword: profileForm.oldPassword,
              newPassword: profileForm.newPassword
            })
         })
         const pwdJson = await pwdRes.json()
         if (!pwdJson.status) {
            alert('Cập nhật thông tin thành công nhưng đổi mật khẩu thất bại: ' + (pwdJson.message || pwdJson.errors[0]?.msg))
            return
         }
       }
       
       showProfileModal.value = false
       alert('Cập nhật thành công')
    } else {
       const msg = json.message || (json.errors && json.errors[0] && json.errors[0].msg) || 'Có lỗi xảy ra'
       alert(msg)
    }
  } catch (error) {
    console.error(error)
    alert('Có lỗi xảy ra')
  }
}

// Address Management
const addresses = ref([])
const showAddressModal = ref(false)
const isEditingAddress = ref(false)
const addressForm = reactive({
  id: null,
  name: '',
  phone: '',
  city: '',
  district: '',
  ward: '',
  street: '',
  is_default: false
})

// Location Data
const provinces = ref([])
const districts = ref([])
const wards = ref([])
const selectedProvinceId = ref('')
const selectedDistrictId = ref('')
const selectedWardId = ref('')

// Fetch Location Data
const fetchProvinces = async () => {
  try {
    const res = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
    const json = await res.json()
    if (json.error === 0) {
      provinces.value = json.data
    }
  } catch (e) {
    console.error('Failed to fetch provinces', e)
  }
}

const fetchDistricts = async (provinceId) => {
  if (!provinceId) {
    districts.value = []
    return
  }
  try {
    const res = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
    const json = await res.json()
    if (json.error === 0) {
      districts.value = json.data
    }
  } catch (e) {
    console.error('Failed to fetch districts', e)
  }
}

const fetchWards = async (districtId) => {
  if (!districtId) {
    wards.value = []
    return
  }
  try {
    const res = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
    const json = await res.json()
    if (json.error === 0) {
      wards.value = json.data
    }
  } catch (e) {
    console.error('Failed to fetch wards', e)
  }
}

// Watchers for cascading dropdowns
watch(selectedProvinceId, async (newVal) => {
  // Update addressForm name
  const prov = provinces.value.find(p => p.id === newVal)
  if (prov) addressForm.city = prov.full_name
  
  // Reset child fields
  districts.value = []
  wards.value = []
  selectedDistrictId.value = ''
  selectedWardId.value = ''
  
  if (newVal) await fetchDistricts(newVal)
})

watch(selectedDistrictId, async (newVal) => {
  // Update addressForm name
  const dist = districts.value.find(d => d.id === newVal)
  if (dist) addressForm.district = dist.full_name

  // Reset child field
  wards.value = []
  selectedWardId.value = ''
  
  if (newVal) await fetchWards(newVal)
})

watch(selectedWardId, (newVal) => {
  // Update addressForm name
  const ward = wards.value.find(w => w.id === newVal)
  if (ward) addressForm.ward = ward.full_name
})

const fetchMyOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      recentOrders.value = json.data.map(order => ({
        ...order,
        date: formatDate(order.createdAt),
        itemsCount: order.items.length
      }))
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchAddresses = async () => {
  try {
    const res = await fetch(`${API_URL}/addresses`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      addresses.value = json.data
    }
  } catch (error) {
    console.error(error)
  }
}

const openAddAddressModal = () => {
  isEditingAddress.value = false
  Object.assign(addressForm, {
    id: null, name: '', phone: '', city: '', district: '', ward: '', street: '', is_default: false
  })
  selectedProvinceId.value = ''
  // Reset others triggered by watch
  showAddressModal.value = true
}

const openEditAddressModal = async (addr) => {
  isEditingAddress.value = true
  Object.assign(addressForm, addr)
  showAddressModal.value = true
  
  // Attempt to populate dropdowns based on names
  // Find Province
  if (addr.city) {
    const prov = provinces.value.find(p => p.full_name === addr.city || p.name === addr.city) // check both exact matches
    if (prov) {
      selectedProvinceId.value = prov.id
      // Wait for districts to load (handled by watch, but we need to wait to set district)
      // Since watch is async, we manually trigger fetch here to ensure we can set district immediately after
      await fetchDistricts(prov.id)
      
      if (addr.district) {
         const dist = districts.value.find(d => d.full_name === addr.district || d.name === addr.district)
         if (dist) {
            selectedDistrictId.value = dist.id
            await fetchWards(dist.id)
            
            if (addr.ward) {
               const w = wards.value.find(x => x.full_name === addr.ward || x.name === addr.ward)
               if (w) selectedWardId.value = w.id
            }
         }
      }
    }
  }
}

const saveAddress = async () => {
  // Validate selection
  if (!addressForm.name || !addressForm.phone) {
    alert('Vui lòng nhập họ tên và số điện thoại')
    return
  }
  if (!addressForm.city || !addressForm.district || !addressForm.ward) {
     alert('Vui lòng chọn đầy đủ địa chỉ')
     return
  }

  try {
    const url = isEditingAddress.value 
      ? `${API_URL}/addresses/${addressForm.id}` 
      : `${API_URL}/addresses`
    
    const method = isEditingAddress.value ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(addressForm)
    })
    
    const json = await res.json()
    if (json.status) {
      showAddressModal.value = false
      fetchAddresses()
    } else {
      alert(json.message) // Simple alert for now
    }
  } catch (error) {
    alert('Có lỗi xảy ra')
  }
}

const deleteAddress = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return
  try {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      fetchAddresses()
    }
  } catch (error) {
    console.error(error)
  }
}

// Redirect nếu chưa đăng nhập
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    fetchAddresses()
    fetchProvinces()
    fetchMyOrders()
  }
})

// Lấy chữ cái đầu của tên
const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || 'U'
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa cập nhật'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
  } catch {
    return dateStr
  }
}

const getStatusClass = (status) => {
  const map = {
    'pending': 'bg-gray-100 text-gray-700',
    'confirmed': 'bg-blue-100 text-blue-700',
    'packing': 'bg-yellow-100 text-yellow-700',
    'picked_up': 'bg-orange-100 text-orange-700',
    'in_transit': 'bg-indigo-100 text-indigo-700',
    'arrived_hub': 'bg-purple-100 text-purple-700',
    'out_for_delivery': 'bg-cyan-100 text-cyan-700',
    'delivered': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700',
    // Legacy status support
    'processing': 'bg-yellow-100 text-yellow-700',
    'shipped': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const map = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'packing': 'Đang đóng gói',
    'picked_up': 'Đã giao ĐVVC',
    'in_transit': 'Đang vận chuyển',
    'arrived_hub': 'Đã đến kho',
    'out_for_delivery': 'Đang giao hàng',
    'delivered': 'Giao thành công',
    'cancelled': 'Đã hủy',
    // Legacy status support
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao hàng',
    'completed': 'Hoàn thành'
  }
  return map[status] || status
}

// Timeline Logic (keeping for modal, but order detail page is preferred)
const trackingSteps = [
  { key: 'pending', label: 'Đặt hàng', icon: ClipboardList, time: '' },
  { key: 'confirmed', label: 'Xác nhận', icon: Package, time: '' },
  { key: 'picked_up', label: 'Đã giao ĐVVC', icon: Truck, time: '' },
  { key: 'delivered', label: 'Hoàn thành', icon: CheckCircle2, time: '' }
]

const currentStepIndex = computed(() => {
  if (!selectedOrder.value || !selectedOrder.value.status) return 0
  
  const status = selectedOrder.value.status
  const map = {
    'pending': 0,
    'confirmed': 1,
    'packing': 1,
    'picked_up': 2,
    'in_transit': 2,
    'arrived_hub': 2,
    'out_for_delivery': 2,
    'delivered': 3
  }
  return map[status] ?? 0
})

const trackingProgress = computed(() => {
   return (currentStepIndex.value / (trackingSteps.length - 1)) * 100
})

const getStatusMessage = (status) => {
  const map = {
    'pending': 'Đơn hàng đang chờ xác nhận',
    'confirmed': 'Đơn hàng đã được xác nhận',
    'packing': 'Shop đang đóng gói đơn hàng',
    'picked_up': 'Đơn hàng đã giao cho đơn vị vận chuyển',
    'in_transit': 'Đơn hàng đang vận chuyển',
    'arrived_hub': 'Đơn hàng đã đến kho gần bạn',
    'out_for_delivery': 'Shipper đang giao hàng đến bạn 🛵',
    'delivered': 'Giao hàng thành công. Cảm ơn bạn!',
    'cancelled': 'Đơn hàng đã bị hủy',
    // Legacy
    'processing': 'Đơn hàng đang được xử lý',
    'shipped': 'Đơn hàng đang giao đến bạn 🛵',
    'completed': 'Giao hàng thành công. Cảm ơn bạn!'
  }
  return map[status] || 'Trạng thái đang được cập nhật'
}

const getStatusIcon = (status) => {
  const map = {
    'pending': ClipboardList,
    'confirmed': Package,
    'packing': Package,
    'picked_up': Truck,
    'in_transit': Truck,
    'arrived_hub': Package,
    'out_for_delivery': Truck,
    'delivered': CheckCircle2,
    'cancelled': XCircle,
    // Legacy
    'processing': Package,
    'shipped': Truck,
    'completed': CheckCircle2
  }
  return map[status] || ClipboardList
}

const getStatusColor = (status) => {
  const map = {
    'pending': 'text-gray-500',
    'confirmed': 'text-blue-600',
    'packing': 'text-yellow-600',
    'picked_up': 'text-orange-600',
    'in_transit': 'text-indigo-600',
    'arrived_hub': 'text-purple-600',
    'out_for_delivery': 'text-cyan-600',
    'delivered': 'text-green-600',
    'cancelled': 'text-red-500',
    // Legacy
    'processing': 'text-yellow-600',
    'shipped': 'text-blue-600',
    'completed': 'text-green-600'
  }
  return map[status] || 'text-gray-500'
}

// === Helpers for Mini Tracking (Outside - Deprecated but kept for reference if needed, can remove) ===

const getStepCircleClass = (index) => {
  if (index < currentStepIndex.value) return 'border-primary bg-primary text-white' // Passed steps
  if (index === currentStepIndex.value) return 'border-primary bg-white text-primary ring-4 ring-primary/20' // Current step
  return 'border-gray-200 bg-white text-gray-400' // Future steps
}

const getStepTextClass = (index) => {
  if (index <= currentStepIndex.value) return 'text-primary'
  return 'text-muted-foreground'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const repurchase = (order) => {
  if (!order || !order.items) return
  
  // Add all items from order to cart
  order.items.forEach(item => {
    // Map order item to product structure expected by cart
    const product = {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      // Assuming we might need to fetch full product details if something is missing, 
      // but cart usually needs id, name, price, thumbnail. 
      // OrderItem usually has these. If thumbnail is missing in OrderItem, it might be an issue, 
      // but let's assume item.product has it as populated in fetch.
      thumbnail: item.product?.thumbnail,
      category_name: item.product?.category_name
    }
    cartStore.addToCart(product, item.quantity)
  })
  
  // Redirect to cart 
  router.push('/cart') // Adjust route if needed, usually '/cart' or just open sidebar
}
</script>
