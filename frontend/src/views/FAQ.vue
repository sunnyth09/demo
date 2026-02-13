<template>
  <div class="container max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-center">Câu Hỏi Thường Gặp (FAQ)</h1>
    
    <div class="max-w-3xl mx-auto space-y-6">
      <div v-for="(faq, index) in faqs" :key="index" class="bg-card border border-border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 111.731-1A3 3 0 0013 8a3.001 3.001 0 00-2 2.83V11a1 1 0 11-2 0v-1.17A5.001 5.001 0 0112 5a5 5 0 013.916 2.038l-.001.001zM11 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          {{ faq.question }}
        </h3>
        <p class="text-muted-foreground ml-7">{{ faq.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const faqs = [
  {
    question: "Làm thế nào để tôi đặt hàng?",
    answer: "Bạn có thể đặt hàng trực tuyến trên website của chúng tôi bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Quá trình này nhanh chóng và bảo mật."
  },
  {
    question: "Phí vận chuyển được tính như thế nào?",
    answer: "Phí vận chuyển dựa trên địa chỉ giao hàng và trọng lượng đơn hàng. Chúng tôi thường xuyên có các chương trình miễn phí vận chuyển cho đơn hàng đạt giá trị tối thiểu."
  },
  {
    question: "Tôi có thể hủy đơn hàng không?",
    answer: "Bạn có thể yêu cầu hủy đơn hàng trong phần 'Đơn hàng của tôi' nếu đơn hàng chưa được chuyển sang trạng thái 'Đang vận chuyển'. Nếu đã vận chuyển, vui lòng xem chính sách đổi trả."
  },
  {
    question: "Bao lâu thì tôi nhận được hàng?",
    answer: "Thời gian giao hàng thông thường là 2-5 ngày làm việc tùy thuộc vào địa điểm của bạn. Khu vực nội thành có thể nhận hàng trong 24h."
  },
  {
    question: "Sách có phải là sách chính hãng không?",
    answer: "Ocean Books cam kết 100% sách bán ra là sách chính hãng, được nhập trực tiếp từ các nhà xuất bản uy tín."
  }
]
</script>
