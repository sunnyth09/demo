<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Banner Section -->
    <div class="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary-foreground/10"></div>
        <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" alt="Blog Banner" class="w-full h-full object-cover mix-blend-overlay opacity-20">
      </div>
      
      <div class="container max-w-7xl mx-auto px-4 relative z-10">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
            <span>📚</span>
            <span>Góc Đọc Sách</span>
          </div>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Khám phá tri thức & <br/>
            Cảm hứng đọc sách
          </h1>
          <p class="text-white/80 text-lg max-w-xl leading-relaxed">
            Nơi chia sẻ những cuốn sách hay, kinh nghiệm đọc hiệu quả và những câu chuyện truyền cảm hứng.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <!-- Search & Filter Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
        <!-- Search -->
        <div class="relative w-full md:w-96">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            class="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            @input="handleSearch"
          >
          <svg class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <!-- Sort/Filter (Visual only for now) -->
        <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            v-for="filter in ['Tất cả', 'Review Sách', 'Kinh Nghiệm', 'Tin Tức']" 
            :key="filter"
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border"
            :class="filter === 'Tất cả' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-border'"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-card rounded-2xl overflow-hidden border shadow-sm animate-pulse h-[400px]">
          <div class="h-48 bg-muted"></div>
          <div class="p-6 space-y-4">
            <div class="h-4 bg-muted rounded w-1/4"></div>
            <div class="h-6 bg-muted rounded w-3/4"></div>
            <div class="h-4 bg-muted rounded w-full"></div>
            <div class="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
        >
          <!-- Image -->
          <router-link :to="`/articles/${article.id}`" class="block relative overflow-hidden aspect-[16/10]">
            <img 
              :src="article.thumbnail || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'" 
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </router-link>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <!-- Meta -->
            <div class="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span class="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">Tin tức</span>
              <span>{{ formatDate(article.createdAt) }}</span>
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                {{ article.views }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              <router-link :to="`/articles/${article.id}`">
                {{ article.title }}
              </router-link>
            </h2>

            <!-- Excerpt -->
            <p class="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {{ article.excerpt }}
            </p>

            <!-- Footer -->
            <div class="pt-4 border-t border-border mt-auto flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">A</div>
                <span class="text-xs font-medium text-foreground">Admin</span>
              </div>
              <router-link 
                :to="`/articles/${article.id}`" 
                class="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                Đọc tiếp
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        </div>
        <h3 class="text-lg font-bold text-foreground">Không tìm thấy bài viết</h3>
        <p class="text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác hoặc quay lại sau.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const articles = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const fetchArticles = async (query = '') => {
  loading.value = true;
  try {
    let url = `${API_URL}/articles?status=published&limit=50`;
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    if (result.status) {
      articles.value = result.data;
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = debounce(() => {
  fetchArticles(searchQuery.value);
}, 300);

onMounted(() => {
  fetchArticles();
});
</script>
