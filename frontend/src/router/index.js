import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Public views
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Products from '@/views/Products.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import NotFound from '@/views/NotFound.vue'

// Admin views
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminProducts from '@/views/admin/Products.vue'
import AdminProductForm from '@/views/admin/ProductForm.vue'
import AdminCategories from '@/views/admin/Categories.vue'
import AdminOrders from '@/views/admin/Orders.vue'
import AdminUsers from '@/views/admin/Users.vue'
import AdminSettings from '@/views/admin/Settings.vue'
import AdminRevenue from '@/views/admin/RevenueAnalytics.vue'
import AdminArticles from '@/views/admin/Articles.vue'

import AdminArticleForm from '@/views/admin/ArticleForm.vue'
import AdminContacts from '@/views/admin/Contacts.vue'

const routes = [
  // User routes - with UserLayout (Navbar + Footer)
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: Home, meta: { title: 'Trang chủ', description: 'Ocean Books - Đại dương tri thức, nơi cung cấp sách hay nhất Việt Nam' } },
      { path: 'about', name: 'about', component: About, meta: { title: 'Giới thiệu', description: 'Tìm hiểu về Ocean Books - Sứ mệnh mang tri thức đến mọi người' } },
      { path: 'products', name: 'products', component: Products, meta: { title: 'Sản phẩm', description: 'Khám phá hàng ngàn đầu sách từ Ocean Books với giá ưu đãi' } },
      { path: 'products/:id', name: 'product-detail', component: () => import('@/views/ProductDetail.vue'), meta: { title: 'Chi tiết sản phẩm' } },
      { path: 'login', name: 'login', component: Login, meta: { title: 'Đăng nhập', description: 'Đăng nhập tài khoản Ocean Books để mua sắm và quản lý đơn hàng' } },
      { path: 'auth/callback', name: 'auth-callback', component: () => import('@/views/AuthCallback.vue'), meta: { title: 'Đang xử lý đăng nhập...' } },
      { path: 'register', name: 'register', component: Register, meta: { title: 'Đăng ký', description: 'Tạo tài khoản Ocean Books miễn phí để nhận ưu đãi hấp dẫn' } },
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPassword, meta: { title: 'Quên mật khẩu' } },
      { path: 'cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { title: 'Giỏ hàng' } },
      { path: 'checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'), meta: { title: 'Thanh toán' } },
      { path: 'profile', name: 'profile', component: () => import('@/views/Profile.vue'), meta: { title: 'Tài khoản' } },
      { path: 'orders', name: 'orders', component: () => import('@/views/Profile.vue'), meta: { title: 'Đơn hàng của tôi' } },
      { path: 'orders/:id', name: 'order-detail', component: () => import('@/views/OrderDetail.vue'), meta: { title: 'Chi tiết đơn hàng' } },
      { path: 'articles', name: 'articles', component: () => import('@/views/Articles.vue'), meta: { title: 'Góc đọc sách', description: 'Góc đọc sách - Chia sẻ kiến thức và review sách hay từ cộng đồng' } },
      { path: 'articles/:id', name: 'article-detail', component: () => import('@/views/ArticleDetail.vue'), meta: { title: 'Chi tiết bài viết' } },
      { path: 'favorites', name: 'favorites', component: () => import('@/views/Favorites.vue'), meta: { title: 'Sản phẩm yêu thích' } },
      { path: 'vouchers', name: 'vouchers', component: () => import('@/views/Vouchers.vue'), meta: { title: 'Săn Voucher', description: 'Săn voucher giảm giá hấp dẫn từ Ocean Books' } },

      { path: 'contact', name: 'contact', component: () => import('@/views/Contact.vue'), meta: { title: 'Liên hệ', description: 'Liên hệ Ocean Books - Hỗ trợ khách hàng 24/7' } },
      
      // Policy pages
      { path: 'faq', name: 'faq', component: () => import('@/views/FAQ.vue'), meta: { title: 'FAQ - Câu hỏi thường gặp' } },
      { path: 'return-policy', name: 'return-policy', component: () => import('@/views/ReturnPolicy.vue'), meta: { title: 'Chính sách đổi trả' } },
      { path: 'terms-of-service', name: 'terms-of-service', component: () => import('@/views/TermsOfService.vue'), meta: { title: 'Điều khoản dịch vụ' } },
      { path: 'privacy-policy', name: 'privacy-policy', component: () => import('@/views/PrivacyPolicy.vue'), meta: { title: 'Chính sách bảo mật' } },
      { path: 'shopping-guide', name: 'shopping-guide', component: () => import('@/views/ShoppingGuide.vue'), meta: { title: 'Hướng dẫn mua hàng' } },
      { path: 'recruitment', name: 'recruitment', component: () => import('@/views/Recruitment.vue'), meta: { title: 'Tuyển dụng - Cơ hội nghề nghiệp' } },
      { path: 'cookies', redirect: '/privacy-policy' }, // Redirect cookies to privacy policy for now
      
      { path: 'payment/result', name: 'payment-result', component: () => import('@/views/PaymentResult.vue'), meta: { title: 'Kết quả thanh toán' } },
    ]
  },

  // Admin routes - with AdminLayout (Sidebar)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Dashboard' } },
      { path: 'revenue', name: 'admin-revenue', component: AdminRevenue, meta: { title: 'Thống kê chi tiết' } },

      { path: 'contacts', name: 'admin-contacts', component: AdminContacts, meta: { title: 'Liên hệ' } },
      { path: 'products', name: 'admin-products', component: AdminProducts, meta: { title: 'Sản phẩm' } },
      { path: 'products/create', name: 'admin-products-create', component: AdminProductForm, meta: { title: 'Thêm sản phẩm' } },
      { path: 'products/edit/:id', name: 'admin-products-edit', component: AdminProductForm, meta: { title: 'Sửa sản phẩm' } },
      { path: 'articles', name: 'admin-articles', component: AdminArticles, meta: { title: 'Bài viết' } },
      { path: 'articles/create', name: 'admin-articles-create', component: AdminArticleForm, meta: { title: 'Viết bài mới' } },
      { path: 'articles/edit/:id', name: 'admin-articles-edit', component: AdminArticleForm, meta: { title: 'Sửa bài viết' } },
      { path: 'categories', name: 'admin-categories', component: AdminCategories, meta: { title: 'Danh mục' } },
      { path: 'orders', name: 'admin-orders', component: AdminOrders, meta: { title: 'Đơn hàng' } },
      { path: 'orders/:id', name: 'admin-order-detail', component: () => import('@/views/admin/OrderDetail.vue'), meta: { title: 'Chi tiết đơn hàng' } },
      { path: 'users', name: 'admin-users', component: AdminUsers, meta: { title: 'Người dùng' } },
      { path: 'shipping', name: 'admin-shipping', component: () => import('@/views/admin/ShippingZones.vue'), meta: { title: 'Phí vận chuyển' } },
      { path: 'coupons', name: 'admin-coupons', component: () => import('@/views/admin/Coupons.vue'), meta: { title: 'Mã giảm giá' } },
      { path: 'reviews', name: 'admin-reviews', component: () => import('@/views/admin/Reviews.vue'), meta: { title: 'Đánh giá & Bình luận' } },
      { path: 'settings', name: 'admin-settings', component: AdminSettings, meta: { title: 'Cài đặt' } },
    ]
  },

  // 404 - no layout
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: '404' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If user uses browser back/forward, restore saved position
    if (savedPosition) {
      return savedPosition
    }
    // If navigating to a hash (anchor), scroll to that element
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // Otherwise, scroll to top
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Ocean Books` : 'Ocean Books'

  // Update meta description for SEO
  const descMeta = document.querySelector('meta[name="description"]')
  if (to.meta.description) {
    if (descMeta) {
      descMeta.setAttribute('content', to.meta.description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = to.meta.description
      document.head.appendChild(meta)
    }
  }

  // Kiểm tra phân quyền admin
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    const authStore = useAuthStore()

    // Chưa đăng nhập → về login
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' })
    }

    // Xác thực token với server
    const isValid = await authStore.verifyAuth()
    if (!isValid) {
      return next({ name: 'login' })
    }

    // Không phải admin → về trang chủ
    if (!authStore.isAdmin) {
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
