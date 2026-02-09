import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/contacts`;

export const contactApi = {
  // Gửi liên hệ (Public)
  async submitContact(data) {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  },

  // Lấy danh sách liên hệ (Admin)
  async getAllContacts(params) {
    const response = await axios.get(`${API_URL}`, { 
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data;
  },

  // Xóa liên hệ (Admin)
  async deleteContact(id) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data;
  },

  // Phản hồi liên hệ (Admin)
  async replyContact(id, data) {
    const response = await axios.post(`${API_URL}/${id}/reply`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data;
  }
};
