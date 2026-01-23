// src/auth.ts - Firebase Auth Integration
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

import { getClientConfig } from '@shared/config';

// Firebase config - using unified configuration system
const clientConfig = getClientConfig();
const firebaseConfig = {
  apiKey: clientConfig.firebase.apiKey,
  authDomain: clientConfig.firebase.authDomain || `${clientConfig.firebase.projectId}.firebaseapp.com`,
  projectId: clientConfig.firebase.projectId,
  storageBucket: clientConfig.firebase.storageBucket || `${clientConfig.firebase.projectId}.firebasestorage.app`,
  messagingSenderId: clientConfig.firebase.messagingSenderId,
  appId: clientConfig.firebase.appId,
  measurementId: clientConfig.firebase.measurementId
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to local storage so users stay signed in across sessions
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("[AUTH] Failed to set persistence:", error);
  });
}

// Google provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Apple provider setup
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Export Firebase auth functions
export { signInWithPopup };

// Auth state change listener - wrapped to handle localStorage sync
export function onAuthStateChanged(callback: (user: User | null) => void) {
  // Validate callback parameter
  if (typeof callback !== 'function') {
    console.error('[AUTH] onAuthStateChanged: callback is not a function');
    return () => {}; // Return empty unsubscribe function
  }

  return firebaseOnAuthStateChanged(auth, async (user) => {
    console.log("[AUTH] State:", user ? "authenticated" : "signed out");
    
    try {
      if (user) {
        // Sync with backend to create session with verified ID token
        try {
          // Get Firebase ID token for server verification
          const idToken = await user.getIdToken();
          
          // Check for Gold checkout intent (paid subscription flow from 24hr gold access)
          const goldCheckoutIntent = localStorage.getItem('plantrx-gold-checkout-intent');
          const shouldRedirectToGoldCheckout = goldCheckoutIntent === 'true';
          
          // Check for trial intent before making the sync request
          const trialIntent = localStorage.getItem('plantrx-trial-intent');
          const shouldStartTrial = trialIntent === 'true';
          
          // Clear intents immediately to prevent double-activation
          if (shouldRedirectToGoldCheckout) {
            localStorage.removeItem('plantrx-gold-checkout-intent');
          }
          if (shouldStartTrial) {
            localStorage.removeItem('plantrx-trial-intent');
          }
          
          const response = await fetch('/api/auth/firebase-sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            credentials: 'include',
            body: JSON.stringify({ startTrial: shouldStartTrial })
          });

          if (response.ok) {
            const backendUser = await response.json();
            console.log("[AUTH] Backend sync successful");
            
            // Store user data in localStorage for consistency
            const userData = {
              id: backendUser.user.id,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              username: backendUser.user.username,
              fullName: backendUser.user.fullName,
              firstName: user.displayName?.split(' ')[0] || '',
              lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
              profilePictureUrl: user.photoURL || backendUser.user.profilePictureUrl,
              isAuthenticated: true,
              provider: 'firebase'
            };
            localStorage.setItem('plantrx-user', JSON.stringify(userData));
            
            // Check if user should be redirected to Gold checkout after signup
            if (shouldRedirectToGoldCheckout) {
              console.log("[AUTH] Gold checkout intent detected - redirecting to Stripe checkout");
              if (typeof window !== 'undefined') {
                try {
                  const checkoutResponse = await fetch('/api/subscription/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ tier: 'gold' })
                  });

                  if (checkoutResponse.ok) {
                    const { url } = await checkoutResponse.json();
                    if (url) {
                      window.location.href = url;
                      return; // Stop further processing
                    }
                  }
                } catch (checkoutError) {
                  console.error("[AUTH] Gold checkout redirect failed:", checkoutError);
                  // Fall through to dashboard if checkout fails
                }
              }
            }
            
            // Check if trial was started as part of the sync
            if (backendUser.trialStarted) {
              console.log("[AUTH] Gold trial started successfully during signup!");
              if (typeof window !== 'undefined') {
                // Redirect to dashboard to see the trial timer
                window.location.href = '/dashboard?trial=started';
                return; // Stop further processing
              }
            }
          } else {
            console.error("[AUTH] Backend sync failed:", await response.text());
          }
        } catch (syncError) {
          console.error("[AUTH] Backend sync error:", syncError);
        }
      } else {
        localStorage.removeItem('plantrx-user');
      }
      
      // Safely call the callback
      if (typeof callback === 'function') {
        callback(user);
      }
    } catch (error) {
      console.error('[AUTH] Error in auth state handler:', error);
    }
  });
}

// Handle redirect results on app load - wrapped to prevent unhandled rejections
if (typeof window !== 'undefined') {
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        console.log("[AUTH] Redirect OK: user authenticated");
      }
    })
    .catch((error) => {
      // Only log non-critical errors
      if (error.code !== 'auth/popup-closed-by-user' && 
          error.code !== 'auth/cancelled-popup-request') {
        console.error("[AUTH] Redirect ERR:", error.code, error.message);
      }
    });
}

// Google Sign In function with improved error handling
export async function googleSignIn(): Promise<User> {
  try {
    // Check if we're in a secure context
    if (typeof window === 'undefined') {
      throw new Error('Google Sign In not available in server context');
    }

    // Enhanced logging for diagnostics
    console.log("[AUTH] 🔐 Starting Google Sign In...");
    console.log("[AUTH] Current URL:", window.location.href);
    console.log("[AUTH] Auth Domain:", auth.config.authDomain);
    console.log("[AUTH] Project ID:", auth.config.apiKey ? 'Set' : 'Missing');

    // Add a small delay to ensure Firebase is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("[AUTH] Opening Google sign-in popup...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("[AUTH] ✅ Google sign in successful");
    console.log("[AUTH] User email:", result.user.email);
    console.log("[AUTH] Provider:", result.user.providerData[0]?.providerId);
    return result.user;
  } catch (error: any) {
    // Enhanced error logging
    console.error("[AUTH] ❌ Google Sign In Error Details:");
    console.error("[AUTH] Error Code:", error.code);
    console.error("[AUTH] Error Message:", error.message);
    console.error("[AUTH] Full Error:", JSON.stringify({
      code: error.code,
      message: error.message,
      customData: error.customData,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, null, 2));
    
    // Handle invalid credential error - OAuth configuration issue
    if (error.code === "auth/invalid-credential") {
      console.error("[AUTH] ❌❌❌ INVALID CREDENTIAL ERROR ❌❌❌");
      console.error("[AUTH] This means the Google OAuth client credentials are incorrectly configured");
      console.error("[AUTH] TO FIX THIS:");
      console.error("[AUTH] 1. Go to https://console.firebase.google.com/");
      console.error("[AUTH] 2. Select your project:", firebaseConfig.projectId);
      console.error("[AUTH] 3. Go to Authentication > Sign-in method");
      console.error("[AUTH] 4. Click on Google provider");
      console.error("[AUTH] 5. Click 'Web SDK configuration'");
      console.error("[AUTH] 6. Copy the Web client ID");
      console.error("[AUTH] 7. Go to https://console.cloud.google.com/");
      console.error("[AUTH] 8. APIs & Services > Credentials");
      console.error("[AUTH] 9. Find the OAuth 2.0 Client ID that matches the Firebase Web client ID");
      console.error("[AUTH] 10. Verify authorized JavaScript origins include:", window.location.origin);
      console.error("[AUTH] 11. Verify authorized redirect URIs include: https://plantrx-app.firebaseapp.com/__/auth/handler");
      throw new Error("Google authentication is misconfigured. Please contact support or try email sign-in.");
    }
    
    // Handle network errors gracefully
    if (error.code === "auth/network-request-failed") {
      throw new Error("Network connection issue. Please check your internet connection and try again.");
    }
    
    // Handle unauthorized domain - suggest using redirect instead of showing error
    if (error.code === "auth/unauthorized-domain") {
      console.warn("[AUTH] ⚠️ Unauthorized domain detected. Current domain:", window.location.origin);
      console.warn("[AUTH] This domain needs to be added to Firebase Console → Authentication → Settings → Authorized domains");
      try {
        console.log("[AUTH] Attempting redirect method as fallback...");
        await signInWithRedirect(auth, googleProvider);
        // User will be redirected, so we won't reach here
        throw new Error("Redirecting to Google for authentication...");
      } catch (redirectError: any) {
        console.error("[AUTH] Redirect also failed:", redirectError.code, redirectError.message);
        // If redirect also fails, show helpful message
        throw new Error(`Authentication domain not authorized. Current domain: ${window.location.hostname}. Please add this domain to Firebase authorized domains.`);
      }
    }
    
    // Try redirect method if popup fails or is blocked
    if (error.code === "auth/popup-blocked" || 
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/operation-not-supported-in-this-environment") {
      try {
        console.log("[AUTH] Popup failed, trying redirect method...");
        await signInWithRedirect(auth, googleProvider);
        // User will be redirected, so we won't reach here
        throw new Error("Redirecting to Google...");
      } catch (redirectError: any) {
        console.error("[AUTH] Redirect Error:", redirectError.code, redirectError.message);
        throw redirectError;
      }
    }
    
    throw error;
  }
}

// Email/Password Sign In
export async function emailSignIn(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("[AUTH] Email sign in successful");
    return result.user;
  } catch (error: any) {
    console.error("[AUTH] Email Sign In Error:", error.code, error.message);
    throw error;
  }
}

// Email/Password Sign Up
export async function emailSignUp(email: string, password: string, displayName?: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    console.log("[AUTH] Email sign up successful");
    return result.user;
  } catch (error: any) {
    console.error("[AUTH] Email Sign Up Error:", error.code, error.message);
    throw error;
  }
}

// Apple Sign In function
export async function appleSignIn(): Promise<User> {
  try {
    // Check if we're in a secure context
    if (typeof window === 'undefined') {
      throw new Error('Apple Sign In not available in server context');
    }

    // Enhanced logging for diagnostics
    console.log("[AUTH]  Starting Apple Sign In...");
    console.log("[AUTH] Current URL:", window.location.href);
    console.log("[AUTH] Auth Domain:", auth.config.authDomain);

    // Add a small delay to ensure Firebase is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("[AUTH] Opening Apple sign-in popup...");
    const result = await signInWithPopup(auth, appleProvider);
    console.log("[AUTH] ✅ Apple sign in successful");
    console.log("[AUTH] User email:", result.user.email);
    console.log("[AUTH] Provider:", result.user.providerData[0]?.providerId);
    return result.user;
  } catch (error: any) {
    // Enhanced error logging
    console.error("[AUTH] ❌ Apple Sign In Error Details:");
    console.error("[AUTH] Error Code:", error.code);
    console.error("[AUTH] Error Message:", error.message);
    console.error("[AUTH] Full Error:", JSON.stringify({
      code: error.code,
      message: error.message,
      customData: error.customData,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }, null, 2));
    
    // Handle network errors gracefully
    if (error.code === "auth/network-request-failed") {
      throw new Error("Network connection issue. Please check your internet connection and try again.");
    }
    
    // Handle unauthorized domain
    if (error.code === "auth/unauthorized-domain") {
      console.warn("[AUTH] ⚠️ Unauthorized domain detected. Current domain:", window.location.origin);
      console.warn("[AUTH] This domain needs to be added to Firebase Console → Authentication → Settings → Authorized domains");
      try {
        console.log("[AUTH] Attempting redirect method as fallback...");
        await signInWithRedirect(auth, appleProvider);
        throw new Error("Redirecting to Apple for authentication...");
      } catch (redirectError: any) {
        console.error("[AUTH] Redirect also failed:", redirectError.code, redirectError.message);
        throw new Error(`Authentication domain not authorized. Current domain: ${window.location.hostname}. Please add this domain to Firebase authorized domains.`);
      }
    }
    
    // Try redirect method if popup fails or is blocked
    if (error.code === "auth/popup-blocked" || 
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/operation-not-supported-in-this-environment") {
      try {
        console.log("[AUTH] Popup failed, trying redirect method...");
        await signInWithRedirect(auth, appleProvider);
        // User will be redirected, so we won't reach here
        throw new Error("Redirecting to Apple...");
      } catch (redirectError: any) {
        console.error("[AUTH] Redirect Error:", redirectError.code, redirectError.message);
        throw redirectError;
      }
    }
    
    throw error;
  }
}

// Sign out function
export async function signOut() {
  try {
    // Clear backend session first
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (backendError) {
      console.error("[AUTH] Backend logout error:", backendError);
    }
    
    // Then sign out from Firebase
    await auth.signOut();
    localStorage.removeItem('plantrx-user');
    console.log("[AUTH] Sign out successful");
  } catch (error: any) {
    console.error("[AUTH] Sign Out Error:", error.code, error.message);
    throw error;
  }
}

// Helper to get user-friendly error messages
export function getAuthErrorMessage(error: any): string {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/unauthorized-domain':
      return 'Google Sign In is not available in this environment. Please contact support or try email sign-in instead.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by browser. Please allow popups for this site or try email sign-in.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Google Sign In is not supported in this environment. Please use email sign-in instead.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/internal-error':
      return 'Authentication service is temporarily unavailable. Please try again.';
    default:
      return error.message || 'An error occurred during authentication. Please try again.';
  }
}