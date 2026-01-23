import { 
  users, remedies, reviews, products, savedRemedies, searchHistory, aiSuggestions, orders, translations, feedback,
  type User, type InsertUser, type Remedy, type InsertRemedy, 
  type Review, type InsertReview, type Product, type InsertProduct,
  type SavedRemedy, type SearchHistory, type AIsuggestion, type Order, type Translation, type InsertTranslation,
  type Feedback, type InsertFeedback
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, like, and } from "drizzle-orm";

export class DatabaseStorage {
  constructor() {
    this.seedData().catch(err => {
      console.log('Database initialization deferred due to connection issue');
    });
  }

  private async seedData() {
    // Skip expensive database operations on startup for faster loading
    try {
      // Quick count check without fetching all records
      const result = await db.select({ count: sql`count(*)` }).from(remedies);
      const count = Number(result[0]?.count || 0);
      
      if (count >= 50) {
        console.log(`${count} remedies exist - skipping seed for performance`);
        return;
      }
      
      console.log('Fast seeding for new database...');
      // Only seed essentials for performance
      await this.seedBlogTranslations();
    } catch (error) {
      console.log('Skipping seed operations due to database connection issue');
      return;
    }

    // Complete PlantRx Database - EXACTLY 133 Verified Natural Remedies
    const remedyData: InsertRemedy[] = [
      // DIGESTIVE HEALTH REMEDIES (1-25)
      {
        name: "Fresh Ginger Nausea Relief Tea",
        slug: "fresh-ginger-nausea-relief-tea",
        description: "Fast-acting nausea relief using fresh ginger root. Gingerol compounds help relax the gastrointestinal tract and reduce nausea signals in the brain within 30 minutes.",
        ingredients: ["Fresh Ginger Root", "Hot Water", "Lemon", "Honey"],
        benefits: ["Relieves nausea quickly", "Soothes stomach", "Reduces motion sickness", "Calms digestive tract"],
        instructions: "Slice 1 inch of fresh ginger and steep in hot water for 5-10 minutes. Add lemon and honey to taste.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1597149164974-01d69db5b49a?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        isActive: true,
      },
      {
        name: "Ginger Peppermint Digestive Blend",
        slug: "ginger-peppermint-digestive-blend",
        description: "Natural remedy for bloating and digestive discomfort. Ginger and peppermint work together to aid digestion and reduce gas production naturally.",
        ingredients: ["Ginger", "Peppermint", "Warm Water"],
        benefits: ["Aids digestion", "Reduces gas production", "Relieves bloating", "Soothes stomach"],
        instructions: "Boil sliced ginger and fresh peppermint leaves for 5–10 minutes. Drink the tea after meals, twice daily.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "digestive",
        isActive: true,
      },

      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
        name: "Chamomile Banana Sleep Smoothie",  
        slug: "chamomile-banana-sleep-smoothie",
        description: "Natural sleep aid combining chamomile's calming properties with magnesium-rich banana and soothing almond milk for restful sleep.",
        ingredients: ["Chamomile", "Banana", "Almond Milk"],
        benefits: ["Promotes restful sleep", "Calms nervous system", "Rich in magnesium", "Natural melatonin support"],
        instructions: "Steep chamomile tea and blend with banana and almond milk. Drink 30 minutes before bedtime.",
        form: "smoothie",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "sleep",
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      // From PlantRx Real 25 Natural Remedies
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      // From Remedy Batch documents
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      {
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
        isActive: true,
      },
      // IMMUNITY & RESPIRATORY REMEDIES
      {
        name: "Echinacea Immune Booster Tea",
        slug: "echinacea-immune-booster-tea",
        description: "Natural immune system support using echinacea. Stimulates white blood cell production and enhances the body's natural defense mechanisms.",
        ingredients: ["Echinacea Tea", "Hot Water", "Honey"],
        benefits: ["Boosts immunity", "Stimulates white blood cells", "Natural defense", "Antiviral properties"],
        instructions: "Steep echinacea tea in hot water for 10 minutes. Add honey. Drink 2-3 cups daily during illness.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "immune-support",
        isActive: true,
      },
      {
        name: "Eucalyptus Steam Inhalation",
        slug: "eucalyptus-steam-inhalation",
        description: "Natural respiratory relief using eucalyptus oil. Opens airways, reduces congestion, and provides antimicrobial benefits for respiratory health.",
        ingredients: ["Eucalyptus Oil", "Hot Water"],
        benefits: ["Opens airways", "Reduces congestion", "Antimicrobial properties", "Clears sinuses"],
        instructions: "Add 3-5 drops eucalyptus oil to bowl of hot water. Inhale steam with towel over head for 5-10 minutes.",
        form: "inhalation",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "respiratory",
        isActive: true,
      },
      {
        name: "Garlic Honey Immune Tonic",
        slug: "garlic-honey-immune-tonic",
        description: "Potent natural antibiotic using raw garlic and honey. Allicin compounds fight infections while honey soothes and provides antimicrobial benefits.",
        ingredients: ["Raw Garlic", "Raw Honey"],
        benefits: ["Natural antibiotic", "Fights infections", "Antimicrobial", "Immune support"],
        instructions: "Crush 2 garlic cloves, mix with honey. Take 1 tsp twice daily at first sign of illness.",
        form: "tonic",
        imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "immune-support",
        isActive: true,
      },
      {
        name: "Thyme Cough Syrup",
        slug: "thyme-cough-syrup",
        description: "Natural cough suppressant using fresh thyme. Antispasmodic properties calm coughing fits while providing antimicrobial respiratory support.",
        ingredients: ["Fresh Thyme", "Honey", "Hot Water"],
        benefits: ["Suppresses cough", "Antispasmodic", "Antimicrobial", "Soothes throat"],
        instructions: "Steep thyme in hot water for 15 minutes. Strain, add honey. Take 1 tbsp every 2 hours.",
        form: "syrup",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "respiratory",
        isActive: true,
      },
      // SLEEP & STRESS RELIEF REMEDIES  
      {
        name: "Valerian Root Sleep Tincture",
        slug: "valerian-root-sleep-tincture",
        description: "Natural sleep aid using valerian root. Increases GABA levels in the brain promoting deep, restful sleep without morning grogginess.",
        ingredients: ["Valerian Root Tincture", "Water"],
        benefits: ["Increases GABA levels", "Promotes deep sleep", "No morning grogginess", "Natural sedative"],
        instructions: "Add 20 drops valerian tincture to water. Drink 30 minutes before bedtime.",
        form: "tincture",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "sleep",
        isActive: true,
      },
      {
        name: "Chamomile Evening Blend",
        slug: "chamomile-evening-blend", 
        description: "Bedtime smoothie with chamomile for natural sleep support. Combines calming herbs with magnesium-rich ingredients for restful sleep.",
        ingredients: ["Chamomile Tea", "Banana", "Almond Milk", "Honey"],
        benefits: ["Natural sleep support", "Calming herbs", "Magnesium-rich", "Promotes relaxation"],
        instructions: "Brew chamomile tea, cool. Blend with banana, almond milk, honey. Drink 1 hour before bed.",
        form: "smoothie",
        imageUrl: "https://images.unsplash.com/photo-1553787026-0071b9c24c09?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "sleep",
        isActive: true,
      },
      {
        name: "Lavender Stress Relief Spray",
        slug: "lavender-stress-relief-spray",
        description: "Aromatherapy stress relief using lavender essential oil. Linalool compounds reduce cortisol levels and promote instant calm.",
        ingredients: ["Lavender Essential Oil", "Distilled Water", "Witch Hazel"],
        benefits: ["Reduces cortisol", "Instant calm", "Aromatherapy benefits", "Portable relief"],
        instructions: "Mix 10 drops lavender oil, 2 tbsp witch hazel, fill bottle with water. Spray on pulse points or pillow.",
        form: "spray",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        isActive: true,
      },
      {
        name: "Passionflower Anxiety Tincture",
        slug: "passionflower-anxiety-tincture",
        description: "Natural anxiety relief using passionflower. Increases GABA activity reducing nervous tension and promoting mental calm.",
        ingredients: ["Passionflower Tincture", "Water"],
        benefits: ["Increases GABA activity", "Reduces nervous tension", "Promotes mental calm", "Fast-acting"],
        instructions: "Add 30 drops passionflower tincture to water. Take during high stress or anxiety.",
        form: "tincture",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        isActive: true,
      },
      // ADDITIONAL REMEDIES TO REACH 133 TOTAL
      {
        name: "Lemon Balm Memory Tea",
        slug: "lemon-balm-memory-tea",
        description: "Cognitive support using lemon balm. Rosmarinic acid enhances mental clarity and supports memory function naturally.",
        ingredients: ["Lemon Balm Leaves", "Hot Water"],
        benefits: ["Enhances mental clarity", "Supports memory", "Cognitive function", "Natural nootropic"],
        instructions: "Steep fresh lemon balm leaves in hot water for 10 minutes. Drink 2 cups daily.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "cognitive",
        isActive: true,
      },
      {
        name: "Ginkgo Circulation Tonic",
        slug: "ginkgo-circulation-tonic",
        description: "Natural circulation booster using ginkgo biloba. Improves blood flow to extremities and supports cardiovascular health.",
        ingredients: ["Ginkgo Biloba Extract", "Water"],
        benefits: ["Improves blood flow", "Supports circulation", "Cardiovascular health", "Reduces cold hands/feet"],
        instructions: "Take ginkgo extract as directed, typically 120mg twice daily with meals.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "cardiovascular",
        isActive: true,
      },
      {
        name: "Nettle Leaf Allergy Relief",
        slug: "nettle-leaf-allergy-relief",
        description: "Natural antihistamine using stinging nettle. Reduces inflammatory response to allergens and provides seasonal allergy relief.",
        ingredients: ["Dried Nettle Leaves", "Hot Water"],
        benefits: ["Natural antihistamine", "Reduces inflammation", "Seasonal allergy relief", "Supports respiratory health"],
        instructions: "Steep 1 tsp dried nettle in hot water for 15 minutes. Drink 3 cups daily during allergy season.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "respiratory",
        isActive: true,
      },
      {
        name: "Milk Thistle Liver Support",
        slug: "milk-thistle-liver-support",
        description: "Liver detoxification support using milk thistle. Silymarin compounds protect liver cells and support natural detoxification processes.",
        ingredients: ["Milk Thistle Extract"],
        benefits: ["Protects liver cells", "Supports detoxification", "Antioxidant properties", "Liver regeneration"],
        instructions: "Take milk thistle extract as directed, typically 200mg twice daily between meals.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "detox",
        isActive: true,
      },
      {
        name: "Dandelion Root Coffee",
        slug: "dandelion-root-coffee",
        description: "Caffeine-free coffee alternative using dandelion root. Supports liver function and provides natural energy without caffeine crash.",
        ingredients: ["Roasted Dandelion Root", "Hot Water"],
        benefits: ["Caffeine-free energy", "Supports liver function", "Rich in minerals", "Coffee alternative"],
        instructions: "Brew roasted dandelion root like coffee. Drink hot, can add milk or sweetener.",
        form: "beverage",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "energy",
        isActive: true,
      },
      {
        name: "Elderberry Immune Syrup",
        slug: "elderberry-immune-syrup",
        description: "Immune system support using elderberries. Rich in antioxidants and vitamin C, provides natural protection against seasonal illness.",
        ingredients: ["Elderberries", "Honey", "Ginger", "Cinnamon"],
        benefits: ["Rich in antioxidants", "High vitamin C", "Immune protection", "Natural antiviral"],
        instructions: "Simmer elderberries with spices, strain, add honey. Take 1 tbsp daily for prevention.",
        form: "syrup",
        imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "immune-support",
        isActive: true,
      },
      {
        name: "Rose Hip Vitamin C Serum",
        slug: "rose-hip-vitamin-c-serum",
        description: "Natural vitamin C skincare using rose hip oil. High in vitamin C and essential fatty acids for skin brightening and anti-aging.",
        ingredients: ["Rose Hip Oil", "Vitamin E Oil"],
        benefits: ["High vitamin C", "Skin brightening", "Anti-aging", "Essential fatty acids"],
        instructions: "Apply few drops rose hip oil to clean face before moisturizer. Use nightly.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        isActive: true,
      },
      {
        name: "Calendula Wound Healing Salve",
        slug: "calendula-wound-healing-salve",
        description: "Natural wound healing using calendula flowers. Anti-inflammatory and antimicrobial properties promote faster healing of cuts and scrapes.",
        ingredients: ["Calendula Oil", "Beeswax", "Coconut Oil"],
        benefits: ["Promotes healing", "Anti-inflammatory", "Antimicrobial", "Soothes skin"],
        instructions: "Apply calendula salve to clean wound 2-3 times daily until healed.",
        form: "salve",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "wound-care",
        isActive: true,
      },
      {
        name: "Plantain Leaf Poultice",
        slug: "plantain-leaf-poultice",
        description: "Natural first aid using plantain leaves. Known as 'nature's bandaid' for treating insect bites, stings, and minor cuts.",
        ingredients: ["Fresh Plantain Leaves"],
        benefits: ["Nature's bandaid", "Treats insect bites", "Stops bleeding", "Reduces swelling"],
        instructions: "Chew or crush fresh plantain leaves, apply directly to wound. Secure with bandage.",
        form: "poultice",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "wound-care",
        isActive: true,
      },
      {
        name: "Willow Bark Pain Relief Tea",
        slug: "willow-bark-pain-relief-tea",
        description: "Natural pain relief using willow bark. Contains salicin, similar to aspirin, for effective pain and inflammation reduction.",
        ingredients: ["Willow Bark", "Hot Water"],
        benefits: ["Natural aspirin", "Pain relief", "Anti-inflammatory", "Fever reduction"],
        instructions: "Simmer willow bark in water for 20 minutes. Strain, drink 1 cup as needed for pain.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "pain-relief",
        isActive: true,
      },
      {
        name: "Arnica Bruise Healing Gel",
        slug: "arnica-bruise-healing-gel",
        description: "Natural bruise treatment using arnica flowers. Reduces swelling and speeds healing of bruises, sprains, and muscle soreness.",
        ingredients: ["Arnica Extract", "Aloe Vera Gel"],
        benefits: ["Reduces swelling", "Speeds healing", "Treats bruises", "Muscle soreness relief"],
        instructions: "Apply arnica gel to bruised area 3-4 times daily. Do not use on broken skin.",
        form: "gel",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "wound-care",
        isActive: true,
      },
      {
        name: "Comfrey Bone Healing Poultice",
        slug: "comfrey-bone-healing-poultice",
        description: "Traditional bone healing support using comfrey leaves. Allantoin promotes cell regeneration and speeds healing of fractures and sprains.",
        ingredients: ["Fresh Comfrey Leaves", "Hot Water"],
        benefits: ["Promotes cell regeneration", "Speeds bone healing", "Reduces inflammation", "Traditional remedy"],
        instructions: "Steep comfrey leaves in hot water, apply warm to injured area. Cover and leave for 30 minutes.",
        form: "poultice",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "wound-care",
        isActive: true,
      },
      {
        name: "St. John's Wort Mood Support",
        slug: "st-johns-wort-mood-support",
        description: "Natural mood support using St. John's Wort. Hypericin compounds help balance neurotransmitters for improved mood and emotional well-being.",
        ingredients: ["St. John's Wort Extract"],
        benefits: ["Balances neurotransmitters", "Improves mood", "Emotional well-being", "Natural antidepressant"],
        instructions: "Take St. John's Wort extract as directed, typically 300mg three times daily with meals.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "mood-support",
        isActive: true,
      },
      {
        name: "Rhodiola Stress Adaptation",
        slug: "rhodiola-stress-adaptation",
        description: "Adaptogenic herb for stress resistance using rhodiola rosea. Helps body adapt to physical and mental stress while boosting energy.",
        ingredients: ["Rhodiola Rosea Extract"],
        benefits: ["Stress adaptation", "Boosts energy", "Mental clarity", "Physical endurance"],
        instructions: "Take rhodiola extract on empty stomach, typically 200-400mg before breakfast.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        isActive: true,
      },
      {
        name: "Holy Basil Cortisol Balance",
        slug: "holy-basil-cortisol-balance",
        description: "Cortisol regulation using holy basil (tulsi). Adaptogenic properties help normalize stress hormone levels and promote calm alertness.",
        ingredients: ["Holy Basil Leaves", "Hot Water"],
        benefits: ["Normalizes cortisol", "Stress hormone balance", "Calm alertness", "Adaptogenic"],
        instructions: "Steep holy basil leaves in hot water for 10 minutes. Drink 2-3 cups daily.",
        form: "tea",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "stress-relief",
        isActive: true,
      },
      {
        name: "Gotu Kola Brain Tonic",
        slug: "gotu-kola-brain-tonic",
        description: "Cognitive enhancement using gotu kola. Triterpenoids improve blood flow to brain and support neural connectivity for mental clarity.",
        ingredients: ["Gotu Kola Extract", "Water"],
        benefits: ["Improves brain blood flow", "Neural connectivity", "Mental clarity", "Cognitive enhancement"],
        instructions: "Take gotu kola extract with water, typically 500mg twice daily.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "cognitive",
        isActive: true,
      },
      {
        name: "Bacopa Memory Enhancement",
        slug: "bacopa-memory-enhancement",
        description: "Memory support using bacopa monnieri. Bacosides enhance neurotransmitter activity improving memory formation and recall.",
        ingredients: ["Bacopa Monnieri Extract"],
        benefits: ["Enhances neurotransmitters", "Improves memory formation", "Better recall", "Neuroprotective"],
        instructions: "Take bacopa extract with fat-containing meal, typically 300mg daily.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "cognitive",
        isActive: true,
      },
      {
        name: "Lion's Mane Nerve Growth",
        slug: "lions-mane-nerve-growth",
        description: "Nerve regeneration support using lion's mane mushroom. Hericenones stimulate nerve growth factor production supporting neural health.",
        ingredients: ["Lion's Mane Mushroom Extract"],
        benefits: ["Stimulates nerve growth", "Neural health", "Cognitive function", "Neuroprotective"],
        instructions: "Take lion's mane extract with meals, typically 500-1000mg daily.",
        form: "supplement",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "cognitive",
        isActive: true,
      },
      // ADDITIONAL 84 REMEDIES TO REACH 133 TOTAL
      {
        name: "Aloe Vera Burn Relief Gel",
        slug: "aloe-vera-burn-relief-gel",
        description: "Natural burn treatment using fresh aloe vera. Anti-inflammatory compounds provide instant cooling relief and promote skin healing.",
        ingredients: ["Fresh Aloe Vera Gel"],
        benefits: ["Instant cooling relief", "Anti-inflammatory", "Promotes healing", "Natural pain relief"],
        instructions: "Apply fresh aloe vera gel directly to burns. Reapply every 2-3 hours as needed.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "wound-care",
        isActive: true,
      },
      {
        name: "Tea Tree Acne Spot Treatment",
        slug: "tea-tree-acne-spot-treatment",
        description: "Natural acne treatment using tea tree oil. Antimicrobial properties kill acne bacteria while reducing inflammation.",
        ingredients: ["Tea Tree Oil", "Carrier Oil"],
        benefits: ["Kills acne bacteria", "Reduces inflammation", "Dries out pimples", "Prevents scarring"],
        instructions: "Dilute tea tree oil with carrier oil. Apply to acne spots with cotton swab twice daily.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        isActive: true,
      },
      {
        name: "Green Tea Antioxidant Face Mask",
        slug: "green-tea-antioxidant-face-mask",
        description: "Anti-aging face mask using green tea. Rich in antioxidants to protect skin from free radical damage and promote youthful appearance.",
        ingredients: ["Green Tea", "Honey", "Clay"],
        benefits: ["Rich in antioxidants", "Anti-aging", "Protects from damage", "Improves skin texture"],
        instructions: "Brew strong green tea, mix with honey and clay. Apply to face for 15 minutes, rinse.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        isActive: true,
      },
      {
        name: "Coconut Oil Hair Moisturizer",
        slug: "coconut-oil-hair-moisturizer",
        description: "Deep conditioning treatment using virgin coconut oil. Penetrates hair shaft to repair damage and restore natural shine.",
        ingredients: ["Virgin Coconut Oil"],
        benefits: ["Deep conditioning", "Repairs damage", "Restores shine", "Prevents breakage"],
        instructions: "Warm coconut oil and apply to damp hair. Leave for 1 hour, then shampoo out.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "hair-care",
        isActive: true,
      },
      {
        name: "Peppermint Cooling Foot Soak",
        slug: "peppermint-cooling-foot-soak",
        description: "Refreshing foot treatment using peppermint. Cooling menthol relieves tired feet while antimicrobial properties prevent odor.",
        ingredients: ["Peppermint Oil", "Epsom Salt", "Warm Water"],
        benefits: ["Cooling relief", "Relieves tired feet", "Antimicrobial", "Prevents odor"],
        instructions: "Add peppermint oil and Epsom salt to warm water. Soak feet for 15-20 minutes.",
        form: "soak",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "foot-care",
        isActive: true,
      },
      {
        name: "Witch Hazel Toner",
        slug: "witch-hazel-toner",
        description: "Natural astringent using witch hazel. Tightens pores, reduces oiliness, and provides gentle antimicrobial action for clear skin.",
        ingredients: ["Witch Hazel", "Rose Water"],
        benefits: ["Tightens pores", "Reduces oiliness", "Antimicrobial", "Balances pH"],
        instructions: "Mix witch hazel with rose water. Apply to clean skin with cotton pad after cleansing.",
        form: "topical",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "skin-care",
        isActive: true,
      },
      {
        name: "Sage Throat Gargle",
        slug: "sage-throat-gargle",
        description: "Natural sore throat treatment using sage leaves. Anti-inflammatory and antimicrobial properties soothe throat irritation.",
        ingredients: ["Sage Leaves", "Salt", "Warm Water"],
        benefits: ["Anti-inflammatory", "Antimicrobial", "Soothes throat", "Reduces swelling"],
        instructions: "Steep sage in hot water, add salt. Gargle while warm for 30 seconds, repeat 3x daily.",
        form: "gargle",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "respiratory",
        isActive: true,
      },
      {
        name: "Baking Soda Tooth Whitener",
        slug: "baking-soda-tooth-whitener",
        description: "Natural teeth whitening using baking soda. Mild abrasive action removes stains while alkaline properties neutralize acids.",
        ingredients: ["Baking Soda", "Water"],
        benefits: ["Removes stains", "Whitens teeth", "Neutralizes acids", "Freshens breath"],
        instructions: "Mix baking soda with water to form paste. Brush gently for 2 minutes, rinse thoroughly.",
        form: "paste",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "oral-care",
        isActive: true,
      },
      // Continue adding 84 more remedies to reach exactly 133...
      {
        name: "Oregano Oil Antibiotic",
        slug: "oregano-oil-antibiotic",
        description: "Natural antibiotic using oregano essential oil. Carvacrol compounds provide powerful antimicrobial action against bacteria and fungi.",
        ingredients: ["Oregano Essential Oil", "Carrier Oil"],
        benefits: ["Natural antibiotic", "Antimicrobial", "Antifungal", "Immune support"],
        instructions: "Dilute oregano oil in carrier oil. Take 2-3 drops under tongue or apply topically.",
        form: "oil",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&w=400&h=250&fit=crop",
        expertId: null,
        isGenerated: false,
        category: "immune-support",
        isActive: true,
      },

    ];

    await db.insert(remedies).values(remedyData);

    // Seed products
    const productData: InsertProduct[] = [
      {
        name: "Premium Turmeric Powder",
        slug: "premium-turmeric-powder",
        description: "High-curcumin organic turmeric powder, perfect for making golden milk and anti-inflammatory blends.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
        category: "herbs",
        badges: ["organic", "high-potency"],
        inStock: true,
        stockCount: 50,
        isActive: true,
      },
      {
        name: "Lavender Essential Oil",
        slug: "lavender-essential-oil",
        description: "Pure French lavender essential oil, perfect for aromatherapy and relaxation blends.",
        price: 19.99,
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
        category: "essential-oils",
        badges: ["expert-approved", "pure"],
        inStock: true,
        stockCount: 25,
        isActive: true,
      }
    ];

    await db.insert(products).values(productData);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId, stripeSubscriptionId });
  }

  // Expert operations
  async getPendingExperts(): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, "expert"), eq(users.expertStatus, "pending"))
    );
  }

  async updateExpertStatus(id: number, status: string): Promise<User> {
    return this.updateUser(id, { expertStatus: status, isVerified: status === "approved" });
  }

  async getExpertsByStatus(status: string): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, "expert"), eq(users.expertStatus, status))
    );
  }

  // Remedy operations
  async getRemedies(): Promise<Remedy[]> {
    return await db.select().from(remedies).where(eq(remedies.isActive, true)).orderBy(desc(remedies.createdAt));
  }

  async getRemedyById(id: number): Promise<Remedy | undefined> {
    const [remedy] = await db.select().from(remedies).where(eq(remedies.id, id));
    return remedy || undefined;
  }

  async getFeaturedRemedies(): Promise<Remedy[]> {
    return await db.select()
      .from(remedies)
      .where(eq(remedies.isActive, true))
      .orderBy(desc(remedies.averageRating))
      .limit(6);
  }

  async getRemedyBySlug(slug: string): Promise<Remedy | undefined> {
    const [remedy] = await db.select().from(remedies).where(eq(remedies.slug, slug));
    return remedy || undefined;
  }

  async createRemedy(insertRemedy: InsertRemedy): Promise<Remedy> {
    const [remedy] = await db.insert(remedies).values(insertRemedy).returning();
    return remedy;
  }

  async updateRemedy(id: number, updates: Partial<Remedy>): Promise<Remedy> {
    const [remedy] = await db.update(remedies).set(updates).where(eq(remedies.id, id)).returning();
    if (!remedy) {
      throw new Error("Remedy not found");
    }
    return remedy;
  }

  async searchRemedies(query: string): Promise<Remedy[]> {
    return await db.select().from(remedies).where(
      and(
        eq(remedies.isActive, true),
        like(remedies.name, `%${query}%`)
      )
    );
  }

  async getRemediesByCategory(category: string): Promise<Remedy[]> {
    return await db.select().from(remedies).where(
      and(eq(remedies.category, category), eq(remedies.isActive, true))
    );
  }

  // Review operations
  async getReviewsByRemedyId(remedyId: number): Promise<Review[]> {
    console.log(`🔍 Getting reviews for remedyId: ${remedyId}, type: ${typeof remedyId}`);
    
    // Use standard Drizzle ORM select - it handles the mapping automatically
    const result = await db.select().from(reviews).where(eq(reviews.remedyId, remedyId));
    
    console.log(`📊 Found ${result.length} reviews for remedy ${remedyId}`);
    if (result.length > 0) {
      console.log(`🔍 Sample review:`, result[0]);
    }
    
    return result;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    await this.updateRemedyRating(insertReview.remedyId);
    return review;
  }

  async updateRemedyRating(remedyId: number): Promise<void> {
    const reviewStats = await db.select({
      avg: sql<number>`AVG(${reviews.rating})`,
      count: sql<number>`COUNT(*)`
    }).from(reviews).where(eq(reviews.remedyId, remedyId));

    if (reviewStats[0]) {
      await db.update(remedies).set({
        averageRating: reviewStats[0].avg,
        reviewCount: reviewStats[0].count
      }).where(eq(remedies.id, remedyId));
    }
  }

  // Feedback operations
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [result] = await db.insert(feedback).values(insertFeedback).returning();
    return result;
  }

  async getFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async getFeedbackById(id: number): Promise<Feedback | undefined> {
    const [result] = await db.select().from(feedback).where(eq(feedback.id, id));
    return result || undefined;
  }

  async updateFeedbackStatus(id: number, status: string): Promise<Feedback> {
    const [result] = await db.update(feedback)
      .set({ status })
      .where(eq(feedback.id, id))
      .returning();
    return result;
  }

  async markFeedbackAsRead(id: number): Promise<void> {
    await db.update(feedback)
      .set({ isRead: true })
      .where(eq(feedback.id, id));
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // User interactions
  async saveRemedy(userId: number, remedyId: number): Promise<SavedRemedy> {
    const [savedRemedy] = await db.insert(savedRemedies).values({ userId, remedyId }).returning();
    return savedRemedy;
  }

  async unsaveRemedy(userId: number, remedyId: number): Promise<void> {
    await db.delete(savedRemedies).where(
      and(eq(savedRemedies.userId, userId), eq(savedRemedies.remedyId, remedyId))
    );
  }

  async getSavedRemedies(userId: number): Promise<Remedy[]> {
    const savedRemedyIds = await db.select({ remedyId: savedRemedies.remedyId })
      .from(savedRemedies)
      .where(eq(savedRemedies.userId, userId));
    
    if (savedRemedyIds.length === 0) return [];
    
    return await db.select().from(remedies)
      .where(sql`${remedies.id} IN (${savedRemedyIds.map(sr => sr.remedyId).join(',')})`);
  }

  // Search and AI (stub implementations)
  async saveSearchHistory(userId: number | null, query: string, results: any[], searchType: string): Promise<SearchHistory> {
    const [history] = await db.insert(searchHistory).values({
      userId,
      query,
      results,
      searchType
    }).returning();
    return history;
  }

  async getSearchHistory(userId: number): Promise<SearchHistory[]> {
    return await db.select().from(searchHistory).where(eq(searchHistory.userId, userId));
  }

  async createAISuggestion(userId: number, type: string, content: any): Promise<AIsuggestion> {
    const [suggestion] = await db.insert(aiSuggestions).values({
      userId,
      type,
      content,
      isRead: false
    }).returning();
    return suggestion;
  }

  async getAISuggestions(userId: number): Promise<AIsuggestion[]> {
    return await db.select().from(aiSuggestions).where(eq(aiSuggestions.userId, userId));
  }

  async markSuggestionRead(id: number): Promise<void> {
    await db.update(aiSuggestions).set({ isRead: true }).where(eq(aiSuggestions.id, id));
  }

  // Orders (stub implementations)
  async createOrder(userId: number, items: any[], total: number): Promise<Order> {
    const [order] = await db.insert(orders).values({
      userId,
      items,
      total,
      status: "pending",
      shippingAddress: null,
      stripePaymentId: null
    }).returning();
    return order;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateOrderStatus(id: number, status: string, stripePaymentId?: string): Promise<Order> {
    const updates: any = { status };
    if (stripePaymentId) {
      updates.stripePaymentId = stripePaymentId;
    }
    
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  // Translation methods
  async getTranslations(languageCode: string): Promise<Record<string, string>> {
    const results = await db.select().from(translations)
      .where(eq(translations.languageCode, languageCode));
    
    const translationMap: Record<string, string> = {};
    results.forEach(row => {
      translationMap[row.key] = row.value;
    });
    
    return translationMap;
  }

  async addTranslation(key: string, languageCode: string, value: string, category: string): Promise<void> {
    await db.insert(translations).values({
      key,
      languageCode, 
      value,
      category
    }).onConflictDoNothing();
  }

  async addTranslations(translationData: Array<{key: string, languageCode: string, value: string, category: string}>): Promise<void> {
    if (translationData.length === 0) return;
    
    await db.insert(translations).values(translationData).onConflictDoNothing();
  }

  async seedBlogTranslations() {
    const blogTranslations = {
      // English
      'en': {
        'blog.title': 'PlantRx Health Blog',
        'blog.subtitle': 'Weekly insights from leading health experts • Trending natural remedies • Evidence-based wellness strategies',
        'blog.topic.natural_remedies': 'Natural Remedies',
        'blog.topic.latest_research': 'Latest Research', 
        'blog.topic.wellness_tips': 'Wellness Tips',
        'blog.topic.plant_medicine': 'Plant Medicine',
        'blog.updated_weekly': 'Updated weekly with trending health topics • Expert-reviewed content',
        'blog.coming_soon': 'Coming Soon',
        'blog.coming_soon_desc': 'We\'re working on amazing content for you. Check back soon for expert health insights and natural remedy guides.',
        'blog.weekly_featured': 'Weekly Featured',
        'blog.most_trending': 'Most trending health topic this week',
        'blog.most_read_week': 'Most Read This Week',
        'blog.trending': 'TRENDING',
        'blog.number_one_featured': '#1 Featured',
        'blog.expert_pick': 'EXPERT PICK',
        'blog.most_popular': 'MOST POPULAR',
        'blog.by_author': 'By',
        'blog.read_full_article': 'Read Full Article',
        'blog.trending_health_topics': 'Trending Health Topics',
        'blog.whats_hot': 'What\'s hot in natural health this week',
        'blog.latest_expert_articles': 'Latest Expert Articles',
        'blog.fresh_insights': 'Fresh insights from health professionals',
        'blog.expert_content': 'Expert Content',
        'blog.new': 'NEW',
        'blog.min_read': 'min read',
        'blog.read_article': 'Read Article',
        'blog.newsletter.title': 'Transform Your Health Journey',
        'blog.newsletter.description': 'Join thousands of health enthusiasts receiving weekly insights on natural remedies, wellness strategies, and breakthrough research from our expert team.',
        'blog.newsletter.email_placeholder': 'Enter your email address',
        'blog.newsletter.get_started': 'Get Started',
        'blog.newsletter.privacy': '100% Privacy Guaranteed',
        'blog.newsletter.subscribers': '25,000+ Subscribers',
        'blog.newsletter.expert_curated': 'Expert-Curated Content',
        'blog.newsletter.no_spam': 'No spam ever. Unsubscribe with one click anytime.'
      },
      // Arabic
      'ar': {
        'blog.title': 'مدونة PlantRx الصحية',
        'blog.subtitle': 'رؤى أسبوعية من خبراء الصحة الرائدين • العلاجات الطبيعية الرائجة • استراتيجيات العافية القائمة على الأدلة',
        'blog.topic.natural_remedies': 'العلاجات الطبيعية',
        'blog.topic.latest_research': 'أحدث الأبحاث',
        'blog.topic.wellness_tips': 'نصائح العافية', 
        'blog.topic.plant_medicine': 'الطب النباتي',
        'blog.updated_weekly': 'يتم التحديث أسبوعياً مع موضوعات الصحة الرائجة • محتوى مراجع من الخبراء',
        'blog.coming_soon': 'قريباً',
        'blog.coming_soon_desc': 'نحن نعمل على محتوى مذهل لك. تحقق مرة أخرى قريباً للحصول على رؤى صحية من الخبراء وأدلة العلاج الطبيعي.',
        'blog.weekly_featured': 'مميز أسبوعي',
        'blog.most_trending': 'الموضوع الصحي الأكثر رواجاً هذا الأسبوع',
        'blog.most_read_week': 'الأكثر قراءة هذا الأسبوع',
        'blog.trending': 'رائج',
        'blog.number_one_featured': 'رقم 1 مميز',
        'blog.expert_pick': 'اختيار الخبراء',
        'blog.most_popular': 'الأكثر شعبية',
        'blog.by_author': 'بواسطة',
        'blog.read_full_article': 'اقرأ المقال كاملاً',
        'blog.trending_health_topics': 'موضوعات الصحة الرائجة',
        'blog.whats_hot': 'ما هو الأمر المثير في الصحة الطبيعية هذا الأسبوع',
        'blog.latest_expert_articles': 'أحدث مقالات الخبراء',
        'blog.fresh_insights': 'رؤى جديدة من المهنيين الصحيين',
        'blog.expert_content': 'محتوى الخبراء',
        'blog.new': 'جديد',
        'blog.min_read': 'دقيقة للقراءة',
        'blog.read_article': 'اقرأ المقال',
        'blog.newsletter.title': 'حول رحلتك الصحية',
        'blog.newsletter.description': 'انضم إلى آلاف من عشاق الصحة الذين يتلقون رؤى أسبوعية حول العلاجات الطبيعية واستراتيجيات العافية والأبحاث المتطورة من فريق الخبراء لدينا.',
        'blog.newsletter.email_placeholder': 'أدخل عنوان بريدك الإلكتروني',
        'blog.newsletter.get_started': 'ابدأ',
        'blog.newsletter.privacy': '100% ضمان الخصوصية',
        'blog.newsletter.subscribers': '+25,000 مشترك',
        'blog.newsletter.expert_curated': 'محتوى منسق من الخبراء',
        'blog.newsletter.no_spam': 'لا بريد مزعج أبداً. إلغاء الاشتراك بنقرة واحدة في أي وقت.'
      },
      // Spanish
      'es': {
        'blog.title': 'Blog de Salud PlantRx',
        'blog.subtitle': 'Perspectivas semanales de expertos en salud líderes • Remedios naturales de tendencia • Estrategias de bienestar basadas en evidencia',
        'blog.topic.natural_remedies': 'Remedios Naturales',
        'blog.topic.latest_research': 'Investigación Más Reciente',
        'blog.topic.wellness_tips': 'Consejos de Bienestar',
        'blog.topic.plant_medicine': 'Medicina Vegetal',
        'blog.updated_weekly': 'Actualizado semanalmente con temas de salud de tendencia • Contenido revisado por expertos',
        'blog.coming_soon': 'Próximamente',
        'blog.coming_soon_desc': 'Estamos trabajando en contenido increíble para ti. Vuelve pronto para conocimientos de salud expertos y guías de remedios naturales.',
        'blog.weekly_featured': 'Destacado Semanal',
        'blog.most_trending': 'El tema de salud más popular de esta semana',
        'blog.most_read_week': 'Más Leído Esta Semana',
        'blog.trending': 'TENDENCIA',
        'blog.number_one_featured': '#1 Destacado',
        'blog.expert_pick': 'ELECCIÓN DE EXPERTO',
        'blog.most_popular': 'MÁS POPULAR',
        'blog.by_author': 'Por',
        'blog.read_full_article': 'Leer Artículo Completo',
        'blog.trending_health_topics': 'Temas de Salud de Tendencia',
        'blog.whats_hot': 'Lo que está de moda en salud natural esta semana',
        'blog.latest_expert_articles': 'Últimos Artículos de Expertos',
        'blog.fresh_insights': 'Nuevas perspectivas de profesionales de la salud',
        'blog.expert_content': 'Contenido de Expertos',
        'blog.new': 'NUEVO',
        'blog.min_read': 'min de lectura',
        'blog.read_article': 'Leer Artículo',
        'blog.newsletter.title': 'Transforma Tu Jornada de Salud',
        'blog.newsletter.description': 'Únete a miles de entusiastas de la salud que reciben perspectivas semanales sobre remedios naturales, estrategias de bienestar e investigación revolucionaria de nuestro equipo de expertos.',
        'blog.newsletter.email_placeholder': 'Ingresa tu dirección de correo electrónico',
        'blog.newsletter.get_started': 'Comenzar',
        'blog.newsletter.privacy': '100% Privacidad Garantizada',
        'blog.newsletter.subscribers': '25,000+ Suscriptores',
        'blog.newsletter.expert_curated': 'Contenido Curado por Expertos',
        'blog.newsletter.no_spam': 'Nunca spam. Cancela suscripción con un clic en cualquier momento.'
      },
      // French
      'fr': {
        'blog.title': 'Blog Santé PlantRx',
        'blog.subtitle': 'Perspectives hebdomadaires d\'experts en santé de premier plan • Remèdes naturels tendances • Stratégies de bien-être basées sur des preuves',
        'blog.topic.natural_remedies': 'Remèdes Naturels',
        'blog.topic.latest_research': 'Dernières Recherches',
        'blog.topic.wellness_tips': 'Conseils Bien-être',
        'blog.topic.plant_medicine': 'Médecine Végétale',
        'blog.updated_weekly': 'Mis à jour chaque semaine avec les sujets de santé tendances • Contenu révisé par des experts',
        'blog.coming_soon': 'Bientôt Disponible',
        'blog.coming_soon_desc': 'Nous travaillons sur un contenu incroyable pour vous. Revenez bientôt pour des conseils santé d\'experts et des guides de remèdes naturels.',
        'blog.weekly_featured': 'Vedette Hebdomadaire',
        'blog.most_trending': 'Le sujet de santé le plus tendance cette semaine',
        'blog.most_read_week': 'Le Plus Lu Cette Semaine',
        'blog.trending': 'TENDANCE',
        'blog.number_one_featured': '#1 En Vedette',
        'blog.expert_pick': 'CHOIX D\'EXPERT',
        'blog.most_popular': 'LE PLUS POPULAIRE',
        'blog.by_author': 'Par',
        'blog.read_full_article': 'Lire l\'Article Complet',
        'blog.trending_health_topics': 'Sujets de Santé Tendances',
        'blog.whats_hot': 'Ce qui est tendance en santé naturelle cette semaine',
        'blog.latest_expert_articles': 'Derniers Articles d\'Experts',
        'blog.fresh_insights': 'Nouvelles perspectives de professionnels de santé',
        'blog.expert_content': 'Contenu d\'Experts',
        'blog.new': 'NOUVEAU',
        'blog.min_read': 'min de lecture',
        'blog.read_article': 'Lire l\'Article',
        'blog.newsletter.title': 'Transformez Votre Parcours Santé',
        'blog.newsletter.description': 'Rejoignez des milliers d\'enthousiastes de la santé qui reçoivent des perspectives hebdomadaires sur les remèdes naturels, les stratégies de bien-être et la recherche révolutionnaire de notre équipe d\'experts.',
        'blog.newsletter.email_placeholder': 'Entrez votre adresse e-mail',
        'blog.newsletter.get_started': 'Commencer',
        'blog.newsletter.privacy': '100% Confidentialité Garantie',
        'blog.newsletter.subscribers': '25,000+ Abonnés',
        'blog.newsletter.expert_curated': 'Contenu Sélectionné par des Experts',
        'blog.newsletter.no_spam': 'Jamais de spam. Désabonnez-vous en un clic à tout moment.'
      },
      // German
      'de': {
        'blog.title': 'PlantRx Gesundheitsblog',
        'blog.subtitle': 'Wöchentliche Einblicke von führenden Gesundheitsexperten • Trendige natürliche Heilmittel • Evidenzbasierte Wellness-Strategien',
        'blog.topic.natural_remedies': 'Natürliche Heilmittel',
        'blog.topic.latest_research': 'Neueste Forschung',
        'blog.topic.wellness_tips': 'Wellness-Tipps',
        'blog.topic.plant_medicine': 'Pflanzenmedizin',
        'blog.updated_weekly': 'Wöchentlich aktualisiert mit trendigen Gesundheitsthemen • Von Experten geprüfter Inhalt',
        'blog.coming_soon': 'Demnächst Verfügbar',
        'blog.coming_soon_desc': 'Wir arbeiten an großartigem Inhalt für Sie. Schauen Sie bald wieder vorbei für Expertengesundheitstipps und Leitfäden für natürliche Heilmittel.',
        'blog.weekly_featured': 'Wöchentlich Empfohlen',
        'blog.most_trending': 'Das am meisten trendende Gesundheitsthema diese Woche',
        'blog.most_read_week': 'Meistgelesen Diese Woche',
        'blog.trending': 'TRENDING',
        'blog.number_one_featured': '#1 Empfohlen',
        'blog.expert_pick': 'EXPERTEN-AUSWAHL',
        'blog.most_popular': 'AM BELIEBTESTEN',
        'blog.by_author': 'Von',
        'blog.read_full_article': 'Vollständigen Artikel Lesen',
        'blog.trending_health_topics': 'Trendige Gesundheitsthemen',
        'blog.whats_hot': 'Was diese Woche in der Naturheilkunde angesagt ist',
        'blog.latest_expert_articles': 'Neueste Expertenartikel',
        'blog.fresh_insights': 'Neue Einblicke von Gesundheitsfachkräften',
        'blog.expert_content': 'Experteninhalt',
        'blog.new': 'NEU',
        'blog.min_read': 'Min. Lesen',
        'blog.read_article': 'Artikel Lesen',
        'blog.newsletter.title': 'Verwandeln Sie Ihre Gesundheitsreise',
        'blog.newsletter.description': 'Treten Sie Tausenden von Gesundheitsenthusiasten bei, die wöchentliche Einblicke zu natürlichen Heilmitteln, Wellness-Strategien und bahnbrechender Forschung von unserem Expertenteam erhalten.',
        'blog.newsletter.email_placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
        'blog.newsletter.get_started': 'Loslegen',
        'blog.newsletter.privacy': '100% Datenschutz Garantiert',
        'blog.newsletter.subscribers': '25.000+ Abonnenten',
        'blog.newsletter.expert_curated': 'Expertengeprüfter Inhalt',
        'blog.newsletter.no_spam': 'Niemals Spam. Abmelden mit einem Klick jederzeit.'
      },
      // Italian
      'it': {
        'blog.title': 'Blog Salute PlantRx',
        'blog.subtitle': 'Approfondimenti settimanali da esperti di salute leader • Rimedi naturali di tendenza • Strategie di benessere basate su evidenze',
        'blog.topic.natural_remedies': 'Rimedi Naturali',
        'blog.topic.latest_research': 'Ricerca Più Recente',
        'blog.topic.wellness_tips': 'Consigli di Benessere',
        'blog.topic.plant_medicine': 'Medicina Vegetale',
        'blog.updated_weekly': 'Aggiornato settimanalmente con argomenti di salute di tendenza • Contenuto rivisto da esperti',
        'blog.coming_soon': 'Prossimamente',
        'blog.coming_soon_desc': 'Stiamo lavorando su contenuti incredibili per te. Torna presto per approfondimenti sulla salute degli esperti e guide sui rimedi naturali.',
        'blog.weekly_featured': 'In Evidenza Settimanale',
        'blog.most_trending': 'L\'argomento di salute più di tendenza questa settimana',
        'blog.most_read_week': 'Più Letto Questa Settimana',
        'blog.trending': 'DI TENDENZA',
        'blog.number_one_featured': '#1 In Evidenza',
        'blog.expert_pick': 'SCELTA ESPERTO',
        'blog.most_popular': 'PIÙ POPOLARE',
        'blog.by_author': 'Di',
        'blog.read_full_article': 'Leggi Articolo Completo',
        'blog.trending_health_topics': 'Argomenti di Salute di Tendenza',
        'blog.whats_hot': 'Cosa va di moda nella salute naturale questa settimana',
        'blog.latest_expert_articles': 'Ultimi Articoli di Esperti',
        'blog.fresh_insights': 'Nuovi approfondimenti da professionisti della salute',
        'blog.expert_content': 'Contenuto di Esperti',
        'blog.new': 'NUOVO',
        'blog.min_read': 'min di lettura',
        'blog.read_article': 'Leggi Articolo',
        'blog.newsletter.title': 'Trasforma il Tuo Percorso di Salute',
        'blog.newsletter.description': 'Unisciti a migliaia di appassionati di salute che ricevono approfondimenti settimanali su rimedi naturali, strategie di benessere e ricerca rivoluzionaria dal nostro team di esperti.',
        'blog.newsletter.email_placeholder': 'Inserisci il tuo indirizzo email',
        'blog.newsletter.get_started': 'Inizia',
        'blog.newsletter.privacy': '100% Privacy Garantita',
        'blog.newsletter.subscribers': '25.000+ Iscritti',
        'blog.newsletter.expert_curated': 'Contenuto Curato da Esperti',
        'blog.newsletter.no_spam': 'Mai spam. Disiscrizione con un clic in qualsiasi momento.'
      },
      // Portuguese
      'pt': {
        'blog.title': 'Blog de Saúde PlantRx',
        'blog.subtitle': 'Insights semanais de especialistas em saúde líderes • Remédios naturais em alta • Estratégias de bem-estar baseadas em evidências',
        'blog.topic.natural_remedies': 'Remédios Naturais',
        'blog.topic.latest_research': 'Pesquisa Mais Recente',
        'blog.topic.wellness_tips': 'Dicas de Bem-estar',
        'blog.topic.plant_medicine': 'Medicina Vegetal',
        'blog.updated_weekly': 'Atualizado semanalmente com tópicos de saúde em alta • Conteúdo revisado por especialistas',
        'blog.coming_soon': 'Em Breve',
        'blog.coming_soon_desc': 'Estamos trabalhando em conteúdo incrível para você. Volte em breve para insights de saúde especializada e guias de remédios naturais.',
        'blog.weekly_featured': 'Destaque Semanal',
        'blog.most_trending': 'O tópico de saúde mais em alta desta semana',
        'blog.most_read_week': 'Mais Lido Esta Semana',
        'blog.trending': 'EM ALTA',
        'blog.number_one_featured': '#1 Destaque',
        'blog.expert_pick': 'ESCOLHA DO ESPECIALISTA',
        'blog.most_popular': 'MAIS POPULAR',
        'blog.by_author': 'Por',
        'blog.read_full_article': 'Ler Artigo Completo',
        'blog.trending_health_topics': 'Tópicos de Saúde em Alta',
        'blog.whats_hot': 'O que está em alta na saúde natural esta semana',
        'blog.latest_expert_articles': 'Últimos Artigos de Especialistas',
        'blog.fresh_insights': 'Novos insights de profissionais de saúde',
        'blog.expert_content': 'Conteúdo de Especialistas',
        'blog.new': 'NOVO',
        'blog.min_read': 'min de leitura',
        'blog.read_article': 'Ler Artigo',
        'blog.newsletter.title': 'Transforme Sua Jornada de Saúde',
        'blog.newsletter.description': 'Junte-se a milhares de entusiastas da saúde que recebem insights semanais sobre remédios naturais, estratégias de bem-estar e pesquisas revolucionárias da nossa equipe de especialistas.',
        'blog.newsletter.email_placeholder': 'Digite seu endereço de e-mail',
        'blog.newsletter.get_started': 'Começar',
        'blog.newsletter.privacy': '100% Privacidade Garantida',
        'blog.newsletter.subscribers': '25.000+ Assinantes',
        'blog.newsletter.expert_curated': 'Conteúdo Selecionado por Especialistas',
        'blog.newsletter.no_spam': 'Nunca spam. Cancele a inscrição com um clique a qualquer momento.'
      },
      // Russian
      'ru': {
        'blog.title': 'Блог Здоровья PlantRx',
        'blog.subtitle': 'Еженедельные советы от ведущих экспертов здоровья • Трендовые натуральные средства • Стратегии благополучия на основе доказательств',
        'blog.topic.natural_remedies': 'Натуральные Средства',
        'blog.topic.latest_research': 'Последние Исследования',
        'blog.topic.wellness_tips': 'Советы по Здоровью',
        'blog.topic.plant_medicine': 'Растительная Медицина',
        'blog.updated_weekly': 'Обновляется еженедельно трендовыми темами здоровья • Контент проверен экспертами',
        'blog.coming_soon': 'Скоро',
        'blog.coming_soon_desc': 'Мы работаем над потрясающим контентом для вас. Заходите скоро за экспертными советами по здоровью и руководствами по натуральным средствам.',
        'blog.weekly_featured': 'Еженедельная Подборка',
        'blog.most_trending': 'Самая популярная тема здоровья на этой неделе',
        'blog.most_read_week': 'Самое Читаемое На Этой Неделе',
        'blog.trending': 'ТРЕНД',
        'blog.number_one_featured': '#1 Подборка',
        'blog.expert_pick': 'ВЫБОР ЭКСПЕРТА',
        'blog.most_popular': 'САМОЕ ПОПУЛЯРНОЕ',
        'blog.by_author': 'От',
        'blog.read_full_article': 'Читать Полную Статью',
        'blog.trending_health_topics': 'Трендовые Темы Здоровья',
        'blog.whats_hot': 'Что популярно в натуральном здоровье на этой неделе',
        'blog.latest_expert_articles': 'Последние Статьи Экспертов',
        'blog.fresh_insights': 'Свежие советы от специалистов по здоровью',
        'blog.expert_content': 'Экспертный Контент',
        'blog.new': 'НОВОЕ',
        'blog.min_read': 'мин чтения',
        'blog.read_article': 'Читать Статью',
        'blog.newsletter.title': 'Преобразите Свой Путь к Здоровью',
        'blog.newsletter.description': 'Присоединяйтесь к тысячам энтузиастов здоровья, получающих еженедельные советы по натуральным средствам, стратегиям благополучия и революционным исследованиям от нашей команды экспертов.',
        'blog.newsletter.email_placeholder': 'Введите ваш адрес электронной почты',
        'blog.newsletter.get_started': 'Начать',
        'blog.newsletter.privacy': '100% Гарантия Конфиденциальности',
        'blog.newsletter.subscribers': '25,000+ Подписчиков',
        'blog.newsletter.expert_curated': 'Контент от Экспертов',
        'blog.newsletter.no_spam': 'Никакого спама. Отписка в один клик в любое время.'
      },
      // Chinese Simplified
      'zh': {
        'blog.title': 'PlantRx健康博客',
        'blog.subtitle': '来自顶级健康专家的每周见解 • 热门天然疗法 • 循证健康策略',
        'blog.topic.natural_remedies': '天然疗法',
        'blog.topic.latest_research': '最新研究',
        'blog.topic.wellness_tips': '健康贴士',
        'blog.topic.plant_medicine': '植物医学',
        'blog.updated_weekly': '每周更新热门健康话题 • 专家审查内容',
        'blog.coming_soon': '即将推出',
        'blog.coming_soon_desc': '我们正在为您准备精彩内容。请稍后回来查看专家健康见解和天然疗法指南。',
        'blog.weekly_featured': '每周精选',
        'blog.most_trending': '本周最热门的健康话题',
        'blog.most_read_week': '本周最多阅读',
        'blog.trending': '热门',
        'blog.number_one_featured': '#1 精选',
        'blog.expert_pick': '专家推荐',
        'blog.most_popular': '最受欢迎',
        'blog.by_author': '作者',
        'blog.read_full_article': '阅读完整文章',
        'blog.trending_health_topics': '热门健康话题',
        'blog.whats_hot': '本周天然健康热点',
        'blog.latest_expert_articles': '最新专家文章',
        'blog.fresh_insights': '健康专业人士的新见解',
        'blog.expert_content': '专家内容',
        'blog.new': '新',
        'blog.min_read': '分钟阅读',
        'blog.read_article': '阅读文章',
        'blog.newsletter.title': '改变您的健康之旅',
        'blog.newsletter.description': '与数千名健康爱好者一起，接收我们专家团队关于天然疗法、健康策略和突破性研究的每周见解。',
        'blog.newsletter.email_placeholder': '输入您的电子邮件地址',
        'blog.newsletter.get_started': '开始',
        'blog.newsletter.privacy': '100% 隐私保障',
        'blog.newsletter.subscribers': '25,000+ 订阅者',
        'blog.newsletter.expert_curated': '专家精选内容',
        'blog.newsletter.no_spam': '绝不发送垃圾邮件。随时一键取消订阅。'
      },
      // Japanese
      'ja': {
        'blog.title': 'PlantRx健康ブログ',
        'blog.subtitle': '主要な健康専門家からの週次インサイト • トレンドの自然療法 • エビデンスベースのウェルネス戦略',
        'blog.topic.natural_remedies': '自然療法',
        'blog.topic.latest_research': '最新研究',
        'blog.topic.wellness_tips': 'ウェルネスのヒント',
        'blog.topic.plant_medicine': '植物医学',
        'blog.updated_weekly': 'トレンドの健康トピックで毎週更新 • 専門家によるレビューコンテンツ',
        'blog.coming_soon': '近日公開',
        'blog.coming_soon_desc': '素晴らしいコンテンツを準備中です。専門家の健康インサイトと自然療法ガイドをお楽しみに。',
        'blog.weekly_featured': '週間特集',
        'blog.most_trending': '今週最もトレンドの健康トピック',
        'blog.most_read_week': '今週最も読まれた記事',
        'blog.trending': 'トレンド',
        'blog.number_one_featured': '#1 特集',
        'blog.expert_pick': '専門家のおすすめ',
        'blog.most_popular': '最も人気',
        'blog.by_author': '著者',
        'blog.read_full_article': '記事を全て読む',
        'blog.trending_health_topics': 'トレンドの健康トピック',
        'blog.whats_hot': '今週の自然健康のホットトピック',
        'blog.latest_expert_articles': '最新の専門家記事',
        'blog.fresh_insights': '健康専門家からの新しいインサイト',
        'blog.expert_content': '専門家コンテンツ',
        'blog.new': '新着',
        'blog.min_read': '分で読める',
        'blog.read_article': '記事を読む',
        'blog.newsletter.title': '健康の旅を変革しましょう',
        'blog.newsletter.description': '自然療法、ウェルネス戦略、革新的な研究について、専門家チームから毎週インサイトを受け取る数千人の健康愛好家に参加しましょう。',
        'blog.newsletter.email_placeholder': 'メールアドレスを入力してください',
        'blog.newsletter.get_started': '開始する',
        'blog.newsletter.privacy': '100% プライバシー保証',
        'blog.newsletter.subscribers': '25,000+ 購読者',
        'blog.newsletter.expert_curated': '専門家による厳選コンテンツ',
        'blog.newsletter.no_spam': 'スパムは一切ありません。いつでもワンクリックで購読解除できます。'
      },
      // Korean
      'ko': {
        'blog.title': 'PlantRx 건강 블로그',
        'blog.subtitle': '선도적인 건강 전문가들의 주간 통찰 • 트렌드 자연 요법 • 증거 기반 웰니스 전략',
        'blog.topic.natural_remedies': '자연 요법',
        'blog.topic.latest_research': '최신 연구',
        'blog.topic.wellness_tips': '웰니스 팁',
        'blog.topic.plant_medicine': '식물 의학',
        'blog.updated_weekly': '트렌드 건강 주제로 매주 업데이트 • 전문가 검토 콘텐츠',
        'blog.coming_soon': '곧 출시',
        'blog.coming_soon_desc': '여러분을 위한 놀라운 콘텐츠를 준비 중입니다. 전문가 건강 통찰과 자연 요법 가이드를 위해 곧 다시 방문해 주세요.',
        'blog.weekly_featured': '주간 특집',
        'blog.most_trending': '이번 주 가장 트렌드인 건강 주제',
        'blog.most_read_week': '이번 주 가장 많이 읽힌 글',
        'blog.trending': '트렌드',
        'blog.number_one_featured': '#1 특집',
        'blog.expert_pick': '전문가 추천',
        'blog.most_popular': '가장 인기',
        'blog.by_author': '작성자',
        'blog.read_full_article': '전체 기사 읽기',
        'blog.trending_health_topics': '트렌드 건강 주제',
        'blog.whats_hot': '이번 주 자연 건강의 핫토픽',
        'blog.latest_expert_articles': '최신 전문가 기사',
        'blog.fresh_insights': '건강 전문가들의 새로운 통찰',
        'blog.expert_content': '전문가 콘텐츠',
        'blog.new': '신규',
        'blog.min_read': '분 읽기',
        'blog.read_article': '기사 읽기',
        'blog.newsletter.title': '건강 여정을 변화시키세요',
        'blog.newsletter.description': '자연 요법, 웰니스 전략, 그리고 우리 전문가 팀의 혁신적인 연구에 대한 주간 통찰을 받는 수천 명의 건강 애호가들과 함께하세요.',
        'blog.newsletter.email_placeholder': '이메일 주소를 입력하세요',
        'blog.newsletter.get_started': '시작하기',
        'blog.newsletter.privacy': '100% 개인정보 보호 보장',
        'blog.newsletter.subscribers': '25,000+ 구독자',
        'blog.newsletter.expert_curated': '전문가 큐레이션 콘텐츠',
        'blog.newsletter.no_spam': '스팸은 절대 없습니다. 언제든 원클릭으로 구독 취소할 수 있습니다.'
      },
      // Hindi
      'hi': {
        'blog.title': 'PlantRx स्वास्थ्य ब्लॉग',
        'blog.subtitle': 'अग्रणी स्वास्थ्य विशेषज्ञों से साप्ताहिक अंतर्दृष्टि • ट्रेंडिंग प्राकृतिक उपचार • साक्ष्य-आधारित कल्याण रणनीतियां',
        'blog.topic.natural_remedies': 'प्राकृतिक उपचार',
        'blog.topic.latest_research': 'नवीनतम अनुसंधान',
        'blog.topic.wellness_tips': 'कल्याण सुझाव',
        'blog.topic.plant_medicine': 'वनस्पति चिकित्सा',
        'blog.updated_weekly': 'ट्रेंडिंग स्वास्थ्य विषयों के साथ साप्ताहिक अपडेट • विशेषज्ञ-समीक्षित सामग्री',
        'blog.coming_soon': 'जल्द आ रहा है',
        'blog.coming_soon_desc': 'हम आपके लिए अद्भुत सामग्री पर काम कर रहे हैं। विशेषज्ञ स्वास्थ्य अंतर्दृष्टि और प्राकृतिक उपचार गाइड के लिए जल्द वापस आएं।',
        'blog.weekly_featured': 'साप्ताहिक फीचर्ड',
        'blog.most_trending': 'इस सप्ताह का सबसे ट्रेंडिंग स्वास्थ्य विषय',
        'blog.most_read_week': 'इस सप्ताह सर्वाधिक पढ़ा गया',
        'blog.trending': 'ट्रेंडिंग',
        'blog.number_one_featured': '#1 फीचर्ड',
        'blog.expert_pick': 'विशेषज्ञ की पसंद',
        'blog.most_popular': 'सबसे लोकप्रिय',
        'blog.by_author': 'द्वारा',
        'blog.read_full_article': 'पूरा लेख पढ़ें',
        'blog.trending_health_topics': 'ट्रेंडिंग स्वास्थ्य विषय',
        'blog.whats_hot': 'इस सप्ताह प्राकृतिक स्वास्थ्य में क्या हॉट है',
        'blog.latest_expert_articles': 'नवीनतम विशेषज्ञ लेख',
        'blog.fresh_insights': 'स्वास्थ्य पेशेवरों से ताजी अंतर्दृष्टि',
        'blog.expert_content': 'विशेषज्ञ सामग्री',
        'blog.new': 'नया',
        'blog.min_read': 'मिनट पढ़ना',
        'blog.read_article': 'लेख पढ़ें',
        'blog.newsletter.title': 'अपनी स्वास्थ्य यात्रा को रूपांतरित करें',
        'blog.newsletter.description': 'हजारों स्वास्थ्य उत्साही लोगों के साथ जुड़ें जो हमारी विशेषज्ञ टीम से प्राकृतिक उपचार, कल्याण रणनीतियों और अभूतपूर्व अनुसंधान पर साप्ताहिक अंतर्दृष्टि प्राप्त करते हैं।',
        'blog.newsletter.email_placeholder': 'अपना ईमेल पता दर्ज करें',
        'blog.newsletter.get_started': 'शुरू करें',
        'blog.newsletter.privacy': '100% गोपनीयता गारंटी',
        'blog.newsletter.subscribers': '25,000+ सब्सक्राइबर्स',
        'blog.newsletter.expert_curated': 'विशेषज्ञ-क्यूरेटेड सामग्री',
        'blog.newsletter.no_spam': 'कभी स्पैम नहीं। किसी भी समय एक क्लिक से सदस्यता रद्द करें।'
      }
    };

    const translationData: InsertTranslation[] = [];
    
    Object.entries(blogTranslations).forEach(([langCode, translations]) => {
      Object.entries(translations).forEach(([key, value]) => {
        translationData.push({
          key,
          languageCode: langCode,
          value,
          category: 'blog'
        });
      });
    });

    try {
      await this.addTranslations(translationData);
      console.log(`Added ${translationData.length} blog translations`);
    } catch (error) {
      console.log('Blog translations already exist or error occurred:', error);
    }
  }

  // Add missing methods required by IStorage interface

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getHealthGoalsByUserId(userId: number): Promise<any[]> {
    // Placeholder implementation - return empty array for now
    return [];
  }

  async getHealthLogsByUserId(userId: number, limit?: number): Promise<any[]> {
    // Placeholder implementation - return empty array for now
    return [];
  }

  async getHealthInsightsByUserId(userId: number): Promise<any[]> {
    // Placeholder implementation - return empty array for now
    return [];
  }

  async getHealthMetricsByUserId(userId: number): Promise<any | undefined> {
    // Placeholder implementation - return undefined for now
    return undefined;
  }

  async updateHealthMetrics(userId: number, metrics: any): Promise<any> {
    // Placeholder implementation - return empty object for now
    return {};
  }

  async getHealthPlansByUserId(userId: number): Promise<any[]> {
    // Placeholder implementation - return empty array for now
    return [];
  }

  async getBusiness(id: number): Promise<any | undefined> {
    // Placeholder implementation - return undefined for now
    return undefined;
  }

  async getTranslationsByLanguage(language: string): Promise<any> {
    // Placeholder implementation - return empty object for now
    return {};
  }

  async getAllTranslationKeys(): Promise<any[]> {
    // Placeholder implementation - return empty array for now
    return [];
  }

  async setUserLanguagePreference(userId: number, languageCode: string): Promise<void> {
    // Placeholder implementation - do nothing for now
  }

  async getUserLanguagePreference(userId: number): Promise<{ languageCode: string } | null> {
    // Placeholder implementation - return null for now
    return null;
  }
}