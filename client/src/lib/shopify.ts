// Frontend Shopify service using server API endpoints

// Types for Shopify data
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: Array<{
    id: string;
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
  }>;
  vendor?: string;
  productType?: string;
  tags: string[];
}

export interface ShopifyCart {
  id: string;
  lineItems: Array<{
    id: string;
    title: string;
    variant: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      product: {
        title: string;
        handle: string;
      };
    };
    quantity: number;
  }>;
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  webUrl: string;
}

// Shopify service functions
export const shopifyService = {
  // Fetch all products
  async fetchProducts(): Promise<ShopifyProduct[]> {
    try {
      const response = await fetch('/api/shopify/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Fetch single product by handle (not implemented for server API yet)
  async fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    try {
      // For now, fetch all products and find by handle
      const products = await this.fetchProducts();
      return products.find(p => p.handle === handle) || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create cart
  async createCart(): Promise<ShopifyCart | null> {
    try {
      const response = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  },

  // Add item to cart
  async addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
    try {
      const response = await fetch(`/api/shopify/cart/${encodeURIComponent(cartId)}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ variantId, quantity })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  },

  // Update cart item quantity
  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<ShopifyCart | null> {
    try {
      const response = await fetch(`/api/shopify/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(lineItemId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  },

  // Remove item from cart
  async removeFromCart(cartId: string, lineItemId: string): Promise<ShopifyCart | null> {
    try {
      const response = await fetch(`/api/shopify/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(lineItemId)}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  },

  // Fetch cart by ID
  async fetchCart(cartId: string): Promise<ShopifyCart | null> {
    try {
      const response = await fetch(`/api/shopify/cart/${encodeURIComponent(cartId)}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cart fetch error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }
};