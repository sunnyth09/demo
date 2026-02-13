import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/cart`;

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const cartApi = {
  async getCart(token) {
    const response = await axios.get(`${API_URL}`, getAuthHeader(token));
    return response.data;
  },

  async addToCart(token, { productId, quantity }) {
    const response = await axios.post(`${API_URL}/add`, { productId, quantity }, getAuthHeader(token));
    return response.data;
  },

  async updateItem(token, { productId, quantity }) {
    const response = await axios.put(`${API_URL}/update`, { productId, quantity }, getAuthHeader(token));
    return response.data;
  },

  async removeItem(token, { productId }) {
    const response = await axios.delete(`${API_URL}/remove`, {
      data: { productId },
      ...getAuthHeader(token)
    });
    return response.data;
  },

  async clearCart(token) {
    const response = await axios.delete(`${API_URL}/clear`, getAuthHeader(token));
    return response.data;
  },

  async syncCart(token, items) {
    const response = await axios.post(`${API_URL}/sync`, { items }, getAuthHeader(token));
    return response.data;
  }
};
