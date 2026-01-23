import { Leaf, Sparkles } from "lucide-react";

interface LoadingAnimationProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingAnimation({ text = "Loading...", size = "md" }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} text-green-600 animate-spin`}>
          <Leaf className="w-full h-full" />
        </div>
        <div className={`absolute inset-0 ${sizeClasses[size]} text-yellow-400 animate-pulse`}>
          <Sparkles className="w-full h-full" />
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
        {text}
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded skeleton"></div>
    </div>
  );
}