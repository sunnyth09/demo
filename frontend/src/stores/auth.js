import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';

// Helper function để parse user từ localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getUserFromStorage());
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Đăng ký
  async function register(data) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authApi.register(data);
      return result;
    } catch (err) {
      error.value = err.response?.data?.message || 'Đăng ký thất bại';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Đăng nhập
  async function login(data) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authApi.login(data);
      if (result.status) {
        accessToken.value = result.accessToken;
        refreshToken.value = result.refreshToken;
        user.value = result.user;
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      return result;
    } catch (err) {
      error.value = err.response?.data?.message || 'Đăng nhập thất bại';
      throw err;
    } finally {
      loading.value = false;
    }
  }



  // Quên mật khẩu
  async function forgotPassword(email) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authApi.forgotPassword(email);
      return result;
    } catch (err) {
      error.value = err.response?.data?.message || 'Gửi yêu cầu thất bại';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Đặt lại mật khẩu
  async function resetPassword(data) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authApi.resetPassword(data);
      return result;
    } catch (err) {
      error.value = err.response?.data?.message || 'Đặt lại mật khẩu thất bại';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Đăng xuất
  function logout() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Xác thực token
  async function verifyAuth() {
    if (!accessToken.value) return false;
    try {
      const result = await authApi.verifyToken(accessToken.value);
      if (result.status) {
        user.value = result.user;
        return true;
      }
      return false;
    } catch {
      logout();
      return false;
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    verifyAuth
  };
});
