<template>
  <div class="min-h-screen bg-background pb-12">
    <!-- Breadcrumb -->
    <div class="bg-muted/30 border-b">
      <div class="container max-w-7xl mx-auto px-4 py-3">
        <nav class="flex text-sm text-muted-foreground">
          <router-link to="/" class="hover:text-primary transition-colors">Trang chủ</router-link>
          <span class="mx-2">/</span>
          <router-link to="/articles" class="hover:text-primary transition-colors">Góc đọc sách</router-link>
          <span class="mx-2">/</span>
          <span class="text-foreground truncate max-w-[200px] md:max-w-md">{{ article?.title }}</span>
        </nav>
      </div>
    </div>

    <div v-if="loading" class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-muted rounded w-3/4"></div>
        <div class="h-4 bg-muted rounded w-1/4"></div>
        <div class="h-64 md:h-96 bg-muted rounded-xl"></div>
        <div class="space-y-2 pt-4">
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <div v-else-if="article" class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Article Header -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4">
          <span>Tin tức</span>
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          {{ article.title }}
        </h1>
        
        <div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase text-foreground">
              A
            </div>
            <span>Admin</span>
          </div>
          <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
          <span>{{ formatDate(article.createdAt) }}</span>
          <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {{ article.views }} lượt xem
          </div>
        </div>
      </div>

      <!-- Featured Image -->
      <div class="mb-10 rounded-2xl overflow-hidden shadow-lg border">
        <img 
          :src="article.thumbnail || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200'" 
          :alt="article.title"
          class="w-full h-auto object-cover max-h-[500px]"
        >
      </div>

      <!-- Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none mx-auto bg-card p-6 md:p-10 rounded-2xl border shadow-sm">
        <p class="lead text-xl text-muted-foreground font-medium italic border-l-4 border-primary pl-4 mb-8">
          {{ article.excerpt }}
        </p>
        <div v-html="article.content"></div>
      </div>

      <!-- Related/Navigation -->
      <div class="mt-12 pt-8 border-t flex justify-between items-center">
        <router-link to="/articles" class="text-primary font-medium flex items-center gap-2 hover:underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 py-20 text-center">
      <h2 class="text-2xl font-bold">Không tìm thấy bài viết</h2>
      <router-link to="/articles" class="text-primary hover:underline mt-4 inline-block">Xem bài viết khác</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const fetchArticle = async (id) => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/articles/${id}`);
    const result = await response.json();
    if (result.status) {
      article.value = result.data;
    } else {
      article.value = null;
    }
  } catch (error) {
    console.error('Error fetching article:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchArticle(route.params.id);
  }
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticle(newId);
  }
});
</script>

<style>
/* Custom prose styling if tailwind typography plugin isn't fully configured or for specific overrides */
.prose img {
  border-radius: 0.75rem;
  margin-left: auto;
  margin-right: auto;
}
.prose h2, .prose h3 {
  color: var(--foreground);
}
.prose p {
  color: var(--muted-foreground);
  line-height: 1.8;
}
.prose strong {
  color: var(--foreground);
}
.prose ul, .prose ol {
  color: var(--muted-foreground);
}
</style>
