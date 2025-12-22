// ============================================
// FILE: src/store/cartStore.js
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import client from '../api/client';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      loading: false,
      initialized: false,
      userId: null, // Track which user's cart this is

      // Sync cart from backend
      syncCart: async (userId) => {
        if (!userId) {
          set({ items: [], userId: null, initialized: true });
          return;
        }

        // If cart is already synced for this user, skip
        if (get().initialized && get().userId === userId) {
          return;
        }

        set({ loading: true });
        try {
          const response = await client.get('/cart');
          if (response.data.success) {
            const backendItems = response.data.data.cart.items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              images: item.product.images,
              stock: item.product.stock,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              slug: item.product.slug
            }));
            set({ items: backendItems, userId, initialized: true });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          // If user is logged in but cart fetch fails, clear local cart
          if (error.response?.status !== 401) {
            set({ items: [], userId, initialized: true });
          }
        } finally {
          set({ loading: false });
        }
      },

      // Add item to cart
      addItem: async (item) => {
        const currentUserId = get().userId;
        
        try {
          // If user is logged in, add to backend
          if (currentUserId) {
            await client.post('/cart/add', {
              productId: item.id,
              quantity: item.quantity || 1,
              size: item.size,
              color: item.color
            });
            // Refresh cart from backend
            await get().syncCart(currentUserId);
          } else {
            // Guest cart - local only
            const existingItem = get().items.find(
              i => i.id === item.id && 
                   i.size === item.size && 
                   i.color === item.color
            );

            if (existingItem) {
              set({
                items: get().items.map(i =>
                  i.id === item.id && 
                  i.size === item.size && 
                  i.color === item.color
                    ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                    : i
                )
              });
            } else {
              set({ items: [...get().items, { ...item, quantity: item.quantity || 1 }] });
            }
          }
          toast.success('Added to cart!');
        } catch (error) {
          console.error('Error adding to cart:', error);
          toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
      },

      // Update item quantity
      updateQuantity: async (itemId, quantity, size, color) => {
        const currentUserId = get().userId;

        if (quantity < 1) {
          return get().removeItem(itemId, size, color);
        }

        try {
          if (currentUserId) {
            // Find the cart item ID from backend
            const response = await client.get('/cart');
            const cartItem = response.data.data.cart.items.find(
              item => item.product.id === itemId && 
                     item.size === size && 
                     item.color === color
            );

            if (cartItem) {
              await client.put(`/cart/items/${cartItem.id}`, { quantity });
              await get().syncCart(currentUserId);
            }
          } else {
            // Guest cart
            set({
              items: get().items.map(item =>
                item.id === itemId && 
                item.size === size && 
                item.color === color
                  ? { ...item, quantity }
                  : item
              )
            });
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
          toast.error('Failed to update quantity');
        }
      },

      // Remove item from cart
      removeItem: async (itemId, size, color) => {
        const currentUserId = get().userId;

        try {
          if (currentUserId) {
            // Find the cart item ID from backend
            const response = await client.get('/cart');
            const cartItem = response.data.data.cart.items.find(
              item => item.product.id === itemId && 
                     item.size === size && 
                     item.color === color
            );

            if (cartItem) {
              await client.delete(`/cart/items/${cartItem.id}`);
              await get().syncCart(currentUserId);
            }
          } else {
            // Guest cart
            set({
              items: get().items.filter(
                item => !(item.id === itemId && 
                         item.size === size && 
                         item.color === color)
              )
            });
          }
          toast.success('Removed from cart');
        } catch (error) {
          console.error('Error removing from cart:', error);
          toast.error('Failed to remove item');
        }
      },

      // Clear cart
      clearCart: async () => {
        const currentUserId = get().userId;

        try {
          if (currentUserId) {
            await client.delete('/cart/clear');
          }
          set({ items: [] });
        } catch (error) {
          console.error('Error clearing cart:', error);
          toast.error('Failed to clear cart');
        }
      },

      // Clear cart on logout
      logout: () => {
        set({ items: [], userId: null, initialized: false });
      },

      // Get cart summary
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Calculate cart totals with shipping and tax
      getCartSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = subtotal >= 1000 ? 0 : 50;
        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + shippingCost + tax;

        return {
          subtotal: parseFloat(subtotal.toFixed(2)),
          shippingCost: parseFloat(shippingCost.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount: get().getItemCount()
        };
      }
    }),
    {
      name: 'shina-cart-storage',
      // Partition storage by userId
      partialize: (state) => ({
        items: state.items,
        userId: state.userId
      })
    }
  )
);

export { useCartStore };