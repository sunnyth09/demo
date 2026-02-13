<template>
  <div class="container max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-center">Hướng Dẫn Mua Hàng</h1>
    
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Step 1 -->
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="w-full md:w-1/2">
          <div class="bg-primary/10 rounded-2xl p-8 flex items-center justify-center h-64">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div class="w-full md:w-1/2 space-y-4">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xl">1</div>
          <h3 class="text-2xl font-bold">Tìm kiếm sản phẩm</h3>
          <p class="text-muted-foreground text-lg leading-relaxed">
            Bạn có thể tìm kiếm sản phẩm theo tên sách, tác giả hoặc danh mục. Sử dụng thanh tìm kiếm ở đầu trang hoặc duyệt qua các danh mục sách trên thanh menu.
          </p>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="flex flex-col md:flex-row-reverse gap-8 items-center">
        <div class="w-full md:w-1/2">
          <div class="bg-primary/10 rounded-2xl p-8 flex items-center justify-center h-64">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="w-full md:w-1/2 space-y-4">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xl">2</div>
          <h3 class="text-2xl font-bold">Thêm vào giỏ hàng</h3>
          <p class="text-muted-foreground text-lg leading-relaxed">
            Sau khi chọn được cuốn sách ưng ý, bấm nút "Thêm vào giỏ" để đưa sản phẩm vào giỏ hàng của bạn. Bạn có thể tiếp tục mua sắm hoặc chuyển sang bước thanh toán.
          </p>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="w-full md:w-1/2">
          <div class="bg-primary/10 rounded-2xl p-8 flex items-center justify-center h-64">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="w-full md:w-1/2 space-y-4">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xl">3</div>
          <h3 class="text-2xl font-bold">Điền thông tin & Thanh toán</h3>
          <p class="text-muted-foreground text-lg leading-relaxed">
            Kiểm tra lại giỏ hàng, nhập mã giảm giá (nếu có). Điền đầy đủ thông tin giao hàng và chọn phương thức thanh toán phù hợp (COD, Chuyển khoản, Ví điện tử).
          </p>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="flex flex-col md:flex-row-reverse gap-8 items-center">
        <div class="w-full md:w-1/2">
          <div class="bg-primary/10 rounded-2xl p-8 flex items-center justify-center h-64">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div class="w-full md:w-1/2 space-y-4">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xl">4</div>
          <h3 class="text-2xl font-bold">Hoàn tất đơn hàng</h3>
          <p class="text-muted-foreground text-lg leading-relaxed">
            Sau khi đặt hàng thành công, hệ thống sẽ gửi email xác nhận. Bạn có thể theo dõi trạng thái đơn hàng trong phần "Đơn hàng của tôi".
          </p>
        </div>
      </div>
      
      <!-- CTA -->
      <div class="text-center pt-8">
        <router-link to="/products" class="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg">
          Bắt đầu mua sắm ngay
        </router-link>
      </div>

    </div>
  </div>
</template>
