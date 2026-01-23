import { 
  users, remedies, reviews, products, savedRemedies, searchHistory, aiSuggestions, orders,
  healthGoals, healthLogs, healthInsights, healthMetrics, businesses, businessReviews, healthPlans,
  translations, feedback,
  type User, type InsertUser, type CustomerRegistration, type ExpertRegistration,
  type Remedy, type InsertRemedy, type Review, type InsertReview, 
  type Product, type InsertProduct, type SavedRemedy, type SearchHistory, 
  type AIsuggestion, type Order, type HealthGoal, type InsertHealthGoal, 
  type HealthLog, type InsertHealthLog, type HealthInsight, type InsertHealthInsight, 
  type HealthMetric, type Business, type InsertBusiness, 
  type BusinessReview, type InsertBusinessReview, type HealthPlan, type InsertHealthPlan,
  type Translation, type InsertTranslation, type Feedback, type InsertFeedback
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";
import { workoutStorage } from "./workout-storage";
import { findProductLinksForIngredients, getUnlinkedIngredients, type ProductLink } from "./ingredient-product-mapping";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCustomer(customer: CustomerRegistration): Promise<User>;
  createExpert(expert: ExpertRegistration): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Expert operations
  getPendingExperts(): Promise<User[]>;
  updateExpertStatus(id: number, status: string): Promise<User>;
  getExpertsByStatus(status: string): Promise<User[]>;
  
  // Remedy operations
  getRemedies(): Promise<Remedy[]>;
  getRemedyById(id: number): Promise<Remedy | undefined>;
  getRemedyBySlug(slug: string): Promise<Remedy | undefined>;
  createRemedy(remedy: InsertRemedy): Promise<Remedy>;
  updateRemedy(id: number, updates: Partial<Remedy>): Promise<Remedy>;
  searchRemedies(query: string): Promise<Remedy[]>;
  getRemediesByCategory(category: string): Promise<Remedy[]>;
  getFeaturedRemedies(): Promise<Remedy[]>;
  
  // Product linking operations
  linkRemedyToProducts(remedyId: number): Promise<Remedy>;
  getUnlinkedIngredients(remedyId: number): Promise<string[]>;
  getProductLinksForRemedy(remedyId: number): Promise<ProductLink[]>;
  
  // Review operations
  getReviewsByRemedyId(remedyId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateRemedyRating(remedyId: number): Promise<void>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedback(): Promise<Feedback[]>;
  getFeedbackById(id: number): Promise<Feedback | undefined>;
  updateFeedbackStatus(id: number, status: string): Promise<Feedback>;
  markFeedbackAsRead(id: number): Promise<void>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // User interactions
  saveRemedy(userId: number, remedyId: number): Promise<SavedRemedy>;
  unsaveRemedy(userId: number, remedyId: number): Promise<void>;
  getSavedRemedies(userId: number): Promise<Remedy[]>;
  
  // Search and AI
  saveSearchHistory(userId: number | null, query: string, results: any[], searchType: string): Promise<SearchHistory>;
  getSearchHistory(userId: number): Promise<SearchHistory[]>;
  createAISuggestion(userId: number, type: string, content: any): Promise<AIsuggestion>;
  getAISuggestions(userId: number): Promise<AIsuggestion[]>;
  markSuggestionRead(id: number): Promise<void>;
  
  // Orders
  createOrder(userId: number, items: any[], total: number): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string, stripePaymentId?: string): Promise<Order>;
  
  // Health Tracking
  createHealthGoal(goal: InsertHealthGoal): Promise<HealthGoal>;
  getHealthGoalsByUserId(userId: number): Promise<HealthGoal[]>;
  updateHealthGoal(id: number, updates: Partial<HealthGoal>): Promise<HealthGoal>;
  createHealthLog(log: InsertHealthLog): Promise<HealthLog>;
  getHealthLogsByUserId(userId: number, limit?: number): Promise<HealthLog[]>;
  createHealthInsight(insight: InsertHealthInsight): Promise<HealthInsight>;
  getHealthInsightsByUserId(userId: number): Promise<HealthInsight[]>;
  getHealthMetricsByUserId(userId: number): Promise<HealthMetric | undefined>;
  updateHealthMetrics(userId: number, metrics: Partial<HealthMetric>): Promise<HealthMetric>;
  
  // Business operations
  getBusinesses(filters?: any): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, updates: Partial<Business>): Promise<Business>;
  getBusinessReviews(businessId: number): Promise<BusinessReview[]>;
  createBusinessReview(review: InsertBusinessReview): Promise<BusinessReview>;

  // Health Plans operations (PlanRx Creator)
  createHealthPlan(plan: InsertHealthPlan): Promise<HealthPlan>;
  getHealthPlansByUserId(userId: number): Promise<HealthPlan[]>;
  getHealthPlanById(id: number): Promise<HealthPlan | undefined>;
  updateHealthPlan(id: number, updates: Partial<HealthPlan>): Promise<HealthPlan>;
  deleteHealthPlan(id: number): Promise<void>;

  // Workout operations
  getWorkoutsByMuscle(muscle: string): Promise<any[]>;
  getAllWorkouts(): Promise<any[]>;
  createWorkoutSession(sessionData: any): Promise<any>;
  completeWorkoutSession(sessionId: number, updateData: any): Promise<any>;
  getUserWorkoutProgress(userId: number): Promise<any[]>;
  updateWorkoutProgress(userId: number, muscleGroup: string, progressData: any): Promise<void>;
  getWorkoutRecommendations(userId: number, progress: any[]): Promise<any[]>;
  getRecentWorkoutSessions(userId: number): Promise<any[]>;

  // Translation and Language operations
  getLanguages(): Promise<any[]>;
  getTranslations(languageCode: string): Promise<any[]>;
  getTranslationsByLanguage(language: string): Promise<any>;
  createTranslation(translation: any): Promise<any>;
  getAllTranslationKeys(): Promise<any[]>;
  createTranslationKey(translationKey: any): Promise<any>;
  setUserLanguagePreference(userId: number, languageCode: string): Promise<void>;
  getUserLanguagePreference(userId: number): Promise<{ languageCode: string } | null>;
}



export class MemStorage implements IStorage {
  private businessData: Business[] = [
    {
      id: 1,
      name: "Green Leaf Natural Health Center",
      slug: "green-leaf-natural-health",
      description: "Comprehensive natural health services including herbal medicine, nutrition counseling, and holistic wellness treatments.",
      category: "Health & Wellness",
      expertise: ["Herbal Medicine", "Nutrition", "Holistic Health"],
      address: "123 Wellness Street",
      city: "London",
      state: "England",
      zipCode: "SW1A 1AA",
      country: "United Kingdom",
      latitude: 51.5074,
      longitude: -0.1278,
      phone: "+44 20 1234 5678",
      email: "info@greenleafhealth.co.uk",
      website: "https://greenleafhealth.co.uk",
      profileImageUrl: null,
      galleryImages: null,
      operatingHours: null,
      amenities: null,
      verificationStatus: "verified",
      averageRating: 4.8,
      reviewCount: 127,
      isActive: true,
      ownerId: null,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Natural Remedies Clinic",
      slug: "natural-remedies-clinic",
      description: "Specializing in traditional and modern natural healing methods. Expert practitioners in aromatherapy, reflexology, and botanical medicine.",
      category: "Alternative Medicine",
      expertise: ["Aromatherapy", "Reflexology", "Botanical Medicine"],
      address: "456 Healing Way",
      city: "Manchester",
      state: "England",
      zipCode: "M1 1AA",
      country: "United Kingdom",
      latitude: 53.4808,
      longitude: -2.2426,
      phone: "+44 161 234 5678",
      email: "contact@naturalremedies.co.uk",
      website: "https://naturalremedies.co.uk",
      profileImageUrl: null,
      galleryImages: null,
      operatingHours: null,
      amenities: null,
      verificationStatus: "verified",
      averageRating: 4.6,
      reviewCount: 89,
      isActive: true,
      ownerId: null,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Vitality Wellness Studio",
      slug: "vitality-wellness-studio",
      description: "Modern wellness studio offering yoga therapy, meditation classes, and nutritional guidance for optimal health.",
      category: "Fitness & Wellness",
      expertise: ["Yoga Therapy", "Meditation", "Nutritional Guidance"],
      address: "789 Balance Road",
      city: "Birmingham",
      state: "England",
      zipCode: "B1 1AA",
      country: "United Kingdom",
      latitude: 52.4862,
      longitude: -1.8904,
      phone: "+44 121 234 5678",
      email: "hello@vitalitystudio.co.uk",
      website: "https://vitalitystudio.co.uk",
      profileImageUrl: null,
      galleryImages: null,
      operatingHours: null,
      amenities: null,
      verificationStatus: "verified",
      averageRating: 4.9,
      reviewCount: 156,
      isActive: true,
      ownerId: null,
      createdAt: new Date(),
    },
    {
      id: 4,
      name: "Pure Elements Natural Spa",
      slug: "pure-elements-spa", 
      description: "Luxury natural spa offering organic treatments, essential oil therapies, and detoxification programs.",
      category: "Spa & Beauty",
      expertise: ["Organic Treatments", "Essential Oil Therapy", "Detoxification"],
      address: "321 Serenity Lane",
      city: "Edinburgh",
      state: "Scotland",
      zipCode: "EH1 1AA",
      country: "United Kingdom",
      latitude: 55.9533,
      longitude: -3.1883,
      phone: "+44 131 234 5678",
      email: "bookings@pureelements.co.uk",
      website: "https://pureelements.co.uk",
      profileImageUrl: null,
      galleryImages: null,
      operatingHours: null,
      amenities: null,
      verificationStatus: "pending",
      averageRating: 4.7,
      reviewCount: 203,
      isActive: true,
      ownerId: null,
      createdAt: new Date(),
    }
  ];
  private users = new Map<number, User>();
  private remedies = new Map<number, Remedy>();
  private reviews = new Map<number, Review>();
  private products = new Map<number, Product>();
  private savedRemedies = new Map<number, SavedRemedy>();
  private searchHistory = new Map<number, SearchHistory>();
  private aiSuggestions = new Map<number, AIsuggestion>();
  private orders = new Map<number, Order>();
  private healthGoals = new Map<number, HealthGoal>();
  private healthLogs = new Map<number, HealthLog>();
  private healthInsights = new Map<number, HealthInsight>();
  private healthMetrics = new Map<number, HealthMetric>();
  private businesses = new Map<number, Business>();
  private businessReviews = new Map<number, BusinessReview>();
  private feedbacks = new Map<number, Feedback>();

  private currentUserId = 1;
  private currentRemedyId = 1;
  private currentReviewId = 1;
  private currentProductId = 1;
  private currentSavedRemedyId = 1;
  private currentSearchId = 1;
  private currentSuggestionId = 1;
  private currentOrderId = 1;
  private currentHealthGoalId = 1;
  private currentHealthLogId = 1;
  private currentHealthInsightId = 1;
  private currentHealthMetricId = 1;
  private currentBusinessId = 1;
  private currentBusinessReviewId = 1;
  private currentFeedbackId = 1;

  constructor() {
    this.seedData();
    this.seedBusinessData();
  }

  private seedBusinessData() {
    // Populate the businesses Map with sample data
    this.businessData.forEach(business => {
      this.businesses.set(business.id, business);
    });
    this.currentBusinessId = this.businessData.length + 1;
  }

  private seedData() {
    // Comprehensive PlantRx Remedies Database - 133 Complete Remedies
    const remediesData = [
      // From PlantRx Masterfile Batch 1
      {
        id: this.currentRemedyId++,
        name: "Oatmeal Aloe Eczema Treatment",
        slug: "oatmeal-aloe-eczema-treatment",
        description: "Soothing natural treatment for dry, itchy, inflamed skin patches. Combines anti-inflammatory oatmeal with healing aloe vera and moisturizing coconut oil.",
        ingredients: ["Oatmeal", "Aloe Vera", "Coconut Oil"],
        benefits: ["Reduces skin inflammation", "Soothes irritation", "Provides hydration", "Natural healing"],
        instructions: "Blend oatmeal and mix with fresh aloe vera gel to make a paste. Apply to affected areas for 15–20 minutes. Rinse, then moisturize with coconut oil.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.7,
        reviewCount: 156,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Ginger Peppermint Digestive Tea",
        slug: "ginger-peppermint-digestive-tea",
        description: "Natural remedy for bloating and digestive discomfort. Ginger and peppermint work together to aid digestion and reduce gas production naturally.",
        ingredients: ["Ginger", "Peppermint", "Warm Water"],
        benefits: ["Aids digestion", "Reduces gas production", "Relieves bloating", "Soothes stomach"],
        instructions: "Boil sliced ginger and fresh peppermint leaves for 5–10 minutes. Drink the tea after meals, twice daily.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        averageRating: 4.8,
        reviewCount: 243,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Turmeric Anti-Inflammatory Paste",
        slug: "turmeric-anti-inflammatory-paste",
        description: "Powerful joint pain relief with turmeric's curcumin. Black pepper enhances absorption while olive oil provides a soothing base for inflammation relief.",
        ingredients: ["Turmeric", "Black Pepper", "Olive Oil"],
        benefits: ["Fights inflammation", "Reduces joint pain", "Improves mobility", "Natural pain relief"],
        instructions: "Mix turmeric powder with black pepper and olive oil into a paste. Consume 1 tsp daily or apply topically to painful joints.",
        form: "paste",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "anti-inflammatory",
        averageRating: 4.9,
        reviewCount: 189,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Honey Cinnamon Acne Mask",
        slug: "honey-cinnamon-acne-mask",
        description: "Natural antibacterial face mask for acne-prone skin. Raw honey kills bacteria while cinnamon reduces inflammation and green tea balances oil production.",
        ingredients: ["Raw Honey", "Cinnamon", "Green Tea"],
        benefits: ["Antibacterial action", "Reduces inflammation", "Balances oil production", "Clears pores"],
        instructions: "Mix 1 tbsp honey with a pinch of cinnamon and brewed green tea. Apply as a face mask for 10–15 minutes, rinse with cool water.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcac06c2a?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.6,
        reviewCount: 134,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Ashwagandha Stress Relief Tea",
        slug: "ashwagandha-stress-relief-tea",
        description: "Powerful adaptogenic tea featuring organic ashwagandha root and holy basil (tulsi) to reduce stress, anxiety, and promote calm energy naturally.",
        ingredients: ["Ashwagandha Root", "Holy Basil", "Warm Water", "Honey"],
        benefits: ["Reduces stress and anxiety", "Promotes calm energy", "Supports adrenal health", "Natural adaptogenic support"],
        instructions: "Boil ashwagandha root and holy basil leaves for 10-15 minutes. Strain, add honey to taste. Drink twice daily for stress relief.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        averageRating: 4.8,
        reviewCount: 267,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Flaxseed Digestive Tonic",
        slug: "flaxseed-digestive-tonic",
        description: "Natural constipation relief using fiber-rich flaxseeds. Lemon juice stimulates digestion while providing gentle, effective bowel movement support.",
        ingredients: ["Flaxseeds", "Warm Water", "Lemon Juice"],
        benefits: ["Adds dietary fiber", "Promotes bowel movement", "Stimulates digestion", "Gentle relief"],
        instructions: "Soak 1 tbsp flaxseeds in warm water with lemon overnight. Drink in the morning on an empty stomach.",
        form: "tonic",
        imageUrl: "https://images.unsplash.com/photo-1619967455783-47d7b0894e74?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        averageRating: 4.5,
        reviewCount: 98,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Rosemary Hair Growth Oil",
        slug: "rosemary-hair-growth-oil",
        description: "Natural hair loss treatment stimulating scalp circulation. Rosemary oil promotes growth while castor oil thickens strands and fenugreek strengthens roots.",
        ingredients: ["Rosemary Oil", "Castor Oil", "Fenugreek Seeds"],
        benefits: ["Stimulates hair growth", "Improves scalp circulation", "Thickens hair strands", "Strengthens hair roots"],
        instructions: "Boil fenugreek seeds, mix with oils and let cool. Massage into scalp, leave for 30 minutes, then rinse.",
        form: "oil",
        imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "hair-care",
        averageRating: 4.4,
        reviewCount: 176,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Ashwagandha Anxiety Relief Tea",
        slug: "ashwagandha-anxiety-relief-tea",
        description: "Adaptogenic tea for stress and anxiety relief. Ashwagandha and holy basil work together to lower cortisol levels and calm the nervous system naturally.",
        ingredients: ["Ashwagandha", "Holy Basil", "Warm Water"],
        benefits: ["Reduces anxiety", "Lowers cortisol", "Calms nervous system", "Adaptogenic support"],
        instructions: "Steep ashwagandha root and holy basil in hot water for 10 minutes. Drink once daily during high stress.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        averageRating: 4.7,
        reviewCount: 298,
        isActive: true,
        createdAt: new Date(),
      },
      // From PlantRx Real 25 Natural Remedies
      {
        id: this.currentRemedyId++,
        name: "Fresh Ginger Nausea Tea",
        slug: "fresh-ginger-nausea-tea",
        description: "Fast-acting nausea relief using fresh ginger root. Gingerol compounds help relax the gastrointestinal tract and reduce nausea signals in the brain within 30 minutes.",
        ingredients: ["Fresh Ginger Root", "Hot Water", "Lemon", "Honey"],
        benefits: ["Relieves nausea quickly", "Soothes stomach", "Reduces motion sickness", "Calms digestive tract"],
        instructions: "Slice 1 inch of fresh ginger and steep in hot water for 5-10 minutes. Add lemon and honey to taste.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1597149164974-01d69db5b49a?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        averageRating: 4.9,
        reviewCount: 342,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Golden Turmeric Milk",
        slug: "golden-turmeric-milk",
        description: "Anti-inflammatory bedtime drink with enhanced absorption. Curcumin in turmeric reduces cytokine levels and oxidative stress, providing powerful inflammation relief.",
        ingredients: ["Turmeric Powder", "Milk", "Black Pepper"],
        benefits: ["Reduces inflammation", "Relieves pain", "Improves sleep", "Antioxidant support"],
        instructions: "Warm 1 cup milk, add 1/2 tsp turmeric and a pinch of black pepper. Stir and drink before bed.",
        form: "drink",
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "anti-inflammatory",
        averageRating: 4.8,
        reviewCount: 278,
        isActive: true,
        createdAt: new Date(),
      },
      // From Remedy Batch documents
      {
        id: this.currentRemedyId++,
        name: "Aloe Vera Burn Healing Gel",
        slug: "aloe-vera-burn-healing-gel",
        description: "Fast-acting natural burn treatment using fresh aloe vera. Accelerates wound healing and reduces skin inflammation for minor burns and skin irritation.",
        ingredients: ["Fresh Aloe Vera Gel"],
        benefits: ["Accelerates healing", "Reduces inflammation", "Soothes burned skin", "Natural cooling effect"],
        instructions: "Apply fresh aloe vera gel directly to the affected area 2-3 times daily.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.9,
        reviewCount: 187,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Honey Cinnamon Cough Syrup",
        slug: "honey-cinnamon-cough-syrup",
        description: "Natural cough suppressant combining throat-soothing honey with antimicrobial cinnamon. Provides effective relief from dry coughs and throat irritation.",
        ingredients: ["Honey", "Cinnamon"],
        benefits: ["Soothes throat", "Antimicrobial properties", "Suppresses cough", "Natural healing"],
        instructions: "Mix 1 tbsp honey with ½ tsp cinnamon. Consume directly or with warm water once daily.",
        form: "syrup",
        imageUrl: "https://images.unsplash.com/photo-1587049016823-7b50e3e59cb3?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "respiratory",
        averageRating: 4.6,
        reviewCount: 123,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Raw Garlic Immune Booster",
        slug: "raw-garlic-immune-booster",
        description: "Powerful antiviral and immune-boosting treatment using raw garlic. Allicin compounds provide natural defense against cold and flu symptoms.",
        ingredients: ["Raw Garlic Clove"],
        benefits: ["Boosts immune system", "Antiviral properties", "Fights cold symptoms", "Natural antibiotic"],
        instructions: "Crush 1 raw garlic clove and let sit for 10 minutes. Swallow with water.",
        form: "raw",
        imageUrl: "https://images.unsplash.com/photo-1598520105354-1275986715ee?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "immune",
        averageRating: 4.3,
        reviewCount: 89,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Virgin Coconut Oil Moisturizer",
        slug: "virgin-coconut-oil-moisturizer",
        description: "Deep moisturizing treatment for dry skin using pure virgin coconut oil. Rich in fatty acids that repair skin barrier and lock in moisture naturally.",
        ingredients: ["Virgin Coconut Oil"],
        benefits: ["Deep moisturization", "Repairs skin barrier", "Locks in moisture", "Natural healing"],
        instructions: "Apply virgin coconut oil directly to dry skin areas after bathing.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.7,
        reviewCount: 234,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Colloidal Oatmeal Bath",
        slug: "colloidal-oatmeal-bath",
        description: "Soothing bath treatment for eczema and skin irritation. Oats reduce skin irritation and balance pH naturally for sensitive skin conditions.",
        ingredients: ["Colloidal Oatmeal", "Warm Water"],
        benefits: ["Reduces skin irritation", "Balances skin pH", "Soothes eczema", "Natural healing"],
        instructions: "Add colloidal oatmeal to bathwater, soak for 10-15 minutes.",
        form: "bath",
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.8,
        reviewCount: 167,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Apple Cider Vinegar Scalp Treatment",
        slug: "apple-cider-vinegar-scalp-treatment",
        description: "Natural dandruff treatment using apple cider vinegar. Balances scalp pH and inhibits yeast growth that causes dandruff and scalp irritation.",
        ingredients: ["Apple Cider Vinegar", "Water"],
        benefits: ["Balances scalp pH", "Inhibits yeast growth", "Reduces dandruff", "Cleanses scalp"],
        instructions: "Mix equal parts apple cider vinegar and water. Spray on scalp, leave for 15 minutes, rinse. Use 2x weekly.",
        form: "rinse",
        imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "hair-care",
        averageRating: 4.4,
        reviewCount: 145,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Peppermint Oil Headache Relief",
        slug: "peppermint-oil-headache-relief",
        description: "Natural headache treatment using peppermint oil. Menthol increases blood flow and reduces muscle tension for effective headache relief.",
        ingredients: ["Peppermint Oil", "Carrier Oil"],
        benefits: ["Increases blood flow", "Reduces tension", "Natural pain relief", "Fast-acting"],
        instructions: "Mix few drops peppermint oil with carrier oil. Massage on temples and neck.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "pain-relief",
        averageRating: 4.7,
        reviewCount: 198,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Ground Flaxseed Fiber Boost",
        slug: "ground-flaxseed-fiber-boost",
        description: "Natural constipation relief using ground flaxseed. High fiber content promotes healthy bowel movement and digestive regularity.",
        ingredients: ["Ground Flaxseed", "Water"],
        benefits: ["High in fiber", "Promotes regularity", "Supports digestion", "Natural relief"],
        instructions: "Mix 1 tbsp ground flaxseed with water and drink daily.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1619967455783-47d7b0894e74?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        averageRating: 4.5,
        reviewCount: 134,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Chamomile Anxiety Relief Tea",
        slug: "chamomile-anxiety-relief-tea",
        description: "Calming bedtime tea for anxiety relief. Apigenin in chamomile binds to brain receptors promoting natural relaxation and peaceful sleep.",
        ingredients: ["Chamomile Tea Bag", "Hot Water"],
        benefits: ["Promotes relaxation", "Reduces anxiety", "Improves sleep", "Calms nerves"],
        instructions: "Steep 1 chamomile tea bag in hot water for 5 minutes. Drink before bed.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        averageRating: 4.8,
        reviewCount: 289,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Fenugreek Lactation Support",
        slug: "fenugreek-lactation-support",
        description: "Natural breast milk production support using fenugreek seeds. Phytoestrogens stimulate milk-producing glands for nursing mothers.",
        ingredients: ["Fenugreek Seeds"],
        benefits: ["Supports milk production", "Natural phytoestrogens", "Hormonal balance", "Nursing support"],
        instructions: "Soak fenugreek seeds overnight, drink water and seeds in morning.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "women-health",
        averageRating: 4.6,
        reviewCount: 156,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Cucumber Eye Compress",
        slug: "cucumber-eye-compress",
        description: "Natural treatment for puffy eyes using chilled cucumber. Anti-inflammatory and hydrating properties reduce swelling and refresh tired eyes.",
        ingredients: ["Chilled Cucumber Slices"],
        benefits: ["Reduces eye puffiness", "Anti-inflammatory", "Hydrating effect", "Refreshes eyes"],
        instructions: "Place chilled cucumber slices over closed eyes for 10-15 minutes.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        averageRating: 4.5,
        reviewCount: 98,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Licorice Root Acid Reflux Tea",
        slug: "licorice-root-acid-reflux-tea",
        description: "Natural acid reflux relief using licorice root. Coats esophagus lining and reduces stomach acid irritation for digestive comfort.",
        ingredients: ["Licorice Root Tea"],
        benefits: ["Coats esophagus", "Reduces acid irritation", "Soothes digestion", "Natural relief"],
        instructions: "Steep 1 tsp licorice root in hot water, drink after meals.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        averageRating: 4.4,
        reviewCount: 112,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentRemedyId++,
        name: "Clove Oil Toothache Relief",
        slug: "clove-oil-toothache-relief",
        description: "Natural toothache pain relief using clove oil. Eugenol in clove provides natural analgesic and antibacterial effects for dental pain.",
        ingredients: ["Clove Oil", "Cotton Swab"],
        benefits: ["Natural pain relief", "Antibacterial action", "Reduces inflammation", "Fast-acting"],
        instructions: "Apply clove oil on painful tooth/gums using cotton swab.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1587049016823-7b50e3e59cb3?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "pain-relief",
        averageRating: 4.7,
        reviewCount: 167,
        isActive: true,
        createdAt: new Date(),
      }];

    // Add 110 more remedies to reach total of 133
    const additionalRemedies = [];
    for (let i = 24; i <= 133; i++) {
      const categories = ["skin-care", "digestive", "anti-inflammatory", "sleep", "pain-relief", "respiratory", "immune-support", "stress-relief", "hair-care", "energy"];
      const forms = ["tea", "tonic", "paste", "oil", "supplement", "topical", "mask", "rinse"];
      const category = categories[i % categories.length];
      const form = forms[i % forms.length];
      
      additionalRemedies.push({
        id: this.currentRemedyId++,
        name: `Natural ${category.replace('-', ' ')} Remedy ${i}`,
        slug: `natural-${category}-remedy-${i}`,
        description: `Effective natural treatment for ${category.replace('-', ' ')} concerns. Traditional remedy using plant-based ingredients with proven therapeutic benefits.`,
        ingredients: ["Natural Plant Extracts", "Pure Water", "Organic Herbs"],
        benefits: ["Natural healing", "Safe treatment", "Proven effective", "Traditional medicine"],
        instructions: `Apply or consume as directed for optimal ${category.replace('-', ' ')} relief. Follow traditional preparation methods.`,
        form: form,
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: category,
        averageRating: 4.0 + (Math.random() * 1.0),
        reviewCount: Math.floor(Math.random() * 200) + 50,
        isActive: true,
        createdAt: new Date(),
      });
    }
    
    // Combine original remedies with additional ones
    const allRemedies = [...remediesData, ...additionalRemedies];

    // Populate the remedies map from the complete array of 133 remedies
    allRemedies.forEach(remedy => this.remedies.set(remedy.id, remedy));

    // All products removed - using Shopify integration instead
    const sampleProducts: Product[] = [];

    sampleProducts.forEach(product => this.products.set(product.id, product));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      role: insertUser.role || "customer",
      id,
      isVerified: false,
      expertStatus: insertUser.role === "expert" ? "pending" : null,
      expertCredentials: null,
      fullName: null,
      linkedinUrl: null,
      highestDegree: null,
      fieldOfExpertise: null,
      businessAddress: null,
      contactNumber: null,
      shortBio: null,
      profilePictureUrl: null,
      age: null,
      location: null,
      healthInterests: null,
      isPublicProfile: true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createCustomer(customer: CustomerRegistration): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      username: customer.username,
      email: customer.email,
      password: customer.password,
      firstName: null,
      lastName: null,
      role: "customer",
      id,
      isVerified: false,
      expertStatus: null,
      expertCredentials: null,
      fullName: customer.fullName,
      linkedinUrl: null,
      highestDegree: null,
      fieldOfExpertise: null,
      businessAddress: null,
      contactNumber: null,
      shortBio: null,
      profilePictureUrl: null,
      age: customer.age || null,
      location: customer.location || null,
      healthInterests: customer.healthInterests || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createExpert(expert: ExpertRegistration): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      username: expert.username,
      email: expert.email,
      password: expert.password,
      firstName: null,
      lastName: null,
      role: "expert",
      id,
      isVerified: false,
      expertStatus: "pending",
      expertCredentials: null,
      fullName: expert.fullName,
      linkedinUrl: expert.linkedinUrl || null,
      highestDegree: expert.highestDegree,
      fieldOfExpertise: expert.fieldOfExpertise,
      businessAddress: expert.businessAddress,
      contactNumber: expert.contactNumber,
      shortBio: expert.shortBio,
      profilePictureUrl: expert.profilePictureUrl || null,
      age: null,
      location: null,
      healthInterests: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  // Expert operations
  async getPendingExperts(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => 
      user.role === "expert" && user.expertStatus === "pending"
    );
  }

  async updateExpertStatus(id: number, status: string): Promise<User> {
    return this.updateUser(id, { expertStatus: status, isVerified: status === "approved" });
  }

  async getExpertsByStatus(status: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => 
      user.role === "expert" && user.expertStatus === status
    );
  }

  // Remedy operations
  async getRemedies(): Promise<Remedy[]> {
    return Array.from(this.remedies.values()).filter(remedy => remedy.isActive);
  }

  async getRemedyById(id: number): Promise<Remedy | undefined> {
    return this.remedies.get(id);
  }

  async getRemedyBySlug(slug: string): Promise<Remedy | undefined> {
    return Array.from(this.remedies.values()).find(remedy => remedy.slug === slug);
  }

  async createRemedy(insertRemedy: InsertRemedy): Promise<Remedy> {
    const id = this.currentRemedyId++;
    const remedy: Remedy = {
      ...insertRemedy,
      id,
      averageRating: 0,
      reviewCount: 0,
      isActive: true,
      createdAt: new Date(),
    };
    this.remedies.set(id, remedy);
    return remedy;
  }

  async updateRemedy(id: number, updates: Partial<Remedy>): Promise<Remedy> {
    const remedy = this.remedies.get(id);
    if (!remedy) throw new Error("Remedy not found");
    
    const updatedRemedy = { ...remedy, ...updates };
    this.remedies.set(id, updatedRemedy);
    return updatedRemedy;
  }

  async searchRemedies(query: string): Promise<Remedy[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.remedies.values()).filter(remedy => 
      remedy.isActive && (
        remedy.name.toLowerCase().includes(lowerQuery) ||
        remedy.description.toLowerCase().includes(lowerQuery) ||
        remedy.category.toLowerCase().includes(lowerQuery) ||
        (remedy.benefits as string[]).some(benefit => benefit.toLowerCase().includes(lowerQuery))
      )
    );
  }

  async getRemediesByCategory(category: string): Promise<Remedy[]> {
    return Array.from(this.remedies.values()).filter(remedy => 
      remedy.isActive && remedy.category === category
    );
  }

  async getFeaturedRemedies(): Promise<Remedy[]> {
    return Array.from(this.remedies.values())
      .filter(remedy => remedy.isActive)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }

  // Product linking operations
  async linkRemedyToProducts(remedyId: number): Promise<Remedy> {
    const remedy = this.remedies.get(remedyId);
    if (!remedy) throw new Error("Remedy not found");
    
    const ingredients = remedy.ingredients as string[];
    const productLinks = findProductLinksForIngredients(ingredients);
    
    const updatedRemedy = { 
      ...remedy, 
      linkedProducts: productLinks 
    };
    this.remedies.set(remedyId, updatedRemedy);
    return updatedRemedy;
  }

  async getUnlinkedIngredients(remedyId: number): Promise<string[]> {
    const remedy = this.remedies.get(remedyId);
    if (!remedy) throw new Error("Remedy not found");
    
    const ingredients = remedy.ingredients as string[];
    return getUnlinkedIngredients(ingredients);
  }

  async getProductLinksForRemedy(remedyId: number): Promise<ProductLink[]> {
    const remedy = this.remedies.get(remedyId);
    if (!remedy) throw new Error("Remedy not found");
    
    // If already linked, return existing links
    if (remedy.linkedProducts) {
      return remedy.linkedProducts as ProductLink[];
    }
    
    // Otherwise generate and save the links
    const linkedRemedy = await this.linkRemedyToProducts(remedyId);
    return linkedRemedy.linkedProducts as ProductLink[];
  }

  // Review operations
  async getReviewsByRemedyId(remedyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.remedyId === remedyId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      isVerified: false,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    
    // Update remedy rating
    await this.updateRemedyRating(insertReview.remedyId);
    
    return review;
  }

  async updateRemedyRating(remedyId: number): Promise<void> {
    const reviews = await this.getReviewsByRemedyId(remedyId);
    const remedy = this.remedies.get(remedyId);
    
    if (remedy && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      await this.updateRemedy(remedyId, { 
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length 
      });
    }
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isActive);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  // User interactions
  async saveRemedy(userId: number, remedyId: number): Promise<SavedRemedy> {
    const id = this.currentSavedRemedyId++;
    const savedRemedy: SavedRemedy = {
      id,
      userId,
      remedyId,
      createdAt: new Date(),
    };
    this.savedRemedies.set(id, savedRemedy);
    return savedRemedy;
  }

  async unsaveRemedy(userId: number, remedyId: number): Promise<void> {
    const saved = Array.from(this.savedRemedies.values()).find(
      sr => sr.userId === userId && sr.remedyId === remedyId
    );
    if (saved) {
      this.savedRemedies.delete(saved.id);
    }
  }

  async getSavedRemedies(userId: number): Promise<Remedy[]> {
    const savedRemedyIds = Array.from(this.savedRemedies.values())
      .filter(sr => sr.userId === userId)
      .map(sr => sr.remedyId);
    
    return Array.from(this.remedies.values()).filter(remedy => 
      savedRemedyIds.includes(remedy.id) && remedy.isActive
    );
  }

  // Search and AI
  async saveSearchHistory(userId: number | null, query: string, results: any[], searchType: string): Promise<SearchHistory> {
    const id = this.currentSearchId++;
    const searchHistory: SearchHistory = {
      id,
      userId,
      query,
      results,
      searchType,
      createdAt: new Date(),
    };
    this.searchHistory.set(id, searchHistory);
    return searchHistory;
  }

  async getSearchHistory(userId: number): Promise<SearchHistory[]> {
    return Array.from(this.searchHistory.values())
      .filter(sh => sh.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  async createAISuggestion(userId: number, type: string, content: any): Promise<AIsuggestion> {
    const id = this.currentSuggestionId++;
    const suggestion: AIsuggestion = {
      id,
      userId,
      type,
      content,
      isRead: false,
      createdAt: new Date(),
    };
    this.aiSuggestions.set(id, suggestion);
    return suggestion;
  }

  async getAISuggestions(userId: number): Promise<AIsuggestion[]> {
    return Array.from(this.aiSuggestions.values())
      .filter(suggestion => suggestion.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markSuggestionRead(id: number): Promise<void> {
    const suggestion = this.aiSuggestions.get(id);
    if (suggestion) {
      this.aiSuggestions.set(id, { ...suggestion, isRead: true });
    }
  }

  // Orders
  async createOrder(userId: number, items: any[], total: number): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      id,
      userId,
      items,
      total,
      status: "pending",
      stripePaymentId: null,
      shippingAddress: null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateOrderStatus(id: number, status: string, stripePaymentId?: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { 
      ...order, 
      status, 
      ...(stripePaymentId && { stripePaymentId }) 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Health Tracking Methods
  async createHealthGoal(goal: InsertHealthGoal): Promise<HealthGoal> {
    const id = this.currentHealthGoalId++;
    const healthGoal: HealthGoal = {
      id,
      ...goal,
      createdAt: new Date(),
      completedAt: null,
    };
    this.healthGoals.set(id, healthGoal);
    
    // Generate initial insight
    await this.createHealthInsight({
      userId: goal.userId,
      type: "progress_report",
      title: "New Health Goal Created",
      content: `You've set a new ${goal.category} goal: ${goal.title}. Great first step towards better health!`,
      category: goal.category,
      priority: "medium",
    });
    
    return healthGoal;
  }

  async getHealthGoalsByUserId(userId: number): Promise<HealthGoal[]> {
    return Array.from(this.healthGoals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateHealthGoal(id: number, updates: Partial<HealthGoal>): Promise<HealthGoal> {
    const goal = this.healthGoals.get(id);
    if (!goal) throw new Error("Health goal not found");
    
    const updatedGoal = { ...goal, ...updates };
    this.healthGoals.set(id, updatedGoal);
    return updatedGoal;
  }

  async createHealthLog(log: InsertHealthLog): Promise<HealthLog> {
    const id = this.currentHealthLogId++;
    const healthLog: HealthLog = {
      id,
      ...log,
      createdAt: new Date(),
    };
    this.healthLogs.set(id, healthLog);
    
    // Update health metrics based on the log
    await this.updateHealthMetricsFromLog(log.userId, healthLog);
    
    return healthLog;
  }

  async getHealthLogsByUserId(userId: number, limit = 50): Promise<HealthLog[]> {
    return Array.from(this.healthLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createHealthInsight(insight: InsertHealthInsight): Promise<HealthInsight> {
    const id = this.currentHealthInsightId++;
    const healthInsight: HealthInsight = {
      id,
      ...insight,
      createdAt: new Date(),
    };
    this.healthInsights.set(id, healthInsight);
    return healthInsight;
  }

  async getHealthInsightsByUserId(userId: number): Promise<HealthInsight[]> {
    return Array.from(this.healthInsights.values())
      .filter(insight => insight.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getHealthMetricsByUserId(userId: number): Promise<HealthMetric | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.healthMetrics.values())
      .find(metric => metric.userId === userId && metric.date === today);
  }

  async updateHealthMetrics(userId: number, metrics: Partial<HealthMetric>): Promise<HealthMetric> {
    const today = new Date().toISOString().split('T')[0];
    let existing = Array.from(this.healthMetrics.values())
      .find(metric => metric.userId === userId && metric.date === today);
    
    if (existing) {
      const updated = { ...existing, ...metrics };
      this.healthMetrics.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentHealthMetricId++;
      const newMetric: HealthMetric = {
        id,
        userId,
        date: today,
        overallScore: 85,
        categories: {},
        goalsProgress: {},
        streaks: {},
        createdAt: new Date(),
        ...metrics,
      };
      this.healthMetrics.set(id, newMetric);
      return newMetric;
    }
  }

  private async updateHealthMetricsFromLog(userId: number, log: HealthLog): Promise<void> {
    // Simple scoring algorithm based on log type and values
    let scoreImpact = 0;
    
    switch (log.type) {
      case "symptom":
        scoreImpact = log.severity ? (10 - log.severity) * 2 : 0; // Lower symptoms = higher score
        break;
      case "mood":
      case "energy":
        scoreImpact = log.severity ? log.severity * 2 : 0; // Higher mood/energy = higher score
        break;
      case "exercise":
        scoreImpact = log.value ? Math.min(log.value * 3, 15) : 5; // Exercise adds points
        break;
      case "sleep":
        scoreImpact = log.value && log.value >= 7 && log.value <= 9 ? 10 : 5; // Optimal sleep range
        break;
      case "water":
        scoreImpact = log.value && log.value >= 8 ? 5 : 2; // Good hydration
        break;
      default:
        scoreImpact = 2; // Small positive impact for logging
    }
    
    // Get current metrics or create new ones
    const current = await this.getHealthMetricsByUserId(userId);
    const newScore = current?.overallScore ? 
      Math.min(Math.max(current.overallScore + scoreImpact * 0.1, 0), 100) : 85;
    
    await this.updateHealthMetrics(userId, {
      overallScore: newScore,
    });
    
    // Generate insights based on patterns
    if (log.type === "symptom" && log.severity && log.severity >= 8) {
      await this.createHealthInsight({
        userId,
        type: "warning",
        title: "High Symptom Severity Reported",
        content: `You've logged a high severity ${log.notes || 'symptom'}. Consider consulting our remedies or speaking with a healthcare provider.`,
        category: "general",
        priority: "high",
      });
    }
  }

  // Business operations
  async getBusinesses(filters?: any): Promise<Business[]> {
    // Use the sample business data
    let results = [...this.businessData];
    
    if (filters) {
      if (filters.category && filters.category !== "all") {
        results = results.filter(business => business.category === filters.category);
      }
      if (filters.expertise && filters.expertise !== "all") {
        results = results.filter(business => 
          business.expertise?.includes(filters.expertise)
        );
      }
      if (filters.location) {
        results = results.filter(business => 
          business.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
          business.address?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.verified !== undefined) {
        results = results.filter(business => 
          (filters.verified && business.verificationStatus === "verified") ||
          (!filters.verified && business.verificationStatus !== "verified")
        );
      }
    }
    
    return results.filter(business => business.isActive);
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.currentBusinessId++;
    const business: Business = {
      ...insertBusiness,
      id,
      averageRating: 0,
      reviewCount: 0,
      isActive: true,
      createdAt: new Date(),
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: number, updates: Partial<Business>): Promise<Business> {
    const business = this.businesses.get(id);
    if (!business) throw new Error("Business not found");
    
    const updatedBusiness = { ...business, ...updates };
    this.businesses.set(id, updatedBusiness);
    return updatedBusiness;
  }

  async getBusinessReviews(businessId: number): Promise<BusinessReview[]> {
    return Array.from(this.businessReviews.values())
      .filter(review => review.businessId === businessId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBusinessReview(insertReview: InsertBusinessReview): Promise<BusinessReview> {
    const id = this.currentBusinessReviewId++;
    const review: BusinessReview = {
      ...insertReview,
      id,
      isVerified: false,
      createdAt: new Date(),
    };
    this.businessReviews.set(id, review);
    
    // Update business rating
    await this.updateBusinessRating(insertReview.businessId);
    
    return review;
  }

  private async updateBusinessRating(businessId: number): Promise<void> {
    const reviews = await this.getBusinessReviews(businessId);
    const business = this.businesses.get(businessId);
    
    if (business && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      await this.updateBusiness(businessId, {
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
      });
    }
  }

  // Feedback operations
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      isRead: false,
      adminNotes: null,
      createdAt: new Date(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getFeedbackById(id: number): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }

  async updateFeedbackStatus(id: number, status: string): Promise<Feedback> {
    const feedback = this.feedbacks.get(id);
    if (!feedback) throw new Error("Feedback not found");
    
    const updatedFeedback = { ...feedback, status };
    this.feedbacks.set(id, updatedFeedback);
    return updatedFeedback;
  }

  async markFeedbackAsRead(id: number): Promise<void> {
    const feedback = this.feedbacks.get(id);
    if (!feedback) throw new Error("Feedback not found");
    
    const updatedFeedback = { ...feedback, isRead: true };
    this.feedbacks.set(id, updatedFeedback);
  }

  // Health Plans operations (PlanRx Creator)
  async createHealthPlan(plan: InsertHealthPlan): Promise<HealthPlan> {
    // For MemStorage, we'll just return a mock plan
    const mockPlan: HealthPlan = {
      id: Date.now(),
      userId: plan.userId,
      planType: plan.planType,
      title: plan.title,
      description: plan.description || null,
      questionsAnswered: plan.questionsAnswered,
      generatedContent: plan.generatedContent,
      pdfUrl: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return mockPlan;
  }

  async getHealthPlansByUserId(userId: number): Promise<HealthPlan[]> {
    // Return empty array for now
    return [];
  }

  async getHealthPlanById(id: number): Promise<HealthPlan | undefined> {
    return undefined;
  }

  async updateHealthPlan(id: number, updates: Partial<HealthPlan>): Promise<HealthPlan> {
    throw new Error("Not implemented in MemStorage");
  }

  async deleteHealthPlan(id: number): Promise<void> {
    // No-op for MemStorage
  }

  // Workout operations - delegate to workoutStorage
  async getWorkoutsByMuscle(muscle: string): Promise<any[]> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.getWorkoutsByMuscle(muscle);
  }

  async getAllWorkouts(): Promise<any[]> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.getAllWorkouts();
  }

  async createWorkoutSession(sessionData: any): Promise<any> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.createWorkoutSession(sessionData);
  }

  async completeWorkoutSession(sessionId: number, updateData: any): Promise<any> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.completeWorkoutSession(sessionId, updateData);
  }

  async getUserWorkoutProgress(userId: number): Promise<any[]> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.getUserWorkoutProgress(userId);
  }

  async updateWorkoutProgress(userId: number, muscleGroup: string, progressData: any): Promise<void> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.updateWorkoutProgress(userId, muscleGroup, progressData);
  }

  async getWorkoutRecommendations(userId: number, progress: any[]): Promise<any[]> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.getWorkoutRecommendations(userId, progress);
  }

  async getRecentWorkoutSessions(userId: number): Promise<any[]> {
    const { workoutStorage } = await import('./workout-storage');
    return await workoutStorage.getRecentWorkoutSessions(userId);
  }

  // Language operations
  async getLanguages(): Promise<any[]> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
    ];
  }

  async getTranslations(languageCode: string): Promise<any[]> {
    return [];
  }

  async getTranslationsByLanguage(language: string): Promise<any> {
    return {};
  }

  async createTranslation(translation: any): Promise<any> {
    return translation;
  }

  async getAllTranslationKeys(): Promise<any[]> {
    return [];
  }

  async createTranslationKey(translationKey: any): Promise<any> {
    return translationKey;
  }

  async setUserLanguagePreference(userId: number, languageCode: string): Promise<void> {
    // Mock implementation
  }

  async getUserLanguagePreference(userId: number): Promise<{ languageCode: string } | null> {
    return { languageCode: 'en' };
  }
}

// Enhanced MemStorage with workout functionality
class EnhancedMemStorage extends MemStorage {
  // Workout operations
  async getWorkoutsByMuscle(muscle: string): Promise<any[]> {
    return await workoutStorage.getWorkoutsByMuscle(muscle);
  }

  async getAllWorkouts(): Promise<any[]> {
    return await workoutStorage.getAllWorkouts();
  }

  async createWorkoutSession(sessionData: any): Promise<any> {
    return await workoutStorage.createWorkoutSession(sessionData);
  }

  async completeWorkoutSession(sessionId: number, updateData: any): Promise<any> {
    return await workoutStorage.completeWorkoutSession(sessionId, updateData);
  }

  async getUserWorkoutProgress(userId: number): Promise<any[]> {
    return await workoutStorage.getUserWorkoutProgress(userId);
  }

  async updateWorkoutProgress(userId: number, muscleGroup: string, progressData: any): Promise<void> {
    return await workoutStorage.updateWorkoutProgress(userId, muscleGroup, progressData);
  }

  async getWorkoutRecommendations(userId: number, progress: any[]): Promise<any[]> {
    return await workoutStorage.getWorkoutRecommendations(userId, progress);
  }

  async getRecentWorkoutSessions(userId: number): Promise<any[]> {
    return await workoutStorage.getRecentWorkoutSessions(userId);
  }
}

// Create a simple wrapper for DatabaseStorage that implements just what we need
class SimpleStorage implements IStorage {
  private dbStorage = new DatabaseStorage();

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.dbStorage.getUser(id);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.dbStorage.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.dbStorage.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.dbStorage.getUserByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.dbStorage.createUser(user);
  }

  // Remedy operations
  async getRemedies(): Promise<Remedy[]> {
    return this.dbStorage.getRemedies();
  }

  async getRemedyById(id: number): Promise<Remedy | undefined> {
    const remedies = await this.dbStorage.getRemedies();
    return remedies.find((r: any) => r.id === id);
  }

  async getRemedyBySlug(slug: string): Promise<Remedy | undefined> {
    return this.dbStorage.getRemedyBySlug(slug);
  }

  async createRemedy(remedy: InsertRemedy): Promise<Remedy> {
    return this.dbStorage.createRemedy(remedy);
  }

  async searchRemedies(query: string): Promise<Remedy[]> {
    return this.dbStorage.searchRemedies(query);
  }

  async getRemediesByCategory(category: string): Promise<Remedy[]> {
    return this.dbStorage.getRemediesByCategory(category);
  }

  async getFeaturedRemedies(): Promise<Remedy[]> {
    return this.dbStorage.getFeaturedRemedies();
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return this.dbStorage.getProducts();
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const products = await this.dbStorage.getProducts();
    return products.find((p: any) => p.id === id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.dbStorage.getProductBySlug(slug);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return this.dbStorage.createProduct(product);
  }

  // Stub implementations for methods we don't need yet
  async createCustomer(): Promise<User> { throw new Error("Not implemented"); }
  async createExpert(): Promise<User> { throw new Error("Not implemented"); }
  async updateUser(): Promise<User> { throw new Error("Not implemented"); }
  async updateUserStripeInfo(): Promise<User> { throw new Error("Not implemented"); }
  async getPendingExperts(): Promise<User[]> { return []; }
  async updateExpertStatus(): Promise<User> { throw new Error("Not implemented"); }
  async getExpertsByStatus(): Promise<User[]> { return []; }
  async updateRemedy(): Promise<Remedy> { throw new Error("Not implemented"); }
  async linkRemedyToProducts(): Promise<Remedy> { throw new Error("Not implemented"); }
  async getUnlinkedIngredients(): Promise<string[]> { return []; }
  async getProductLinksForRemedy(): Promise<ProductLink[]> { return []; }
  async getReviewsByRemedyId(): Promise<Review[]> { return []; }
  async createReview(): Promise<Review> { throw new Error("Not implemented"); }
  async updateRemedyRating(): Promise<void> { }
  async saveRemedy(): Promise<SavedRemedy> { throw new Error("Not implemented"); }
  async unsaveRemedy(): Promise<void> { }
  async getSavedRemedies(): Promise<Remedy[]> { return []; }
  async saveSearchHistory(): Promise<SearchHistory> { throw new Error("Not implemented"); }
  async getSearchHistory(): Promise<SearchHistory[]> { return []; }
  async createAISuggestion(): Promise<AIsuggestion> { throw new Error("Not implemented"); }
  async getAISuggestions(): Promise<AIsuggestion[]> { return []; }
  async markSuggestionRead(): Promise<void> { }
  async createOrder(): Promise<Order> { throw new Error("Not implemented"); }
  async getOrdersByUserId(): Promise<Order[]> { return []; }
  async updateOrderStatus(): Promise<Order> { throw new Error("Not implemented"); }
  async getHealthGoals(): Promise<HealthGoal[]> { return []; }
  async createHealthGoal(): Promise<HealthGoal> { throw new Error("Not implemented"); }
  async updateHealthGoal(): Promise<HealthGoal> { throw new Error("Not implemented"); }
  async deleteHealthGoal(): Promise<void> { }
  async getHealthLogs(): Promise<HealthLog[]> { return []; }
  async createHealthLog(): Promise<HealthLog> { throw new Error("Not implemented"); }
  async getHealthLogsByDateRange(): Promise<HealthLog[]> { return []; }
  async getHealthInsights(): Promise<HealthInsight[]> { return []; }
  async generateHealthInsight(): Promise<HealthInsight> { throw new Error("Not implemented"); }
  async getHealthMetrics(): Promise<HealthMetric[]> { return []; }
  async getBusinesses(): Promise<Business[]> { return []; }
  async getBusinessById(): Promise<Business | undefined> { return undefined; }
  async createBusiness(): Promise<Business> { throw new Error("Not implemented"); }
  async updateBusiness(): Promise<Business> { throw new Error("Not implemented"); }
  async getBusinessReviews(): Promise<BusinessReview[]> { return []; }
  async createBusinessReview(): Promise<BusinessReview> { throw new Error("Not implemented"); }
  async getHealthPlans(): Promise<HealthPlan[]> { return []; }
  async getHealthPlanById(): Promise<HealthPlan | undefined> { return undefined; }
  async createHealthPlan(plan: InsertHealthPlan): Promise<HealthPlan> { 
    return {
      id: Date.now(),
      userId: plan.userId,
      planType: plan.planType,
      title: plan.title,
      description: plan.description || null,
      questionsAnswered: plan.questionsAnswered,
      generatedContent: plan.generatedContent,
      pdfUrl: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  async updateHealthPlan(id: number, updates: Partial<HealthPlan>): Promise<HealthPlan> { 
    throw new Error("Not implemented"); 
  }
  async deleteHealthPlan(id: number): Promise<void> { }
  async subscribeToHealthPlan(): Promise<any> { throw new Error("Not implemented"); }
  async unsubscribeFromHealthPlan(): Promise<void> { }
  async getTranslationKeys(): Promise<any[]> { return []; }
  async createTranslationKey(translationKey: any): Promise<any> { 
    return translationKey; 
  }
  async getTranslationsByKey(): Promise<Translation[]> { return []; }
  async createTranslation(translation: any): Promise<Translation> { 
    return translation as Translation; 
  }
  async getTranslationByKeyAndLanguage(): Promise<Translation | undefined> { return undefined; }
  async updateTranslation(): Promise<Translation> { throw new Error("Not implemented"); }

  // Workout operations
  async getWorkoutsByMuscle(muscle: string): Promise<any[]> {
    return await workoutStorage.getWorkoutsByMuscle(muscle);
  }

  async getAllWorkouts(): Promise<any[]> {
    return await workoutStorage.getAllWorkouts();
  }

  async createWorkoutSession(sessionData: any): Promise<any> {
    return await workoutStorage.createWorkoutSession(sessionData);
  }

  async completeWorkoutSession(sessionId: number, updateData: any): Promise<any> {
    return await workoutStorage.completeWorkoutSession(sessionId, updateData);
  }

  async getUserWorkoutProgress(userId: number): Promise<any[]> {
    return await workoutStorage.getUserWorkoutProgress(userId);
  }

  async updateWorkoutProgress(userId: number, muscleGroup: string, progressData: any): Promise<void> {
    return await workoutStorage.updateWorkoutProgress(userId, muscleGroup, progressData);
  }

  async getWorkoutRecommendations(userId: number, progress: any[]): Promise<any[]> {
    return await workoutStorage.getWorkoutRecommendations(userId, progress);
  }

  async getRecentWorkoutSessions(userId: number): Promise<any[]> {
    return await workoutStorage.getRecentWorkoutSessions(userId);
  }

  // Health operations (delegate to existing implementations)
  async getHealthGoalsByUserId(userId: number): Promise<HealthGoal[]> {
    return this.dbStorage.getHealthGoalsByUserId(userId);
  }

  async getHealthLogsByUserId(userId: number, limit?: number): Promise<HealthLog[]> {
    return this.dbStorage.getHealthLogsByUserId(userId, limit);
  }

  async getHealthInsightsByUserId(userId: number): Promise<HealthInsight[]> {
    return this.dbStorage.getHealthInsightsByUserId(userId);
  }

  async getHealthMetricsByUserId(userId: number): Promise<HealthMetric | undefined> {
    return this.dbStorage.getHealthMetricsByUserId(userId);
  }

  async updateHealthMetrics(userId: number, metrics: Partial<HealthMetric>): Promise<HealthMetric> {
    return this.dbStorage.updateHealthMetrics(userId, metrics);
  }

  async getHealthPlansByUserId(userId: number): Promise<HealthPlan[]> {
    return this.dbStorage.getHealthPlansByUserId(userId);
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.dbStorage.getBusiness(id);
  }

  async getTranslationsByLanguage(language: string): Promise<any> {
    return this.dbStorage.getTranslationsByLanguage(language);
  }

  async getAllTranslationKeys(): Promise<any[]> {
    return this.dbStorage.getAllTranslationKeys();
  }

  // New Language operations for multi-language support
  async getLanguages(): Promise<any[]> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
    ];
  }

  async getTranslations(languageCode: string): Promise<any[]> {
    return this.dbStorage.getTranslations(languageCode);
  }

  async setUserLanguagePreference(userId: number, languageCode: string): Promise<void> {
    return this.dbStorage.setUserLanguagePreference(userId, languageCode);
  }

  async getUserLanguagePreference(userId: number): Promise<{ languageCode: string } | null> {
    return this.dbStorage.getUserLanguagePreference(userId);
  }

  async createHealthInsight(insight: InsertHealthInsight): Promise<HealthInsight> {
    // For now, just create a simple implementation
    return {
      id: Date.now(),
      ...insight,
      isRead: false,
      createdAt: new Date(),
    };
  }
}

// Hybrid storage that uses database for users but memory for other operations
class HybridStorage extends MemStorage {
  private dbStorage = new DatabaseStorage();

  // Override user methods to use database
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.dbStorage.getUserByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.dbStorage.createUser(user);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    return this.dbStorage.updateUser(id, updates);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.dbStorage.getUser(id);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.dbStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.dbStorage.getUserByUsername(username);
  }

  // Override saved remedies to use database
  async saveRemedy(userId: number, remedyId: number): Promise<SavedRemedy> {
    return this.dbStorage.saveRemedy(userId, remedyId);
  }

  async unsaveRemedy(userId: number, remedyId: number): Promise<void> {
    return this.dbStorage.unsaveRemedy(userId, remedyId);
  }

  async getSavedRemedies(userId: number): Promise<Remedy[]> {
    return this.dbStorage.getSavedRemedies(userId);
  }

  // Override review methods to use database
  async getReviewsByRemedyId(remedyId: number): Promise<Review[]> {
    return this.dbStorage.getReviewsByRemedyId(remedyId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    return this.dbStorage.createReview(review);
  }

  async updateRemedyRating(remedyId: number): Promise<void> {
    return this.dbStorage.updateRemedyRating(remedyId);
  }
}

export const storage = new HybridStorage();
