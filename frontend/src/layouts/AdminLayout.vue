<template>
  <div class="flex min-h-screen bg-muted/30">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center gap-2 border-b border-border px-6">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <span class="text-xl font-bold">Admin</span>
        <!-- Close button on mobile -->
        <button 
          @click="isSidebarOpen = false" 
          class="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <template v-for="item in menuItems" :key="item.name">
          <!-- Single Item -->
          <router-link 
            v-if="!item.children"
            :to="item.path"
            @click="isSidebarOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            active-class="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.name }}
          </router-link>

          <!-- Group Item -->
          <div v-else class="space-y-1">
            <button 
              @click="toggleGroup(item.name)"
              class="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              :class="{ 'text-foreground font-semibold': isGroupActive(item) }"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="h-5 w-5" />
                {{ item.name }}
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': expandedGroups[item.name] }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <!-- Children -->
            <div 
              v-show="expandedGroups[item.name]"
              class="pl-4 space-y-1"
            >
              <router-link 
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                @click="isSidebarOpen = false"
                class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                active-class="bg-primary/10 text-primary hover:bg-primary/20"
              >
                <!-- Dot icon for children -->
                 <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                 {{ child.name }}
              </router-link>
            </div>
          </div>
        </template>
      </nav>

      <!-- User Info -->
      <div class="absolute bottom-0 left-0 right-0 border-t border-border p-4 bg-card">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            👤
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">Admin User</p>
            <p class="text-xs text-muted-foreground truncate">admin@bookstore.com</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 transition-all duration-300 w-full lg:ml-64">
      <!-- Header -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
        <div class="flex items-center gap-4">
          <!-- Toggle Button -->
          <button 
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 -ml-2 rounded-lg hover:bg-muted text-foreground lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold truncate">{{ currentPageTitle }}</h1>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/">
            <button class="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
               <span class="hidden sm:inline">← Về trang chủ</span>
               <span class="sm:hidden">← Về trang chủ</span>
            </button>
          </router-link>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 lg:p-6 overflow-x-hidden">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSidebarOpen = ref(false)
const expandedGroups = reactive({})

// Icons defined locally
const IconDashboard = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`
}
const IconOrders = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
}
const IconStore = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a2 2 0 0 1 1.85-1.2h11a2 2 0 0 1 1.85 1.2L21 21"/><line x1="10" y1="10" x2="14" y2="10"/><rect x="3" y="3" width="18" height="8" rx="2"/><path d="M17 11v6"/></svg>`
}
const IconSettings = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
}

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: IconDashboard },
  { name: 'Đơn hàng', path: '/admin/orders', icon: IconOrders },
  {
    name: 'Quản lý cửa hàng',
    icon: IconStore,
    children: [
      { name: 'Sản phẩm', path: '/admin/products' },
      { name: 'Danh mục', path: '/admin/categories' },
      { name: 'Người dùng', path: '/admin/users' },
      { name: 'Phí vận chuyển', path: '/admin/shipping' },
      { name: 'Mã giảm giá', path: '/admin/coupons' },
      { name: 'Bài viết', path: '/admin/articles' },
      { name: 'Đánh giá', path: '/admin/reviews' },
      { name: 'Thống kê', path: '/admin/revenue' },
    ]
  },
  { name: 'Cài đặt', path: '/admin/settings', icon: IconSettings },
]

const toggleGroup = (name) => {
  expandedGroups[name] = !expandedGroups[name]
}

const isGroupActive = (item) => {
  if (!item.children) return route.path === item.path
  return item.children.some(child => route.path.startsWith(child.path))
}

// Auto-expand group if a child is active
watch(
  () => route.path,
  () => {
    menuItems.forEach(item => {
      if (item.children && isGroupActive(item)) {
        expandedGroups[item.name] = true
      }
    })
  },
  { immediate: true }
)

const currentPageTitle = computed(() => {
  // Check top-level items
  const directItem = menuItems.find(item => item.path && (item.path === route.path || (route.path.startsWith(item.path) && item.path !== '/admin')))
  if (directItem) return directItem.name

  // Check children
  for (const item of menuItems) {
    if (item.children) {
      const child = item.children.find(c => c.path === route.path || (route.path.startsWith(c.path)))
      if (child) return child.name
    }
  }
  
  return 'Dashboard'
})
</script>
