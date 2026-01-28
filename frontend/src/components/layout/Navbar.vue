<template>
  <nav class="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
    <div class="container mx-auto flex h-20 items-center justify-between gap-8 px-4">
      <!-- Left Section: Logo & Category -->
      <div class="flex items-center gap-6">
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
          <span class="text-2xl font-bold text-primary hidden md:block">Ocean Books</span>
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
                <div v-for="subGroup in categories[activeCategory].subGroups" :key="subGroup.id" class="space-y-3">
                  <h4 
                    class="font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                    @click="router.push(`/products?category_id=${subGroup.id}`)"
                  >
                    {{ subGroup.title }}
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="item in subGroup.items" :key="item.id">
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

      <!-- Center Section: Search Bar -->
      <div class="flex-1 max-w-3xl relative group/search mx-4">
        <div class="relative flex items-center">
          <input 
            type="text" 
            placeholder="Tìm kiếm sách, tác giả, thể loại..." 
            class="w-full h-11 pl-4 pr-12 rounded-lg border-2 border-border bg-muted/20 focus:bg-background focus:border-primary focus:outline-none transition-all"
            v-model="searchQuery"
            @focus="showSuggestions = true"
            @blur="setTimeout(() => showSuggestions = false, 200)"
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
      <div class="flex items-center gap-6 flex-shrink-0">
        <!-- Notification -->
        <button class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background"></span>
          </div>
          <span class="text-[10px] font-medium hidden lg:block">Thông báo</span>
        </button>

        <!-- Cart -->
        <router-link to="/cart" class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="items.length > 0" class="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold border-2 border-background">{{ items.length }}</span>
          </div>
          <span class="text-[10px] font-medium hidden lg:block">Giỏ hàng</span>
        </router-link>

        <!-- Account -->
        <div class="relative group/account">
          <router-link :to="authStore.isAuthenticated ? '/profile' : '/login'" class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <!-- Avatar nếu đã đăng nhập -->
            <div v-if="authStore.isAuthenticated" class="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <!-- Icon nếu chưa đăng nhập -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="text-[10px] font-medium hidden lg:block">{{ authStore.isAuthenticated ? authStore.user?.name : 'Tài khoản' }}</span>
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
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { items } = storeToRefs(cartStore)

const searchQuery = ref('')
const activeCategory = ref(0)
const categories = ref([])

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
      const res = await fetch(`http://localhost:3000/api/products?limit=5&search=${encodeURIComponent(newVal)}`)
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

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  showSuggestions.value = false
  router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
}

const goToProduct = (id) => {
  showSuggestions.value = false
  router.push(`/products/${id}`)
}

// Xử lý đăng xuất
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Hàm chuyển đổi danh sách phẳng thành cây phân cấp
const buildCategoryTree = (flatList) => {
  const map = {}
  const tree = []
  
  // Khởi tạo map
  flatList.forEach(item => {
    map[item.id] = { ...item, subGroups: [], items: [] } // subGroups cho level 2, items cho level 3 (tạm thời mapping)
  })

  // Xây dựng cây
  flatList.forEach(item => {
    if (item.parent_id) {
      // Nếu có cha
      if (map[item.parent_id]) {
        // Nếu cha là root (level 1), thì item là level 2 -> gộp vào subGroups của cha
        // Tuy nhiên, cấu trúc Navbar hiện tại là: Root -> Group (Title) -> Items (Link)
        // Nên ta cần xử lý linh hoạt hơn.
        
        // GIẢI PHÁP ĐƠN GIẢN CHO UI HIỆN TẠI:
        // Level 1: Categories Root (Sách Trong Nước...)
        // Level 2: SubGroups (Văn Học, Kinh Tế...)
        // Level 3: Items (Tiểu Thuyết...)
        
        const parent = map[item.parent_id];
        
        // Kiểm tra xem parent có parent không? (để biết parent là level 1 hay 2)
        if (parent.parent_id) {
             // Parent là Level 2 (VD: Văn Học), vậy Item là Level 3 (Tiểu Thuyết)
             // Tìm ông nội (Level 1)
             const grandpa = map[parent.parent_id];
             if(grandpa) {
                 // Tìm group Level 2 trong grandpa tương ứng với parent
                 let group = grandpa.subGroups.find(g => g.id === parent.id);
                 if(!group) {
                     // Nếu chưa có group này trong danh sách subGroups của ông nội, thêm vào (thực ra logic dưới sẽ add)
                     // Nhưng ở đây ta đang duyệt phẳng, thứ tự không đảm bảo.
                     // Cách tốt hơn: Duyệt 2 pass.
                 }
             }
        } else {
            // Parent là Level 1 (VD: Sách Trong Nước), Item là Level 2 (Văn Học)
            // Thêm item vào subGroups của Parent
            // Cần format lại item thành cấu trúc { title: 'Văn Học', items: [] }
            // Kiểm tra xem đã add chưa
            if (!parent.subGroups.find(g => g.id === item.id)) {
                parent.subGroups.push(map[item.id]); 
                // map[item.id] sẽ chứa children của nó (level 3) trong 'subGroups' hoặc ta đổi tên field cho khớp
            }
        }
      }
    } else {
      // Root (Level 1)
      tree.push(map[item.id])
    }
  })
  
  // Pass 2: Map lại cấu trúc cho đúng UI template
  // UI expected: categories[{ name: '...', subGroups: [{ title: '...', items: ['...'] }] }]
  
  return tree.map(root => ({
      ...root,
      subGroups: root.subGroups.map(sub => ({
          title: sub.name,
          items: map[sub.id].subGroups.map(child => child.name) // Ở Pass 1, children của Level 2 lại được push vào subGroups của nó do logic đệ quy đơn giản.
          // Wait, logic trên kia hơi rối với 'subGroups'.
          // Hãy làm lại logic cây chuẩn: children[]
      }))
  }));
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
    const res = await fetch('http://localhost:3000/api/categories')
    const json = await res.json()
    console.log("Raw categories:", json.data);
    
    if (json.status) {
      const tree = buildTreeStandard(json.data);
      console.log("Tree:", tree);
      
      // Transform tree to UI format
      categories.value = tree.map(root => ({
          id: root.id,
          name: root.name,
          subGroups: root.children.map(child => ({
              id: child.id,
              title: child.name,
              items: child.children.map(grandChild => ({
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

onMounted(() => {
  fetchCategories()
})
</script>
