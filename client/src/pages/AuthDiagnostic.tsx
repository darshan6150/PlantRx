import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getClientConfig } from '@shared/config';
import { auth, googleProvider, appleProvider } from '@/auth';

export default function AuthDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addDiagnostic = (status: 'success' | 'error' | 'info', message: string, details?: any) => {
    setDiagnostics(prev => [...prev, { status, message, details, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    try {
      // Check 1: Environment Variables
      addDiagnostic('info', 'Checking environment variables...');
      const config = getClientConfig();
      
      if (config.firebase.apiKey) {
        addDiagnostic('success', 'Firebase API Key is set', { 
          preview: config.firebase.apiKey.substring(0, 10) + '...' 
        });
      } else {
        addDiagnostic('error', 'Firebase API Key is missing');
      }

      if (config.firebase.projectId) {
        addDiagnostic('success', 'Firebase Project ID is set', { 
          projectId: config.firebase.projectId 
        });
      } else {
        addDiagnostic('error', 'Firebase Project ID is missing');
      }

      const expectedAuthDomain = `${config.firebase.projectId}.firebaseapp.com`;
      
      if (config.firebase.authDomain) {
        if (config.firebase.authDomain === expectedAuthDomain) {
          addDiagnostic('success', 'Firebase Auth Domain is correct', { 
            authDomain: config.firebase.authDomain,
            status: 'Matches Firebase Console configuration ✅'
          });
        } else {
          addDiagnostic('error', 'Firebase Auth Domain MISMATCH!', { 
            current: config.firebase.authDomain,
            expected: expectedAuthDomain,
            fix: `Update VITE_FIREBASE_AUTH_DOMAIN secret to: ${expectedAuthDomain}`
          });
        }
      } else {
        addDiagnostic('info', 'Firebase Auth Domain not set, using default', { 
          authDomain: expectedAuthDomain 
        });
      }

      // Check 2: Current Domain
      const currentDomain = window.location.origin;
      addDiagnostic('info', 'Current domain', { 
        currentDomain,
        expectedAuthDomain: config.firebase.authDomain || `${config.firebase.projectId}.firebaseapp.com`
      });

      if (currentDomain.includes('replit.dev') || currentDomain.includes('repl.co')) {
        addDiagnostic('error', 'You are accessing from a Replit development domain', {
          current: currentDomain,
          note: 'OAuth may not work on Replit preview domains. You need to add this specific domain to Firebase authorized domains AND Google Cloud OAuth client.'
        });
      } else if (currentDomain.includes('plantrxapp.com')) {
        addDiagnostic('success', 'Accessing from production domain', {
          domain: currentDomain
        });
      }

      // Check 3: Firebase Auth State
      addDiagnostic('info', 'Checking Firebase Auth initialization...');
      if (auth) {
        addDiagnostic('success', 'Firebase Auth is initialized');
        const currentUser = auth.currentUser;
        if (currentUser) {
          addDiagnostic('success', 'User is currently signed in', {
            email: currentUser.email,
            uid: currentUser.uid.substring(0, 8) + '...',
            provider: currentUser.providerData[0]?.providerId
          });
        } else {
          addDiagnostic('info', 'No user currently signed in');
        }
      } else {
        addDiagnostic('error', 'Firebase Auth is not initialized');
      }

      // Check 4: Provider Configuration
      addDiagnostic('info', 'Checking OAuth providers...');
      if (googleProvider) {
        addDiagnostic('success', 'Google Provider is configured', {
          providerId: 'google.com'
        });
      } else {
        addDiagnostic('error', 'Google Provider is not configured');
      }

      if (appleProvider) {
        addDiagnostic('success', 'Apple Provider is configured', {
          providerId: 'apple.com'
        });
      } else {
        addDiagnostic('error', 'Apple Provider is not configured');
      }

      // Check 5: Domain Authorization Requirements
      addDiagnostic('info', 'Domain authorization requirements:');
      const authDomain = config.firebase.authDomain || `${config.firebase.projectId}.firebaseapp.com`;
      
      addDiagnostic('info', 'Required Firebase Authorized Domains:', {
        domains: [
          currentDomain.replace('https://', '').replace('http://', ''),
          authDomain,
          'localhost'
        ]
      });

      addDiagnostic('info', 'Required Google Cloud OAuth JavaScript Origins:', {
        origins: [
          currentDomain,
          'http://localhost',
          'http://localhost:5000'
        ]
      });

      addDiagnostic('info', 'Required Google Cloud OAuth Redirect URIs:', {
        uris: [
          `${currentDomain}/__/auth/handler`,
          `https://${authDomain}/__/auth/handler`,
          'http://localhost/__/auth/handler',
          'http://localhost:5000/__/auth/handler'
        ]
      });

      // Check 6: Console Configuration Links
      addDiagnostic('info', 'Configuration Links:', {
        firebaseConsole: `https://console.firebase.google.com/project/${config.firebase.projectId}/authentication/settings`,
        googleCloudOAuth: `https://console.cloud.google.com/apis/credentials?project=${config.firebase.projectId}`,
        identityToolkit: `https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=${config.firebase.projectId}`
      });

    } catch (error: any) {
      addDiagnostic('error', 'Diagnostic failed', {
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testGoogleSignIn = async () => {
    addDiagnostic('info', 'Attempting Google Sign In...');
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      addDiagnostic('success', 'Google Sign In successful!', {
        email: result.user.email,
        uid: result.user.uid.substring(0, 8) + '...'
      });
    } catch (error: any) {
      addDiagnostic('error', `Google Sign In failed: ${error.code}`, {
        code: error.code,
        message: error.message,
        details: error.customData
      });
    }
  };

  const testAppleSignIn = async () => {
    addDiagnostic('info', 'Attempting Apple Sign In...');
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, appleProvider);
      addDiagnostic('success', 'Apple Sign In successful!', {
        email: result.user.email,
        uid: result.user.uid.substring(0, 8) + '...'
      });
    } catch (error: any) {
      addDiagnostic('error', `Apple Sign In failed: ${error.code}`, {
        code: error.code,
        message: error.message,
        details: error.customData
      });
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Firebase OAuth Diagnostic Tool</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Check your Firebase and OAuth configuration for issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={runDiagnostics} 
                disabled={isRunning}
                data-testid="button-run-diagnostics"
              >
                {isRunning ? 'Running...' : 'Run Diagnostics'}
              </Button>
              <Button 
                onClick={testGoogleSignIn} 
                variant="outline"
                data-testid="button-test-google"
              >
                Test Google Sign In
              </Button>
              <Button 
                onClick={testAppleSignIn} 
                variant="outline"
                data-testid="button-test-apple"
              >
                Test Apple Sign In
              </Button>
              <Button 
                onClick={() => setDiagnostics([])} 
                variant="outline"
                data-testid="button-clear"
              >
                Clear
              </Button>
            </div>

            {diagnostics.length > 0 && (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {diagnostics.map((diag, index) => (
                  <Alert 
                    key={index}
                    variant={diag.status === 'error' ? 'destructive' : 'default'}
                    className={diag.status === 'success' ? 'border-green-600 dark:border-green-400' : ''}
                  >
                    <div className="flex items-start gap-2">
                      {getIcon(diag.status)}
                      <div className="flex-1">
                        <AlertDescription className="text-gray-900 dark:text-white">
                          <div className="font-medium">{diag.message}</div>
                          {diag.details && (
                            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto text-gray-900 dark:text-white">
                              {JSON.stringify(diag.details, null, 2)}
                            </pre>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
