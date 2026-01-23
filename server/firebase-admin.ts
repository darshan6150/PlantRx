// Firebase Admin SDK for server-side authentication
import admin from 'firebase-admin';
import { existsSync } from 'fs';
import { glob } from 'glob';

let adminApp: admin.app.App | null = null;

// Security check: Detect committed service account files
function checkForCommittedSecrets() {
  try {
    const patterns = ['**/attached_assets/*firebase*adminsdk*.json', '**/attached_assets/*service-account*.json'];
    for (const pattern of patterns) {
      const files = glob.sync(pattern, { ignore: 'node_modules/**' });
      if (files.length > 0) {
        console.error(`🚨 SECURITY ALERT: Found committed service account files: ${files.join(', ')}`);
        console.error('🚨 These files contain private keys and must be removed immediately!');
        if (process.env.NODE_ENV === 'production') {
          console.error('🚨 Production startup blocked due to security violation');
          process.exit(1);
        }
      }
    }
  } catch (error) {
    // Non-critical check - don't fail startup if glob fails
    console.warn('Warning: Could not check for committed secrets:', error);
  }
}

// Run security check on startup
checkForCommittedSecrets();

export function initializeFirebaseAdmin(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  try {
    // Initialize Firebase Admin with service account credentials (required for Replit)
    let serviceAccount: admin.ServiceAccount | undefined;
    let projectId: string | undefined;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      // Decode base64 and parse JSON (preferred method for Replit)
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString();
      const parsed = JSON.parse(decoded);
      serviceAccount = parsed;
      projectId = parsed.project_id;
      console.log('🔐 Using Firebase service account from base64');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      // Parse JSON string (fallback method)
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      serviceAccount = parsed;
      projectId = parsed.project_id;
      console.log('🔐 Using Firebase service account from JSON');
    } else if (process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      // Use environment variables for service account details
      projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      serviceAccount = {
        projectId,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      console.log('🔐 Using Firebase service account from env vars');
    } else {
      // No credentials available - this will cause auth failures
      console.error('❌ No Firebase Admin credentials found. Set FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_BASE64, or individual env vars');
      throw new Error(
        'Firebase Admin credentials required: Set FIREBASE_SERVICE_ACCOUNT_JSON (full JSON), ' +
        'FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 encoded), or individual vars ' +
        '(FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY)'
      );
    }

    if (!serviceAccount || !projectId) {
      throw new Error('Invalid service account configuration');
    }

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });

    console.log(`✅ Firebase Admin initialized successfully for project: ${projectId}`);
    return adminApp;
    
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw new Error(`Firebase Admin setup failed: ${error}`);
  }
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const app = initializeFirebaseAdmin();
    const auth = admin.auth(app);
    
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error: any) {
    // Provide detailed error information for debugging
    const errorCode = error.code || 'unknown';
    const errorMessage = error.message || 'Unknown error';
    
    console.error(`❌ Firebase ID token verification failed [${errorCode}]:`, errorMessage);
    
    // Return user-friendly error messages based on error type
    if (errorCode === 'auth/id-token-expired') {
      throw new Error('Firebase token expired - please sign in again');
    } else if (errorCode === 'auth/project-not-found') {
      throw new Error('Firebase project configuration error');
    } else if (errorCode === 'auth/invalid-argument') {
      throw new Error('Invalid Firebase token format');
    } else {
      throw new Error(`Invalid Firebase token: ${errorCode}`);
    }
  }
}

export async function createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
  try {
    const app = initializeFirebaseAdmin();
    const auth = admin.auth(app);
    
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Custom token creation failed:', error);
    throw new Error(`Custom token creation failed: ${error}`);
  }
}

export { admin };
export default admin;