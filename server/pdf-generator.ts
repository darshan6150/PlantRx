import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nunjucks from 'nunjucks';

// Simple PDF schema examples for each type
const SCHEMA_EXAMPLES = {
  diet: {
    meta: { title: "30-Day Nutrition Reset", duration: "30 days", type: "Diet Plan", difficulty: "Easy" },
    weekly_plan: [
      { day: "Mon", breakfast: "Oatmeal with berries", lunch: "Quinoa salad", dinner: "Grilled salmon with vegetables", snacks: ["Apple slices", "Almonds"] },
      { day: "Tue", breakfast: "Greek yogurt parfait", lunch: "Lentil soup", dinner: "Chicken stir-fry", snacks: ["Carrot sticks", "Hummus"] },
      { day: "Wed", breakfast: "Green smoothie", lunch: "Chickpea salad", dinner: "Tofu curry", snacks: ["Banana", "Walnuts"] },
      { day: "Thu", breakfast: "Scrambled eggs with spinach", lunch: "Turkey wrap", dinner: "Beef with broccoli", snacks: ["Orange", "Pumpkin seeds"] },
      { day: "Fri", breakfast: "Overnight oats", lunch: "Sardine salad", dinner: "Pasta primavera", snacks: ["Pear", "Greek yogurt"] },
      { day: "Sat", breakfast: "Protein pancakes", lunch: "Buddha bowl", dinner: "Shrimp rice bowl", snacks: ["Dates", "Cashews"] },
      { day: "Sun", breakfast: "Chia pudding", lunch: "Vegetable soup", dinner: "Roasted vegetables with beans", snacks: ["Mixed berries", "Dark chocolate"] }
    ],
    shopping_list: [
      { category: "Proteins", items: ["Chicken breast", "Tofu", "Eggs", "Greek yogurt", "Salmon"] },
      { category: "Carbohydrates", items: ["Oats", "Brown rice", "Quinoa", "Whole grain pasta", "Sweet potatoes"] },
      { category: "Vegetables", items: ["Spinach", "Broccoli", "Carrots", "Bell peppers", "Avocado"] }
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },

  fitness: {
    meta: { title: "4-Week Strength & Energy Program", duration: "4 weeks", type: "Fitness Plan", difficulty: "Moderate" },
    weeks: [
      {
        focus: "Foundation Building",
        days: [
          { name: "Mon", workout: "Full-Body Strength A", sets_reps: "3×10", notes: "Focus on form" },
          { name: "Tue", workout: "Mobility & Walk", sets_reps: "30 min", notes: "Light recovery" },
          { name: "Wed", workout: "Full-Body Strength B", sets_reps: "3×8", notes: "Increase weight" },
          { name: "Thu", workout: "Yoga & Stretching", sets_reps: "45 min", notes: "Flexibility focus" },
          { name: "Fri", workout: "Cardio Intervals", sets_reps: "8×1min", notes: "High intensity" },
          { name: "Sat", workout: "Active Recovery", sets_reps: "30 min", notes: "Light movement" },
          { name: "Sun", workout: "Rest Day", sets_reps: "—", notes: "Complete rest" }
        ]
      }
    ],
    structure: {
      warmup: ["5-10 min cardio", "Dynamic stretching", "Joint mobility"],
      main: ["Compound movements", "Accessory exercises", "Core work"],
      cooldown: ["Static stretching", "Breathing exercises", "Progress notes"]
    },
    logs: {
      strength: ["Squat", "Deadlift", "Bench Press", "Overhead Press"],
      endurance: ["1-mile run", "Plank hold", "Burpee test"],
      flexibility: ["Toe touch", "Hip flexor stretch", "Shoulder mobility"]
    }
  },

  skincare: {
    meta: { title: "30-Day Radiant Skin Plan", duration: "30 days", type: "Skincare", difficulty: "Easy" },
    days30: Array.from({ length: 30 }, (_, i) => i + 1)
  },

  recovery: {
    meta: { title: "30-Day Recovery & Balance Plan", duration: "30 days", type: "Recovery", difficulty: "Easy" },
    blocks: {
      morning: ["Hydration ritual", "Gentle movement", "Breathing exercises"],
      midday: ["Posture check", "Short walk", "Mindfulness moment"],
      evening: ["Screen reduction", "Relaxation routine", "Gratitude practice"]
    },
    habits: ["8+ glasses water", "10,000 steps", "7-8 hours sleep", "No caffeine after 2pm", "5 minutes meditation"]
  },

  wellness: {
    meta: { title: "30-Day Wellness Blueprint", duration: "30 days", type: "Wellness", difficulty: "Easy" },
    morning_ritual: ["Hydration", "5-minute meditation", "Gratitude journaling", "Light movement"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly_challenges: [
      { title: "Week 1 — Mindful Mornings", steps: ["Wake up 15 min earlier", "No phone first hour", "Set daily intention"] },
      { title: "Week 2 — Energy Boost", steps: ["Walk after meals", "Drink more water", "Take vitamin D"] },
      { title: "Week 3 — Stress Relief", steps: ["Deep breathing breaks", "Limit news consumption", "Practice saying no"] },
      { title: "Week 4 — Life Balance", steps: ["Digital detox evening", "Schedule fun activity", "Reflect on progress"] }
    ],
    affirmations: ["I am in control of my wellness", "Small steps create big changes", "I deserve to feel good", "My health is my priority"]
  }
};

async function generateAIContent(type: string): Promise<any> {
  const example = SCHEMA_EXAMPLES[type as keyof typeof SCHEMA_EXAMPLES];
  
  try {
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a health and wellness expert. Create personalized content in the exact same JSON structure as the example provided.' },
          { role: 'user', content: `Create a personalized ${type} plan with the same structure as this example: ${JSON.stringify(example)}` }
        ],
        temperature: 0.7
      });
      
      const content = response.choices[0].message.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          // If parsing fails, return the example with modifications
          return { ...example, meta: { ...example.meta, title: `Personalized ${type.charAt(0).toUpperCase() + type.slice(1)} Plan` } };
        }
      }
    }
    
    // Fallback to Google AI
    if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`Create a personalized ${type} plan with this structure: ${JSON.stringify(example)}`);
      
      try {
        const content = result.response.text();
        return JSON.parse(content);
      } catch {
        // If parsing fails, return the example
        return { ...example, meta: { ...example.meta, title: `Personalized ${type.charAt(0).toUpperCase() + type.slice(1)} Plan` } };
      }
    }
  } catch (error) {
    console.error('AI generation failed:', error);
  }
  
  // Final fallback - return the example with personalized title
  return { 
    ...example, 
    meta: { 
      ...example.meta, 
      title: `Personalized ${type.charAt(0).toUpperCase() + type.slice(1)} Plan`,
      generated_at: new Date().toISOString()
    } 
  };
}

export async function generatePDFContent(type: string, planData?: any, answers?: any): Promise<string> {
  try {
    // Generate AI content
    const content = await generateAIContent(type);
    content.generated_at = new Date().toLocaleDateString();
    content.page_size = 'A4';
    
    // Set up Nunjucks environment
    const templatesDir = path.join(process.cwd(), 'pdf-maker', 'templates');
    const env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(templatesDir),
      { autoescape: false, trimBlocks: true, lstripBlocks: true }
    );
    
    // Template mapping
    const templateMap: Record<string, string> = {
      diet: 'diet.njk',
      skincare: 'skincare.njk',
      fitness: 'fitness.njk',
      recovery: 'recovery.njk',
      wellness: 'wellness.njk',
    };
    
    const template = templateMap[type] || 'wellness.njk';
    const html = env.render(template, content);
    
    // Inline CSS
    const stylesPath = path.join(process.cwd(), 'pdf-maker', 'styles.css');
    const css = fs.readFileSync(stylesPath, 'utf-8');
    const finalHtml = html.replace('</head>', `<style>${css}</style></head>`);
    
    return finalHtml;
    
  } catch (error) {
    console.error('PDF content generation failed:', error);
    throw new Error('Failed to generate PDF content');
  }
}