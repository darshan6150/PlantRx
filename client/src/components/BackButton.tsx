import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  customText?: string;
}

export function BackButton({ 
  className = "", 
  variant = "ghost", 
  size = "sm",
  customText = "Back"
}: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Navigate to home page for consistent navigation experience
    setLocation("/");
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {customText}
    </Button>
  );
}