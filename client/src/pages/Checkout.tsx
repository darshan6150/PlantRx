import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { navigateTo } from "@/utils/navigation";
import { SEOHead } from "@/components/SEOHead";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 py-8">
      <SEOHead 
        title="Secure Checkout - Natural Health Products | PlantRx"
        description="Complete your purchase securely with PlantRx. Safe payment processing for natural health products, remedies, and wellness solutions with full data protection."
        keywords="secure checkout, natural products purchase, safe payment, health products checkout, PlantRx store"
        canonical="https://plantrxapp.com/checkout"
        noindex={true}
      />
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Checkout</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-2xl">Checkout Temporarily Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Our payment system is currently being optimized for better performance. 
              Please browse our products and remedy collection instead.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigateTo('/store')} className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
              <Button variant="outline" onClick={() => navigateTo('/remedies')}>
                View Remedies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}