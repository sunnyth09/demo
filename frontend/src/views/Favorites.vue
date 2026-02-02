<template>
  <div class="container mx-auto px-4 py-6 bg-background min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground">Sản phẩm yêu thích</h1>
      <p class="text-muted-foreground">Danh sách các sản phẩm bạn đã lưu</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="favorites.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="fav in favorites"
        :key="fav.id"
        class="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 relative"
      >
        <div 
           class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 cursor-pointer mb-3"
           @click="goToDetail(fav.product.id)"
        >
          <img 
            :src="fav.product.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image'" 
            :alt="fav.product.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
           <!-- Remove Icon Top Right -->
           <button
              @click.stop="removeFavorite(fav.product)"
              class="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors group/btn"
              title="Xóa khỏi danh sách"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover/btn:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>
        
        <div class="flex flex-col">
            <h3 class="font-medium text-gray-900 line-clamp-2 mb-2 min-h-[3rem] cursor-pointer hover:text-primary transition-colors leading-snug"
                @click="goToDetail(fav.product.id)"
                :title="fav.product.name"
            >
                {{ fav.product.name }}
            </h3>
            
            <div class="text-xl font-bold text-blue-600 mb-1">
                {{ formatCurrency(fav.product.price) }}
            </div>

            <!-- Rating (Static for now) -->
            <div class="flex items-center gap-1">
                <div class="flex text-yellow-400 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span class="text-gray-400 text-sm">(0)</span>
            </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-card rounded-xl border border-border">
       <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
       </div>
       <h3 class="text-sm font-semibold text-foreground">Chưa có sản phẩm yêu thích</h3>
       <p class="mt-1 text-sm text-muted-foreground">Hãy thêm các sản phẩm bạn thích vào đây nhé!</p>
       <button @click="router.push('/products')" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Khám phá sản phẩm
       </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useFavoriteStore } from '../stores/favorite';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const router = useRouter();
const favoriteStore = useFavoriteStore();
const { favorites } = storeToRefs(favoriteStore);
const loading = ref(false);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const goToDetail = (id) => {
  router.push(`/products/${id}`);
};

const removeFavorite = async (product) => {
    if (confirm('Bạn muốn bỏ sản phẩm này khỏi danh sách yêu thích?')) {
        await favoriteStore.toggleFavorite(product);
    }
};

onMounted(async () => {
    loading.value = true;
    await favoriteStore.fetchFavorites();
    loading.value = false;
});
</script>
