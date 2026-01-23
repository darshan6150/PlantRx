import React, { useEffect } from "react";
import { auth } from "@/auth";

// Stripe Pricing Table Component - Updated to use live credentials
interface StripePricingTableProps {
  pricingTableId?: string;
  publishableKey?: string;
}

export const StripePricingTable: React.FC<StripePricingTableProps> = ({
  pricingTableId,
  publishableKey,
}) => {
  const user = auth.currentUser;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const tableId = pricingTableId || import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
  const pubKey = publishableKey || import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  if (!tableId) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ⚙️ Configuration Required
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To display the Stripe pricing table, please:
        </p>
        <ol className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-2xl mx-auto">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Go to your <strong>Stripe Dashboard</strong> → <strong>Product catalog</strong> → <strong>Pricing tables</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Click <strong>+ Create pricing table</strong> and configure your Bronze (Free), Silver (£6.99/month), and Gold (£12.99/month) plans</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Copy the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">pricing-table-id</code> from the embed code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Add <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">VITE_STRIPE_PRICING_TABLE_ID</code> to your environment variables in the Secrets tab</span>
          </li>
        </ol>
      </div>
    );
  }

  if (!pubKey) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🔑 Missing Stripe Public Key
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Please add <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">VITE_STRIPE_PUBLIC_KEY</code> to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="stripe-pricing-table-container">
      <stripe-pricing-table
        pricing-table-id={tableId}
        publishable-key={pubKey}
        client-reference-id={user?.uid || undefined}
        customer-email={user?.email || undefined}
      />
    </div>
  );
};
