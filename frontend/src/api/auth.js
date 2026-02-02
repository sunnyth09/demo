import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const authApi = {
  // Đăng ký tài khoản mới
  async register(data) {
    const response = await axios.post(`${API_URL}/register`, {
      name: data.name,
      email: data.email,
      password: data.password
    });
    return response.data;
  },

  // Đăng nhập
  async login(data) {
    const response = await axios.post(`${API_URL}/login`, {
      email: data.email,
      password: data.password
    });
    return response.data;
  },

  // Quên mật khẩu
  async forgotPassword(email) {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  // Đặt lại mật khẩu
  async resetPassword(data) {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword
    });
    return response.data;
  },

  // Xác thực token
  async verifyToken(token) {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
