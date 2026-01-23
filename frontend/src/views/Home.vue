<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
              🎉 Giảm giá 20% cho đơn hàng đầu tiên
            </div>
            <h1 class="text-4xl md:text-6xl font-bold leading-tight">
              Khám phá thế giới 
              <span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                tri thức
              </span>
            </h1>
            <p class="text-lg text-muted-foreground max-w-lg">
              Hàng ngàn cuốn sách hay đang chờ đợi bạn. Từ văn học, khoa học đến kỹ năng sống - tất cả đều có tại Bookstore.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/products">
                <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  Khám phá ngay
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </router-link>
              <router-link to="/about">
                <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                  Tìm hiểu thêm
                </button>
              </router-link>
            </div>
          </div>
          <div class="relative hidden md:block">
            <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl"></div>
            <div class="relative bg-card rounded-2xl border shadow-2xl p-8">
              <div class="grid grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="aspect-[3/4] rounded-lg bg-gradient-to-br from-muted to-muted/50 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Bookstore mang đến trải nghiệm mua sách tốt nhất với nhiều ưu đãi hấp dẫn.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
              {{ feature.icon }}
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-muted-foreground text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 text-center text-primary-foreground">
          <h2 class="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
          <p class="mb-8 opacity-90 max-w-lg mx-auto">
            Nhận thông tin về sách mới, khuyến mãi và nhiều ưu đãi độc quyền.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              class="flex-1 h-11 px-4 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button class="h-11 px-6 rounded-md bg-white text-primary font-medium hover:bg-white/90 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  {
    icon: '📚',
    title: 'Đa dạng sách',
    description: 'Hơn 10,000 đầu sách từ nhiều thể loại khác nhau, đáp ứng mọi nhu cầu đọc sách của bạn.'
  },
  {
    icon: '🚚',
    title: 'Giao hàng nhanh',
    description: 'Miễn phí giao hàng cho đơn từ 300K. Giao hàng toàn quốc trong 2-5 ngày.'
  },
  {
    icon: '💯',
    title: 'Cam kết chất lượng',
    description: 'Sách chính hãng 100%. Đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất.'
  }
]
</script>
