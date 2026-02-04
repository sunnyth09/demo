<template>
  <div class="min-h-screen bg-background text-foreground overflow-x-hidden">
    <!-- 1. Hero Section -->
    <section 
      class="relative min-h-[650px] md:min-h-[750px] flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/30"
    >
      <!-- Subtle Background Pattern -->
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(circle, var(--primary) 1px, transparent 1px); background-size: 28px 28px;"></div>
      
      <!-- Soft gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50"></div>
      
      <!-- Animated gradient blobs - softer colors -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-sky-100/50 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div class="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <!-- Left Content -->
          <div class="space-y-6 md:space-y-8">
            <!-- Badge -->
            <div class="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full py-2 px-4 shadow-sm backdrop-blur-sm">
               <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
               </span>
               <span class="text-xs font-bold tracking-wide text-primary uppercase">Hội sách Mùa Xuân 2026</span>
            </div>

            <!-- Headings with Typewriter -->
            <div class="space-y-2">
              <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
                Mở ra
              </h1>
              <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight min-h-[1.2em]">
                <span class="text-primary">
                  {{ typewriterText }}
                </span>
                <span class="animate-blink text-primary font-light">|</span>
              </h1>
            </div>

            <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              <span class="font-bold text-foreground">Ocean Books</span> - Đại dương tri thức. Khám phá hàng ngàn tựa sách tuyển chọn và nâng tầm tư duy của bạn.
            </p>

            <!-- Buttons -->
            <div class="flex flex-wrap gap-3">
               <router-link to="/products" class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-sm shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-2 group">
                  Khám phá ngay
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </router-link>
               <button class="px-5 py-2.5 bg-card hover:bg-muted text-foreground border border-border rounded-xl font-semibold text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  Xem video
               </button>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap items-center gap-8 pt-6 border-t border-border/50">
               <div class="flex items-center gap-4">
                  <div class="flex -space-x-3">
                     <img class="w-11 h-11 rounded-full border-[3px] border-background shadow-lg object-cover ring-2 ring-primary/20" src="https://i.pravatar.cc/100?img=12" alt="User"/>
                     <img class="w-11 h-11 rounded-full border-[3px] border-background shadow-lg object-cover ring-2 ring-primary/20" src="https://i.pravatar.cc/100?img=25" alt="User"/>
                     <img class="w-11 h-11 rounded-full border-[3px] border-background shadow-lg object-cover ring-2 ring-primary/20" src="https://i.pravatar.cc/100?img=33" alt="User"/>
                     <div class="w-11 h-11 rounded-full border-[3px] border-background shadow-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold ring-2 ring-primary/20">+9k</div>
                  </div>
                  <div>
                     <p class="text-xl font-black text-foreground">10,000+</p>
                     <p class="text-xs text-muted-foreground font-medium">Độc giả tin tưởng</p>
                  </div>
               </div>
               
               <div class="hidden sm:flex items-center gap-3 bg-card px-4 py-2 rounded-xl border border-border">
                  <div class="flex text-yellow-500 text-lg">★★★★★</div>
                  <div>
                    <span class="font-bold text-foreground">4.9/5</span>
                    <span class="text-muted-foreground text-sm ml-1">(2.5k)</span>
                  </div>
               </div>
            </div>
          </div>

          <!-- Right - Hero Image Collage -->
          <div class="relative hidden md:block h-[550px] lg:h-[600px]">
            <!-- Main Featured Book (Large, Center) -->
            <div class="absolute top-[8%] left-[15%] w-[50%] h-[60%] z-30 animate-float">
              <div class="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 group">
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Featured Book"
                />
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div class="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-1">
                <Star class="w-3 h-3 fill-current" /> Bestseller
              </div>
            </div>
            
            <!-- Top Right Book -->
            <div class="absolute top-0 right-[5%] w-[38%] h-[35%] z-20 animate-float-delayed">
              <div class="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600" 
                  class="w-full h-full object-cover"
                  alt="Book Collection"
                />
              </div>
            </div>
            
            <!-- Bottom Right Book -->
            <div class="absolute bottom-[5%] right-0 w-[42%] h-[38%] z-40 animate-float">
              <div class="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600" 
                  class="w-full h-full object-cover"
                  alt="Reading Person"
                />
              </div>
            </div>
            
            <!-- Bottom Left Book -->
            <div class="absolute bottom-[15%] left-[5%] w-[32%] h-[28%] z-50 animate-float-delayed">
              <div class="relative w-full h-full rounded-xl overflow-hidden shadow-lg border-4 border-white transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" 
                  class="w-full h-full object-cover"
                  alt="Book Stack"
                />
              </div>
              <div class="absolute -bottom-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                -30%
              </div>
            </div>
            
            <!-- Extra Top Left Book -->
            <div class="absolute top-[12%] left-0 w-[25%] h-[22%] z-10">
              <div class="w-full h-full rounded-xl overflow-hidden shadow-lg border-3 border-white transform -rotate-12 opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400" 
                  class="w-full h-full object-cover"
                  alt="Book"
                />
              </div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="absolute top-[20%] right-[45%] w-16 h-16 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
            <div class="absolute bottom-[40%] right-[10%] w-10 h-10 bg-yellow-400/30 rounded-full blur-sm animate-ping"></div>
            <div class="absolute top-[5%] left-[40%] w-8 h-8 bg-blue-400/30 rounded-full animate-bounce"></div>
            
            <!-- Glow effects -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div class="absolute top-[10%] left-[10%] w-32 h-32 bg-blue-500/15 rounded-full blur-2xl -z-10"></div>
            <div class="absolute bottom-[10%] right-[10%] w-40 h-40 bg-purple-500/15 rounded-full blur-2xl -z-10"></div>
            
            <!-- Floating stars -->
            <div class="absolute top-[15%] right-[25%] text-yellow-400 animate-pulse">
               <Sparkles class="w-6 h-6" />
            </div>
            <div class="absolute bottom-[25%] left-[25%] text-yellow-400 animate-pulse animation-delay-2000">
               <Sparkles class="w-5 h-5" />
            </div>
            
            <!-- Reading quote card -->
            <div class="absolute bottom-[2%] left-[35%] bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-border z-50 hidden lg:block">
              <p class="text-xs text-muted-foreground italic">"Đọc sách mỗi ngày..."</p>
              <div class="flex items-center gap-1 mt-1">
                <div class="w-4 h-4 rounded-full bg-primary"></div>
                <span class="text-[10px] font-medium text-foreground">Ocean Reader</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Services / USP -->
    <section class="py-16 bg-primary">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div v-for="(feature, index) in features" :key="index" class="flex flex-col items-center text-center p-5 md:p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <component :is="feature.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold text-white text-sm md:text-base">{{ feature.title }}</h3>
            <p class="text-xs text-white/60 mt-1 hidden md:block">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Featured Categories -->
    <section class="py-16 md:py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-foreground">Danh mục nổi bật</h2>
            <p class="text-muted-foreground mt-1 text-sm md:text-base">Khám phá các thể loại được yêu thích nhất</p>
          </div>
          <router-link to="/products" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
            Xem tất cả 
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </router-link>
        </div>

        <!-- Category Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <div 
            v-for="(cat, index) in categories.slice(0, 6)" 
            :key="cat.id"
            @click="goToCategory(cat.id)"
            class="group cursor-pointer bg-card rounded-xl p-5 border border-border hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 text-center hover:-translate-y-1"
          >
            <h3 class="font-semibold text-card-foreground group-hover:text-primary transition-colors text-sm md:text-base">{{ cat.name }}</h3>
            <p class="text-xs text-muted-foreground mt-1">{{ [256, 189, 342, 127, 298, 215][index % 6] }}+ sách</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Best Sellers -->
    <section class="py-16 md:py-20 bg-background">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-3 py-1.5 mb-3">
            <span class="text-destructive font-semibold text-xs uppercase tracking-wider">Top Trending</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">Sách Bán Chạy Nhất</h2>
          <p class="text-muted-foreground mt-2 text-sm md:text-base max-w-lg mx-auto">Những cuốn sách được độc giả yêu thích và đánh giá cao nhất trong tuần</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div v-for="i in 4" :key="i" class="h-[320px] md:h-[380px] bg-muted rounded-xl animate-pulse"></div>
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in bestSellers" 
            :key="product.id" 
            :product="product"
            @click-product="goToDetail"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </section>

    <!-- 5. Break Banner (Promo) -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="relative rounded-2xl overflow-hidden bg-primary text-primary-foreground">
          <!-- Background image -->
          <div class="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" 
              alt="Reading" 
              class="w-full h-full object-cover opacity-15"
            />
          </div>
          
          <div class="relative z-10 p-8 md:p-12 lg:p-16">
            <div class="max-w-xl">
              <div class="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Zap class="w-3.5 h-3.5 fill-current" />
                <span>Giới hạn thời gian</span>
              </div>
              
              <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Tuần Lễ Sách Quốc Tế <br/>
                <span class="text-yellow-300">Giảm Tới 70%</span>
              </h2>
              
              <p class="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                Cơ hội sở hữu những cuốn sách ngoại văn kinh điển với mức giá không thể tốt hơn.
              </p>
              
              <div class="flex flex-wrap gap-4 items-center">
                <router-link to="/products" class="px-6 py-3 bg-white text-foreground rounded-xl font-semibold hover:bg-white/90 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 text-sm group">
                  Mua ngay
                  <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </router-link>
                
                <!-- Countdown Timer -->
                <div class="flex gap-2 items-center text-sm">
                  <div class="bg-white/15 rounded-lg px-3 py-2 text-center min-w-[50px]">
                    <span class="block text-lg font-bold">03</span>
                    <span class="text-[10px] text-white/60">Ngày</span>
                  </div>
                  <span class="font-bold text-white/50">:</span>
                  <div class="bg-white/15 rounded-lg px-3 py-2 text-center min-w-[50px]">
                    <span class="block text-lg font-bold">12</span>
                    <span class="text-[10px] text-white/60">Giờ</span>
                  </div>
                  <span class="font-bold text-white/50">:</span>
                  <div class="bg-white/15 rounded-lg px-3 py-2 text-center min-w-[50px]">
                    <span class="block text-lg font-bold">45</span>
                    <span class="text-[10px] text-white/60">Phút</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. New Arrivals & On Sale Tabs -->
    <section class="py-16 md:py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-foreground">Khám phá sản phẩm</h2>
            <p class="text-muted-foreground mt-1 text-sm md:text-base">Tìm kiếm cuốn sách phù hợp với bạn</p>
          </div>
          <router-link to="/products" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
            Xem tất cả
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </router-link>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2"
            :class="activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-muted-foreground hover:bg-muted border border-border'"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Grid Content -->
        <transition 
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          mode="out-in"
        >
          <div :key="activeTab" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             <ProductCard 
              v-for="product in currentTabProducts" 
              :key="product.id" 
              :product="product"
              @click-product="goToDetail"
              @add-to-cart="addToCart"
            />
            <!-- Empty State -->
            <div v-if="currentTabProducts.length === 0" class="col-span-full py-16 text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <p class="text-muted-foreground text-sm">Đang cập nhật sản phẩm...</p>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- 7. Testimonials -->
    <section class="py-16 md:py-20 bg-background">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">Khách hàng nói gì về chúng tôi?</h2>
          <p class="text-muted-foreground mt-2 text-sm md:text-base max-w-lg mx-auto">Hàng ngàn độc giả đã tin tưởng và đánh giá cao dịch vụ của Ocean Books</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="bg-card p-6 rounded-xl border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div class="flex text-yellow-500 text-sm mb-4">★★★★★</div>
            <p class="text-muted-foreground text-sm leading-relaxed mb-4">
              "Giao hàng siêu nhanh, đóng gói cẩn thận. Sách còn nguyên seal, rất đẹp. Mình sẽ ủng hộ shop dài dài!"
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-border">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="font-semibold text-card-foreground text-sm">Nguyễn Thu Hà</h4>
                <p class="text-xs text-muted-foreground">Sinh viên</p>
              </div>
            </div>
          </div>

          <!-- Card 2 (Featured) -->
          <div class="bg-primary p-6 rounded-xl shadow-lg text-primary-foreground md:-translate-y-2">
            <div class="flex text-yellow-300 text-sm mb-4">★★★★★</div>
            <p class="text-white/90 text-sm leading-relaxed mb-4">
              "Mình tìm mãi mới thấy cuốn sách chuyên ngành này. Giá cả rất hợp lý so với thị trường. Tư vấn nhiệt tình."
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-white/20">
              <img src="https://i.pravatar.cc/150?img=11" alt="User" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="font-semibold text-sm">Trần Minh Tuấn</h4>
                <p class="text-xs text-white/70">Nhân viên văn phòng</p>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-card p-6 rounded-xl border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div class="flex text-yellow-500 text-sm mb-4">★★★★★</div>
            <p class="text-muted-foreground text-sm leading-relaxed mb-4">
              "Giao diện web đẹp, dễ sử dụng. Mình thích nhất chức năng gợi ý sách, rất đúng gu đọc của mình."
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-border">
              <img src="https://i.pravatar.cc/150?img=5" alt="User" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="font-semibold text-card-foreground text-sm">Lê Bảo Ngọc</h4>
                <p class="text-xs text-muted-foreground">Freelancer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Blog / News -->
    <section class="py-16 md:py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-foreground">Góc đọc sách</h2>
            <p class="text-muted-foreground mt-1 text-sm md:text-base">Cập nhật tin tức, review và bí quyết đọc sách hiệu quả</p>
          </div>
          <router-link to="/articles" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
            Xem thêm
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </router-link>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="blog in blogPosts" 
            :key="blog.id" 
            @click="router.push(`/articles/${blog.id}`)"
            class="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div class="aspect-[16/10] relative overflow-hidden">
              <img 
                :src="blog.image" 
                alt="Blog" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute top-3 left-3 bg-primary px-2 py-1 rounded text-xs font-medium text-primary-foreground">
                {{ blog.category }}
              </div>
            </div>
            <div class="p-5">
              <p class="text-xs text-muted-foreground mb-2">{{ blog.date }}</p>
              <h3 class="font-semibold text-card-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2 text-sm md:text-base">
                {{ blog.title }}
              </h3>
              <p class="text-xs text-muted-foreground line-clamp-2 mb-4">
                {{ blog.excerpt }}
              </p>
              <div class="flex items-center gap-2">
                <img :src="blog.authorAvatar" class="w-6 h-6 rounded-full object-cover" :alt="blog.author"/>
                <span class="text-xs text-muted-foreground">{{ blog.author }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Newsletter -->
    <section class="py-16 md:py-20">
      <div class="container mx-auto px-4">
        <div class="relative bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground overflow-hidden">
          <div class="relative z-10 max-w-lg mx-auto text-center">
            <h2 class="text-xl md:text-2xl font-bold mb-3">Đăng ký nhận thông tin</h2>
            <p class="text-sm text-white/80 mb-6">
              Nhận ngay mã giảm giá <span class="font-semibold text-yellow-300">20%</span> cho đơn hàng đầu tiên
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                class="flex-1 bg-white/15 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent rounded-lg px-4 h-12 text-sm"
              />
              <button class="h-12 px-6 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition-all shadow-md flex items-center justify-center gap-2 text-sm">
                Đăng ký
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            
            <p class="mt-4 text-xs text-white/50 flex items-center justify-center gap-1">
              <Lock class="w-3 h-3" /> Chúng tôi cam kết không spam
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div 
          v-if="showToast" 
          class="fixed bottom-6 right-6 z-[100] bg-card border border-border rounded-xl shadow-2xl p-4 flex items-center gap-3 max-w-sm"
        >
          <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-sm text-foreground font-medium">{{ toastMessage }}</p>
          <button 
            @click="showToast = false" 
            class="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { 
  Truck, ShieldCheck, RefreshCw, BookOpen, Sparkles, Tag, Lightbulb, Zap, Lock, Star 
} from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

// State
const categories = ref([]);
const products = ref([]);
const loading = ref(true);
const activeTab = ref('new_arrival');

const tabs = [
  { id: 'new_arrival', label: 'Mới phát hành', icon: Sparkles },
  { id: 'on_sale', label: 'Đang giảm giá', icon: Tag },
  { id: 'recommend', label: 'Gợi ý cho bạn', icon: Lightbulb }
];

// Blog Posts Data
const blogPosts = ref([]);

// Typewriter Effect
const typewriterText = ref('');
const words = ['Tri Thức Mới', 'Tương Lai', 'Thế Giới', 'Thành Công'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 50; // Faster speed

const typeWriter = () => {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typewriterText.value = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 30; // Faster deleting
  } else {
    typewriterText.value = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 80; // Faster typing
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 1500; // Shorter pause before deleting
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 300; // Shorter pause before starting new word
  }

  setTimeout(typeWriter, typeSpeed);
};

const features = [
  { icon: BookOpen, title: 'Sách chính hãng', desc: 'Cam kết 100% sách thật' },
  { icon: Truck, title: 'Giao hàng nhanh', desc: '2-4 ngày toàn quốc' },
  { icon: ShieldCheck, title: 'Bảo mật thanh toán', desc: 'An toàn tuyệt đối' },
  { icon: RefreshCw, title: 'Đổi trả miễn phí', desc: 'Trong vòng 7 ngày' },
];

const API_URL = import.meta.env.VITE_API_URL;

const bestSellers = computed(() => {
  return products.value.slice(0, 4);
});

const currentTabProducts = computed(() => {
  if (activeTab.value === 'new_arrival') {
    return products.value.slice(0, 8);
  } else if (activeTab.value === 'on_sale') {
    return products.value.filter(p => p.original_price && p.original_price > p.price).slice(0, 8);
  } else {
    return products.value.slice(4, 12);
  }
});

// Actions
const goToDetail = (id) => {
  router.push(`/products/${id}`);
};

const goToCategory = (id) => {
  router.push({ path: '/products', query: { category_id: id } });
};

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');

const addToCart = (product) => {
  cartStore.addToCart(product);
  // Show toast notification
  toastMessage.value = `Đã thêm "${product.name}" vào giỏ hàng`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Data Fetching
const fetchData = async () => {
  loading.value = true;
  try {
    const [catRes, prodRes, articleRes] = await Promise.all([
      fetch(`${API_URL}/categories`),
      fetch(`${API_URL}/products?limit=20&sort=newest`),
      fetch(`${API_URL}/articles?limit=3&status=published`)
    ]);

    const catJson = await catRes.json();
    const prodJson = await prodRes.json();
    const articleJson = await articleRes.json();

    if (catJson.status) categories.value = catJson.data || [];
    if (prodJson.status) products.value = prodJson.data || [];
    
    if (articleJson.status) {
      blogPosts.value = articleJson.data.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || '',
        image: article.thumbnail || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        date: new Date(article.createdAt).toLocaleDateString('vi-VN'),
        category: 'Tin tức', // Default category
        author: 'Admin', // Default author
        authorAvatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
      }));
    }

  } catch (error) {
    console.error("Error fetching home data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  typeWriter();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Blob Animation */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

/* 3D Parallax */
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.transform-style-3d {
  transform-style: preserve-3d;
}

/* Typewriter Cursor */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s infinite;
}

/* Animated Gradient */
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

/* Float Animation for Hero Images */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 4s ease-in-out infinite;
  animation-delay: 2s;
}
</style>
