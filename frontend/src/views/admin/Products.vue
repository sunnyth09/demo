<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Quản lý sản phẩm</h2>
        <p class="text-sm text-muted-foreground mt-1">Quản lý tất cả sản phẩm trong hệ thống</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="toggleTrashView"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-md border font-medium hover:bg-accent transition-colors"
          :class="showTrash ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-background text-muted-foreground border-border/50'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Thùng rác
        </button>
        <router-link 
          v-if="!showTrash"
          to="/admin/products/create"
          class="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Thêm sản phẩm
        </router-link>
      </div>
    </div>

    <!-- Filters Bar -->
    <div v-show="!showTrash" class="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
      <div class="flex-1 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          class="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @input="debouncedSearch"
        />
      </div>
      <div class="flex gap-3">
        <select 
          v-model="filterCategoryId"
          @change="fetchProducts()"
          class="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-[180px]"
        >
          <option :value="null">Tất cả danh mục</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        
        <select 
          v-model="filterStatus"
          @change="fetchProducts()"
          class="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-[150px]"
        >
          <option value="all">Trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p class="mt-4 text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
    </div>

    <template v-else>
    <!-- Bulk Action Bar -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm transition-all duration-300 mb-6" :class="{'opacity-60': selectedIds.length === 0}">
      <div class="flex items-center gap-2">
         <span class="text-sm font-medium text-blue-700">
            <template v-if="selectedIds.length > 0">
               Đã chọn <span class="font-bold whitespace-pre">{{ selectedIds.length }}</span> sản phẩm
            </template>
            <template v-else>
               Chưa chọn sản phẩm nào
            </template>
         </span>
      </div>
      <div class="flex items-center gap-2">
         <!-- Normal View Actions -->
         <template v-if="!showTrash">
           <select v-model="bulkStatus" :disabled="selectedIds.length === 0" class="px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed">
              <option value="">Chọn trạng thái...</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
           </select>
           <button 
             @click="updateBulkStatus" 
             :disabled="!bulkStatus || isProcessingBulk || selectedIds.length === 0"
             class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Cập nhật
           </button>
           <button 
             @click="bulkDelete" 
             :disabled="isProcessingBulk || selectedIds.length === 0"
             class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1 disabled:cursor-not-allowed"
           >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
             Xóa
           </button>
         </template>
         <!-- Trash View Actions -->
         <template v-else>
           <button 
             @click="bulkRestore" 
             :disabled="isProcessingBulk || selectedIds.length === 0"
             class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1 disabled:cursor-not-allowed"
           >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
             Khôi phục
           </button>
           <button 
             @click="bulkForceDelete" 
             :disabled="isProcessingBulk || selectedIds.length === 0"
             class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1 disabled:cursor-not-allowed"
           >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
             Xóa vĩnh viễn
           </button>
         </template>
      </div>
    </div>

    <!-- Table -->
    <div v-if="!showTrash" class="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/30 border-b">
              <th class="w-12 p-4 text-center">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
              </th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Sản phẩm</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Danh mục</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Giá</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Tồn kho</th>
              <th class="text-left p-4 font-semibold text-sm text-foreground/80">Trạng thái</th>
              <th class="text-center p-4 font-semibold text-sm text-foreground/80 w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr 
              v-for="product in products" 
              :key="product.id"
              class="hover:bg-muted/20 transition-colors group"
            >
              <td class="p-4 text-center" @click.stop>
                <input type="checkbox" v-model="selectedIds" :value="product.id" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
              </td>
              <td class="p-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-16 rounded bg-muted flex-shrink-0 overflow-hidden border shadow-sm">
                    <img 
                      v-if="product.thumbnail" 
                      :src="product.thumbnail" 
                      :alt="product.name"
                      class="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <image x="4" y="4" width="16" height="16" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer" @click="navigateToEdit(product.id)">
                      {{ product.name }}
                    </h3>
                    <p class="text-xs text-muted-foreground mt-0.5 font-mono">
                      SKU: {{ product.sku || '---' }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="text-sm text-muted-foreground">
                  {{ product.category_name || '---' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex flex-col">
                  <span class="font-medium text-foreground">
                    {{ formatCurrency(product.price) }}
                  </span>
                  <div v-if="product.original_price && product.original_price > product.price" class="flex items-center gap-1 mt-0.5">
                    <span class="text-xs text-muted-foreground line-through">
                      {{ formatCurrency(product.original_price) }}
                    </span>
                    <span class="text-[10px] font-bold text-red-600 bg-red-100 px-1 rounded">
                      -{{ Math.round(((product.original_price - product.price) / product.original_price) * 100) }}%
                    </span>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span :class="['text-sm', product.quantity > 0 ? 'text-foreground' : 'text-destructive font-medium']">
                  {{ product.quantity || 0 }}
                </span>
              </td>
              <td class="p-4">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    product.status === 'active' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  ]"
                >
                  {{ product.status === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="openPreview(product)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" 
                    title="Xem nhanh"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    @click="navigateToEdit(product.id)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600 transition-all" 
                    title="Sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(product)"
                    class="p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all" 
                    title="Xóa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr v-if="products.length === 0">
              <td colspan="7" class="p-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="m21 21-4.343-4.343"/><circle cx="10" cy="10" r="8"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-foreground">Không tìm thấy sản phẩm nào</h3>
                  <p class="text-muted-foreground mt-1 max-w-sm mx-auto">
                    Thử thay đổi bộ lọc hoặc thêm sản phẩm mới vào hệ thống.
                  </p>
                  <router-link 
                    to="/admin/products/create"
                    class="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Thêm sản phẩm mới
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Trash View -->
    <div v-else-if="showTrash" class="bg-card rounded-xl border overflow-hidden">
      <!-- Trash Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b font-medium text-sm text-muted-foreground items-center">
        <div class="col-span-1 flex items-center gap-3">
          <input type="checkbox" :checked="isAllTrashedSelected" @change="toggleSelectAllTrashed" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
          ID
        </div>
        <div class="col-span-5">Tên sản phẩm</div>
        <div class="col-span-3">Ngày xóa</div>
        <div class="col-span-3 text-right">Thao tác</div>
      </div>

      <!-- Trash Table Body -->
      <div class="divide-y divide-border">
        <template v-for="item in trashedProducts" :key="item.id">
          <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors">
            <div class="col-span-1 text-sm text-muted-foreground flex items-center gap-3" @click.stop>
              <input type="checkbox" v-model="selectedIds" :value="item.id" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
              #{{ item.id }}
            </div>
            <div class="col-span-5">
              <div class="font-medium truncate">{{ item.name }}</div>
              <div class="text-xs text-muted-foreground">{{ item.sku }}</div>
            </div>
            <div class="col-span-3 text-sm text-muted-foreground">
              {{ formatDate(item.deleted_at) }}
            </div>
            <div class="col-span-3 flex items-center justify-end gap-2">
              <button 
                @click="restoreProduct(item.id)"
                :disabled="restoring"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Khôi phục
              </button>
              <button 
                @click="confirmForceDelete(item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </template>
        <!-- Empty state -->
        <div v-if="trashedProducts.length === 0" class="px-6 py-12 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          <p class="font-medium text-lg">Thùng rác trống</p>
          <p class="text-sm">Không có sản phẩm nào bị xóa</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!showTrash && products.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-foreground">{{ offset + 1 }}-{{ Math.min(offset + limit, totalProducts) }}</span> trong tổng số <span class="font-medium text-foreground">{{ totalProducts }}</span> sản phẩm
      </p>
      
      <div class="flex items-center gap-1">
        <button 
          @click="prevPage"
          :disabled="offset === 0"
          class="min-w-[70px] px-3 py-1.5 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        <div class="flex items-center gap-1 mx-2">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-8 h-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center',
              currentPage === page 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="nextPage"
          :disabled="offset + limit >= totalProducts"
          class="min-w-[70px] px-3 py-1.5 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
    </template>

    <!-- Force Delete Confirmation Modal -->
    <div v-if="showForceDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForceDeleteModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 class="text-xl font-bold mb-2 text-destructive">Cảnh báo: Xóa vĩnh viễn</h3>
        <p class="text-muted-foreground mb-4 text-sm">
          Hành động này không thể hoàn tác. Sản phẩm "<strong>{{ productToForceDelete?.name }}</strong>" sẽ bị xóa vĩnh viễn khỏi hệ thống.
        </p>
        <div class="flex gap-3">
          <button @click="showForceDeleteModal = false" class="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors">Hủy</button>
          <button @click="forceDeleteProduct" :disabled="forceDeleting" class="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50">
            {{ forceDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-sm p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2 text-center">Xóa sản phẩm</h3>
        <p class="text-muted-foreground mb-6 text-center text-sm">
          Bạn có chắc muốn xóa sản phẩm "<strong>{{ productToDelete?.name }}</strong>" không? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 border rounded-lg hover:bg-accent transition-colors font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button 
            @click="deleteProduct"
            :disabled="deleting"
            class="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            {{ deleting ? 'Đang xóa...' : 'Xóa ngay' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showPreviewModal = false"></div>
      <div class="relative bg-card rounded-xl border shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4 animate-in fade-in zoom-in-95 duration-200">
        <!-- Close Button -->
        <button @click="showPreviewModal = false" class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div v-if="previewProduct" class="p-6">
          <!-- Header -->
          <div class="flex gap-5 mb-6">
            <div class="w-32 h-44 rounded-lg border overflow-hidden flex-shrink-0 bg-muted">
              <img 
                v-if="previewProduct.thumbnail" 
                :src="previewProduct.thumbnail" 
                :alt="previewProduct.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-bold text-foreground mb-2 pr-8">{{ previewProduct.name }}</h3>
              <p class="text-sm text-muted-foreground mb-3">SKU: {{ previewProduct.sku || '---' }}</p>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-primary">{{ formatCurrency(previewProduct.price) }}</span>
                <span v-if="previewProduct.original_price && previewProduct.original_price > previewProduct.price" class="text-sm text-muted-foreground line-through">
                  {{ formatCurrency(previewProduct.original_price) }}
                </span>
              </div>
              <div class="flex items-center gap-3 mt-3">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', previewProduct.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200']">
                  {{ previewProduct.status === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                </span>
                <span class="text-sm text-muted-foreground">Tồn kho: <strong>{{ previewProduct.quantity || 0 }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-3 text-sm border-t pt-4 mb-4">
            <div class="flex gap-2">
              <span class="text-muted-foreground">Danh mục:</span>
              <span class="font-medium">{{ previewProduct.category_name || '---' }}</span>
            </div>
            <div v-if="previewProduct.author" class="flex gap-2">
              <span class="text-muted-foreground">Tác giả:</span>
              <span class="font-medium">{{ previewProduct.author }}</span>
            </div>
            <div v-if="previewProduct.publisher" class="flex gap-2">
              <span class="text-muted-foreground">NXB:</span>
              <span class="font-medium">{{ previewProduct.publisher }}</span>
            </div>
            <div v-if="previewProduct.publication_year" class="flex gap-2">
              <span class="text-muted-foreground">Năm XB:</span>
              <span class="font-medium">{{ previewProduct.publication_year }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="previewProduct.description" class="border-t pt-4">
            <h4 class="text-sm font-semibold mb-2 text-muted-foreground uppercase">Mô tả sản phẩm</h4>
            <div class="product-preview-content text-sm text-foreground/80 max-h-[200px] overflow-y-auto" v-html="previewProduct.description"></div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-4 border-t">
            <button @click="showPreviewModal = false" class="flex-1 px-4 py-2.5 border rounded-lg hover:bg-accent transition-colors font-medium text-sm">
              Đóng
            </button>
            <button @click="showPreviewModal = false; navigateToEdit(previewProduct.id)" class="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
              Chỉnh sửa
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-else class="p-12 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div 
        v-if="toast.show" 
        :class="[
          'fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 border',
          toast.type === 'success' ? 'bg-background border-green-200 text-green-700' : 'bg-background border-red-200 text-red-700'
        ]"
      >
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', toast.type === 'success' ? 'bg-green-100' : 'bg-red-100']">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="font-medium text-sm">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const API_URL = import.meta.env.VITE_API_URL

const products = ref([])
const trashedProducts = ref([])
const categories = ref([])
const loading = ref(true)
const deleting = ref(false)
const restoring = ref(false)
const forceDeleting = ref(false)
const showTrash = ref(false)
const showForceDeleteModal = ref(false)
const productToForceDelete = ref(null)

// Bulk Actions Logic
const selectedIds = ref([])
const bulkStatus = ref('')
const isProcessingBulk = ref(false)

const isAllSelected = computed(() => {
  return products.value.length > 0 && products.value.every(p => selectedIds.value.includes(p.id))
})

const isAllTrashedSelected = computed(() => {
  return trashedProducts.value.length > 0 && trashedProducts.value.every(p => selectedIds.value.includes(p.id))
})

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    const ids = products.value.map(p => p.id)
    const newItems = ids.filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...newItems)
  } else {
    selectedIds.value = selectedIds.value.filter(id => !products.value.some(p => p.id === id))
  }
}

const toggleSelectAllTrashed = (e) => {
  if (e.target.checked) {
    const ids = trashedProducts.value.map(p => p.id)
    const newItems = ids.filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...newItems)
  } else {
    selectedIds.value = selectedIds.value.filter(id => !trashedProducts.value.some(p => p.id === id))
  }
}

const updateBulkStatus = async () => {
  if (!bulkStatus.value || selectedIds.value.length === 0) return
  isProcessingBulk.value = true
  try {
    const res = await fetch(`${API_URL}/products/bulk-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({ productIds: selectedIds.value, status: bulkStatus.value })
    })
    const json = await res.json()
    if (json.status) {
      showToast(json.message)
      selectedIds.value = []
      bulkStatus.value = ''
      await fetchProducts()
    } else {
      showToast(json.message || 'Lỗi cập nhật', 'error')
    }
  } catch (error) {
    showToast('Lỗi cập nhật hàng loạt', 'error')
  } finally {
    isProcessingBulk.value = false
  }
}

const bulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  if (!confirm(`Bạn có chắc muốn xóa mềm ${selectedIds.value.length} sản phẩm?`)) return
  isProcessingBulk.value = true
  try {
    const res = await fetch(`${API_URL}/products/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({ productIds: selectedIds.value })
    })
    const json = await res.json()
    if (json.status) {
      showToast(json.message)
      selectedIds.value = []
      await fetchProducts()
      await fetchTrashed()
    } else {
      showToast(json.message || 'Lỗi xóa', 'error')
    }
  } catch (error) {
    showToast('Lỗi xóa hàng loạt', 'error')
  } finally {
    isProcessingBulk.value = false
  }
}

const bulkRestore = async () => {
  if (selectedIds.value.length === 0) return
  if (!confirm(`Bạn có chắc muốn khôi phục ${selectedIds.value.length} sản phẩm?`)) return
  isProcessingBulk.value = true
  try {
    const res = await fetch(`${API_URL}/products/bulk-restore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({ productIds: selectedIds.value })
    })
    const json = await res.json()
    if (json.status) {
      showToast(json.message)
      selectedIds.value = []
      await fetchTrashed()
      await fetchProducts()
    } else {
      showToast(json.message || 'Lỗi khôi phục', 'error')
    }
  } catch (error) {
    showToast('Lỗi khôi phục hàng loạt', 'error')
  } finally {
    isProcessingBulk.value = false
  }
}

const bulkForceDelete = async () => {
  if (selectedIds.value.length === 0) return
  if (!confirm(`CẢNH BÁO: Xóa vĩnh viễn ${selectedIds.value.length} sản phẩm? Hành động này không thể hoàn tác.`)) return
  isProcessingBulk.value = true
  try {
    const res = await fetch(`${API_URL}/products/bulk-force`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({ productIds: selectedIds.value })
    })
    const json = await res.json()
    if (json.status) {
      showToast(json.message)
      selectedIds.value = []
      await fetchTrashed()
    } else {
      showToast(json.message || 'Lỗi xóa vĩnh viễn', 'error')
    }
  } catch (error) {
    showToast('Lỗi xóa vĩnh viễn hàng loạt', 'error')
  } finally {
    isProcessingBulk.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const toggleTrashView = async () => {
  showTrash.value = !showTrash.value
  selectedIds.value = [] // Reset selection on view switch
  if (showTrash.value) {
    await fetchTrashed()
  }
}

const fetchTrashed = async () => {
  try {
    const res = await fetch(`${API_URL}/products/trash`, {
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      trashedProducts.value = json.data
    }
  } catch (error) {
    console.error('Error fetching trashed:', error)
  }
}

const restoreProduct = async (id) => {
  restoring.value = true
  try {
    const res = await fetch(`${API_URL}/products/${id}/restore`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      showToast('Khôi phục sản phẩm thành công!')
      await fetchTrashed()
      await fetchProducts()
    } else {
      showToast(json.message || 'Lỗi khi khôi phục', 'error')
    }
  } catch (error) {
    showToast('Lỗi khi khôi phục sản phẩm', 'error')
  } finally {
    restoring.value = false
  }
}

const confirmForceDelete = (product) => {
  productToForceDelete.value = product
  showForceDeleteModal.value = true
}

const forceDeleteProduct = async () => {
  if (!productToForceDelete.value) return
  forceDeleting.value = true
  try {
    const res = await fetch(`${API_URL}/products/${productToForceDelete.value.id}/force`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
    })
    const json = await res.json()
    if (json.status) {
      showToast('Đã xóa vĩnh viễn!')
      showForceDeleteModal.value = false
      productToForceDelete.value = null
      await fetchTrashed()
    } else {
      showToast(json.message || 'Lỗi khi xóa vĩnh viễn', 'error')
    }
  } catch (error) {
    showToast('Lỗi khi xóa vĩnh viễn', 'error')
  } finally {
    forceDeleting.value = false
  }
}

const searchQuery = ref('')
const filterCategoryId = ref(null)
const filterStatus = ref('all')

const limit = ref(10)
const offset = ref(0)
const totalProducts = ref(0)

const showDeleteModal = ref(false)
const productToDelete = ref(null)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(totalProducts.value / limit.value))

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

// Show toast
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Debounce search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    offset.value = 0
    fetchProducts()
  }, 300)
}

// Navigate to edit
const navigateToEdit = (id) => {
  router.push({
    path: `/admin/products/edit/${id}`,
    query: { page: currentPage.value }
  })
}

// Preview sản phẩm
const showPreviewModal = ref(false)
const previewProduct = ref(null)

const openPreview = async (product) => {
  showPreviewModal.value = true
  previewProduct.value = null
  try {
    const res = await fetch(`${API_URL}/products/${product.slug || product.id}`)
    const json = await res.json()
    if (json.status) {
      previewProduct.value = json.data
    }
  } catch (err) {
    console.error('Error fetching preview:', err)
    showPreviewModal.value = false
  }
}

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  try {
    let url = `${API_URL}/products?limit=${limit.value}&offset=${offset.value}&status=${filterStatus.value}`
    if (filterCategoryId.value) {
      url += `&category_id=${filterCategoryId.value}`
    }
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`
    }
    
    const res = await fetch(url)
    const json = await res.json()
    
    if (json.status) {
      products.value = json.data
      // Estimate total for pagination (simple approach)
      if (json.data.length < limit.value) {
        totalProducts.value = offset.value + json.data.length
      } else {
        totalProducts.value = offset.value + limit.value + 1
      }
    } else {
      showToast(json.message || 'Lỗi tải sản phẩm', 'error')
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    showToast('Lỗi khi tải sản phẩm', 'error')
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`)
    const json = await res.json()
    if (json.status) {
      categories.value = json.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Pagination
const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchProducts()
    updateUrlPage()
  }
}

const nextPage = () => {
  offset.value += limit.value
  fetchProducts()
  updateUrlPage()
}

const goToPage = (page) => {
  offset.value = (page - 1) * limit.value
  fetchProducts()
  updateUrlPage()
}

// Update URL with current page (optional but good for UX)
const updateUrlPage = () => {
  const page = Math.floor(offset.value / limit.value) + 1
  router.replace({ query: { ...route.query, page } })
}

// Confirm delete
const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Delete product
const deleteProduct = async () => {
  if (!productToDelete.value) return
  
  deleting.value = true
  try {
    const res = await fetch(`${API_URL}/products/${productToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })
    
    const json = await res.json()
    
    if (json.status) {
      showToast('Xóa thành công!')
      showDeleteModal.value = false
      productToDelete.value = null
      await fetchProducts()
    } else {
      showToast(json.message || 'Có lỗi xảy ra', 'error')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    showToast('Lỗi khi xóa sản phẩm', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  // Check for page in query
  if (route.query.page) {
    const page = parseInt(route.query.page)
    if (!isNaN(page) && page > 1) {
      offset.value = (page - 1) * limit.value
    }
  }
  
  fetchCategories()
  fetchProducts()
  fetchTrashed()
})
</script>

<style scoped>
.product-preview-content :deep(img) {
  max-width: 30%;
  height: auto;
  border-radius: 0.375rem;
  margin: 0.5rem auto;
  display: block;
}
</style>
