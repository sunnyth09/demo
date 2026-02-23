<template>
  <div class="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main class="flex-1 pb-16 lg:pb-0">
      <router-view />
    </main>
    <Footer class="hidden lg:block" />
    <MobileBottomNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'

const route = useRoute()
const hideFooterOnMobile = computed(() => {
  return ['/cart', '/checkout'].includes(route.path)
})
</script>
