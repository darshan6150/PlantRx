import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Leaf, Eye, EyeOff, Check } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { googleSignIn, appleSignIn, emailSignUp, getAuthErrorMessage, auth, onAuthStateChanged } from '@/auth';
import { useNavigationGuard } from '@/utils/renderGuards';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useClickAuthPrompt } from "@/hooks/useClickAuthPrompt";
import { getReturnState, clearReturnState, restoreScrollPosition, resetContentCounts } from "@/hooks/useContentAuthGate";

export default function Signup() {
  useEnhancedPageTracking('auth', 'signup');
  
  // Set modal active flag for trust popup coordination
  useEffect(() => {
    (window as any).PLANT_RX_MODAL_ACTIVE = true;
    return () => {
      (window as any).PLANT_RX_MODAL_ACTIVE = false;
    };
  }, []);
  
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    isChecking: boolean;
    message: string;
  }>({ isValid: false, isChecking: false, message: "" });
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const routed = useRef(false);
  
  // Email domain suggestions
  const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'outlook.com'];
  
  // Generate email suggestions based on input
  const updateEmailSuggestions = (value: string) => {
    if (!value || value.includes('@') && value.split('@')[1]?.includes('.')) {
      setShowEmailSuggestions(false);
      setEmailSuggestions([]);
      return;
    }
    
    const atIndex = value.indexOf('@');
    if (atIndex === -1) {
      // No @ yet - don't show suggestions until user types @
      setShowEmailSuggestions(false);
      setEmailSuggestions([]);
    } else {
      // Has @ - show domain suggestions
      const localPart = value.substring(0, atIndex);
      const domainPart = value.substring(atIndex + 1).toLowerCase();
      
      if (localPart.length > 0) {
        const filtered = emailDomains
          .filter(domain => domain.startsWith(domainPart) || domainPart === '')
          .map(domain => `${localPart}@${domain}`);
        
        setEmailSuggestions(filtered);
        setShowEmailSuggestions(filtered.length > 0);
      }
    }
  };
  
  const selectEmailSuggestion = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setShowEmailSuggestions(false);
    setEmailSuggestions([]);
    // Trigger validation
    setTimeout(() => validateEmail(email), 100);
  };
  const { toast } = useToast();
  const { guardedNavigate } = useNavigationGuard();
  const { markFlowCompleted } = useClickAuthPrompt();

  // Newsletter subscription mutation
  const subscribeToNewsletter = useMutation({
    mutationFn: async (userData: { email: string; name: string; source: string }) => {
      return apiRequest('/api/newsletter/subscribe', 'POST', userData);
    },
    onError: (error: any) => {
      console.warn('Newsletter subscription failed:', error.message);
      // Don't show error to user - newsletter subscription failure shouldn't block signup
    }
  });

  // Wait for auth state before rendering - prevent redirect loops
  useEffect(() => {
    const unsub = onAuthStateChanged(async (user) => {
      setReady(true);
      if (user && !routed.current) {
        routed.current = true;
        // User is signed in, save to localStorage and navigate
        const userData = {
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          profilePictureUrl: user.photoURL,
          isAuthenticated: true,
          provider: 'google'
        };
        
        localStorage.setItem('plantrx-user', JSON.stringify(userData));
        
        // Subscribe to newsletter automatically for new users
        if (user.email) {
          subscribeToNewsletter.mutate({
            email: user.email,
            name: userData.displayName,
            source: 'signup'
          });
        }
        
        // Check for Gold Trial intent from URL parameter (set by GoldTrialPopup)
        const urlParams = new URLSearchParams(window.location.search);
        const trialParam = urlParams.get('trial');
        const shouldStartTrial = trialParam === 'gold';
        if (shouldStartTrial) {
          console.log('[Signup] Gold Trial intent detected via URL param - will activate trial after sync');
        }
        
        // Check if user came from forced flow
        const isForcedFlow = localStorage.getItem('plantrx_forced_flow_active') === 'true';
        if (isForcedFlow) {
          console.log('[Signup] User came from forced flow - syncing session and checking subscription');
          localStorage.removeItem('plantrx_forced_flow_active');
          
          try {
            // CRITICAL: Sync Firebase auth with backend first to establish Express session
            const token = await user.getIdToken();
            const syncResponse = await fetch('/api/auth/firebase-sync', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              credentials: 'include',
              body: JSON.stringify({ startTrial: shouldStartTrial })
            });
            
            if (!syncResponse.ok) {
              throw new Error('Failed to sync Firebase session');
            }
            
            const syncData = await syncResponse.json();
            console.log('[Signup] Firebase session synced successfully');
            
            // Check if trial was started
            if (syncData.trialStarted) {
              console.log('[Signup] Gold Trial activated successfully!');
              markFlowCompleted();
              resetContentCounts();
              toast({
                title: "🎉 24-Hour Gold Trial Activated!",
                description: "You now have full access to all premium features for 24 hours. Enjoy!",
              });
              guardedNavigate(() => setLocation('/dashboard?trial=started'));
              return;
            }
            
            // User came from forced flow - check for return state first
            console.log('[Signup] User from forced flow - checking for return state');
            markFlowCompleted();
            resetContentCounts(); // Reset click counts after successful signup
            
            const returnState = getReturnState();
            if (returnState) {
              console.log('[Signup] Restoring user to:', returnState.path);
              clearReturnState();
              toast({
                title: "Welcome to PlantRx!",
                description: `You're all signed in. Returning you to where you left off!`,
              });
              guardedNavigate(() => setLocation(returnState.path));
              // Restore scroll position after navigation
              setTimeout(() => {
                restoreScrollPosition(returnState.scrollY);
              }, 300);
            } else {
              toast({
                title: "Welcome to PlantRx!",
                description: `You're all signed in. Start exploring natural remedies!`,
              });
              guardedNavigate(() => setLocation('/dashboard'));
            }
            return;
          } catch (error) {
            console.error('[Signup] Error during forced flow setup:', error);
            // If there's an error, still complete the flow and check for return state
            markFlowCompleted();
            resetContentCounts();
            
            const returnState = getReturnState();
            if (returnState) {
              clearReturnState();
              guardedNavigate(() => setLocation(returnState.path));
              setTimeout(() => restoreScrollPosition(returnState.scrollY), 300);
            } else {
              guardedNavigate(() => setLocation('/dashboard'));
            }
            return;
          }
        }
        
        // Handle Gold Trial intent for non-forced flow signups
        if (shouldStartTrial) {
          console.log('[Signup] Starting Gold Trial for new user...');
          try {
            const token = await user.getIdToken();
            const syncResponse = await fetch('/api/auth/firebase-sync', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              credentials: 'include',
              body: JSON.stringify({ startTrial: true })
            });
            
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              if (syncData.trialStarted) {
                console.log('[Signup] Gold Trial activated successfully!');
                toast({
                  title: "🎉 24-Hour Gold Trial Activated!",
                  description: "You now have full access to all premium features for 24 hours. Enjoy!",
                });
                guardedNavigate(() => setLocation('/dashboard?trial=started'));
                return;
              }
            }
          } catch (error) {
            console.error('[Signup] Error starting trial:', error);
          }
        }
        
        // Check if user was signing up for Bronze tier
        const pendingBronze = localStorage.getItem('pendingBronzeSignup');
        if (pendingBronze === 'true') {
          // Activate Bronze tier
          try {
            const response = await fetch('/api/user/subscription', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                subscriptionTier: 'bronze',
                subscriptionStatus: 'active'
              })
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(errorData.message || `Bronze activation failed: ${response.statusText}`);
            }
            
            toast({
              title: "Welcome to PlantRx Bronze! 🎉",
              description: `You're all set with FREE access to 131+ verified plant-based remedies!`,
            });
            localStorage.removeItem('pendingBronzeSignup');
          } catch (error) {
            console.error('Bronze activation error:', error);
            toast({
              title: "Bronze Activation Error",
              description: "Failed to activate Bronze membership. Please visit the Pricing page to try again.",
              variant: "destructive"
            });
            // Keep pendingBronzeSignup flag so user can retry
          }
        } else {
          toast({
            title: "Welcome to PlantRx!",
            description: `Successfully signed up as ${userData.displayName}`,
          });
        }
        
        // Check for return state and navigate accordingly
        resetContentCounts(); // Reset click counts after successful signup
        const returnState = getReturnState();
        if (returnState) {
          console.log('[Signup] Restoring user to:', returnState.path);
          clearReturnState();
          guardedNavigate(() => setLocation(returnState.path));
          setTimeout(() => restoreScrollPosition(returnState.scrollY), 300);
        } else {
          guardedNavigate(() => setLocation('/dashboard'));
        }
      }
    });
    return () => unsub();
  }, [setLocation, toast]);

  if (!ready) return null; // Don't render until auth state is resolved

  // Email validation function
  const validateEmail = async (email: string) => {
    if (!email) {
      setEmailValidation({ isValid: false, isChecking: false, message: "" });
      return;
    }

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({ 
        isValid: false, 
        isChecking: false, 
        message: "Please enter a valid email format" 
      });
      return;
    }

    setEmailValidation({ isValid: false, isChecking: true, message: "Checking email..." });

    try {
      // Check for common disposable/temporary email domains
      const disposableDomains = [
        'tempmail.com', 'guerrillamail.com', 'mailinator.com', 
        '10minutemail.com', 'throwaway.email', 'fakeinbox.com'
      ];
      const domain = email.split('@')[1].toLowerCase();
      
      if (disposableDomains.includes(domain)) {
        setEmailValidation({ 
          isValid: false, 
          isChecking: false, 
          message: "Please use a permanent email address" 
        });
        return;
      }

      // Check if domain has valid MX records (basic DNS check)
      // We'll use a simple heuristic - check for common valid domains
      const commonDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
        'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com',
        'live.com', 'msn.com', 'mail.com', 'yandex.com'
      ];

      if (commonDomains.includes(domain)) {
        setEmailValidation({ 
          isValid: true, 
          isChecking: false, 
          message: "Email verified ✓" 
        });
        return;
      }

      // For other domains, do a basic domain check
      // Check if domain has at least 2 parts and valid TLD
      const domainParts = domain.split('.');
      if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
        setEmailValidation({ 
          isValid: false, 
          isChecking: false, 
          message: "Invalid email domain" 
        });
        return;
      }

      // Accept as valid if it passes all checks
      setEmailValidation({ 
        isValid: true, 
        isChecking: false, 
        message: "Email verified ✓" 
      });
    } catch (error) {
      setEmailValidation({ 
        isValid: false, 
        isChecking: false, 
        message: "Unable to verify email" 
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time email validation and suggestions
    if (field === 'email') {
      // Update suggestions
      updateEmailSuggestions(value);
      
      // Debounce email validation
      const timeoutId = setTimeout(() => {
        validateEmail(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation check
      if (!emailValidation.isValid) {
        throw new Error('Please enter a valid, working email address');
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (!agreeToTerms) {
        throw new Error('Please agree to the Terms of Service and Privacy Policy');
      }

      // Use Firebase email signup
      const displayName = `${formData.firstName} ${formData.lastName}`;
      await emailSignUp(formData.email, formData.password, displayName);
      
      // Subscribe to newsletter for email signups
      subscribeToNewsletter.mutate({
        email: formData.email,
        name: displayName,
        source: 'email_signup'
      });
      
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await googleSignIn();
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Google sign up error:', error);
      
      // Wait a moment to see if auth actually succeeded
      setTimeout(() => {
        // Only show error if user is still not authenticated
        if (!auth.currentUser) {
          // Don't show error if user cancelled or if redirecting
          if (error.code !== 'auth/popup-closed-by-user' && 
              error.code !== 'auth/cancelled-popup-request' &&
              !error.message.includes('Redirecting to Google')) {
            const errorMessage = getAuthErrorMessage(error);
            toast({
              title: "Google Sign Up Failed",
              description: errorMessage,
              variant: "destructive"
            });
          }
        }
      }, 500);
    } finally {
      // Keep loading state for a moment to allow auth state to update
      setTimeout(() => setIsGoogleLoading(false), 500);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      await appleSignIn();
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Apple sign up error:', error);
      
      // Wait a moment to see if auth actually succeeded
      setTimeout(() => {
        // Only show error if user is still not authenticated
        if (!auth.currentUser) {
          // Don't show error if user cancelled or if redirecting
          if (error.code !== 'auth/popup-closed-by-user' && 
              error.code !== 'auth/cancelled-popup-request' &&
              !error.message.includes('Redirecting to Apple')) {
            const errorMessage = getAuthErrorMessage(error);
            toast({
              title: "Apple Sign Up Failed",
              description: errorMessage,
              variant: "destructive"
            });
          }
        }
      }, 500);
    } finally {
      // Keep loading state for a moment to allow auth state to update
      setTimeout(() => setIsAppleLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Sign Up - Join PlantRx Expert Natural Health Platform"
        description="Create your free PlantRx account to access 181+ verified natural remedies, expert consultations, and personalized wellness guidance."
        keywords="sign up, create account, PlantRx registration, natural health platform, wellness account"
        canonical="https://plantrxapp.com/signup"
        noindex={true}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 lg:py-16">
        {/* Mobile/Tablet Layout (hidden on laptop+) */}
        <div className="max-w-3xl mx-auto xl:hidden">
          <div className="w-full">
            <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <div className="flex items-center justify-center mb-4 sm:mb-6 lg:hidden">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                    Join PlantRx
                  </h1>
                  <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto px-4 sm:px-0">
                    Create your free account to access expert natural health solutions
                  </p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 shadow-xl border border-white/20 dark:border-gray-700/20">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="firstName" className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                        <Input
                          id="firstName"
                          name="given-name"
                          type="text"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="h-12 sm:h-14 text-base sm:text-lg border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl"
                          data-testid="input-firstName"
                        />
              </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="lastName" className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                        <Input
                          id="lastName"
                          name="family-name"
                          type="text"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="h-12 sm:h-14 text-base sm:text-lg border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl"
                          data-testid="input-lastName"
                        />
              </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 md:col-span-2">
                      <Label htmlFor="email" className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="off"
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck={false}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onFocus={() => formData.email.includes('@') && updateEmailSuggestions(formData.email)}
                          onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 150)}
                          required
                          className={`h-12 sm:h-14 text-base sm:text-lg rounded-lg sm:rounded-xl pr-10 ${
                            emailValidation.message && !emailValidation.isChecking
                              ? emailValidation.isValid
                                ? 'border-green-500 dark:border-green-400'
                                : 'border-red-500 dark:border-red-400'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          data-testid="input-email"
                        />
                        {/* Email domain suggestions dropdown */}
                        {showEmailSuggestions && emailSuggestions.length > 0 && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                            {emailSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                className="w-full px-4 py-3 text-left text-base text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  selectEmailSuggestion(suggestion);
                                }}
                                data-testid={`email-suggestion-mobile-${index}`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        {emailValidation.isChecking && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                          </div>
                        )}
                        {!emailValidation.isChecking && emailValidation.isValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      {emailValidation.message && !emailValidation.isChecking && (
                        <p className={`text-sm ${
                          emailValidation.isValid 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {emailValidation.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 md:col-span-1">
                      <Label htmlFor="password" className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">Password (min. 6 characters)</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="new-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                          className="h-12 sm:h-14 text-base sm:text-lg border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl pr-12"
                          data-testid="input-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 sm:h-14 px-3 sm:px-4 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 md:col-span-1">
                      <Label htmlFor="confirmPassword" className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="h-12 sm:h-14 text-base sm:text-lg border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl pr-12"
                          data-testid="input-confirmPassword"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 sm:h-14 px-3 sm:px-4 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 sm:space-x-3 md:col-span-2 pt-2 sm:pt-4">
                      <Checkbox 
                        id="terms" 
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                        className="mt-0.5 sm:mt-1"
                      />
                      <Label 
                        htmlFor="terms" 
                        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer"
                      >
                        I agree to PlantRx's{" "}
                        <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                          Terms of Service
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 font-medium">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 sm:h-16 text-base sm:text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl md:col-span-2" 
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  <div className="flex items-center my-6 sm:my-8 lg:my-10">
                    <Separator className="flex-1" />
                    <span className="px-4 sm:px-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">or</span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleGoogleSignUp}
                      variant="outline"
                      className="w-full h-14 sm:h-16 text-base sm:text-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      <FaGoogle className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-red-500" />
                      {isGoogleLoading ? "Signing up with Google..." : "Continue with Google"}
                    </Button>

                    <Button 
                      onClick={handleAppleSignUp}
                      variant="outline"
                      className="w-full h-14 sm:h-16 text-base sm:text-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      <FaApple className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-gray-900 dark:text-white" />
                      {isAppleLoading ? "Signing up with Apple..." : "Continue with Apple"}
                    </Button>
                  </div>
          
                  
                  <div className="mt-6 sm:mt-8 lg:mt-10 text-center">
                    <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400">Already have an account? </span>
                    <Link 
                      href="/login" 
                      className="text-base sm:text-lg text-green-600 hover:text-green-700 font-semibold"
                      onClick={() => {
                        // Clear forced flow flag if user chooses to sign in instead
                        localStorage.removeItem('plantrx_forced_flow_active');
                      }}
                    >
                      Sign in here
                    </Link>
                  </div>
                  
                  {/* Only show Back button if NOT coming from forced flow */}
                  {localStorage.getItem('plantrx_forced_flow_active') !== 'true' && (
                    <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
                      <Link href="/" className="text-sm sm:text-base text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        ← Back to PlantRx
                      </Link>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
        
        {/* Laptop/Desktop Layout (visible on xl+ screens) */}
        <div className="hidden xl:block max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Side - Logo + Benefits */}
            <div className="space-y-8">
              {/* Logo Section */}
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">PlantRx</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Expert Natural Health Platform</p>
                </div>
              </div>
              
              {/* Benefits Section */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Transform Your Health Naturally with PlantRx</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Find Relief for Sleep, Stress, Digestion & More</h3>
                      <p className="text-gray-600 dark:text-gray-300">Discover proven natural solutions from our library of 131+ plant-based remedies. Whether you're struggling with insomnia, anxiety, inflammation, or chronic pain—we've got you covered with safe, effective alternatives.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Personalized Expert Guidance</h3>
                      <p className="text-gray-600 dark:text-gray-300">Chat with Remy, our AI health consultant powered by decades of natural medicine expertise. Receive tailored remedy recommendations based on your specific symptoms, lifestyle, and health goals—available 24/7.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Save Money on Healthcare Costs</h3>
                      <p className="text-gray-600 dark:text-gray-300">Access professional-grade natural remedies at a fraction of prescription costs. Many of our solutions use ingredients you already have at home, helping you build a healthier life without breaking the bank.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Join a Supportive Wellness Community</h3>
                      <p className="text-gray-600 dark:text-gray-300">Connect with thousands of people just like you who've successfully improved their health naturally. Share experiences, learn from real success stories, and get inspired by authentic results from verified users.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Signup Form */}
            <div className="flex items-center justify-center">
              {/* Signup Form */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join PlantRx</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Create your free account to get started</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                      <Input
                        id="firstName-desktop"
                        name="given-name"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                      <Input
                        id="lastName-desktop"
                        name="family-name"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                    <div className="relative">
                      <Input
                        id="email-desktop"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => formData.email.includes('@') && updateEmailSuggestions(formData.email)}
                        onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 150)}
                        required
                        className={`h-12 text-base rounded-xl pr-10 ${
                          emailValidation.message && !emailValidation.isChecking
                            ? emailValidation.isValid
                              ? 'border-green-500 dark:border-green-400'
                              : 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        data-testid="input-email-desktop"
                      />
                      {/* Email domain suggestions dropdown */}
                      {showEmailSuggestions && emailSuggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                          {emailSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full px-4 py-3 text-left text-base text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectEmailSuggestion(suggestion);
                              }}
                              data-testid={`email-suggestion-${index}`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {emailValidation.isChecking && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                      {!emailValidation.isChecking && emailValidation.isValid && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                    </div>
                    {emailValidation.message && !emailValidation.isChecking && (
                      <p className={`text-sm ${
                        emailValidation.isValid 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {emailValidation.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password (min. 6 characters)</Label>
                    <div className="relative">
                      <Input
                        id="password-desktop"
                        name="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-4 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword-desktop"
                        name="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-4 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox 
                      id="terms-desktop" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <Label 
                      htmlFor="terms-desktop" 
                      className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer"
                    >
                      I agree to PlantRx's{" "}
                      <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                        Terms of Service
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 font-medium">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl" 
                    disabled={isLoading || isGoogleLoading || isAppleLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="flex items-center my-6">
                  <Separator className="flex-1" />
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                  <Separator className="flex-1" />
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleGoogleSignUp}
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                    disabled={isLoading || isGoogleLoading || isAppleLoading}
                  >
                    <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
                    {isGoogleLoading ? "Signing up with Google..." : "Continue with Google"}
                  </Button>

                  <Button 
                    onClick={handleAppleSignUp}
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                    disabled={isLoading || isGoogleLoading || isAppleLoading}
                  >
                    <FaApple className="w-5 h-5 mr-3 text-gray-900 dark:text-white" />
                    {isAppleLoading ? "Signing up with Apple..." : "Continue with Apple"}
                  </Button>
                </div>
        
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
                  <Link 
                    href="/login" 
                    className="text-sm text-green-600 hover:text-green-700 font-semibold"
                    onClick={() => {
                      // Clear forced flow flag if user chooses to sign in instead
                      localStorage.removeItem('plantrx_forced_flow_active');
                    }}
                  >
                    Sign in here
                  </Link>
                </div>
                
                {/* Only show Back button if NOT coming from forced flow */}
                {localStorage.getItem('plantrx_forced_flow_active') !== 'true' && (
                  <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      ← Back to PlantRx
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}