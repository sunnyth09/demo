import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

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
