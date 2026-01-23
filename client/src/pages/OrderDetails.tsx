import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SEOHead } from "@/components/SEOHead";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import type { Order } from "@shared/schema";
import { 
  ArrowLeft,
  Package,
  Calendar,
  Truck,
  Clock,
  Shield,
  CreditCard,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetails() {
  useEnhancedPageTracking('order-details', 'orders');
  
  const params = useParams();
  const orderId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SEOHead 
          title="Order Not Found | PlantRx" 
          description="The requested order could not be found."
        />
        <Card className="luxury-glass luxury-border shadow-xl">
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find the order you're looking for. It may have been deleted or you may not have permission to view it.
            </p>
            <Link href="/dashboard">
              <Button className="luxury-button-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig: { [key: string]: { color: string, icon: JSX.Element, label: string } } = {
    'processing': { 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
      icon: <Clock className="w-5 h-5" />,
      label: 'Processing'
    },
    'shipped': { 
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
      icon: <Truck className="w-5 h-5" />,
      label: 'Shipped'
    },
    'delivered': { 
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Delivered'
    },
    'cancelled': { 
      color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
      icon: <XCircle className="w-5 h-5" />,
      label: 'Cancelled'
    },
    'pending': { 
      color: 'bg-gray-100 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
      icon: <Clock className="w-5 h-5" />,
      label: 'Pending'
    }
  };

  const currentStatus = statusConfig[order.status] || statusConfig['pending'];
  
  // Parse items from the jsonb field
  const orderItems: Array<{productId?: number, productName?: string, productImage?: string, quantity?: number, price?: number}> = 
    Array.isArray(order.items) ? order.items as any[] : [];
  
  // Extract product details from items
  const productImages = orderItems.map(item => item.productImage || '').filter(Boolean);
  const productNames = orderItems.map(item => item.productName || '').filter(Boolean);
  const productPrices = orderItems.map(item => item.price || 0);
  const productQuantities = orderItems.map(item => item.quantity || 1);
  
  const statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <SEOHead 
        title={`Order ${order.orderNumber || `#${order.id}`} | PlantRx`}
        description={`View details for your PlantRx order ${order.orderNumber || `#${order.id}`}`}
      />
      
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="luxury-glass luxury-border shadow-xl" data-testid="order-header-card">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Package className="w-7 h-7 text-orange-500" />
                    {order.orderNumber || `Order #${order.id}`}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                    Placed on {new Date(order.createdAt!).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <Badge 
                  className={`flex items-center gap-2 px-4 py-2 text-base ${currentStatus.color}`}
                  data-testid="order-status-badge"
                >
                  {currentStatus.icon}
                  <span>{currentStatus.label}</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="luxury-glass luxury-border shadow-xl" data-testid="order-items-card">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productNames.length > 0 ? (
                  productNames.map((name: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                      data-testid={`order-item-${idx}`}
                    >
                      {productImages[idx] && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          <img 
                            src={productImages[idx]} 
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{name}</h4>
                        {productQuantities[idx] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantity: {productQuantities[idx]}
                          </p>
                        )}
                      </div>
                      {productPrices[idx] !== undefined && (
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900 dark:text-white">
                            £{Number(productPrices[idx]).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Product details not available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {statusHistory.length > 0 && (
            <Card className="luxury-glass luxury-border shadow-xl" data-testid="order-timeline-card">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6">
                    {statusHistory.map((event: any, idx: number) => {
                      const eventStatus = statusConfig[event.status] || statusConfig['pending'];
                      return (
                        <div key={idx} className="relative flex items-start gap-4 pl-10">
                          <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                            idx === 0 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                {event.status}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(event.timestamp).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {event.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{event.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="luxury-glass luxury-border shadow-xl" data-testid="order-summary-card">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.subtotal && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>£{Number(order.subtotal).toFixed(2)}</span>
                </div>
              )}
              {order.shippingCost && Number(order.shippingCost) > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>£{Number(order.shippingCost).toFixed(2)}</span>
                </div>
              )}
              {order.tax && Number(order.tax) > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>£{Number(order.tax).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>£{Number(order.total).toFixed(2)}</span>
              </div>
              
              {order.paymentMethod && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Paid with {order.paymentMethod}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {order.trackingNumber && (
            <Card className="luxury-glass luxury-border shadow-xl" data-testid="tracking-card">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.shippingProvider && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carrier</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingProvider}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {order.trackingNumber}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(order.trackingNumber!, 'Tracking number')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {order.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {order.shippingAddress && (
            <Card className="luxury-glass luxury-border shadow-xl" data-testid="shipping-address-card">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {(() => {
                    const addr = order.shippingAddress as Record<string, string> | string;
                    if (typeof addr === 'object' && addr !== null) {
                      return `${addr.name || ''}\n${addr.street || ''}\n${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}\n${addr.country || ''}`.trim();
                    }
                    return String(addr);
                  })()}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="luxury-glass luxury-border shadow-xl">
            <CardContent className="py-6">
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                Need help with your order?
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full luxury-border">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
