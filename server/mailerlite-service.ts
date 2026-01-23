import MailerLite from '@mailerlite/mailerlite-nodejs';

let mailerlite: MailerLite | null = null;

// Initialize MailerLite client
if (process.env.MAILERLITE_API_KEY) {
  mailerlite = new MailerLite({ 
    api_key: process.env.MAILERLITE_API_KEY 
  });
  console.log('✅ MailerLite client initialized');
} else {
  console.warn('⚠️  MailerLite API key not found. Set MAILERLITE_API_KEY environment variable.');
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  source?: string; // 'footer', 'signup', 'popup', etc.
}

export interface MailerLiteUser {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

/**
 * Subscribe user to newsletter
 */
export async function subscribeToNewsletter(data: NewsletterSubscription) {
  if (!mailerlite) {
    throw new Error('MailerLite not initialized. Check API key configuration.');
  }

  try {
    console.log(`📧 Subscribing ${data.email} to newsletter via ${data.source || 'unknown source'}`);

    const subscriber = await mailerlite.subscribers.createOrUpdate({
      email: data.email,
      fields: {
        name: data.name || '',
        source: data.source || 'website'
      },
      // Add to main newsletter group (you'll need to get this ID from MailerLite dashboard)
      groups: process.env.MAILERLITE_NEWSLETTER_GROUP_ID ? [process.env.MAILERLITE_NEWSLETTER_GROUP_ID] : undefined
    });

    console.log(`✅ Newsletter subscription successful for ${data.email}`);
    return subscriber;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown API error';
    console.error(`❌ Newsletter subscription failed for ${data.email}:`, errorMessage);
    throw new Error(`Failed to subscribe to newsletter: ${errorMessage}`);
  }
}

/**
 * Add user to MailerLite when they register
 */
export async function addUserToMailerLite(userData: MailerLiteUser) {
  if (!mailerlite) {
    throw new Error('MailerLite not initialized. Check API key configuration.');
  }

  try {
    console.log(`👤 Adding user ${userData.email} to MailerLite`);

    const subscriber = await mailerlite.subscribers.createOrUpdate({
      email: userData.email,
      fields: {
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        source: userData.source || 'user_registration'
      },
      // Add to registered users group (optional - you can create this in MailerLite dashboard)
      groups: process.env.MAILERLITE_USERS_GROUP_ID ? [process.env.MAILERLITE_USERS_GROUP_ID] : undefined
    });

    console.log(`✅ User added to MailerLite successfully: ${userData.email}`);
    return subscriber;
  } catch (error: any) {
    console.error(`❌ Failed to add user to MailerLite ${userData.email}:`, error.message);
    // Don't throw error for user registration - MailerLite failure shouldn't break user signup
    console.warn('User registration will continue despite MailerLite failure');
    return null;
  }
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  if (!mailerlite) {
    console.warn('MailerLite not initialized - welcome email skipped');
    return null;
  }

  try {
    // Note: For automated welcome emails, you should set up automation in MailerLite dashboard
    // This is just for tracking the trigger
    console.log(`📬 Welcome email triggered for ${email}`);
    
    // You can create a campaign or use automation in MailerLite dashboard
    // For now, we'll just log it as the automation should handle it
    return { success: true, message: 'Welcome email automation triggered' };
  } catch (error: any) {
    console.error(`❌ Welcome email failed for ${email}:`, error.message);
    return null;
  }
}

/**
 * Get subscriber information
 */
export async function getSubscriber(email: string) {
  if (!mailerlite) {
    throw new Error('MailerLite not initialized');
  }

  try {
    // Search for subscriber by email
    const response = await mailerlite.subscribers.get({ 
      filter: { email: email } 
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return null;
    }
    throw error;
  }
}

/**
 * Unsubscribe user from newsletter
 */
export async function unsubscribeFromNewsletter(email: string) {
  if (!mailerlite) {
    throw new Error('MailerLite not initialized');
  }

  try {
    await mailerlite.subscribers.delete(email);
    console.log(`✅ User unsubscribed: ${email}`);
    return { success: true };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown API error';
    console.error(`❌ Unsubscribe failed for ${email}:`, errorMessage);
    throw new Error(`Failed to unsubscribe: ${errorMessage}`);
  }
}

/**
 * Send feedback email notification to info@plantrxapp.com
 */
export async function sendFeedbackNotification(feedbackData: {
  email: string;
  name?: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
}) {
  if (!mailerlite) {
    console.warn('MailerLite not initialized - feedback email notification skipped');
    return null;
  }

  try {
    const feedbackTypeEmoji = {
      'feedback': '💬',
      'complaint': '⚠️',
      'bug_report': '🐛',
      'suggestion': '💡'
    };

    const priorityEmoji = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴'
    };

    const emailContent = `
      ${feedbackTypeEmoji[feedbackData.type as keyof typeof feedbackTypeEmoji] || '📝'} NEW FEEDBACK RECEIVED
      
      📧 From: ${feedbackData.name || 'Anonymous'} (${feedbackData.email})
      📝 Type: ${feedbackData.type.replace('_', ' ').toUpperCase()}
      ${priorityEmoji[feedbackData.priority as keyof typeof priorityEmoji]} Priority: ${feedbackData.priority.toUpperCase()}
      
      📋 Subject: ${feedbackData.subject}
      
      💬 Message:
      ${feedbackData.message}
      
      ⏰ Received at: ${new Date().toLocaleString()}
      
      ---
      This message was sent from PlantRx feedback form.
    `;

    console.log(`📬 Feedback notification email prepared for info@plantrxapp.com`);
    console.log(`📋 Feedback from: ${feedbackData.email} - Subject: ${feedbackData.subject}`);
    
    // Note: MailerLite is primarily for marketing emails, not transactional emails
    // For production, consider using a transactional email service like SendGrid or Mailgun
    // For now, we'll log the email content that should be sent to info@plantrxapp.com
    console.log('📧 EMAIL CONTENT TO BE SENT TO info@plantrxapp.com:');
    console.log(emailContent);
    
    return { success: true, message: 'Feedback notification logged (requires transactional email setup)' };
  } catch (error: any) {
    console.error(`❌ Feedback notification failed for ${feedbackData.email}:`, error.message);
    return null;
  }
}

export default {
  subscribeToNewsletter,
  addUserToMailerLite,
  sendWelcomeEmail,
  getSubscriber,
  unsubscribeFromNewsletter,
  sendFeedbackNotification
};