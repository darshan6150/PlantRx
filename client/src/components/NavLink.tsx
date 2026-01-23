import { useLocation } from "wouter";
import { useLuxuryLoader } from "./LuxuryLoader";
import { useCallback } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  "data-testid"?: string;
}

export function NavLink({ href, children, className, onClick, "data-testid": testId }: NavLinkProps) {
  const { triggerNavigation } = useLuxuryLoader();
  const [location, setLocation] = useLocation();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    if (e.defaultPrevented) return;
    
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    
    const isExternal = href.startsWith('http') || href.startsWith('//');
    
    if (isExternal) {
      return;
    }
    
    const isSameLocation = location === href;
    
    if (isSameLocation) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    triggerNavigation();
    setTimeout(() => {
      setLocation(href);
    }, 50);
  }, [href, location, onClick, setLocation, triggerNavigation]);

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className} 
      data-testid={testId}
    >
      {children}
    </a>
  );
}

export function useNavigate() {
  const { triggerNavigation } = useLuxuryLoader();
  const [location, setLocation] = useLocation();

  const navigate = useCallback((path: string) => {
    const isExternal = path.startsWith('http') || path.startsWith('//');
    
    if (isExternal) {
      window.location.href = path;
      return;
    }
    
    if (location === path) {
      return;
    }
    
    triggerNavigation();
    setTimeout(() => {
      setLocation(path);
    }, 50);
  }, [location, setLocation, triggerNavigation]);

  return navigate;
}
