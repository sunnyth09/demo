<template>
  <footer class="border-t border-border bg-muted/50">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="space-y-4 lg:col-span-1">
          <div class="flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-foreground">Ocean Books</span>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Đại dương tri thức - Nơi cung cấp những cuốn sách hay nhất, mang đến trải nghiệm đọc sách tuyệt vời cho bạn.
          </p>
          <!-- Social Icons -->
          <div class="flex gap-2">
            <a href="#" class="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 text-muted-foreground">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 text-muted-foreground">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 text-muted-foreground">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 text-muted-foreground">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-foreground mb-4">Liên kết nhanh</h4>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-sm text-muted-foreground hover:text-primary transition-colors">Trang chủ</router-link></li>
            <li><router-link to="/products" class="text-sm text-muted-foreground hover:text-primary transition-colors">Sản phẩm</router-link></li>
            <li><router-link to="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">Giới thiệu</router-link></li>
            <li><router-link to="/cart" class="text-sm text-muted-foreground hover:text-primary transition-colors">Giỏ hàng</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold text-foreground mb-4">Hỗ trợ</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Liên hệ</a></li>
            <li><a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Chính sách đổi trả</a></li>
            <li><a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-foreground mb-4">Liên hệ</h4>
          <ul class="space-y-3 text-sm text-muted-foreground">
            <li class="flex items-center gap-2">
              <span>📧</span>
              <span>contact@oceanbooks.vn</span>
            </li>
            <li class="flex items-center gap-2">
              <span>📞</span>
              <span>1900-OCEAN</span>
            </li>
            <li class="flex items-center gap-2">
              <span>📍</span>
              <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-muted-foreground">
          © 2026 <span class="font-medium text-foreground">Ocean Books</span>. All rights reserved.
        </p>
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" class="hover:text-primary transition-colors">Chính sách bảo mật</a>
          <span class="text-border">|</span>
          <a href="#" class="hover:text-primary transition-colors">Điều khoản sử dụng</a>
          <span class="text-border">|</span>
          <a href="#" class="hover:text-primary transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
