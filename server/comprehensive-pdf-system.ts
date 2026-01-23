// Comprehensive PDF Generation System for PlantRx
// Creates personalized, professional health plan PDFs with 5+ pages each

import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export interface UserData {
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

export interface QuestionnaireAnswers {
  [key: string]: any;
}

export interface PDFSection {
  title: string;
  content: string;
  subsections?: Array<{
    title: string;
    content: string;
  }>;
}

// Main PDF generation function
export async function generateComprehensivePDF(
  type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery',
  userData: UserData,
  answers: QuestionnaireAnswers
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        info: {
          Title: `${userData.name}'s ${getPlanTitle(type)} Guide`,
          Author: 'PlantRx Expert Health Platform',
          Subject: `Personalized ${userData.duration || '30 days'} ${type} transformation plan`,
          Keywords: `${type}, personalized, health, wellness, natural, PlantRx`,
          Creator: 'PlantRx App - plantrxapp.com'
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Generate comprehensive content based on type
      generatePDFContent(doc, type, userData, answers);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function getPlanTitle(type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery'): string {
  const titles = {
    'diet': 'Natural Nutrition Plan',
    'fitness': 'Holistic Fitness Journey',
    'skincare': 'Natural Skincare Routine',
    'wellness': 'Complete Wellness Plan',
    'recovery': 'Natural Recovery Guide'
  };
  return titles[type as keyof typeof titles] || 'Health Transformation';
}

function generatePDFContent(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  const currentDate = format(new Date(), 'MMMM dd, yyyy');
  const planTitle = getPlanTitle(type);

  // 1. COVER PAGE
  addCoverPage(doc, planTitle, userData, currentDate);

  // 2. TABLE OF CONTENTS
  doc.addPage();
  addTableOfContents(doc, type);

  // 3. PERSONALIZED INTRODUCTION
  doc.addPage();
  addPersonalizedIntroduction(doc, type, userData, answers);

  // 4. ASSESSMENT & PERSONALIZATION
  doc.addPage();
  addPersonalizedAssessment(doc, type, userData, answers);

  // 5. DAILY PLAN/SCHEDULE
  doc.addPage();
  addDailyPlan(doc, type, userData, answers);

  // 6. SPECIFIC CONTENT BY TYPE
  doc.addPage();
  addTypeSpecificContent(doc, type, userData, answers);

  // 7. TRACKING TOOLS
  doc.addPage();
  addProgressTracking(doc, type, userData);

  // 8. TROUBLESHOOTING & TIPS
  doc.addPage();
  addTroubleshootingGuide(doc, type, userData, answers);

  // 9. SHOPPING/RESOURCES LIST
  doc.addPage();
  addResourcesAndShopping(doc, type, userData, answers);

  // 10. CLOSING & MOTIVATION
  doc.addPage();
  addClosingPage(doc, type, userData);

  // Add page numbers to all pages (with safety check)
  try {
    addPageNumbers(doc);
  } catch (error) {
    console.warn('[PDF] Page numbering skipped due to buffering issue:', error.message);
    // Continue without page numbers rather than failing the entire PDF
  }
}

function addCoverPage(doc: PDFKit.PDFDocument, planTitle: string, userData: UserData, date: string) {
  // PlantRx Logo/Header
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('PlantRx', 50, 80, { align: 'center' });

  // Main Title
  doc.fontSize(32)
     .fillColor('#1F2937')
     .text(planTitle, 50, 200, { align: 'center', width: 495 });

  // Subtitle
  doc.fontSize(18)
     .fillColor('#6B7280')
     .text('Personalized Natural Health Guide', 50, 260, { align: 'center', width: 495 });

  // User name
  doc.fontSize(20)
     .fillColor('#374151')
     .text(`Prepared for ${userData.name}`, 50, 320, { align: 'center', width: 495 });

  // Date and duration
  doc.fontSize(14)
     .fillColor('#6B7280')
     .text(`${date} • ${userData.duration || '30 Day Plan'}`, 50, 380, { align: 'center', width: 495 });

  // Bottom branding
  doc.fontSize(12)
     .fillColor('#9CA3AF')
     .text('Expert-Verified Natural Health Solutions', 50, 700, { align: 'center', width: 495 });

  // Decorative elements
  doc.rect(50, 450, 495, 2).fillAndStroke('#10B981', '#10B981');
  doc.rect(50, 470, 495, 1).fillAndStroke('#D1FAE5', '#D1FAE5');
}

function addTableOfContents(doc: PDFKit.PDFDocument, type: string) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Table of Contents', 50, 80);

  const contents = getTableOfContents(type);
  let yPosition = 140;

  contents.forEach((item, index) => {
    doc.fontSize(14)
       .fillColor('#374151')
       .text(`${index + 1}. ${item.title}`, 70, yPosition, { width: 400 });
    
    doc.fontSize(12)
       .fillColor('#9CA3AF')
       .text(`Page ${item.page}`, 480, yPosition, { width: 65, align: 'right' });
    
    yPosition += 35;
  });
}

function getTableOfContents(type: string) {
  const baseContents = [
    { title: 'Personalized Introduction', page: 3 },
    { title: 'Your Assessment & Plan Overview', page: 4 },
    { title: 'Daily Schedule & Implementation', page: 5 },
    { title: 'Progress Tracking Tools', page: 7 },
    { title: 'Troubleshooting Guide', page: 8 },
    { title: 'Resources & Shopping Lists', page: 9 },
    { title: 'Success Strategies & Motivation', page: 10 }
  ];

  const typeSpecific = {
    'diet': { title: 'Meal Plans & Nutrition Guide', page: 6 },
    'fitness': { title: 'Exercise Routines & Workouts', page: 6 },
    'skincare': { title: 'Morning & Evening Routines', page: 6 },
    'wellness': { title: 'Mindfulness & Lifestyle Practices', page: 6 },
    'recovery': { title: 'Healing Protocols & Recovery Plans', page: 6 }
  };

  const result = [...baseContents];
  result.splice(3, 0, typeSpecific[type as keyof typeof typeSpecific]);
  return result;
}

function addPersonalizedIntroduction(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text(`Welcome, ${userData.name}!`, 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text(`Congratulations on taking this important step toward better health! This personalized ${getPlanTitle(type).toLowerCase()} has been specifically designed based on your unique needs, goals, and preferences.`, 50, 140, { width: 495, lineGap: 5 });

  // Personalized goals section
  if (userData.goals && userData.goals.length > 0) {
    doc.fontSize(16)
       .fillColor('#10B981')
       .text('Your Personal Goals:', 50, 220);

    let yPos = 250;
    userData.goals.forEach(goal => {
      doc.fontSize(12)
         .fillColor('#374151')
         .text(`• ${goal}`, 70, yPos, { width: 475 });
      yPos += 20;
    });
  }

  // Health concerns section
  if (userData.healthConcerns && userData.healthConcerns.length > 0) {
    doc.fontSize(16)
       .fillColor('#10B981')
       .text('Areas We\'ll Focus On:', 50, 350);

    let yPos = 380;
    userData.healthConcerns.forEach(concern => {
      doc.fontSize(12)
         .fillColor('#374151')
         .text(`• ${concern}`, 70, yPos, { width: 475 });
      yPos += 20;
    });
  }

  // Plan commitment section
  doc.fontSize(14)
     .fillColor('#374151')
     .text(`This ${userData.duration || '30-day'} journey will provide you with natural, science-backed solutions that work with your body's natural healing processes. Every recommendation in this guide is based on proven plant-based medicine and holistic health principles.`, 50, 500, { width: 495, lineGap: 5 });

  doc.fontSize(12)
     .fillColor('#6B7280')
     .text('Remember: Consistency is key to success. Small daily actions lead to transformational results.', 50, 580, { width: 495, lineGap: 3 });
}

function addPersonalizedAssessment(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Your Personal Assessment', 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text('Based on your questionnaire responses, we\'ve identified the following personalized recommendations:', 50, 130, { width: 495, lineGap: 5 });

  // Experience level assessment
  const experience = userData.experience || answers.experience || 'beginner';
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Experience Level:', 50, 180);

  doc.fontSize(12)
     .fillColor('#374151')
     .text(`You indicated you are a ${experience} in this area. This plan has been tailored to match your current knowledge and comfort level, ensuring you can follow it successfully without feeling overwhelmed.`, 70, 210, { width: 475, lineGap: 4 });

  // Lifestyle compatibility
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Lifestyle Integration:', 50, 280);

  doc.fontSize(12)
     .fillColor('#374151')
     .text(getLifestyleAssessment(userData, answers), 70, 310, { width: 475, lineGap: 4 });

  // Personalized approach
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Your Personalized Approach:', 50, 410);

  doc.fontSize(12)
     .fillColor('#374151')
     .text(getPersonalizedApproach(type, userData, answers), 70, 440, { width: 475, lineGap: 4 });

  // Expected timeline
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Expected Results Timeline:', 50, 540);

  doc.fontSize(12)
     .fillColor('#374151')
     .text(getTimelineExpectations(type, userData), 70, 570, { width: 475, lineGap: 4 });
}

function getLifestyleAssessment(userData: UserData, answers: QuestionnaireAnswers): string {
  const lifestyle = userData.lifestyle || answers.lifestyle || 'moderate';
  
  const assessments = {
    'busy': 'We understand you have a busy schedule. This plan includes time-efficient strategies and quick preparation methods that fit into your demanding lifestyle.',
    'active': 'Your active lifestyle is a great foundation! We\'ve designed this plan to complement your existing activities and enhance your performance.',
    'moderate': 'Your balanced approach to life allows for steady, sustainable progress. This plan will integrate smoothly into your current routine.',
    'sedentary': 'We\'ll start with gentle, accessible approaches that gradually build healthy habits without overwhelming your current routine.'
  };

  return assessments[lifestyle as keyof typeof assessments] || assessments['moderate'];
}

function getPersonalizedApproach(type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery', userData: UserData, answers: QuestionnaireAnswers): string {
  const approaches = {
    'diet': 'Your nutrition plan emphasizes whole, plant-based foods that naturally support your body\'s healing processes. We\'ve considered your dietary preferences and any restrictions to create meals you\'ll actually enjoy.',
    'fitness': 'Your exercise routine balances strength, flexibility, and cardiovascular health using natural movement patterns. Each workout can be adapted to your current fitness level.',
    'skincare': 'Your skincare routine uses only natural, plant-based ingredients that work with your skin type. We\'ve created both morning and evening protocols for optimal results.',
    'wellness': 'Your wellness plan takes a holistic approach, addressing mind, body, and spirit through natural practices that reduce stress and promote overall balance.',
    'recovery': 'Your recovery plan focuses on natural healing methods that support your body\'s inherent ability to repair and regenerate, tailored to your specific needs.'
  };

  return approaches[type as keyof typeof approaches] || approaches['wellness'];
}

function getTimelineExpectations(type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery', userData: UserData): string {
  const duration = userData.duration || '30 days';
  
  const timelines = {
    'diet': `Within the first week, you may notice improved energy and digestion. By the end of ${duration}, expect significant improvements in energy, sleep quality, and overall vitality.`,
    'fitness': `You should feel stronger and more energetic within 2 weeks. By ${duration}, expect noticeable improvements in strength, endurance, and body composition.`,
    'skincare': `Initial improvements often appear within 1-2 weeks. Full transformation typically occurs over ${duration} with consistent application.`,
    'wellness': `Stress reduction and better sleep often improve within the first week. Complete wellness transformation builds over the full ${duration}.`,
    'recovery': `Pain relief and improved mobility can begin within days. Full recovery and prevention strategies will be established over ${duration}.`
  };

  return timelines[type as keyof typeof timelines] || timelines['wellness'];
}

function addDailyPlan(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Daily Implementation Schedule', 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text('Follow this daily structure for optimal results. Adapt timing to fit your lifestyle while maintaining consistency.', 50, 130, { width: 495, lineGap: 5 });

  // Morning routine
  addDailySection(doc, 'Morning Routine (6:00 AM - 9:00 AM)', getMorningRoutine(type, userData, answers), 180);
  
  // Midday activities
  addDailySection(doc, 'Midday Focus (12:00 PM - 2:00 PM)', getMiddayActivities(type, userData, answers), 320);
  
  // Evening routine
  addDailySection(doc, 'Evening Wind-Down (6:00 PM - 9:00 PM)', getEveningRoutine(type, userData, answers), 460);
  
  // Weekly schedule note
  doc.fontSize(12)
     .fillColor('#6B7280')
     .text('Note: This schedule can be adjusted to fit your personal routine. The key is consistency, not perfect timing.', 50, 600, { width: 495, lineGap: 3 });
}

function addDailySection(doc: PDFKit.PDFDocument, title: string, activities: string[], yPosition: number) {
  doc.fontSize(16)
     .fillColor('#10B981')
     .text(title, 50, yPosition);

  let itemY = yPosition + 30;
  activities.forEach(activity => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${activity}`, 70, itemY, { width: 475 });
    itemY += 18;
  });
}

function getMorningRoutine(type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery', userData: UserData, answers: QuestionnaireAnswers): string[] {
  const routines = {
    'diet': [
      'Drink 16oz of warm water with lemon',
      'Prepare and enjoy your planned breakfast',
      'Take your morning supplements (if recommended)',
      'Set intentions for healthy choices throughout the day'
    ],
    'fitness': [
      'Light stretching or mobility work (5-10 minutes)',
      'Hydrate with 16oz of water',
      'Complete your planned morning workout or walk',
      'Prepare a protein-rich breakfast'
    ],
    'skincare': [
      'Gentle face cleansing with lukewarm water',
      'Apply morning skincare routine products',
      'Use natural SPF protection',
      'Hydrate internally with water and herbal tea'
    ],
    'wellness': [
      'Mindfulness practice (5-10 minutes meditation)',
      'Gratitude journaling (3 things)',
      'Gentle stretching or yoga',
      'Nutritious breakfast with intention'
    ],
    'recovery': [
      'Gentle movement assessment (how does your body feel?)',
      'Apply any topical recovery treatments',
      'Hydrate with anti-inflammatory herbal tea',
      'Plan your day around recovery activities'
    ]
  };

  return routines[type as keyof typeof routines] || routines['wellness'];
}

function getMiddayActivities(type: 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery', userData: UserData, answers: QuestionnaireAnswers): string[] {
  const activities = {
    'diet': [
      'Enjoy your planned lunch with mindful eating',
      'Take a 10-minute walk after eating',
      'Prepare healthy snacks for the afternoon',
      'Check hydration levels (aim for clear urine)'
    ],
    'fitness': [
      'Complete main workout session or active movement',
      'Post-workout nutrition within 30 minutes',
      'Active recovery (walk, stretch, or light movement)',
      'Assess energy levels and adjust evening plans'
    ],
    'skincare': [
      'Midday skin check and hydration boost',
      'Reapply natural sun protection if needed',
      'Ensure adequate water intake for skin health',
      'Prepare evening skincare routine products'
    ],
    'wellness': [
      'Mindful lunch break away from screens',
      'Brief stress-reduction practice (breathing exercises)',
      'Connect with nature (even 5 minutes outside)',
      'Assess energy and mood levels'
    ],
    'recovery': [
      'Perform prescribed recovery exercises',
      'Apply heat/cold therapy as recommended',
      'Gentle movement session or physical therapy',
      'Monitor pain levels and progress'
    ]
  };

  return (activities as any)[type] || activities['wellness'];
}

function getEveningRoutine(type: string, userData: UserData, answers: QuestionnaireAnswers): string[] {
  const routines = {
    'diet': [
      'Prepare and enjoy a light, nutritious dinner',
      'Herbal tea or evening supplements',
      'Plan tomorrow\'s meals and snacks',
      'Reflect on the day\'s nutrition choices'
    ],
    'fitness': [
      'Cool-down stretches or yoga (10-15 minutes)',
      'Foam rolling or self-massage',
      'Prepare workout clothes for tomorrow',
      'Track the day\'s physical activity'
    ],
    'skincare': [
      'Thorough evening cleansing routine',
      'Apply overnight treatment products',
      'Silk pillowcase and clean environment prep',
      'Relaxation practices for better sleep'
    ],
    'wellness': [
      'Digital sunset (reduce screen time)',
      'Evening meditation or gratitude practice',
      'Prepare bedroom for optimal sleep',
      'Journal about the day\'s wellness wins'
    ],
    'recovery': [
      'Evening recovery treatments or therapies',
      'Gentle stretching or mobility work',
      'Heat therapy (bath, heating pad) if appropriate',
      'Prepare recovery tools for tomorrow'
    ]
  };

  return routines[type] || routines['wellness'];
}

function addTypeSpecificContent(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  switch (type) {
    case 'diet':
      addDietSpecificContent(doc, userData, answers);
      break;
    case 'fitness':
      addFitnessSpecificContent(doc, userData, answers);
      break;
    case 'skincare':
      addSkincareSpecificContent(doc, userData, answers);
      break;
    case 'wellness':
      addWellnessSpecificContent(doc, userData, answers);
      break;
    case 'recovery':
      addRecoverySpecificContent(doc, userData, answers);
      break;
  }
}

function addDietSpecificContent(doc: PDFKit.PDFDocument, userData: UserData, answers: QuestionnaireAnswers) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Your Meal Plans & Nutrition Guide', 50, 80);

  // Weekly meal plan table
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('7-Day Sample Meal Plan', 50, 140);

  const mealPlan = generateMealPlan(userData, answers);
  let tableY = 170;

  // Table headers
  doc.fontSize(10)
     .fillColor('#374151');
  doc.text('Day', 50, tableY, { width: 60 });
  doc.text('Breakfast', 110, tableY, { width: 120 });
  doc.text('Lunch', 230, tableY, { width: 120 });
  doc.text('Dinner', 350, tableY, { width: 120 });
  doc.text('Snack', 470, tableY, { width: 75 });

  // Draw header line
  doc.rect(50, tableY + 15, 495, 1).fillAndStroke('#E5E7EB', '#E5E7EB');

  // Table rows
  tableY += 25;
  mealPlan.forEach(day => {
    doc.fontSize(9)
       .fillColor('#374151');
    doc.text(day.day, 50, tableY, { width: 60 });
    doc.text(day.breakfast, 110, tableY, { width: 120 });
    doc.text(day.lunch, 230, tableY, { width: 120 });
    doc.text(day.dinner, 350, tableY, { width: 120 });
    doc.text(day.snack, 470, tableY, { width: 75 });
    tableY += 20;
  });

  // Shopping list
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Weekly Shopping List', 50, tableY + 30);

  const shoppingList = generateShoppingList(userData, answers);
  let shoppingY = tableY + 60;

  Object.entries(shoppingList).forEach(([category, items]) => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`${category}:`, 50, shoppingY);
    
    shoppingY += 20;
    items.forEach(item => {
      doc.fontSize(10)
         .fillColor('#6B7280')
         .text(`• ${item}`, 70, shoppingY, { width: 475 });
      shoppingY += 15;
    });
    shoppingY += 10;
  });
}

function generateMealPlan(userData: UserData, answers: QuestionnaireAnswers) {
  // Generate personalized meal plan based on preferences and dietary restrictions
  const preferences = userData.preferences || answers.dietary_preferences || [];
  const isVegetarian = preferences.includes('vegetarian') || preferences.includes('vegan');
  
  return [
    {
      day: 'Monday',
      breakfast: 'Overnight oats with berries and nuts',
      lunch: isVegetarian ? 'Quinoa Buddha bowl with vegetables' : 'Grilled chicken salad with mixed greens',
      dinner: isVegetarian ? 'Lentil curry with brown rice' : 'Baked salmon with roasted vegetables',
      snack: 'Apple slices with almond butter'
    },
    {
      day: 'Tuesday',
      breakfast: 'Green smoothie with spinach and banana',
      lunch: 'Chickpea and vegetable soup',
      dinner: isVegetarian ? 'Black bean tacos with avocado' : 'Turkey and vegetable stir-fry',
      snack: 'Mixed nuts and dried fruit'
    },
    {
      day: 'Wednesday',
      breakfast: 'Chia seed pudding with coconut',
      lunch: isVegetarian ? 'Hummus wrap with vegetables' : 'Tuna salad with whole grain crackers',
      dinner: isVegetarian ? 'Vegetable pasta with marinara' : 'Lean beef with sweet potato',
      snack: 'Greek yogurt with honey'
    },
    {
      day: 'Thursday',
      breakfast: 'Avocado toast with hemp seeds',
      lunch: 'Roasted vegetable and grain bowl',
      dinner: isVegetarian ? 'Stuffed bell peppers with quinoa' : 'Grilled fish with quinoa',
      snack: 'Herbal tea with whole grain toast'
    },
    {
      day: 'Friday',
      breakfast: 'Protein smoothie bowl with toppings',
      lunch: isVegetarian ? 'Mediterranean salad with chickpeas' : 'Chicken and vegetable soup',
      dinner: isVegetarian ? 'Mushroom and barley risotto' : 'Baked cod with vegetables',
      snack: 'Dark chocolate and almonds'
    },
    {
      day: 'Saturday',
      breakfast: 'Weekend pancakes with fruit',
      lunch: 'Farmers market salad',
      dinner: isVegetarian ? 'Eggplant parmesan' : 'Grass-fed steak with salad',
      snack: 'Fresh fruit with coconut'
    },
    {
      day: 'Sunday',
      breakfast: 'Breakfast bowl with eggs/tofu',
      lunch: 'Meal prep containers',
      dinner: 'Family-style healthy meal',
      snack: 'Herbal tea and light snack'
    }
  ];
}

function generateShoppingList(userData: UserData, answers: QuestionnaireAnswers) {
  return {
    'Proteins': [
      'Organic eggs',
      'Wild-caught fish',
      'Grass-fed meat (if not vegetarian)',
      'Organic chicken',
      'Legumes and beans',
      'Nuts and seeds',
      'Quinoa'
    ],
    'Vegetables': [
      'Leafy greens (spinach, kale)',
      'Cruciferous vegetables (broccoli, cauliflower)',
      'Colorful peppers',
      'Root vegetables (sweet potatoes, carrots)',
      'Onions and garlic',
      'Seasonal vegetables'
    ],
    'Fruits': [
      'Berries (blueberries, strawberries)',
      'Citrus fruits',
      'Apples and pears',
      'Bananas',
      'Seasonal fruits',
      'Avocados'
    ],
    'Pantry Staples': [
      'Extra virgin olive oil',
      'Coconut oil',
      'Apple cider vinegar',
      'Herbs and spices',
      'Whole grains',
      'Natural sweeteners'
    ]
  };
}

function addFitnessSpecificContent(doc: PDFKit.PDFDocument, userData: UserData, answers: QuestionnaireAnswers) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Exercise Routines & Workouts', 50, 80);

  const experience = userData.experience || answers.fitness_level || 'beginner';
  
  doc.fontSize(14)
     .fillColor('#374151')
     .text(`Your workouts are designed for ${experience} level, emphasizing natural movement patterns and progressive development.`, 50, 130, { width: 495, lineGap: 5 });

  // Weekly workout schedule
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Weekly Workout Schedule', 50, 180);

  const workoutPlan = generateWorkoutPlan(userData, answers);
  let workoutY = 210;

  workoutPlan.forEach(day => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`${day.day}: ${day.focus}`, 50, workoutY);
    
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(day.description, 70, workoutY + 15, { width: 475 });
    
    workoutY += 50;
  });

  // Exercise demonstrations
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Key Exercise Instructions', 50, workoutY + 20);

  const exercises = getKeyExercises(experience);
  let exerciseY = workoutY + 50;

  exercises.forEach(exercise => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(exercise.name, 50, exerciseY);
    
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(exercise.instructions, 70, exerciseY + 15, { width: 475 });
    
    exerciseY += 60;
  });
}

function generateWorkoutPlan(userData: UserData, answers: QuestionnaireAnswers) {
  const experience = userData.experience || answers.fitness_level || 'beginner';
  
  const plans = {
    'beginner': [
      {
        day: 'Monday',
        focus: 'Full Body Strength',
        description: '20-30 minutes of bodyweight exercises focusing on major muscle groups'
      },
      {
        day: 'Tuesday',
        focus: 'Active Recovery',
        description: 'Gentle yoga or walking for 20-30 minutes'
      },
      {
        day: 'Wednesday',
        focus: 'Cardio & Core',
        description: 'Low-impact cardio with core strengthening exercises'
      },
      {
        day: 'Thursday',
        focus: 'Rest Day',
        description: 'Complete rest or light stretching'
      },
      {
        day: 'Friday',
        focus: 'Upper Body',
        description: 'Focus on arms, shoulders, and back strength'
      },
      {
        day: 'Saturday',
        focus: 'Lower Body',
        description: 'Leg and glute strengthening exercises'
      },
      {
        day: 'Sunday',
        focus: 'Flexibility',
        description: 'Full body stretching and mobility work'
      }
    ],
    'intermediate': [
      {
        day: 'Monday',
        focus: 'Upper Body Strength',
        description: '45 minutes of upper body resistance training'
      },
      {
        day: 'Tuesday',
        focus: 'HIIT Cardio',
        description: '30 minutes high-intensity interval training'
      },
      {
        day: 'Wednesday',
        focus: 'Lower Body Strength',
        description: '45 minutes focusing on legs and glutes'
      },
      {
        day: 'Thursday',
        focus: 'Active Recovery',
        description: 'Yoga or light cardio for 30 minutes'
      },
      {
        day: 'Friday',
        focus: 'Full Body Circuit',
        description: 'Circuit training combining strength and cardio'
      },
      {
        day: 'Saturday',
        focus: 'Outdoor Activity',
        description: 'Hiking, cycling, or sports activity'
      },
      {
        day: 'Sunday',
        focus: 'Flexibility & Core',
        description: 'Deep stretching and core strengthening'
      }
    ]
  };

  return plans[experience] || plans['beginner'];
}

function getKeyExercises(experience: string) {
  const exercises = {
    'beginner': [
      {
        name: 'Bodyweight Squat',
        instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair, keeping your chest up and knees tracking over your toes. Return to standing. Start with 10-15 repetitions.'
      },
      {
        name: 'Modified Push-Up',
        instructions: 'Start on your knees with hands placed slightly wider than shoulders. Lower your chest toward the ground, then push back up. Keep your body in a straight line from knees to head. Aim for 5-10 repetitions.'
      },
      {
        name: 'Plank Hold',
        instructions: 'Start in a push-up position, then lower to your forearms. Keep your body straight from head to heels. Hold for 15-30 seconds, building up over time.'
      }
    ],
    'intermediate': [
      {
        name: 'Full Push-Up',
        instructions: 'Start in plank position with hands under shoulders. Lower your body until chest nearly touches the ground, then push back up. Keep core engaged throughout. Aim for 10-20 repetitions.'
      },
      {
        name: 'Single-Leg Glute Bridge',
        instructions: 'Lie on your back with one foot flat on the ground. Extend the other leg straight up. Lift your hips by squeezing your glutes. Hold for 2 seconds, then lower. 10-15 reps per leg.'
      },
      {
        name: 'Mountain Climbers',
        instructions: 'Start in plank position. Quickly alternate bringing your knees toward your chest, as if running in place. Keep your core tight and maintain good form. 30-60 seconds.'
      }
    ]
  };

  return exercises[experience] || exercises['beginner'];
}

function addSkincareSpecificContent(doc: PDFKit.PDFDocument, userData: UserData, answers: QuestionnaireAnswers) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Natural Skincare Routines', 50, 80);

  // Morning routine
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Morning Routine (5-7 steps)', 50, 130);

  const morningSteps = [
    'Gentle cleansing with lukewarm water',
    'Apply antioxidant serum (Vitamin C)',
    'Moisturize with natural ingredients',
    'Apply broad-spectrum natural SPF 30+',
    'Hydrate internally with water'
  ];

  let stepY = 160;
  morningSteps.forEach((step, index) => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`${index + 1}. ${step}`, 70, stepY, { width: 475 });
    stepY += 25;
  });

  // Evening routine
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Evening Routine (6-8 steps)', 50, stepY + 20);

  const eveningSteps = [
    'Remove makeup/sunscreen with oil cleanser',
    'Second cleanse with gentle water-based cleanser',
    'Apply hydrating toner or essence',
    'Use treatment serum (retinol alternative)',
    'Apply rich night moisturizer',
    'Use facial oil for extra nourishment (optional)'
  ];

  stepY += 50;
  eveningSteps.forEach((step, index) => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`${index + 1}. ${step}`, 70, stepY, { width: 475 });
    stepY += 25;
  });

  // Natural ingredients guide
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Beneficial Natural Ingredients', 50, stepY + 30);

  const ingredients = [
    { name: 'Aloe Vera', benefit: 'Soothes and hydrates irritated skin' },
    { name: 'Rosehip Oil', benefit: 'Rich in vitamins A and C, promotes regeneration' },
    { name: 'Hyaluronic Acid', benefit: 'Holds 1000x its weight in water for hydration' },
    { name: 'Green Tea Extract', benefit: 'Powerful antioxidant with anti-inflammatory properties' },
    { name: 'Jojoba Oil', benefit: 'Mimics skin\'s natural sebum, balances oil production' }
  ];

  stepY += 60;
  ingredients.forEach(ingredient => {
    doc.fontSize(11)
       .fillColor('#374151')
       .text(`${ingredient.name}:`, 70, stepY);
    
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(ingredient.benefit, 160, stepY, { width: 385 });
    
    stepY += 20;
  });
}

function addWellnessSpecificContent(doc: PDFKit.PDFDocument, userData: UserData, answers: QuestionnaireAnswers) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Holistic Wellness Practices', 50, 80);

  // Mindfulness section
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Daily Mindfulness Practices', 50, 130);

  const mindfulnessPractices = [
    'Morning meditation (5-15 minutes)',
    'Mindful breathing exercises throughout the day',
    'Gratitude journaling (3 things daily)',
    'Body scan relaxation before bed',
    'Mindful eating practices'
  ];

  let practiceY = 160;
  mindfulnessPractices.forEach(practice => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${practice}`, 70, practiceY, { width: 475 });
    practiceY += 20;
  });

  // Sleep optimization
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Sleep Hygiene Protocol', 50, practiceY + 30);

  const sleepTips = [
    'Maintain consistent sleep/wake times',
    'Create a relaxing bedtime routine',
    'Keep bedroom cool, dark, and quiet',
    'Avoid screens 1 hour before bed',
    'Use natural sleep aids (chamomile tea, magnesium)',
    'Get morning sunlight exposure'
  ];

  practiceY += 60;
  sleepTips.forEach(tip => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${tip}`, 70, practiceY, { width: 475 });
    practiceY += 20;
  });

  // Stress management
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Natural Stress Management', 50, practiceY + 30);

  const stressManagement = [
    'Deep breathing exercises (4-7-8 technique)',
    'Progressive muscle relaxation',
    'Nature connection (outdoor time)',
    'Social support and community',
    'Creative expression and hobbies',
    'Regular physical movement'
  ];

  practiceY += 60;
  stressManagement.forEach(technique => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${technique}`, 70, practiceY, { width: 475 });
    practiceY += 20;
  });
}

function addRecoverySpecificContent(doc: PDFKit.PDFDocument, userData: UserData, answers: QuestionnaireAnswers) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Natural Recovery & Healing Protocols', 50, 80);

  // Recovery phases
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Recovery Phase Approach', 50, 130);

  const phases = [
    {
      phase: 'Acute Phase (Days 1-3)',
      approach: 'Focus on rest, ice/heat therapy, and gentle movement within pain-free range'
    },
    {
      phase: 'Sub-acute Phase (Days 4-14)',
      approach: 'Gradually increase movement, incorporate gentle stretching and light exercises'
    },
    {
      phase: 'Recovery Phase (Week 3+)',
      approach: 'Progressive strengthening, return to normal activities, prevention strategies'
    }
  ];

  let phaseY = 160;
  phases.forEach(phase => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`${phase.phase}:`, 70, phaseY);
    
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(phase.approach, 70, phaseY + 15, { width: 475 });
    
    phaseY += 50;
  });

  // Natural healing methods
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Natural Healing Methods', 50, phaseY + 20);

  const healingMethods = [
    { method: 'Turmeric & Ginger', use: 'Natural anti-inflammatory supplements or teas' },
    { method: 'Arnica Topical', use: 'Apply to bruises and muscle soreness' },
    { method: 'Epsom Salt Baths', use: 'Muscle relaxation and magnesium absorption' },
    { method: 'Heat/Cold Therapy', use: 'Alternate for circulation and pain relief' },
    { method: 'Gentle Movement', use: 'Prevent stiffness while promoting healing' }
  ];

  phaseY += 50;
  healingMethods.forEach(method => {
    doc.fontSize(11)
       .fillColor('#374151')
       .text(`${method.method}:`, 70, phaseY);
    
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(method.use, 170, phaseY, { width: 375 });
    
    phaseY += 25;
  });

  // Prevention strategies
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Prevention Strategies', 50, phaseY + 30);

  const prevention = [
    'Regular mobility and flexibility work',
    'Proper warm-up before activities',
    'Gradual progression in exercise intensity',
    'Adequate sleep and recovery time',
    'Stress management practices',
    'Proper nutrition for tissue repair'
  ];

  phaseY += 60;
  prevention.forEach(strategy => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${strategy}`, 70, phaseY, { width: 475 });
    phaseY += 20;
  });
}

function addProgressTracking(doc: PDFKit.PDFDocument, type: string, userData: UserData) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Progress Tracking Tools', 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text('Use these tracking tools to monitor your progress and stay motivated throughout your journey.', 50, 130, { width: 495, lineGap: 5 });

  // Weekly tracking checklist
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Weekly Progress Checklist', 50, 180);

  const trackingItems = getTrackingItems(type);
  let trackingY = 210;

  // Create a simple table for weekly tracking
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  // Headers
  doc.fontSize(10)
     .fillColor('#374151');
  doc.text('Progress Item', 50, trackingY, { width: 200 });
  weeks.forEach((week, index) => {
    doc.text(week, 250 + (index * 70), trackingY, { width: 65, align: 'center' });
  });

  trackingY += 20;
  doc.rect(50, trackingY, 495, 1).fillAndStroke('#E5E7EB', '#E5E7EB');
  trackingY += 10;

  // Tracking items
  trackingItems.forEach(item => {
    doc.fontSize(9)
       .fillColor('#374151')
       .text(item, 50, trackingY, { width: 195 });

    // Checkbox squares for each week
    weeks.forEach((_, index) => {
      const x = 275 + (index * 70);
      doc.rect(x, trackingY + 2, 10, 10).stroke('#9CA3AF');
    });

    trackingY += 25;
  });

  // Daily habit tracker
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Daily Habit Tracker', 50, trackingY + 40);

  doc.fontSize(12)
     .fillColor('#6B7280')
     .text('Mark each day you complete your planned activities. Aim for consistency rather than perfection.', 50, trackingY + 70, { width: 495, lineGap: 3 });

  // Simple 30-day grid
  let gridY = trackingY + 110;
  const daysPerRow = 10;
  const boxSize = 20;

  for (let day = 1; day <= 30; day++) {
    const row = Math.floor((day - 1) / daysPerRow);
    const col = (day - 1) % daysPerRow;
    const x = 50 + (col * (boxSize + 5));
    const y = gridY + (row * (boxSize + 5));

    doc.rect(x, y, boxSize, boxSize).stroke('#9CA3AF');
    doc.fontSize(8)
       .fillColor('#6B7280')
       .text(day.toString(), x + 6, y + 6, { width: boxSize, align: 'center' });
  }
}

function getTrackingItems(type: string): string[] {
  const items = {
    'diet': [
      'Followed meal plan',
      'Drank adequate water',
      'Took recommended supplements',
      'Practiced mindful eating',
      'Energy levels (1-10)',
      'Digestive comfort (1-10)',
      'Overall satisfaction (1-10)'
    ],
    'fitness': [
      'Completed planned workout',
      'Did warm-up/cool-down',
      'Adequate sleep (7+ hours)',
      'Recovery practices',
      'Strength improvements',
      'Endurance improvements',
      'Motivation level (1-10)'
    ],
    'skincare': [
      'Morning routine completed',
      'Evening routine completed',
      'SPF application',
      'Adequate water intake',
      'Skin appearance (1-10)',
      'Skin comfort (1-10)',
      'Product reactions noted'
    ],
    'wellness': [
      'Meditation/mindfulness practice',
      'Gratitude journaling',
      'Adequate sleep',
      'Stress management',
      'Physical activity',
      'Social connection',
      'Overall well-being (1-10)'
    ],
    'recovery': [
      'Recovery exercises completed',
      'Pain management techniques',
      'Sleep quality',
      'Movement/mobility work',
      'Pain level (1-10)',
      'Function level (1-10)',
      'Healing progress (1-10)'
    ]
  };

  return items[type] || items['wellness'];
}

function addTroubleshootingGuide(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Troubleshooting Guide', 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text('Common challenges and their natural solutions. Remember, setbacks are normal - what matters is getting back on track.', 50, 130, { width: 495, lineGap: 5 });

  const troubleshootingItems = getTroubleshootingItems(type);
  let troubleY = 180;

  troubleshootingItems.forEach(item => {
    doc.fontSize(12)
       .fillColor('#DC2626')
       .text(`Problem: ${item.problem}`, 50, troubleY);

    doc.fontSize(11)
       .fillColor('#374151')
       .text(`Solution: ${item.solution}`, 50, troubleY + 20, { width: 495, lineGap: 3 });

    troubleY += 70;
  });

  // When to seek professional help
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('When to Seek Professional Help', 50, troubleY + 20);

  const professionalHelp = getProfessionalHelpGuidance(type);
  doc.fontSize(12)
     .fillColor('#374151')
     .text(professionalHelp, 50, troubleY + 50, { width: 495, lineGap: 5 });
}

function getTroubleshootingItems(type: string) {
  const items = {
    'diet': [
      {
        problem: 'Feeling hungry between meals',
        solution: 'Increase protein and fiber at meals. Add healthy snacks like nuts, seeds, or vegetables with hummus. Ensure adequate hydration as thirst can mimic hunger.'
      },
      {
        problem: 'Cravings for unhealthy foods',
        solution: 'Keep healthy alternatives readily available. Practice mindful eating and identify emotional triggers. Ensure you\'re getting enough sleep and managing stress.'
      },
      {
        problem: 'Digestive discomfort',
        solution: 'Introduce fiber gradually. Chew food thoroughly and eat slowly. Consider digestive enzymes or probiotics. Stay hydrated and reduce stress.'
      }
    ],
    'fitness': [
      {
        problem: 'Lack of motivation to exercise',
        solution: 'Start with just 5-10 minutes. Find activities you enjoy. Exercise with a friend or group. Track your progress and celebrate small wins.'
      },
      {
        problem: 'Muscle soreness or fatigue',
        solution: 'Ensure adequate rest between workouts. Focus on proper warm-up and cool-down. Get sufficient sleep and nutrition. Consider reducing intensity temporarily.'
      },
      {
        problem: 'Not seeing results fast enough',
        solution: 'Focus on how you feel rather than just appearance. Take body measurements and photos. Be patient - sustainable changes take time. Adjust your program if needed.'
      }
    ],
    'skincare': [
      {
        problem: 'Skin irritation or breakouts',
        solution: 'Simplify your routine and introduce products one at a time. Check for ingredient sensitivities. Ensure proper cleansing and avoid over-exfoliation.'
      },
      {
        problem: 'Not seeing improvements',
        solution: 'Give products 6-8 weeks to show results. Ensure consistent application. Consider factors like hormones, stress, and diet that affect skin health.'
      },
      {
        problem: 'Routine feels too time-consuming',
        solution: 'Simplify to essential steps: cleanse, moisturize, SPF (morning). You can build complexity gradually as habits form.'
      }
    ],
    'wellness': [
      {
        problem: 'Difficulty maintaining meditation practice',
        solution: 'Start with just 2-3 minutes daily. Use guided meditations or apps. Try different styles to find what works. Be consistent with timing and location.'
      },
      {
        problem: 'High stress levels persist',
        solution: 'Combine multiple stress-reduction techniques. Prioritize sleep and nutrition. Consider professional counseling if stress is overwhelming.'
      },
      {
        problem: 'Poor sleep quality',
        solution: 'Maintain consistent sleep schedule. Create a relaxing bedtime routine. Limit screens before bed. Address any underlying anxiety or physical discomfort.'
      }
    ],
    'recovery': [
      {
        problem: 'Pain levels not improving',
        solution: 'Ensure you\'re not overdoing activities. Apply ice for acute injuries, heat for muscle tension. Consider gentle movement rather than complete rest.'
      },
      {
        problem: 'Recovery feels too slow',
        solution: 'Healing takes time - be patient with your body. Focus on what you can do rather than limitations. Maintain positive mindset and stress management.'
      },
      {
        problem: 'Fear of re-injury',
        solution: 'Gradually increase activity levels. Focus on proper form and technique. Build confidence through small, achievable goals.'
      }
    ]
  };

  return items[type] || items['wellness'];
}

function getProfessionalHelpGuidance(type: string): string {
  const guidance = {
    'diet': 'Consult a registered dietitian if you have persistent digestive issues, eating disorders, or complex medical conditions requiring specialized nutrition advice.',
    'fitness': 'See a healthcare provider if you experience chest pain, dizziness, or joint pain during exercise. A physical therapist can help with movement limitations.',
    'skincare': 'Consult a dermatologist for persistent acne, unusual moles or growths, severe reactions, or conditions that don\'t improve with consistent care.',
    'wellness': 'Seek professional mental health support if stress, anxiety, or depression significantly impacts your daily life or if you have thoughts of self-harm.',
    'recovery': 'Contact a healthcare provider if pain worsens, you experience numbness/tingling, or if there\'s no improvement after several weeks of appropriate care.'
  };

  return guidance[type] || guidance['wellness'];
}

function addResourcesAndShopping(
  doc: PDFKit.PDFDocument,
  type: string,
  userData: UserData,
  answers: QuestionnaireAnswers
) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Resources & Shopping Guide', 50, 80);

  // Essential items shopping list
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Essential Items Checklist', 50, 130);

  const essentialItems = getEssentialItems(type);
  let itemY = 160;

  essentialItems.forEach(category => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(category.category, 50, itemY);

    itemY += 20;
    category.items.forEach(item => {
      doc.fontSize(10)
         .fillColor('#6B7280')
         .text(`☐ ${item}`, 70, itemY, { width: 475 });
      itemY += 15;
    });
    itemY += 10;
  });

  // Recommended brands/sources
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Where to Shop', 50, itemY + 20);

  const shoppingSources = getShoppingSources(type);
  itemY += 50;

  shoppingSources.forEach(source => {
    doc.fontSize(11)
       .fillColor('#374151')
       .text(`${source.category}:`, 50, itemY);

    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(source.description, 70, itemY + 15, { width: 475 });

    itemY += 40;
  });

  // Online resources
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Additional Resources', 50, itemY + 20);

  doc.fontSize(12)
     .fillColor('#374151')
     .text('Visit plantrxapp.com for:', 50, itemY + 50, { width: 495 });

  const onlineResources = [
    'Updated recipes and meal plans',
    'Video exercise demonstrations',
    'Expert consultations and Q&A',
    'Community support forums',
    'Progress tracking tools',
    'Latest natural health research'
  ];

  itemY += 80;
  onlineResources.forEach(resource => {
    doc.fontSize(10)
       .fillColor('#6B7280')
       .text(`• ${resource}`, 70, itemY, { width: 475 });
    itemY += 18;
  });
}

function getEssentialItems(type: string) {
  const items = {
    'diet': [
      {
        category: 'Kitchen Equipment',
        items: ['Sharp chef\'s knife', 'Cutting boards', 'Glass storage containers', 'Blender or food processor', 'Measuring cups and spoons']
      },
      {
        category: 'Pantry Staples',
        items: ['Extra virgin olive oil', 'Coconut oil', 'Apple cider vinegar', 'Sea salt', 'Herbs and spices', 'Whole grains', 'Legumes and beans']
      },
      {
        category: 'Fresh Ingredients',
        items: ['Organic vegetables', 'Fresh fruits', 'Nuts and seeds', 'High-quality proteins', 'Fresh herbs']
      }
    ],
    'fitness': [
      {
        category: 'Basic Equipment',
        items: ['Yoga mat', 'Resistance bands', 'Light dumbbells (if desired)', 'Water bottle', 'Comfortable workout clothes']
      },
      {
        category: 'Recovery Tools',
        items: ['Foam roller', 'Tennis ball for self-massage', 'Heat pack', 'Ice pack', 'Comfortable walking shoes']
      }
    ],
    'skincare': [
      {
        category: 'Basic Products',
        items: ['Gentle cleanser', 'Moisturizer', 'Natural SPF', 'Face towels', 'Silk or satin pillowcase']
      },
      {
        category: 'Natural Ingredients',
        items: ['Aloe vera gel', 'Jojoba oil', 'Rose water', 'Raw honey', 'Oatmeal for masks']
      }
    ],
    'wellness': [
      {
        category: 'Mindfulness Tools',
        items: ['Journal and pen', 'Meditation cushion or chair', 'Essential oils', 'Herbal teas', 'Books on wellness']
      },
      {
        category: 'Sleep Environment',
        items: ['Blackout curtains', 'Comfortable pillows', 'White noise machine (optional)', 'Room temperature control']
      }
    ],
    'recovery': [
      {
        category: 'Recovery Tools',
        items: ['Heat pack', 'Ice pack', 'Compression garments', 'Supportive pillows', 'Topical pain relief']
      },
      {
        category: 'Natural Remedies',
        items: ['Turmeric supplements', 'Epsom salts', 'Arnica gel', 'Anti-inflammatory teas', 'Magnesium supplements']
      }
    ]
  };

  return items[type] || items['wellness'];
}

function getShoppingSources(type: string) {
  return [
    {
      category: 'Health Food Stores',
      description: 'Local health food stores often carry organic, natural products and can provide personalized recommendations.'
    },
    {
      category: 'Online Retailers',
      description: 'Convenient for bulk ordering and accessing specialty items. Look for certified organic and sustainably sourced products.'
    },
    {
      category: 'Farmers Markets',
      description: 'Fresh, local, seasonal produce often at competitive prices. Great for connecting with local growers.'
    },
    {
      category: 'Pharmacy/Natural Health Section',
      description: 'Many pharmacies now carry natural health products, supplements, and organic personal care items.'
    }
  ];
}

function addClosingPage(doc: PDFKit.PDFDocument, type: string, userData: UserData) {
  doc.fontSize(24)
     .fillColor('#1F2937')
     .text('Your Journey Begins Now', 50, 80);

  doc.fontSize(14)
     .fillColor('#374151')
     .text(`Congratulations, ${userData.name}! You now have a comprehensive, personalized ${getPlanTitle(type).toLowerCase()} designed specifically for your needs and goals.`, 50, 130, { width: 495, lineGap: 5 });

  // Key reminders
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Remember These Key Points:', 50, 200);

  const keyPoints = [
    'Consistency beats perfection - small daily actions create lasting change',
    'Listen to your body and adjust the plan as needed',
    'Celebrate small wins along the way',
    'Be patient with yourself - transformation takes time',
    'Reach out for support when you need it'
  ];

  let pointY = 230;
  keyPoints.forEach(point => {
    doc.fontSize(12)
       .fillColor('#374151')
       .text(`• ${point}`, 70, pointY, { width: 475 });
    pointY += 25;
  });

  // Success commitment
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('Your Commitment to Success:', 50, pointY + 30);

  doc.fontSize(12)
     .fillColor('#374151')
     .text(`I, ${userData.name}, commit to following this natural health plan for ${userData.duration || '30 days'} and giving my best effort to achieve my health goals.`, 50, pointY + 60, { width: 495, lineGap: 5 });

  // Signature line
  doc.fontSize(10)
     .fillColor('#6B7280')
     .text('Signature: ________________________    Date: ___________', 50, pointY + 120);

  // PlantRx support
  doc.fontSize(14)
     .fillColor('#10B981')
     .text('PlantRx Support', 50, pointY + 180);

  doc.fontSize(12)
     .fillColor('#374151')
     .text('Need help or have questions? Visit plantrxapp.com for expert consultations, community support, and additional resources to help you succeed on your natural health journey.', 50, pointY + 210, { width: 495, lineGap: 5 });

  // Final motivation
  doc.fontSize(12)
     .fillColor('#6B7280')
     .text('Your health is your greatest wealth. Invest in it naturally, consistently, and with confidence.', 50, pointY + 280, { width: 495, lineGap: 5, align: 'center' });

  // PlantRx branding
  doc.fontSize(16)
     .fillColor('#10B981')
     .text('PlantRx', 50, pointY + 330, { align: 'center', width: 495 });

  doc.fontSize(10)
     .fillColor('#6B7280')
     .text('Expert Natural Health Platform • plantrxapp.com', 50, pointY + 355, { align: 'center', width: 495 });
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  try {
    const range = doc.bufferedPageRange();
    const totalPages = range.count;
    
    // Safety check - ensure we have pages to number
    if (totalPages <= 0) {
      console.warn('[PDF] No pages to number');
      return;
    }
    
    // Alternative approach: Just add page numbers to current page
    // This avoids the switchToPage issue entirely
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Try to switch to page safely
      try {
        // Use 0-based indexing for PDFKit
        const pageIndex = pageNum - 1;
        if (pageIndex >= 0 && pageIndex < totalPages) {
          doc.switchToPage(pageIndex);
          
          // Page number in footer (display as 1-based)
          doc.fontSize(10)
             .fillColor('#9CA3AF')
             .text(`Page ${pageNum} of ${totalPages}`, 50, 770, { width: 495, align: 'center' });
          
          // PlantRx branding in footer
          doc.fontSize(8)
             .fillColor('#D1D5DB')
             .text('PlantRx • plantrxapp.com', 50, 785, { width: 495, align: 'center' });
        }
      } catch (pageError) {
        console.warn(`[PDF] Could not add page number to page ${pageNum}:`, pageError.message);
        // Continue with other pages
      }
    }
  } catch (error) {
    console.warn('[PDF] Page numbering failed, continuing without page numbers:', error.message);
    // Don't throw - let PDF generation continue
  }
}