import React, { createContext, useContext, useState, useEffect } from 'react';
import { shopifyService, type ShopifyCart, type ShopifyProduct } from '@/lib/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: ShopifyProduct, variantId: string, quantity?: number) => Promise<boolean>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (lineItemId: string) => Promise<boolean>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartOpen, setCartOpenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Custom setCartOpen that scrolls to top when opening
  const setCartOpen = (open: boolean) => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCartOpenState(open);
  };

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      // Check if we have a cart ID in localStorage
      const savedCartId = localStorage.getItem('shopify_cart_id');
      
      if (savedCartId) {
        try {
          const existingCart = await shopifyService.fetchCart(savedCartId);
          if (existingCart) {
            setCart(existingCart);
            return;
          }
        } catch (error) {
          console.error('Error fetching existing cart:', error);
        }
      }

      // Create new cart if no existing cart
      try {
        const newCart = await shopifyService.createCart();
        if (newCart) {
          setCart(newCart);
          localStorage.setItem('shopify_cart_id', newCart.id);
        }
      } catch (error) {
        console.error('Error creating new cart:', error);
      }
    };

    initializeCart();
  }, []);

  const addToCart = async (product: ShopifyProduct, variantId: string, quantity: number = 1): Promise<boolean> => {
    if (!cart) return false;

    setIsLoading(true);
    try {
      const updatedCart = await shopifyService.addToCart(cart.id, variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (lineItemId: string, quantity: number): Promise<boolean> => {
    if (!cart) return false;

    setIsLoading(true);
    try {
      const updatedCart = await shopifyService.updateCartItem(cart.id, lineItemId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string): Promise<boolean> => {
    if (!cart) return false;

    setIsLoading(true);
    try {
      const updatedCart = await shopifyService.removeFromCart(cart.id, lineItemId);
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = (): number => {
    if (!cart) return 0;
    return cart.lineItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    if (!cart) return 0;
    return parseFloat(cart.totalPrice.amount);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateCartItem,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}