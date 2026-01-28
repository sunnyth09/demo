<template>
  <div class="min-h-screen bg-background text-foreground overflow-x-hidden">
    <!-- 1. Hero Section -->
    <section 
      class="relative min-h-[600px] md:h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50"
      @mousemove="handleMouseMove"
    >
      <!-- Background Pattern (Dots) -->
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(#4f46e5 1px, transparent 1px); background-size: 24px 24px;"></div>

      <!-- Living Background (Animated Gradient Mesh) -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-200/30 rounded-full blur-3xl animate-blob mix-blend-multiply filter"></div>
        <div class="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-multiply filter"></div>
        <div class="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-200/30 rounded-full blur-3xl animate-blob animation-delay-4000 mix-blend-multiply filter"></div>
      </div>

      <div class="container relative z-10 mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6 animate-fade-in-up md:pr-8 z-20">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full py-2.5 px-5 shadow-sm">
               <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
               </span>
               <span class="text-xs md:text-sm font-bold tracking-wide uppercase text-primary"> Hội sách Mùa Xuân 2026</span>
            </div>

            <!-- Headings with Typewriter -->
            <div class="space-y-2">
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                Mở ra
              </h1>
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight min-h-[1.2em]">
                <span class="text-primary">
                  {{ typewriterText }}
                </span>
                <span class="animate-blink text-primary font-light">|</span>
              </h1>
            </div>

            <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              <span class="font-semibold text-primary">Ocean Books</span> - Đại dương tri thức. Khám phá hàng ngàn tựa sách tuyển chọn và nâng tầm tư duy của bạn.
            </p>

            <!-- Buttons -->
            <div class="flex flex-wrap gap-4 pt-2">
               <router-link to="/products" class="relative overflow-hidden px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 group">
                  <span class="relative z-10 flex items-center gap-2">
                    Khám phá ngay
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
               </router-link>
               <button class="px-8 py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-full font-bold shadow-md transition-all hover:-translate-y-1 hover:shadow-lg group flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                  Xem video
               </button>
            </div>

            <!-- Glassmorphism Stats Card -->
            <div class="flex items-center gap-6 pt-4">
               <div class="flex items-center gap-4 bg-white/60 backdrop-blur-lg rounded-2xl px-5 py-3 border border-white/80 shadow-lg">
                  <div class="flex -space-x-3">
                     <img class="w-10 h-10 rounded-full border-[3px] border-white shadow-md object-cover" src="https://i.pravatar.cc/100?img=12" alt="User 1"/>
                     <img class="w-10 h-10 rounded-full border-[3px] border-white shadow-md object-cover" src="https://i.pravatar.cc/100?img=25" alt="User 2"/>
                     <img class="w-10 h-10 rounded-full border-[3px] border-white shadow-md object-cover" src="https://i.pravatar.cc/100?img=33" alt="User 3"/>
                     <div class="w-10 h-10 rounded-full border-[3px] border-white shadow-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">+9k</div>
                  </div>
                  <div class="border-l border-slate-200 pl-4">
                     <p class="text-2xl font-black text-slate-900">10,000+</p>
                     <p class="text-xs text-slate-500 font-medium">Độc giả tin tưởng</p>
                  </div>
               </div>
               
               <div class="hidden lg:flex items-center gap-2 text-slate-500 text-sm">
                  <div class="flex text-yellow-400 text-lg">★★★★★</div>
                  <span class="font-semibold text-slate-700">4.9/5</span>
                  <span class="text-slate-400">(2.5k reviews)</span>
               </div>
            </div>
          </div>

          <!-- Right Image (3D Parallax Tilt) -->
          <div class="relative hidden md:block perspective-1000">
            <div 
              class="relative z-10 w-full aspect-square max-w-md mx-auto transition-transform duration-200 ease-out preserve-3d"
              :style="parallaxStyle"
            >
               <!-- Decorative Rotating Text Ring -->
               <div class="absolute top-[10%] left-[10%] w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 animate-[spin_20s_linear_infinite]">
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <defs>
                      <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text font-size="10" font-weight="bold" fill="currentColor">
                      <textPath xlink:href="#circle">OCEAN BOOKS • DISCOVER KNOWLEDGE • READ MORE •</textPath>
                    </text>
                  </svg>
               </div>

               <!-- Image 5: NEW FILLER (Top Left - The Red Box Area) -->
               <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600" 
                  class="absolute top-0 -left-12 w-[55%] h-[65%] object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-20 transform translate-z-15 border-4 border-white -rotate-12 hover:rotate-0 transition-transform duration-500"
                  alt="Book Featured"
               />

               <!-- Image 1: Main (Center Right) -->
               <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                  class="absolute top-16 left-24 w-[60%] h-[70%] object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-30 transform translate-z-25 border-4 border-white transition-transform duration-500 hover:scale-105"
                  alt="Book Main"
               />

               <!-- Image 2: Top Right (Small) -->
               <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600" 
                  class="absolute -top-8 -right-8 w-[40%] h-[35%] object-cover rounded-3xl shadow-2xl z-10 transform translate-z-5 border-4 border-white rotate-12 hover:rotate-0 transition-all duration-500"
                  alt="Book Top"
               />

               <!-- Image 3: Bottom Right (Medium) -->
               <img 
                  src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600" 
                  class="absolute bottom-0 -right-4 w-[45%] h-[45%] object-cover rounded-3xl shadow-2xl z-40 transform translate-z-30 border-4 border-white -rotate-6 hover:rotate-0 transition-all duration-500"
                  alt="Book Bottom"
               />

               <!-- Image 4: Bottom Left (Small) -->
               <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" 
                  class="absolute -bottom-12 left-4 w-[35%] h-[35%] object-cover rounded-2xl shadow-xl z-50 transform translate-z-40 border-4 border-white rotate-6 hover:rotate-0 transition-all duration-500"
                  alt="Book Tiny"
               />
               
               <!-- 3D Floating Sphere (Decoration) -->
               <div class="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-sm opacity-60 animate-blob mix-blend-multiply z-0"></div>
               <div class="absolute top-10 right-20 w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-[2px] opacity-80 animate-ping z-10"></div>
               
               <!-- Decorative Main Glow -->
               <div class="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10 transform scale-125"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Services / USP -->
    <section class="py-12 bg-primary">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="(feature, index) in features" :key="index" class="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/20 hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-2xl bg-primary-foreground flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <component :is="feature.icon" class="w-7 h-7 text-primary" />
            </div>
            <h3 class="font-bold text-primary-foreground text-lg">{{ feature.title }}</h3>
            <p class="text-sm text-primary-foreground/70">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Featured Categories -->
    <section class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span class="text-primary font-bold text-sm uppercase tracking-wider">Khám phá</span>
            <h2 class="text-3xl md:text-4xl font-black text-foreground mt-2">Danh mục nổi bật</h2>
            <p class="text-muted-foreground mt-2">Khám phá các thể loại được yêu thích nhất</p>
          </div>
          <router-link to="/products" class="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors">
            Xem tất cả 
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </router-link>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <div 
            v-for="(cat, index) in categories.slice(0, 6)" 
            :key="cat.id"
            @click="goToCategory(cat.id)"
            class="group cursor-pointer bg-card rounded-2xl p-6 border border-border hover:border-primary/50 shadow-sm hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[140px] hover:bg-primary hover:-translate-y-1"
          >
            <h3 class="font-bold text-card-foreground group-hover:text-primary-foreground transition-colors duration-300">{{ cat.name }}</h3>
            <p class="text-xs text-muted-foreground group-hover:text-primary-foreground/70 mt-1 transition-colors duration-300">{{ [256, 189, 342, 127, 298, 215][index % 6] }}+ sách</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Best Sellers -->
    <section class="py-20 bg-background">
      <div class="container mx-auto px-4">
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-4 py-2 mb-4">
            <span class="text-xl"></span>
            <span class="text-destructive font-bold text-sm uppercase tracking-wider">Top Trending</span>
          </div>
          <h2 class="text-3xl md:text-5xl font-black text-foreground">Sách Bán Chạy Nhất</h2>
          <p class="text-muted-foreground mt-3 max-w-xl mx-auto">Những cuốn sách được độc giả yêu thích và đánh giá cao nhất trong tuần</p>
          <div class="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="h-[400px] bg-muted rounded-2xl animate-pulse"></div>
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
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground min-h-[400px] flex items-center">
          <!-- Background image -->
          <div class="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" 
              alt="Reading" 
              class="w-full h-full object-cover opacity-20"
            />
            <div class="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div class="relative z-10 p-8 md:p-16 max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-destructive text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
              <span>⚡</span>
              <span>Giới hạn thời gian</span>
            </div>
            
            <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Tuần Lễ Sách Quốc Tế <br/>
              <span class="text-yellow-300">Giảm Tới 70%</span>
            </h2>
            
            <p class="text-lg text-primary-foreground/80 mb-8 leading-relaxed max-w-lg">
              Cơ hội sở hữu những cuốn sách ngoại văn kinh điển với mức giá không thể tốt hơn. Số lượng có hạn!
            </p>
            
            <div class="flex flex-wrap gap-6 items-center">
              <button class="px-8 py-4 bg-white text-foreground rounded-full font-bold hover:bg-secondary transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2 group">
                Mua ngay
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </button>
              
              <!-- Countdown Timer -->
              <div class="flex gap-3 items-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <div class="text-center">
                  <span class="block text-3xl font-black font-mono">03</span>
                  <span class="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Ngày</span>
                </div>
                <span class="text-2xl font-bold text-primary-foreground/50">:</span>
                <div class="text-center">
                  <span class="block text-3xl font-black font-mono">12</span>
                  <span class="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Giờ</span>
                </div>
                <span class="text-2xl font-bold text-primary-foreground/50">:</span>
                <div class="text-center">
                  <span class="block text-3xl font-black font-mono">45</span>
                  <span class="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Phút</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. New Arrivals & On Sale Tabs -->
    <section class="py-20 bg-muted/50">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <span class="text-primary font-bold text-sm uppercase tracking-wider">Bộ sưu tập</span>
          <h2 class="text-3xl md:text-4xl font-black text-foreground mt-2">Khám phá sản phẩm</h2>
          <p class="text-muted-foreground mt-2">Tìm kiếm cuốn sách phù hợp với bạn</p>
        </div>

        <!-- Tabs Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div class="flex bg-card p-1.5 rounded-2xl shadow-md border border-border">
            <button 
              v-for="(tab, idx) in ['new_arrival', 'on_sale', 'recommend']" 
              :key="tab"
              @click="activeTab = tab"
              class="px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
              :class="activeTab === tab ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted'"
            >
              <span v-if="idx === 0"></span>
              <span v-else-if="idx === 1"></span>
              <span v-else></span>
              {{ 
                tab === 'new_arrival' ? 'Mới phát hành' : 
                tab === 'on_sale' ? 'Đang giảm giá' : 'Gợi ý cho bạn' 
              }}
            </button>
          </div>
          
          <router-link to="/products" class="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors">
            Đến cửa hàng
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </router-link>
        </div>

        <!-- Grid Content -->
        <transition 
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          mode="out-in"
        >
          <div :key="activeTab" class="grid grid-cols-2 md:grid-cols-4 gap-6">
             <ProductCard 
              v-for="product in currentTabProducts" 
              :key="product.id" 
              :product="product"
              @click-product="goToDetail"
              @add-to-cart="addToCart"
            />
            <!-- Empty State -->
            <div v-if="currentTabProducts.length === 0" class="col-span-full py-20 text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <p class="text-muted-foreground font-medium">Đang cập nhật sản phẩm...</p>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- 7. Testimonials -->
    <section class="py-20 bg-background">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="text-primary font-bold text-sm uppercase tracking-wider">Đánh giá</span>
          <h2 class="text-3xl md:text-4xl font-black text-foreground mt-3">Khách hàng nói gì về chúng tôi?</h2>
          <p class="text-muted-foreground mt-4 max-w-xl mx-auto">Hàng ngàn độc giả đã tin tưởng và đánh giá cao dịch vụ của Ocean Books</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="bg-card p-8 rounded-2xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border">
            <div class="absolute -top-4 -right-4 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-serif shadow-md">"</div>
            <div class="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" class="w-12 h-12 rounded-xl border-2 border-border object-cover" />
              <div>
                <h4 class="font-bold text-card-foreground">Nguyễn Thu Hà</h4>
                <p class="text-sm text-primary font-medium">Sinh viên ĐH Quốc Gia</p>
              </div>
            </div>
            <p class="text-muted-foreground leading-relaxed mb-4">
              "Giao hàng siêu nhanh, đóng gói cẩn thận. Sách còn nguyên seal, rất đẹp. Mình sẽ ủng hộ shop dài dài!"
            </p>
            <div class="flex items-center justify-between">
              <div class="flex text-yellow-400 text-lg">★★★★★</div>
              <span class="text-xs text-muted-foreground">2 ngày trước</span>
            </div>
          </div>

          <!-- Card 2 (Featured) -->
          <div class="bg-primary p-8 rounded-2xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform md:-translate-y-2 shadow-lg text-primary-foreground">
            <div class="absolute -top-4 -right-4 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary text-2xl font-serif shadow-md">"</div>
            <div class="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?img=11" alt="User" class="w-12 h-12 rounded-xl border-2 border-white/30 object-cover" />
              <div>
                <h4 class="font-bold">Trần Minh Tuấn</h4>
                <p class="text-sm text-primary-foreground/70 font-medium">Nhân viên văn phòng</p>
              </div>
            </div>
            <p class="text-primary-foreground/90 leading-relaxed mb-4">
              "Mình tìm mãi mới thấy cuốn sách chuyên ngành này. Giá cả rất hợp lý so với thị trường. Tư vấn nhiệt tình."
            </p>
            <div class="flex items-center justify-between">
              <div class="flex text-yellow-300 text-lg">★★★★★</div>
              <span class="text-xs text-primary-foreground/60">5 ngày trước</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-card p-8 rounded-2xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border">
            <div class="absolute -top-4 -right-4 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-serif shadow-md">"</div>
            <div class="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?img=5" alt="User" class="w-12 h-12 rounded-xl border-2 border-border object-cover" />
              <div>
                <h4 class="font-bold text-card-foreground">Lê Bảo Ngọc</h4>
                <p class="text-sm text-primary font-medium">Freelancer</p>
              </div>
            </div>
            <p class="text-muted-foreground leading-relaxed mb-4">
              "Giao diện web đẹp, dễ sử dụng. Mình thích nhất chức năng gợi ý sách, rất đúng gu đọc của mình."
            </p>
            <div class="flex items-center justify-between">
              <div class="flex text-yellow-400 text-lg">★★★★★</div>
              <span class="text-xs text-muted-foreground">1 tuần trước</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Blog / News -->
    <section class="py-20 bg-muted/50">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span class="text-primary font-bold text-sm uppercase tracking-wider">Blog</span>
            <h2 class="text-3xl md:text-4xl font-black text-foreground mt-2">Góc đọc sách</h2>
            <p class="text-muted-foreground mt-2">Cập nhật tin tức, review và bí quyết đọc sách hiệu quả</p>
          </div>
          <button class="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors">
            Xem thêm tin tức
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(blog, i) in blogPosts" :key="i" class="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div class="aspect-[4/3] relative overflow-hidden">
              <img 
                :src="blog.image" 
                alt="Blog" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-card-foreground shadow-sm">
                {{ blog.date }}
              </div>
              <div class="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-xs font-bold text-primary-foreground shadow-sm">
                {{ blog.category }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-card-foreground mb-3 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                {{ blog.title }}
              </h3>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
                {{ blog.excerpt }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img :src="blog.authorAvatar" class="w-8 h-8 rounded-full object-cover" :alt="blog.author"/>
                  <span class="text-sm font-medium text-muted-foreground">{{ blog.author }}</span>
                </div>
                <button class="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group/btn">
                  Đọc tiếp
                  <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Newsletter -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="relative bg-primary rounded-3xl p-8 md:p-16 text-primary-foreground overflow-hidden">
          <div class="relative z-10 max-w-2xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-black mb-4 leading-tight">Đăng ký nhận thông tin</h2>
            <p class="text-lg text-primary-foreground/80 mb-10 max-w-lg mx-auto">
              Nhận ngay mã giảm giá <span class="font-bold text-yellow-300">20%</span> cho đơn hàng đầu tiên và cập nhật những cuốn sách mới nhất.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                class="flex-1 bg-white/10 border-none text-primary-foreground placeholder-primary-foreground/60 focus:ring-2 focus:ring-white/30 rounded-xl px-5 h-14 text-lg"
              />
              <button class="h-14 px-8 rounded-xl bg-white text-primary font-bold hover:bg-secondary transition-all shadow-lg flex items-center justify-center gap-2 group">
                Đăng ký ngay
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </button>
            </div>
            
            <p class="mt-6 text-sm text-primary-foreground/50 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Chúng tôi cam kết không spam. Hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { 
  Truck, ShieldCheck, RefreshCw, BookOpen 
} from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

// State
const categories = ref([]);
const products = ref([]);
const loading = ref(true);
const activeTab = ref('new_arrival');

// Blog Posts Data
const blogPosts = ref([
  {
    title: 'Top 10 cuốn sách thay đổi tư duy làm giàu năm 2026',
    excerpt: 'Khám phá những tựa sách kinh tế bán chạy nhất tuần qua và bài học rút ra từ chúng...',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    date: '27 T1, 2026',
    category: 'Review Sách',
    author: 'Minh Anh',
    authorAvatar: 'https://i.pravatar.cc/100?img=47'
  },
  {
    title: '5 thói quen đọc sách hiệu quả của người thành công',
    excerpt: 'Tại sao những người thành đạt luôn dành thời gian đọc sách mỗi ngày?',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    date: '25 T1, 2026',
    category: 'Kinh nghiệm',
    author: 'Thu Hằng',
    authorAvatar: 'https://i.pravatar.cc/100?img=32'
  },
  {
    title: 'Sách thiếu nhi hay nhất cho bé từ 3-7 tuổi',
    excerpt: 'Danh sách những cuốn sách giúp phát triển trí tuệ và cảm xúc cho trẻ nhỏ...',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600',
    date: '22 T1, 2026',
    category: 'Sách Thiếu Nhi',
    author: 'Quốc Bảo',
    authorAvatar: 'https://i.pravatar.cc/100?img=15'
  }
]);

// Typewriter Effect
const typewriterText = ref('');
const words = ['Tri Thức Mới', 'Tương Lai', 'Thế Giới', 'Thành Công'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 50; // Faster speed

// Parallax Effect
const parallaxStyle = ref({});

const handleMouseMove = (e) => {
  const { clientX, clientY } = e;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Calculate percentage from center (-1 to 1)
  const moveX = (clientX - centerX) / centerX;
  const moveY = (clientY - centerY) / centerY;

  parallaxStyle.value = {
    transform: `rotateY(${moveX * 10}deg) rotateX(${-moveY * 10}deg)`
  };
};

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

const API_URL = "http://localhost:3000/api";

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

const addToCart = (product) => {
  cartStore.addToCart(product);
  // Optional: Show toast
  alert(`Đã thêm ${product.name} vào giỏ hàng`);
};

// Data Fetching
const fetchData = async () => {
  loading.value = true;
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_URL}/categories`),
      fetch(`${API_URL}/products?limit=20&sort=newest`)
    ]);

    const catJson = await catRes.json();
    const prodJson = await prodRes.json();

    if (catJson.status) categories.value = catJson.data || [];
    if (prodJson.status) products.value = prodJson.data || [];

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
</style>
