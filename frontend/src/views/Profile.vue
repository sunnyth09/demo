<template>
  <div class="container max-w-7xl mx-auto px-4 py-12 overflow-hidden">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Thanh bên -->
      <div class="md:col-span-1">
        <div class="bg-card rounded-xl border p-6 text-center mb-6">
          <div class="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" @click="triggerAvatarUpload">
             <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
             <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
                <img 
                  v-if="authStore.user?.avatar" 
                  :src="authStore.user.avatar" 
                  class="w-full h-full object-cover"
                  alt="Avatar" 
                />
                <span v-else class="text-4xl font-bold text-muted-foreground">{{ userInitial }}</span>
             </div>
             <!-- Biểu tượng chỉnh sửa (Lớp phủ) -->
             <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
             </div>
          </div>
          <h2 class="font-bold text-lg cursor-pointer hover:text-primary transition-colors" @click="openProfileModal">{{ authStore.user?.name || 'Người dùng' }}</h2>
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
            @click="activeTab = 'myVouchers'" 
            :class="['flex items-center gap-3 px-4 py-3 w-full text-left transition-colors border-l-2', activeTab === 'myVouchers' ? 'bg-primary/5 text-primary font-medium border-primary' : 'hover:bg-muted/50 border-transparent']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9Z"/><path d="M12 6v15"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>
            Mã của tôi
            <span v-if="newVouchersCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ newVouchersCount }}</span>
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

      <!-- Nội dung chính -->
      <div class="md:col-span-3 space-y-6 min-w-0">
        <!-- Thông tin cá nhân -->
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

        <!-- Đơn hàng gần đây -->
        <div v-if="activeTab === 'profile' || activeTab === 'orders'" class="bg-card rounded-xl border p-6 overflow-hidden">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">{{ activeTab === 'orders' ? 'Tất cả đơn hàng' : 'Đơn hàng gần đây' }}</h2>
            <a v-if="activeTab === 'profile'" href="#" @click.prevent="activeTab = 'orders'" class="text-sm text-primary hover:underline">Xem tất cả</a>
          </div>
          <div v-if="recentOrders.length > 0" class="space-y-4">
            <router-link v-for="order in recentOrders" :key="order.id" :to="`/orders/${order.id}`" class="border rounded-lg p-4 md:p-5 hover:shadow-md transition-all cursor-pointer bg-white group block overflow-hidden">
              <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <!-- Cột 1: Thông tin cơ bản -->
                <div class="w-full md:w-[200px] md:shrink-0">
                   <div class="flex items-center gap-2 mb-1">
                      <span class="font-mono font-medium text-base md:text-lg text-gray-900 group-hover:text-primary transition-colors" :title="order.order_code">#{{ order.order_code ? order.order_code.slice(0, 8).toUpperCase() : order.id }}</span>
                      <span :class="['px-2 py-0.5 rounded-full text-xs font-medium md:hidden', getStatusClass(order.status)]">
                        {{ getStatusLabel(order.status) }}
                      </span>
                   </div>
                   <p class="text-sm text-muted-foreground mb-1">{{ order.date }}</p>
                   <p class="text-sm font-medium text-gray-500">{{ order.itemsCount }} sản phẩm</p>
                </div>

                <!-- Cột 2: Thông điệp trạng thái (Giữa) - Ẩn trên Mobile -->
                <div class="hidden md:flex flex-1 min-w-0 px-4 justify-center">
                   <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 max-w-sm">
                      <component :is="getStatusIcon(order.status)" :class="['w-5 h-5', getStatusColor(order.status)]" />
                      <span class="text-sm font-medium text-gray-700 line-clamp-1 truncate" :title="getStatusMessage(order.status)">
                        {{ getStatusMessage(order.status) }}
                      </span>
                   </div>
                </div>

                <!-- Cột 3: Trạng thái & Giá & Hành động -->
                <div class="flex items-center justify-between md:w-[180px] md:shrink-0 md:flex-col md:items-end gap-2">
                   <p class="font-medium text-primary text-lg md:text-xl">{{ formatCurrency(order.total_amount) }}</p>
                   <span :class="['px-3 py-1 rounded-full text-xs font-medium hidden md:inline-block', getStatusClass(order.status)]">
                     {{ getStatusLabel(order.status) }}
                   </span>
                   
                   <button 
                    v-if="order.status === 'cancelled'"
                    @click.prevent="repurchase(order)"
                    class="mt-2 text-xs font-medium px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 transition-all flex items-center gap-1 group"
                   >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                    Mua lại
                  </button>
                   <button 
                    v-else-if="order.status === 'pending' || order.status === 'confirmed'"
                    @click.prevent="cancelOrderFromProfile(order)"
                    :disabled="cancellingOrderId === order.id"
                    class="mt-2 text-xs font-medium px-4 py-2 border border-red-400 text-red-500 rounded-full shadow-sm hover:shadow-md hover:bg-red-50 transition-all flex items-center gap-1"
                   >
                    <svg v-if="cancellingOrderId !== order.id" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    <svg v-else class="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    {{ cancellingOrderId === order.id ? 'Đang gửi...' : 'Yêu cầu hủy' }}
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

        <!-- Danh sách yêu thích -->
        <div v-if="activeTab === 'wishlist'" class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-bold mb-6">Sản phẩm yêu thích</h2>
          
          <div v-if="favorites.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="fav in favorites"
              :key="fav.id"
              class="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 relative"
            >
              <!-- Vùng chứa hình ảnh -->
              <div 
                 class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 cursor-pointer mb-3"
                 @click="router.push(`/san-pham/${fav.product.slug || fav.product.id}`)"
              >
                <img 
                  :src="fav.product.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image'" 
                  :alt="fav.product.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                 
                 <!-- Biểu tượng xóa ở góc trên bên phải -->
                 <button
                    @click.stop="toggleFavorite(fav.product)"
                    class="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors group/btn"
                    title="Xóa khỏi danh sách"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover/btn:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
              </div>
              
              <!-- Nội dung -->
              <div class="flex flex-col">
                  <!-- Tiêu đề -->
                  <h3 class="font-medium text-gray-900 line-clamp-2 mb-2 min-h-[3rem] cursor-pointer hover:text-primary transition-colors leading-snug"
                      @click="router.push(`/san-pham/${fav.product.slug || fav.product.id}`)"
                      :title="fav.product.name"
                  >
                      {{ fav.product.name }}
                  </h3>
                  
                  <!-- Giá -->
                  <div class="text-xl font-bold text-blue-600 mb-1">
                      {{ formatCurrency(fav.product.price) }}
                  </div>
                  
                  <!-- Đánh giá (Tạm thời hiển thị tĩnh theo thiết kế) -->
                  <div class="flex items-center gap-1">
                      <div class="flex text-yellow-400 text-sm">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                      <span class="text-gray-400 text-sm">(0)</span>
                  </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <p class="text-muted-foreground">Chưa có sản phẩm yêu thích</p>
            <router-link to="/" class="inline-block mt-4 text-primary hover:underline">Khám phá sản phẩm</router-link>
          </div>
        </div>

        <!-- Tab Voucher của tôi -->
        <div v-if="activeTab === 'myVouchers'" class="bg-card rounded-xl border p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Mã của tôi</h2>
            <router-link to="/vouchers" class="text-sm text-primary hover:underline">Săn thêm mã →</router-link>
          </div>
          
          <div v-if="loadingVouchers" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          
          <div v-else-if="myVouchers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="coupon in myVouchers" 
              :key="coupon.id"
              :class="[
                'flex rounded-xl overflow-hidden border',
                coupon.is_used ? 'opacity-60 bg-gray-50' : 'bg-white hover:shadow-md'
              ]"
            >
              <!-- Huy hiệu bên trái -->
              <div 
                :class="[
                  'w-24 flex flex-col items-center justify-center p-3',
                  coupon.is_used ? 'bg-gray-400' : coupon.type === 'free_shipping' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-primary to-pink-600'
                ]"
              >
                <span class="text-white text-[10px] font-medium uppercase">{{ coupon.is_used ? 'Đã dùng' : 'Giảm' }}</span>
                <span class="text-white text-xl font-black">
                  <template v-if="coupon.type === 'percentage'">{{ Number(coupon.value) }}%</template>
                  <template v-else-if="coupon.type === 'fixed'">{{ formatShortCurrency(coupon.value) }}</template>
                  <template v-else>✈️</template>
                </span>
              </div>

              <!-- Nội dung -->
              <div class="flex-1 p-3">
                <h4 class="font-semibold text-gray-900 line-clamp-1 text-sm">{{ coupon.description || coupon.code }}</h4>
                <p class="font-mono text-xs text-gray-500 mt-0.5">{{ coupon.code }}</p>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span 
                    :class="[
                      'text-[10px] px-1.5 py-0.5 rounded',
                      coupon.source === 'welcome' ? 'bg-blue-100 text-blue-600' :
                      coupon.source === 'first_order' ? 'bg-green-100 text-green-600' :
                      coupon.source === 'manual' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ getSourceLabel(coupon.source) }}
                  </span>
                  <span v-if="!coupon.is_used" class="text-[10px] text-gray-400">HSD: {{ formatDate(coupon.end_date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="text-5xl mb-4">🎫</div>
            <p class="text-muted-foreground">Bạn chưa có mã giảm giá nào</p>
            <router-link to="/vouchers" class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Săn Voucher ngay</router-link>
          </div>
        </div>

        <!-- Sổ địa chỉ -->
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

  <!-- Modal Hồ sơ -->
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
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="profileForm.email" type="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
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

  <!-- Modal Địa chỉ -->
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

  <!-- Modal Chi tiết Đơn hàng -->
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
         <!-- Trạng thái -->
         <!-- Dòng thời gian theo dõi đơn hàng -->
         <div v-if="selectedOrder?.status !== 'cancelled'" class="mb-8 px-2">
            <div class="relative mt-4">
              <!-- Nền của thanh tiến trình -->
              <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-10"></div>
              
              <!-- Thanh tiến trình đang hoạt động -->
              <div 
                class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-out"
                :style="{ width: trackingProgress + '%' }"
              ></div>

              <!-- Các bước -->
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
         
         <div v-else class="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
           <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
               <XCircle class="w-6 h-6" />
            </div>
            <div>
               <h4 class="font-bold">Đơn hàng đã bị hủy</h4>
               <p class="text-sm opacity-90">Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.</p>
            </div>
           </div>
           <div v-if="selectedOrder?.cancel_reason" class="mt-3 pt-3 border-t border-red-200">
             <p class="text-sm"><span class="font-medium">Lý do hủy:</span> {{ selectedOrder.cancel_reason }}</p>
           </div>
         </div>

         <!-- Văn bản trạng thái (Cũ) -->
         <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Trạng thái hiện tại:</span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(selectedOrder?.status)]">
              {{ getStatusLabel(selectedOrder?.status) }}
            </span>
         </div>

         <!-- Thông tin giao hàng -->
         <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-bold text-sm mb-3">Thông tin giao hàng</h4>
            <div class="space-y-1 text-sm">
               <p><span class="font-medium">Người nhận:</span> {{ selectedOrder?.customer_name }}</p>
               <p><span class="font-medium">Số điện thoại:</span> {{ selectedOrder?.customer_phone }}</p>
               <p><span class="font-medium">Địa chỉ:</span> {{ selectedOrder?.shipping_address }}</p>
               <p v-if="selectedOrder?.note"><span class="font-medium">Ghi chú:</span> {{ selectedOrder?.note }}</p>
            </div>
         </div>

         <!-- Sản phẩm trong đơn hàng -->
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

          <!-- Tóm tắt -->
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
          <button 
            v-else-if="selectedOrder?.status === 'pending' || selectedOrder?.status === 'confirmed'"
            @click="cancelOrderFromProfile(selectedOrder)"
            :disabled="cancellingOrderId === selectedOrder?.id"
            class="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="cancellingOrderId !== selectedOrder?.id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <svg v-else class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ cancellingOrderId === selectedOrder?.id ? 'Đang hủy...' : 'Hủy đơn hàng' }}
          </button>
          <button @click="showOrderModal = false" class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Đóng</button>
       </div>
    </div>
  </div>

  <!-- Hủy đơn hàng modal -->
  <div v-if="showCancelModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showCancelModal = false"></div>
    <div class="bg-card rounded-xl shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
      <button @click="showCancelModal = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <h3 class="text-xl font-bold mb-4">Lý do hủy đơn hàng</h3>
      <p class="text-sm text-muted-foreground mb-4">Vui lòng chọn lý do bạn muốn hủy đơn.</p>

      <div class="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
        <label v-for="(reason, index) in cancelReasons" :key="index" class="flex items-start gap-3 cursor-pointer">
          <input type="radio" :value="reason" v-model="cancelReason" name="cancel_reason_profile" class="mt-1 flex-shrink-0" />
          <span class="text-sm">{{ reason }}</span>
        </label>

        <div v-if="cancelReason === 'Lý do khác'" class="pl-7 mt-2">
          <textarea 
            v-model="otherCancelReason" 
            placeholder="Nhập lý do cụ thể..." 
            class="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button 
          @click="showCancelModal = false" 
          class="px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
        >
          Quay lại
        </button>
        <button 
          @click="submitCancelOrderFromProfile" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2 transition-colors"
          :disabled="cancellingOrderId !== null"
        >
          <svg v-if="cancellingOrderId !== null" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Xác nhận hủy</span>
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useFavoriteStore } from '@/stores/favorite'
import { storeToRefs } from 'pinia'
import { 
  Package, Truck, CheckCircle2, ClipboardList, XCircle, FileQuestion 
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const { favorites } = storeToRefs(favoriteStore)
const API_URL = import.meta.env.VITE_API_URL

const activeTab = ref(route.name === 'orders' ? 'orders' : 'profile')
const recentOrders = ref([])
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Voucher state
const myVouchers = ref([])
const newVouchersCount = ref(0)
const loadingVouchers = ref(false)

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
  email: '',
  isChangePassword: false,
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fileInput = ref(null)

const triggerAvatarUpload = () => {
  fileInput.value.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File quá lớn (tối đa 5MB)')
    return
  }
  
  // Upload immediately
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    // Name is optional in backend now, so we only send avatar for partial update

    // Show loading? Maybe global loading or toast
    const toastId = toast.loading('Đang cập nhật ảnh đại diện...')

    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: formData
    })
    
    const json = await res.json()
    
    if (json.status) {
       authStore.user = json.data
       localStorage.setItem('user', JSON.stringify(json.data))
       toast.success('Cập nhật ảnh đại diện thành công', { id: toastId })
    } else {
       toast.error(json.message || 'Cập nhật thất bại', { id: toastId })
    }
  } catch (error) {
    console.error(error)
    toast.error('Có lỗi xảy ra')
  } finally {
    // Reset input
    event.target.value = ''
  }
}

const openProfileModal = () => {
  profileForm.name = authStore.user?.name || ''
  profileForm.email = authStore.user?.email || ''
  profileForm.phone = authStore.user?.phone || ''
  profileForm.isChangePassword = false
  profileForm.oldPassword = ''
  profileForm.newPassword = ''
  profileForm.confirmPassword = ''
  showProfileModal.value = true
}

const updateProfile = async () => {
  try {
    // Use JSON for text updates (cleaner and less error prone than FormData)
    const payload = {
      name: profileForm.name
    }
    if (profileForm.email) payload.email = profileForm.email
    if (profileForm.phone) payload.phone = profileForm.phone

    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(payload)
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
            toast.error('Mật khẩu mới không khớp')
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
            toast.warning('Cập nhật thông tin thành công nhưng đổi mật khẩu thất bại: ' + (pwdJson.message || pwdJson.errors[0]?.msg))
            return
         }
       }
       
       showProfileModal.value = false
       toast.success('Cập nhật thành công')
    } else {
       const msg = json.message || (json.errors && json.errors[0] && json.errors[0].msg) || 'Có lỗi xảy ra'
       toast.error(msg)
    }
  } catch (error) {
    console.error(error)
    toast.error('Có lỗi xảy ra')
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

// Voucher Functions
const fetchMyVouchers = async () => {
  loadingVouchers.value = true
  try {
    const res = await fetch(`${API_URL}/coupons/my`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      myVouchers.value = json.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingVouchers.value = false
  }
}

const fetchNewVouchersCount = async () => {
  try {
    const res = await fetch(`${API_URL}/coupons/new-count`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      newVouchersCount.value = json.data.count
    }
  } catch (error) {
    console.error(error)
  }
}

const getSourceLabel = (source) => {
  const labels = {
    'claim': 'Đã lưu',
    'welcome': '🎁 Chào mừng',
    'first_order': '🏷️ Đơn đầu',
    'manual': '✨ Được tặng'
  }
  return labels[source] || source
}

const formatShortCurrency = (value) => {
  const num = Number(value)
  if (num >= 1000000) return `${(num / 1000000).toFixed(0)}TR`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

// Watch for tab changes to load vouchers
watch(activeTab, (newTab) => {
  if (newTab === 'myVouchers' && myVouchers.value.length === 0) {
    fetchMyVouchers()
  }
})

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
    toast.warning('Vui lòng nhập họ tên và số điện thoại')
    return
  }
  if (!addressForm.city || !addressForm.district || !addressForm.ward) {
     toast.warning('Vui lòng chọn đầy đủ địa chỉ')
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
      toast.error(json.message)
    }
  } catch (error) {
    toast.error('Có lỗi xảy ra')
  }
}

const { confirm } = useConfirmDialog()

const deleteAddress = async (id) => {
  const ok = await confirm('Xóa địa chỉ', 'Bạn có chắc muốn xóa địa chỉ này?', { actionLabel: 'Xóa' })
  if (!ok) return
  try {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      fetchAddresses()
      toast.success('Đã xóa địa chỉ')
    } else {
      toast.error(json.message || 'Xóa thất bại')
    }
  } catch (error) {
    console.error(error)
    toast.error('Có lỗi xảy ra')
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
    favoriteStore.fetchFavorites()
  }
})

// Lấy chữ cái đầu của tên
const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || 'U'
})

const toggleFavorite = async (product) => {
  const ok = await confirm('Xóa khỏi yêu thích', 'Bạn muốn xóa sản phẩm này khỏi danh sách yêu thích?', { actionLabel: 'Xóa' })
  if (ok) {
    await favoriteStore.toggleFavorite(product)
    toast.success('Đã xóa khỏi danh sách yêu thích')
  }
};

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
    'request_cancel': 'bg-red-50 text-red-600 border border-red-200',
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
    'request_cancel': 'Đang yêu cầu hủy',
    'cancelled': 'Đã hủy',
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
    'request_cancel': 'Yêu cầu hủy đang chờ Admin duyệt',
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
    'request_cancel': FileQuestion,
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
    'request_cancel': 'text-orange-600',
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
    const product = {
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      thumbnail: item.product?.thumbnail,
      category_name: item.product?.category_name
    }
    cartStore.addToCart(product, item.quantity)
  })
  
  router.push('/cart')
}

// Cancel order from profile page
const cancellingOrderId = ref(null)
const showCancelModal = ref(false)
const cancelReason = ref('')
const otherCancelReason = ref('')
const orderToCancel = ref(null)

const cancelReasons = [
  'Muốn thay đổi địa chỉ giao hàng',
  'Muốn thay đổi sản phẩm trong đơn hàng (Màu sắc, số lượng...)',
  'Tìm thấy giá rẻ hơn ở chỗ khác',
  'Thời gian giao hàng quá lâu',
  'Đổi ý, không muốn mua nữa',
  'Lý do khác'
]

const cancelOrderFromProfile = (order) => {
  if (!order) return
  orderToCancel.value = order
  cancelReason.value = ''
  otherCancelReason.value = ''
  showCancelModal.value = true
}

const submitCancelOrderFromProfile = async () => {
  if (!orderToCancel.value) return
  
  let finalReason = cancelReason.value
  
  if (!finalReason) {
    toast.error('Vui lòng chọn lý do hủy đơn hàng')
    return
  }
  
  if (finalReason === 'Lý do khác') {
    if (!otherCancelReason.value.trim()) {
      toast.error('Vui lòng nhập lý do cụ thể')
      return
    }
    finalReason = otherCancelReason.value.trim()
  }

  showCancelModal.value = false
  const orderId = orderToCancel.value.id
  cancellingOrderId.value = orderId
  
  try {
    const res = await fetch(`${API_URL}/orders/my-orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cancel_reason: finalReason })
    })
    const json = await res.json()
    if (json.status) {
      toast.success(json.message || 'Đã hủy đơn hàng')
      // Refresh orders list
      await fetchMyOrders()
      // Close modal if open
      if (showOrderModal.value && selectedOrder.value?.id === orderId) {
        showOrderModal.value = false
      }
    } else {
      toast.error(json.message || 'Có lỗi xảy ra')
    }
  } catch (e) {
    toast.error('Có lỗi xảy ra')
  } finally {
    cancellingOrderId.value = null
    orderToCancel.value = null
  }
}
</script>
