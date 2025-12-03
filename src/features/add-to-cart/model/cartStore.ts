import type { Product } from '~/shared/types/product';
import { useUserStore } from '~/entities/user/model/userStore';

export const useCartStore = defineStore('cartStore', () => {
  const shoppingCart = ref<Product[]>([]);

  function insertProductToCart(product: Product) {
    shoppingCart.value.push(product);
  }

  function deleteProductFromCart(productId: string) {
    const productIndex = shoppingCart.value.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
      shoppingCart.value.splice(productIndex, 1);
    }
  }

  function resetShoppingCart() {
    shoppingCart.value = [];
  }

  const shoppingCartSum = computed(() => {
    return shoppingCart.value.reduce((total, item) => total + item.price, 0);
  });

  function processPurchase() {
    const purchaseSum = shoppingCartSum.value;
    const userStore = useUserStore();

    if (userStore.user) {
      userStore.user.balance -= purchaseSum;
    }

    if (import.meta.client && shoppingCart.value.length > 0) {
      const STORAGE_KEY = 'recent-purchases';

      try {
        const storedPurchases = localStorage.getItem(STORAGE_KEY);
        const previousPurchases: Product[] = storedPurchases ? JSON.parse(storedPurchases) : [];
        const allPurchases = [...shoppingCart.value, ...previousPurchases];
        const limitedPurchases = allPurchases.slice(0, 50);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedPurchases));
        window.dispatchEvent(new Event('purchase-completed'));
      } catch (error) {
        console.error('Ошибка сохранения покупок в localStorage:', error);
      }
    }

    resetShoppingCart();
  }

  return {
    cart: shoppingCart,
    cartTotal: shoppingCartSum,
    addToCart: insertProductToCart,
    removeFromCart: deleteProductFromCart,
    clearCart: resetShoppingCart,
    purchaseCart: processPurchase,
  };
});

