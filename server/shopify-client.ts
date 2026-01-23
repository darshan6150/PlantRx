import Client from 'shopify-buy';

// Initialize Shopify client with environment variables
const client = Client.buildClient({
  domain: process.env.SHOPIFY_STORE_DOMAIN || '',
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
});

export default client;

// Types for Shopify data (shared with frontend)
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

// Shopify service functions for server-side use
export const serverShopifyService = {
  // Fetch all products with pagination
  async fetchProducts(): Promise<ShopifyProduct[]> {
    try {
      let allProducts: any[] = [];
      let hasMore = true;
      let currentPage: any[] = [];
      
      // Start with a reasonable page size
      currentPage = await client.product.fetchAll(50);
      allProducts = [...currentPage];
      
      // Continue fetching pages until no more products
      while (hasMore && currentPage.length > 0) {
        try {
          if (currentPage.length === 50) {
            // Try to fetch next page
            const nextPage = await client.product.fetchNextPage(currentPage);
            if (nextPage && nextPage.length > 0) {
              allProducts = [...allProducts, ...nextPage];
              currentPage = nextPage;
            } else {
              hasMore = false;
            }
          } else {
            // Less than 50 products means we've reached the end
            hasMore = false;
          }
        } catch (error) {
          console.log('No more pages available, total fetched:', allProducts.length);
          hasMore = false;
        }
      }
      
      console.log(`Fetched ${allProducts.length} total products`);
      
      return allProducts.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        images: product.images.map((img: any) => ({
          id: img.id,
          src: img.src,
          altText: img.altText
        })),
        variants: product.variants.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode
          },
          available: variant.available
        })),
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Create cart
  async createCart(): Promise<ShopifyCart | null> {
    try {
      const cart = await client.checkout.create();
      return {
        id: cart.id,
        lineItems: cart.lineItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: {
              amount: item.variant.price.amount,
              currencyCode: item.variant.price.currencyCode
            },
            product: {
              title: item.variant.product.title,
              handle: item.variant.product.handle
            }
          },
          quantity: item.quantity
        })),
        subtotalPrice: {
          amount: cart.subtotalPrice.amount,
          currencyCode: cart.subtotalPrice.currencyCode
        },
        totalPrice: {
          amount: cart.totalPrice.amount,
          currencyCode: cart.totalPrice.currencyCode
        },
        webUrl: cart.webUrl
      };
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  },

  // Add item to cart
  async addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
    try {
      const lineItemsToAdd = [{
        variantId,
        quantity
      }];
      
      const cart = await client.checkout.addLineItems(cartId, lineItemsToAdd);
      return {
        id: cart.id,
        lineItems: cart.lineItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: {
              amount: item.variant.price.amount,
              currencyCode: item.variant.price.currencyCode
            },
            product: {
              title: item.variant.product.title,
              handle: item.variant.product.handle
            }
          },
          quantity: item.quantity
        })),
        subtotalPrice: {
          amount: cart.subtotalPrice.amount,
          currencyCode: cart.subtotalPrice.currencyCode
        },
        totalPrice: {
          amount: cart.totalPrice.amount,
          currencyCode: cart.totalPrice.currencyCode
        },
        webUrl: cart.webUrl
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  },

  // Update cart item quantity
  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<ShopifyCart | null> {
    try {
      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity
      }];
      
      const cart = await client.checkout.updateLineItems(cartId, lineItemsToUpdate);
      return {
        id: cart.id,
        lineItems: cart.lineItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: {
              amount: item.variant.price.amount,
              currencyCode: item.variant.price.currencyCode
            },
            product: {
              title: item.variant.product.title,
              handle: item.variant.product.handle
            }
          },
          quantity: item.quantity
        })),
        subtotalPrice: {
          amount: cart.subtotalPrice.amount,
          currencyCode: cart.subtotalPrice.currencyCode
        },
        totalPrice: {
          amount: cart.totalPrice.amount,
          currencyCode: cart.totalPrice.currencyCode
        },
        webUrl: cart.webUrl
      };
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  },

  // Remove item from cart
  async removeFromCart(cartId: string, lineItemId: string): Promise<ShopifyCart | null> {
    try {
      const cart = await client.checkout.removeLineItems(cartId, [lineItemId]);
      return {
        id: cart.id,
        lineItems: cart.lineItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: {
              amount: item.variant.price.amount,
              currencyCode: item.variant.price.currencyCode
            },
            product: {
              title: item.variant.product.title,
              handle: item.variant.product.handle
            }
          },
          quantity: item.quantity
        })),
        subtotalPrice: {
          amount: cart.subtotalPrice.amount,
          currencyCode: cart.subtotalPrice.currencyCode
        },
        totalPrice: {
          amount: cart.totalPrice.amount,
          currencyCode: cart.totalPrice.currencyCode
        },
        webUrl: cart.webUrl
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  },

  // Fetch cart by ID
  async fetchCart(cartId: string): Promise<ShopifyCart | null> {
    try {
      const cart = await client.checkout.fetch(cartId);
      return {
        id: cart.id,
        lineItems: cart.lineItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: {
              amount: item.variant.price.amount,
              currencyCode: item.variant.price.currencyCode
            },
            product: {
              title: item.variant.product.title,
              handle: item.variant.product.handle
            }
          },
          quantity: item.quantity
        })),
        subtotalPrice: {
          amount: cart.subtotalPrice.amount,
          currencyCode: cart.subtotalPrice.currencyCode
        },
        totalPrice: {
          amount: cart.totalPrice.amount,
          currencyCode: cart.totalPrice.currencyCode
        },
        webUrl: cart.webUrl
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }
};