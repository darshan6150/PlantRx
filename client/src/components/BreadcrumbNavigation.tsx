import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNavigation({ items, className = "" }: BreadcrumbNavigationProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`text-sm ${className}`}
      data-testid="breadcrumb-navigation"
    >
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            data-testid="breadcrumb-home"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-gray-300 dark:text-gray-600">/</span>
            {item.href && index < items.length - 1 ? (
              <Link 
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                data-testid={`breadcrumb-link-${index}`}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none"
                data-testid={`breadcrumb-current-${index}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}