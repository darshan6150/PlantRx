import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { googleSignIn, appleSignIn, emailSignIn, getAuthErrorMessage, auth, onAuthStateChanged } from '@/auth';
import { useNavigationGuard } from '@/utils/renderGuards';
import { getReturnState, clearReturnState, restoreScrollPosition, resetContentCounts } from "@/hooks/useContentAuthGate";

export default function Login() {
  useEnhancedPageTracking('auth', 'login');
  
  // Set modal active flag for trust popup coordination
  useEffect(() => {
    (window as any).PLANT_RX_MODAL_ACTIVE = true;
    return () => {
      (window as any).PLANT_RX_MODAL_ACTIVE = false;
    };
  }, []);
  
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const routed = useRef(false);
  const { toast } = useToast();
  const { guardedNavigate } = useNavigationGuard();

  // Wait for auth state before rendering - prevent redirect loops
  useEffect(() => {
    const unsub = onAuthStateChanged((user) => {
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
        
        // Check for return state and navigate accordingly
        resetContentCounts(); // Reset click counts after successful login
        const returnState = getReturnState();
        if (returnState) {
          console.log('[Login] Restoring user to:', returnState.path);
          clearReturnState();
          toast({
            title: "Welcome back to PlantRx!",
            description: `Returning you to where you left off!`,
          });
          guardedNavigate(() => setLocation(returnState.path));
          setTimeout(() => restoreScrollPosition(returnState.scrollY), 300);
        } else {
          toast({
            title: "Welcome to PlantRx!",
            description: `Successfully signed in as ${userData.displayName}`,
          });
          guardedNavigate(() => setLocation('/dashboard'));
        }
      }
    });
    return () => unsub();
  }, [setLocation, toast]);

  if (!ready) return null; // Don't render until auth state is resolved

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Use Firebase email authentication
      await emailSignIn(email, password);
      
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await googleSignIn();
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      // Wait a moment to see if auth actually succeeded
      setTimeout(() => {
        // Only show error if user is still not authenticated
        if (!auth.currentUser) {
          // Don't show error if user cancelled or if redirecting
          if (error.code !== 'auth/popup-closed-by-user' && 
              error.code !== 'auth/cancelled-popup-request' &&
              !error.message.includes('Redirecting to Google')) {
            
            const errorMessage = getAuthErrorMessage(error);
            
            // Special handling for domain authorization error
            if (error.code === 'auth/unauthorized-domain') {
              toast({
                title: "Google Sign In Not Available",
                description: "Google Sign In is not configured for this environment. Please use email sign-in below instead.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Google Sign In Failed",
                description: errorMessage,
                variant: "destructive"
              });
            }
          }
        }
      }, 500);
    } finally {
      // Keep loading state for a moment to allow auth state to update
      setTimeout(() => setIsGoogleLoading(false), 500);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      await appleSignIn();
      // Success will be handled by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      
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
              title: "Apple Sign In Failed",
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
        title="Sign In - PlantRx Expert Natural Health Platform"
        description="Sign in to your PlantRx account to access personalized natural remedies, expert consultations, and exclusive wellness content."
        keywords="sign in, login, PlantRx account, natural health platform, wellness login"
        canonical="https://plantrxapp.com/login"
        noindex={true}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 lg:py-16">
        {/* Mobile/Tablet Layout (hidden on laptop+) */}
        <div className="max-w-md mx-auto xl:hidden flex items-center justify-center min-h-screen">
          <div className="w-full">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
                  <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Sign in to continue your natural health journey
              </p>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 sm:h-14 text-base border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 sm:h-14 text-base border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl pr-12"
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
                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl" 
                  disabled={isLoading || isGoogleLoading || isAppleLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="flex items-center my-6">
                <Separator className="flex-1" />
                <span className="px-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">or</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl"
                  disabled={isLoading || isGoogleLoading || isAppleLoading}
                >
                  <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-red-500" />
                  {isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
                </Button>

                <Button 
                  onClick={handleAppleSignIn}
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl"
                  disabled={isLoading || isGoogleLoading || isAppleLoading}
                >
                  <FaApple className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-900 dark:text-white" />
                  {isAppleLoading ? "Signing in with Apple..." : "Continue with Apple"}
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Don't have an account? </span>
                <Link href="/signup" className="text-sm sm:text-base text-green-600 hover:text-green-700 font-semibold">
                  Sign up here
                </Link>
              </div>
              
              <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  ← Back to PlantRx
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Laptop/Desktop Layout (visible on xl+ screens) */}
        <div className="hidden xl:block max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Side - Welcome Message */}
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
              
              {/* Welcome Message */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Continue your natural wellness journey with personalized remedies, expert guidance, and a supportive community dedicated to your health.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    🌿 Over 181+ verified natural remedies waiting for you
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
                    <p className="text-gray-600 dark:text-gray-300">Access your PlantRx account</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                      <Input
                        id="email-desktop"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="password-desktop"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl" 
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="flex items-center my-6">
                    <Separator className="flex-1" />
                    <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full h-14 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
                      {isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
                    </Button>

                    <Button 
                      onClick={handleAppleSignIn}
                      variant="outline"
                      className="w-full h-14 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                      disabled={isLoading || isGoogleLoading || isAppleLoading}
                    >
                      <FaApple className="w-5 h-5 mr-3 text-gray-900 dark:text-white" />
                      {isAppleLoading ? "Signing in with Apple..." : "Continue with Apple"}
                    </Button>
                  </div>
          
                  <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
                    <Link href="/signup" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                      Sign up here
                    </Link>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      ← Back to PlantRx
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}