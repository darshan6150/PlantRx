import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ExternalLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const ExternalLinkComponent = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn('cursor-pointer', className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);

ExternalLinkComponent.displayName = 'ExternalLinkComponent';
