<template>
  <div class="container mx-auto px-4 py-6 bg-background min-h-screen">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar (Categories Tree) -->
      <div class="w-full md:w-1/4 lg:w-1/5">
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden sticky top-24">
          <div class="px-4 py-3 border-b border-border bg-muted/30">
            <h2 class="font-semibold text-foreground text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Nhóm sản phẩm
            </h2>
          </div>
          <div class="p-2">
            <div class="space-y-1">
              <!-- All Products -->
              <button
                @click="selectCategory(null)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium',
                  !selectedCategoryId
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted',
                ]"
              >
                Tất cả sản phẩm
              </button>

              <!-- Level 1 Categories -->
              <div v-for="cat1 in categoryTree" :key="cat1.id" class="space-y-1">
                <button 
                  @click="selectCategory(cat1.id)"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group',
                    selectedCategoryId === cat1.id 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  ]"
                >
                  <span class="flex-1 text-left">{{ cat1.name }}</span>
                  <svg 
                    v-if="cat1.children && cat1.children.length > 0"
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-90': expandedCats.has(cat1.id) }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>

                <!-- Level 2 Categories (Children of Level 1) -->
                <div 
                  v-if="expandedCats.has(cat1.id) && cat1.children && cat1.children.length > 0" 
                  class="ml-3 pl-3 border-l border-gray-100 space-y-1 mt-1"
                >
                  <div v-for="cat2 in cat1.children" :key="cat2.id">
                    <button 
                      @click="selectCategory(cat2.id)"
                      :class="[
                        'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors',
                        selectedCategoryId === cat2.id 
                          ? 'text-primary font-medium bg-blue-50/50' 
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      ]"
                    >
                      <span class="flex-1 text-left">{{ cat2.name }}</span>
                      <svg 
                        v-if="cat2.children && cat2.children.length > 0"
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-3 w-3 transition-transform duration-200"
                        :class="{ 'rotate-90': expandedCats.has(cat2.id) }"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>

                    <!-- Level 3 Categories (Children of Level 2) -->
                    <div 
                      v-if="expandedCats.has(cat2.id) && cat2.children && cat2.children.length > 0" 
                      class="ml-3 pl-3 border-l border-gray-100 mt-1 space-y-1"
                    >
                      <div v-for="cat3 in cat2.children" :key="cat3.id">
                         <button 
                            @click="selectCategory(cat3.id)"
                            :class="[
                              'w-full text-left px-3 py-1 rounded-md text-xs transition-colors',
                              selectedCategoryId === cat3.id 
                                ? 'text-primary font-medium bg-blue-50/30' 
                                : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                            ]"
                          >
                            {{ cat3.name }}
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Sort Bar -->
        <div class="bg-card p-3 rounded-xl shadow-sm border border-border mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-muted-foreground whitespace-nowrap">Sắp xếp theo:</span>
            <div class="relative min-w-[160px]">
              <select
                v-model="sortOption"
                class="w-full appearance-none bg-muted border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-muted/80 transition-colors text-foreground font-medium"
              >
                <option value="default">Mặc định</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-if="loading" class="flex justify-center py-20">
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
          ></div>
        </div>

        <div
          v-else-if="products.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="group bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative hover:-translate-y-1"
          >
            <!-- Badge -->
            <div
              v-if="product.quantity === 0"
              class="absolute top-2 left-2 z-10"
            >
              <span class="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-md">HẾT HÀNG</span>
            </div>
            <div
              v-else-if="
                calculateDiscount(product.price, product.original_price) > 0
              "
              class="absolute top-2 left-2 z-10"
            >
              <span class="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                -{{ calculateDiscount(product.price, product.original_price) }}%
              </span>
            </div>

            <!-- Image -->
            <div 
              class="relative aspect-[3/4] overflow-hidden p-[2px] bg-transparent cursor-pointer"
              @click="goToDetail(product.id)"
            >
              <img 
                :src="product.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image'" 
                :alt="product.name"
                class="w-full h-full object-cover rounded-[2px] transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <!-- Info -->
            <div class="p-3 pt-2 flex flex-col">
              <h3 
                class="text-sm font-medium text-card-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors cursor-pointer leading-snug"
                :title="product.name"
                @click="goToDetail(product.id)"
              >
                {{ product.name }}
              </h3>
              
              <div class="mt-auto">
                <div class="flex items-baseline gap-2 flex-wrap">
                  <span class="text-base font-bold text-primary">{{ formatCurrency(product.price) }}</span>
                  <span v-if="product.original_price" class="text-xs text-muted-foreground line-through">
                    {{ formatCurrency(product.original_price) }}
                  </span>
                </div>
                
                <!-- Rating -->
                <div class="flex items-center gap-1 mt-1.5">
                  <div class="flex text-yellow-500 text-xs">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span class="text-xs text-muted-foreground">(0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 bg-card rounded-xl border border-border">
          <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-foreground">Không tìm thấy sản phẩm</h3>
          <p class="mt-1 text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="products.length > 0 && totalPages > 1"
          class="flex justify-center mt-8 gap-2"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-lg border font-medium transition-all',
              currentPage === page
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const route = useRoute();

const goToDetail = (id) => {
  router.push(`/products/${id}`);
};

const products = ref([]);
const categories = ref([]);
const categoryTree = ref([]); // Tree structure
const expandedCats = ref(new Set()); // Track expanded categories

const loading = ref(true);
const selectedCategoryId = ref(null);
const sortOption = ref("default");
const limit = ref(24);
const offset = ref(0);
const totalProducts = ref(0);
const searchQuery = ref("");

// Computed
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1);
const totalPages = computed(() => Math.ceil(totalProducts.value / limit.value));

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Discount calculation (helper)
const calculateDiscount = (price, original) => {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
};

// Helper: Build Tree from Flat list
const buildTree = (flatList) => {
  const map = {};
  const roots = [];

  // Clone and map
  flatList.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Connect
  flatList.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
};

// Toggle expansion
const toggleExpand = (id) => {
  if (expandedCats.value.has(id)) {
    expandedCats.value.delete(id);
  } else {
    expandedCats.value.add(id);
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const json = await res.json();
    if (json.status) {
      categories.value = json.data;
      categoryTree.value = buildTree(json.data);
      // Auto expand root categories initially if you want
      // categoryTree.value.forEach(r => expandedCats.value.add(r.id))
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch products
const fetchProducts = async () => {
  loading.value = true;
  try {
    let url = `${API_URL}/products?limit=${limit.value}&offset=${offset.value}`;

    if (selectedCategoryId.value) {
      url += `&category_id=${selectedCategoryId.value}`;
    }

    if (searchQuery.value) {
      url += `&search=${encodeURIComponent(searchQuery.value)}`;
    }

    if (sortOption.value !== "default") {
      url += `&sort=${sortOption.value}`;
    }

    const res = await fetch(url);
    const json = await res.json();

    if (json.status) {
      let data = json.data;

      // Client-side sorting (temporary if backend doesn't support)
      if (sortOption.value === "price_asc") {
        data.sort((a, b) => a.price - b.price);
      } else if (sortOption.value === "price_desc") {
        data.sort((a, b) => b.price - a.price);
      } else if (sortOption.value === "newest") {
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      products.value = data;

      // Pagination logic basic
      if (data.length < limit.value) {
        totalProducts.value = offset.value + data.length;
      } else {
        totalProducts.value = offset.value + limit.value + 1; // Estimation
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

// Debounce fetch
let timeout = null;
const debouncedFetch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    offset.value = 0;
    fetchProducts();
  }, 300);
};

// Watchers
watch(sortOption, () => {
  fetchProducts();
});

// Watch route query for search changes
watch(
  () => route.query.search,
  (newSearch) => {
    searchQuery.value = newSearch || '';
    offset.value = 0;
    fetchProducts();
  }
);

// Watch route query for category changes
watch(
  () => route.query.category_id,
  (newId) => {
    if (newId) {
      const id = parseInt(newId);
      selectedCategoryId.value = id;
      expandedCats.value.add(id); // Auto expand selected (simple approach)
      offset.value = 0;
      fetchProducts();
    } else {
      // If query param is removed, show all
      selectedCategoryId.value = null;
      offset.value = 0;
      fetchProducts();
    }
  }
);

// Actions
const selectCategory = (id) => {
  // If clicking explicitly, update URL too to match state
  if (id) {
    router.push({ query: { ...route.query, category_id: id } });
  } else {
    const query = { ...route.query };
    delete query.category_id;
    router.push({ query });
  }

  const isSameCategory = selectedCategoryId.value === id;

  // Nếu chọn danh mục mới hoặc bỏ chọn, load lại data
  if (!isSameCategory) {
    selectedCategoryId.value = id;
    offset.value = 0;
    fetchProducts();
  }

  // Xử lý Expand/Collapse
  if (id) {
    if (isSameCategory) {
      // Nếu click lại danh mục đang chọn -> Toggle (Đóng/Mở)
      if (expandedCats.value.has(id)) {
        expandedCats.value.delete(id);
      } else {
        expandedCats.value.add(id);
      }
    } else {
      // Nếu chọn danh mục mới -> Luôn mở ra
      expandedCats.value.add(id);
    }
  }
};

const goToPage = (page) => {
  offset.value = (page - 1) * limit.value;
  fetchProducts();
};

onMounted(() => {
  // Check URL params on mount
  if (route.query.category_id) {
    const id = parseInt(route.query.category_id);
    selectedCategoryId.value = id;
    expandedCats.value.add(id);
  }
  
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }

  fetchCategories();
  fetchProducts();
});
</script>
