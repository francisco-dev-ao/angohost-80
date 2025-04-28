
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItem } from '@/contexts/CartContext';

// In-memory storage for cart (replace with localStorage or sessionStorage if needed)
let cartItems: CartItem[] = [];

// Cart data functions
const getCartItems = async (): Promise<CartItem[]> => {
  // You could retrieve from localStorage here
  return Promise.resolve(cartItems);
};

const addCartItem = async (item: CartItem): Promise<CartItem[]> => {
  const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    cartItems = cartItems.map((i, index) => 
      index === existingItemIndex
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    );
  } else {
    cartItems = [...cartItems, item];
  }
  
  // You could save to localStorage here
  return Promise.resolve(cartItems);
};

const removeCartItem = async (itemId: string): Promise<CartItem[]> => {
  cartItems = cartItems.filter(item => item.id !== itemId);
  // You could save to localStorage here
  return Promise.resolve(cartItems);
};

const clearCartItems = async (): Promise<CartItem[]> => {
  cartItems = [];
  // You could clear localStorage here
  return Promise.resolve(cartItems);
};

// React Query hook
export function useCartData() {
  const queryClient = useQueryClient();
  
  // Query hook for fetching cart data
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItems,
    initialData: [],
  });

  // Mutation for adding items to cart
  const addToCart = useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Mutation for removing items from cart
  const removeFromCart = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Mutation for clearing the cart
  const clearCart = useMutation({
    mutationFn: clearCartItems,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    items: data,
    isLoading,
    error,
    addToCart: (item: CartItem) => addToCart.mutate(item),
    removeFromCart: (itemId: string) => removeFromCart.mutate(itemId),
    clearCart: () => clearCart.mutate(),
  };
}
