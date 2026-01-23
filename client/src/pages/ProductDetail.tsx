import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import Header from '@/components/Header';
import { SEOHead } from '@/components/SEOHead';
import { useTranslation } from '@/contexts/TranslationContext';
import { useEnhancedPageTracking } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, CheckCircle, ArrowLeft, ShoppingCart, Loader2, ChevronDown, ChevronUp, Award, Sparkles, Leaf } from 'lucide-react';
import { shopifyService, type ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail() {
  const { handle } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { addToCart, setCartOpen } = useCart();
  
  // Enhanced analytics tracking
  useEnhancedPageTracking('store', 'product_detail');
  
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product on mount
  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedProduct = await shopifyService.fetchProductByHandle(handle);
        
        if (!fetchedProduct) {
          setError('Product not found');
        } else {
          setProduct(fetchedProduct);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Format price helper
  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  // Generate product rating (same logic as Store.tsx)
  const generateProductRating = (productId: string) => {
    const hash = productId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const rating = 4.0 + (Math.abs(hash) % 11) / 10;
    const reviewCount = 50 + (Math.abs(hash) % 200);
    
    return {
      rating: rating.toFixed(1),
      reviewCount
    };
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || product.variants.length === 0) return;
    
    setAddingToCart(true);
    try {
      await addToCart(product, product.variants[0].id);
      setCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Loading Product | PlantRx Store"
          description="Loading product details..."
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Header />
          <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading product details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <SEOHead
          title="Product Not Found | PlantRx Store"
          description="The product you're looking for could not be found."
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Header />
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The product you\'re looking for could not be found.'}</p>
              <Button
                onClick={() => setLocation('/store')}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-back-to-store"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { rating, reviewCount } = generateProductRating(product.id);

  return (
    <>
      <SEOHead
        title={`${product.title} | PlantRx Store`}
        description={product.description.substring(0, 160)}
        ogImage={product.images.length > 0 ? product.images[0].src : undefined}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-7xl">
          {/* Back Button */}
          <Button
            onClick={() => setLocation('/store')}
            variant="ghost"
            className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            data-testid="button-back-to-store"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {product.images.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
                  <img
                    src={product.images[selectedImageIndex].src}
                    alt={product.images[selectedImageIndex].altText || product.title}
                    className="w-full h-64 sm:h-96 lg:h-[500px] object-contain p-8"
                    data-testid="img-product-main"
                  />
                </div>
              )}
              
              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 ${
                        index === selectedImageIndex 
                          ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' 
                          : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      data-testid={`img-thumbnail-${index}`}
                    >
                      <img
                        src={image.src}
                        alt={image.altText || (product.title + ' view ' + (index + 1))}
                        className="w-full h-20 sm:h-24 object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4" data-testid="text-product-title">
                  {product.title}
                </h1>
                
                {/* Product Type Badge */}
                {product.productType && (
                  <Badge className="bg-green-600 text-white text-sm" data-testid="badge-product-type">
                    {product.productType}
                  </Badge>
                )}
              </div>

              {/* Vendor and Rating */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  by PlantRx Store
                </p>
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-700 dark:text-yellow-300 ml-1 font-semibold text-sm" data-testid="text-product-rating">
                    {rating} ({reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price and Add to Cart */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                {product.variants.length > 0 && (
                  <>
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white" data-testid="text-product-price">
                      {formatPrice(product.variants[0].price.amount, product.variants[0].price.currencyCode)}
                    </span>
                    <p className="text-green-700 dark:text-green-300 text-sm font-semibold mt-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Free shipping on orders over $50
                    </p>
                    
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.variants[0].available || addingToCart}
                      className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      data-testid="button-add-to-cart"
                    >
                      {addingToCart ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {product.variants[0].available ? 'Add to Cart' : 'Out of Stock'}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    data-testid="button-toggle-description"
                  >
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">Product Details</span>
                    {showFullDescription ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {showFullDescription && (
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="pt-4 space-y-4">
                        {product.description.split('\n').map((paragraph, index) => {
                          if (paragraph.trim()) {
                            // Check if paragraph contains features with bullets or emojis
                            if (paragraph.includes('✨') || paragraph.includes('–') || paragraph.includes('•')) {
                              // Split by feature indicators and create bullet points
                              const features = paragraph.split(/(?=✨|–|•)/).filter(f => f.trim());
                              return (
                                <div key={index} className="space-y-2">
                                  {features.map((feature, featureIndex) => {
                                    const cleanFeature = feature.replace(/^[✨–•]\s*/, '').trim();
                                    if (cleanFeature) {
                                      return (
                                        <div key={featureIndex} className="flex items-start space-x-2">
                                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {cleanFeature}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              );
                            } else {
                              // Regular paragraph
                              return (
                                <p key={index} className="text-gray-700 dark:text-gray-200 leading-relaxed">
                                  {paragraph.trim()}
                                </p>
                              );
                            }
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                {product.tags && product.tags.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <button
                      onClick={() => setShowIngredients(!showIngredients)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      data-testid="button-toggle-features"
                    >
                      <span className="font-semibold text-lg text-gray-900 dark:text-white">Key Features</span>
                      {showIngredients ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {showIngredients && (
                      <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="pt-4 flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" data-testid={`badge-tag-${index}`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Expert Verified</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Lab Tested</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
