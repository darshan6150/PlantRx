// Enhanced Security System for PlantRx
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting configurations
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many API requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: 'Too many password reset attempts, please try again later',
});

// Enhanced input validation
export function validateInput(req: Request, res: Response, next: NextFunction) {
  // Remove potential XSS attempts
  const cleanInput = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      const cleaned: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        cleaned[key] = cleanInput(obj[key]);
      }
      return cleaned;
    }
    return obj;
  };

  if (req.body) {
    req.body = cleanInput(req.body);
  }
  if (req.query) {
    req.query = cleanInput(req.query);
  }

  next();
}

// SQL injection prevention
export function preventSQLInjection(req: Request, res: Response, next: NextFunction) {
  const sqlInjectionPatterns = [
    /(\w*)((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /union(\s|\+)+select/i,
    /drop(\s|\+)+table/i,
    /insert(\s|\+)+into/i,
    /delete(\s|\+)+from/i,
    /update(\s|\+)+set/i,
  ];

  const checkForSQLInjection = (value: string): boolean => {
    return sqlInjectionPatterns.some(pattern => pattern.test(value));
  };

  const validateObject = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return checkForSQLInjection(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (validateObject(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (req.body && validateObject(req.body)) {
    return res.status(400).json({ error: 'Invalid input detected' });
  }

  if (req.query && validateObject(req.query)) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  next();
}

// API key validation for external integrations
export function validateAPIKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // In production, validate against database or secure store
  const validAPIKeys = [
    process.env.PLANTRX_API_KEY,
    process.env.INTERNAL_API_KEY
  ].filter(Boolean);

  if (!validAPIKeys.includes(apiKey as string)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}

// Enhanced session security
export const sessionConfig = {
  name: 'plantrx.sid',
  secret: process.env.SESSION_SECRET || 'plantrx-dev-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const
  }
};

// CSRF protection for forms
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for API requests with valid API keys
  if (req.headers['x-api-key']) {
    return next();
  }

  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

// Generate CSRF token
export function generateCSRFToken(req: Request): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (req.session) {
    req.session.csrfToken = token;
  }
  return token;
}

// Content Security Policy Nonce generation
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Enhanced error handling without exposing sensitive information
export function secureErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Security Error:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ 
      error: err.message,
      stack: err.stack 
    });
  }
}

export default {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  validateInput,
  preventSQLInjection,
  validateAPIKey,
  sessionConfig,
  csrfProtection,
  generateCSRFToken,
  generateNonce,
  secureErrorHandler
};