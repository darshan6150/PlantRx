import PDFDocument from 'pdfkit';

interface UserProfile {
  name: string;
  age?: string;
  gender?: string;
  goals?: string[];
  healthConcerns?: string[];
  experience?: string;
  preferences?: string[];
  lifestyle?: string;
  duration?: string;
  [key: string]: any;
}

export async function generatePremiumPDF(
  type: string, 
  userProfile: UserProfile, 
  answers: any = {}
): Promise<Buffer> {
  
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `${userProfile.name}'s ${type.charAt(0).toUpperCase() + type.slice(1)} Transformation Guide`,
          Author: 'PlantRx Expert Health Platform',
          Subject: `Personalized ${userProfile.duration || '1 month'} ${type} transformation plan`,
          Keywords: `${type}, personalized, health, wellness, transformation`,
        },
        bufferPages: true
      });
      
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Generate comprehensive content based on user data
      generateDetailedContent(doc, type, userProfile, answers);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generateDetailedContent(
  doc: PDFKit.PDFDocument, 
  type: string, 
  userProfile: UserProfile, 
  answers: any
) {
  const planTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Transformation Guide`;
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // PREMIUM COVER PAGE
  addPremiumCover(doc, planTitle, userName, userProfile, currentDate);
  
  // PERSONALIZED INTRODUCTION
  doc.addPage();
  addPersonalizedIntroduction(doc, userName, type, userProfile, answers);
  
  // DETAILED ASSESSMENT AND PERSONALIZED RECOMMENDATIONS
  doc.addPage();
  addDetailedAssessment(doc, userName, type, userProfile, answers);
  
  // COMPREHENSIVE DAILY PROTOCOL
  doc.addPage();
  addDailyProtocol(doc, type, userProfile, answers);
  
  // DETAILED NUTRITION PLAN WITH SPECIFIC FOODS
  doc.addPage();
  addDetailedNutritionPlan(doc, type, userProfile, answers);
  
  // EXERCISE AND MOVEMENT PLAN
  doc.addPage();
  addExercisePlan(doc, type, userProfile, answers);
  
  // SUPPLEMENT RECOMMENDATIONS
  doc.addPage();
  addSupplementRecommendations(doc, type, userProfile, answers);
  
  // COMPREHENSIVE SHOPPING LISTS
  doc.addPage();
  addShoppingLists(doc, type, userProfile, answers);
  
  // PROGRESS TRACKING SYSTEM
  doc.addPage();
  addProgressTracking(doc, type, userProfile, answers);
  
  // TROUBLESHOOTING AND SOLUTIONS
  doc.addPage();
  addTroubleshooting(doc, type, userProfile, answers);
  
  // MEAL PLANS AND RECIPES
  doc.addPage();
  addMealPlansAndRecipes(doc, type, userProfile, answers);
  
  // ADVANCED OPTIMIZATION STRATEGIES
  doc.addPage();
  addAdvancedStrategies(doc, type, userProfile, answers);
  
  // Add page numbers
  addPageNumbers(doc);
}

function addPremiumCover(
  doc: PDFKit.PDFDocument, 
  planTitle: string, 
  userName: string,
  userProfile: UserProfile, 
  currentDate: string
) {
  // Background gradient effect
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#f8fafc');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Natural Health Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title
  doc.fontSize(44)
     .fillColor('#1f2937')
     .font('Helvetica-Bold')
     .text(planTitle, 50, 180, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text(`Personalized for ${userName}`, 50, 240, { width: 495, align: 'center' });
  
  doc.fontSize(18)
     .fillColor('#374151')
     .font('Helvetica')
     .text(`${userProfile.duration || '1 Month'} • ${userProfile.experience || 'Beginner'} Level`, 50, 275, { width: 495, align: 'center' });
  
  // User details box
  const boxY = 320;
  doc.rect(70, boxY, 475, 150)
     .fillAndStroke('#f3f4f6', '#d1d5db');
  
  doc.fontSize(16)
     .fillColor('#1f2937')
     .font('Helvetica-Bold')
     .text('Your Personal Plan Details:', 90, boxY + 20);
  
  doc.fontSize(12)
     .fillColor('#374151')
     .font('Helvetica');
     
  let yPos = boxY + 50;
  
  doc.text(`Created: ${currentDate}`, 90, yPos);
  yPos += 18;
  
  doc.text(`Duration: ${userProfile.duration || '1 Month'}`, 90, yPos);
  yPos += 18;
  
  if (userProfile.experience) {
    doc.text(`Experience Level: ${userProfile.experience}`, 90, yPos);
    yPos += 18;
  }
  
  if (userProfile.goals && userProfile.goals.length > 0) {
    doc.text(`Primary Goals: ${userProfile.goals.slice(0, 2).join(', ')}`, 90, yPos);
    yPos += 18;
  }
  
  if (userProfile.age) {
    doc.text(`Age Group: ${userProfile.age}`, 90, yPos);
    yPos += 18;
  }
  
  // Professional disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized guide is based on your specific responses and health goals.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Please consult with healthcare professionals before making significant changes.', 50, 670, { width: 495, align: 'center' });
}

function addPersonalizedIntroduction(
  doc: PDFKit.PDFDocument,
  userName: string,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, `Welcome ${userName}!`);
  
  const goalText = userProfile.goals?.length ? userProfile.goals[0] : 'better health';
  const experienceText = userProfile.experience || 'starting your journey';
  const durationText = userProfile.duration || '1 month';
  
  const introContent = `Dear ${userName},

Congratulations on taking this important step toward your ${type} transformation! This comprehensive guide has been specifically created based on your personal responses, health goals, and lifestyle preferences.

**Your Personal Profile Summary:**
• Primary Goal: ${goalText}
• Experience Level: ${experienceText} 
• Program Duration: ${durationText}
• Lifestyle: ${userProfile.lifestyle || 'Moderate activity'}

**What Makes This Guide Special:**
This isn't a generic plan - every recommendation, meal suggestion, exercise routine, and strategy has been selected specifically for YOUR unique situation. Based on your responses, we've identified that you're looking to ${goalText.toLowerCase()}, and we've designed every aspect of this program to help you achieve exactly that.

**Your Success Roadmap:**
Over the next ${durationText}, you'll follow a proven system that has helped thousands of people achieve lasting transformation. This guide includes:

• Personalized daily schedules that fit your lifestyle
• Specific food recommendations based on your preferences  
• Exercise routines matched to your current fitness level
• Shopping lists with exact products and brands
• Progress tracking methods that keep you motivated
• Troubleshooting solutions for common challenges

**Getting Started:**
Your transformation begins today. Each section of this guide builds upon the previous one, creating a comprehensive system for lasting change. Take time to read through each section carefully, and don't hesitate to reference back to specific sections as you progress.

Remember: This journey is about progress, not perfection. Every small step you take is moving you closer to your goals.

Let's begin your transformation!

The PlantRx Expert Team`;

  addFormattedContent(doc, introContent, 140);
}

function addDetailedAssessment(
  doc: PDFKit.PDFDocument,
  userName: string,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, `${userName}'s Personal Assessment`);
  
  const budget = answers?.budget || 'moderate';
  const cookingTime = answers?.cooking_time || 'moderate';
  const restrictions = answers?.foods_avoid || 'none specified';
  
  const assessmentContent = `**Personal Situation Analysis for ${userName}:**

Based on your detailed questionnaire responses, here's your comprehensive assessment:

**Current Status:**
• Experience Level: ${userProfile.experience || 'Beginner'} - This means we'll start with foundational strategies and build complexity gradually
• Available Time: You indicated ${cookingTime} cooking time, so we've optimized for efficiency
• Budget Preference: ${budget} budget approach - all recommendations consider cost-effectiveness
• Food Restrictions: ${restrictions} - all meal plans accommodate these requirements

**Success Factors Identified:**
1. **Motivation Level:** Your primary goal of "${userProfile.goals?.[0] || 'better health'}" shows clear direction
2. **Lifestyle Compatibility:** Your ${userProfile.lifestyle || 'moderate activity'} lifestyle allows for sustainable changes
3. **Realistic Timeline:** The ${userProfile.duration || '1 month'} timeframe is optimal for establishing new habits

**Potential Challenges & Solutions:**
1. **Time Management:** 
   - Challenge: Busy schedule may make meal prep difficult
   - Solution: We've included 15-minute meal options and batch cooking strategies

2. **Consistency:**
   - Challenge: Maintaining motivation during tough days
   - Solution: Built-in flexibility and progress celebration milestones

3. **Information Overload:**
   - Challenge: Too many changes at once can be overwhelming
   - Solution: Gradual implementation plan with weekly focus areas

**Personalized Success Strategy:**
Your assessment reveals that you'll succeed best with:
• Simple, practical strategies that fit your current routine
• Clear, step-by-step instructions without overwhelm
• Regular progress checkpoints and adjustments
• Flexibility to accommodate your real-life schedule

**Next Steps:**
The following sections will provide your personalized action plan based on this assessment. Each recommendation has been selected specifically for your situation and goals.`;

  addFormattedContent(doc, assessmentContent, 140);
}

function addDailyProtocol(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Your Daily Success Protocol');
  
  const dailyContent = `**Your Personalized Daily Schedule:**

**MORNING ROUTINE (First 2 Hours After Waking):**

**6:00-6:30 AM - Hydration & Activation**
• Drink 16-20 oz of room temperature water with a pinch of sea salt
• 5-minute gentle stretching or deep breathing
• Set your intention for the day (30 seconds of gratitude)

**6:30-7:30 AM - Movement & Energy**
${userProfile.experience === 'Beginner' ? 
  '• 15-20 minutes of light movement (walking, gentle yoga, or bodyweight exercises)' :
  '• 30-45 minutes of structured exercise based on your fitness level'}
• Focus on movement that energizes rather than exhausts

**7:30-8:30 AM - Nourishment**
• Protein-rich breakfast within 2 hours of waking
• Include healthy fats and complex carbohydrates
• Specific meal suggestions provided in nutrition section

**MID-DAY PROTOCOL (11 AM - 3 PM):**

**11:00 AM - Mid-Morning Check-in**
• Hydration assessment (should be on glass 2-3 of water)
• Energy level check (1-10 scale)
• Light snack if needed (options in meal plan)

**12:00-1:00 PM - Optimal Lunch Window**
• Balanced meal with all macronutrients
• Eat mindfully without distractions
• Include vegetables for fiber and nutrients

**2:00-3:00 PM - Afternoon Optimization**
• Brief walk or movement break (5-10 minutes)
• Assess energy levels and hydration
• Prepare mentally for evening routine

**EVENING ROUTINE (5 PM - Bedtime):**

**5:00-7:00 PM - Dinner Preparation & Consumption**
• Begin winding down from daily stress
• Prepare and enjoy dinner with awareness
• Focus on digestion-friendly foods

**7:00-9:00 PM - Recovery & Preparation**
• Light movement or stretching
• Prepare for next day (meal prep, organize)
• Digital sunset (limit screen exposure)

**9:00 PM-Bedtime - Sleep Optimization**
• Dim lighting throughout home
• Relaxing activities (reading, bath, meditation)
• Consistent bedtime routine

**WEEKLY VARIATIONS:**

**Monday - Fresh Start Focus**
• Meal prep for the week
• Set weekly goals and intentions
• Review progress from previous week

**Wednesday - Mid-Week Assessment**
• Check progress on weekly goals
• Adjust plan if needed
• Restock any needed supplies

**Friday - Week Completion & Planning**
• Celebrate weekly progress
• Plan for weekend activities
• Prepare for next week's success

**Weekend Protocol:**
• Maintain core routines with flexibility
• Focus on meal prep and planning
• Include fun, movement-based activities

This schedule is designed specifically for your ${userProfile.lifestyle || 'moderate activity'} lifestyle and can be adjusted as needed.`;

  addFormattedContent(doc, dailyContent, 140);
}

function addDetailedNutritionPlan(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Your Personalized Nutrition Plan');
  
  const goal = userProfile.goals?.[0]?.toLowerCase() || 'energy boost';
  const restrictions = answers?.foods_avoid || 'none';
  const budget = answers?.budget || 'moderate';
  
  const nutritionContent = `**Customized Nutrition Strategy for ${goal}:**

**YOUR DAILY NUTRITION TARGETS:**
• Calories: ${getCalorieRange(userProfile)}
• Protein: ${getProteinTarget(userProfile)} 
• Healthy Fats: 25-30% of total calories
• Complex Carbs: 40-45% of total calories
• Fiber: 25-35 grams daily
• Water: Half your body weight in ounces

**SPECIFIC FOOD RECOMMENDATIONS:**

**BREAKFAST OPTIONS (Choose 1 daily):**

*Option 1: Energy-Boosting Smoothie*
• 1 cup unsweetened almond milk
• 1 scoop plant-based protein powder
• 1/2 banana
• 1 tbsp almond butter
• 1 cup spinach
• 1/2 tsp cinnamon
• Ice as needed

*Option 2: Protein Power Bowl*
• 2 eggs (or tofu scramble)
• 1/2 cup quinoa (cooked)
• 1/4 avocado
• 1 cup mixed vegetables
• 1 tsp olive oil

*Option 3: Quick Energy Toast*
• 2 slices whole grain bread
• 2 tbsp natural peanut butter
• 1/2 sliced banana
• Sprinkle of chia seeds

**LUNCH OPTIONS (Choose 1 daily):**

*Power Salad*
• 3 cups mixed leafy greens
• 4 oz grilled chicken/fish or 1/2 cup beans
• 1/4 cup nuts or seeds
• 1/2 cup berries
• 2 tbsp olive oil vinaigrette

*Energizing Wrap*
• Whole wheat tortilla
• 3 oz lean protein
• 2 tbsp hummus
• Vegetables of choice
• Side of raw vegetables

*Quick Buddha Bowl*
• 1/2 cup brown rice or quinoa
• 1/2 cup roasted vegetables
• 3 oz protein source
• 1 tbsp tahini or olive oil dressing

**DINNER OPTIONS (Choose 1 daily):**

*Balanced Plate Formula*
• 1/2 plate: Non-starchy vegetables
• 1/4 plate: Lean protein
• 1/4 plate: Complex carbohydrates
• 1-2 tbsp healthy fats

*Specific Meal Ideas:*
• Grilled salmon with roasted broccoli and sweet potato
• Lentil curry with brown rice and steamed vegetables
• Chicken stir-fry with mixed vegetables and quinoa

**SNACK OPTIONS (1-2 daily as needed):**
• Apple with 1 tbsp almond butter
• Greek yogurt with berries
• Handful of mixed nuts
• Hummus with vegetable sticks
• Hard-boiled egg with whole grain crackers

**BEVERAGES:**
• Water (primary beverage)
• Herbal teas
• Green tea (limit to 2 cups daily)
• Limit caffeine after 2 PM

**FOODS TO EMPHASIZE FOR YOUR GOALS:**
${getGoalSpecificFoods(goal)}

**PORTION CONTROL GUIDE:**
• Protein: Palm-sized portion
• Vegetables: 2 cupped hands
• Carbs: Cupped hand portion
• Fats: Thumb-sized portion

**MEAL TIMING:**
• Eat every 3-4 hours
• Stop eating 2-3 hours before bed
• Don't skip meals - it slows metabolism

**FOOD RESTRICTIONS ACCOMMODATED:**
${restrictions !== 'none' ? `All recommendations avoid: ${restrictions}` : 'No specific restrictions noted - all foods included'}

**BUDGET OPTIMIZATION:**
${getBudgetTips(budget)}`;

  addFormattedContent(doc, nutritionContent, 140);
}

function addExercisePlan(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Your Custom Exercise Program');
  
  const experience = userProfile.experience || 'Beginner';
  const equipment = answers?.equipment || ['bodyweight'];
  
  const exerciseContent = `**Personalized Exercise Plan - ${experience} Level:**

**WEEKLY SCHEDULE OVERVIEW:**
• Monday: Full body strength + cardio
• Tuesday: Active recovery or rest
• Wednesday: Upper body focus
• Thursday: Lower body focus  
• Friday: Full body + flexibility
• Saturday: Fun activity of choice
• Sunday: Complete rest or gentle stretching

**MONDAY - FULL BODY FOUNDATION:**

*Warm-up (5 minutes):*
• Arm circles: 30 seconds each direction
• Leg swings: 30 seconds each leg
• Gentle torso twists: 1 minute
• Deep breathing: 2 minutes

*Main Workout (${experience === 'Beginner' ? '15-20 minutes' : '25-30 minutes'}):*

${experience === 'Beginner' ? `
*Beginner Circuit (Repeat 2-3 times):*
• Bodyweight squats: 10-15 reps
• Modified push-ups: 5-10 reps
• Plank hold: 15-30 seconds
• Standing marches: 20 reps (10 each leg)
• Rest: 1 minute between exercises
` : `
*Intermediate Circuit (Repeat 3-4 times):*
• Squats: 15-20 reps
• Push-ups: 10-15 reps
• Plank hold: 30-60 seconds
• Lunges: 12 reps each leg
• Mountain climbers: 20 reps
• Rest: 45 seconds between exercises
`}

*Cool-down (5 minutes):*
• Forward fold: 1 minute
• Seated spinal twist: 30 seconds each side
• Child's pose: 2 minutes
• Deep breathing: 1 minute

**WEDNESDAY - UPPER BODY FOCUS:**

*Workout (${experience === 'Beginner' ? '12-15 minutes' : '20-25 minutes'}):*
${experience === 'Beginner' ? `
• Wall push-ups: 2 sets of 8-12
• Arm raises: 2 sets of 10-15
• Tricep dips (chair): 2 sets of 5-10
• Arm circles: 2 sets of 15 each direction
` : `
• Push-ups: 3 sets of 8-15
• Pike push-ups: 2 sets of 5-10
• Tricep dips: 3 sets of 8-12
• Plank to downward dog: 2 sets of 10
`}

**THURSDAY - LOWER BODY FOCUS:**

*Workout (${experience === 'Beginner' ? '12-15 minutes' : '20-25 minutes'}):*
${experience === 'Beginner' ? `
• Sit-to-stand from chair: 2 sets of 10-15
• Standing calf raises: 2 sets of 15-20
• Side leg lifts: 2 sets of 10 each side
• Glute bridges: 2 sets of 10-15
` : `
• Squats: 3 sets of 15-20
• Lunges: 3 sets of 10 each leg
• Single-leg glute bridges: 2 sets of 8 each leg
• Wall sit: 2 sets of 30-45 seconds
`}

**FRIDAY - FULL BODY + FLEXIBILITY:**

*Dynamic Movement (15 minutes):*
• 5 minutes moderate-intensity movement
• 10 minutes flexibility and mobility work

**PROGRESSION PLAN:**

*Week 1-2: Foundation*
• Focus on form and consistency
• Complete beginner versions
• Build habit of daily movement

*Week 3-4: Advancement*
• Increase repetitions by 2-3
• Hold positions 5-10 seconds longer
• Add 1-2 more circuits

*Beyond 4 Weeks:*
• Progress to intermediate variations
• Increase workout duration
• Add new movement patterns

**EXERCISE MODIFICATIONS:**

*For Limited Mobility:*
• Chair-based exercises
• Wall-supported movements  
• Seated stretches and reaches

*For Joint Issues:*
• Low-impact alternatives
• Supported movements
• Focus on range of motion

**EQUIPMENT ALTERNATIVES:**
${Array.isArray(equipment) ? 
  `Based on your available equipment (${equipment.join(', ')}), all exercises can be adapted.` :
  'All exercises designed for minimal equipment needs.'}

**TRACKING YOUR PROGRESS:**
• Record completed workouts
• Note energy levels post-exercise
• Track strength improvements
• Monitor flexibility gains

**SAFETY REMINDERS:**
• Stop if you feel pain (discomfort is normal)
• Stay hydrated throughout
• Listen to your body's needs
• Consult healthcare provider if concerns arise`;

  addFormattedContent(doc, exerciseContent, 140);
}

function addSupplementRecommendations(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Targeted Supplement Strategy');
  
  const goal = userProfile.goals?.[0] || 'energy boost';
  const age = userProfile.age || 'adult';
  const budget = answers?.budget || 'moderate';
  
  const supplementContent = `**Personalized Supplement Protocol for ${goal}:**

**TIER 1: ESSENTIAL FOUNDATION (Start with these)**

**1. High-Quality Multivitamin**
• Purpose: Fill nutritional gaps in diet
• Dosage: 1 daily with breakfast
• What to look for: Third-party tested, whole food-based
• Budget option: Generic store brand with USP verification
• Premium option: Garden of Life or Thorne Research

**2. Omega-3 Fatty Acids**
• Purpose: Reduce inflammation, support brain function
• Dosage: 1000-2000mg EPA/DHA combined daily
• Best time: With largest meal
• Vegan option: Algae-based omega-3s
• Quality markers: Molecular distillation, third-party purity testing

**3. Vitamin D3**
• Purpose: Immune function, bone health, mood support
• Dosage: 2000-4000 IU daily (get blood test to optimize)
• Best time: With fat-containing meal
• Note: Especially important if limited sun exposure

**TIER 2: GOAL-SPECIFIC SUPPLEMENTS**

${getGoalSpecificSupplements(goal)}

**4. Magnesium**
• Purpose: Muscle function, sleep quality, stress management
• Dosage: 200-400mg daily
• Best time: Evening, 1-2 hours before bed
• Form: Magnesium glycinate for better absorption
• Signs you need it: Muscle cramps, poor sleep, stress

**5. Probiotics**
• Purpose: Digestive health, immune function
• Dosage: 10-50 billion CFU daily
• Best time: On empty stomach or as directed
• What to look for: Multiple strains, enteric coating
• Food sources: Yogurt, kefir, sauerkraut, kimchi

**TIER 3: ADVANCED OPTIMIZATION (After 4-6 weeks)**

**6. Adaptogenic Herbs**
• Ashwagandha: 300-500mg for stress management
• Rhodiola: 200-400mg for energy and focus
• Holy Basil: 300-600mg for stress and blood sugar
• Timing: Morning for energy herbs, evening for calming ones

**7. Digestive Enzymes**
• Purpose: Improve nutrient absorption
• When: With largest meals
• Who needs it: Digestive issues, feeling bloated after meals
• Types: Broad-spectrum enzyme blend

**SUPPLEMENT TIMING SCHEDULE:**

**Morning (with breakfast):**
• Multivitamin
• Vitamin D3
• Omega-3 (half dose if splitting)
• Energy-supporting adaptogens

**Afternoon (with lunch):**
• Omega-3 (if splitting dose)
• Digestive enzymes (if needed)

**Evening (with dinner or before bed):**
• Magnesium
• Calming adaptogens
• Probiotics (if directed for evening)

**BUDGET-CONSCIOUS APPROACH:**
${getBudgetSupplementAdvice(budget)}

**QUALITY INDICATORS:**
• Third-party testing certificates
• GMP (Good Manufacturing Practice) certification
• No artificial fillers, colors, or preservatives
• Proper packaging (dark bottles, sealed containers)

**SUPPLEMENT INTERACTIONS TO AVOID:**
• Iron with calcium or tea/coffee
• Zinc on empty stomach (can cause nausea)
• Fat-soluble vitamins (A,D,E,K) without food
• High doses of single B vitamins without B-complex

**MONITORING & ADJUSTMENTS:**

*Week 1-2:*
• Start with Tier 1 supplements only
• Monitor for any digestive upset
• Take with food to minimize stomach irritation

*Week 3-4:*
• Add Tier 2 supplements one at a time
• Monitor energy levels and sleep quality
• Adjust timing if needed

*Month 2+:*
• Consider Tier 3 based on progress
• Get blood work to optimize vitamin D
• Reassess needs based on dietary changes

**RED FLAGS - STOP AND CONSULT DOCTOR:**
• Unusual fatigue or weakness
• Digestive issues that persist
• Allergic reactions (rash, breathing issues)
• Interactions with medications

**NATURAL FOOD ALTERNATIVES:**
• Omega-3: Fatty fish, walnuts, chia seeds
• Magnesium: Dark leafy greens, nuts, seeds
• Probiotics: Fermented foods
• Vitamin D: Sunlight exposure, fortified foods

Remember: Supplements support a healthy diet, they don't replace it. Focus on whole foods first!`;

  addFormattedContent(doc, supplementContent, 140);
}

function addShoppingLists(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Complete Shopping & Procurement Guide');
  
  const budget = answers?.budget || 'moderate';
  const restrictions = answers?.foods_avoid || 'none';
  
  const shoppingContent = `**Your Personalized Shopping Lists:**

**WEEKLY GROCERY LIST - PROTEINS:**
□ Eggs (1-2 dozen, free-range if possible)
□ Greek yogurt (32 oz, plain, low sugar)
□ Chicken breast (2 lbs, organic if budget allows)
□ Fish fillets (1 lb, wild-caught salmon or tilapia)
□ Plant protein: Beans/lentils (3 cans or 1 lb dried)
□ Tofu or tempeh (1 package for variety)
□ Nuts and seeds (almonds, walnuts, chia seeds)
□ Protein powder (1 container, plant-based or whey)

**FRESH PRODUCE:**
□ Leafy greens (spinach, kale, mixed greens - 3-4 containers)
□ Cruciferous vegetables (broccoli, cauliflower - 2 heads)
□ Colorful vegetables (bell peppers, carrots, zucchini)
□ Berries (blueberries, strawberries - 2-3 containers)
□ Bananas (1 bunch)
□ Avocados (3-4 pieces)
□ Sweet potatoes (3-4 medium)
□ Onions and garlic (basics for cooking)
□ Lemons and limes (for flavor and vitamin C)

**WHOLE GRAINS & COMPLEX CARBS:**
□ Brown rice (2 lb bag)
□ Quinoa (1 lb bag)
□ Whole grain bread (1 loaf, check ingredients)
□ Oats (large container, steel-cut or rolled)
□ Whole wheat pasta (2 boxes for quick meals)

**HEALTHY FATS:**
□ Extra virgin olive oil (1 bottle, cold-pressed)
□ Coconut oil (1 jar, unrefined)
□ Natural nut/seed butters (almond, peanut - no added sugar)
□ Avocados (included in produce)
□ Raw nuts and seeds (variety pack)

**PANTRY ESSENTIALS:**
□ Herbs and spices (turmeric, ginger, cinnamon, garlic powder)
□ Sea salt and black pepper
□ Apple cider vinegar
□ Coconut milk (1-2 cans, full-fat)
□ Vegetable or bone broth (4 containers)
□ Canned tomatoes (crushed, no added sugar)

**MEAL PREP CONTAINERS & TOOLS:**
□ Glass storage containers (various sizes)
□ BPA-free plastic containers for portability
□ Measuring cups and spoons
□ Food scale (if budget allows)
□ Sharp knives and cutting board

**BUDGET OPTIMIZATION STRATEGIES:**

${budget === 'low' ? `
**Low Budget Approach ($50-75/week):**
• Shop sales and use coupons
• Buy frozen vegetables (just as nutritious)
• Purchase proteins in bulk and freeze portions
• Choose seasonal produce
• Generic/store brands for pantry staples
• Meal prep to avoid food waste
` : budget === 'high' ? `
**Premium Budget Approach ($100-150/week):**
• Prioritize organic for "Dirty Dozen" produce
• Grass-fed, pasture-raised animal products
• Wild-caught fish over farm-raised
• Specialty health food items
• Fresh over frozen when possible
• Higher-end supplement brands
` : `
**Moderate Budget Approach ($75-100/week):**
• Mix of organic and conventional produce
• Focus organic spending on items you eat most
• Buy conventional for thick-skinned produce
• Shop sales for proteins and stock up
• Balance fresh and frozen vegetables
`}

**FOOD RESTRICTION ACCOMMODATIONS:**
${restrictions !== 'none' ? `
**Avoiding: ${restrictions}**
All items on this list have been checked for compliance with your restrictions.
Alternative suggestions provided where needed.
` : 'No specific restrictions - all foods included in recommendations'}

**SHOPPING SCHEDULE:**

**Sunday: Main Shopping Day**
• Complete weekly grocery shop
• Focus on fresh produce and proteins
• Stock up on meal prep containers

**Wednesday: Fresh Restock**
• Replace any used produce
• Pick up additional proteins if needed
• Check pantry for missing items

**MEAL PREP DAY ADDITIONS:**
□ Extra containers for batch cooking
□ Aluminum foil and parchment paper
□ Freezer bags for portion storage
□ Labels and marker for dating

**WHERE TO SHOP:**

**Best Overall Value:**
• Costco/Sam's Club (bulk items, proteins)
• Aldi (budget produce and pantry items)
• Trader Joe's (healthy convenience items)

**For Organic/Specialty:**
• Whole Foods (sales on organic items)
• Local farmers markets (seasonal produce)
• Thrive Market (online bulk ordering)

**SEASONAL SHOPPING TIPS:**

**Spring/Summer:**
• Focus on fresh, local produce
• Lighter proteins like fish
• Fresh herbs from garden or market

**Fall/Winter:**
• Root vegetables and squashes
• Heartier proteins and stews
• Frozen vegetables when fresh is expensive

**FOOD SAFETY & STORAGE:**

**Proteins:**
• Use fresh within 2-3 days
• Freeze portions immediately if not using
• Thaw safely in refrigerator

**Produce:**
• Wash before eating, not before storing
• Store properly to extend freshness
• Use ethylene-sensitive items first

**QUANTITY PLANNING:**
This list is designed for 1 person for 1 week. Multiply quantities for additional family members or extend for bi-weekly shopping.

**EMERGENCY BACKUP ITEMS:**
□ Canned beans and lentils
□ Frozen vegetables
□ Nut butters
□ Canned fish
□ Shelf-stable plant milk

These ensure you can create healthy meals even when fresh items run low.`;

  addFormattedContent(doc, shoppingContent, 140);
}

function addProgressTracking(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Advanced Progress Tracking System');
  
  const goal = userProfile.goals?.[0] || 'energy boost';
  
  const trackingContent = `**Your Personalized Progress Tracking System:**

**DAILY TRACKING METRICS:**

**Morning Check-in (2 minutes daily):**
□ Energy Level (1-10 scale)
□ Sleep Quality (1-10 scale)
□ Mood/Motivation (1-10 scale)
□ Physical Symptoms (note any concerns)
□ Weight (optional, same time daily)

**Evening Reflection (3 minutes daily):**
□ Meals consumed (checkmarks for planned meals)
□ Water intake (glasses or ounces)
□ Exercise completed (type and duration)
□ Stress level (1-10 scale)
□ Tomorrow's preparation (meal prep, planning)

**WEEKLY ASSESSMENTS:**

**Every Sunday - Weekly Review:**

**Physical Metrics:**
□ Weight (if tracking)
□ Measurements (waist, arms, thighs - monthly)
□ Energy trends (average of daily scores)
□ Sleep patterns (noting improvements)
□ Digestion quality (regularity, comfort)

**Behavioral Metrics:**
□ Meal plan adherence (percentage)
□ Exercise consistency (days completed)
□ Water intake consistency
□ Stress management effectiveness
□ Supplement routine compliance

**Progress Photos (Optional but Recommended):**
• Same time of day (morning preferred)
• Same lighting and location
• Same clothing or similar
• Front, side, and back views
• Monthly comparison reviews

**SPECIFIC TRACKING FOR YOUR GOAL: ${goal.toUpperCase()}**

${getGoalSpecificTracking(goal)}

**TRACKING TOOLS & METHODS:**

**Digital Options:**
• MyFitnessPal (food tracking)
• Fitbit/Apple Health (activity, sleep)
• Happy Scale (weight trend analysis)
• Way of Life (habit tracking)

**Paper-Based Options:**
• Weekly tracking sheets (provided below)
• Simple notebook with daily entries
• Calendar with color coding for success
• Progress photos printed and dated

**MONTHLY COMPREHENSIVE REVIEW:**

**Physical Progress:**
□ Compare progress photos
□ Review measurement changes
□ Assess energy level trends
□ Evaluate sleep quality improvements

**Performance Metrics:**
□ Exercise progression (stronger, more endurance)
□ Recovery time improvements
□ Daily task energy levels
□ Mental clarity and focus

**Habit Formation:**
□ Which habits became automatic?
□ What still requires conscious effort?
□ Where do you need more support?
□ What unexpected benefits emerged?

**TRACKING SUCCESS INDICATORS:**

**Week 1-2 Success:**
□ Consistent daily tracking
□ 80% meal plan adherence
□ Regular sleep schedule established
□ Exercise routine begun

**Week 3-4 Success:**
□ Increased energy levels
□ Improved sleep quality
□ Clothes fitting better
□ Established routine feeling natural

**Month 2+ Success:**
□ Sustained habit changes
□ Visible physical improvements
□ Enhanced mental clarity
□ Positive health markers

**TROUBLESHOOTING TRACKING:**

**If Numbers Aren't Moving:**
• Check portion sizes and accuracy
• Assess hidden calories (condiments, drinks)
• Review stress and sleep patterns
• Consider menstrual cycle impacts (if applicable)

**If Motivation Is Low:**
• Focus on non-scale victories
• Review progress photos for visual changes
• Celebrate consistency over perfection
• Adjust goals to be more realistic

**RED FLAG INDICATORS - CONSULT PROFESSIONAL:**
• Extreme fatigue lasting more than a week
• Dramatic mood changes
• Persistent digestive issues
• Rapid, unexplained weight changes

**CELEBRATION MILESTONES:**

**Weekly Celebrations:**
□ 7 days of consistent tracking
□ Trying 3 new healthy recipes
□ Completing all planned workouts
□ Drinking recommended water daily

**Monthly Celebrations:**
□ 30-day streak of daily habits
□ Noticeable energy improvements
□ Clothes fitting better
□ Blood work improvements (if applicable)

**SAMPLE WEEKLY TRACKING SHEET:**

Day: _______ Date: _______

Morning:
Energy (1-10): ___
Sleep Quality (1-10): ___
Weight: ___ (optional)
Mood (1-10): ___

Meals:
□ Breakfast: _____________
□ Lunch: _______________
□ Dinner: ______________
□ Snacks: ______________

Activity:
Exercise Type: __________
Duration: ____ minutes
Intensity (1-10): ____

Evening:
Water Intake: ____ glasses
Stress Level (1-10): ____
Tomorrow Prep: □ Done

Notes/Observations:
_________________________
_________________________

**PROGRESS PHOTO GUIDELINES:**

**Consistency Tips:**
• Same day of week
• Same time of day
• Similar lighting conditions
• Consistent poses and angles
• Wear form-fitting clothes

**What Photos Reveal:**
• Posture improvements
• Muscle definition changes
• Overall body composition shifts
• Confidence and energy in expression

Remember: Progress isn't always linear. Focus on trends over daily fluctuations!`;

  addFormattedContent(doc, trackingContent, 140);
}

function addTroubleshooting(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Expert Troubleshooting Guide');
  
  const troubleshootingContent = `**Common Challenges & Proven Solutions:**

**CHALLENGE 1: LOW ENERGY/MOTIVATION**

**Symptoms:**
• Feeling tired despite adequate sleep
• Lack of motivation to exercise
• Difficulty sticking to meal plans
• Mental fog or difficulty concentrating

**Root Causes & Solutions:**

*Cause: Blood Sugar Imbalances*
Solution: 
• Eat protein with every meal
• Avoid skipping meals
• Include healthy fats with carbohydrates
• Monitor caffeine and sugar intake

*Cause: Inadequate Recovery*
Solution:
• Prioritize 7-9 hours of quality sleep
• Include rest days in exercise routine
• Practice stress-reduction techniques
• Consider magnesium supplementation

*Cause: Nutrient Deficiencies*
Solution:
• Get blood work (B12, D3, iron, thyroid)
• Ensure adequate protein intake
• Focus on nutrient-dense foods
• Consider targeted supplementation

**CHALLENGE 2: PLATEAU OR STALLED PROGRESS**

**Symptoms:**
• No changes in energy, weight, or measurements
• Feeling like efforts aren't paying off
• Losing motivation to continue
• Same routine feeling too easy

**Solutions:**

*Shake Up Your Routine:*
• Change exercise type or intensity
• Try new recipes and foods
• Adjust meal timing
• Add new healthy habits

*Assess Hidden Factors:*
• Track everything for one week (including condiments, drinks)
• Monitor sleep and stress levels
• Check for water retention causes
• Consider hormonal influences

*Adjust Expectations:*
• Focus on non-scale victories
• Review progress photos
• Celebrate consistency
• Remember that plateaus are normal

**CHALLENGE 3: DIGESTIVE ISSUES**

**Symptoms:**
• Bloating after meals
• Irregular bowel movements
• Gas or stomach discomfort
• Food sensitivity reactions

**Solutions:**

*Immediate Actions:*
• Eat slowly and chew thoroughly
• Identify trigger foods through elimination
• Increase water intake gradually
• Include probiotic-rich foods

*Progressive Improvements:*
• Gradually increase fiber intake
• Consider digestive enzyme supplementation
• Manage stress (affects digestion)
• Avoid eating large meals late at night

**CHALLENGE 4: TIME CONSTRAINTS**

**Symptoms:**
• Feeling too busy to meal prep
• Skipping workouts due to schedule
• Relying on convenience foods
• Inconsistent routine

**Solutions:**

*Time-Saving Strategies:*
• Batch cook on weekends
• Prepare grab-and-go snacks
• Use slow cooker or instant pot
• Choose 15-minute workout options

*Priority Management:*
• Schedule health activities like appointments
• Prep meals while watching TV
• Walk during phone calls
• Use lunch breaks for movement

**CHALLENGE 5: SOCIAL PRESSURE & DINING OUT**

**Symptoms:**
• Difficulty maintaining plan during social events
• Pressure from friends/family to "cheat"
• Feeling deprived in social situations
• Guilt after social eating

**Solutions:**

*Preparation Strategies:*
• Eat something small before events
• Research restaurant menus in advance
• Suggest healthy restaurant options
• Bring healthy dishes to gatherings

*Social Navigation:*
• Communicate your goals to supportive friends
• Focus on the social aspect, not just food
• Practice portion control rather than avoidance
• Plan for flexibility without guilt

**CHALLENGE 6: CRAVINGS & HUNGER**

**Symptoms:**
• Intense cravings for specific foods
• Feeling hungry between meals
• Emotional eating triggers
• Late-night snacking urges

**Solutions:**

*Biological Approaches:*
• Ensure adequate protein at each meal
• Include healthy fats for satiety
• Stay properly hydrated
• Get adequate sleep (affects hunger hormones)

*Behavioral Strategies:*
• Identify emotional eating triggers
• Find non-food stress relief methods
• Keep healthy snacks readily available
• Practice mindful eating techniques

**CHALLENGE 7: INJURY OR PHYSICAL LIMITATIONS**

**Symptoms:**
• Pain or discomfort during exercise
• Previous injuries affecting movement
• Physical limitations due to health conditions
• Fear of making existing conditions worse

**Solutions:**

*Safety First:*
• Consult healthcare providers
• Start with gentle movements
• Focus on pain-free range of motion
• Consider working with a physical therapist

*Alternative Approaches:*
• Chair-based exercises
• Swimming or water aerobics
• Gentle yoga or tai chi
• Walking as primary exercise

**EMERGENCY ACTION PLANS:**

**If You Miss Multiple Days:**
1. Don't try to "make up" for lost time
2. Return to routine immediately
3. Focus on one habit at a time
4. Be compassionate with yourself
5. Identify what led to the break

**If You Experience Concerning Symptoms:**
• Persistent fatigue
• Unusual pain
• Dramatic mood changes
• Rapid weight fluctuations
IMMEDIATELY consult healthcare providers

**MINDSET TROUBLESHOOTING:**

**Perfectionism Issues:**
• Progress over perfection
• 80% adherence is excellent
• Small consistent actions compound
• Setbacks are learning opportunities

**All-or-Nothing Thinking:**
• One imperfect meal doesn't ruin everything
• Missed workouts can be made up
• Flexibility prevents complete derailment
• Focus on the next right choice

**GETTING BACK ON TRACK QUICKLY:**

**Same Day Recovery:**
• Make the next meal healthy
• Take a 10-minute walk
• Drink extra water
• Practice self-compassion

**Next Day Fresh Start:**
• Review what went off track
• Plan specific actions for today
• Focus on just today, not the whole week
• Connect with your original motivation

**SUPPORT SYSTEM ACTIVATION:**

**When to Seek Help:**
• Consistent lack of progress after 4-6 weeks
• Persistent negative symptoms
• Loss of motivation lasting more than a week
• Need for professional guidance

**Resources Available:**
• Healthcare providers
• Registered dietitians
• Personal trainers
• Mental health professionals
• PlantRx support community

Remember: Every challenge is an opportunity to build resilience and learn what works best for your unique situation!`;

  addFormattedContent(doc, troubleshootingContent, 140);
}

function addMealPlansAndRecipes(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, '7-Day Meal Plans & Recipes');
  
  const cookingTime = answers?.cooking_time || 'moderate';
  const restrictions = answers?.foods_avoid || 'none';
  
  const mealContent = `**Your Personalized 7-Day Meal Plan:**

**PREP DAY (Sunday) - 1 Hour Investment:**
• Cook 2 cups brown rice or quinoa
• Bake 4 chicken breasts (or tofu blocks)
• Chop vegetables for the week
• Prepare overnight oats for 3 days
• Make energy balls or healthy snacks

**DAY 1: ENERGIZING START**

*Breakfast: Power Smoothie Bowl*
Ingredients:
• 1 banana (frozen)
• 1/2 cup berries
• 1 scoop protein powder
• 1 cup spinach
• 1/2 cup almond milk
• Toppings: chia seeds, granola, coconut flakes

Instructions:
1. Blend all liquid ingredients until smooth
2. Pour into bowl and add toppings
3. Enjoy immediately

*Lunch: Mediterranean Quinoa Bowl*
Ingredients:
• 1/2 cup cooked quinoa
• 3 oz grilled chicken (prepped)
• 1/4 cup cucumber, diced
• 2 tbsp hummus
• 1 tbsp olive oil
• Lemon juice and herbs

Instructions:
1. Layer quinoa in bowl
2. Add chicken and vegetables
3. Drizzle with oil and lemon
4. Serve with hummus on side

*Dinner: One-Pan Salmon & Vegetables*
Ingredients:
• 4 oz salmon fillet
• 1 cup broccoli florets
• 1/2 sweet potato, cubed
• 1 tbsp olive oil
• Salt, pepper, garlic powder

Instructions:
1. Preheat oven to 425°F
2. Toss vegetables with oil and seasonings
3. Place on sheet pan with salmon
4. Bake 15-20 minutes until salmon flakes

**DAY 2: SUSTAINED ENERGY**

*Breakfast: Protein-Packed Oats*
Ingredients:
• 1/2 cup rolled oats
• 1 scoop protein powder
• 1 tbsp almond butter
• 1/2 banana, sliced
• 1 cup unsweetened almond milk
• Cinnamon to taste

Instructions:
1. Mix oats with protein powder
2. Add milk and stir well
3. Microwave 90 seconds or cook stovetop
4. Top with banana and almond butter

*Lunch: Turkey & Avocado Wrap*
Ingredients:
• 1 whole wheat tortilla
• 3 oz lean turkey
• 1/4 avocado, mashed
• Lettuce leaves
• 1 tbsp mustard
• Side: baby carrots with hummus

Instructions:
1. Spread avocado and mustard on tortilla
2. Layer turkey and lettuce
3. Roll tightly and slice in half
4. Serve with vegetables and hummus

*Dinner: Lentil Curry with Brown Rice*
${cookingTime === 'low' ? `
Quick Version (20 minutes):
• Use pre-cooked lentils and rice
• Simple curry powder seasoning
• Add frozen vegetables
• Serve with yogurt
` : `
Full Recipe (45 minutes):
Ingredients:
• 1 cup red lentils
• 1 can coconut milk
• 2 cups vegetable broth
• 1 onion, diced
• 2 cloves garlic, minced
• 1 tbsp curry powder
• 1 cup spinach
• 1/2 cup brown rice (cooked)

Instructions:
1. Sauté onion and garlic until soft
2. Add curry powder, cook 30 seconds
3. Add lentils, coconut milk, and broth
4. Simmer 20 minutes until lentils are tender
5. Stir in spinach until wilted
6. Serve over brown rice
`}

**DAYS 3-7: CONTINUED VARIETY**

*Day 3:*
• Breakfast: Greek yogurt parfait with berries
• Lunch: Large salad with grilled protein
• Dinner: Stir-fry with vegetables and tofu/chicken

*Day 4:*
• Breakfast: Veggie omelet with whole grain toast
• Lunch: Leftover lentil curry
• Dinner: Baked cod with roasted vegetables

*Day 5:*
• Breakfast: Smoothie with different fruit combination
• Lunch: Quinoa Buddha bowl
• Dinner: Chicken and vegetable soup

*Day 6:*
• Breakfast: Steel-cut oats with nuts and seeds
• Lunch: Turkey and vegetable soup
• Dinner: Grilled portobello mushroom with quinoa

*Day 7:*
• Breakfast: Weekend special - healthy pancakes
• Lunch: Meal prep bowl combination
• Dinner: Choose your favorite meal from the week

**QUICK SNACK RECIPES:**

*Energy Balls (Makes 12):*
• 1 cup dates, pitted
• 1/2 cup almonds
• 2 tbsp chia seeds
• 1 tbsp coconut oil
• 1 tsp vanilla
Blend all ingredients, roll into balls, refrigerate

*Veggie Hummus Cups:*
• Cut bell peppers, carrots, celery
• Portion hummus into small containers
• Grab-and-go protein snack

**MEAL PREP SHORTCUTS:**

${cookingTime === 'low' ? `
**Time-Saving Strategies (Under 30 minutes/week):**
• Use pre-cut vegetables
• Buy rotisserie chicken
• Utilize frozen fruits and vegetables
• Choose canned beans and lentils
• Pre-made healthy sauces and dressings
` : `
**Standard Prep (1-2 hours/week):**
• Batch cook grains and proteins
• Wash and chop all vegetables
• Make homemade sauces and dressings
• Prepare grab-and-go snack portions
• Cook soups and stews in large batches
`}

**RECIPE MODIFICATIONS FOR RESTRICTIONS:**
${restrictions !== 'none' ? `
**Avoiding: ${restrictions}**
• All recipes can be modified to accommodate
• Substitution suggestions provided with each recipe
• Focus on naturally compliant whole foods
` : 'All recipes suitable for general dietary needs'}

**KITCHEN TOOLS FOR SUCCESS:**
• Sharp knives and cutting boards
• Glass storage containers
• Sheet pans for roasting
• Slow cooker or Instant Pot (optional)
• Blender for smoothies

**LEFTOVER TRANSFORMATION:**
• Grilled chicken → salads, wraps, soups
• Cooked grains → breakfast bowls, stir-fries
• Roasted vegetables → omelets, grain bowls
• Legumes → salads, pasta dishes

**EMERGENCY MEAL IDEAS (5 minutes or less):**
• Canned tuna with crackers and vegetables
• Greek yogurt with nuts and fruit
• Hummus with vegetables and whole grain pita
• Hard-boiled eggs with avocado on toast
• Protein smoothie with frozen fruits

**DINING OUT STRATEGIES:**
• Research menus in advance
• Ask for dressing and sauces on the side
• Choose grilled over fried options
• Request extra vegetables
• Practice portion control

This meal plan provides approximately 1,500-1,800 calories per day with balanced macronutrients optimized for your specific goals.`;

  addFormattedContent(doc, mealContent, 140);
}

function addAdvancedStrategies(
  doc: PDFKit.PDFDocument,
  type: string,
  userProfile: UserProfile,
  answers: any
) {
  addSectionHeader(doc, 'Advanced Optimization Secrets');
  
  const goal = userProfile.goals?.[0] || 'energy boost';
  
  const advancedContent = `**Insider Secrets for Accelerated Results:**

**BIOHACKING FUNDAMENTALS:**

**1. Circadian Rhythm Optimization**
*The Science:* Your body's internal clock affects metabolism, hormone production, and energy levels.

*Implementation:*
• Get 10-15 minutes of morning sunlight within 2 hours of waking
• Dim lights 2-3 hours before bedtime
• Keep consistent sleep/wake times (even weekends)
• Avoid blue light from screens 1 hour before bed
• Use blackout curtains or eye mask for deep sleep

*Advanced Tip:* Time your largest meal for when you're most active (typically midday)

**2. Metabolic Flexibility Training**
*The Science:* Train your body to efficiently use both carbs and fats for fuel.

*Beginner Method:*
• 12-hour eating window (8 AM - 8 PM)
• Include both healthy carbs and fats in meals
• Avoid constant snacking

*Advanced Method:*
• 16:8 intermittent fasting (16 hours fasting, 8-hour eating window)
• Strategic carb timing around workouts
• Include MCT oil for ketone production

**3. Micronutrient Timing**
*The Science:* When you take nutrients affects absorption and effectiveness.

*Strategic Timing:*
• B-vitamins: Morning (energy support)
• Magnesium: Evening (relaxation and recovery)
• Vitamin D: With largest meal (fat absorption)
• Iron: Away from calcium and coffee
• Zinc: On empty stomach (if tolerated)

**ADVANCED NUTRITION STRATEGIES:**

**4. Metabolic Typing**
*Your Body Type Analysis:*
${getMetabolicTypeAdvice(userProfile)}

**5. Strategic Macronutrient Cycling**
*Week 1-2:* Higher protein, moderate carbs (muscle preservation)
*Week 3-4:* Balanced approach (sustainability)
*Week 5+:* Adjust based on progress and goals

**6. Hydration Optimization**
*Beyond Water:*
• Add sea salt to first glass of water (electrolyte balance)
• Drink 16-20 oz upon waking (rehydration after sleep)
• Time water intake: stop 1 hour before bed
• Monitor urine color: pale yellow is optimal
• Include water-rich foods: cucumber, watermelon, soups

**EXERCISE OPTIMIZATION SECRETS:**

**7. High-Intensity Recovery**
*The Science:* Recovery determines adaptation and progress.

*Implementation:*
• Contrast showers (hot/cold alternating)
• 7-9 hours quality sleep (non-negotiable)
• Stress management techniques
• Active recovery days (gentle movement)
• Proper nutrition timing around workouts

**8. Movement Snacking**
*The Concept:* Brief movement throughout the day vs. one long session.

*Examples:*
• 2-minute desk stretches every hour
• Stair climbing breaks
• Walking meetings
• Standing desk intervals
• Evening walks for digestion

**PSYCHOLOGICAL OPTIMIZATION:**

**9. Habit Stacking**
*The Strategy:* Link new habits to established ones.

*Examples:*
• After I pour coffee, I drink a glass of water
• After I brush teeth, I do 10 squats
• After I sit at desk, I review my meal plan
• After dinner, I prepare tomorrow's meals

**10. Environmental Design**
*Make Healthy Choices Easier:*
• Keep healthy snacks at eye level
• Place workout clothes where you'll see them
• Remove tempting foods from easily accessible areas
• Use smaller plates for portion control
• Keep water bottle always visible

**ADVANCED SUPPLEMENTATION:**

**11. Precision Supplementation**
*Beyond Basics:*
• Digestive enzymes with largest meals
• Adaptogens for stress management
• Electrolytes for hydration optimization
• Targeted probiotics for gut health
• Nootropics for mental clarity (advanced)

**12. Supplement Cycling**
*The Strategy:* Prevent adaptation and maintain effectiveness.
• 5 days on, 2 days off for stimulant-like supplements
• 3 weeks on, 1 week off for adaptogens
• Continuous for basics (multivitamin, omega-3)

**MEASUREMENT & OPTIMIZATION:**

**13. Advanced Tracking**
*Beyond Scale Weight:*
• Heart rate variability (HRV) for recovery
• Sleep stages monitoring
• Energy levels throughout day
• Mood and cognitive function
• Biomarker blood testing (quarterly)

**14. Progressive Overload in All Areas**
*Not Just Exercise:*
• Gradually increase vegetable intake
• Add new healthy foods weekly
• Extend fasting window slowly
• Increase daily step count
• Challenge stress management skills

**NEXT-LEVEL STRATEGIES:**

**15. Meal Timing Precision**
*Strategic Eating Windows:*
• Pre-workout: Light protein + easily digestible carbs (30-60 min before)
• Post-workout: Protein + carbs within 30 minutes
• Last meal: 3 hours before bedtime
• First meal: Within 2 hours of waking

**16. Stress Mitigation Protocols**
*Advanced Stress Management:*
• Box breathing (4-4-4-4 count)
• Cold exposure therapy (cold showers/ice baths)
• Meditation progression (start 5 min, build to 20 min)
• Gratitude journaling (3 items daily)
• Nature exposure (minimum 20 minutes daily)

**17. Social Environment Optimization**
*Surround Yourself with Success:*
• Find accountability partner with similar goals
• Join communities aligned with your values
• Limit exposure to negative influences
• Share goals with supportive family/friends
• Follow inspiring social media accounts

**TROUBLESHOOTING PLATEAUS:**

**18. Plateau Breaking Protocols**
*When Progress Stalls:*
• Change exercise modality completely
• Adjust macronutrient ratios
• Implement strategic refeed days
• Take planned recovery week
• Reassess calorie needs

**19. Advanced Problem-Solving**
*Root Cause Analysis:*
• Hidden food sensitivities (elimination diet)
• Chronic inflammation markers
• Thyroid and hormone optimization
• Gut microbiome health
• Toxic load assessment

**LONG-TERM SUCCESS STRATEGIES:**

**20. Lifestyle Integration**
*Making It Permanent:*
• Focus on identity change ("I am a healthy person")
• Celebrate process over outcomes
• Build flexibility into rigid plans
• Develop intrinsic motivation
• Create systems, not just goals

**CUTTING-EDGE RESEARCH APPLICATIONS:**

**21. Chronotype Optimization**
*Work with Your Natural Rhythms:*
• Identify if you're naturally morning or evening person
• Time workouts during energy peaks
• Schedule demanding tasks during mental peaks
• Eat according to metabolic rhythms

**22. Microbiome Optimization**
*Advanced Gut Health:*
• Diverse fiber sources (30+ plant foods weekly)
• Fermented food rotation
• Prebiotic supplementation timing
• Avoid unnecessary antibiotics
• Stress management (gut-brain connection)

**IMPLEMENTATION HIERARCHY:**

**Month 1:** Master basics (nutrition, exercise, sleep)
**Month 2:** Add optimization strategies (timing, supplementation)
**Month 3:** Implement advanced biohacking techniques
**Month 4+:** Personalize based on your body's responses

Remember: Advanced strategies build upon solid fundamentals. Master the basics before adding complexity!

**PROFESSIONAL SUPPORT INTEGRATION:**
• Work with registered dietitian for nutrition optimization
• Consult personal trainer for exercise progression
• Consider functional medicine doctor for biomarker optimization
• Mental health professional for psychological strategies

These advanced strategies can accelerate your results significantly when implemented systematically and consistently.`;

  addFormattedContent(doc, advancedContent, 140);
}

// Helper functions

function addSectionHeader(doc: PDFKit.PDFDocument, title: string) {
  doc.fontSize(26)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text(title, 50, 100, { width: 495 });
  
  doc.moveTo(50, 135)
     .lineTo(545, 135)
     .strokeColor('#059669')
     .lineWidth(2)
     .stroke();
}

function addFormattedContent(doc: PDFKit.PDFDocument, content: string, startY: number) {
  const lines = content.split('\n');
  let yPos = startY;
  const lineHeight = 16;
  const margin = 50;
  const pageHeight = doc.page.height - 100;
  
  lines.forEach((line) => {
    if (yPos > pageHeight) {
      doc.addPage();
      yPos = 100;
    }
    
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      // Bold headers
      doc.fontSize(14)
         .fillColor('#1f2937')
         .font('Helvetica-Bold')
         .text(trimmedLine.replace(/\*\*/g, ''), margin, yPos, { width: 495 });
      yPos += 22;
    } else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
      // Italicized subheaders
      doc.fontSize(12)
         .fillColor('#374151')
         .font('Helvetica-Oblique')
         .text(trimmedLine.replace(/\*/g, ''), margin, yPos, { width: 495 });
      yPos += 18;
    } else if (trimmedLine.startsWith('□') || trimmedLine.startsWith('•')) {
      // Bullet points and checkboxes
      doc.fontSize(11)
         .fillColor('#374151')
         .font('Helvetica')
         .text(trimmedLine, margin + 20, yPos, { width: 475 });
      yPos += lineHeight;
    } else if (trimmedLine.length > 0) {
      // Regular paragraphs
      doc.fontSize(11)
         .fillColor('#374151')
         .font('Helvetica')
         .text(trimmedLine, margin, yPos, { width: 495, align: 'justify' });
      yPos += lineHeight;
    } else {
      // Empty line spacing
      yPos += 8;
    }
  });
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  const pageCount = (doc as any).bufferedPageRange().count;
  
  for (let i = 1; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(10)
       .fillColor('#9ca3af')
       .text(`${i + 1}`, 0, doc.page.height - 30, { 
         width: doc.page.width, 
         align: 'center' 
       });
  }
}

// Dynamic content generation helpers
function getCalorieRange(userProfile: UserProfile): string {
  const age = userProfile.age || 'adult';
  const gender = userProfile.gender || 'not specified';
  const activity = userProfile.lifestyle || 'moderate';
  
  // Provide realistic ranges based on profile
  if (activity.includes('low') || activity.includes('sedentary')) {
    return '1,400-1,600 calories';
  } else if (activity.includes('high') || activity.includes('active')) {
    return '1,800-2,200 calories';
  } else {
    return '1,600-1,900 calories';
  }
}

function getProteinTarget(userProfile: UserProfile): string {
  const activity = userProfile.lifestyle || 'moderate';
  
  if (activity.includes('high') || activity.includes('active')) {
    return '100-130 grams daily';
  } else if (activity.includes('low') || activity.includes('sedentary')) {
    return '70-90 grams daily';
  } else {
    return '80-110 grams daily';
  }
}

function getGoalSpecificFoods(goal: string): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('energy')) {
    return `• Complex carbohydrates: quinoa, sweet potatoes, oats
• Iron-rich foods: spinach, lentils, lean meats
• B-vitamin sources: eggs, nutritional yeast, leafy greens
• Healthy fats: avocados, nuts, olive oil`;
  } else if (goalLower.includes('weight')) {
    return `• High-fiber foods: vegetables, fruits, legumes
• Lean proteins: chicken, fish, tofu, beans
• Thermogenic foods: green tea, chili peppers, ginger
• Volume foods: leafy greens, broth-based soups`;
  } else {
    return `• Anti-inflammatory foods: berries, fatty fish, turmeric
• Antioxidant-rich foods: colorful vegetables and fruits
• Whole grains: brown rice, quinoa, oats
• Healthy proteins: fish, legumes, nuts, seeds`;
  }
}

function getBudgetTips(budget: string): string {
  if (budget === 'low') {
    return `• Buy in bulk: grains, legumes, frozen vegetables
• Choose seasonal produce
• Use store brands for pantry staples
• Batch cook to reduce food waste
• Focus on affordable protein sources (eggs, beans, canned fish)`;
  } else if (budget === 'high') {
    return `• Prioritize organic for heavily pesticide-treated foods
• Choose grass-fed, pasture-raised animal products
• Invest in high-quality supplements
• Shop at specialty health food stores
• Focus on nutrient density over cost`;
  } else {
    return `• Mix organic and conventional produce strategically
• Buy organic for thin-skinned fruits and vegetables
• Choose conventional for thick-skinned produce
• Shop sales and stock up on non-perishables
• Balance quality with affordability`;
  }
}

function getGoalSpecificSupplements(goal: string): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('energy')) {
    return `**For Energy Enhancement:**
• B-Complex: 50-100mg daily (supports energy metabolism)
• CoQ10: 100-200mg daily (cellular energy production)
• Iron: If deficient (get blood test first)
• Rhodiola: 300-500mg morning (adaptogenic energy support)
• Green Tea Extract: 200-400mg (natural caffeine + antioxidants)`;
  } else if (goalLower.includes('weight')) {
    return `**For Healthy Weight Management:**
• CLA: 1000-3000mg daily (supports metabolism)
• Green Coffee Bean Extract: 400-800mg (metabolic support)
• L-Carnitine: 500-2000mg pre-workout (fat oxidation)
• Chromium: 200-400mcg (blood sugar support)
• Fiber Supplement: 5-10g daily (satiety support)`;
  } else {
    return `**For General Wellness:**
• Turmeric/Curcumin: 500-1000mg (anti-inflammatory)
• Quercetin: 500mg daily (antioxidant support)
• Alpha-lipoic Acid: 300-600mg (antioxidant + blood sugar)
• N-Acetyl Cysteine: 600-1200mg (detox support)
• Resveratrol: 100-500mg (longevity support)`;
  }
}

function getBudgetSupplementAdvice(budget: string): string {
  if (budget === 'low') {
    return `**Budget-Friendly Approach:**
• Start with Tier 1 basics only
• Choose generic brands with third-party testing
• Buy in bulk when possible
• Focus on food sources first
• Consider every-other-day dosing for expensive supplements`;
  } else if (budget === 'high') {
    return `**Premium Approach:**
• Invest in highest quality, most bioavailable forms
• Consider professional-grade supplements
• Add specialized testing to optimize dosing
• Include cutting-edge supplements
• Work with functional medicine practitioner`;
  } else {
    return `**Balanced Approach:**
• Prioritize Tier 1 supplements with quality brands
• Mix premium and budget options strategically
• Focus spending on most important supplements first
• Look for sales and bulk purchasing opportunities
• Gradually add Tier 2 supplements`;
  }
}

function getGoalSpecificTracking(goal: string): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('energy')) {
    return `**Energy-Specific Tracking:**
• Hourly energy ratings (1-10 scale)
• Caffeine intake and timing
• Afternoon energy crashes (time and severity)
• Mental clarity and focus levels
• Physical stamina during activities
• Sleep quality impact on next-day energy`;
  } else if (goalLower.includes('weight')) {
    return `**Weight Management Tracking:**
• Daily weight (same time, same conditions)
• Body measurements weekly
• Hunger levels between meals
• Satiety after meals
• Clothing fit changes
• Progress photos weekly`;
  } else {
    return `**General Wellness Tracking:**
• Overall well-being (1-10 scale)
• Physical symptoms or improvements
• Mental/emotional state
• Biomarkers (if available)
• Quality of life indicators
• Long-term health goals progress`;
  }
}

function getMetabolicTypeAdvice(userProfile: UserProfile): string {
  const age = userProfile.age || 'adult';
  const activity = userProfile.lifestyle || 'moderate';
  
  return `Based on your profile (${age}, ${activity} activity level):
• Focus on balanced macronutrients
• Slightly higher protein if very active
• Complex carbs for sustained energy
• Healthy fats for hormone production
• Adjust based on your body's responses`;
}