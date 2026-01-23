import { Link } from "wouter";
import { Compass, ArrowRight, Sparkles } from "lucide-react";

interface RelatedLink {
  title: string;
  href: string;
  description: string;
  category?: string;
}

interface InternalLinkingWidgetProps {
  title?: string;
  links: RelatedLink[];
  className?: string;
}

export function InternalLinkingWidget({ 
  title = "Related Content", 
  links, 
  className = "" 
}: InternalLinkingWidgetProps) {
  if (!links?.length) return null;

  return (
    <div className={`w-full ${className}`} data-testid="internal-linking-widget">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
          <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recommended for you
          </p>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <Link 
            key={index}
            href={link.href}
            className="group block bg-white dark:bg-gray-900 rounded-xl border border-stone-200 dark:border-gray-800 p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
            data-testid={`internal-link-${index}`}
          >
            {/* Category Badge */}
            {link.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full mb-3">
                <Sparkles className="w-3 h-3" />
                {link.category}
              </span>
            )}
            
            {/* Title */}
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
              {link.title}
            </h4>
            
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
              {link.description}
            </p>
            
            {/* Action */}
            <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 gap-1 transition-all">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
