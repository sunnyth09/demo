<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero -->
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold mb-4">Về chúng tôi</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Bookstore được thành lập với sứ mệnh mang tri thức đến gần hơn với mọi người.
      </p>
    </div>

    <!-- Story -->
    <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
      <div class="space-y-6">
        <h2 class="text-3xl font-bold">Câu chuyện của chúng tôi</h2>
        <p class="text-muted-foreground">
          Bắt đầu từ một cửa hàng sách nhỏ năm 2020, Bookstore đã phát triển thành một trong những nhà sách trực tuyến hàng đầu Việt Nam.
        </p>
        <p class="text-muted-foreground">
          Chúng tôi tin rằng mỗi cuốn sách là một cánh cửa mở ra thế giới mới. Với hơn 10,000 đầu sách từ nhiều thể loại, chúng tôi cam kết mang đến những cuốn sách chất lượng nhất cho độc giả.
        </p>
      </div>
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 aspect-square flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-4">📚</div>
          <p class="text-xl font-semibold">Since 2020</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
      <div v-for="stat in stats" :key="stat.label" class="bg-card rounded-xl border p-6 text-center">
        <div class="text-3xl font-bold text-primary mb-2">{{ stat.value }}</div>
        <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Team -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Những con người đam mê sách và công nghệ, luôn nỗ lực mang đến trải nghiệm tốt nhất cho bạn.
      </p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div v-for="member in team" :key="member.name" class="bg-card rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 flex items-center justify-center text-4xl">
          {{ member.avatar }}
        </div>
        <h3 class="font-semibold mb-1">{{ member.name }}</h3>
        <p class="text-sm text-muted-foreground">{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { value: '10K+', label: 'Đầu sách' },
  { value: '50K+', label: 'Khách hàng' },
  { value: '100K+', label: 'Đơn hàng' },
  { value: '4.9★', label: 'Đánh giá' },
]

const team = [
  { name: 'Nguyễn Văn A', role: 'Founder & CEO', avatar: '👨‍💼' },
  { name: 'Trần Thị B', role: 'Marketing Manager', avatar: '👩‍💻' },
  { name: 'Lê Văn C', role: 'Tech Lead', avatar: '👨‍🔬' },
]
</script>
