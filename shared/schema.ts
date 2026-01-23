import { pgTable, text, varchar, serial, integer, boolean, timestamp, real, jsonb, json } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // "customer", "expert", "admin"
  isVerified: boolean("is_verified").notNull().default(false),
  expertStatus: text("expert_status").default("pending"), // "pending", "approved", "rejected"
  expertCredentials: jsonb("expert_credentials"), // degree, license, website, etc.
  
  // Enhanced Expert Fields
  fullName: text("full_name"),
  linkedinUrl: text("linkedin_url"),
  highestDegree: text("highest_degree"),
  fieldOfExpertise: text("field_of_expertise"),
  businessAddress: text("business_address"),
  contactNumber: text("contact_number"),
  shortBio: text("short_bio"),
  profilePictureUrl: text("profile_picture_url"),
  
  // Enhanced Customer Fields
  age: integer("age"),
  location: text("location"),
  healthInterests: jsonb("health_interests"), // array of strings
  isPublicProfile: boolean("is_public_profile").notNull().default(true), // Privacy setting - true = public, false = private
  
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("bronze"), // "bronze", "silver", "gold"
  subscriptionStatus: text("subscription_status").default("active"), // "active", "canceled", "expired", "trial"
  subscriptionPeriodEnd: timestamp("subscription_period_end"),
  pendingTier: text("pending_tier"), // Stores selected tier during checkout process
  pendingCheckoutSessionId: text("pending_checkout_session_id"), // Stores Stripe checkout session ID
  
  // 24-Hour Gold Trial Fields
  goldTrialStartedAt: timestamp("gold_trial_started_at"), // When the 24h trial was started
  goldTrialUsedOnce: boolean("gold_trial_used_once").default(false), // Prevents repeat trials
  hasEverPaidSubscription: boolean("has_ever_paid_subscription").default(false), // True once user pays for any subscription
  
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  
  // User Preferences - Health & Wellness
  healthGoals: jsonb("health_goals").default([]), // ["weight_loss", "better_sleep", "stress_relief", "immunity", "energy", "digestion", "skin_health", "pain_relief"]
  dietaryRestrictions: jsonb("dietary_restrictions").default([]), // ["vegetarian", "vegan", "gluten_free", "dairy_free", "nut_free", "keto", "paleo"]
  allergies: jsonb("allergies").default([]), // ["pollen", "ragweed", "nuts", "shellfish", "dairy", "gluten", "soy", "eggs"]
  preferredRemedyForms: jsonb("preferred_remedy_forms").default([]), // ["tea", "tincture", "capsule", "topical", "essential_oil"]
  
  // Notification Preferences
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  weeklyDigest: boolean("weekly_digest").default(true),
  newRemedyAlerts: boolean("new_remedy_alerts").default(true),
  expertTipsEnabled: boolean("expert_tips_enabled").default(true),
  
  // Accessibility Settings
  textSize: text("text_size").default("medium"), // "small", "medium", "large", "extra_large"
  highContrast: boolean("high_contrast").default(false),
  reducedMotion: boolean("reduced_motion").default(false),
  screenReaderOptimized: boolean("screen_reader_optimized").default(false),
  
  // Personalization Data
  timezone: text("timezone").default("UTC"),
  preferredLanguage: text("preferred_language").default("en"),
  lastActiveAt: timestamp("last_active_at"),
  loginCount: integer("login_count").default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const remedies = pgTable("remedies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  ingredients: jsonb("ingredients").notNull(), // array of strings
  benefits: jsonb("benefits").notNull(), // array of strings
  cons: jsonb("cons").default([]), // array of strings - realistic disadvantages
  instructions: text("instructions").notNull(),
  form: text("form").notNull(), // "tea", "tincture", "topical", "capsule", etc.
  imageUrl: text("image_url"),
  expertId: integer("expert_id").references(() => users.id),
  isGenerated: boolean("is_generated").notNull().default(false), // AI-generated
  category: text("category").notNull(), // "digestive", "sleep", "immune", etc.
  averageRating: real("average_rating").default(0),
  reviewCount: integer("review_count").default(0),
  linkedProducts: jsonb("linked_products").default([]), // array of {ingredient: string, productTitle: string, buyLink: string}
  isActive: boolean("is_active").notNull().default(true),
  
  // Scientific Credibility Fields
  scientificSources: jsonb("scientific_sources").default([]), // array of {title, authors, journal, year, pmid, doi, finding}
  contraindications: jsonb("contraindications").default([]), // array of strings - who should NOT use
  drugInteractions: jsonb("drug_interactions").default([]), // array of strings - medication conflicts
  pregnancyWarning: text("pregnancy_warning"), // pregnancy/nursing safety info
  maxDosage: text("max_dosage"), // maximum safe dosage
  evidenceLevel: text("evidence_level").default("traditional"), // "traditional", "preliminary", "clinical", "well-established"
  isExpertVerified: boolean("is_expert_verified").default(false), // verified by qualified expert
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  remedyId: integer("remedy_id").notNull().references(() => remedies.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat sessions and messages for personalized chat history
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(), // Auto-generated summary title
  summary: text("summary"), // Brief summary of the chat topic
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => chatSessions.id),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  badges: jsonb("badges"), // ["organic", "expert-approved", "most-popular", etc.]
  inStock: boolean("in_stock").notNull().default(true),
  stockCount: integer("stock_count").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedRemedies = pgTable("saved_remedies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  remedyId: integer("remedy_id").notNull().references(() => remedies.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customRemedies = pgTable("custom_remedies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ingredients: jsonb("ingredients").notNull(), // array of strings
  benefits: jsonb("benefits").notNull(), // array of strings
  instructions: text("instructions").notNull(),
  form: text("form").notNull(), // "tea", "tincture", "topical", "capsule", etc.
  category: text("category").notNull(), // "digestive", "sleep", "immune", etc.
  symptoms: jsonb("symptoms"), // array of symptoms this was generated for
  generatedFrom: text("generated_from"), // "symptom_finder", "smart_tools", "chat"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  query: text("query").notNull(),
  results: jsonb("results"), // array of remedy IDs and relevance scores
  searchType: text("search_type").notNull(), // "remedy", "symptom", "generate"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "remedy", "article", "expert"
  content: jsonb("content").notNull(), // suggestion data
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  orderNumber: text("order_number").notNull().unique(), // Unique order reference (e.g., "PRX-2025-0001")
  items: jsonb("items").notNull(), // array of {productId, productName, productImage, quantity, price}
  subtotal: real("subtotal").notNull(),
  tax: real("tax").default(0),
  shippingCost: real("shipping_cost").default(0),
  total: real("total").notNull(),
  status: text("status").notNull().default("processing"), // "processing", "shipped", "delivered", "cancelled"
  stripePaymentId: text("stripe_payment_id"),
  paymentMethod: text("payment_method").default("card"), // "card", "paypal", etc.
  shippingAddress: jsonb("shipping_address"), // {name, street, city, state, zip, country}
  trackingNumber: text("tracking_number"),
  shippingProvider: text("shipping_provider"), // "usps", "fedex", "ups", "dhl"
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  statusHistory: jsonb("status_history").default([]), // array of {status, timestamp, note}
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const healthGoals = pgTable("health_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "digestive", "sleep", "immunity", "energy", "weight", "skin", "stress"
  targetValue: real("target_value"), // optional numeric target
  targetUnit: text("target_unit"), // "days", "hours", "kg", "cups", etc.
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high"
  status: text("status").notNull().default("active"), // "active", "paused", "completed", "cancelled"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const healthLogs = pgTable("health_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goalId: integer("goal_id").references(() => healthGoals.id),
  type: text("type").notNull(), // "symptom", "remedy_taken", "mood", "energy", "sleep", "exercise", "meal", "water", "weight"
  value: real("value"), // numeric value if applicable
  unit: text("unit"), // unit of measurement
  notes: text("notes"),
  severity: integer("severity"), // 1-10 scale for symptoms/mood/energy
  tags: jsonb("tags"), // array of strings for categorization
  remedyId: integer("remedy_id").references(() => remedies.id), // if logging remedy usage
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const healthInsights = pgTable("health_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "progress_report", "recommendation", "warning", "achievement"
  title: text("title").notNull(),
  content: text("content").notNull(),
  data: jsonb("data"), // analytical data backing the insight
  category: text("category"), // health category this insight relates to
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high"
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  overallScore: real("overall_score"), // 0-100 calculated health score
  categories: jsonb("categories"), // scores for each health category
  goalsProgress: jsonb("goals_progress"), // progress on active goals
  streaks: jsonb("streaks"), // tracking consecutive days of healthy habits
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "clinic", "pharmacy", "wellness_center", "spa", "gym", "nutrition", "therapy"
  expertise: jsonb("expertise").notNull(), // array of specializations
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("United States"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  profileImageUrl: text("profile_image_url"),
  galleryImages: jsonb("gallery_images"), // array of image URLs
  operatingHours: jsonb("operating_hours"), // business hours structure
  amenities: jsonb("amenities"), // array of amenities/services
  verificationStatus: text("verification_status").notNull().default("pending"), // "pending", "verified", "rejected"
  averageRating: real("average_rating").default(0),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").notNull().default(true),
  ownerId: integer("owner_id").references(() => users.id), // business owner/manager
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businessReviews = pgTable("business_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  visitDate: timestamp("visit_date"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Multi-language support tables
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // "en", "ar", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "hi"
  name: text("name").notNull(), // "English", "العربية", "Español", etc.
  nativeName: text("native_name").notNull(), // Native language name
  flag: text("flag").notNull(), // Flag emoji or icon
  isRtl: boolean("is_rtl").notNull().default(false), // Right-to-left languages
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(), // Unique identifier for the text (e.g., "nav.home", "button.submit")
  languageCode: text("language_code").notNull().references(() => languages.code),
  value: text("value").notNull(), // Translated text
  category: text("category").notNull(), // "navigation", "buttons", "labels", "messages", "content"
  page: text("page"), // Optional page identifier
  context: text("context"), // Additional context for translators
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User language preferences
export const userLanguagePreferences = pgTable("user_language_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For non-logged in users
  languageCode: text("language_code").notNull().references(() => languages.code),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  password: true,
  role: true,
});

export const insertRemedySchema = createInsertSchema(remedies).omit({
  id: true,
  createdAt: true,
  averageRating: true,
  reviewCount: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthGoalSchema = createInsertSchema(healthGoals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertHealthLogSchema = createInsertSchema(healthLogs).omit({
  id: true,
  createdAt: true,
});

export const insertHealthInsightSchema = createInsertSchema(healthInsights).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  averageRating: true,
  reviewCount: true,
});

export const insertBusinessReviewSchema = createInsertSchema(businessReviews).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertCustomRemedySchema = createInsertSchema(customRemedies).omit({
  id: true,
  createdAt: true,
});

// Enhanced User Registration Schemas
export const customerRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100),
  age: z.number().min(13).max(120).optional(),
  location: z.string().optional(),
  healthInterests: z.array(z.string()).optional(),
});

export const expertRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100),
  linkedinUrl: z.string().url().optional(),
  highestDegree: z.string().min(2).max(200),
  fieldOfExpertise: z.string().min(2).max(200),
  businessAddress: z.string().min(5).max(500),
  contactNumber: z.string().min(10).max(20),
  shortBio: z.string().min(50).max(1000),
  profilePictureUrl: z.string().url().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CustomerRegistration = z.infer<typeof customerRegistrationSchema>;
export type ExpertRegistration = z.infer<typeof expertRegistrationSchema>;
export type Remedy = typeof remedies.$inferSelect;
export type InsertRemedy = z.infer<typeof insertRemedySchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SavedRemedy = typeof savedRemedies.$inferSelect;
export type CustomRemedy = typeof customRemedies.$inferSelect;
export type InsertCustomRemedy = z.infer<typeof insertCustomRemedySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type AIsuggestion = typeof aiSuggestions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type HealthGoal = typeof healthGoals.$inferSelect;
export type InsertHealthGoal = z.infer<typeof insertHealthGoalSchema>;
export type HealthLog = typeof healthLogs.$inferSelect;
export type InsertHealthLog = z.infer<typeof insertHealthLogSchema>;
export type HealthInsight = typeof healthInsights.$inferSelect;
export type InsertHealthInsight = z.infer<typeof insertHealthInsightSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type BusinessReview = typeof businessReviews.$inferSelect;
export type InsertBusinessReview = z.infer<typeof insertBusinessReviewSchema>;

// Language and translation insert schemas
export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLanguagePreferenceSchema = createInsertSchema(userLanguagePreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User Preferences Update Schema
export const updateUserPreferencesSchema = z.object({
  // Health & Wellness Preferences
  healthGoals: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  preferredRemedyForms: z.array(z.string()).optional(),
  
  // Notification Preferences
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  newRemedyAlerts: z.boolean().optional(),
  expertTipsEnabled: z.boolean().optional(),
  
  // Accessibility Settings
  textSize: z.enum(["small", "medium", "large", "extra_large"]).optional(),
  highContrast: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  screenReaderOptimized: z.boolean().optional(),
  
  // Personalization
  timezone: z.string().optional(),
  preferredLanguage: z.string().optional(),
  
  // Profile fields
  fullName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().optional(),
  location: z.string().optional(),
  healthInterests: z.array(z.string()).optional(),
});

export type UpdateUserPreferences = z.infer<typeof updateUserPreferencesSchema>;

// Language and translation types
export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type UserLanguagePreference = typeof userLanguagePreferences.$inferSelect;
export type InsertUserLanguagePreference = z.infer<typeof insertUserLanguagePreferenceSchema>;

// User Activity Tracking
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(), // "liked_remedy", "saved_remedy", "created_post", "commented", "created_review", "chat_saved"
  relatedId: integer("related_id"), // ID of the related item (remedy, post, etc.)
  relatedType: text("related_type"), // "remedy", "post", "comment", "chat_session"
  metadata: jsonb("metadata"), // Additional activity data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

// Feedback System
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Optional - for logged-in users
  email: text("email").notNull(),
  name: text("name"), // Optional
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("feedback"), // "feedback", "complaint", "bug_report", "suggestion"
  status: text("status").notNull().default("pending"), // "pending", "reviewed", "resolved"
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high"
  isRead: boolean("is_read").notNull().default(false),
  adminNotes: text("admin_notes"), // Internal notes for admins
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
  isRead: true,
  adminNotes: true,
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// Health Plans Schema for PlanRx Creator
export const healthPlans = pgTable("health_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").notNull(), // diet, workout, skincare, wellness, healing
  title: text("title").notNull(),
  description: text("description"),
  questionsAnswered: json("questions_answered").notNull(), // Store user responses
  generatedContent: json("generated_content").notNull(), // Store the full plan content
  pdfUrl: text("pdf_url"), // Optional: store PDF file path if saved
  status: text("status").default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const healthPlansRelations = relations(healthPlans, ({ one }) => ({
  user: one(users, {
    fields: [healthPlans.userId],
    references: [users.id],
  }),
}));

export const insertHealthPlanSchema = createInsertSchema(healthPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type HealthPlan = typeof healthPlans.$inferSelect;
export type InsertHealthPlan = z.infer<typeof insertHealthPlanSchema>;

// Workout System Tables
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetMuscles: jsonb("target_muscles").notNull(), // ["chest", "shoulders", "triceps"]
  primaryMuscle: text("primary_muscle").notNull(), // "chest"
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  equipment: jsonb("equipment"), // ["dumbbells", "bench", "bodyweight"]
  instructions: jsonb("instructions").notNull(), // step-by-step array
  exercises: jsonb("exercises"), // Array of exercises in the workout bundle
  gifUrl: text("gif_url"), // animated demonstration
  caloriesPerMinute: real("calories_per_minute").default(5), // estimated calories burned
  duration: integer("duration").default(30), // default duration in minutes
  sets: integer("sets").default(3),
  reps: text("reps").default("8-12"), // can be "8-12" or "30 seconds" for time-based
  restTime: integer("rest_time").default(60), // seconds between sets
  tags: jsonb("tags"), // ["strength", "cardio", "flexibility"]
  postWorkoutNutrition: text("post_workout_nutrition"), // What to eat/drink after
  hydration: text("hydration"), // Hydration recommendations
  recoveryTips: text("recovery_tips"), // Recovery advice
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  workoutId: integer("workout_id").references(() => workouts.id),
  duration: integer("duration").notNull(), // actual duration in seconds
  caloriesBurned: real("calories_burned").notNull(),
  completedSets: integer("completed_sets").default(0),
  notes: text("notes"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userWorkoutProgress = pgTable("user_workout_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  muscleGroup: text("muscle_group").notNull(), // "chest", "back", etc.
  lastWorkout: timestamp("last_workout"),
  totalSessions: integer("total_sessions").default(0),
  totalCalories: real("total_calories").default(0),
  totalDuration: integer("total_duration").default(0), // in seconds
  weeklyFrequency: integer("weekly_frequency").default(0),
  strengthLevel: text("strength_level").default("beginner"), // beginner, intermediate, advanced
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workout relations
export const workoutsRelations = relations(workouts, ({ many }) => ({
  sessions: many(workoutSessions),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [workoutSessions.workoutId],
    references: [workouts.id],
  }),
}));

export const userWorkoutProgressRelations = relations(userWorkoutProgress, ({ one }) => ({
  user: one(users, {
    fields: [userWorkoutProgress.userId],
    references: [users.id],
  }),
}));

// Workout schemas
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserWorkoutProgressSchema = createInsertSchema(userWorkoutProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Workout types
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type UserWorkoutProgress = typeof userWorkoutProgress.$inferSelect;
export type InsertUserWorkoutProgress = z.infer<typeof insertUserWorkoutProgressSchema>;

// Store Products table - synced from Shopify automatically
export const storeProducts = pgTable("store_products", {
  id: serial("id").primaryKey(),
  shopifyId: text("shopify_id").notNull().unique(), // Shopify product ID
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").notNull(), // Store as string like "$17.99"
  image: text("image"),
  buyLink: text("buy_link").notNull(),
  handle: text("handle").notNull(), // Shopify handle/slug
  tags: jsonb("tags"), // Product tags for better ingredient matching
  vendor: text("vendor"), // Brand/vendor name
  productType: text("product_type"), // Category from Shopify
  variants: jsonb("variants"), // Store variant info (size, price options)
  isActive: boolean("is_active").notNull().default(true),
  lastSyncedAt: timestamp("last_synced_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Webhook logs for tracking Shopify automatic updates
export const webhookLogs = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // product/create, product/update, product/delete
  shopifyId: text("shopify_id"),
  payload: jsonb("payload").notNull(), // Full webhook payload from Shopify
  processed: boolean("processed").notNull().default(false),
  errorMessage: text("error_message"),
  processingTime: integer("processing_time"), // milliseconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Store products relations
export const storeProductsRelations = relations(storeProducts, ({ many }) => ({
  webhookLogs: many(webhookLogs),
}));

// Store product schemas
export const insertStoreProductSchema = createInsertSchema(storeProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncedAt: true,
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  createdAt: true,
  processed: true,
  processingTime: true,
});

// Store product types
export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertStoreProduct = z.infer<typeof insertStoreProductSchema>;
export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;



// Currency rates table for live exchange rates
export const currencyRates = pgTable("currency_rates", {
  id: serial("id").primaryKey(),
  baseCurrency: text("base_currency").notNull().default("SAR"), // Base currency (SAR)
  targetCurrency: text("target_currency").notNull().unique(), // Target currency (USD, EUR, etc.)
  rate: real("rate").notNull(), // Exchange rate from base to target
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCurrencyRateSchema = createInsertSchema(currencyRates).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// Chat history relations
export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

// Chat history schemas
export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Chat history types
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Currency rate types (moved translation types above to avoid duplicates)

// Currency rate types
export type CurrencyRate = typeof currencyRates.$inferSelect;
export type InsertCurrencyRate = z.infer<typeof insertCurrencyRateSchema>;

// ====================================
// COMMUNITY SOCIAL PLATFORM TABLES
// ====================================

// Community posts table - Reddit/Twitter style posts
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title"), // Optional for questions/discussions
  content: text("content").notNull(),
  postType: text("post_type").notNull(), // "question", "advice", "story", "tip", "discussion"
  category: text("category"), // "nutrition", "exercise", "mental-health", "remedies", "general"
  tags: text("tags").array(), // Searchable tags
  imageUrl: text("image_url"), // Optional image
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  sharesCount: integer("shares_count").default(0).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post likes/reactions
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  reactionType: text("reaction_type").default("like").notNull(), // "like", "helpful", "inspiring"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Post comments - threaded commenting system
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  parentCommentId: integer("parent_comment_id"), // For nested replies - self-reference added later
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comment likes
export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  commentId: integer("comment_id").notNull().references(() => postComments.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User follows system
export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id),
  followingId: integer("following_id").notNull().references(() => users.id),
  status: text("status").default("following").notNull(), // "following", "requested", "blocked"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User profiles enhancement - Additional profile fields for social features
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
  coverImageUrl: text("cover_image_url"),
  healthInterests: text("health_interests").array(), // Areas of health interest
  isPrivate: boolean("is_private").default(false).notNull(),
  allowFollowRequests: boolean("allow_follow_requests").default(true).notNull(),
  showOnlineStatus: boolean("show_online_status").default(true).notNull(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activity feed
export const userActivityFeed = pgTable("user_activity_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  actorId: integer("actor_id").notNull().references(() => users.id), // Who performed the action
  activityType: text("activity_type").notNull(), // "post_like", "comment", "follow", "share", "post_create"
  entityType: text("entity_type").notNull(), // "post", "comment", "user"
  entityId: integer("entity_id").notNull(), // ID of the entity (post, comment, user)
  metadata: jsonb("metadata"), // Additional activity data
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications system
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "like", "comment", "follow", "mention", "system"
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"), // URL to navigate to when clicked
  entityType: text("entity_type"), // "post", "comment", "user"
  entityId: integer("entity_id"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User search history for usernames/profiles
export const userSearchHistory = pgTable("user_search_history", {
  id: serial("id").primaryKey(),
  searcherId: integer("searcher_id").notNull().references(() => users.id),
  searchQuery: text("search_query").notNull(),
  searchType: text("search_type").notNull(), // "username", "display_name", "content", "hashtag"
  resultsCount: integer("results_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Trending topics/hashtags
export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull().unique(),
  postsCount: integer("posts_count").default(0).notNull(),
  engagementScore: real("engagement_score").default(0).notNull(), // Algorithm-based score
  category: text("category"), // "nutrition", "exercise", "mental-health", etc.
  isActive: boolean("is_active").default(true).notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ====================================
// COMMUNITY RELATIONS
// ====================================

// Community posts relations
export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  author: one(users, { fields: [communityPosts.authorId], references: [users.id] }),
  likes: many(postLikes),
  comments: many(postComments),
}));

// Post likes relations
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(communityPosts, { fields: [postLikes.postId], references: [communityPosts.id] }),
}));

// Post comments relations
export const postCommentsRelations = relations(postComments, ({ one, many }) => ({
  post: one(communityPosts, { fields: [postComments.postId], references: [communityPosts.id] }),
  author: one(users, { fields: [postComments.authorId], references: [users.id] }),
  parentComment: one(postComments, { fields: [postComments.parentCommentId], references: [postComments.id] }),
  replies: many(postComments),
  likes: many(commentLikes),
}));

// User follows relations
export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, { fields: [userFollows.followerId], references: [users.id] }),
  following: one(users, { fields: [userFollows.followingId], references: [users.id] }),
}));

// User profiles relations
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

// Enhanced users relations to include community features
export const usersRelationsEnhanced = relations(users, ({ many, one }) => ({
  posts: many(communityPosts),
  postLikes: many(postLikes),
  comments: many(postComments),
  followers: many(userFollows, { relationName: "following" }),
  following: many(userFollows, { relationName: "follower" }),
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  notifications: many(notifications),
  activityFeed: many(userActivityFeed),
}));

// ====================================
// COMMUNITY SCHEMAS & TYPES
// ====================================

// Community post schemas
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  likesCount: true,
  commentsCount: true,
  sharesCount: true,
  viewsCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  createdAt: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  likesCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserFollowSchema = createInsertSchema(userFollows).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Community types
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type UserFollow = typeof userFollows.$inferSelect;
export type InsertUserFollow = z.infer<typeof insertUserFollowSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserNotification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type TrendingTopic = typeof trendingTopics.$inferSelect;

// ====================================
// BLOG SYSTEM TABLES
// ====================================

// Blog posts table for SEO-optimized blog system
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt"), // Short description for list view
  content: text("content").notNull(), // Full HTML content
  category: text("category").default("wellness"), // "fitness", "nutrition", "science", "wellness"
  featuredImage: text("featured_image"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  authorName: text("author_name").default("PlantRx Editorial Team"),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
  tags: text("tags").array().default(sql`ARRAY[]::text[]`),
  highlights: text("highlights").array().default(sql`ARRAY[]::text[]`), // Key highlights for premium layout
  scientificEvidence: text("scientific_evidence").array().default(sql`ARRAY[]::text[]`), // Scientific evidence points
  readingTime: integer("reading_time"), // Estimated reading time in minutes
  viewsCount: integer("views_count").default(0).notNull(), // Total view count for most-clicked
  likesCount: integer("likes_count").default(0).notNull(), // Total likes for most-liked
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog post schema
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Blog post types
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Subscription update schema
export const subscriptionUpdateSchema = z.object({
  subscriptionTier: z.enum(["bronze", "silver", "gold"]),
  subscriptionStatus: z.enum(["active", "canceled", "expired", "trial"]).optional(),
});

export type SubscriptionUpdate = z.infer<typeof subscriptionUpdateSchema>;
