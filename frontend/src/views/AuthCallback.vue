<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-muted-foreground">Đang xử lý đăng nhập...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  const { accessToken, refreshToken, user } = route.query;

  if (accessToken && refreshToken && user) {
    try {
      const userData = JSON.parse(user);
      
      // Update store
      authStore.accessToken = accessToken;
      authStore.refreshToken = refreshToken;
      authStore.user = userData;

      // Save to localStorage (default for social login)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to home
      router.push('/');
    } catch (e) {
        console.error("Error parsing user data", e);
        router.push('/login?error=auth_failed');
    }
  } else {
    router.push('/login?error=auth_failed');
  }
});
</script>
