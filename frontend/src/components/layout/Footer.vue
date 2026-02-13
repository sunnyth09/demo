<template>
  <footer class="border-t border-border bg-muted/50 pt-16 pb-8">
    <div class="container max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        <!-- Brand Column -->
        <div class="lg:col-span-4 space-y-6">
          <router-link to="/" class="inline-block">
            <img src="@/assets/ocean.png" alt="Ocean Books" class="h-14 w-auto" />
          </router-link>
          <p class="text-muted-foreground leading-relaxed max-w-sm">
            Đại dương tri thức - Nơi hội tụ những cuốn sách giá trị nhất, mang đến nguồn cảm hứng bất tận cho hành trình phát triển của bạn.
          </p>
          
          <!-- Newsletter -->
          <div class="space-y-3">
             <h4 class="font-semibold text-foreground">Đăng ký nhận tin</h4>
             <div class="flex gap-2">
                <input type="email" placeholder="Email của bạn..." class="bg-background border border-input text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary outline-none" />
                <button class="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors font-medium">
                   Gửi
                </button>
             </div>
          </div>
        </div>

        <!-- Links Column 1: About -->
        <div class="lg:col-span-2">
          <h4 class="font-bold text-lg mb-6 text-foreground border-b-2 border-primary inline-block pb-1">Về Ocean Books</h4>
          <ul class="space-y-3">
            <li><router-link to="/about" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Câu chuyện thương hiệu</router-link></li>
            <li><router-link to="/about" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Tuyển dụng</router-link></li>
            <li><router-link to="/terms-of-service" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Điều khoản sử dụng</router-link></li>
            <li><router-link to="/privacy-policy" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Chính sách bảo mật</router-link></li>
          </ul>
        </div>

        <!-- Links Column 2: Support -->
        <div class="lg:col-span-3">
          <h4 class="font-bold text-lg mb-6 text-foreground border-b-2 border-primary inline-block pb-1">Hỗ Trợ Khách Hàng</h4>
          <ul class="space-y-3">
            <li><router-link to="/faq" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Câu hỏi thường gặp (FAQ)</router-link></li>
            <li><router-link to="/return-policy" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Chính sách đổi trả</router-link></li>
            <li><router-link to="/contact" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Liên hệ hỗ trợ</router-link></li>
            <li><router-link to="/shopping-guide" class="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Hướng dẫn mua hàng</router-link></li>
          </ul>
        </div>

        <!-- Links Column 3: Contact & Connect -->
        <div class="lg:col-span-3 space-y-6">
          <h4 class="font-bold text-lg mb-6 text-foreground border-b-2 border-primary inline-block pb-1">Kết Nối Với Chúng Tôi</h4>
          <div class="space-y-3 text-muted-foreground">
             <p class="flex items-start gap-3">
                <MapPinIcon class="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>134 Nguyễn Thị Định, P.Buôn Ma Thuột, Tỉnh Đắk Lắk</span>
             </p>
             <p class="flex items-center gap-3">
                <PhoneIcon class="w-5 h-5 text-primary flex-shrink-0" />
                <span>1900-OCEAN (1900 6232)</span>
             </p>
             <p class="flex items-center gap-3">
                <MailIcon class="w-5 h-5 text-primary flex-shrink-0" />
                <span>contact@oceanbooks.vn</span>
             </p>
          </div>

          <!-- Social Icons -->
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm">
               <FacebookIcon class="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group shadow-sm">
               <InstagramIcon class="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group shadow-sm">
               <YoutubeIcon class="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-border pt-8 text-center text-muted-foreground text-sm">
        © 2026 Ocean Books. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
   MapPinIcon, 
   PhoneIcon, 
   MailIcon,
   FacebookIcon,
   InstagramIcon,
   YoutubeIcon
} from 'lucide-vue-next'
</script>
