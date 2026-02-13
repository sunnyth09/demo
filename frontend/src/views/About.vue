<template>
  <div class="bg-background min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-primary/5 py-20 md:py-32 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
         <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" class="text-primary"/>
         </svg>
      </div>
      <div class="container max-w-7xl mx-auto px-4 relative z-10 text-center">
        <span class="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in-up">Về Ocean Books</span>
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
          Lan Tỏa Tri Thức <br/>
          <span class="text-primary">Kết Nối Đam Mê</span>
        </h1>
        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
          Chúng tôi không chỉ bán sách, chúng tôi mang đến những hành trình khám phá và nguồn cảm hứng bất tận cho cộng đồng độc giả Việt Nam.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16 space-y-24">
      <!-- Story Section -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="order-2 md:order-1 space-y-6">
          <h2 class="text-3xl font-bold text-foreground">Câu Chuyện Của Chúng Tôi</h2>
          <div class="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Khởi đầu từ một tiệm sách nhỏ nằm nép mình trong con ngõ nhỏ tại Hà Nội vào năm 2020, Ocean Books ra đời với niềm tin giản dị: "Sách là đại dương mênh mông mà ai cũng có quyền được khám phá".
            </p>
            <p>
              Trải qua những năm tháng đầy biến động, chúng tôi đã không ngừng nỗ lực để chuyển mình lên nền tảng số, xóa bỏ rào cản địa lý để mang những cuốn sách hay nhất đến tay bạn đọc trên khắp mọi miền tổ quốc.
            </p>
            <p>
              Hôm nay, Ocean Books tự hào là điểm đến tin cậy của hàng ngàn độc giả, nơi lưu giữ hơn 10,000 đầu sách từ văn học kinh điển đến sách chuyên khảo, phục vụ nhu cầu học tập và giải trí đa dạng.
            </p>
          </div>
        </div>
        <div class="order-1 md:order-2 relative">
          <div class="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl -z-10 blur-xl"></div>
          <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop" alt="Our Story" class="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] hover:scale-[1.02] transition-transform duration-500" />
        </div>
      </div>

      <!-- Mission & Values -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-1 bg-primary text-primary-foreground p-8 rounded-2xl flex flex-col justify-center">
          <h2 class="text-2xl font-bold mb-4">Sứ Mệnh & Tầm Nhìn</h2>
          <p class="mb-6 opacity-90">
            Trở thành nền tảng thương mại điện tử về sách hàng đầu, xây dựng văn hóa đọc bền vững và tạo ra cộng đồng tri thức gắn kết.
          </p>
          <ul class="space-y-3">
             <li class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Khơi dậy niềm đam mê đọc sách</li>
             <li class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Cung cấp sách chính hãng 100%</li>
             <li class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Dịch vụ khách hàng tận tâm</li>
          </ul>
        </div>
        <div class="md:col-span-2 grid sm:grid-cols-2 gap-6">
           <div v-for="value in coreValues" :key="value.title" class="bg-card border border-border p-6 rounded-xl hover:shadow-md transition-all group">
              <div class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                 <component :is="value.icon" class="w-6 h-6" />
              </div>
              <h3 class="font-bold text-lg mb-2">{{ value.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ value.desc }}</p>
           </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="bg-muted/30 rounded-3xl p-12 text-center">
         <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="stat in stats" :key="stat.label" class="space-y-2">
               <div class="text-4xl md:text-5xl font-extrabold text-primary">{{ stat.value }}</div>
               <div class="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">{{ stat.label }}</div>
            </div>
         </div>
      </div>

      <!-- Team -->
      <div class="text-center space-y-12">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Đội Ngũ Nhiệt Huyết</h2>
          <p class="text-muted-foreground">Những con người đứng sau Ocean Books, làm việc không ngừng nghỉ để mang đến trải nghiệm tốt nhất cho bạn.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="member in team" :key="member.name" class="group relative overflow-hidden rounded-2xl">
            <img :src="member.image" :alt="member.name" class="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
               <h3 class="text-xl font-bold">{{ member.name }}</h3>
               <p class="text-white/80 text-sm mb-4">{{ member.role }}</p>
               <div class="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <!-- Fake Social Icons -->
                  <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 cursor-pointer">FB</div>
                  <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 cursor-pointer">LN</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="space-y-12">
         <h2 class="text-3xl font-bold text-center">Khách Hàng Nói Gì Về Chúng Tôi</h2>
         <div class="grid md:grid-cols-3 gap-6">
            <div v-for="review in testimonials" :key="review.author" class="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors">
               <div class="flex gap-1 text-yellow-500 mb-4">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               </div>
               <p class="text-muted-foreground italic mb-6">"{{ review.text }}"</p>
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                     {{ review.author.charAt(0) }}
                  </div>
                  <div>
                     <div class="font-bold text-sm">{{ review.author }}</div>
                     <div class="text-xs text-muted-foreground">Độc giả thân thiết</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- CTA -->
      <div class="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground py-16 px-6 text-center">
         <div class="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
         <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
         
         <div class="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold">Sẵn Sàng Khám Phá Tri Thức Mới?</h2>
            <p class="text-white/80 text-lg">Hàng ngàn cuốn sách thú vị đang chờ đợi bạn. Hãy bắt đầu hành trình ngay hôm nay!</p>
            <router-link to="/products" class="inline-flex h-12 items-center justify-center rounded-full bg-background text-primary px-8 font-bold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
               Khám Phá Ngay
            </router-link>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
   BookOpenIcon, 
   HeartIcon, 
   LightbulbIcon, 
   UsersIcon 
} from 'lucide-vue-next'

const stats = [
  { value: '10K+', label: 'Đầu sách' },
  { value: '50K+', label: 'Khách hàng' },
  { value: '150K+', label: 'Đơn hàng' },
  { value: '99%', label: 'Hài lòng' },
]

const coreValues = [
   { title: 'Chất Lượng', desc: 'Cam kết sách chính hãng, giấy tốt, in ấn sắc nét.', icon: BookOpenIcon },
   { title: 'Tận Tâm', desc: 'Luôn lắng nghe và đặt lợi ích khách hàng lên hàng đầu.', icon: HeartIcon },
   { title: 'Sáng Tạo', desc: 'Không ngừng đổi mới để mang lại trải nghiệm tốt nhất.', icon: LightbulbIcon },
   { title: 'Cộng Đồng', desc: 'Kết nối và lan tỏa văn hóa đọc đến mọi người.', icon: UsersIcon },
]

const team = [
  { name: 'Nguyễn Đại Dương', role: 'Founder & CEO', image: 'https://scontent.fbmv1-1.fna.fbcdn.net/v/t39.30808-6/558450365_816970140833487_2131371447658821012_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YLerd3StuXUQ7kNvwH3d-c0&_nc_oc=Adkic1SPRdG002vZoeYGnKXrUGqqdv4YJB3KcCsJpcSLhAlKPtCjKPUZFAue1iaeDck&_nc_zt=23&_nc_ht=scontent.fbmv1-1.fna&_nc_gid=RMalzUme2Wi6PEWsDaY6wg&oh=00_AftcZLH_B_Nko8XFtDQsTx0XMoZU5xKFxXZ-ZgFP5UTItA&oe=699452A3' },
  { name: 'Bùi Chí Bình', role: 'Content Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Bống em', role: 'Tech Lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400 ' },
]

const testimonials = [
   { text: 'Sách đóng gói rất cẩn thận, giao hàng nhanh. Mình rất ấn tượng với dịch vụ chăm sóc khách hàng của Ocean Books.', author: 'Hoàng Anh' },
   { text: 'Giao diện website đẹp, dễ tìm sách. Giá cả rất hợp lý so với thị trường. Sẽ ủng hộ dài dài!', author: 'Minh Thư' },
   { text: 'Nhiều đầu sách hay và hiếm. Mình đã tìm được cuốn sách yêu thích từ thời sinh viên ở đây. Cảm ơn shop!', author: 'Quốc Bảo' },
]
</script>

<style scoped>
.animate-fade-in-up {
   animation: fadeInUp 0.8s ease-out forwards;
   opacity: 0;
   transform: translateY(20px);
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }

@keyframes fadeInUp {
   to {
      opacity: 1;
      transform: translateY(0);
   }
}
</style>
