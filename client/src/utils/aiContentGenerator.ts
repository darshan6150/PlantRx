import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

// Initialize AI clients only when needed
let openai: OpenAI | null = null;
let genai: GoogleGenAI | null = null;

function getOpenAIClient() {
  if (!openai && import.meta.env.VITE_OPENAI_API_KEY) {
    openai = new OpenAI({ 
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
}

function getGeminiClient() {
  if (!genai && import.meta.env.VITE_GEMINI_API_KEY) {
    genai = new GoogleGenAI({ 
      apiKey: import.meta.env.VITE_GEMINI_API_KEY 
    });
  }
  return genai;
}

export interface PersonalizedContent {
  mealPlans: {
    day: number;
    breakfast: { name: string; recipe: string; nutrition: string };
    lunch: { name: string; recipe: string; nutrition: string };
    dinner: { name: string; recipe: string; nutrition: string };
    snacks: string[];
  }[];
  shoppingList: {
    category: string;
    items: string[];
  }[];
  tips: string[];
  workoutPlans?: {
    day: number;
    workoutName: string;
    exercises: { name: string; sets: string; reps: string; description: string }[];
    duration: string;
  }[];
  routines?: {
    morning: string[];
    evening: string[];
  };
  recoveryPlans?: {
    technique: string;
    description: string;
    benefits: string;
  }[];
}

export async function generatePersonalizedContent(
  planType: string, 
  duration: string, 
  answers: Record<string, any>
): Promise<PersonalizedContent> {
  
  const userProfile = buildUserProfile(answers);
  
  try {
    // Use OpenAI for meal plans and detailed content
    if (planType === 'diet') {
      return await generateDietContent(userProfile, duration);
    } else if (planType === 'workout') {
      return await generateFitnessContent(userProfile, duration);
    } else if (planType === 'skincare') {
      return await generateSkincareContent(userProfile, duration);
    } else if (planType === 'healing') {
      return await generateRecoveryContent(userProfile, duration);
    } else if (planType === 'wellness') {
      return await generateWellnessContent(userProfile, duration);
    }
    
    // Fallback
    return await generateDietContent(userProfile, duration);
    
  } catch (error) {
    console.error('AI content generation error:', error);
    return generateFallbackContent(planType, duration);
  }
}

function buildUserProfile(answers: Record<string, any>): string {
  const profile = [];
  
  if (answers.goal) profile.push(`Primary goal: ${answers.goal}`);
  if (answers.experience) profile.push(`Experience level: ${answers.experience}`);
  if (answers.preferences) profile.push(`Preferences: ${answers.preferences}`);
  if (answers.restrictions) profile.push(`Restrictions: ${answers.restrictions}`);
  if (answers.lifestyle) profile.push(`Lifestyle: ${answers.lifestyle}`);
  if (answers.timeAvailable) profile.push(`Time available: ${answers.timeAvailable}`);
  
  return profile.join('. ');
}

async function generateDietContent(userProfile: string, duration: string): Promise<PersonalizedContent> {
  const days = parseDuration(duration);
  
  const prompt = `Create a detailed ${duration} nutrition plan for someone with this profile: ${userProfile}

  Generate:
  1. Daily meal plans with specific recipes including ingredients and cooking instructions
  2. Detailed shopping list organized by food categories
  3. Nutrition tips and explanations
  4. Each meal should include nutritional benefits explanation

  Format as JSON with this structure:
  {
    "mealPlans": [
      {
        "day": 1,
        "breakfast": {
          "name": "Meal name",
          "recipe": "Detailed recipe with ingredients and steps",
          "nutrition": "Why this meal is beneficial for their goals"
        },
        "lunch": {...},
        "dinner": {...},
        "snacks": ["healthy snack 1", "healthy snack 2"]
      }
    ],
    "shoppingList": [
      {
        "category": "Proteins", 
        "items": ["specific items needed"]
      }
    ],
    "tips": ["detailed nutrition tip 1", "tip 2", "tip 3"]
  }`;

  const client = getOpenAIClient();
  if (!client) {
    console.warn('OpenAI client not available, using fallback content');
    return generateFallbackContent('diet', duration);
  }
  
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateFitnessContent(userProfile: string, duration: string): Promise<PersonalizedContent> {
  const prompt = `Create a comprehensive ${duration} fitness program for: ${userProfile}

  Generate detailed workout plans with specific exercises, sets, reps, and descriptions.
  Include rest days and progression guidelines.

  Format as JSON with workoutPlans array containing day, workoutName, exercises array, and duration.`;

  const client = getGeminiClient();
  if (!client) {
    console.warn('Gemini client not available, using fallback content');
    return { workoutPlans: [], tips: [], mealPlans: [], shoppingList: [] };
  }
  
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{"workoutPlans": [], "tips": []}');
}

async function generateSkincareContent(userProfile: string, duration: string): Promise<PersonalizedContent> {
  const prompt = `Create a personalized ${duration} skincare routine for: ${userProfile}

  Include morning and evening routines with specific products and techniques.
  Add skincare tips and explanations.

  Format as JSON with routines object and tips array.`;

  const client = getOpenAIClient();
  if (!client) {
    console.warn('OpenAI client not available, using fallback content');
    return { routines: { morning: [], evening: [] }, tips: [], mealPlans: [], shoppingList: [] };
  }
  
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateRecoveryContent(userProfile: string, duration: string): Promise<PersonalizedContent> {
  const prompt = `Create a comprehensive ${duration} recovery plan for: ${userProfile}

  Include specific recovery techniques with detailed descriptions and benefits.
  Add daily routines and progress tracking suggestions.

  Format as JSON with recoveryPlans array and tips.`;

  const client = getGeminiClient();
  if (!client) {
    console.warn('Gemini client not available, using fallback content');
    return { recoveryPlans: [], tips: [], mealPlans: [], shoppingList: [] };
  }
  
  const response = await client.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch {
    return { recoveryPlans: [], tips: [], mealPlans: [], shoppingList: [] };
  }
}

async function generateWellnessContent(userProfile: string, duration: string): Promise<PersonalizedContent> {
  const prompt = `Create a holistic ${duration} wellness plan for: ${userProfile}

  Include daily wellness practices, mindfulness exercises, and lifestyle recommendations.
  Add comprehensive tips for mental and physical wellbeing.

  Format as JSON.`;

  const client = getOpenAIClient();
  if (!client) {
    console.warn('OpenAI client not available, using fallback content');
    return generateFallbackContent('wellness', duration);
  }
  
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

function parseDuration(duration: string): number {
  if (duration.includes('7')) return 7;
  if (duration.includes('14')) return 14;
  if (duration.includes('30') || duration.includes('month')) return 30;
  return 7; // default
}

function generateFallbackContent(planType: string, duration: string): PersonalizedContent {
  return {
    mealPlans: [{
      day: 1,
      breakfast: { 
        name: "Energizing Breakfast Bowl", 
        recipe: "Mix oats, fruits, and nuts with your choice of milk. Add honey to taste.",
        nutrition: "Provides sustained energy and essential nutrients to start your day."
      },
      lunch: { 
        name: "Balanced Lunch Plate", 
        recipe: "Combine lean protein, whole grains, and vegetables in a balanced portion.",
        nutrition: "Delivers complete nutrition for sustained afternoon energy."
      },
      dinner: { 
        name: "Nourishing Evening Meal", 
        recipe: "Light protein with steamed vegetables and complex carbohydrates.",
        nutrition: "Supports recovery and prepares your body for restful sleep."
      },
      snacks: ["Fresh fruit", "Nuts and seeds", "Yogurt"]
    }],
    shoppingList: [{
      category: "Proteins",
      items: ["Lean chicken", "Fish", "Eggs", "Greek yogurt"]
    }],
    tips: [
      "Stay hydrated throughout the day",
      "Eat mindfully and chew slowly",
      "Include a variety of colorful foods in your diet"
    ]
  };
}