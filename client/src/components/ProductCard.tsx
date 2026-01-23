import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProtectedButton } from "@/components/ProtectedButton";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "organic": return "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300";
      case "expert-approved": return "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300";
      case "most-popular": return "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300";
      case "new": return "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
    }
  };

  const formatBadgeText = (badge: string) => {
    return badge.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=200&fit=crop"}
          alt={`${product.name} - Natural Health Product | PlantRx`}
          loading="lazy"
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {product.badges && Array.isArray(product.badges) && product.badges[0] && (
            <Badge className={`text-xs font-medium ${getBadgeColor(String(product.badges[0]))}`}>
              {formatBadgeText(String(product.badges[0]))}
            </Badge>
          )}
          <span className={`text-xs font-medium ${
            product.inStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-sage transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sage text-xl">
              ${product.price.toFixed(2)}
            </span>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Free shipping over $50
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onAddToCart}
              disabled={!product.inStock}
              variant="outline"
              className="flex-1 border-sage text-sage hover:bg-sage hover:text-white transition-all disabled:opacity-50"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
            
            <Button
              onClick={() => {
                if (onAddToCart) onAddToCart();
                // In a real app, this would redirect to checkout
                window.open(`#checkout/${product.slug}`, '_blank');
              }}
              disabled={!product.inStock}
              className="flex-1 bg-gradient-to-r from-sage to-forest text-white hover:from-forest hover:to-sage transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
              size="sm"
            >
              Buy Now
            </Button>
          </div>
        </div>
        
        {product.stockCount !== null && product.stockCount !== undefined && product.stockCount < 10 && product.inStock && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            Only {product.stockCount} left in stock
          </p>
        )}
      </CardContent>
    </Card>
  );
}
