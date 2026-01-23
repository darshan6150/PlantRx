import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { SEOHead } from '@/components/SEOHead';
import { useTranslation } from '@/contexts/TranslationContext';
import { useEnhancedPageTracking } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Leaf, Sparkles, CheckCircle, Award, Mail, ShoppingCart, Loader2, Star, X, Eye } from 'lucide-react';
import { shopifyService, type ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart as CartComponent } from '@/components/ShoppingCart';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function Store() {
  // Enhanced analytics tracking for store pages
  useEnhancedPageTracking('store', 'main');
  
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // Advanced filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'best-selling' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a'>('best-selling');
  const [minRating, setMinRating] = useState(0);
  
  const { addToCart, setCartOpen } = useCart();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await shopifyService.fetchProducts();
        setProducts(fetchedProducts);
        setError(null);
        
        // Set initial price range based on products
        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts
            .filter(p => p.variants.length > 0)
            .map(p => parseFloat(p.variants[0].price.amount));
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
          }
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      console.log('Email submitted for store notifications:', email);
      setIsSubmitted(true);
      setEmail("");
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };


  // Advanced filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.productType?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply availability filter
    if (availabilityFilter === 'in-stock') {
      filtered = filtered.filter(product => 
        product.variants.length > 0 && product.variants[0].available
      );
    } else if (availabilityFilter === 'out-of-stock') {
      filtered = filtered.filter(product => 
        product.variants.length === 0 || !product.variants[0].available
      );
    }


    // Apply price filter
    filtered = filtered.filter(product => {
      if (product.variants.length === 0) return false;
      const price = parseFloat(product.variants[0].price.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          if (a.variants.length === 0 || b.variants.length === 0) return 0;
          return parseFloat(a.variants[0].price.amount) - parseFloat(b.variants[0].price.amount);
        
        case 'price-high-low':
          if (a.variants.length === 0 || b.variants.length === 0) return 0;
          return parseFloat(b.variants[0].price.amount) - parseFloat(a.variants[0].price.amount);
        
        case 'name-a-z':
          return a.title.localeCompare(b.title);
        
        case 'name-z-a':
          return b.title.localeCompare(a.title);
        
        case 'best-selling':
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    setMinRating(0);
    setSortBy('best-selling');
    if (products.length > 0) {
      const prices = products
        .filter(p => p.variants.length > 0)
        .map(p => parseFloat(p.variants[0].price.amount));
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
      }
    }
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (availabilityFilter !== 'all') count++;
    if (minRating > 0) count++;
    if (products.length > 0) {
      const prices = products
        .filter(p => p.variants.length > 0)
        .map(p => parseFloat(p.variants[0].price.amount));
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) count++;
      }
    }
    return count;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(price);
  };

  // Generate consistent ratings for each product based on ID
  const generateProductRating = (productId: string) => {
    // Use product ID to generate consistent random values
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random1 = (seed * 9301 + 49297) % 233280 / 233280;
    const random2 = (seed * 7919 + 31337) % 233280 / 233280;
    
    // Generate rating between 3.8 and 5.0
    const rating = (3.8 + random1 * 1.2).toFixed(1);
    
    // Generate review count between 15 and 300
    const reviewCount = Math.floor(15 + random2 * 285);
    
    return { rating, reviewCount };
  };

  const handleAddToCart = async (product: ShopifyProduct) => {
    if (product.variants.length === 0) return;
    
    const success = await addToCart(product, product.variants[0].id);
    if (success) {
      setCartOpen(true);
    } else {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <SEOHead
        title="PlantRx Store | Premium Natural Products & Supplements"
        description="Shop our premium collection of scientifically-backed, expert-verified natural products including organic spirulina, turmeric curcumin, ashwagandha, and more. Lab-tested for purity and potency."
        keywords="natural products, premium supplements, plant-based wellness, herbal remedies, organic health products, spirulina, turmeric, ashwagandha, echinacea, reishi mushroom"
      />
      
      <Header />
      
      {/* Hero Section */}
      <ScrollReveal variant="fadeUp">
        <section className="relative py-16 sm:py-24 px-3 sm:px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-transparent to-cyan-600/10 dark:from-amber-600/5 dark:via-transparent dark:to-cyan-600/5" />
          <div className="relative max-w-6xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-cyan-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-3 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400 mr-1 sm:mr-2" />
              <span className="text-amber-700 dark:text-amber-200 font-bold tracking-wide text-xs sm:text-sm">
                <span className="hidden sm:inline">PREMIUM NATURAL PRODUCTS</span>
                <span className="sm:hidden">PREMIUM PRODUCTS</span>
              </span>
              <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-cyan-400 ml-1 sm:ml-2" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div className="bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-400/50 backdrop-blur-sm sm:mr-6">
                <Leaf className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
              </div>
              <h1 className="font-playfair text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block">PLANTRX</span>
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
                  WELLNESS SHOP
                </span>
              </h1>
            </div>
            
            <p className="text-base sm:text-xl text-gray-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0">
              Experience the future of natural wellness with our premium collection of scientifically-backed, ethically-sourced products. Each item is verified by our expert team for maximum potency and effectiveness.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Products Section */}
      <section className="py-16 sm:py-32 px-3 sm:px-4 relative">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            /* Loading State */
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Loading Premium Products...
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fetching the finest natural products for you
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                Store Temporarily Unavailable
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {error}
              </p>
              
              {/* Email Notification Form */}
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email for updates"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[48px] text-base"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold px-6 min-h-[48px] text-base"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
                
                {isSubmitted && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      ✅ Thank you! We'll notify you when the store is available.
                    </p>
                  </div>
                )}
              </form>
            </div>
          ) : products.length === 0 ? (
            /* No Products State */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                Premium Natural Products
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Browse our expertly curated collection of 12+ scientifically-backed natural wellness products including organic spirulina, turmeric curcumin, ashwagandha, and more.
              </p>
            </div>
          ) : (
            /* Products Display */
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Products</h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Discover our expertly curated collection of natural wellness products</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {showAllProducts ? filteredProducts.length : Math.min(16, filteredProducts.length)} of {filteredProducts.length} products
                </div>
              </div>
              
              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="min-h-[48px] text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value as any)}>
                      <SelectTrigger className="min-h-[48px] text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="min-h-[48px] text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="best-selling">Best Selling</SelectItem>
                        <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                        <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                        <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                        <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {(showAllProducts ? filteredProducts : filteredProducts.slice(0, 16)).map((product) => (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer rounded-lg" 
                    onClick={() => setLocation(`/store/${product.handle}`)}
                    data-testid={`card-product-${product.id}`}
                  >
                    <div className="relative bg-gray-50 dark:bg-gray-700">
                      {product.images.length > 0 && (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].altText || product.title}
                          className="w-full h-32 sm:h-48 lg:h-64 object-contain group-hover:scale-105 transition-transform duration-300 p-2 sm:p-3 lg:p-4"
                        />
                      )}
                      {(product.variants.length === 0 || !product.variants[0].available) && (
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                          <Badge className="bg-red-500 text-white text-xs">
                            Sold out
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="mb-2 sm:mb-3">
                        {product.variants.length > 0 && (
                          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.variants[0].price.amount, product.variants[0].price.currencyCode)}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 sm:mt-3 flex gap-1.5 sm:gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.variants.length === 0 || !product.variants[0].available}
                          className="flex-1 text-xs sm:text-sm font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed h-8 sm:h-10"
                          data-testid={`button-add-to-cart-${product.id}`}
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {product.variants[0]?.available ? 'Add' : 'Sold Out'}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/store/${product.handle}`);
                          }}
                          variant="outline"
                          className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-10 dark:border-gray-600 dark:hover:bg-gray-700"
                          data-testid="button-view-details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* View More Button */}
              {filteredProducts.length > 16 && !showAllProducts && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setShowAllProducts(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    View More Products ({filteredProducts.length - 16} more)
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Store Features - Always show */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Expert Verified</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">All products vetted by our team of natural health experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Lab Tested</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Third-party tested for purity, potency, and safety</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Premium Quality</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Sustainably sourced from trusted global suppliers</p>
            </div>
          </div>

        </div>
      </section>

      {/* Shopping Cart Component */}
      <CartComponent />
    </div>
  );
}