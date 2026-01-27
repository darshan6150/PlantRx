import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Leaf, Menu, User, ShoppingBag, X, Plus, Minus, LogOut, Globe, ChevronDown, BookOpen, Bookmark, Apple, Flower2, Heart, Dumbbell, Salad, Brain, Sparkles, FlaskConical, Map, Grip, ChevronRight, Wand2, Search, Info, Star, Loader2, Type, Calculator } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";
import { useQuery } from "@tanstack/react-query";
import { usePrefetch } from "@/hooks/usePrefetch";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "@/components/ShoppingCart";
import { showSubscriptionModal } from "@/lib/showSubscriptionModal";
import { googleSignIn, getAuthErrorMessage, onAuthStateChanged } from "@/auth";
import { TierSelectionModal } from "./TierSelectionModal";
import { FaGoogle } from "react-icons/fa";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobMenus, setExpandedMobMenus] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const scrollPosition = useRef(0);
  const { cartOpen, setCartOpen, getTotalItems, getTotalPrice } = useCart();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const justSignedUp = useRef(false);
  
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();
  const { prefetchRemedies, prefetchFeaturedRemedies } = usePrefetch();
  const { textSize, setTextSize } = useTextSize();
  
  const textSizeOptions = [
    { id: "small" as const, label: "Small", icon: "A" },
    { id: "medium" as const, label: "Medium", icon: "A" },
    { id: "large" as const, label: "Large", icon: "A" },
    { id: "xl" as const, label: "Extra Large", icon: "A" },
  ];

  // Interface for language data from API
  interface Language {
    id: number;
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    isRtl: boolean;
    isActive: boolean;
  }

  // Get languages from database
  const { data: languagesData } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  const languages = languagesData || [];

  // Check authentication state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isAuthenticated) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('plantrx-user');
      }
    }
  }, []);

  // Listen for auth state changes (for showing tier modal after sign-in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && justSignedUp.current) {
        justSignedUp.current = false;
        setIsGoogleLoading(false);
        
        // Get or create user name
        const firstName = firebaseUser.displayName?.split(' ')[0] || '';
        setNewUserName(firstName);
        
        // Update local user state
        const userData = {
          email: firebaseUser.email,
          firstName: firstName,
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          profilePictureUrl: firebaseUser.photoURL,
          isAuthenticated: true,
          provider: 'google'
        };
        localStorage.setItem('plantrx-user', JSON.stringify(userData));
        setUser(userData);
        
        // Show tier selection modal
        setShowTierModal(true);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Handle direct Google sign-in
  const handleDirectGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    justSignedUp.current = true;
    
    try {
      await googleSignIn();
      // Success will be handled by the onAuthStateChanged listener above
    } catch (error: any) {
      console.error('Google sign in error:', error);
      justSignedUp.current = false;
      setIsGoogleLoading(false);
      
      // Only show error if it's not user cancellation
      if (error.code !== 'auth/popup-closed-by-user' && 
          error.code !== 'auth/cancelled-popup-request' &&
          !error.message?.includes('Redirecting to Google')) {
        const errorMessage = getAuthErrorMessage(error);
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  // Lock body scroll when mobile menu is open and restore position when closed
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPosition.current = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Only restore if we previously locked the body
      if (document.body.style.position === 'fixed') {
        const savedPosition = scrollPosition.current;
        
        // Restore body styles first
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Use requestAnimationFrame for smooth scroll restoration
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
        });
      }
    }
  }, [isOpen]);






  // Handle user logout - fully clear all auth state
  const handleLogout = async () => {
    try {
      // 1. Call server logout endpoint to destroy session and clear cookies
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // 2. Sign out from Firebase if available
      const { getAuth, signOut } = await import('firebase/auth');
      const auth = getAuth();
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // 3. Clear all local storage auth data
    localStorage.removeItem('plantrx-user');
    localStorage.removeItem('firebase:authUser');
    
    // 4. Clear any session storage
    sessionStorage.clear();
    
    // 5. Reset user state
    setUser(null);
    
    // 6. Show success message before refresh
    toast({
      title: "Signed Out",
      description: "You've been successfully signed out. Redirecting to homepage...",
    });
    
    // 7. Force full page refresh to homepage to clear all cached state
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };



  // Enhanced navigation menu with dropdown support
  const navigationItems = [
    { href: "/", label: t('nav.home', 'Home'), isPremium: false },
    {
      href: "/remedies",
      label: t('nav.remedies', 'Remedies'),
      subItems: [
        { href: "/remedies", label: "Browse All", isPremium: false, icon: Grip, color: "text-green-500" },
        { href: "/remedies/saved", label: "Saved", isPremium: false, icon: Bookmark, color: "text-rose-500" },
      ],
    },
    {
      href: "/articles",
      label: t('nav.articles', 'Articles'),
      subItems: [
        { href: "/articles", label: "All Articles", isPremium: false, icon: BookOpen, color: "text-blue-500" },
        { href: "/articles/nutrition", label: "Nutrition", isPremium: false, icon: Apple, color: "text-red-500" },
        { href: "/articles/herbs-remedies", label: "Herbs & Remedies", isPremium: false, icon: Flower2, color: "text-green-500" },
        { href: "/articles/wellness", label: "Wellness", isPremium: false, icon: Heart, color: "text-pink-500" },
        { href: "/articles/fitness", label: "Fitness & Body", isPremium: false, icon: Dumbbell, color: "text-orange-500" },
        { href: "/articles/healthy-foods", label: "Healthy Foods", isPremium: false, icon: Salad, color: "text-emerald-500" },
        { href: "/articles/mental-health", label: "Mental Health", isPremium: false, icon: Brain, color: "text-purple-500" },
        { href: "/articles/skin-beauty", label: "Skin & Beauty", isPremium: false, icon: Sparkles, color: "text-amber-500" },
        { href: "/articles/science", label: "Science", isPremium: false, icon: FlaskConical, color: "text-indigo-500" },
      ],
    },
    { href: "/store",
       label: t('nav.store', 'Store'),
        isPremium: false,
        subItems: [
          { href: "/strips", label: "Strips", isPremium: false, icon: Grip, color: "text-green-500" },
          // { href: "/store/saved", label: "Saved", isPremium: false, icon: Bookmark, color: "text-rose-500" },
          // { href: "/store/saved", label: "Saved", isPremium: false, icon: Bookmark, color: "text-rose-500" },
        ],
       },
    {
      href: "/smart-tools",
      label: t('nav.tools', 'Tools'),
      subItems: [
        { href: "/tools/blueprint-designer", label: "Wellness Blueprint", isPremium: false, icon: Sparkles, color: "text-emerald-500" },
        { href: "/tools/symptom-finder", label: "Symptom Finder", isPremium: false, icon: Search, color: "text-blue-500" },
        { href: "/tools/remedy-builder", label: "Remedy Builder", isPremium: false, icon: Wand2, color: "text-purple-500" },
        { href: "/tools/health-calculators", label: "Health Calculators", isPremium: false, icon: Calculator, color: "text-teal-500" },
        { href: "/fitness", label: "Muscle Map", isPremium: false, icon: Dumbbell, color: "text-orange-500" },
      ],
    },
{
      href: "/about/plantrx",
      label: t('nav.about', 'About'),
      subItems: [
        { href: "/about/plantrx", label: "About PlantRx", isPremium: false, icon: Leaf, color: "text-green-500" },
        { href: "/about/mission", label: "Our Mission", isPremium: false, icon: Heart, color: "text-rose-500" },
        { href: "/about/me", label: "The Creator", isPremium: false, icon: User, color: "text-blue-500" },
      ],
    },
  ];

  // Handle premium feature clicks
  const handlePremiumClick = (e: React.MouseEvent | null, href: string, isPremium: boolean) => {
    if (isPremium && e?.preventDefault) {
      e.preventDefault();
      // All features are now open access
      return;
    }
  };

  return (
    <nav className="luxury-glass fixed top-0 left-0 right-0 z-50 luxury-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0 group ml-1 sm:ml-2 sm:-ml-4 lg:-ml-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg sm:rounded-xl lg:rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <div className="hidden sm:flex">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold luxury-heading text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                Plant<span className="text-yellow-500 dark:text-yellow-400">R</span>x
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className={`flex items-center ${language === 'ar' || language === 'he' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              {navigationItems.map((item, idx) => (
                <div key={idx} className="relative group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      data-testid={`nav-link-${item.href.replace(/\//g, '')}`}
                      className={`luxury-subheading text-base transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                        location === item.href || (item.subItems && location.startsWith(item.href))
                          ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
                      }`}
                      onMouseEnter={() => {
                        if (item.href === '/remedies') {
                          prefetchRemedies();
                          prefetchFeaturedRemedies();
                        }
                      }}
                    >
                      {item.label}
                      {item.subItems && (
                        <ChevronDown className="w-4 h-4 opacity-60" />
                      )}
                    </Link>
                  ) : (
                    <button
                      className="luxury-subheading text-base transition-all duration-300 whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 flex items-center gap-1"
                    >
                      {item.label}
                      {item.subItems && (
                        <ChevronDown className="w-4 h-4 opacity-60" />
                      )}
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {item.subItems && (
                    <div className="absolute left-0 mt-2 w-56 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {/* Animated glow background */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-3xl blur-md opacity-30 animate-pulse pointer-events-none" />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 rounded-2xl opacity-20 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
                      
                      {/* Main dropdown container */}
                      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl py-2 border border-yellow-200/50 dark:border-yellow-700/30 overflow-hidden">
                        {/* Dropdown header accent */}
                        <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full pointer-events-none" />
                        
                        {/* Subtle shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-amber-50/30 dark:from-yellow-900/10 dark:via-transparent dark:to-amber-900/10 pointer-events-none" />
                      
                      {item.subItems.map((subItem, subIdx) => {
                        const IconComponent = subItem.icon;
                        return (
                          <Link
                            key={subIdx}
                            href={subItem.href}
                            className="relative z-10 group/item flex items-center px-4 py-2.5 mx-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 dark:hover:from-yellow-900/30 dark:hover:to-amber-900/30 transition-all duration-200 whitespace-nowrap"
                            onClick={() => {
                              if (subItem.isPremium) {
                                handlePremiumClick({} as React.MouseEvent, subItem.href, true);
                              }
                            }}
                          >
                            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                              subItem.isPremium 
                                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 group-hover/item:from-yellow-200 group-hover/item:to-amber-200 dark:group-hover/item:from-yellow-800/50 dark:group-hover/item:to-amber-800/50' 
                                : 'bg-gray-100 dark:bg-gray-800 group-hover/item:bg-white dark:group-hover/item:bg-gray-700'
                            }`}>
                              {IconComponent && <IconComponent className={`w-4 h-4 ${subItem.color || 'text-gray-500'}`} />}
                              {subItem.isPremium && (
                                <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                                  ✨
                                </span>
                              )}
                            </div>
                            <span className="flex-1 font-medium group-hover/item:text-yellow-700 dark:group-hover/item:text-yellow-400 transition-colors">
                              {subItem.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pricing Link */}
              <div className="relative group">
                <Link
                  href="/pricing"
                  data-testid="nav-pricing-button"
                  className={`luxury-subheading text-base transition-all duration-300 whitespace-nowrap ${
                    location === '/pricing'
                      ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
                  }`}
                >
                  {t('nav.pricing', 'Pricing')}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Theme Toggle, Text Size & Language Selector - Right Side */}
            <div className="flex items-center space-x-2 mr-3">
              {/* Text Size Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    data-testid="header-text-size-button"
                  >
                    <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  {textSizeOptions.map((size) => (
                    <DropdownMenuItem
                      key={size.id}
                      onClick={() => setTextSize(size.id)}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        textSize === size.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={`font-medium ${
                        size.id === 'small' ? 'text-sm' : 
                        size.id === 'medium' ? 'text-base' : 
                        size.id === 'large' ? 'text-lg' : 'text-xl'
                      }`}>{size.label}</span>
                      {textSize === size.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Language Selector */}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      language === lang.code 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName || lang.name}</span>
                    {language === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
            
            {/* Shopping Cart - Desktop */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              onClick={() => setCartOpen(true)}
              data-testid="header-cart-button"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {user && getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* Authentication UI */}
            {user ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <Avatar className="w-7 h-7">
                        {user.profilePictureUrl ? (
                          <img 
                            src={user.profilePictureUrl} 
                            alt={`${user.firstName || user.username || user.email || 'User'} profile picture - PlantRx natural health platform`}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <AvatarFallback className={`bg-green-600 dark:bg-sage text-white text-xs font-semibold ${user.profilePictureUrl ? 'hidden' : ''}`}>
                          {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.displayName || user.firstName || user.email?.split('@')[0] || 'User'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem onClick={() => setLocation('/dashboard')} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <User className="w-4 h-4 mr-2" />
                      {t('ui.dashboard', 'Dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('ui.sign_out', 'Sign Out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setLocation('/login')}
                  data-testid="header-sign-in-btn"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('ui.sign_in', 'Sign In')}
                </Button>
                <Button 
                  className="luxury-button-primary hidden sm:flex text-sm"
                  onClick={() => setLocation('/signup')}
                  data-testid="header-sign-up-btn"
                >
                  {t('ui.sign_up', 'Sign Up')}
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen} modal={true}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden min-w-[44px] min-h-[44px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-[280px] sm:max-w-[320px] h-full max-h-screen bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl p-0 flex flex-col overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
                {/* Unified Menu - No Sections */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:p-6 space-y-5" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {/* Header - Animated Logo */}
                  <div className="flex items-center justify-center pb-4 border-b border-gray-200 dark:border-gray-800 animate-fade-in-down">
                    <div className="flex items-center space-x-2.5 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl">
                        <Leaf className="w-5 h-5 text-white transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">{t('header.plantrx', 'PlantRx')}</span>
                    </div>
                  </div>
                  
                  {/* Navigation - Staggered Animation */}
                  <div className="space-y-1">
                    {navigationItems.map((item, idx) => {
                      const isExpanded = expandedMobMenus[idx];
                      const hasSubItems = item.subItems && item.subItems.length > 0;
                      
                      return (
                        <div 
                          key={idx} 
                          className="relative animate-fade-in-up"
                          style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                        >
                          {item.href && !hasSubItems ? (
                            <Link
                              href={item.href}
                              className={`group block w-full px-4 py-3 min-h-[48px] rounded-xl text-left text-base font-medium transition-all duration-300 ease-out active:scale-[0.98] ${
                                location === item.href
                                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 text-yellow-700 dark:text-yellow-300 border-l-4 border-yellow-500 shadow-sm"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-800/60 dark:hover:to-gray-800/40 hover:text-yellow-600 dark:hover:text-yellow-400 hover:pl-5 hover:shadow-sm"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="flex items-center">
                                <span className="flex-1">{item.label}</span>
                                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                              </span>
                            </Link>
                          ) : hasSubItems ? (
                            <>
                              <button
                                onClick={() => setExpandedMobMenus(prev => ({ ...prev, [idx]: !isExpanded }))}
                                className={`group block w-full px-4 py-3 min-h-[48px] rounded-xl text-left text-base font-medium transition-all duration-300 ease-out flex items-center justify-between active:scale-[0.98] ${
                                  item.href && (location === item.href || location.startsWith(item.href + '/'))
                                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 text-yellow-700 dark:text-yellow-300 shadow-sm"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-800/60 dark:hover:to-gray-800/40 hover:text-yellow-600 dark:hover:text-yellow-400 hover:shadow-sm"
                                }`}
                              >
                                <span>{item.label}</span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-yellow-100 dark:bg-yellow-900/40 rotate-180' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20'}`}>
                                  <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isExpanded ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 group-hover:text-yellow-500'}`} />
                                </div>
                              </button>
                              
                              {/* Animated Sub-menu */}
                              <div className={`overflow-hidden transition-all duration-400 ease-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl space-y-1 p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                                  {item.subItems.map((subItem, subIdx) => {
                                    const IconComponent = subItem.icon;
                                    return (
                                      <Link
                                        key={subIdx}
                                        href={subItem.href}
                                        className="group/sub flex items-center px-4 py-3 min-h-[44px] text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300 rounded-lg active:scale-[0.98]"
                                        onClick={() => {
                                          setIsOpen(false);
                                          if (subItem.isPremium) {
                                            handlePremiumClick({} as React.MouseEvent, subItem.href, true);
                                          }
                                        }}
                                        style={{ animationDelay: `${(subIdx + 1) * 30}ms` }}
                                      >
                                        <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 group-hover/sub:scale-110 group-hover/sub:rotate-3 ${
                                          subItem.isPremium 
                                            ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 group-hover/sub:shadow-md group-hover/sub:shadow-yellow-200/50' 
                                            : 'bg-gray-100 dark:bg-gray-700 group-hover/sub:bg-yellow-50 dark:group-hover/sub:bg-yellow-900/30'
                                        }`}>
                                          {IconComponent && <IconComponent className={`w-4 h-4 transition-transform duration-300 group-hover/sub:scale-110 ${subItem.color || 'text-gray-500'}`} />}
                                          {subItem.isPremium && (
                                            <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                              ✨
                                            </span>
                                          )}
                                        </div>
                                        <span className="flex-1">{subItem.label}</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-300 text-yellow-500" />
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                    
                    {/* Pricing Link - Mobile - Animated */}
                    <div 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${navigationItems.length * 50}ms`, animationFillMode: 'backwards' }}
                    >
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        data-testid="mobile-pricing-button"
                        className="group block w-full px-4 py-3 min-h-[48px] rounded-xl text-left text-base font-medium transition-all duration-300 ease-out text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 dark:hover:from-yellow-900/30 dark:hover:to-amber-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 hover:pl-5 hover:shadow-sm active:scale-[0.98]"
                      >
                        <span className="flex items-center">
                          <span className="flex-1">{t('nav.pricing', 'Pricing')}</span>
                          <Star className="w-4 h-4 text-yellow-500 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Actions Section - Animated */}
                  <div 
                    className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3 animate-fade-in-up"
                    style={{ animationDelay: `${(navigationItems.length + 1) * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    {/* Mobile Cart */}
                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        if (!user) {
                          handlePremiumClick({} as React.MouseEvent, '/collections/Products', !user);
                        } else {
                          setCartOpen(true);
                        }
                      }}
                      variant="outline" 
                      className="group w-full h-12 relative bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 font-medium active:scale-[0.98] hover:shadow-lg hover:shadow-green-500/10"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                      {user ? `${t('ui.shopping_cart', 'Shopping Cart')} (${getTotalItems()})` : t('ui.premium_store', 'Premium Store')}
                      {user && getTotalItems() > 0 && (
                        <Badge className="ml-2 bg-green-600 text-white px-2 py-1 text-xs animate-pulse">
                          ${getTotalPrice().toFixed(2)}
                        </Badge>
                      )}
                    </Button>
                    
                    {/* Mobile Authentication */}
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800/50">
                          <Avatar className="w-12 h-12 ring-2 ring-green-200 dark:ring-green-700">
                            {user.profilePictureUrl ? (
                              <img 
                                src={user.profilePictureUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <AvatarFallback className={`bg-green-600 dark:bg-green-700 text-white font-bold text-lg ${user.profilePictureUrl ? 'hidden' : ''}`}>
                              {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{t('ui.welcome_back', 'Welcome back!')}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.username || user.email}
                            </p>
                          </div>
                        </div>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                            <User className="w-5 h-5 mr-2" />
                            {t('ui.go_to_dashboard', 'Go to Dashboard')}
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                          }}
                          variant="outline" 
                          className="w-full h-12 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 font-medium rounded-xl transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          {t('ui.sign_out', 'Sign Out')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-green-400 dark:hover:border-green-500 font-semibold rounded-xl transition-all duration-200"
                          onClick={() => {
                            setIsOpen(false);
                            setLocation('/login');
                          }}
                          data-testid="mobile-sign-in-btn"
                        >
                          <User className="w-5 h-5 mr-2" />
                          {t('ui.sign_in', 'Sign In')}
                        </Button>
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick={() => {
                            setIsOpen(false);
                            setLocation('/signup');
                          }}
                          data-testid="mobile-sign-up-btn"
                        >
                          {t('ui.create_account', 'Create Account')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Shopping Cart Component */}
      <ShoppingCart />

      {/* Tier Selection Modal - appears after sign-in */}
      <TierSelectionModal 
        isOpen={showTierModal} 
        onClose={() => setShowTierModal(false)}
        userName={newUserName}
      />
      
    </nav>
  );
}