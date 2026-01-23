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

export async function generateSpecializedPDF(
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
          Title: `${userProfile.name}'s ${getPlanTitle(type)} Guide`,
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
      
      // Generate specialized content based on plan type
      generatePlanSpecificContent(doc, type, userProfile, answers);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function getPlanTitle(type: string): string {
  const titles: { [key: string]: string } = {
    'diet': 'Nutrition Transformation',
    'fitness': 'Fitness Evolution',
    'skincare': 'Radiant Skin Journey',
    'wellness': 'Holistic Wellness',
    'recovery': 'Recovery & Restoration'
  };
  return titles[type] || 'Health Transformation';
}

function generatePlanSpecificContent(
  doc: PDFKit.PDFDocument, 
  type: string, 
  userProfile: UserProfile, 
  answers: any
) {
  // Generate cover and content based on plan type
  switch (type) {
    case 'diet':
      generateDietPlan(doc, userProfile, answers);
      break;
    case 'fitness':
      generateFitnessPlan(doc, userProfile, answers);
      break;
    case 'skincare':
      generateSkincarePlan(doc, userProfile, answers);
      break;
    case 'wellness':
      generateWellnessPlan(doc, userProfile, answers);
      break;
    case 'recovery':
      generateRecoveryPlan(doc, userProfile, answers);
      break;
    default:
      generateGenericPlan(doc, type, userProfile, answers);
  }
  
  // Add page numbers to all pages
  addPageNumbers(doc);
}

// DIET PLAN GENERATOR
function generateDietPlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const primaryGoal = userProfile.goals?.[0] || 'better nutrition';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // DIET COVER PAGE
  addDietCover(doc, userName, userProfile, currentDate);
  
  // DIET TABLE OF CONTENTS
  doc.addPage();
  addDietTableOfContents(doc);
  
  // DIET-SPECIFIC SECTIONS
  doc.addPage();
  addDietWelcome(doc, userName, primaryGoal, userProfile, answers);
  
  doc.addPage();
  addDietAssessment(doc, userName, userProfile, answers);
  
  doc.addPage();
  addMealPlanningSystem(doc, userProfile, answers);
  
  doc.addPage();
  addNutritionFoundations(doc, userProfile, answers);
  
  doc.addPage();
  addDietMealPlans(doc, userProfile, answers);
  
  doc.addPage();
  addDietShoppingGuide(doc, userProfile, answers);
  
  doc.addPage();
  addDietSupplements(doc, userProfile, answers);
  
  doc.addPage();
  addDietTracking(doc, userProfile, answers);
  
  doc.addPage();
  addDietTroubleshooting(doc, userProfile, answers);
  
  doc.addPage();
  addDietRecipes(doc, userProfile, answers);
}

// FITNESS PLAN GENERATOR
function generateFitnessPlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const primaryGoal = userProfile.goals?.[0] || 'better fitness';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // FITNESS COVER PAGE
  addFitnessCover(doc, userName, userProfile, currentDate);
  
  // FITNESS TABLE OF CONTENTS
  doc.addPage();
  addFitnessTableOfContents(doc);
  
  // FITNESS-SPECIFIC SECTIONS
  doc.addPage();
  addFitnessWelcome(doc, userName, primaryGoal, userProfile, answers);
  
  doc.addPage();
  addFitnessAssessment(doc, userName, userProfile, answers);
  
  doc.addPage();
  addWorkoutProgram(doc, userProfile, answers);
  
  doc.addPage();
  addExerciseLibrary(doc, userProfile, answers);
  
  doc.addPage();
  addProgressionPlan(doc, userProfile, answers);
  
  doc.addPage();
  addFitnessNutrition(doc, userProfile, answers);
  
  doc.addPage();
  addRecoveryProtocol(doc, userProfile, answers);
  
  doc.addPage();
  addFitnessTracking(doc, userProfile, answers);
  
  doc.addPage();
  addFitnessTroubleshooting(doc, userProfile, answers);
  
  doc.addPage();
  addMotivationStrategies(doc, userProfile, answers);
}

// SKINCARE PLAN GENERATOR
function generateSkincarePlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const primaryGoal = userProfile.goals?.[0] || 'healthy skin';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // SKINCARE COVER PAGE
  addSkincareCover(doc, userName, userProfile, currentDate);
  
  // SKINCARE TABLE OF CONTENTS
  doc.addPage();
  addSkincareTableOfContents(doc);
  
  // SKINCARE-SPECIFIC SECTIONS
  doc.addPage();
  addSkincareWelcome(doc, userName, primaryGoal, userProfile, answers);
  
  doc.addPage();
  addSkinAssessment(doc, userName, userProfile, answers);
  
  doc.addPage();
  addSkincareRoutine(doc, userProfile, answers);
  
  doc.addPage();
  addProductRecommendations(doc, userProfile, answers);
  
  doc.addPage();
  addSkincareTechniques(doc, userProfile, answers);
  
  doc.addPage();
  addSkincareNutrition(doc, userProfile, answers);
  
  doc.addPage();
  addSkinLifestyle(doc, userProfile, answers);
  
  doc.addPage();
  addSkincareTracking(doc, userProfile, answers);
  
  doc.addPage();
  addSkincareTroubleshooting(doc, userProfile, answers);
  
  doc.addPage();
  addSkincareIngredients(doc, userProfile, answers);
}

// WELLNESS PLAN GENERATOR
function generateWellnessPlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const primaryGoal = userProfile.goals?.[0] || 'overall wellness';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // WELLNESS COVER PAGE
  addWellnessCover(doc, userName, userProfile, currentDate);
  
  // WELLNESS TABLE OF CONTENTS
  doc.addPage();
  addWellnessTableOfContents(doc);
  
  // WELLNESS-SPECIFIC SECTIONS
  doc.addPage();
  addWellnessWelcome(doc, userName, primaryGoal, userProfile, answers);
  
  doc.addPage();
  addWellnessAssessment(doc, userName, userProfile, answers);
  
  doc.addPage();
  addHolisticApproach(doc, userProfile, answers);
  
  doc.addPage();
  addMindBodyConnection(doc, userProfile, answers);
  
  doc.addPage();
  addStressManagement(doc, userProfile, answers);
  
  doc.addPage();
  addSleepOptimization(doc, userProfile, answers);
  
  doc.addPage();
  addWellnessNutrition(doc, userProfile, answers);
  
  doc.addPage();
  addWellnessMovement(doc, userProfile, answers);
  
  doc.addPage();
  addWellnessTracking(doc, userProfile, answers);
  
  doc.addPage();
  addWellnessTroubleshooting(doc, userProfile, answers);
}

// RECOVERY PLAN GENERATOR
function generateRecoveryPlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const primaryGoal = userProfile.goals?.[0] || 'recovery';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // RECOVERY COVER PAGE
  addRecoveryCover(doc, userName, userProfile, currentDate);
  
  // RECOVERY TABLE OF CONTENTS
  doc.addPage();
  addRecoveryTableOfContents(doc);
  
  // RECOVERY-SPECIFIC SECTIONS
  doc.addPage();
  addRecoveryWelcome(doc, userName, primaryGoal, userProfile, answers);
  
  doc.addPage();
  addRecoveryAssessment(doc, userName, userProfile, answers);
  
  doc.addPage();
  addRecoveryProtocols(doc, userProfile, answers);
  
  doc.addPage();
  addRestorativeNutrition(doc, userProfile, answers);
  
  doc.addPage();
  addHealingMovement(doc, userProfile, answers);
  
  doc.addPage();
  addRecoverySupplements(doc, userProfile, answers);
  
  doc.addPage();
  addStressRecovery(doc, userProfile, answers);
  
  doc.addPage();
  addRecoveryTracking(doc, userProfile, answers);
  
  doc.addPage();
  addRecoveryTroubleshooting(doc, userProfile, answers);
  
  doc.addPage();
  addLongTermMaintenance(doc, userProfile, answers);
}

// COVER PAGE FUNCTIONS
function addDietCover(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, currentDate: string) {
  // Background
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#f8fafc');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#16a34a')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Nutrition Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title with diet-specific styling
  doc.fontSize(44)
     .fillColor('#16a34a')
     .font('Helvetica-Bold')
     .text('Nutrition', 50, 180, { width: 495, align: 'center' });
     
  doc.fontSize(38)
     .fillColor('#1f2937')
     .text('Transformation Guide', 50, 230, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#16a34a')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userName}`, 50, 290, { width: 495, align: 'center' });
  
  // Add diet-specific details
  addPlanDetailsBox(doc, userProfile, currentDate, 'nutrition and meal planning');
  
  // Diet-specific disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized nutrition guide is based on your dietary goals and preferences.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Consult with registered dietitians for specialized dietary needs.', 50, 670, { width: 495, align: 'center' });
}

function addFitnessCover(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, currentDate: string) {
  // Background with fitness theme
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#f1f5f9');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#dc2626')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Fitness Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title with fitness-specific styling
  doc.fontSize(44)
     .fillColor('#dc2626')
     .font('Helvetica-Bold')
     .text('Fitness', 50, 180, { width: 495, align: 'center' });
     
  doc.fontSize(38)
     .fillColor('#1f2937')
     .text('Evolution Guide', 50, 230, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#dc2626')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userName}`, 50, 290, { width: 495, align: 'center' });
  
  addPlanDetailsBox(doc, userProfile, currentDate, 'fitness and exercise');
  
  // Fitness-specific disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized fitness guide is based on your current fitness level and goals.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Consult with healthcare providers before starting new exercise programs.', 50, 670, { width: 495, align: 'center' });
}

function addSkincareCover(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, currentDate: string) {
  // Background with skincare theme
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#fef7f0');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#ea580c')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Skincare Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title with skincare-specific styling
  doc.fontSize(44)
     .fillColor('#ea580c')
     .font('Helvetica-Bold')
     .text('Radiant Skin', 50, 180, { width: 495, align: 'center' });
     
  doc.fontSize(38)
     .fillColor('#1f2937')
     .text('Journey', 50, 230, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#ea580c')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userName}`, 50, 290, { width: 495, align: 'center' });
  
  addPlanDetailsBox(doc, userProfile, currentDate, 'skincare and beauty');
  
  // Skincare-specific disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized skincare guide is based on your skin type and concerns.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Patch test new products and consult dermatologists for skin conditions.', 50, 670, { width: 495, align: 'center' });
}

function addWellnessCover(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, currentDate: string) {
  // Background with wellness theme
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#f0fdf4');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Wellness Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title with wellness-specific styling
  doc.fontSize(44)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text('Holistic', 50, 180, { width: 495, align: 'center' });
     
  doc.fontSize(38)
     .fillColor('#1f2937')
     .text('Wellness Guide', 50, 230, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userName}`, 50, 290, { width: 495, align: 'center' });
  
  addPlanDetailsBox(doc, userProfile, currentDate, 'holistic wellness');
  
  // Wellness-specific disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized wellness guide integrates mind, body, and spirit for optimal health.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Consult healthcare professionals for medical conditions.', 50, 670, { width: 495, align: 'center' });
}

function addRecoveryCover(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, currentDate: string) {
  // Background with recovery theme
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillColor('#f8fafc');
  
  // PlantRx branding
  doc.fontSize(28)
     .fillColor('#6366f1')
     .font('Helvetica-Bold')
     .text('PlantRx', 50, 80, { width: 495, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Recovery Platform', 50, 115, { width: 495, align: 'center' });
  
  // Main title with recovery-specific styling
  doc.fontSize(44)
     .fillColor('#6366f1')
     .font('Helvetica-Bold')
     .text('Recovery &', 50, 180, { width: 495, align: 'center' });
     
  doc.fontSize(38)
     .fillColor('#1f2937')
     .text('Restoration Guide', 50, 230, { width: 495, align: 'center' });
  
  // Personalized for user
  doc.fontSize(26)
     .fillColor('#6366f1')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userName}`, 50, 290, { width: 495, align: 'center' });
  
  addPlanDetailsBox(doc, userProfile, currentDate, 'recovery and restoration');
  
  // Recovery-specific disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This personalized recovery guide supports healing and restoration processes.', 50, 650, { width: 495, align: 'center' });
  
  doc.text('Always consult healthcare providers for injury recovery and medical conditions.', 50, 670, { width: 495, align: 'center' });
}

// TABLE OF CONTENTS FUNCTIONS
function addDietTableOfContents(doc: PDFKit.PDFDocument) {
  addSectionHeader(doc, 'Table of Contents', '#16a34a');
  
  const sections = [
    '1. Welcome to Your Nutrition Journey',
    '2. Your Personal Diet Assessment', 
    '3. Meal Planning System',
    '4. Nutrition Foundations',
    '5. Complete Meal Plans & Recipes',
    '6. Smart Shopping Guide',
    '7. Targeted Supplement Strategy',
    '8. Progress Tracking System',
    '9. Diet Troubleshooting Guide',
    '10. Recipe Collection & Meal Prep'
  ];
  
  addTableOfContentsList(doc, sections, 160);
}

function addFitnessTableOfContents(doc: PDFKit.PDFDocument) {
  addSectionHeader(doc, 'Table of Contents', '#dc2626');
  
  const sections = [
    '1. Welcome to Your Fitness Evolution',
    '2. Personal Fitness Assessment',
    '3. Custom Workout Program',
    '4. Complete Exercise Library',
    '5. Progressive Training Plan',
    '6. Fitness Nutrition Protocol',
    '7. Recovery & Rest Strategy',
    '8. Fitness Progress Tracking',
    '9. Training Troubleshooting',
    '10. Motivation & Mindset Strategies'
  ];
  
  addTableOfContentsList(doc, sections, 160);
}

function addSkincareTableOfContents(doc: PDFKit.PDFDocument) {
  addSectionHeader(doc, 'Table of Contents', '#ea580c');
  
  const sections = [
    '1. Welcome to Your Skin Journey',
    '2. Personal Skin Assessment',
    '3. Custom Skincare Routine',
    '4. Product Recommendations',
    '5. Advanced Skincare Techniques',
    '6. Skincare Nutrition',
    '7. Lifestyle for Healthy Skin',
    '8. Skin Progress Tracking',
    '9. Skincare Troubleshooting',
    '10. Ingredient Guide & Safety'
  ];
  
  addTableOfContentsList(doc, sections, 160);
}

function addWellnessTableOfContents(doc: PDFKit.PDFDocument) {
  addSectionHeader(doc, 'Table of Contents', '#059669');
  
  const sections = [
    '1. Welcome to Holistic Wellness',
    '2. Personal Wellness Assessment',
    '3. Integrated Wellness Approach',
    '4. Mind-Body Connection',
    '5. Stress Management Mastery',
    '6. Sleep Optimization',
    '7. Wellness Nutrition',
    '8. Mindful Movement',
    '9. Wellness Progress Tracking',
    '10. Lifestyle Integration'
  ];
  
  addTableOfContentsList(doc, sections, 160);
}

function addRecoveryTableOfContents(doc: PDFKit.PDFDocument) {
  addSectionHeader(doc, 'Table of Contents', '#6366f1');
  
  const sections = [
    '1. Welcome to Your Recovery',
    '2. Recovery Assessment',
    '3. Recovery Protocols',
    '4. Restorative Nutrition',
    '5. Healing Movement',
    '6. Recovery Supplements',
    '7. Stress Recovery',
    '8. Recovery Progress Tracking',
    '9. Recovery Troubleshooting',
    '10. Long-term Maintenance'
  ];
  
  addTableOfContentsList(doc, sections, 160);
}

// HELPER FUNCTIONS
function addPlanDetailsBox(doc: PDFKit.PDFDocument, userProfile: UserProfile, currentDate: string, planType: string) {
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
  
  doc.text(`Focus: ${planType}`, 90, yPos);
  yPos += 18;
  
  doc.text(`Duration: ${userProfile.duration || '1 Month'}`, 90, yPos);
  yPos += 18;
  
  if (userProfile.experience) {
    doc.text(`Experience Level: ${userProfile.experience}`, 90, yPos);
    yPos += 18;
  }
  
  if (userProfile.goals && userProfile.goals.length > 0) {
    doc.text(`Primary Goals: ${userProfile.goals.slice(0, 2).join(', ')}`, 90, yPos);
  }
}

function addSectionHeader(doc: PDFKit.PDFDocument, title: string, color: string = '#059669') {
  doc.fontSize(26)
     .fillColor(color)
     .font('Helvetica-Bold')
     .text(title, 50, 100, { width: 495 });
  
  doc.moveTo(50, 135)
     .lineTo(545, 135)
     .strokeColor(color)
     .lineWidth(2)
     .stroke();
}

function addTableOfContentsList(doc: PDFKit.PDFDocument, sections: string[], startY: number) {
  let yPos = startY;
  const lineHeight = 18;
  
  sections.forEach((section) => {
    doc.fontSize(12)
       .fillColor('#374151')
       .font('Helvetica')
       .text(section, 70, yPos, { width: 400 });
    
    // Add page number (placeholder)
    doc.text((sections.indexOf(section) + 3).toString(), 480, yPos, { width: 50, align: 'right' });
    
    yPos += lineHeight;
  });
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

function generateGenericPlan(doc: PDFKit.PDFDocument, type: string, userProfile: UserProfile, answers: any) {
  // Fallback for unknown plan types
  const userName = userProfile.name || answers?.name || 'Valued Member';
  const currentDate = new Date().toLocaleDateString();
  
  addSectionHeader(doc, `${type.charAt(0).toUpperCase() + type.slice(1)} Plan`);
  
  doc.fontSize(16)
     .fillColor('#374151')
     .font('Helvetica')
     .text(`Welcome ${userName}! This is your personalized ${type} plan.`, 50, 160, { width: 495 });
}

// Placeholder functions for specialized content sections
// These would be implemented with detailed, plan-specific content

function addDietWelcome(doc: PDFKit.PDFDocument, userName: string, primaryGoal: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `Welcome ${userName}!`, '#16a34a');
  
  const budget = answers?.budget || 'moderate';
  const cookingTime = answers?.cooking_time || 'moderate';
  const foodsToAvoid = answers?.foods_avoid || 'none';
  
  const dietWelcomeContent = `Dear ${userName},

Welcome to your personalized nutrition transformation! This comprehensive guide has been specifically designed based on your dietary goals, cooking preferences, and lifestyle needs.

**Your Nutrition Profile:**
• Primary Goal: ${primaryGoal}
• Experience Level: ${userProfile.experience}
• Cooking Time Available: ${cookingTime}
• Budget Preference: ${budget}
• Foods to Avoid: ${foodsToAvoid}
• Program Duration: ${userProfile.duration}

**What Makes This Nutrition Plan Special:**
This isn't a generic diet - every meal, recipe, and strategy has been selected specifically for YOUR unique situation. We've analyzed your responses to create a sustainable nutrition plan that fits your lifestyle, budget, and taste preferences.

**Your Nutrition Success Framework:**
Over the next ${userProfile.duration}, you'll discover:

• Personalized meal plans that fit your cooking schedule
• Specific food recommendations based on your goals
• Budget-friendly shopping strategies
• Simple recipes that don't require extensive cooking
• Progress tracking methods designed for nutrition goals
• Solutions for common dietary challenges

**Getting Started with Your Nutrition Journey:**
Your transformation begins with small, sustainable changes. Each section builds upon the previous one, creating a comprehensive nutrition system. Focus on implementing one section at a time rather than trying to change everything at once.

**Important Note About Your Goals:**
Since your primary goal is "${primaryGoal}", this entire plan has been optimized specifically for that outcome. Every food recommendation, meal timing suggestion, and nutritional strategy supports your specific objective.

Let's begin your nutrition transformation!

Your PlantRx Nutrition Team`;
  
  addFormattedContent(doc, dietWelcomeContent, 160);
}

function addDietAssessment(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `${userName}'s Nutrition Assessment`, '#16a34a');
  
  const currentWeight = answers?.current_weight || 'not specified';
  const targetWeight = answers?.target_weight || 'health-focused';
  const eatingHabits = answers?.current_eating_habits || 'standard';
  const foodsToAvoid = answers?.foods_avoid || 'none';
  const budget = answers?.budget || 'moderate';
  const cookingSkill = answers?.cooking_skill || 'intermediate';
  
  const assessmentContent = `**Comprehensive Nutrition Assessment for ${userName}:**

**Current Nutritional Status:**
• Current Eating Patterns: ${eatingHabits}
• Cooking Skill Level: ${cookingSkill}
• Time Available for Meal Prep: ${answers?.cooking_time || 'moderate'}
• Budget for Food: ${budget}
• Dietary Restrictions: ${foodsToAvoid}

**Goal Analysis:**
Your primary goal of "${userProfile.goals?.[0] || 'better nutrition'}" requires a specific nutritional approach:

${getNutritionGoalStrategy(userProfile.goals?.[0] || 'better nutrition')}

**Metabolic Profile Assessment:**
Based on your responses, your metabolic needs are:
• Daily Calorie Range: ${getDietCalorieRange(userProfile, answers)}
• Protein Requirements: ${getDietProteinNeeds(userProfile, answers)}
• Meal Frequency: ${getMealFrequency(answers)}
• Hydration Needs: ${getHydrationNeeds(userProfile, answers)}

**Nutritional Strengths Identified:**
1. **Motivation Level:** Clear goal direction shows commitment to change
2. **Realistic Expectations:** Your ${userProfile.duration} timeline allows for sustainable habits
3. **Lifestyle Compatibility:** Your cooking and budget preferences guide practical recommendations

**Potential Nutritional Challenges:**
1. **Time Constraints:** Solution - Meal prep strategies and quick recipes
2. **Budget Optimization:** Solution - Cost-effective nutrient-dense foods
3. **Consistency:** Solution - Flexible meal plans with alternatives
4. **Social Situations:** Solution - Restaurant and party strategies

**Personalized Nutrition Strategy:**
Based on your assessment, you'll succeed best with:
• Practical meal plans that fit your schedule
• Budget-conscious food choices
• Simple cooking methods matching your skill level
• Flexible options for busy days
• Clear nutritional guidelines without complexity

**Key Success Factors for Your Nutrition Goals:**
• Focus on ${getKeyNutritionFocus(userProfile.goals?.[0])}
• Implement gradual changes for sustainability
• Track progress through energy and satisfaction levels
• Adjust portions and timing based on your body's responses

**Next Steps:**
The following sections provide your complete nutrition action plan. Each recommendation has been specifically selected for your goals, preferences, and lifestyle requirements.`;
  
  addFormattedContent(doc, assessmentContent, 160);
}

function addMealPlanningSystem(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Your Meal Planning System', '#16a34a');
  // Add meal planning content
}

function addNutritionFoundations(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Nutrition Foundations', '#16a34a');
  // Add nutrition foundations content
}

function addDietMealPlans(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Complete Meal Plans & Recipes', '#16a34a');
  // Add meal plans content
}

function addDietShoppingGuide(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Smart Shopping Guide', '#16a34a');
  // Add shopping guide content
}

function addDietSupplements(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Targeted Supplement Strategy', '#16a34a');
  // Add supplement content
}

function addDietTracking(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Progress Tracking System', '#16a34a');
  // Add tracking content
}

function addDietTroubleshooting(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Diet Troubleshooting Guide', '#16a34a');
  // Add troubleshooting content
}

function addDietRecipes(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recipe Collection & Meal Prep', '#16a34a');
  // Add recipes content
}

// Similar placeholder functions for other plan types...
function addFitnessWelcome(doc: PDFKit.PDFDocument, userName: string, primaryGoal: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `Welcome ${userName}!`, '#dc2626');
}

function addFitnessAssessment(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Personal Fitness Assessment', '#dc2626');
}

function addWorkoutProgram(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Custom Workout Program', '#dc2626');
}

function addExerciseLibrary(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Complete Exercise Library', '#dc2626');
}

function addProgressionPlan(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Progressive Training Plan', '#dc2626');
}

function addFitnessNutrition(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Fitness Nutrition Protocol', '#dc2626');
}

function addRecoveryProtocol(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery & Rest Strategy', '#dc2626');
}

function addFitnessTracking(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Fitness Progress Tracking', '#dc2626');
}

function addFitnessTroubleshooting(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Training Troubleshooting', '#dc2626');
}

function addMotivationStrategies(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Motivation & Mindset Strategies', '#dc2626');
}

// Skincare functions
function addSkincareWelcome(doc: PDFKit.PDFDocument, userName: string, primaryGoal: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `Welcome ${userName}!`, '#ea580c');
}

function addSkinAssessment(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Personal Skin Assessment', '#ea580c');
}

function addSkincareRoutine(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Custom Skincare Routine', '#ea580c');
}

function addProductRecommendations(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Product Recommendations', '#ea580c');
}

function addSkincareTechniques(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Advanced Skincare Techniques', '#ea580c');
}

function addSkincareNutrition(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Skincare Nutrition', '#ea580c');
}

function addSkinLifestyle(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Lifestyle for Healthy Skin', '#ea580c');
}

function addSkincareTracking(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Skin Progress Tracking', '#ea580c');
}

function addSkincareTroubleshooting(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Skincare Troubleshooting', '#ea580c');
}

function addSkincareIngredients(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Ingredient Guide & Safety', '#ea580c');
}

// Wellness functions
function addWellnessWelcome(doc: PDFKit.PDFDocument, userName: string, primaryGoal: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `Welcome ${userName}!`, '#059669');
}

function addWellnessAssessment(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Personal Wellness Assessment', '#059669');
}

function addHolisticApproach(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Integrated Wellness Approach', '#059669');
}

function addMindBodyConnection(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Mind-Body Connection', '#059669');
}

function addStressManagement(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Stress Management Mastery', '#059669');
}

function addSleepOptimization(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Sleep Optimization', '#059669');
}

function addWellnessNutrition(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Wellness Nutrition', '#059669');
}

function addWellnessMovement(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Mindful Movement', '#059669');
}

function addWellnessTracking(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Wellness Progress Tracking', '#059669');
}

function addWellnessTroubleshooting(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Lifestyle Integration', '#059669');
}

// Recovery functions
function addRecoveryWelcome(doc: PDFKit.PDFDocument, userName: string, primaryGoal: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, `Welcome ${userName}!`, '#6366f1');
}

function addRecoveryAssessment(doc: PDFKit.PDFDocument, userName: string, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery Assessment', '#6366f1');
}

function addRecoveryProtocols(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery Protocols', '#6366f1');
}

function addRestorativeNutrition(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Restorative Nutrition', '#6366f1');
}

function addHealingMovement(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Healing Movement', '#6366f1');
}

function addRecoverySupplements(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery Supplements', '#6366f1');
}

function addStressRecovery(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Stress Recovery', '#6366f1');
}

function addRecoveryTracking(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery Progress Tracking', '#6366f1');
}

function addRecoveryTroubleshooting(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Recovery Troubleshooting', '#6366f1');
}

function addLongTermMaintenance(doc: PDFKit.PDFDocument, userProfile: UserProfile, answers: any) {
  addSectionHeader(doc, 'Long-term Maintenance', '#6366f1');
}

// HELPER FUNCTIONS FOR DIET PLAN
function getNutritionGoalStrategy(goal: string): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('weight loss') || goalLower.includes('lose weight')) {
    return `**Weight Loss Nutrition Strategy:**
• Create a moderate caloric deficit (300-500 calories below maintenance)
• Prioritize protein to preserve muscle mass during weight loss
• Include high-fiber foods to promote satiety
• Focus on nutrient-dense, low-calorie foods
• Emphasize whole foods over processed alternatives`;
  } else if (goalLower.includes('muscle') || goalLower.includes('gain') || goalLower.includes('build')) {
    return `**Muscle Building Nutrition Strategy:**
• Maintain caloric surplus for muscle growth
• Prioritize high-quality protein sources
• Time protein intake around workouts
• Include complex carbohydrates for energy
• Support recovery with anti-inflammatory foods`;
  } else if (goalLower.includes('energy') || goalLower.includes('boost')) {
    return `**Energy Enhancement Nutrition Strategy:**
• Focus on stable blood sugar through balanced meals
• Include iron-rich foods to prevent deficiency-related fatigue
• Emphasize B-vitamin rich foods for energy metabolism
• Optimize meal timing to prevent energy crashes
• Include healthy fats for sustained energy`;
  } else {
    return `**General Health Nutrition Strategy:**
• Focus on nutrient-dense whole foods
• Maintain balanced macronutrients
• Include variety for comprehensive nutrition
• Support digestive health with fiber and probiotics
• Emphasize anti-inflammatory foods`;
  }
}

function getDietCalorieRange(userProfile: UserProfile, answers: any): string {
  const activity = userProfile.lifestyle || 'moderate';
  const goal = userProfile.goals?.[0]?.toLowerCase() || '';
  
  if (goal.includes('weight loss')) {
    return '1,200-1,500 calories (deficit for weight loss)';
  } else if (goal.includes('muscle') || goal.includes('gain')) {
    return '1,800-2,200 calories (surplus for muscle building)';
  } else if (activity.includes('high') || activity.includes('active')) {
    return '1,700-2,000 calories (active lifestyle)';
  } else if (activity.includes('low') || activity.includes('sedentary')) {
    return '1,400-1,600 calories (sedentary lifestyle)';
  } else {
    return '1,500-1,800 calories (moderate activity)';
  }
}

function getDietProteinNeeds(userProfile: UserProfile, answers: any): string {
  const goal = userProfile.goals?.[0]?.toLowerCase() || '';
  
  if (goal.includes('muscle') || goal.includes('build')) {
    return '1.2-1.6g per kg body weight (muscle building)';
  } else if (goal.includes('weight loss')) {
    return '1.0-1.2g per kg body weight (weight loss)';
  } else {
    return '0.8-1.0g per kg body weight (general health)';
  }
}

function getMealFrequency(answers: any): string {
  const lifestyle = answers?.lifestyle || '';
  const cookingTime = answers?.cooking_time || 'moderate';
  
  if (cookingTime === 'low' || cookingTime.includes('busy')) {
    return '3 main meals + 1-2 snacks (time-efficient)';
  } else if (lifestyle.includes('active') || lifestyle.includes('high')) {
    return '3 main meals + 2-3 snacks (active lifestyle)';
  } else {
    return '3 main meals + 1 snack (standard approach)';
  }
}

function getHydrationNeeds(userProfile: UserProfile, answers: any): string {
  const activity = userProfile.lifestyle || 'moderate';
  
  if (activity.includes('high') || activity.includes('active')) {
    return '3-4 liters daily (active lifestyle)';
  } else if (activity.includes('low') || activity.includes('sedentary')) {
    return '2-2.5 liters daily (sedentary lifestyle)';
  } else {
    return '2.5-3 liters daily (moderate activity)';
  }
}

function getKeyNutritionFocus(goal?: string): string {
  const goalLower = goal?.toLowerCase() || '';
  
  if (goalLower.includes('energy')) {
    return 'stabilizing blood sugar and optimizing nutrient absorption';
  } else if (goalLower.includes('weight')) {
    return 'creating sustainable caloric balance and metabolic health';
  } else if (goalLower.includes('muscle')) {
    return 'protein timing and muscle-building nutrients';
  } else {
    return 'overall nutritional balance and food quality';
  }
}