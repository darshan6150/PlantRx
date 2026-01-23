import React from 'react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

interface ProtectedButtonProps extends ButtonProps {
  onAuthenticatedClick?: () => void;
}

export function ProtectedButton({ 
  onClick,
  onAuthenticatedClick, 
  children, 
  ...buttonProps 
}: ProtectedButtonProps) {
  // No authentication required - all users can click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onAuthenticatedClick) {
      onAuthenticatedClick();
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button {...buttonProps} onClick={handleClick}>
      {children}
    </Button>
  );
}