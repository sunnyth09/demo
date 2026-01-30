import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Public views
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Products from '@/views/Products.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
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

const routes = [
  // User routes - with UserLayout (Navbar + Footer)
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: Home, meta: { title: 'Trang chủ' } },
      { path: 'about', name: 'about', component: About, meta: { title: 'Giới thiệu' } },
      { path: 'products', name: 'products', component: Products, meta: { title: 'Sản phẩm' } },
      { path: 'products/:id', name: 'product-detail', component: () => import('@/views/ProductDetail.vue'), meta: { title: 'Chi tiết sản phẩm' } },
      { path: 'login', name: 'login', component: Login, meta: { title: 'Đăng nhập' } },
      { path: 'register', name: 'register', component: Register, meta: { title: 'Đăng ký' } },
      { path: 'cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { title: 'Giỏ hàng' } },
      { path: 'checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'), meta: { title: 'Thanh toán' } },
      { path: 'profile', name: 'profile', component: () => import('@/views/Profile.vue'), meta: { title: 'Tài khoản' } },
      { path: 'orders', name: 'orders', component: () => import('@/views/Profile.vue'), meta: { title: 'Đơn hàng của tôi' } },
      { path: 'orders/:id', name: 'order-detail', component: () => import('@/views/OrderDetail.vue'), meta: { title: 'Chi tiết đơn hàng' } },
      { path: 'articles', name: 'articles', component: () => import('@/views/Articles.vue'), meta: { title: 'Góc đọc sách' } },
      { path: 'articles/:id', name: 'article-detail', component: () => import('@/views/ArticleDetail.vue'), meta: { title: 'Chi tiết bài viết' } },
    ]
  },

  // Admin routes - with AdminLayout (Sidebar)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Dashboard' } },
      { path: 'revenue', name: 'admin-revenue', component: AdminRevenue, meta: { title: 'Thống kê chi tiết' } },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Bookstore` : 'Bookstore'
  next()
})

export default router
