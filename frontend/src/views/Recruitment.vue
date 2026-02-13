<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Hero Section -->
    <div class="bg-slate-900 text-white py-20">
      <div class="container max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">Gia nhập đội ngũ Ocean Books</h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto">
          Cùng chúng tôi lan tỏa văn hóa đọc và kiến tạo tương lai tri thức. Chúng tôi luôn tìm kiếm những tài năng đam mê và nhiệt huyết.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16">
      <!-- Why Join Us -->
      <section class="mb-20">
        <h2 class="text-3xl font-bold text-center mb-12">Tại sao chọn Ocean Books?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-card border border-border p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Môi trường năng động</h3>
            <p class="text-muted-foreground">Làm việc trong môi trường trẻ trung, sáng tạo, khuyến khích tư duy đổi mới và phát triển bản thân.</p>
          </div>
          
          <div class="bg-card border border-border p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Đãi ngộ hấp dẫn</h3>
            <p class="text-muted-foreground">Mức lương cạnh tranh, thưởng theo hiệu quả công việc, phụ cấp ăn trưa và tham gia đầy đủ BHXH.</p>
          </div>

          <div class="bg-card border border-border p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Cơ hội thăng tiến</h3>
            <p class="text-muted-foreground">Lộ trình thăng tiến rõ ràng, được đào tạo chuyên môn thường xuyên và tham gia các dự án lớn.</p>
          </div>
        </div>
      </section>

      <!-- Open Positions -->
      <section>
        <h2 class="text-3xl font-bold text-center mb-12">Vị trí đang tuyển dụng</h2>
        <div class="grid gap-6">
          <div v-for="(job, index) in jobs" :key="index" class="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-muted/50 transition-colors">
            <div class="mb-4 md:mb-0">
              <h3 class="text-xl font-bold mb-2 text-foreground">{{ job.title }}</h3>
              <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ job.location }}
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ job.type }}
                </span>
                <span class="flex items-center gap-1 text-green-600 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ job.salary }}
                </span>
              </div>
            </div>
            <button class="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
              Ứng tuyển ngay
            </button>
          </div>
        </div>
      </section>

      <!-- Contact HR -->
      <section class="mt-20 text-center">
        <p class="text-muted-foreground">
          Bạn chưa tìm thấy vị trí phù hợp? Gửi CV của bạn về <a href="mailto:support@oceanbooks.vn" class="text-primary font-bold hover:underline">support@oceanbooks.vn</a>
          <br>Chúng tôi sẽ liên hệ lại khi có cơ hội phù hợp!
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const jobs = [
  {
    title: "Chuyên viên Marketing Online",
    location: "Buôn Ma Thuột",
    type: "Toàn thời gian",
    salary: "8 - 15 Triệu"
  },
  {
    title: "Nhân viên Bán hàng tại Showroom",
    location: "Buôn Ma Thuột",
    type: "Xoay ca",
    salary: "5 - 8 Triệu + Thưởng"
  },
  {
    title: "Nhân viên Kho & Vận chuyển",
    location: "Buôn Ma Thuột",
    type: "Toàn thời gian",
    salary: "7 - 10 Triệu"
  },
  {
    title: "Content Writer - Review Sách",
    location: "Remote / Online",
    type: "Bán thời gian",
    salary: "Thỏa thuận"
  }
]
</script>
