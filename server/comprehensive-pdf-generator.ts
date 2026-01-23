import PDFDocument from 'pdfkit';

interface UserInfo {
  name: string;
  goal: string;
  level: string;
  duration: string;
}

interface QuestionnaireAnswers {
  age?: string;
  gender?: string;
  fitnessLevel?: string;
  currentActivity?: string;
  goals?: string[];
  timeAvailable?: string;
  equipment?: string[];
  injuries?: string;
  motivation?: string;
  experience?: string;
  diet?: string;
  supplements?: string;
  budget?: string;
  cooking_time?: string;
  foods_avoid?: string;
  primaryGoal?: string;
  experienceLevel?: string;
  [key: string]: any;
}

export function generateComprehensivePDF(type: string, userInfo: UserInfo, answers: QuestionnaireAnswers = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `PlantRx ${type.charAt(0).toUpperCase() + type.slice(1)} Transformation Guide`,
          Author: 'PlantRx Health Platform',
          Subject: `Personalized ${userInfo.duration} ${type} plan for ${userInfo.name}`,
          Keywords: `${type}, health, wellness, transformation, personalized plan`
        }
      });
      
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);
      
      // Generate comprehensive, personalized content
      generatePremiumPDFContent(doc, type, userInfo, answers);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generatePremiumPDFContent(doc: PDFKit.PDFDocument, type: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const planName = type.charAt(0).toUpperCase() + type.slice(1);
  const duration = userInfo.duration || '7 days';
  const currentDate = new Date().toLocaleDateString();
  const durationDays = parseInt(duration.split(' ')[0]) || 7;
  
  // COVER PAGE - Premium Design
  addCoverPage(doc, planName, duration, userInfo, currentDate);
  
  // TABLE OF CONTENTS
  addTableOfContents(doc, planName, currentDate);
  
  // PERSONALIZED WELCOME & ASSESSMENT
  addPersonalizedWelcome(doc, planName, userInfo, answers, currentDate);
  
  // IMPLEMENTATION PROTOCOL
  addImplementationProtocol(doc, planName, durationDays, currentDate);
  
  // PERSONALIZED DAILY SCHEDULES
  addPersonalizedSchedules(doc, planName, userInfo, answers, currentDate);
  
  // DETAILED NUTRITION PLAN
  addDetailedNutritionPlan(doc, planName, userInfo, answers, currentDate);
  
  // EXERCISE/WELLNESS PROTOCOLS  
  addExerciseProtocols(doc, type, planName, userInfo, answers, currentDate);
  
  // SHOPPING LISTS & PROCUREMENT
  addShoppingLists(doc, planName, userInfo, answers, currentDate);
  
  // PROGRESS TRACKING SYSTEM
  addProgressTracking(doc, planName, userInfo, currentDate);
  
  // TROUBLESHOOTING GUIDE
  addTroubleshootingGuide(doc, planName, userInfo, answers, currentDate);
  
  // BONUS CONTENT
  addBonusContent(doc, planName, userInfo, answers, currentDate);
  
  // SUCCESS METRICS & GUARANTEES
  addSuccessMetrics(doc, planName, userInfo, answers, currentDate);
}

function addCoverPage(doc: PDFKit.PDFDocument, planName: string, duration: string, userInfo: UserInfo, currentDate: string) {
  // Premium Cover Design
  doc.fontSize(36)
     .fillColor('#16a34a')
     .text(`${duration} ${planName}`, 50, 100, { width: 495, align: 'center' });
  
  doc.fontSize(42)
     .fillColor('#059669')
     .text('TRANSFORMATION', 50, 150, { width: 495, align: 'center' });
     
  doc.fontSize(32)
     .fillColor('#333')
     .text('GUIDE', 50, 200, { width: 495, align: 'center' });
  
  // Personalized subtitle
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text(`Exclusively Designed for ${userInfo.name}`, 50, 280, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#555')
     .text(`Goal: ${userInfo.goal} | Level: ${userInfo.level}`, 50, 320, { width: 495, align: 'center' });
  
  // Premium description
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Your comprehensive ${duration} transformation blueprint with personalized protocols, daily schedules, tracking systems, shopping lists, and expert guidance. This professional guide contains everything you need to achieve sustainable results and lasting lifestyle transformation.`, 75, 380, { width: 445, align: 'center', lineGap: 4 });
  
  // Professional overview box
  doc.rect(50, 450, 495, 140).strokeColor('#16a34a').stroke();
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('Your Personalized Plan Overview', 70, 470);
  
  doc.fontSize(11)
     .fillColor('#333')
     .text(`✓ Duration: ${duration} comprehensive program`, 70, 500)
     .text(`✓ Designed for: ${userInfo.level} level individuals`, 70, 520)
     .text(`✓ Primary Goal: ${userInfo.goal}`, 70, 540)
     .text(`✓ Created: ${currentDate} | 25+ pages of expert content`, 70, 560);
  
  // Footer branding
  doc.fontSize(10)
     .fillColor('#16a34a')
     .text('PlantRx Premium Health Platform', 50, 750, { width: 300 })
     .fillColor('#666')
     .text(`Generated ${currentDate}`, 350, 750, { width: 195, align: 'right' });
}

function addTableOfContents(doc: PDFKit.PDFDocument, planName: string, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(24)
     .fillColor('#16a34a')
     .text('Table of Contents', 50, 80);
  
  const sections = [
    { title: 'Your Personalized Assessment & Welcome', page: 3 },
    { title: 'Precision Implementation Protocol', page: 4 },
    { title: 'Customized Daily Schedules & Time Blocks', page: 6 },
    { title: 'Advanced Nutritional Architecture', page: 8 },
    { title: `${planName} Exercise & Wellness Protocols`, page: 10 },
    { title: 'Complete Shopping Lists & Procurement Guide', page: 12 },
    { title: 'Progress Tracking & Analytics System', page: 14 },
    { title: 'Troubleshooting & Optimization Guide', page: 16 },
    { title: 'Bonus Content & Advanced Strategies', page: 18 },
    { title: 'Success Metrics & Performance Guarantees', page: 20 },
    { title: 'Appendix: Resources & References', page: 22 }
  ];
  
  let yPos = 130;
  sections.forEach((section, index) => {
    // Dotted line effect
    doc.fontSize(12)
       .fillColor('#333')
       .text(`${index + 1}. ${section.title}`, 70, yPos);
    
    // Dots for professional look
    let dotX = 450;
    while (dotX > 400) {
      doc.text('.', dotX, yPos);
      dotX -= 8;
    }
    
    doc.text(`${section.page}`, 460, yPos);
    yPos += 25;
  });
  
  // Add page footer
  addPageFooter(doc, planName, 2, currentDate);
}

function addPersonalizedWelcome(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(22)
     .fillColor('#16a34a')
     .text(`Welcome to Your Personal ${planName} Transformation, ${userInfo.name}!`, 50, 80, { width: 495 });
  
  // Personalized assessment based on answers
  doc.fontSize(14)
     .fillColor('#333')
     .text('Your Personalized Profile Analysis', 50, 130);
  
  let yPos = 160;
  
  // Age and demographic customization
  if (answers.age) {
    doc.fontSize(11)
       .fillColor('#555')
       .text(`• Age Group: ${answers.age} - Protocols optimized for your life stage and metabolic needs`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Goal-specific messaging
  if (answers.primaryGoal || userInfo.goal) {
    const goal = answers.primaryGoal || userInfo.goal;
    doc.text(`• Primary Objective: ${goal} - Every recommendation tailored to accelerate your progress`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Experience level customization
  if (answers.experienceLevel || answers.experience || userInfo.level) {
    const level = answers.experienceLevel || answers.experience || userInfo.level;
    doc.text(`• Experience Level: ${level} - Difficulty and progression matched to your capabilities`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Budget considerations
  if (answers.budget) {
    doc.text(`• Budget Preference: ${answers.budget} - Recommendations filtered for your financial comfort zone`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Time availability
  if (answers.timeAvailable || answers.cooking_time) {
    const time = answers.timeAvailable || answers.cooking_time;
    doc.text(`• Time Availability: ${time} - Schedules designed to fit your lifestyle constraints`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Dietary restrictions
  if (answers.foods_avoid) {
    doc.text(`• Dietary Restrictions: ${answers.foods_avoid} - All meals and supplements carefully selected`, 70, yPos, { width: 460 });
    yPos += 20;
  }
  
  // Motivation and challenges
  yPos += 20;
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('What Makes This Plan Special for You', 50, yPos);
  
  yPos += 30;
  doc.fontSize(11)
     .fillColor('#333')
     .text(`This isn't a generic template. Every recommendation, schedule, and strategy has been specifically chosen based on your responses to create the most effective path to achieving "${userInfo.goal}". Here's what you can expect:`, 70, yPos, { width: 460, lineGap: 3 });
  
  yPos += 60;
  const benefits = [
    '✓ Personalized daily schedules that work with YOUR lifestyle',
    '✓ Food recommendations that match your preferences and restrictions', 
    '✓ Exercise protocols appropriate for your current fitness level',
    '✓ Realistic timelines based on your available commitment',
    '✓ Troubleshooting solutions for your specific challenges',
    '✓ Progress tracking metrics relevant to your goals'
  ];
  
  benefits.forEach(benefit => {
    doc.fillColor('#059669')
       .text(benefit, 70, yPos, { width: 460 });
    yPos += 22;
  });
  
  addPageFooter(doc, planName, 3, currentDate);
}

function addImplementationProtocol(doc: PDFKit.PDFDocument, planName: string, durationDays: number, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('PRECISION IMPLEMENTATION PROTOCOL', 50, 80);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text('Your step-by-step roadmap for guaranteed success. Each phase is scientifically designed for optimal results.', 50, 110, { width: 495 });
  
  // Phase 1
  let yPos = 150;
  doc.fontSize(16)
     .fillColor('#333')
     .text(`PHASE 1: FOUNDATION ESTABLISHMENT (Days 1-${Math.ceil(durationDays / 3)})`, 50, yPos);
  
  yPos += 30;
  const phase1Tasks = [
    'Complete baseline assessments and measurements',
    'Set up your tracking systems and environment',
    'Begin habit stacking with existing routines',
    'Start with 50% intensity to build consistency',
    'Establish daily check-in and reflection practices',
    'Create your support system and accountability measures'
  ];
  
  phase1Tasks.forEach(task => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`• ${task}`, 70, yPos, { width: 460 });
    yPos += 18;
  });
  
  // Phase 2
  yPos += 20;
  doc.fontSize(16)
     .fillColor('#333')
     .text(`PHASE 2: SYSTEM INTEGRATION (Days ${Math.ceil(durationDays / 3) + 1}-${Math.ceil(durationDays * 2 / 3)})`, 50, yPos);
  
  yPos += 30;
  const phase2Tasks = [
    'Increase intensity to full protocol specifications',
    'Optimize timing and efficiency of daily routines',
    'Implement advanced tracking and analytics',
    'Fine-tune nutrition timing and portions',
    'Address any obstacles or plateau points',
    'Build momentum through small wins and celebrations'
  ];
  
  phase2Tasks.forEach(task => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`• ${task}`, 70, yPos, { width: 460 });
    yPos += 18;
  });
  
  // Phase 3
  yPos += 20;
  doc.fontSize(16)
     .fillColor('#333')
     .text(`PHASE 3: OPTIMIZATION & MASTERY (Days ${Math.ceil(durationDays * 2 / 3) + 1}+)`, 50, yPos);
  
  yPos += 30;
  const phase3Tasks = [
    'Master advanced techniques and protocols',
    'Implement personalized modifications based on results',
    'Develop long-term sustainability strategies',
    'Create transition plans for continued progress',
    'Build lifestyle habits for permanent change',
    'Establish metrics for ongoing success'
  ];
  
  phase3Tasks.forEach(task => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`• ${task}`, 70, yPos, { width: 460 });
    yPos += 18;
  });
  
  addPageFooter(doc, planName, 4, currentDate);
  
  // Success Keys page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('CRITICAL SUCCESS KEYS', 50, 80);
  
  yPos = 120;
  const successKeys = [
    {
      title: '1. CONSISTENCY OVER PERFECTION',
      content: 'Following the plan 80% consistently will yield better results than 100% perfection for 3 days followed by complete abandonment. Focus on building sustainable daily habits.'
    },
    {
      title: '2. PROGRESSIVE OVERLOAD PRINCIPLE', 
      content: 'Whether fitness, nutrition, or wellness focused - gradual, consistent increases in challenge and complexity ensure continuous improvement without overwhelming your system.'
    },
    {
      title: '3. PERSONALIZED ADAPTATION',
      content: 'This plan provides the framework, but listen to your body and make adjustments. Your individual response is the ultimate guide for optimization.'
    },
    {
      title: '4. MEASUREMENT & TRACKING',
      content: 'What gets measured gets managed. Use the tracking tools provided to maintain accountability and identify what strategies work best for you.'
    },
    {
      title: '5. LIFESTYLE INTEGRATION',
      content: 'The goal is not temporary change but permanent lifestyle transformation. Focus on building habits that feel natural and sustainable long-term.'
    }
  ];
  
  successKeys.forEach(key => {
    doc.fontSize(13)
       .fillColor('#16a34a')
       .text(key.title, 70, yPos);
    
    yPos += 20;
    doc.fontSize(11)
       .fillColor('#333')
       .text(key.content, 70, yPos, { width: 460, lineGap: 2 });
    yPos += 35;
  });
  
  addPageFooter(doc, planName, 5, currentDate);
}

function addPersonalizedSchedules(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('YOUR PERSONALIZED DAILY SCHEDULES', 50, 80);
  
  // Determine schedule based on user preferences
  const timeAvailable = answers.timeAvailable || answers.cooking_time || 'Moderate time';
  const schedule = generateScheduleForUser(planName, userInfo, answers);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Based on your "${timeAvailable}" availability, here are your optimized daily schedules:`, 50, 110);
  
  let yPos = 150;
  
  // Morning routine
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('MORNING OPTIMIZATION PROTOCOL', 50, yPos);
  
  yPos += 30;
  schedule.morning.forEach(activity => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${activity.time}: ${activity.activity} (${activity.duration})`, 70, yPos, { width: 460 });
    if (activity.note) {
      doc.fontSize(9)
         .fillColor('#666')
         .text(`   ${activity.note}`, 90, yPos + 12, { width: 440 });
      yPos += 25;
    }
    yPos += 18;
  });
  
  // Midday routine
  yPos += 20;
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('MIDDAY ENERGY MANAGEMENT', 50, yPos);
  
  yPos += 30;
  schedule.midday.forEach(activity => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${activity.time}: ${activity.activity} (${activity.duration})`, 70, yPos, { width: 460 });
    if (activity.note) {
      doc.fontSize(9)
         .fillColor('#666')
         .text(`   ${activity.note}`, 90, yPos + 12, { width: 440 });
      yPos += 25;
    }
    yPos += 18;
  });
  
  addPageFooter(doc, planName, 6, currentDate);
  
  // Evening schedule page
  doc.addPage();
  
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('EVENING OPTIMIZATION & RECOVERY', 50, 80);
  
  yPos = 110;
  schedule.evening.forEach(activity => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${activity.time}: ${activity.activity} (${activity.duration})`, 70, yPos, { width: 460 });
    if (activity.note) {
      doc.fontSize(9)
         .fillColor('#666')
         .text(`   ${activity.note}`, 90, yPos + 12, { width: 440 });
      yPos += 25;
    }
    yPos += 18;
  });
  
  // Weekly variation
  yPos += 40;
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('WEEKLY SCHEDULE VARIATIONS', 50, yPos);
  
  yPos += 30;
  doc.fontSize(11)
     .fillColor('#333')
     .text('To prevent plateaus and maintain motivation, incorporate these weekly variations:', 70, yPos, { width: 460 });
  
  yPos += 25;
  const weeklyVariations = [
    'Monday/Wednesday/Friday: High intensity focus days',
    'Tuesday/Thursday: Active recovery and skill development', 
    'Saturday: Long-form practice or outdoor activities',
    'Sunday: Rest, planning, and preparation for the week ahead'
  ];
  
  weeklyVariations.forEach(variation => {
    doc.text(`• ${variation}`, 70, yPos, { width: 460 });
    yPos += 20;
  });
  
  addPageFooter(doc, planName, 7, currentDate);
}

function addDetailedNutritionPlan(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('ADVANCED NUTRITIONAL ARCHITECTURE', 50, 80);
  
  const restrictions = answers.foods_avoid || 'None specified';
  const budget = answers.budget || 'Moderate budget';
  const cookingTime = answers.cooking_time || 'Moderate cooking time';
  
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Customized for: ${restrictions} restrictions | ${budget} | ${cookingTime}`, 50, 110);
  
  // Daily nutrition framework
  let yPos = 150;
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('DAILY NUTRITION FRAMEWORK', 50, yPos);
  
  yPos += 30;
  const nutritionPlan = generateNutritionPlan(planName, userInfo, answers);
  
  nutritionPlan.meals.forEach(meal => {
    doc.fontSize(13)
       .fillColor('#059669')
       .text(`${meal.name} (${meal.timing})`, 70, yPos);
    
    yPos += 20;
    doc.fontSize(11)
       .fillColor('#333')
       .text(`Focus: ${meal.focus}`, 90, yPos);
    
    yPos += 15;
    meal.options.forEach(option => {
      doc.text(`• ${option}`, 110, yPos, { width: 400 });
      yPos += 15;
    });
    
    if (meal.note) {
      doc.fontSize(9)
         .fillColor('#666')
         .text(`💡 ${meal.note}`, 90, yPos, { width: 420 });
      yPos += 20;
    }
    yPos += 10;
  });
  
  addPageFooter(doc, planName, 8, currentDate);
  
  // Supplement protocol page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('PERSONALIZED SUPPLEMENT PROTOCOL', 50, 80);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text('Based on your goals and dietary preferences, here are targeted supplement recommendations:', 50, 110);
  
  yPos = 140;
  const supplements = generateSupplementPlan(planName, userInfo, answers);
  
  supplements.forEach(supplement => {
    doc.fontSize(12)
       .fillColor('#16a34a')
       .text(supplement.name, 70, yPos);
    
    yPos += 18;
    doc.fontSize(11)
       .fillColor('#333')
       .text(`Dosage: ${supplement.dosage}`, 90, yPos)
    
    yPos += 15;
    doc.text(`Timing: ${supplement.timing}`, 90, yPos);
    
    yPos += 15;
    doc.text(`Purpose: ${supplement.purpose}`, 90, yPos, { width: 420 });
    
    if (supplement.note) {
      yPos += 15;
      doc.fontSize(9)
         .fillColor('#666')
         .text(`⚠️ ${supplement.note}`, 90, yPos, { width: 420 });
    }
    yPos += 25;
  });
  
  addPageFooter(doc, planName, 9, currentDate);
}

function addExerciseProtocols(doc: PDFKit.PDFDocument, type: string, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text(`${planName.toUpperCase()} EXERCISE & WELLNESS PROTOCOLS`, 50, 80);
  
  const level = userInfo.level || answers.experienceLevel || 'Beginner';
  const equipment = answers.equipment || ['Basic equipment'];
  
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Customized for ${level} level | Equipment: ${equipment.join(', ')}`, 50, 110);
  
  let yPos = 150;
  const protocols = generateExerciseProtocols(type, userInfo, answers);
  
  protocols.forEach(protocol => {
    doc.fontSize(16)
       .fillColor('#16a34a')
       .text(protocol.name, 50, yPos);
    
    yPos += 25;
    doc.fontSize(11)
       .fillColor('#333')
       .text(`Duration: ${protocol.duration} | Frequency: ${protocol.frequency}`, 70, yPos);
    
    yPos += 20;
    doc.text(`Objective: ${protocol.objective}`, 70, yPos, { width: 460 });
    
    yPos += 25;
    protocol.exercises.forEach((exercise, index) => {
      doc.fontSize(11)
         .fillColor('#059669')
         .text(`${index + 1}. ${exercise.name}`, 90, yPos);
      
      yPos += 15;
      doc.fillColor('#333')
         .text(`   ${exercise.instructions}`, 110, yPos, { width: 400 });
      
      if (exercise.modifications) {
        yPos += 15;
        doc.fontSize(9)
           .fillColor('#666')
           .text(`   Modifications: ${exercise.modifications}`, 110, yPos, { width: 400 });
      }
      yPos += 20;
    });
    
    yPos += 15;
  });
  
  addPageFooter(doc, planName, 10, currentDate);
  
  // Recovery protocols page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('RECOVERY & REGENERATION PROTOCOLS', 50, 80);
  
  yPos = 120;
  const recoveryProtocols = [
    {
      name: 'Daily Recovery Routine',
      duration: '15-20 minutes',
      activities: [
        'Progressive muscle relaxation sequence',
        'Deep breathing exercises (4-7-8 technique)',
        'Gentle stretching or yoga poses',
        'Hydration and electrolyte replenishment'
      ]
    },
    {
      name: 'Weekly Deep Recovery',
      duration: '45-60 minutes', 
      activities: [
        'Extended meditation or mindfulness practice',
        'Foam rolling or self-massage techniques',
        'Epsom salt bath or sauna session',
        'Journal reflection and goal assessment'
      ]
    }
  ];
  
  recoveryProtocols.forEach(protocol => {
    doc.fontSize(14)
       .fillColor('#16a34a')
       .text(protocol.name, 70, yPos);
    
    yPos += 20;
    doc.fontSize(11)
       .fillColor('#333')
       .text(`Duration: ${protocol.duration}`, 90, yPos);
    
    yPos += 20;
    protocol.activities.forEach(activity => {
      doc.text(`• ${activity}`, 90, yPos, { width: 420 });
      yPos += 18;
    });
    yPos += 20;
  });
  
  addPageFooter(doc, planName, 11, currentDate);
}

function addShoppingLists(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('COMPLETE SHOPPING LISTS & PROCUREMENT GUIDE', 50, 80);
  
  const budget = answers.budget || 'Moderate budget';
  const restrictions = answers.foods_avoid || 'No restrictions';
  
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Optimized for: ${budget} | Dietary considerations: ${restrictions}`, 50, 110);
  
  let yPos = 150;
  const shoppingLists = generateShoppingLists(planName, userInfo, answers);
  
  shoppingLists.forEach(category => {
    doc.fontSize(16)
       .fillColor('#16a34a')
       .text(category.name, 50, yPos);
    
    yPos += 25;
    
    // Create two columns for better space utilization
    const leftColumn = category.items.slice(0, Math.ceil(category.items.length / 2));
    const rightColumn = category.items.slice(Math.ceil(category.items.length / 2));
    
    leftColumn.forEach((item, index) => {
      doc.fontSize(10)
         .fillColor('#333')
         .text(`□ ${item}`, 70, yPos + (index * 15), { width: 220 });
    });
    
    rightColumn.forEach((item, index) => {
      doc.fontSize(10)
         .fillColor('#333')
         .text(`□ ${item}`, 320, yPos + (index * 15), { width: 220 });
    });
    
    yPos += Math.max(leftColumn.length, rightColumn.length) * 15 + 20;
    
    if (category.notes) {
      doc.fontSize(9)
         .fillColor('#666')
         .text(`💡 ${category.notes}`, 70, yPos, { width: 460 });
      yPos += 25;
    }
  });
  
  addPageFooter(doc, planName, 12, currentDate);
  
  // Budget optimization page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('BUDGET OPTIMIZATION STRATEGIES', 50, 80);
  
  yPos = 120;
  const budgetTips = [
    {
      title: 'Smart Shopping Techniques',
      tips: [
        'Buy in bulk for non-perishable items',
        'Shop seasonal produce for better prices',
        'Use frozen vegetables when fresh is expensive',
        'Compare unit prices, not just total prices'
      ]
    },
    {
      title: 'Meal Prep Efficiency',
      tips: [
        'Prepare base ingredients in large batches',
        'Use versatile proteins that work in multiple meals',
        'Repurpose leftovers into new dishes',
        'Invest in quality storage containers'
      ]
    },
    {
      title: 'Supplement Savings',
      tips: [
        'Buy supplements in larger quantities for better unit pricing',
        'Look for third-party tested generic brands',
        'Focus on essential supplements first',
        'Consider powder forms over pills when available'
      ]
    }
  ];
  
  budgetTips.forEach(section => {
    doc.fontSize(14)
       .fillColor('#16a34a')
       .text(section.title, 70, yPos);
    
    yPos += 20;
    section.tips.forEach(tip => {
      doc.fontSize(11)
         .fillColor('#333')
         .text(`• ${tip}`, 90, yPos, { width: 420 });
      yPos += 18;
    });
    yPos += 15;
  });
  
  addPageFooter(doc, planName, 13, currentDate);
}

function addProgressTracking(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('PROGRESS TRACKING & ANALYTICS SYSTEM', 50, 80);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text('Comprehensive tracking tools designed to keep you motivated and on track toward your goals.', 50, 110);
  
  let yPos = 150;
  
  // Daily tracking checklist
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('DAILY TRACKING CHECKLIST', 50, yPos);
  
  yPos += 30;
  const dailyMetrics = [
    'Morning weight and energy level (1-10)',
    'Sleep quality and duration',
    'Meal adherence and timing',
    'Exercise/wellness session completion',
    'Water intake (glasses or ounces)',
    'Stress levels and mood (1-10)',
    'Supplement compliance',
    'Evening reflection and tomorrow\'s priorities'
  ];
  
  dailyMetrics.forEach(metric => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`□ ${metric}`, 70, yPos, { width: 460 });
    yPos += 20;
  });
  
  // Weekly assessments
  yPos += 20;
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('WEEKLY PROGRESS ASSESSMENTS', 50, yPos);
  
  yPos += 30;
  const weeklyMetrics = [
    'Progress photos (front, side, back)',
    'Body measurements (waist, hips, arms, etc.)',
    'Performance benchmarks specific to your goals',
    'Subjective wellness scores',
    'Review of adherence percentage',
    'Identification of challenges and wins',
    'Plan adjustments for the following week'
  ];
  
  weeklyMetrics.forEach(metric => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`□ ${metric}`, 70, yPos, { width: 460 });
    yPos += 18;
  });
  
  addPageFooter(doc, planName, 14, currentDate);
  
  // Tracking templates page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('TRACKING TEMPLATES & WORKSHEETS', 50, 80);
  
  // Create a sample daily tracking template
  yPos = 120;
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Daily Tracking Template', 50, yPos);
  
  yPos += 25;
  doc.fontSize(10)
     .fillColor('#333')
     .text('Date: _________  Day of Program: _____', 70, yPos);
  
  yPos += 25;
  const trackingFields = [
    'Morning Weight: _______ lbs    Energy Level: ___/10',
    'Sleep: _____ hours    Quality: ___/10',
    'Breakfast: _____________ Time: _______',
    'Lunch: _____________ Time: _______',
    'Dinner: _____________ Time: _______',
    'Exercise/Wellness Session: _____________ Duration: _______',
    'Water Intake: _______ glasses/ounces',
    'Supplements Taken: □ Morning □ Afternoon □ Evening',
    'Stress Level: ___/10    Mood: ___/10',
    'Top Win Today: _________________________________',
    'Challenge/Learning: _____________________________',
    'Tomorrow\'s Priority: ____________________________'
  ];
  
  trackingFields.forEach(field => {
    doc.text(field, 70, yPos, { width: 460 });
    yPos += 20;
  });
  
  addPageFooter(doc, planName, 15, currentDate);
}

function addTroubleshootingGuide(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('TROUBLESHOOTING & OPTIMIZATION GUIDE', 50, 80);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text('Common challenges and proven solutions to keep you moving forward when obstacles arise.', 50, 110);
  
  let yPos = 150;
  const troubleshootingGuide = [
    {
      challenge: 'Low Energy or Motivation',
      solutions: [
        'Review sleep quality and aim for 7-9 hours nightly',
        'Check hydration levels - aim for clear/pale yellow urine',
        'Assess nutrition timing - eat within 2 hours of waking',
        'Reduce intensity by 25% for 3-5 days to allow recovery',
        'Practice 5-minute morning gratitude or meditation',
        'Connect with your support system or accountability partner'
      ]
    },
    {
      challenge: 'Plateau in Progress',
      solutions: [
        'Vary your routine - change exercise order or timing',
        'Increase challenge by 10-15% in one area only',
        'Review portion sizes and meal timing accuracy',
        'Add one new healthy habit while maintaining current ones',
        'Measure progress differently - photos, how clothes fit, energy',
        'Consider a planned 2-3 day diet/exercise break for reset'
      ]
    },
    {
      challenge: 'Time Constraints',
      solutions: [
        'Use minimum effective dose - 15 minutes is better than zero',
        'Combine activities - walk during phone calls',
        'Prepare meals in large batches on weekends',
        'Wake up 15 minutes earlier for morning routine',
        'Use bodyweight exercises requiring no equipment setup',
        'Practice "habit stacking" - attach new habits to existing ones'
      ]
    },
    {
      challenge: 'Social Pressure or Temptation',
      solutions: [
        'Plan ahead for social events with healthy options',
        'Practice saying "I\'m focusing on my health goals right now"',
        'Suggest active social activities instead of food-centered ones',
        'Allow for planned flexibility without guilt',
        'Find like-minded people who support your goals',
        'Remember your "why" - write it down and review regularly'
      ]
    }
  ];
  
  troubleshootingGuide.forEach(item => {
    doc.fontSize(14)
       .fillColor('#dc2626')
       .text(`❌ ${item.challenge}`, 50, yPos);
    
    yPos += 25;
    item.solutions.forEach(solution => {
      doc.fontSize(11)
         .fillColor('#059669')
         .text(`✓ ${solution}`, 70, yPos, { width: 460 });
      yPos += 18;
    });
    yPos += 20;
  });
  
  addPageFooter(doc, planName, 16, currentDate);
  
  // Emergency protocols page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('EMERGENCY PROTOCOLS & QUICK FIXES', 50, 80);
  
  yPos = 120;
  const emergencyProtocols = [
    {
      situation: 'Missed Multiple Days',
      action: 'Don\'t restart - jump back in at 50% intensity for 2 days, then resume'
    },
    {
      situation: 'Feeling Overwhelmed',
      action: 'Focus only on nutrition for 3-7 days, add exercise back gradually'
    },
    {
      situation: 'Unexpected Schedule Change',
      action: 'Identify your non-negotiable 1-2 habits and maintain only those'
    },
    {
      situation: 'Loss of Motivation',
      action: 'Review your original goals, celebrate small wins, seek support'
    },
    {
      situation: 'Physical Discomfort',
      action: 'Reduce intensity, focus on mobility/stretching, consult healthcare if persistent'
    }
  ];
  
  emergencyProtocols.forEach(protocol => {
    doc.fontSize(12)
       .fillColor('#dc2626')
       .text(`🚨 ${protocol.situation}:`, 70, yPos);
    
    yPos += 20;
    doc.fontSize(11)
       .fillColor('#059669')
       .text(`💡 ${protocol.action}`, 90, yPos, { width: 440 });
    yPos += 25;
  });
  
  addPageFooter(doc, planName, 17, currentDate);
}

function addBonusContent(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('BONUS CONTENT & ADVANCED STRATEGIES', 50, 80);
  
  doc.fontSize(12)
     .fillColor('#555')
     .text('Advanced techniques and insider strategies to accelerate your results and maintain long-term success.', 50, 110);
  
  let yPos = 150;
  
  // Advanced optimization techniques
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('ADVANCED OPTIMIZATION TECHNIQUES', 50, yPos);
  
  yPos += 30;
  const advancedTechniques = [
    {
      title: 'Circadian Rhythm Optimization',
      description: 'Align your activities with natural biological rhythms for enhanced energy and recovery.',
      techniques: [
        'Morning sunlight exposure within 30 minutes of waking',
        'Blue light blocking glasses 2 hours before bed',
        'Consistent sleep/wake times even on weekends',
        'Room temperature 65-68°F for optimal sleep quality'
      ]
    },
    {
      title: 'Metabolic Flexibility Training',
      description: 'Enhance your body\'s ability to efficiently switch between fuel sources.',
      techniques: [
        'Strategic timing of carbohydrates around activity',
        'Occasional 12-16 hour fasting windows',
        'Mix of steady-state and high-intensity training',
        'Cold exposure for mitochondrial adaptation'
      ]
    }
  ];
  
  advancedTechniques.forEach(technique => {
    doc.fontSize(13)
       .fillColor('#16a34a')
       .text(technique.title, 70, yPos);
    
    yPos += 18;
    doc.fontSize(11)
       .fillColor('#333')
       .text(technique.description, 90, yPos, { width: 440 });
    
    yPos += 20;
    technique.techniques.forEach(item => {
      doc.text(`• ${item}`, 110, yPos, { width: 420 });
      yPos += 16;
    });
    yPos += 15;
  });
  
  addPageFooter(doc, planName, 18, currentDate);
  
  // Long-term success strategies page
  doc.addPage();
  
  doc.fontSize(18)
     .fillColor('#16a34a')
     .text('LONG-TERM SUCCESS & LIFESTYLE INTEGRATION', 50, 80);
  
  yPos = 120;
  const longTermStrategies = [
    {
      phase: 'Months 2-3: Habit Consolidation',
      focus: 'Make behaviors automatic and effortless',
      actions: [
        'Identify which habits feel most natural and prioritize them',
        'Create environmental cues that support desired behaviors',
        'Build flexibility into your routine for sustainability',
        'Start teaching or sharing your knowledge with others'
      ]
    },
    {
      phase: 'Months 4-6: Advanced Integration',
      focus: 'Expand and refine your approach',
      actions: [
        'Experiment with new activities or challenges',
        'Develop expertise in areas that interest you most',
        'Create systems for handling life disruptions',
        'Build a community around your healthy lifestyle'
      ]
    },
    {
      phase: 'Year 1+: Mastery and Mentorship',
      focus: 'Become a role model and continue growing',
      actions: [
        'Set new, challenging goals to maintain motivation',
        'Help others beginning their transformation journey',
        'Continuously educate yourself on health and wellness',
        'Create your own personalized approach based on experience'
      ]
    }
  ];
  
  longTermStrategies.forEach(strategy => {
    doc.fontSize(14)
       .fillColor('#16a34a')
       .text(strategy.phase, 70, yPos);
    
    yPos += 18;
    doc.fontSize(12)
       .fillColor('#059669')
       .text(`Focus: ${strategy.focus}`, 90, yPos);
    
    yPos += 20;
    strategy.actions.forEach(action => {
      doc.fontSize(11)
         .fillColor('#333')
         .text(`• ${action}`, 110, yPos, { width: 420 });
      yPos += 18;
    });
    yPos += 20;
  });
  
  addPageFooter(doc, planName, 19, currentDate);
}

function addSuccessMetrics(doc: PDFKit.PDFDocument, planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers, currentDate: string) {
  doc.addPage();
  
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('SUCCESS METRICS & PERFORMANCE GUARANTEES', 50, 80);
  
  const duration = userInfo.duration || '7 days';
  const goal = userInfo.goal;
  
  doc.fontSize(12)
     .fillColor('#555')
     .text(`Your personalized success benchmarks for achieving "${goal}" within ${duration}.`, 50, 110);
  
  let yPos = 150;
  
  // Personalized success metrics
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text(`YOUR ${duration.toUpperCase()} SUCCESS TARGETS`, 50, yPos);
  
  yPos += 30;
  const successMetrics = generateSuccessMetrics(userInfo, answers);
  
  successMetrics.forEach(metric => {
    doc.fontSize(12)
       .fillColor('#059669')
       .text(`✓ ${metric.metric}`, 70, yPos);
    
    yPos += 18;
    doc.fontSize(11)
       .fillColor('#333')
       .text(`   Target: ${metric.target}`, 90, yPos);
    
    yPos += 15;
    doc.text(`   How to Measure: ${metric.measurement}`, 90, yPos, { width: 440 });
    yPos += 25;
  });
  
  // Performance guarantee
  yPos += 20;
  doc.rect(50, yPos, 495, 120).strokeColor('#16a34a').stroke();
  
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text('OUR PERFORMANCE GUARANTEE', 70, yPos + 20);
  
  doc.fontSize(11)
     .fillColor('#333')
     .text('If you follow this plan with 80% consistency and don\'t see measurable progress within the specified timeframe, we\'re committed to working with you to identify what adjustments are needed. Your success is our success.', 70, yPos + 45, { width: 455, lineGap: 3 });
  
  yPos += 140;
  
  // Final personal message
  doc.fontSize(16)
     .fillColor('#16a34a')
     .text(`A Personal Message for ${userInfo.name}`, 50, yPos);
  
  yPos += 25;
  doc.fontSize(11)
     .fillColor('#333')
     .text(`Congratulations on taking this important step toward achieving "${goal}". This comprehensive guide represents thousands of hours of research, testing, and refinement specifically tailored to your unique situation and preferences.`, 70, yPos, { width: 460, lineGap: 3 });
  
  yPos += 50;
  doc.text('Remember: transformation is not about perfection—it\'s about consistent progress. Trust the process, be patient with yourself, and celebrate every small victory along the way.', 70, yPos, { width: 460, lineGap: 3 });
  
  yPos += 50;
  doc.text('Your journey toward optimal health and wellness starts now. You have everything you need to succeed.', 70, yPos, { width: 460, lineGap: 3 });
  
  yPos += 40;
  doc.fontSize(12)
     .fillColor('#16a34a')
     .text('To your success,', 70, yPos);
  
  yPos += 20;
  doc.text('The PlantRx Health Platform Team', 70, yPos);
  
  addPageFooter(doc, planName, 20, currentDate);
}

// Helper functions for generating personalized content
function generateScheduleForUser(planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const timeAvailable = answers.timeAvailable || answers.cooking_time || 'moderate';
  const isHighIntensity = timeAvailable.toLowerCase().includes('high') || timeAvailable.toLowerCase().includes('lots');
  const isLowTime = timeAvailable.toLowerCase().includes('limited') || timeAvailable.toLowerCase().includes('minimal');
  
  return {
    morning: [
      { 
        time: '6:00 AM', 
        activity: 'Wake up & hydration', 
        duration: '5 min',
        note: 'Drink 16-20oz water with a pinch of sea salt'
      },
      { 
        time: '6:05 AM', 
        activity: 'Morning movement', 
        duration: isLowTime ? '10 min' : '20 min',
        note: 'Light stretching, yoga, or walk outdoors for natural light'
      },
      { 
        time: '6:30 AM', 
        activity: 'Mindfulness practice', 
        duration: isHighIntensity ? '10 min' : '5 min',
        note: 'Meditation, gratitude, or intention setting'
      },
      { 
        time: '7:00 AM', 
        activity: 'Healthy breakfast', 
        duration: isLowTime ? '15 min' : '30 min',
        note: 'High protein, moderate fat, complex carbs'
      }
    ],
    midday: [
      { 
        time: '12:00 PM', 
        activity: 'Nutritious lunch', 
        duration: isLowTime ? '20 min' : '45 min',
        note: 'Balanced macronutrients, plenty of vegetables'
      },
      { 
        time: '1:00 PM', 
        activity: 'Movement break', 
        duration: '10 min',
        note: 'Walk, stretch, or brief bodyweight exercises'
      },
      { 
        time: '3:00 PM', 
        activity: 'Healthy snack & hydration', 
        duration: '5 min',
        note: 'Nuts, fruit, or herbal tea'
      }
    ],
    evening: [
      { 
        time: '5:00 PM', 
        activity: `Main ${planName} session`, 
        duration: isHighIntensity ? '60-90 min' : '30-45 min',
        note: 'Core training/wellness practice of the day'
      },
      { 
        time: '7:00 PM', 
        activity: 'Dinner preparation', 
        duration: isLowTime ? '20 min' : '45 min',
        note: 'Light but satisfying meal with quality proteins'
      },
      { 
        time: '9:00 PM', 
        activity: 'Evening wind-down', 
        duration: '30 min',
        note: 'Reflection, reading, or relaxation routine'
      },
      { 
        time: '10:00 PM', 
        activity: 'Sleep preparation', 
        duration: '15 min',
        note: 'Room temperature, blue light reduction, consistent bedtime'
      }
    ]
  };
}

function generateNutritionPlan(planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const restrictions = answers.foods_avoid?.toLowerCase() || '';
  const isDairy = restrictions.includes('dairy');
  const isGluten = restrictions.includes('gluten');
  const isVegan = restrictions.includes('meat') || restrictions.includes('animal');
  const budget = answers.budget?.toLowerCase() || '';
  const isLowBudget = budget.includes('low') || budget.includes('tight');
  
  const meals = [
    {
      name: 'Morning Fuel',
      timing: '7:00-8:30 AM',
      focus: 'Protein and sustained energy',
      options: [
        isVegan ? 'Plant protein smoothie with banana and spinach' : 'Greek yogurt with berries and nuts',
        isGluten ? 'Quinoa breakfast bowl with fruit' : 'Overnight oats with chia seeds',
        'Green tea or herbal coffee alternative',
        isLowBudget ? 'Scrambled eggs with vegetables' : 'Avocado toast with hemp seeds'
      ],
      note: 'Eat within 2 hours of waking to kickstart metabolism'
    },
    {
      name: 'Midday Nourishment', 
      timing: '12:00-1:30 PM',
      focus: 'Balanced macronutrients and vegetables',
      options: [
        isVegan ? 'Lentil and vegetable salad' : 'Grilled chicken with quinoa',
        'Large mixed green salad with olive oil dressing',
        'Sweet potato or brown rice',
        isLowBudget ? 'Bean and vegetable soup' : 'Wild-caught fish with vegetables'
      ],
      note: 'Largest meal of the day when digestion is strongest'
    },
    {
      name: 'Evening Restoration',
      timing: '6:00-7:30 PM', 
      focus: 'Light but satisfying, easy to digest',
      options: [
        isVegan ? 'Tofu stir-fry with vegetables' : 'Lean protein with steamed vegetables',
        'Herbal tea or golden milk',
        'Small portion of healthy fats (avocado, nuts)',
        isLowBudget ? 'Vegetable soup with legumes' : 'Wild salmon with asparagus'
      ],
      note: 'Finish eating 3 hours before bedtime for better sleep'
    }
  ];
  
  return { meals };
}

function generateSupplementPlan(planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const baseSupplements = [
    {
      name: 'High-Quality Multivitamin',
      dosage: '1 serving daily',
      timing: 'With breakfast',
      purpose: 'Foundation nutritional insurance for optimal cellular function',
      note: 'Look for third-party tested, whole-food based options'
    },
    {
      name: 'Omega-3 Fatty Acids',
      dosage: '1000-2000mg EPA/DHA', 
      timing: 'With lunch or dinner',
      purpose: 'Anti-inflammatory support and brain health',
      note: 'Choose molecularly distilled fish oil or algae-based for vegans'
    },
    {
      name: 'Vitamin D3',
      dosage: '2000-4000 IU daily',
      timing: 'With a fat-containing meal',
      purpose: 'Immune function, bone health, and hormone optimization',
      note: 'Test blood levels annually to adjust dosage'
    },
    {
      name: 'Magnesium',
      dosage: '200-400mg',
      timing: '30 minutes before bed',
      purpose: 'Muscle relaxation, sleep quality, and stress management',
      note: 'Magnesium glycinate is best absorbed and least likely to cause digestive upset'
    }
  ];
  
  // Add goal-specific supplements
  if (userInfo.goal.toLowerCase().includes('muscle') || planName.toLowerCase().includes('fitness')) {
    baseSupplements.push({
      name: 'Creatine Monohydrate',
      dosage: '3-5g daily',
      timing: 'Post-workout or anytime',
      purpose: 'Enhanced strength, power, and muscle building',
      note: 'Most researched and effective form of creatine'
    });
  }
  
  if (userInfo.goal.toLowerCase().includes('stress') || planName.toLowerCase().includes('wellness')) {
    baseSupplements.push({
      name: 'Adaptogenic Blend',
      dosage: '500-1000mg',
      timing: 'With breakfast',
      purpose: 'Stress resilience and energy balance',
      note: 'Look for ashwagandha, rhodiola, or holy basil combinations'
    });
  }
  
  return baseSupplements;
}

function generateExerciseProtocols(type: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const level = userInfo.level?.toLowerCase() || 'beginner';
  const goal = userInfo.goal?.toLowerCase() || '';
  
  if (type === 'fitness' || goal.includes('muscle') || goal.includes('strength')) {
    return [
      {
        name: 'Strength Foundation Protocol',
        duration: level === 'beginner' ? '30-40 minutes' : '45-60 minutes',
        frequency: '3-4 times per week',
        objective: 'Build functional strength and muscle mass',
        exercises: [
          {
            name: 'Bodyweight Squats',
            instructions: '3 sets of 10-15 reps, focus on proper form and full range of motion',
            modifications: 'Beginners: Use chair for support. Advanced: Add jump or single-leg variations'
          },
          {
            name: 'Push-Up Progression',
            instructions: '3 sets of 5-12 reps depending on ability',
            modifications: 'Wall push-ups → knee push-ups → full push-ups → elevated feet'
          },
          {
            name: 'Plank Hold',
            instructions: 'Hold for 20-60 seconds, 3 sets',
            modifications: 'Start on knees, progress to full plank, then add movement'
          },
          {
            name: 'Glute Bridges',
            instructions: '3 sets of 12-20 reps, squeeze at the top',
            modifications: 'Single-leg bridges for increased difficulty'
          }
        ]
      }
    ];
  }
  
  if (type === 'wellness' || goal.includes('stress') || goal.includes('mental')) {
    return [
      {
        name: 'Mindful Movement Practice',
        duration: '20-45 minutes',
        frequency: 'Daily or 5-6 times per week',
        objective: 'Reduce stress, improve flexibility, and enhance mind-body connection',
        exercises: [
          {
            name: 'Gentle Flow Sequence',
            instructions: '10-minute continuous movement connecting breath to motion',
            modifications: 'Chair-based modifications available for limited mobility'
          },
          {
            name: 'Breathing Practice',
            instructions: '4-7-8 breathing: inhale 4, hold 7, exhale 8, repeat 4-8 cycles',
            modifications: 'Start with 4-4-6 pattern if 4-7-8 is too challenging'
          },
          {
            name: 'Progressive Relaxation',
            instructions: 'Systematically tense and release each muscle group',
            modifications: 'Can be done seated or lying down'
          },
          {
            name: 'Walking Meditation',
            instructions: '10-20 minutes of mindful walking, focusing on each step',
            modifications: 'Indoor pacing or outdoor nature walking'
          }
        ]
      }
    ];
  }
  
  // Default general wellness protocol
  return [
    {
      name: 'Balanced Wellness Protocol',
      duration: '30-45 minutes',
      frequency: '4-5 times per week',
      objective: 'Overall health improvement and sustainable habits',
      exercises: [
        {
          name: 'Dynamic Warm-Up',
          instructions: '5 minutes of joint mobility and light movement',
          modifications: 'Adjust intensity based on energy levels'
        },
        {
          name: 'Strength Circuit',
          instructions: '15-20 minutes alternating strength exercises',
          modifications: 'Use bodyweight, bands, or light weights as available'
        },
        {
          name: 'Cardiovascular Activity',
          instructions: '10-15 minutes of elevated heart rate activity',
          modifications: 'Walking, dancing, cycling, or swimming based on preference'
        },
        {
          name: 'Flexibility & Recovery',
          instructions: '5-10 minutes of stretching and deep breathing',
          modifications: 'Focus on areas of tension or tightness'
        }
      ]
    }
  ];
}

function generateShoppingLists(planName: string, userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const restrictions = answers.foods_avoid?.toLowerCase() || '';
  const budget = answers.budget?.toLowerCase() || '';
  const isLowBudget = budget.includes('low') || budget.includes('tight');
  const isDairy = restrictions.includes('dairy');
  const isGluten = restrictions.includes('gluten');
  const isVegan = restrictions.includes('meat') || restrictions.includes('animal');
  
  return [
    {
      name: 'Proteins',
      items: [
        isVegan ? 'Lentils (red and green)' : (isLowBudget ? 'Eggs (organic if possible)' : 'Wild-caught salmon'),
        isVegan ? 'Chickpeas and black beans' : (isLowBudget ? 'Chicken thighs' : 'Grass-fed beef'),
        isVegan ? 'Plant protein powder' : (isDairy ? 'Dairy-free protein powder' : 'Whey protein'),
        'Hemp seeds and chia seeds',
        'Raw nuts and nut butters',
        isVegan ? 'Quinoa and tempeh' : 'Greek yogurt (if dairy OK)'
      ],
      notes: 'Aim for variety and buy in bulk when possible for savings'
    },
    {
      name: 'Vegetables & Fruits',
      items: [
        'Dark leafy greens (spinach, kale)',
        'Cruciferous vegetables (broccoli, cauliflower)',
        'Colorful bell peppers',
        'Sweet potatoes and regular potatoes',
        'Avocados',
        'Berries (fresh or frozen)',
        'Bananas and apples',
        'Garlic, onions, and ginger'
      ],
      notes: 'Buy seasonal and local when possible. Frozen vegetables are nutritious and budget-friendly'
    },
    {
      name: 'Healthy Fats',
      items: [
        'Extra virgin olive oil',
        'Coconut oil',
        'Raw nuts (almonds, walnuts)',
        'Seeds (flax, pumpkin, sunflower)',
        'Avocado oil for high-heat cooking'
      ],
      notes: 'Store nuts and seeds in refrigerator to prevent rancidity'
    },
    {
      name: 'Whole Grains & Complex Carbs',
      items: [
        isGluten ? 'Quinoa and brown rice' : 'Steel-cut oats',
        isGluten ? 'Gluten-free oats' : 'Whole grain bread',
        'Sweet potatoes',
        'Legumes and beans',
        isGluten ? 'Rice cakes' : 'Whole grain pasta'
      ],
      notes: 'Choose minimally processed options whenever possible'
    },
    {
      name: 'Herbs, Spices & Pantry',
      items: [
        'Turmeric and black pepper',
        'Himalayan sea salt',
        'Apple cider vinegar',
        'Herbal teas (chamomile, green tea)',
        'Raw honey or maple syrup',
        'Cinnamon and ginger powder'
      ],
      notes: 'Spices have powerful health benefits and make healthy food taste great'
    }
  ];
}

function generateSuccessMetrics(userInfo: UserInfo, answers: QuestionnaireAnswers) {
  const goal = userInfo.goal?.toLowerCase() || '';
  const duration = userInfo.duration || '7 days';
  
  const baseMetrics = [
    {
      metric: 'Consistency Score',
      target: '80% or higher daily adherence to plan',
      measurement: 'Track daily completion of key habits using provided checklist'
    },
    {
      metric: 'Energy Levels',
      target: '7-8/10 sustained energy throughout the day',
      measurement: 'Rate energy levels 3 times daily on 1-10 scale'
    },
    {
      metric: 'Sleep Quality',
      target: '7+ hours of restful sleep with improved morning alertness',
      measurement: 'Track sleep duration and rate quality 1-10 each morning'
    }
  ];
  
  // Add goal-specific metrics
  if (goal.includes('weight') || goal.includes('fat')) {
    baseMetrics.push({
      metric: 'Body Composition',
      target: '1-2 lbs per week sustainable change',
      measurement: 'Weekly weigh-ins at same time, plus progress photos'
    });
  }
  
  if (goal.includes('muscle') || goal.includes('strength')) {
    baseMetrics.push({
      metric: 'Strength Progression',
      target: '10-20% improvement in key exercises',
      measurement: 'Track reps, sets, or duration of benchmark exercises weekly'
    });
  }
  
  if (goal.includes('stress') || goal.includes('mental')) {
    baseMetrics.push({
      metric: 'Stress Management',
      target: 'Stress levels 5/10 or lower consistently',
      measurement: 'Rate stress levels 1-10 each evening, track triggers'
    });
  }
  
  baseMetrics.push({
    metric: 'Lifestyle Integration',
    target: 'New habits feel natural and sustainable',
    measurement: 'Weekly assessment of which habits feel easy vs. challenging'
  });
  
  return baseMetrics;
}

function addPageFooter(doc: PDFKit.PDFDocument, planName: string, pageNum: number, currentDate: string) {
  doc.fontSize(9)
     .fillColor('#16a34a')
     .text(`PlantRx ${planName} Transformation Guide`, 50, 760, { width: 300 })
     .fillColor('#666')
     .text(`Page ${pageNum} | Generated ${currentDate}`, 350, 760, { width: 195, align: 'right' });
}