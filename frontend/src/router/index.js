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

const routes = [
  // User routes - with UserLayout (Navbar + Footer)
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: Home, meta: { title: 'Trang chủ' } },
      { path: 'about', name: 'about', component: About, meta: { title: 'Giới thiệu' } },
      { path: 'products', name: 'products', component: Products, meta: { title: 'Sản phẩm' } },
      { path: 'login', name: 'login', component: Login, meta: { title: 'Đăng nhập' } },
      { path: 'register', name: 'register', component: Register, meta: { title: 'Đăng ký' } },
      { path: 'cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { title: 'Giỏ hàng' } },
      { path: 'checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'), meta: { title: 'Thanh toán' } },
      { path: 'profile', name: 'profile', component: () => import('@/views/Profile.vue'), meta: { title: 'Tài khoản' } },
    ]
  },

  // Admin routes - with AdminLayout (Sidebar)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Dashboard' } },
      { path: 'products', name: 'admin-products', component: AdminProducts, meta: { title: 'Sản phẩm' } },
      { path: 'products/create', name: 'admin-products-create', component: AdminProductForm, meta: { title: 'Thêm sản phẩm' } },
      { path: 'products/edit/:id', name: 'admin-products-edit', component: AdminProductForm, meta: { title: 'Sửa sản phẩm' } },
      { path: 'categories', name: 'admin-categories', component: AdminCategories, meta: { title: 'Danh mục' } },
      { path: 'orders', name: 'admin-orders', component: AdminOrders, meta: { title: 'Đơn hàng' } },
      { path: 'users', name: 'admin-users', component: AdminUsers, meta: { title: 'Người dùng' } },
      { path: 'settings', name: 'admin-settings', component: AdminSettings, meta: { title: 'Cài đặt' } },
    ]
  },

  // 404 - no layout
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: '404' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Bookstore` : 'Bookstore'
  next()
})

export default router
