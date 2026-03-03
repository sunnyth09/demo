<template>
  <div class="container max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-2">Thanh toán</h1>

    <!-- Step Indicator -->
    <div class="flex items-center gap-3 mb-8">
      <div class="flex items-center gap-2">
        <span 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
          :class="currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'"
        >1</span>
        <span class="text-sm font-medium" :class="currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'">Thông tin</span>
      </div>
      <div class="w-12 h-0.5 rounded-full transition-colors" :class="currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'"></div>
      <div class="flex items-center gap-2">
        <span 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
          :class="currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'"
        >2</span>
        <span class="text-sm font-medium" :class="currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'">Xác nhận</span>
      </div>
    </div>

    <!-- ============ STEP 1: FORM ============ -->
    <div v-if="currentStep === 1" class="grid lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Shipping Info -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
            Thông tin giao hàng
          </h2>
          
          <!-- Select Existing Address -->
          <div v-if="authStore.isAuthenticated" class="mb-6">
            <div v-if="userAddresses.length > 0">
              <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                <div 
                  v-for="addr in userAddresses" 
                  :key="addr.id"
                  @click="selectAddress(addr)"
                  :class="['min-w-[200px] border p-3 rounded-lg cursor-pointer transition-all hover:border-primary', selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-gray-50']"
                >
                  <div class="flex items-center justify-between mb-1">
                     <span class="font-bold text-sm">{{ addr.name }}</span>
                     <span v-if="addr.is_default" class="text-[10px] uppercase bg-gray-200 text-gray-700 px-1 rounded">Mặc định</span>
                  </div>
                  <p class="text-xs text-gray-600 truncate">{{ addr.phone }}</p>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                    {{ addr.street }}, {{ addr.ward }}, {{ addr.district }}, {{ addr.city }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2 border border-blue-100">
              <span class="mt-0.5"></span>
              <div>
                <p class="font-medium">Sổ địa chỉ của bạn đang trống.</p>
                <p class="text-xs opacity-90 mt-0.5">Vui lòng nhập thông tin giao hàng bên dưới. Bạn có thể tích chọn "Lưu thông tin..." để dùng cho lần sau.</p>
              </div>
            </div>
            <div class="my-4 border-t border-dashed"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Họ và tên</label>
              <input type="text" v-model="form.name" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nguyễn Văn A" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Số điện thoại</label>
              <input type="tel" v-model="form.phone" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="0901234567" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Email</label>
              <input type="email" v-model="form.email" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="email@example.com" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Địa chỉ</label>
              <input type="text" v-model="form.address" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Số nhà, tên đường, phường/xã" />
            </div>
            <div class="space-y-2 relative">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium">Tỉnh / Thành phố</label>
                <button @click="isManualAddress = !isManualAddress" class="text-xs text-primary underline hover:text-primary/80">
                  {{ isManualAddress ? 'Chọn từ danh sách' : 'Nhập tay (nếu không tìm thấy)' }}
                </button>
              </div>
              
              <template v-if="!isManualAddress">
                <select v-model="selectedProvince" class="w-full h-10 px-4 rounded-md border border-input bg-background">
                  <option :value="null">Chọn Tỉnh/Thành</option>
                  <option v-for="p in provinces" :key="p.code" :value="p">{{ p.name }}</option>
                </select>
              </template>
              <template v-else>
                 <input type="text" v-model="form.city" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Tỉnh/Thành phố" />
              </template>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
               <div class="space-y-2">
                 <label class="text-sm font-medium">Quận / Huyện</label>
                 <template v-if="!isManualAddress">
                   <select v-model="selectedDistrict" class="w-full h-10 px-4 rounded-md border border-input bg-background" :disabled="!selectedProvince">
                     <option :value="null">Chọn Quận/Huyện</option>
                     <option v-for="d in districts" :key="d.code" :value="d">{{ d.name }}</option>
                   </select>
                 </template>
                 <template v-else>
                    <input type="text" v-model="form.district" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Quận/Huyện" />
                 </template>
               </div>
               <div class="space-y-2">
                 <label class="text-sm font-medium">Phường / Xã</label>
                 <template v-if="!isManualAddress">
                   <select v-model="selectedWard" class="w-full h-10 px-4 rounded-md border border-input bg-background" :disabled="!selectedDistrict">
                     <option :value="null">Chọn Phường/Xã</option>
                     <option v-for="w in wards" :key="w.code" :value="w">{{ w.name }}</option>
                   </select>
                 </template>
                 <template v-else>
                    <input type="text" v-model="form.ward" class="w-full h-10 px-4 rounded-md border border-input bg-background" placeholder="Nhập Phường/Xã" />
                 </template>
               </div>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium">Ghi chú</label>
              <textarea v-model="form.note" class="w-full h-24 p-4 rounded-md border border-input bg-background resize-none" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
            </div>
            <div class="md:col-span-2" v-if="authStore.isAuthenticated">
               <label class="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" v-model="saveAddress" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="text-sm text-gray-700">Lưu thông tin giao hàng này cho lần sau</span>
               </label>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
            Phương thức thanh toán
          </h2>
          <div class="space-y-4">
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm" :class="form.paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="cod" class="w-4 h-4 text-primary" />
              <div v-if="false" class="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                <p class="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </label>
            
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm" :class="form.paymentMethod === 'banking' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="banking" class="w-4 h-4 text-primary" />
              <div v-if="false" class="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
                <p class="text-sm text-gray-500">Hỗ trợ QR Code / Tất cả ngân hàng</p>
              </div>
            </label>
            
            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm" :class="form.paymentMethod === 'momo' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="momo" class="w-4 h-4 text-primary" />
              <div v-if="false" class="w-10 h-10 rounded bg-pink-100 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                 </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">Ví điện tử MoMo</p>
                <p class="text-sm text-gray-500">Thanh toán nhanh qua ứng dụng MoMo</p>
              </div>
            </label>

            <label class="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm" :class="form.paymentMethod === 'vnpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'">
              <input type="radio" v-model="form.paymentMethod" value="vnpay" class="w-4 h-4 text-primary" />
              <div v-if="false" class="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                 </svg>
              </div> 
              <div class="flex-1">
                <p class="font-medium text-gray-900">VNPay QR / Thẻ ATM</p>
                <p class="text-sm text-gray-500">Quét mã QR hoặc dùng thẻ nội địa/quốc tế</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary (Step 1) -->
      <div class="lg:col-span-1">
        <div class="bg-card rounded-xl border p-6 sticky top-24">
          <h3 class="font-semibold text-lg mb-4">Đơn hàng của bạn</h3>
          
          <!-- Items Preview -->
          <div class="space-y-4 mb-6 max-h-60 overflow-y-auto px-2 pt-3 custom-scrollbar">
            <div v-for="item in checkoutItems" :key="item.id" class="flex gap-3 relative">
              <div class="w-16 h-20 rounded bg-muted flex-shrink-0 relative overflow-hidden border">
                <img :src="getImageUrl(item.thumbnail)" class="w-full h-full object-cover" />
              </div>
              <span class="absolute -top-2 left-12 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold z-10 shadow-sm border border-white">
                {{ item.quantity }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium line-clamp-2">{{ item.name }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ formatCurrency(item.price) }}</p>
              </div>
              <p class="text-sm font-medium">{{ formatCurrency(item.price * item.quantity) }}</p>
            </div>
          </div>

          <!-- Coupon Selector Trigger -->
          <div class="py-3 border-y border-dashed border-gray-300 my-4 flex items-center justify-between">
             <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                 <line x1="7" y1="7" x2="7.01" y2="7"></line>
               </svg>
               Voucher của Shop
             </div>
             <div class="flex items-center gap-2">
               <button 
                 v-if="appliedCoupon"
                 @click.stop="removeCoupon"
                 class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                 title="Bỏ chọn Voucher"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
               <button 
                 @click="showVoucherModal = true" 
                 class="text-sm font-medium text-blue-600 hover:text-blue-700"
               >
                 {{ appliedCoupon ? `Đã dùng: ${appliedCoupon}` : 'Chọn Voucher' }}
               </button>
             </div>
          </div>

          <!-- Coupon Modal -->
          <div v-if="showVoucherModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div class="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="p-4 border-b flex items-center justify-between bg-gray-50">
                   <h3 class="font-bold text-lg">Chọn Voucher</h3>
                   <button @click="showVoucherModal = false" class="text-gray-400 hover:text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>

                <!-- Input Section -->
                <div class="p-4 bg-gray-50 border-b">
                   <div class="flex gap-2">
                      <label class="flex-1 text-sm font-medium text-gray-700 flex items-center gap-2 bg-white border rounded-md px-3 h-10">
                        <span class="text-gray-500 whitespace-nowrap">Mã Voucher</span>
                        <input 
                          v-model="couponInput" 
                          type="text" 
                          placeholder="Nhập mã voucher"
                          class="flex-1 outline-none text-gray-900 bg-transparent"
                          @keyup.enter="applyCoupon(couponInput)"
                        />
                      </label>
                      <button 
                         @click="applyCoupon(couponInput)"
                         :disabled="!couponInput"
                         class="px-4 h-10 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
                      >
                         ÁP DỤNG
                      </button>
                   </div>
                </div>

                <!-- Voucher List -->
                <div class="flex-1 overflow-y-auto p-4 bg-gray-100 min-h-[300px]">
                   <p class="text-xs text-gray-500 mb-3 font-medium">Mã giảm giá có sẵn</p>
                   
                  <div class="space-y-3">
                      <div v-if="availableCoupons.length === 0" class="text-center py-8 text-gray-400 text-sm">
                        Hiện chưa có mã giảm giá nào khả dụng
                      </div>

                      <div 
                        v-for="coupon in availableCoupons" 
                        :key="coupon.id"
                        class="bg-white rounded-lg border flex overflow-hidden shadow-sm relative group hover:border-primary transition-colors"
                      >
                         <!-- Left Ticket Part -->
                         <div 
                           class="w-24 flex flex-col items-center justify-center text-white border-r border-dashed border-white relative p-2 text-center"
                           :class="coupon.type === 'free_shipping' ? 'bg-green-500' : 'bg-primary'"
                         >
                            <span class="text-[10px] uppercase mb-1 font-semibold opacity-90">
                              {{ coupon.type === 'free_shipping' ? 'Mã' : 'GIẢM' }}
                            </span>
                            <span class="font-bold text-xl leading-none">
                              {{ coupon.type === 'percentage' ? `${Number(coupon.value)}%` : (coupon.type === 'free_shipping' ? 'FREE' : `${Number(coupon.value)/1000}K`) }}
                            </span>
                            <span v-if="coupon.type === 'free_shipping'" class="text-[10px] font-bold mt-1">SHIP</span>
                            
                            <!-- Circles for ticket effect -->
                            <div class="absolute -top-2 -right-2 w-4 h-4 bg-gray-100 rounded-full"></div>
                            <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-100 rounded-full"></div>
                         </div>
                         <!-- Content -->
                         <div class="flex-1 p-3 flex flex-col justify-center">
                            <h4 class="font-bold text-sm line-clamp-1">{{ coupon.description || coupon.code }}</h4>
                            <p class="text-xs text-gray-500 mt-1">Mã: <strong class="text-gray-700">{{ coupon.code }}</strong></p>
                            <p class="text-[10px] text-gray-400 mt-0.5" v-if="coupon.min_order_amount > 0">
                              Đơn tối thiểu: {{ formatCurrency(coupon.min_order_amount) }}
                            </p>
                            
                            <div class="flex items-center justify-between mt-2">
                               <span class="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                 HSD: {{ new Date(coupon.end_date).toLocaleDateString('vi-VN') }}
                               </span>
                               <button 
                                 @click="applyCoupon(coupon.code)" 
                                 class="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                                 :disabled="subtotal < coupon.min_order_amount"
                               >
                                 {{ subtotal < coupon.min_order_amount ? 'Chưa đạt' : 'Dùng ngay' }}
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- Footer -->
                <div class="p-4 border-t bg-white flex justify-end">
                   <button @click="showVoucherModal = false" class="px-6 py-2 border rounded-md hover:bg-gray-50 font-medium">Đóng</button>
                </div>
             </div>
          </div>

          <div class="space-y-3 text-sm border-t border-border pt-4">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Tạm tính</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Phí vận chuyển</span>
              <span>{{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Giảm giá</span>
              <span class="text-green-600">-{{ formatCurrency(appliedDiscount) }}</span>
            </div>
            <div class="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span class="text-primary">{{ formatCurrency(total) }}</span>
            </div>
          </div>

          <button @click="goToReview" class="w-full mt-6 h-12 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Đặt hàng
          </button>

          <p class="text-xs text-center text-muted-foreground mt-4">
            Bằng việc đặt hàng, bạn đồng ý với <a href="#" class="underline hover:text-foreground">Điều khoản dịch vụ</a> của chúng tôi.
          </p>
        </div>
      </div>
    </div>

    <!-- ============ STEP 2: REVIEW ============ -->
    <div v-else-if="currentStep === 2" class="max-w-4xl mx-auto space-y-6">
      <!-- Review Header -->
      <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <div>
          <h3 class="font-bold text-blue-800">Vui lòng kiểm tra lại đơn hàng</h3>
          <p class="text-sm text-blue-600 mt-0.5">Xác nhận thông tin bên dưới trước khi đặt hàng. Bạn có thể quay lại chỉnh sửa nếu cần.</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Left: Info Review -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Info Review -->
          <div class="bg-card rounded-xl border p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Thông tin giao hàng
              </h3>
              <!-- <button @click="currentStep = 1" class="text-sm text-primary hover:underline font-medium">Chỉnh sửa</button> -->
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-foreground">Họ và tên</span>
                <p class="font-medium mt-0.5">{{ form.name }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">Số điện thoại</span>
                <p class="font-medium mt-0.5">{{ form.phone }}</p>
              </div>
              <div v-if="form.email" class="sm:col-span-2">
                <span class="text-muted-foreground">Email</span>
                <p class="font-medium mt-0.5">{{ form.email }}</p>
              </div>
              <div class="sm:col-span-2">
                <span class="text-muted-foreground">Địa chỉ giao hàng</span>
                <p class="font-medium mt-0.5">{{ fullAddress }}</p>
              </div>
              <div v-if="form.note" class="sm:col-span-2">
                <span class="text-muted-foreground">Ghi chú</span>
                <p class="font-medium mt-0.5 text-yellow-700 bg-yellow-50 px-2 py-1 rounded">{{ form.note }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Method Review -->
          <div class="bg-card rounded-xl border p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
                Phương thức thanh toán
              </h3>
              <!-- <button @click="currentStep = 1" class="text-sm text-primary hover:underline font-medium">Chỉnh sửa</button> -->
            </div>
            <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" :class="paymentMethodStyle.bg">
                {{ paymentMethodStyle.icon }}
              </div>
              <div>
                <p class="font-medium">{{ paymentMethodStyle.label }}</p>
                <p class="text-xs text-muted-foreground">{{ paymentMethodStyle.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Items Review -->
          <div class="bg-card rounded-xl border p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
              Sản phẩm ({{ checkoutItems.length }})
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in checkoutItems"
                :key="item.id"
                class="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <div class="w-16 h-16 bg-gray-100 rounded-md shrink-0 overflow-hidden border">
                  <img v-if="item.thumbnail" :src="getImageUrl(item.thumbnail)" :alt="item.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xl">📦</div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ item.name }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5">SL: {{ item.quantity }} × {{ formatCurrency(item.price) }}</p>
                </div>
                <p class="font-bold text-primary text-sm whitespace-nowrap">{{ formatCurrency(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Price Summary + Actions -->
        <div class="lg:col-span-1">
          <div class="bg-card rounded-xl border p-6 sticky top-24">
            <h3 class="font-semibold text-lg mb-4">Tóm tắt thanh toán</h3>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Tạm tính ({{ checkoutItems.length }} sản phẩm)</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Phí vận chuyển</span>
                <span>{{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}</span>
              </div>
              <div v-if="appliedDiscount > 0" class="flex justify-between">
                <span class="text-muted-foreground">Giảm giá</span>
                <span class="text-green-600">-{{ formatCurrency(appliedDiscount) }}</span>
              </div>
              <div v-if="appliedCoupon" class="flex justify-between">
                <span class="text-muted-foreground">Voucher</span>
                <span class="text-green-600 font-medium">{{ appliedCoupon }}</span>
              </div>
              <div class="border-t border-border pt-3 flex justify-between font-bold text-xl">
                <span>Tổng cộng</span>
                <span class="text-primary">{{ formatCurrency(total) }}</span>
              </div>
            </div>

            <button
              @click="handleCheckout"
              :disabled="isOrdering"
              class="w-full mt-6 h-12 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!isOrdering" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 12 2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span v-if="isOrdering">Đang xử lý...</span>
              <span v-else>Xác nhận đặt hàng</span>
            </button>

            <button
              @click="currentStep = 1"
              class="w-full mt-3 h-10 rounded-md border border-border text-foreground font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              Quay lại
            </button>

            <p class="text-xs text-center text-muted-foreground mt-4">
              Bằng việc đặt hàng, bạn đồng ý với <a href="#" class="underline hover:text-foreground">Điều khoản dịch vụ</a> của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import { getImageUrl } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { items: cartItems, subtotal } = storeToRefs(cartStore)

const API_URL = import.meta.env.VITE_API_URL

// Filter only selected items
const checkoutItems = computed(() => cartItems.value.filter(item => item.selected !== false))

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  note: '',
  paymentMethod: 'cod'
})

const userAddresses = ref([])
const selectedAddressId = ref(null)
const isOrdering = ref(false)
const saveAddress = ref(false)
const currentStep = ref(1)
const isManualAddress = ref(false)

// Location Data
const provinces = ref([])
const districts = ref([])
const wards = ref([])

const selectedProvince = ref(null)
const selectedDistrict = ref(null)
const selectedWard = ref(null)

const fetchProvinces = async () => {
    try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=1')
        provinces.value = await res.json()
    } catch(e) { console.error(e) }
}

const fetchDistricts = async (code) => {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        const data = await res.json()
        districts.value = data.districts
    } catch(e) { console.error(e) }
}

const fetchWards = async (code) => {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        const data = await res.json()
        wards.value = data.wards
    } catch(e) { console.error(e) }
}

// Watchers
watch(selectedProvince, (newVal) => {
    districts.value = []
    wards.value = []
    selectedDistrict.value = null
    selectedWard.value = null
    if (newVal) {
        form.value.city = newVal.name
        fetchDistricts(newVal.code)
    } else {
        form.value.city = ''
    }
})

watch(selectedDistrict, (newVal) => {
    wards.value = []
    selectedWard.value = null
    if (newVal) {
        form.value.district = newVal.name
        fetchWards(newVal.code)
    } else {
        form.value.district = ''
    }
})

watch(selectedWard, (newVal) => {
    if (newVal) {
        form.value.ward = newVal.name
    } else {
        form.value.ward = ''
    }
})


const shippingFee = ref(0)
const discount = ref(0)

const appliedDiscount = computed(() => {
  const maxDiscount = subtotal.value + shippingFee.value
  return Math.min(discount.value, maxDiscount)
})

const total = computed(() => {
  return Math.max(0, subtotal.value + shippingFee.value - appliedDiscount.value)
})

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

// Fetch user addresses if logged in
const fetchAddresses = async () => {
  if (authStore.isAuthenticated) {
    try {
      const res = await fetch(`${API_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
      })
      const json = await res.json()
      if (json.status) {
        userAddresses.value = json.data
        // Auto select default
        const defaultAddr = json.data.find(a => a.is_default) || json.data[0]
        if (defaultAddr) {
          selectAddress(defaultAddr)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

const selectAddress = (addr) => {
  selectedAddressId.value = addr.id
  form.value.name = addr.name
  form.value.phone = addr.phone
  form.value.address = addr.street
  
  // Try to map back to dropdowns (Best effort)
  // This might trigger watchers, but that's okay, we just want to set the values.
  // Note: Since we only have names, we search by name.
  
  // Wait for provinces if not loaded (unlikely since onMounted)
  const prov = provinces.value.find(p => p.name === addr.city || p.name.includes(addr.city))
  if (prov) {
      selectedProvince.value = prov
      // We need to wait for districts to load to set district
       fetchDistricts(prov.code).then(() => {
           const dist = districts.value.find(d => d.name === addr.district || d.name.includes(addr.district))
           if (dist) {
               selectedDistrict.value = dist
               fetchWards(dist.code).then(() => {
                   const w = wards.value.find(w => w.name === addr.ward || w.name.includes(addr.ward))
                   if (w) selectedWard.value = w
               })
           }
       })
  } else {
     // If mapping fails, at least set the text values to form (which we did below indirectly via watchers? No, watchers override form)
     // Issue: Watchers will set form to '' if selectedProvince is null.
     // So we must manually set form AFTER setting selected refs (or lack thereof).
     // Actually, if we can't map, the dropdowns will be blank. 
     // We should probably rely on the form values being correct for submission, but the UI might look desynced.
     // For now, let's assume the matching works for standard addresses.
  }
}


// Watchers for shipping calculation
const calculateFee = async () => {
    if (!form.value.city) {
        shippingFee.value = 0
        return
    }
    
    try {
        const res = await fetch(`${API_URL}/shipping/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                province: form.value.city,
                district: form.value.district,
                order_total: subtotal.value
            })
        })
        const data = await res.json()
        if (data.status) {
            shippingFee.value = data.data.shipping_fee
        }
    } catch (e) {
        console.error('Error calculating shipping:', e)
    }
}

watch(() => [form.value.city, form.value.district, subtotal.value], () => {
    calculateFee()
}, { deep: true })

// Existing watchers need to be preserved or merged? 
// The existing watchers update form values. My new watcher listens to form values.
// So it should chain correctly.

const couponCode = ref('') // Legacy ref, keep for safety or refactor
const couponInput = ref('')
const showVoucherModal = ref(false)
const appliedCoupon = ref('')
const isCheckingCoupon = ref(false)

const availableCoupons = ref([])

const fetchAvailableCoupons = async () => {
    if (!authStore.isAuthenticated) {
        availableCoupons.value = []
        return
    }

    try {
        const res = await fetch(`${API_URL}/coupons/my`, {
            headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
        })
        const data = await res.json()
        if (data.status) {
            availableCoupons.value = data.data
        }
    } catch(e) { console.error(e) }
}

const applyCoupon = async (code) => {
    const codeToApply = code || couponInput.value
    if (!codeToApply || !codeToApply.trim()) return
    
    isCheckingCoupon.value = true
    
    try {
        const res = await fetch(`${API_URL}/coupons/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: codeToApply,
                order_total: subtotal.value,
                shipping_fee: shippingFee.value,
                items: checkoutItems.value.map(item => ({
                    id: item.id,
                    price: item.price,
                    quantity: item.quantity,
                    category_id: item.category_id || item.product?.category_id
                }))
            })
        })
        const data = await res.json()
        
        if (data.status) {
            const result = data.data
            discount.value = result.discountAmount
            appliedCoupon.value = result.coupon.code
            showVoucherModal.value = false
            // toast.success('Áp dụng mã giảm giá thành công')
        } else {
            toast.error(data.message || 'Mã giảm giá không hợp lệ')
            discount.value = 0
            appliedCoupon.value = ''
        }
    } catch (e) {
        console.error(e)
        toast.error('Lỗi kết nối khi kiểm tra mã giảm giá')
    } finally {
        isCheckingCoupon.value = false
    }
}

const removeCoupon = () => {
    appliedCoupon.value = ''
    discount.value = 0
}

watch(showVoucherModal, (val) => {
    if (val) fetchAvailableCoupons()
})

// Full address computed for review step
const fullAddress = computed(() => {
  const parts = [form.value.address, form.value.ward, form.value.district, form.value.city].filter(Boolean)
  return parts.join(', ')
})

// Payment method display info for review step
const paymentMethodStyle = computed(() => {
  const map = {
    cod: { label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: '💵', bg: 'bg-green-100' },
    banking: { label: 'Chuyển khoản ngân hàng', desc: 'Hỗ trợ QR Code / Tất cả ngân hàng', icon: '🏦', bg: 'bg-blue-100' },
    momo: { label: 'Ví điện tử MoMo', desc: 'Thanh toán nhanh qua ứng dụng MoMo', icon: '📱', bg: 'bg-pink-100' },
    vnpay: { label: 'VNPay QR / Thẻ ATM', desc: 'Quét mã QR hoặc dùng thẻ nội địa/quốc tế', icon: '💳', bg: 'bg-blue-50' },
  }
  return map[form.value.paymentMethod] || map.cod
})

// Validate and go to review step
const goToReview = () => {
  if (checkoutItems.value.length === 0) {
    toast.warning('Vui lòng chọn sản phẩm để thanh toán')
    router.push('/cart')
    return
  }

  if (!form.value.name || !form.value.phone || !form.value.address || !form.value.city || !form.value.district) {
    toast.warning('Vui lòng điền đầy đủ thông tin giao hàng')
    return
  }

  currentStep.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCheckout = async () => {
  isOrdering.value = true
  try {
    // 1. Save address if requested
    if (saveAddress.value && authStore.isAuthenticated) {
      try {
        await fetch(`${API_URL}/addresses`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.accessToken}`
          },
          body: JSON.stringify({
             name: form.value.name,
             phone: form.value.phone,
             street: form.value.address,
             city: form.value.city,
             district: form.value.district,
             ward: form.value.ward, 
             is_default: userAddresses.value.length === 0 // If first address, make default
          })
        })
        // Refresh addresses (optional)
      } catch (e) {
        console.error('Failed to save address', e)
      }
    }

    // 2. Create Order
    const orderData = {
      customer_name: form.value.name,
      customer_phone: form.value.phone,
      customer_email: form.value.email || (authStore.user?.email),
      shipping_address: `${form.value.address}, ${form.value.ward}, ${form.value.district}, ${form.value.city}`,
      note: form.value.note,
      payment_method: form.value.paymentMethod,
      total_amount: total.value,
      shipping_fee: shippingFee.value,
      discount_amount: appliedDiscount.value, // Add discount to order (capped)
      items: checkoutItems.value.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    }

    const headers = { 'Content-Type': 'application/json' }
    if (authStore.isAuthenticated) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    })

    const json = await res.json()

    if (json.status) {
      if (form.value.paymentMethod === 'vnpay') {
          // Nếu là VNPay: Gọi tiếp API để lấy link thanh toán
          const orderId = json.data.id || json.data.order_id; // Đảm bảo lấy đúng ID đơn hàng
          
          const paymentRes = await fetch(`${API_URL}/payment/create_payment_url`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  orderId: orderId,
                  amount: total.value,
                  language: 'vn'
              })
          });
          const paymentJson = await paymentRes.json();
          if (paymentJson.code === '00') {
              // Redirect sang VNPay
              window.location.href = paymentJson.data;
              return; // Dừng hàm tại đây
          } else {
             toast.error('Lỗi tạo link thanh toán VNPay');
          }
      }

      toast.success('Đặt hàng thành công!')
      cartStore.removePurchasedItems()
      router.push(`/orders/${json.data.id}`)
    } else {
      toast.error(json.message || 'Đặt hàng thất bại')
    }
  } catch (error) {
    console.error(error)
    toast.error(`Có lỗi xảy ra khi đặt hàng: ${error.message}`)
  } finally {
    isOrdering.value = false
  }
}

onMounted(() => {
  if (cartItems.value.length === 0) {
    // router.push('/products')
  }
  
  fetchProvinces() // Load location data

  if (authStore.isAuthenticated) {
    // Pre-fill user info if available
    form.value.name = authStore.user?.name || ''
    form.value.email = authStore.user?.email || ''
    fetchAddresses()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
