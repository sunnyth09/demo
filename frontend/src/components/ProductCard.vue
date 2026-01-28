<template>
  <div 
    class="group bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col overflow-hidden relative"
  >
    <!-- Badge -->
    <div v-if="product.quantity === 0" class="absolute top-2 left-2 z-10">
      <span class="bg-gray-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">HẾT HÀNG</span>
    </div>
    <div v-else-if="calculateDiscount(product.price, product.original_price) > 0" class="absolute top-2 left-2 z-10">
      <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
        -{{ calculateDiscount(product.price, product.original_price) }}%
      </span>
    </div>

    <!-- Image -->
    <div 
      class="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
      @click="$emit('click-product', product.id)"
    >
      <img 
        :src="product.thumbnail || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'" 
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <!-- Quick Actions (Hover) -->
      <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent pt-8">
        <button 
          @click.stop="$emit('add-to-cart', product)"
          class="h-8 w-8 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
          title="Thêm vào giỏ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </button>
        <button 
          class="h-8 w-8 rounded-full bg-white text-gray-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
          title="Yêu thích"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4 flex flex-col flex-1">
      <div class="mb-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold" v-if="product.category_name">
        {{ product.category_name }}
      </div>
      <h3 
        class="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-pointer"
        :title="product.name"
        @click="$emit('click-product', product.id)"
      >
        {{ product.name }}
      </h3>
      
      <div class="mt-auto">
        <div class="flex items-baseline gap-2">
          <span class="text-base font-bold text-primary">{{ formatCurrency(product.price) }}</span>
          <span v-if="product.original_price && product.original_price > product.price" class="text-xs text-gray-400 line-through">
            {{ formatCurrency(product.original_price) }}
          </span>
        </div>
        
        <!-- Rating -->
        <div class="flex items-center gap-1 mt-1.5">
          <div class="flex text-yellow-400 text-[10px]">
            <span v-for="i in 5" :key="i" :class="i <= (product.rating || 5) ? 'fill-current' : 'text-gray-200'">★</span>
          </div>
          <span class="text-[10px] text-gray-400">({{ product.review_count || 0 }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['click-product', 'add-to-cart'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

const calculateDiscount = (price, original) => {
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}
</script>
