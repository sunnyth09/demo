<template>
  <nav class="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
    <div class="container mx-auto flex h-14 md:h-20 items-center justify-between px-3 md:px-4">
      
      <!-- Mobile: Left Section (Hamburger Menu) -->
      <div class="flex items-center md:hidden">
        <button 
          @click="showMobileMenu = !showMobileMenu"
          class="p-2 rounded-lg hover:bg-muted text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile: Center Logo -->
      <router-link to="/" class="md:hidden flex-shrink-0">
        <img src="@/assets/ocean.png" alt="Ocean Books" class="h-12 w-auto object-contain" />
      </router-link>

      <!-- Desktop: Left Section (Logo & Category) -->
      <div class="hidden md:flex items-center gap-6">
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 flex items-center">
          <img src="@/assets/ocean.png" alt="Ocean Books" class="h-17 w-auto object-contain" />
        </router-link>

        <!-- Category Dropdown Button -->
        <div class="relative group">
          <button class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span class="hidden lg:block font-medium text-muted-foreground">Danh mục</span>
          </button>

          <!-- Mega Menu Dropdown -->
          <div v-if="categories.length > 0" class="absolute top-full left-0 mt-2 w-[800px] bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex">
            <!-- Sidebar Categories -->
            <div class="w-64 bg-muted/30 border-r border-border p-2">
              <div 
                v-for="(cat, index) in categories" 
                :key="cat.id"
                @mouseenter="activeCategory = index"
                @click="router.push(`/products?category_id=${cat.id}`)"
                :class="['flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors', activeCategory === index ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground']"
              >
                <span>{{ cat.name }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>

            <!-- Sub Categories Content -->
            <div class="flex-1 p-6 bg-card">
              <div v-if="categories[activeCategory]" class="grid grid-cols-3 gap-6">
                <div v-for="subGroup in categories[activeCategory].subcategories" :key="subGroup.id" class="space-y-3">
                  <h4 
                    class="font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                    @click="router.push(`/products?category_id=${subGroup.id}`)"
                  >
                    {{ subGroup.name }}
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="item in subGroup.subcategories" :key="item.id">
                      <a 
                        @click.prevent="router.push(`/products?category_id=${item.id}`)"
                        href="#" 
                        class="text-sm text-muted-foreground hover:text-primary transition-colors block"
                      >
                        {{ item.name }}
                      </a>
                    </li>
                  </ul>
                  <a 
                    @click.prevent="router.push(`/products?category_id=${subGroup.id}`)"
                    href="#" 
                    class="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Xem tất cả <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Section: Search Bar (Hidden on mobile, show icon instead) -->
      <div class="hidden md:block flex-1 max-w-3xl relative group/search mx-4">
        <div class="relative flex items-center">
          <input 
            type="text" 
            placeholder="Tìm kiếm sách, tác giả, thể loại..." 
            class="w-full h-11 pl-4 pr-12 rounded-lg border-2 border-border bg-muted/20 focus:bg-background focus:border-primary focus:outline-none transition-all"
            v-model="searchQuery"
            @focus="showSuggestions = true"
            @blur="handleSearchBlur"
            @keydown.enter="handleSearch"
          />
          <button 
            @click="handleSearch"
            class="absolute right-0 top-0 h-11 w-12 flex items-center justify-center rounded-r-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </div>

        <!-- Search Suggestions -->
        <div v-if="searchQuery && showSuggestions && (suggestions.products.length > 0 || suggestions.keywords.length > 0)" class="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-4 z-50">
          <p v-if="suggestions.keywords.length > 0" class="text-xs font-semibold text-muted-foreground uppercase mb-2">Danh mục liên quan</p>
          <div v-if="suggestions.keywords.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in suggestions.keywords" 
              :key="tag" 
              @click="router.push(`/products?search=${encodeURIComponent(tag)}`)"
              class="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 cursor-pointer"
            >
              {{ tag }}
            </span>
          </div>
          
          <p v-if="suggestions.products.length > 0" class="text-xs font-semibold text-muted-foreground uppercase mb-2">Sản phẩm gợi ý</p>
          <div class="space-y-2">
            <div 
              v-for="prod in suggestions.products" 
              :key="prod.id" 
              @click="goToProduct(prod.id)"
              class="flex items-center gap-3 p-2 hover:bg-muted/30 rounded-lg cursor-pointer"
            >
              <div class="w-10 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                <img :src="prod.thumbnail" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-medium line-clamp-1">{{ prod.name }}</p>
                <p class="text-xs text-primary font-bold">{{ formatCurrency(prod.price) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center gap-2 md:gap-6 flex-shrink-0">
        <!-- Mobile Search Button -->
        <button 
          @click="showMobileSearch = !showMobileSearch"
          class="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>

        <!-- Voucher Hunt (Hidden on mobile) -->
        <router-link 
          to="/vouchers" 
          class="hidden md:flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition-colors group relative"
        >
          <div class="relative mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-shake" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
            </svg>
            <!-- Badge mã mới -->
            <span v-if="newVouchersCount > 0" class="absolute -top-1 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-bold border-2 border-background animate-bounce">{{ newVouchersCount }}</span>
            <span v-else class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-destructive border-2 border-background"></span>
            </span>
          </div>
          <span class="text-xs font-bold hidden lg:block">Săn Voucher</span>
        </router-link>

        <!-- Cart (Hidden on mobile) -->
        <router-link to="/cart" class="hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
          <div class="relative mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="items.length > 0" class="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold border-2 border-background">{{ items.length }}</span>
          </div>
          <span class="text-xs font-medium hidden lg:block">Giỏ hàng</span>
        </router-link>

        <!-- Account (Hidden on mobile) -->
        <div class="relative group/account hidden md:block">
          <router-link :to="authStore.isAuthenticated ? '/profile' : '/login'" class="flex flex-col items-center gap-0 text-muted-foreground hover:text-primary transition-colors">
            <!-- Avatar nếu đã đăng nhập -->
            <div v-if="authStore.isAuthenticated" class="h-9 w-9 rounded-full overflow-hidden border border-border">
              <img 
                v-if="authStore.user?.avatar" 
                :src="authStore.user.avatar" 
                alt="Avatar" 
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
            </div>
            <!-- Icon nếu chưa đăng nhập -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="text-xs font-medium hidden lg:block">{{ authStore.isAuthenticated ? authStore.user?.name : 'Tài khoản' }}</span>
          </router-link>
          
          <!-- Auth Dropdown -->
          <div class="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg p-2 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-200 z-50">
            <!-- Đã đăng nhập -->
            <template v-if="authStore.isAuthenticated">
              <div class="px-4 py-3 border-b border-border mb-2">
                <p class="font-medium text-sm">{{ authStore.user?.name }}</p>
                <p class="text-xs text-muted-foreground">{{ authStore.user?.email }}</p>
              </div>
              <router-link to="/profile" class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Tài khoản của tôi
              </router-link>
              <router-link to="/orders" class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
                Đơn hàng của tôi
              </router-link>
              <router-link v-if="authStore.isAdmin" to="/admin" class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                Quản trị Admin
              </router-link>
              <hr class="my-2 border-border">
              <button @click="handleLogout" class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Đăng xuất
              </button>
            </template>
            <!-- Chưa đăng nhập -->
            <template v-else>
              <router-link to="/login" class="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-accent rounded-md">Đăng nhập</router-link>
              <router-link to="/register" class="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-accent rounded-md text-primary">Đăng ký</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Search Overlay -->
    <div 
      v-if="showMobileSearch" 
      class="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-3 shadow-lg"
    >
      <div class="relative flex items-center">
        <input 
          type="text" 
          placeholder="Tìm kiếm sách..." 
          class="w-full h-10 pl-4 pr-12 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none"
          v-model="searchQuery"
          @keydown.enter="handleMobileSearch"
          ref="mobileSearchInput"
        />
        <button 
          @click="handleMobileSearch"
          class="absolute right-0 top-0 h-10 w-10 flex items-center justify-center rounded-r-lg bg-primary text-primary-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Drawer Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="showMobileMenu"
        class="fixed inset-0 bg-black/50 z-[100] md:hidden"
        @click="showMobileMenu = false"
      ></div>
    </Transition>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div 
        v-if="showMobileMenu"
        class="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-[101] shadow-2xl md:hidden overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-border">
          <router-link to="/" @click="showMobileMenu = false">
            <img src="@/assets/ocean.png" alt="Ocean Books" class="h-10 w-auto" />
          </router-link>
          <button 
            @click="showMobileMenu = false"
            class="p-2 rounded-lg hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Menu Links -->
        <div class="p-4 space-y-2">
          <router-link 
            to="/" 
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="font-medium">Trang chủ</span>
          </router-link>

          <router-link 
            to="/products" 
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span class="font-medium">Tất cả sách</span>
          </router-link>

          <router-link 
            to="/cart" 
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span v-if="items.length > 0" class="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{{ items.length }}</span>
            </div>
            <span class="font-medium">Giỏ hàng</span>
          </router-link>
        </div>

        <!-- Categories Section (Expandable) -->
        <div class="px-4 py-2">
          <p class="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Danh mục</p>
          <div class="space-y-1">
            <div v-for="cat in categories" :key="cat.id">
              <!-- Parent Category -->
              <div class="flex items-center">
                <button 
                  @click="goToCategory(cat.id)"
                  class="flex-1 flex items-center px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span class="text-sm">{{ cat.name }}</span>
                </button>
                <button 
                  v-if="cat.subcategories && cat.subcategories.length > 0"
                  @click.stop="toggleMobileCategory(cat.id)"
                  class="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    class="h-4 w-4 text-muted-foreground transition-transform duration-200" 
                    :class="{ 'rotate-90': expandedMobileCategories.has(cat.id) }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
              
              <!-- Subcategories -->
              <div 
                v-if="cat.subcategories && cat.subcategories.length > 0 && expandedMobileCategories.has(cat.id)"
                class="ml-4 pl-4 border-l border-border space-y-1 mt-1"
              >
                <button 
                  v-for="sub in cat.subcategories" 
                  :key="sub.id"
                  @click="goToCategory(sub.id)"
                  class="flex items-center w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span class="text-sm text-muted-foreground">{{ sub.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-4 mx-4 border-t border-border"></div>

        <!-- Account Section -->
        <div class="px-4 py-2">
          <p class="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tài khoản</p>
          <div class="space-y-1">
            <router-link 
              v-if="authStore.isAuthenticated"
              to="/profile" 
              @click="showMobileMenu = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span class="text-sm">Tài khoản của tôi</span>
            </router-link>
            <router-link 
              v-if="authStore.isAuthenticated"
              to="/orders" 
              @click="showMobileMenu = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              </svg>
              <span class="text-sm">Đơn hàng của tôi</span>
            </router-link>
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/login" 
              @click="showMobileMenu = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span class="text-sm">Đăng nhập</span>
            </router-link>
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/register" 
              @click="showMobileMenu = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span class="text-sm font-medium">Đăng ký</span>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useFavoriteStore } from '@/stores/favorite'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const { items } = storeToRefs(cartStore)
const { favorites } = storeToRefs(favoriteStore)

const favoritesCount = computed(() => favorites.value.length)

const searchQuery = ref('')
const activeCategory = ref(0)
const categories = ref([])
const showMobileSearch = ref(false)
const showMobileMenu = ref(false)
const expandedMobileCategories = ref(new Set())
const newVouchersCount = ref(0)

// Search Logic
const suggestions = ref({ keywords: [], products: [] })
const showSuggestions = ref(false)
let searchTimeout = null

// Format Currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

// Watch search
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!newVal || newVal.trim().length < 2) {
    suggestions.value = { keywords: [], products: [] }
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products?limit=5&search=${encodeURIComponent(newVal)}`)
      const json = await res.json()
      if (json.status) {
        suggestions.value.products = json.data
        // Extract categories as keywords
        const cats = json.data
          .map(p => p.category_name)
          .filter((v, i, a) => v && a.indexOf(v) === i)
          .slice(0, 5)
        suggestions.value.keywords = cats
      }
    } catch (e) {
      console.error(e)
    }
  }, 300)
})

const handleSearchBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  showSuggestions.value = false
  router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
}

const handleMobileSearch = () => {
  if (!searchQuery.value.trim()) return
  showMobileSearch.value = false
  router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
}

const goToProduct = (id) => {
  showSuggestions.value = false
  router.push(`/products/${id}`)
}

// Go to category and close mobile menu
const goToCategory = (categoryId) => {
  showMobileMenu.value = false
  router.push(`/products?category_id=${categoryId}`)
}

// Toggle expandable category in mobile menu
const toggleMobileCategory = (categoryId) => {
  if (expandedMobileCategories.value.has(categoryId)) {
    expandedMobileCategories.value.delete(categoryId)
  } else {
    expandedMobileCategories.value.add(categoryId)
  }
  // Trigger reactivity
  expandedMobileCategories.value = new Set(expandedMobileCategories.value)
}

// Xử lý đăng xuất
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Logic build tree chuẩn
const buildTreeStandard = (items) => {
    const rootItems = [];
    const lookup = {};
    
    // Create lookup
    for (const item of items) {
        lookup[item.id] = { ...item, children: [] };
    }
    
    // Link items
    for (const item of items) {
        if (item.parent_id) {
            if (lookup[item.parent_id]) {
                lookup[item.parent_id].children.push(lookup[item.id]);
            }
        } else {
            rootItems.push(lookup[item.id]);
        }
    }
    
    return rootItems;
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
    const json = await res.json()
    
    if (json.status) {
      const tree = buildTreeStandard(json.data);
      
      // Transform tree to UI format (Standardized)
      categories.value = tree.map(root => ({
          id: root.id,
          name: root.name,
          subcategories: root.children.map(child => ({
              id: child.id,
              name: child.name,
              subcategories: child.children.map(grandChild => ({
                  id: grandChild.id,
                  name: grandChild.name
              }))
          }))
      }));
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchNewVouchersCount = async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/coupons/new-count`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      newVouchersCount.value = json.data.count
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchCategories()
  if (authStore.isAuthenticated) {
    favoriteStore.fetchFavorites()
    fetchNewVouchersCount()
  }
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}

.animate-shake {
  animation: shake 2s ease-in-out infinite;
  transform-origin: center top;
}
</style>
