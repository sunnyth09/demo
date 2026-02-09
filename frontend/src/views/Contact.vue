<template>
  <div class="min-h-screen bg-background">
    <!-- Header / Banner -->
    <div class="bg-primary/5 py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-foreground mb-4">Liên hệ với chúng tôi</h1>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
          Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất có thể.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Info -->
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-semibold mb-6">Thông tin liên hệ</h3>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-lg mb-1">Địa chỉ</h4>
                  <p class="text-muted-foreground">134 Nguyễn Thị Định, Phường Thành Nhất, TP. Buôn Ma Thuột, Tỉnh Đắk Lắk</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-lg mb-1">Email</h4>
                  <p class="text-muted-foreground">contact@oceanbooks.vn</p>
                  <p class="text-muted-foreground">support@oceanbooks.vn</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-lg mb-1">Điện thoại</h4>
                  <p class="text-muted-foreground">1900-OCEAN (1900-62326)</p>
                  <p class="text-muted-foreground">Hours: 8:00 - 17:00 (Mon - Fri)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Map (Placeholder) -->
          <!-- <div class="rounded-xl overflow-hidden h-64 bg-muted border border-border">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.492723737526!2d108.0382473148123!3d12.681605991047605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31721d8b67195c6f%3A0xe5f2b8f8705d0452!2zMTM0IE5ndXnhu4VuIFRo4buLIMSQ4buLbmgsIFRow6BuaCBOaOG6pXQsIFRow6BuaCBwaOG7kSBCdcO0biBNYSBUaHXhuq10LCDEkOG6r2sgTOG6r2sgNjMwMDAsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1679540000000!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div> -->
        </div>

        <!-- Contact Form -->
        <div class="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h3 class="text-2xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h3>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Họ và tên <span class="text-red-500">*</span></label>
              <input 
                id="name"
                v-model="form.name"
                type="text" 
                class="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email <span class="text-red-500">*</span></label>
              <input 
                id="email"
                v-model="form.email"
                type="email" 
                class="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                placeholder="Nhập email của bạn"
              />
            </div>

            <div class="space-y-2">
              <label for="subject" class="text-sm font-medium">Tiêu đề <span class="text-red-500">*</span></label>
              <input 
                id="subject"
                v-model="form.subject"
                type="text" 
                class="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                placeholder="Bạn cần hỗ trợ vấn đề gì?"
              />
            </div>

            <div class="space-y-2">
              <label for="message" class="text-sm font-medium">Nội dung <span class="text-red-500">*</span></label>
              <textarea 
                id="message"
                v-model="form.message"
                rows="5" 
                class="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
                placeholder="Nhập nội dung tin nhắn..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              class="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              :disabled="loading"
            >
              <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              <span v-else>Gửi tin nhắn</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { contactApi } from '@/api/contact';
import { toast } from 'vue-sonner';

const loading = ref(false);
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    const res = await contactApi.submitContact(form);
    
    if (res.status === 'success') {
      toast.success(res.message);
      // Reset form
      form.name = '';
      form.email = '';
      form.subject = '';
      form.message = '';
    } else {
      toast.error(res.message || 'Có lỗi xảy ra');
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
    toast.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>
