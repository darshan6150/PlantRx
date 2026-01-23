import PDFDocument from 'pdfkit';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

interface PersonalizedContent {
  introduction: string;
  assessmentSummary: string;
  dailySchedule: string;
  nutritionPlan: string;
  exerciseRoutine: string;
  supplementGuide: string;
  shoppingList: string;
  progressTracking: string;
  troubleshooting: string;
  expertTips: string;
}

// Main PDF generation function with dual AI integration
export async function generatePersonalizedPDF(
  type: string, 
  userProfile: UserProfile, 
  questionnaireAnswers: any = {}
): Promise<Buffer> {
  try {
    // Step 1: Generate personalized content using dual AI
    const personalizedContent = await generateDualAIContent(type, userProfile, questionnaireAnswers);
    
    // Step 2: Create professional PDF with personalized content
    return await createProfessionalPDF(type, userProfile, personalizedContent);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate personalized PDF: ${error}`);
  }
}

// Dual AI Content Generation System
async function generateDualAIContent(
  type: string, 
  userProfile: UserProfile, 
  answers: any
): Promise<PersonalizedContent> {
  
  const userContext = `
Name: ${userProfile.name}
Age: ${userProfile.age || 'Not specified'}
Goals: ${userProfile.goals?.join(', ') || 'General wellness'}
Health Concerns: ${userProfile.healthConcerns?.join(', ') || 'None specified'}
Experience Level: ${userProfile.experience || 'Beginner'}
Lifestyle: ${userProfile.lifestyle || 'Moderate activity'}
Duration: ${userProfile.duration || '1 month'}
Preferences: ${userProfile.preferences?.join(', ') || 'None specified'}
Additional Info: ${JSON.stringify(answers)}
  `;

  // Generate content sections in parallel using both AI systems
  const contentPromises = await Promise.allSettled([
    generateIntroductionContent(userContext, type),
    generateAssessmentContent(userContext, type),
    generateScheduleContent(userContext, type),
    generateNutritionContent(userContext, type),
    generateExerciseContent(userContext, type),
    generateSupplementContent(userContext, type),
    generateShoppingContent(userContext, type),
    generateProgressContent(userContext, type),
    generateTroubleshootingContent(userContext, type),
    generateExpertTipsContent(userContext, type)
  ]);

  // Extract results and handle any failures gracefully
  const [
    introduction,
    assessment,
    schedule,
    nutrition,
    exercise,
    supplements,
    shopping,
    progress,
    troubleshooting,
    expertTips
  ] = contentPromises.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.warn(`Content generation failed for section ${index}:`, result.reason);
      return getDefaultContent(index, userProfile, type);
    }
  });

  return {
    introduction,
    assessmentSummary: assessment,
    dailySchedule: schedule,
    nutritionPlan: nutrition,
    exerciseRoutine: exercise,
    supplementGuide: supplements,
    shoppingList: shopping,
    progressTracking: progress,
    troubleshooting,
    expertTips
  };
}

// Individual content generators using alternating AI systems
async function generateIntroductionContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create a personalized introduction for a ${type} transformation guide. 

User Profile: ${userContext}

Write a warm, engaging introduction that:
- Personally addresses the user by name
- Acknowledges their specific goals and challenges
- Explains how this guide is tailored to their needs
- Sets realistic expectations for their journey
- Motivates them to start their transformation

Keep it professional yet personal, around 300-400 words.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are an expert wellness coach creating personalized health guides." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    return response.choices[0].message.content || getDefaultIntroduction(type);
  } catch (error) {
    console.warn('OpenAI failed for introduction, using fallback');
    return getDefaultIntroduction(type);
  }
}

async function generateAssessmentContent(userContext: string, type: string): Promise<string> {
  const prompt = `Based on this user profile, create a detailed personal assessment summary:

${userContext}

Create a comprehensive assessment that:
- Analyzes their current situation and readiness
- Identifies key success factors for their goals
- Highlights potential challenges and solutions
- Provides personalized recommendations
- Explains why this ${type} approach will work for them

Format as structured text with clear sections, around 400-500 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    return result.response.text() || getDefaultAssessment(type);
  } catch (error) {
    console.warn('Gemini failed for assessment, using fallback');
    return getDefaultAssessment(type);
  }
}

async function generateScheduleContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create a detailed daily schedule for a ${type} transformation plan.

User Profile: ${userContext}

Generate a comprehensive daily schedule that includes:
- Wake-up routine and morning habits
- Meal timing and preparation
- Exercise/activity sessions
- Supplement timing
- Evening routine and wind-down
- Weekly schedule variations
- Time management tips specific to their lifestyle

Make it practical and achievable for their experience level, around 500-600 words.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are an expert lifestyle coach specializing in sustainable habit formation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 800
    });

    return response.choices[0].message.content || getDefaultSchedule(type);
  } catch (error) {
    console.warn('OpenAI failed for schedule, using fallback');
    return getDefaultSchedule(type);
  }
}

async function generateNutritionContent(userContext: string, type: string): Promise<string> {
  const prompt = `Design a comprehensive nutrition plan for this user's ${type} transformation:

${userContext}

Create a detailed nutrition guide including:
- Personalized macro and calorie targets
- Meal timing and frequency recommendations
- Specific food choices based on preferences and restrictions
- Meal prep strategies
- Hydration guidelines
- Supplementation timing
- Sample meal ideas for breakfast, lunch, dinner, and snacks
- Portion control strategies

Tailor everything to their specific goals, preferences, and lifestyle, around 600-700 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    return result.response.text() || getDefaultNutrition(type);
  } catch (error) {
    console.warn('Gemini failed for nutrition, using fallback');
    return getDefaultNutrition(type);
  }
}

async function generateExerciseContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create a personalized exercise and wellness routine for this ${type} transformation:

User Profile: ${userContext}

Design a comprehensive fitness plan that includes:
- Workout frequency and duration suited to their schedule
- Exercise selection based on their experience level and goals
- Progressive overload and advancement strategies
- Recovery and rest day protocols
- Injury prevention strategies
- Alternative exercises for different scenarios
- Motivation and consistency tips
- How to track progress and adjust intensity

Make it practical for their current fitness level and available time, around 500-600 words.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are a certified personal trainer and wellness expert with 15+ years of experience." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 800
    });

    return response.choices[0].message.content || getDefaultExercise(type);
  } catch (error) {
    console.warn('OpenAI failed for exercise, using fallback');
    return getDefaultExercise(type);
  }
}

async function generateSupplementContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create a personalized supplement and wellness protocol for this ${type} transformation:

${userContext}

Develop a comprehensive supplement guide that includes:
- Essential supplements for their specific goals
- Timing and dosage recommendations
- Natural alternatives and food sources
- Quality considerations and brand recommendations
- Potential interactions and safety notes
- Budget-friendly options
- How to phase supplements in gradually
- Monitoring for effectiveness

Focus on evidence-based recommendations tailored to their needs, around 400-500 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    return result.response.text() || getDefaultSupplements(type);
  } catch (error) {
    console.warn('Gemini failed for supplements, using fallback');
    return getDefaultSupplements(type);
  }
}

async function generateShoppingContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create comprehensive shopping lists and procurement guide for this ${type} transformation:

User Profile: ${userContext}

Generate detailed shopping guidance including:
- Weekly grocery shopping lists organized by category
- Bulk purchasing recommendations for cost savings
- Seasonal food alternatives
- Kitchen equipment and tools needed
- Storage and meal prep containers
- Budget optimization strategies
- Where to find specialty items
- Emergency substitutions

Make it practical and budget-conscious, around 400-500 words.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are a nutrition expert and meal planning specialist." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 700
    });

    return response.choices[0].message.content || getDefaultShopping(type);
  } catch (error) {
    console.warn('OpenAI failed for shopping, using fallback');
    return getDefaultShopping(type);
  }
}

async function generateProgressContent(userContext: string, type: string): Promise<string> {
  const prompt = `Design a comprehensive progress tracking system for this ${type} transformation:

${userContext}

Create a detailed tracking guide that includes:
- Key metrics to monitor daily, weekly, and monthly
- How to measure progress beyond just weight/appearance
- Tracking tools and methods (apps, journals, photos)
- How to interpret data and adjust the plan
- Milestone celebrations and reward systems
- What to do when progress stalls
- Long-term maintenance strategies
- How to stay motivated throughout the journey

Focus on sustainable, science-based tracking methods, around 400-500 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    return result.response.text() || getDefaultProgress(type);
  } catch (error) {
    console.warn('Gemini failed for progress tracking, using fallback');
    return getDefaultProgress(type);
  }
}

async function generateTroubleshootingContent(userContext: string, type: string): Promise<string> {
  const prompt = `Create a troubleshooting guide for common challenges in ${type} transformation:

User Profile: ${userContext}

Address potential obstacles including:
- Common plateaus and how to break through them
- Dealing with cravings and motivation dips
- Adjusting the plan for busy schedules
- Handling social situations and dining out
- Managing setbacks and getting back on track
- Customizing the plan for different life circumstances
- When and how to seek additional support
- Red flags that require medical attention

Provide practical, actionable solutions, around 400-500 words.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "You are a experienced health coach who has helped thousands overcome transformation challenges." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 700
    });

    return response.choices[0].message.content || getDefaultTroubleshooting(type);
  } catch (error) {
    console.warn('OpenAI failed for troubleshooting, using fallback');
    return getDefaultTroubleshooting(type);
  }
}

async function generateExpertTipsContent(userContext: string, type: string): Promise<string> {
  const prompt = `Share advanced expert tips and secrets for ${type} transformation success:

${userContext}

Provide insider knowledge including:
- Advanced strategies used by top performers
- Little-known optimization techniques
- How to accelerate results safely
- Professional secrets from wellness experts
- Cutting-edge research applications
- Biohacking tips for their specific goals
- How to maintain results long-term
- Next-level strategies after completing this plan

Focus on actionable, advanced techniques they won't find elsewhere, around 400-500 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    return result.response.text() || getDefaultExpertTips(type);
  } catch (error) {
    console.warn('Gemini failed for expert tips, using fallback');
    return getDefaultExpertTips(type);
  }
}

// Professional PDF Creation with Beautiful Layout
async function createProfessionalPDF(
  type: string, 
  userProfile: UserProfile, 
  content: PersonalizedContent
): Promise<Buffer> {
  
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 60,
        size: 'A4',
        info: {
          Title: `${userProfile.name}'s ${type.charAt(0).toUpperCase() + type.slice(1)} Transformation Guide`,
          Author: 'PlantRx Expert Health Platform',
          Subject: `Personalized ${userProfile.duration || '1 month'} ${type} transformation plan`,
          Keywords: `${type}, personalized, health, wellness, transformation, expert guide`,
          Creator: 'PlantRx Advanced PDF Generator'
        },
        bufferPages: true
      });
      
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Build professional PDF content
      buildProfessionalContent(doc, type, userProfile, content);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function buildProfessionalContent(
  doc: PDFKit.PDFDocument, 
  type: string, 
  userProfile: UserProfile, 
  content: PersonalizedContent
) {
  const planTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} Transformation Guide`;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // COVER PAGE
  addPremiumCoverPage(doc, planTitle, userProfile, currentDate);
  
  // TABLE OF CONTENTS
  doc.addPage();
  addTableOfContents(doc, planTitle);
  
  // PERSONALIZED INTRODUCTION
  doc.addPage();
  addSection(doc, "Welcome to Your Personal Transformation", content.introduction);
  
  // PERSONAL ASSESSMENT
  doc.addPage();
  addSection(doc, "Your Personalized Assessment", content.assessmentSummary);
  
  // DAILY SCHEDULE
  doc.addPage();
  addSection(doc, "Your Daily Success Schedule", content.dailySchedule);
  
  // NUTRITION PLAN
  doc.addPage();
  addSection(doc, "Personalized Nutrition Protocol", content.nutritionPlan);
  
  // EXERCISE ROUTINE
  doc.addPage();
  addSection(doc, "Your Custom Exercise Program", content.exerciseRoutine);
  
  // SUPPLEMENT GUIDE
  doc.addPage();
  addSection(doc, "Targeted Supplement Strategy", content.supplementGuide);
  
  // SHOPPING LISTS
  doc.addPage();
  addSection(doc, "Complete Shopping & Procurement Guide", content.shoppingList);
  
  // PROGRESS TRACKING
  doc.addPage();
  addSection(doc, "Advanced Progress Tracking System", content.progressTracking);
  
  // TROUBLESHOOTING
  doc.addPage();
  addSection(doc, "Expert Troubleshooting Guide", content.troubleshooting);
  
  // EXPERT TIPS
  doc.addPage();
  addSection(doc, "Insider Secrets & Advanced Tips", content.expertTips);
  
  // BONUS RESOURCES
  doc.addPage();
  addBonusResources(doc, type, userProfile);
  
  // Add page numbers to all pages except cover
  addPageNumbers(doc);
}

function addPremiumCoverPage(
  doc: PDFKit.PDFDocument, 
  planTitle: string, 
  userProfile: UserProfile, 
  currentDate: string
) {
  // Premium gradient background effect
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fillAndStroke('#f8fafc', '#e2e8f0');
  
  // Header brand
  doc.fontSize(24)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text('PlantRx', 60, 80, { width: 495, align: 'center' });
  
  doc.fontSize(14)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text('Expert Natural Health Platform', 60, 110, { width: 495, align: 'center' });
  
  // Main title
  doc.fontSize(48)
     .fillColor('#1f2937')
     .font('Helvetica-Bold')
     .text(planTitle, 60, 200, { width: 495, align: 'center' });
  
  // Personalized subtitle
  doc.fontSize(28)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text(`Exclusively for ${userProfile.name}`, 60, 280, { width: 495, align: 'center' });
  
  doc.fontSize(18)
     .fillColor('#374151')
     .font('Helvetica')
     .text(`${userProfile.duration || '1 Month'} • Personalized Protocol`, 60, 320, { width: 495, align: 'center' });
  
  // Professional details box
  const boxY = 400;
  doc.rect(60, boxY, 495, 120)
     .fillAndStroke('#f3f4f6', '#d1d5db');
  
  doc.fontSize(14)
     .fillColor('#374151')
     .font('Helvetica-Bold')
     .text('Plan Details:', 80, boxY + 20);
  
  doc.fontSize(12)
     .fillColor('#6b7280')
     .font('Helvetica')
     .text(`Created: ${currentDate}`, 80, boxY + 45)
     .text(`Duration: ${userProfile.duration || '1 Month'}`, 80, boxY + 65)
     .text(`Experience Level: ${userProfile.experience || 'Beginner'}`, 80, boxY + 85);
  
  // Goals summary
  if (userProfile.goals && userProfile.goals.length > 0) {
    doc.text(`Primary Goals: ${userProfile.goals.slice(0, 2).join(', ')}`, 80, boxY + 105);
  }
  
  // Footer disclaimer
  doc.fontSize(10)
     .fillColor('#9ca3af')
     .text('This guide is personalized based on your responses and is for educational purposes.', 60, 700, { width: 495, align: 'center' });
  
  doc.text('Consult healthcare professionals before making significant health changes.', 60, 720, { width: 495, align: 'center' });
}

function addTableOfContents(doc: PDFKit.PDFDocument, planTitle: string) {
  doc.fontSize(32)
     .fillColor('#1f2937')
     .font('Helvetica-Bold')
     .text('Table of Contents', 60, 100);
  
  const contents = [
    { title: 'Welcome to Your Personal Transformation', page: 3 },
    { title: 'Your Personalized Assessment', page: 4 },
    { title: 'Your Daily Success Schedule', page: 5 },
    { title: 'Personalized Nutrition Protocol', page: 6 },
    { title: 'Your Custom Exercise Program', page: 7 },
    { title: 'Targeted Supplement Strategy', page: 8 },
    { title: 'Complete Shopping & Procurement Guide', page: 9 },
    { title: 'Advanced Progress Tracking System', page: 10 },
    { title: 'Expert Troubleshooting Guide', page: 11 },
    { title: 'Insider Secrets & Advanced Tips', page: 12 },
    { title: 'Bonus Resources & Next Steps', page: 13 }
  ];
  
  let yPos = 160;
  contents.forEach((item, index) => {
    doc.fontSize(14)
       .fillColor('#374151')
       .font('Helvetica')
       .text(`${index + 1}. ${item.title}`, 80, yPos, { width: 400 });
    
    doc.fontSize(14)
       .fillColor('#6b7280')
       .text(`${item.page}`, 480, yPos, { width: 50, align: 'right' });
    
    yPos += 35;
  });
}

function addSection(doc: PDFKit.PDFDocument, title: string, content: string) {
  // Section header with styling
  doc.fontSize(28)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text(title, 60, 100, { width: 495 });
  
  // Decorative line
  doc.moveTo(60, 140)
     .lineTo(555, 140)
     .strokeColor('#059669')
     .lineWidth(2)
     .stroke();
  
  // Content with proper formatting
  const lines = content.split('\n');
  let yPos = 170;
  
  lines.forEach((line) => {
    if (yPos > 700) {
      doc.addPage();
      yPos = 100;
    }
    
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      // Bold headers
      doc.fontSize(16)
         .fillColor('#1f2937')
         .font('Helvetica-Bold')
         .text(line.replace(/\*\*/g, ''), 60, yPos, { width: 495 });
      yPos += 25;
    } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      // Bullet points
      doc.fontSize(12)
         .fillColor('#374151')
         .font('Helvetica')
         .text(line, 80, yPos, { width: 475 });
      yPos += 18;
    } else if (line.trim().length > 0) {
      // Regular paragraphs
      doc.fontSize(12)
         .fillColor('#374151')
         .font('Helvetica')
         .text(line, 60, yPos, { width: 495, align: 'justify' });
      yPos += 20;
    } else {
      // Empty line spacing
      yPos += 10;
    }
  });
}

function addBonusResources(doc: PDFKit.PDFDocument, type: string, userProfile: UserProfile) {
  doc.fontSize(28)
     .fillColor('#059669')
     .font('Helvetica-Bold')
     .text('Bonus Resources & Next Steps', 60, 100, { width: 495 });
  
  doc.moveTo(60, 140)
     .lineTo(555, 140)
     .strokeColor('#059669')
     .lineWidth(2)
     .stroke();
  
  const bonusContent = `
**Exclusive PlantRx Community Access**
Join our private community of transformation success stories, expert Q&As, and ongoing support.

**Monthly Expert Webinars**
Access to live sessions with certified nutritionists, fitness experts, and wellness coaches.

**Recipe Database (500+ Recipes)**
Unlimited access to our premium recipe collection with meal planning tools.

**Progress Photo Gallery**
Secure platform to track visual progress and celebrate milestones.

**Advanced Tracking Tools**
Professional-grade body composition analysis and metabolic tracking.

**24/7 Expert Support**
Direct access to our team of certified health professionals for questions and guidance.

**Your Next Steps:**
1. Begin your transformation journey today
2. Join our online community for ongoing support
3. Schedule your first check-in session
4. Download the PlantRx mobile app for daily tracking

**Success Guarantee**
We're so confident in your success that we offer a 30-day money-back guarantee. If you're not completely satisfied with your results, we'll refund your investment.

**Emergency Support**
If you encounter any challenges or have urgent questions, contact our expert support team 24/7 through the PlantRx platform.
  `;
  
  let yPos = 170;
  const lines = bonusContent.split('\n');
  
  lines.forEach((line) => {
    if (yPos > 700) {
      doc.addPage();
      yPos = 100;
    }
    
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      doc.fontSize(16)
         .fillColor('#1f2937')
         .font('Helvetica-Bold')
         .text(line.replace(/\*\*/g, ''), 60, yPos, { width: 495 });
      yPos += 25;
    } else if (line.trim().length > 0) {
      doc.fontSize(12)
         .fillColor('#374151')
         .font('Helvetica')
         .text(line, 60, yPos, { width: 495, align: 'justify' });
      yPos += 18;
    } else {
      yPos += 10;
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

// Fallback content functions for when AI fails
function getDefaultContent(sectionIndex: number, userProfile: UserProfile, type: string): string {
  const sections = [
    () => getDefaultIntroduction(type),
    () => getDefaultAssessment(type),
    () => getDefaultSchedule(type),
    () => getDefaultNutrition(type),
    () => getDefaultExercise(type),
    () => getDefaultSupplements(type),
    () => getDefaultShopping(type),
    () => getDefaultProgress(type),
    () => getDefaultTroubleshooting(type),
    () => getDefaultExpertTips(type)
  ];
  
  return sections[sectionIndex] ? sections[sectionIndex]() : `Default ${type} content for section ${sectionIndex}`;
}

function getDefaultIntroduction(type: string): string {
  return `Welcome to your personalized ${type} transformation journey! This comprehensive guide has been created specifically for your unique goals, preferences, and lifestyle. Over the next ${type === 'diet' ? 'month' : 'weeks'}, you'll discover proven strategies, expert insights, and practical tools to achieve lasting transformation. Your journey starts now, and we're here to guide you every step of the way.`;
}

function getDefaultAssessment(type: string): string {
  return `Based on your responses, you're ready to begin your ${type} transformation with a structured, evidence-based approach. Your current situation provides an excellent foundation for sustainable change. This assessment identifies your key success factors and potential challenges, ensuring your plan is perfectly tailored to your needs.`;
}

function getDefaultSchedule(type: string): string {
  return `Your daily schedule is designed to seamlessly integrate ${type} changes into your existing routine. Morning protocols focus on setting a positive tone for the day, while evening routines ensure proper recovery and preparation for tomorrow. Each element builds upon the previous, creating momentum toward your transformation goals.`;
}

function getDefaultNutrition(type: string): string {
  return `Your personalized nutrition plan provides the foundation for your ${type} transformation. Based on your preferences and goals, this protocol includes optimal meal timing, portion guidelines, and food combinations that support your specific objectives. Every recommendation is backed by nutritional science and practical experience.`;
}

function getDefaultExercise(type: string): string {
  return `Your exercise protocol is carefully calibrated to your current fitness level and available time. This progressive program ensures steady advancement while preventing burnout or injury. Each workout builds strength, endurance, and confidence as you progress toward your ${type} goals.`;
}

function getDefaultSupplements(type: string): string {
  return `This supplement strategy enhances your ${type} transformation with targeted nutritional support. Each recommendation is evidence-based and selected for maximum effectiveness with your specific goals. Quality sources and optimal timing ensure you get the most from every supplement.`;
}

function getDefaultShopping(type: string): string {
  return `Your comprehensive shopping guide makes grocery procurement simple and cost-effective. Organized lists, bulk buying strategies, and seasonal alternatives ensure you always have what you need for your ${type} transformation. Smart shopping saves time and money while supporting your goals.`;
}

function getDefaultProgress(type: string): string {
  return `This advanced tracking system helps you monitor every aspect of your ${type} transformation. Beyond basic metrics, you'll learn to track energy levels, mood changes, performance improvements, and overall wellness. Data-driven insights guide adjustments for optimal results.`;
}

function getDefaultTroubleshooting(type: string): string {
  return `Every transformation journey has challenges, and this troubleshooting guide prepares you for common obstacles. From plateau-breaking strategies to motivation techniques, you'll have solutions for any situation that arises during your ${type} transformation.`;
}

function getDefaultExpertTips(type: string): string {
  return `These insider secrets come from years of helping thousands achieve ${type} transformation success. Advanced techniques, optimization strategies, and professional insights give you the competitive edge needed for exceptional results. Implementation of these tips often makes the difference between good and extraordinary outcomes.`;
}