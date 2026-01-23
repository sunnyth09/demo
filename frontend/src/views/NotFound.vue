<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
    <div class="text-center">
      <div class="text-8xl mb-6">📖</div>
      <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold mb-4">Không tìm thấy trang</h2>
      <p class="text-muted-foreground mb-8 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <router-link to="/">
        <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
          Về trang chủ
        </button>
      </router-link>
    </div>
  </div>
</template>
