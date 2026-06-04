import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // generate a unique id for the cart item (product.id + color + quality)
  productId: string;
  name: string;
  image: string;
  pricePerMeter: number;
  meters: number;
  color: string;
  quality?: string;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateMeters: (id: string, meters: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        // Check if item exactly matches (same product, same color, same quality)
        const existingItemIndex = state.items.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Update existing item meters and total price
          const updatedItems = [...state.items];
          const existing = updatedItems[existingItemIndex];
          existing.meters += item.meters;
          existing.totalPrice = existing.meters * existing.pricePerMeter;
          return { items: updatedItems };
        }
        
        return { items: [...state.items, item] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      updateMeters: (id, meters) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id 
            ? { ...item, meters, totalPrice: meters * item.pricePerMeter }
            : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      }
    }),
    {
      name: 'moonlight-cart', // name of the item in the storage (must be unique)
    }
  )
);
