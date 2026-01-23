<template>
  <footer class="border-t border-border bg-muted/30">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <span class="text-xl font-bold">Bookstore</span>
          </div>
          <p class="text-sm text-muted-foreground">
            Nơi cung cấp những cuốn sách hay nhất cho bạn đọc.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold mb-4">Liên kết nhanh</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><router-link to="/" class="hover:text-foreground transition-colors">Trang chủ</router-link></li>
            <li><router-link to="/products" class="hover:text-foreground transition-colors">Sản phẩm</router-link></li>
            <li><router-link to="/about" class="hover:text-foreground transition-colors">Giới thiệu</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold mb-4">Hỗ trợ</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-foreground transition-colors">Liên hệ</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">FAQ</a></li>
            <li><a href="#" class="hover:text-foreground transition-colors">Chính sách đổi trả</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold mb-4">Liên hệ</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>📧 contact@bookstore.com</li>
            <li>📞 1900-1234</li>
            <li>📍 123 Đường ABC, TP.HCM</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Bookstore. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
