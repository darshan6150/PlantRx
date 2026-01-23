import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/auth";

interface ForcedSignupModalProps {
  isOpen: boolean;
  onSignupComplete: () => void;
}

export function ForcedSignupModal({ isOpen, onSignupComplete }: ForcedSignupModalProps) {
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
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: "",
    isChecking: false
  });
  const { toast } = useToast();

  // Prevent ESC key from closing the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  // Email validation
  const validateEmail = async (email: string) => {
    if (!email) {
      setEmailValidation({ isValid: false, message: "", isChecking: false });
      return;
    }

    setEmailValidation({ isValid: false, message: "", isChecking: true });

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({
        isValid: false,
        message: "Please enter a valid email address",
        isChecking: false
      });
      return;
    }

    // Disposable email domains to block
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
      'maildrop.cc', 'mailinator.com', 'trashmail.com', 'yopmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setEmailValidation({
        isValid: false,
        message: "Disposable email addresses are not allowed",
        isChecking: false
      });
      return;
    }

    // Check for common valid domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const isCommonDomain = commonDomains.includes(domain);

    if (isCommonDomain) {
      setEmailValidation({
        isValid: true,
        message: "Email address looks good!",
        isChecking: false
      });
    } else {
      // For other domains, just check format
      setEmailValidation({
        isValid: true,
        message: "Email address looks good!",
        isChecking: false
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email') {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValidation.isValid) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Sync with backend
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/firebase-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: formData.email,
          username: `${formData.firstName} ${formData.lastName}`,
          displayName: `${formData.firstName} ${formData.lastName}`
        }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to sync with backend");
      }

      toast({
        title: "Account Created! 🎉",
        description: "Welcome to PlantRx! Now choose your plan.",
        variant: "default"
      });

      // Call the completion callback to show subscription modal
      onSignupComplete();
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent
        className="max-w-2xl bg-white dark:bg-gray-900 p-8 sm:p-12 border-2 border-yellow-500 dark:border-yellow-600 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <VisuallyHidden>
          <DialogTitle>Create Your PlantRx Account</DialogTitle>
        </VisuallyHidden>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Join PlantRx Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create your free account to continue exploring our natural health platform
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Sign up required to continue browsing
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName-forced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </Label>
              <Input
                id="firstName-forced"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                data-testid="input-firstName-forced"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName-forced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastName-forced"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                data-testid="input-lastName-forced"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-forced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email-forced"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={`h-12 text-base rounded-xl pr-10 ${
                  emailValidation.message && !emailValidation.isChecking
                    ? emailValidation.isValid
                      ? 'border-green-500 dark:border-green-400'
                      : 'border-red-500 dark:border-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                data-testid="input-email-forced"
              />
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
            <Label htmlFor="password-forced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password (min. 6 characters)
            </Label>
            <div className="relative">
              <Input
                id="password-forced"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl pr-12"
                data-testid="input-password-forced"
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
            <Label htmlFor="confirmPassword-forced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword-forced"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl pr-12"
                data-testid="input-confirmPassword-forced"
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
              id="terms-forced" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
              className="mt-0.5"
              data-testid="checkbox-terms-forced"
            />
            <Label 
              htmlFor="terms-forced" 
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
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white rounded-xl shadow-lg shadow-yellow-500/30" 
            disabled={isLoading}
            data-testid="button-signup-forced"
          >
            {isLoading ? "Creating Account..." : "Create Free Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Sign in here
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
