import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const useFavoriteStore = defineStore("favorite", () => {
  const favorites = ref([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const authStore = useAuthStore();

  const fetchFavorites = async () => {
    if (!authStore.accessToken) return;
    
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      });
      const json = await res.json();
      if (json.status) {
        favorites.value = json.data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async (product) => {
    if (!authStore.accessToken) {
        alert("Vui lòng đăng nhập để yêu thích sản phẩm!");
        return;
    }

    try {
      const res = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      const json = await res.json();
      if (json.status) {
        if (json.data.favorited) {
            // Optimistic update or just fetch
            await fetchFavorites();
        } else {
            await fetchFavorites();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isFavorited = (productId) => {
    return favorites.value.some(f => f.product_id === productId);
  };

  return { favorites, fetchFavorites, toggleFavorite, isFavorited };
});
