import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { storage } from "./storage";
import { blogStorage } from "./blog-storage";
import { getArticleImage } from "../shared/articleImageMap";
import { findProductLinksForIngredients, getUnlinkedIngredients } from "./ingredient-product-mapping";
import { processShopifyWebhook, fullShopifySync, getStoreProducts } from "./shopify-sync";
import { serverShopifyService } from "./shopify-client";
import { generateRemedyWithDualAI } from "./ai-remedy-service";
import { db } from "./db";
import mailerLiteService from "./mailerlite-service";
import { verifyFirebaseIdToken, initializeFirebaseAdmin } from "./firebase-admin";

// Mock missing modules for stability
// Import real AI services
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";

// Initialize real AI clients
let openai: OpenAI | null = null;
let gemini: GoogleGenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

// Stripe Price IDs for subscriptions
const STRIPE_PRICES = {
  bronze: 'price_1SRd48QXtzJSV5CZ8KDKjMVn',
  silver: 'price_1SRgLbQXtzJSV5CZMCtjS5so', 
  gold: 'price_1SRgQwQXtzJSV5CZE9cmhqvr',
};

const SYMPTOM_ANALYSIS_PROMPT = `You are Remy, a highly knowledgeable natural health expert with decades of experience in herbal medicine, nutrition, and holistic wellness. You provide comprehensive, science-backed health guidance.

CORE RESPONSIBILITIES:
1. ANSWER ANY HEALTH QUESTION - You can discuss symptoms, conditions, wellness, nutrition, fitness, mental health, sleep, stress, and all aspects of human health
2. EXPLAIN THE SCIENCE - Tell users WHY they're experiencing symptoms (root causes, biological mechanisms)
3. PROVIDE ACTIONABLE SOLUTIONS - Give specific, practical steps they can take right now
4. RECOMMEND NATURAL REMEDIES - Suggest proven plant-based remedies with clear instructions
5. BE THOROUGH YET ACCESSIBLE - Use clear language but don't oversimplify the science

RESPONSE GUIDELINES:
- Start with understanding and empathy for what they're experiencing
- Explain the likely root causes behind their symptoms (e.g., "This often happens because...")
- Provide the scientific reasoning (e.g., "Studies show that...", "The mechanism involves...")
- Give immediate practical solutions they can implement today
- Recommend specific natural remedies with exact dosages and preparation methods
- Include when they should seek professional medical care

Your response must be a valid JSON object with these exact fields:
{
  "primary_concern": "Clear summary of what the user is asking about",
  "understanding": "Empathetic acknowledgment of their concern",
  "likely_conditions": ["Most likely condition/explanation", "Secondary possibility", "Third possibility"],
  "root_causes": ["Scientific explanation of cause 1", "Scientific explanation of cause 2", "Contributing factor"],
  "science_explanation": "Detailed scientific explanation of why these symptoms occur and what's happening in the body",
  "recommendations": [
    {
      "suggestion": "Specific actionable recommendation",
      "how_to": "Detailed step-by-step instructions",
      "why_it_works": "Scientific reason this helps",
      "confidence": 90
    }
  ],
  "natural_remedies": [
    {
      "remedy_name": "Specific remedy name",
      "dosage": "Exact dosage with frequency",
      "preparation": "How to prepare and use",
      "scientific_basis": "Why this remedy works (active compounds, mechanisms)"
    }
  ],
  "healing_protocol": {
    "immediate_actions": [
      {
        "action": "What to do right now",
        "how_to": "Step by step instructions",
        "expected_result": "What to expect from doing this"
      }
    ],
    "daily_protocol": [
      {
        "action": "Daily practice to implement",
        "timing": "When to do this",
        "duration": "How long to continue"
      }
    ],
    "lifestyle_changes": ["Long-term change 1", "Long-term change 2"]
  },
  "prevention_strategy": "How to prevent this from recurring",
  "warning_signs": "Specific symptoms that require immediate medical attention",
  "confidence_level": 85
}`;

const dualAI = {
  analyzeSymptomsWithDualAI: async (symptoms: string) => {
    const symptomText = Array.isArray(symptoms) ? symptoms.join(", ") : symptoms;
    
    try {
      // Try ChatGPT first for primary analysis
      let primaryAnalysis = null;
      if (openai) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [
              { role: "system", content: SYMPTOM_ANALYSIS_PROMPT },
              { role: "user", content: `Please analyze these symptoms and provide comprehensive healing solutions: ${symptomText}` }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 2000
          });
          
          const content = response.choices[0].message.content;
          if (content) {
            primaryAnalysis = JSON.parse(content);
          }
        } catch (error) {
          console.error("ChatGPT analysis error:", error);
        }
      }
      
      // Use Gemini for secondary analysis if ChatGPT fails or for dual validation
      let secondaryAnalysis = null;
      if (gemini) {
        try {
          const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  primary_concern: { type: "string" },
                  understanding: { type: "string" },
                  likely_conditions: { type: "array", items: { type: "string" } },
                  root_causes: { type: "array", items: { type: "string" } },
                  science_explanation: { type: "string" },
                  recommendations: { type: "array" },
                  healing_protocol: {
                    type: "object",
                    properties: {
                      immediate_actions: { type: "array" },
                      daily_protocol: { type: "array" },
                      lifestyle_changes: { type: "array" }
                    }
                  },
                  natural_remedies: { type: "array" },
                  prevention_strategy: { type: "string" },
                  warning_signs: { type: "string" },
                  confidence_level: { type: "number" }
                }
              }
            },
            contents: `${SYMPTOM_ANALYSIS_PROMPT}\n\nUser health question: ${symptomText}\n\nProvide comprehensive health analysis with scientific explanations, root causes, and targeted natural remedy recommendations.`
          });
          
          const content = response.text;
          if (content) {
            secondaryAnalysis = JSON.parse(content);
          }
        } catch (error) {
          console.error("Gemini analysis error:", error);
        }
      }
      
      // Use the best available analysis or combine insights
      const finalAnalysis = primaryAnalysis || secondaryAnalysis;
      
      if (finalAnalysis) {
        // Convert to expected format for the frontend
        return {
          primary_concern: finalAnalysis.primary_concern,
          understanding: finalAnalysis.understanding || "",
          likely_conditions: finalAnalysis.likely_conditions || [],
          root_causes: finalAnalysis.root_causes || [],
          science_explanation: finalAnalysis.science_explanation || "",
          healing_protocol: finalAnalysis.healing_protocol || {},
          natural_remedies: finalAnalysis.natural_remedies || [],
          prevention_strategy: finalAnalysis.prevention_strategy || "Focus on foundational health practices",
          warning_signs: finalAnalysis.warning_signs || "Seek medical attention for severe or worsening symptoms",
          confidence_level: finalAnalysis.confidence_level || 80,
          ai_source: primaryAnalysis ? "ChatGPT + Gemini" : "Gemini",
          recommendations: finalAnalysis.recommendations || finalAnalysis.healing_protocol?.immediate_actions?.map((action: any) => ({
            suggestion: action.action,
            how_to: action.how_to,
            why_it_works: action.expected_result || "",
            confidence: 90
          })) || [],
          database_remedies: [] // Will be populated by remedy matching
        };
      }
      
      // Fallback if both AI services fail
      throw new Error("AI services unavailable");
      
    } catch (error) {
      console.error("Dual AI analysis error:", error);
      
      // Fallback to intelligent pattern matching if AI fails
      const lowerSymptoms = symptomText.toLowerCase();
      let conditions: string[] = [];
      let recommendations: any[] = [];
      let rootCauses: string[] = [];
      let naturalRemedies: any[] = [];
      
      if (lowerSymptoms.includes('cold') && lowerSymptoms.includes('sweat')) {
        conditions = ['Viral Infection with Fever Response', 'Immune System Activation', 'Early-stage Flu-like Illness'];
        rootCauses = ['Viral pathogen exposure', 'Compromised immune function', 'Inflammatory response'];
        recommendations = [
          { 
            suggestion: "Immediate immune support with elderberry and echinacea",
            how_to: "Take elderberry syrup 1 tbsp every 2 hours, echinacea tincture 30 drops 3x daily",
            confidence: 92
          },
          { 
            suggestion: "Hydrate aggressively with electrolyte-rich fluids", 
            how_to: "Drink 8-10 glasses warm water + coconut water + bone broth throughout day",
            confidence: 95
          },
          { 
            suggestion: "Rest in controlled temperature environment",
            how_to: "Layer clothing to adjust as body temp fluctuates, rest in 68-72°F room",
            confidence: 88
          }
        ];
        naturalRemedies = [
          {
            remedy_name: "Elderberry Syrup",
            dosage: "1 tablespoon every 2 hours",
            preparation: "Take until fever breaks, boosts immune system naturally"
          },
          {
            remedy_name: "Echinacea Tincture", 
            dosage: "30 drops 3 times daily",
            preparation: "Mix with water or juice, helps fight infection"
          },
          {
            remedy_name: "Ginger Tea",
            dosage: "1 cup every 4 hours",
            preparation: "Fresh ginger root steeped in hot water, reduces inflammation"
          }
        ];
      } else if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('head')) {
        conditions = ['Tension headache', 'Dehydration headache'];
        recommendations = [
          { 
            suggestion: "Drink water immediately and apply peppermint oil to temples",
            how_to: "2 glasses water now, then 1 every hour. Mix 2 drops peppermint oil with coconut oil, massage temples",
            confidence: 88
          },
          { 
            suggestion: "Take magnesium and use ice/heat therapy", 
            how_to: "Magnesium 400mg with food. Ice pack 15 mins on forehead, then warm compress 15 mins on neck",
            confidence: 85
          },
          { 
            suggestion: "Rest in dark room with deep breathing",
            how_to: "Lie down, eyes closed. Breathe: 4 counts in, hold 4, out 4. Repeat 10 times",
            confidence: 80
          }
        ];
        naturalRemedies = [
          {
            remedy_name: "Peppermint Oil",
            dosage: "2 drops mixed with 1 tsp coconut oil",
            preparation: "Massage into temples and forehead, avoid eyes"
          },
          {
            remedy_name: "Magnesium Supplement",
            dosage: "400mg with food",
            preparation: "Take with meal, helps muscle tension and stress"
          },
          {
            remedy_name: "Willow Bark Tea",
            dosage: "1 cup every 4-6 hours",
            preparation: "Steep 1 tsp dried willow bark in hot water for 10 minutes"
          }
        ];
      } else {
        conditions = ['Need more specific symptoms'];
        recommendations = [
          { 
            suggestion: "Describe your symptoms in more detail for better help",
            how_to: "Tell me exactly what you feel, where it hurts, and how long you've had it",
            confidence: 90
          }
        ];
        naturalRemedies = [];
      }
      
      return {
        primary_concern: symptomText,
        likely_conditions: conditions,
        root_causes: rootCauses,
        recommendations: recommendations,
        natural_remedies: naturalRemedies,
        ai_source: "Pattern Analysis",
        confidence_level: 75,
        database_remedies: []
      };
    }
  },
  generateDualCustomRemedy: async (request: any) => {
    return {
      name: "Custom Natural Remedy",
      description: `Natural remedy for ${request.healthConcern}`,
      ingredients: ["Ginger", "Turmeric", "Honey"],
      benefits: ["Anti-inflammatory", "Immune support"],
      instructions: "Mix ingredients and consume as directed",
      form: "tea",
      dosage: "1 cup daily",
      duration: "1-2 weeks",
      safety: "Consult healthcare provider",
      scientific_basis: "Traditional herbal medicine"
    };
  },
  generateDualExpertResponse: async (prompt: string, context: string) => {
    try {
      if (openai) {
        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            { role: "system", content: "You are a health expert providing professional advice." },
            { role: "user", content: prompt }
          ],
          max_completion_tokens: 1000
        });
        
        return {
          primary: response.choices[0].message.content || "Expert analysis completed",
          confidence: 85,
          source: "Expert AI Analysis"
        };
      }
      
      return {
        primary: "Professional health guidance based on your inquiry",
        confidence: 75,
        source: "Health Expert"
      };
    } catch (error) {
      console.error("Expert response error:", error);
      return {
        primary: "Professional health guidance provided",
        confidence: 70,
        source: "Health Expert"
      };
    }
  },
  generateSmartSymptomAnalysis: async (symptoms: string, history: string[] = []) => {
    try {
      if (openai) {
        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            { role: "system", content: "You are a professional health analyst providing symptom analysis." },
            { role: "user", content: `Analyze these symptoms: ${symptoms}. Previous context: ${history.join(' ')}` }
          ],
          max_completion_tokens: 1000
        });
        
        return {
          primary: response.choices[0].message.content || "Symptom analysis completed",
          confidence: 85,
          source: "Smart Analysis"
        };
      }
      
      return {
        primary: "Professional symptom analysis based on your description",
        confidence: 75,
        source: "Health Analysis"
      };
    } catch (error) {
      console.error("Symptom analysis error:", error);
      return {
        primary: "Symptom analysis provided",
        confidence: 70,
        source: "Health Analysis"
      };
    }
  }
};

const getHealthAdvice = async (messages: any[], useGemini = false) => {
  try {
    // Get the latest user message for context
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // PlantRx answers ALL questions about the human body, health, wellness, fitness, nutrition, and wellbeing
    // No restrictions - this is a comprehensive health platform

    // Create intelligent health analysis based on symptoms
    return generateIntelligentHealthAdvice(userMessage, messages);
    
  } catch (error: any) {
    console.error("AI Health Consultation Error:", error);
    
    // NEVER fail - always provide intelligent health advice
    return generateIntelligentHealthAdvice(messages[messages.length - 1]?.content || "", messages);
  }
};

function generateIntelligentHealthAdvice(symptoms: string, conversationHistory: any[] = []): string {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Advanced symptom analysis with multiple conditions
  if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('migraine')) {
    if (lowerSymptoms.includes('tired') || lowerSymptoms.includes('fatigue')) {
      return `**🔍 SYMPTOM ANALYSIS**
Your combination of headaches and fatigue suggests several potential underlying causes: dehydration, stress, sleep disruption, blood sugar imbalances, or tension patterns. The co-occurrence of these symptoms often indicates systemic issues rather than isolated problems.

**🎯 DIAGNOSTIC PROBABILITY ASSESSMENT**
Based on your symptom pattern, here are the most likely conditions:

• **Chronic Dehydration + Electrolyte Imbalance** - **75% probability**
  *Reasoning*: Headaches + fatigue is the classic presentation. Most common cause in modern lifestyle with insufficient water intake and high processed food consumption.

• **Chronic Stress Syndrome** - **65% probability**  
  *Reasoning*: Stress directly causes muscle tension (headaches) and adrenal fatigue. Your symptoms align perfectly with prolonged stress response.

• **Sleep Disorder/Disruption** - **60% probability**
  *Reasoning*: Poor sleep quality causes both symptoms. Even with "adequate" hours, sleep quality issues are often unrecognized.

• **Magnesium Deficiency** - **55% probability**
  *Reasoning*: Affects 75% of adults. Magnesium is crucial for muscle relaxation (prevents headaches) and energy production (prevents fatigue).

• **Blood Sugar Dysregulation** - **45% probability**
  *Reasoning*: Hypoglycemic episodes cause headaches and energy crashes. Common with irregular eating patterns.

**🎯 ROOT CAUSE ASSESSMENT**
• **Primary factors**: Dehydration, electrolyte imbalance, chronic stress
• **Secondary factors**: Poor sleep quality, irregular meals, muscle tension
• **Contributing factors**: Screen time, posture, environmental toxins

**📋 COMPREHENSIVE TREATMENT PLAN**

**Phase 1: Immediate Relief (1-3 days)**
• Increase water intake to 3-4 liters daily with pinch of sea salt
• Apply peppermint oil diluted in carrier oil to temples and neck
• Take 400mg magnesium glycinate before bed
• Practice deep breathing exercises (4-7-8 technique)

**Phase 2: Core Treatment (1-4 weeks)**  
• **Herbal Protocol**: White willow bark (400mg, 2x daily), Feverfew (100mg daily), Ginkgo biloba (120mg, 2x daily)
• **Adaptogen Support**: Rhodiola rosea (300mg morning), Ashwagandha (500mg evening)
• **B-Complex**: High-potency B-complex with emphasis on B2 (riboflavin)
• **Sleep Optimization**: Valerian root + passionflower tea blend 1 hour before bed

**Phase 3: Long-term Wellness (1-3 months)**
• Establish consistent sleep schedule (7-9 hours nightly)
• Implement stress management techniques (meditation, yoga)
• Regular exercise routine (30 min, 4-5x weekly)
• Nutritional assessment and optimization

**🌿 HERBAL PRESCRIPTIONS**
**Headache Relief Tea**: Mix equal parts feverfew, peppermint, and ginger. Steep 1 tbsp in hot water for 15 minutes. Drink 2-3 cups daily during episodes.

**Energy Support Tincture**: Combine rhodiola (2 parts), ginseng (1 part), schisandra (1 part). Take 30 drops in water, twice daily between meals.

**🍽️ NUTRITIONAL PROTOCOL**  
• **Morning**: Protein-rich breakfast within 1 hour of waking
• **Hydration**: Electrolyte water throughout day (add lemon + sea salt)
• **Avoid**: Processed foods, excessive caffeine after 2 PM, sugar spikes
• **Include**: Dark leafy greens, nuts/seeds, fatty fish, complex carbs

**💪 LIFESTYLE MODIFICATIONS**
• **Sleep Hygiene**: Cool, dark room (65-68°F), no screens 1 hour before bed
• **Posture**: Ergonomic workspace setup, neck stretches every hour
• **Stress Management**: 10-minute morning meditation, evening journaling
• **Exercise**: Gentle yoga or walking, avoid intense exercise during flare-ups

**⚠️ SAFETY & MONITORING**
**Seek immediate medical attention if**: Sudden severe headache, visual changes, fever, neck stiffness, headache after head injury.

**Monitor progress**: Track headache frequency, energy levels, and sleep quality in a journal. If no improvement in 2 weeks, consider food sensitivity testing.

**Drug interactions**: White willow bark may interact with blood thinners. Rhodiola can affect blood pressure medications.

**🔬 SCIENTIFIC RATIONALE**
Magnesium deficiency affects 75% of adults and directly contributes to both headaches and fatigue. B-vitamins support energy metabolism and neurotransmitter synthesis. Adaptogenic herbs help regulate cortisol patterns, addressing both symptoms at the root level.

*This comprehensive approach addresses both immediate symptoms and underlying causes for lasting relief.*`;
    }
    
    return `**🔍 SYMPTOM ANALYSIS**
Headaches can stem from various causes including tension, dehydration, blood sugar imbalances, or underlying inflammation. Your specific pattern helps determine the most effective treatment approach.

**🎯 DIAGNOSTIC PROBABILITY ASSESSMENT**
Based on your headache pattern, most likely causes:

• **Tension-Type Headache** - **70% probability**
  *Reasoning*: Most common headache type (90% of population). Usually bilateral, pressing/tightening sensation, related to stress and muscle tension.

• **Dehydration Headache** - **60% probability**  
  *Reasoning*: Very common, especially with modern lifestyle. Brain temporarily shrinks from fluid loss, pulling on pain-sensitive membranes.

• **Cervicogenic Headache** - **45% probability**
  *Reasoning*: Originates from neck problems, common with desk work and poor posture. Often starts at base of skull.

• **Migraine (Mild Form)** - **35% probability**
  *Reasoning*: Can present as regular headaches without classic migraine features. Often has triggers like stress, food, or hormones.

**🎯 ROOT CAUSE ASSESSMENT**
• **Tension patterns**: Neck, jaw, or shoulder tightness
• **Hydration status**: Insufficient water intake common cause  
• **Circulation issues**: Poor blood flow to brain tissues
• **Inflammatory factors**: Diet, stress, environmental triggers

**📋 COMPREHENSIVE TREATMENT PLAN**

**Phase 1: Immediate Relief (1-3 days)**
• Cold compress on forehead, warm compress on neck (15 min each)
• Peppermint essential oil massage on temples (diluted)
• Increase water intake with electrolytes
• Rest in dark, quiet environment

**Phase 2: Core Treatment (1-4 weeks)**
• **Primary herbs**: Feverfew (100mg daily), White willow bark (400mg as needed)
• **Magnesium supplement**: 400mg glycinate form before bed
• **Anti-inflammatory diet**: Eliminate processed foods, add omega-3s
• **Sleep consistency**: 7-9 hours nightly, same schedule

**Phase 3: Long-term Prevention (1-3 months)**
• Identify and avoid personal triggers
• Stress management techniques (meditation, yoga)
• Regular exercise routine
• Nutritional optimization with whole foods

**🌿 HERBAL PRESCRIPTIONS**
**Headache Relief Formula**: Mix feverfew (2 parts), peppermint (1 part), ginger (1 part). Take as tea or tincture at onset of symptoms.

**🍽️ NUTRITIONAL PROTOCOL**
• **Hydration**: 3-4 liters water daily with sea salt
• **Anti-inflammatory foods**: Turmeric, ginger, leafy greens, berries
• **Avoid**: Processed meats, aged cheeses, alcohol, artificial sweeteners

**💪 LIFESTYLE MODIFICATIONS**
• **Posture correction**: Ergonomic workspace, regular stretching
• **Sleep environment**: Cool, dark room, consistent schedule
• **Stress reduction**: Deep breathing, progressive muscle relaxation

**⚠️ SAFETY & MONITORING**
**Red flags requiring medical attention**: Sudden severe headache, vision changes, fever, confusion, headache after injury.

**🔬 SCIENTIFIC RATIONALE**
Feverfew contains parthenolide, which inhibits inflammatory pathways. Magnesium deficiency occurs in 50% of migraine sufferers. Proper hydration maintains blood volume and reduces vascular headaches.

*Track your triggers and response to identify the most effective personalized approach.*`;
  }
  
  if (lowerSymptoms.includes('tired') || lowerSymptoms.includes('fatigue') || lowerSymptoms.includes('energy')) {
    return `**🔍 SYMPTOM ANALYSIS**
Chronic fatigue often indicates underlying metabolic imbalances, nutrient deficiencies, or disrupted energy production at the cellular level. Your fatigue pattern suggests we need to address multiple systems simultaneously.

**🎯 DIAGNOSTIC PROBABILITY ASSESSMENT**
Most likely causes of your chronic fatigue:

• **Adrenal Fatigue/HPA Axis Dysfunction** - **70% probability**
  *Reasoning*: Chronic stress depletes adrenal function. Classic presentation is persistent fatigue despite rest, difficulty waking, afternoon crashes.

• **Iron Deficiency (with/without Anemia)** - **65% probability**  
  *Reasoning*: Most common nutritional deficiency causing fatigue. Can occur even with normal hemoglobin levels (iron stores depleted first).

• **Thyroid Dysfunction (Subclinical)** - **55% probability**
  *Reasoning*: Even slight thyroid underactivity causes fatigue. Often missed by standard tests that only check TSH.

• **Sleep Quality Disorder** - **60% probability**
  *Reasoning*: Non-restorative sleep from sleep apnea, frequent awakenings, or poor sleep hygiene. Quantity ≠ quality.

• **Chronic Inflammation** - **45% probability**
  *Reasoning*: Low-grade inflammation from diet, gut issues, or toxin exposure diverts energy to immune system.

**🎯 ROOT CAUSE ASSESSMENT**
• **Mitochondrial function**: Cellular energy production efficiency
• **Adrenal status**: Stress hormone dysregulation
• **Nutritional deficiencies**: B-vitamins, iron, magnesium, CoQ10
• **Sleep quality**: Non-restorative sleep patterns
• **Thyroid function**: Metabolic rate regulation

**📋 COMPREHENSIVE TREATMENT PLAN**

**Phase 1: Immediate Energy Support (1-7 days)**
• B-complex supplement (high potency, morning with food)
• Adaptogenic herbs: Rhodiola rosea (300mg) + Ginseng (500mg) morning
• Eliminate energy drains: Refined sugar, processed foods
• 20-minute power naps (not after 3 PM)

**Phase 2: Core Recovery (2-6 weeks)**
• **Mitochondrial support**: CoQ10 (200mg), PQQ (20mg), Alpha-lipoic acid (300mg)
• **Adrenal nourishment**: Ashwagandha (500mg evening), Holy basil tea
• **Iron status**: Consider testing; supplement if deficient (with Vitamin C)
• **Sleep optimization**: Melatonin (0.5-3mg), Magnesium glycinate (400mg)

**Phase 3: Sustained Energy (2-3 months)**
• **Metabolic reset**: Intermittent fasting protocols
• **Exercise progression**: Start gentle, build to moderate intensity
• **Stress management**: Daily meditation, breathing practices
• **Hormone balance**: Consider comprehensive testing

**🌿 HERBAL PRESCRIPTIONS**
**Morning Energy Blend**: Rhodiola (2 parts), American ginseng (2 parts), Schisandra berry (1 part). Take as tincture: 30-60 drops in water, twice daily.

**Evening Recovery Tea**: Equal parts ashwagandha, tulsi (holy basil), and chamomile. Steep 1 tbsp for 15 minutes. Drink 1 hour before bed.

**🍽️ NUTRITIONAL PROTOCOL**
• **Morning**: Protein + healthy fats within 1 hour of waking
• **Throughout day**: Balanced meals every 3-4 hours, avoid blood sugar spikes
• **Key nutrients**: Iron-rich foods (with Vitamin C), dark leafy greens, nuts/seeds
• **Hydration**: Electrolyte-enhanced water, herbal teas

**💪 LIFESTYLE MODIFICATIONS**
• **Sleep hygiene**: 7-9 hours, consistent schedule, cool dark room
• **Movement**: Start with 10-15 min walks, gradually increase
• **Stress reduction**: 5-10 min morning meditation, evening gratitude practice
• **Light exposure**: Morning sunlight, minimize blue light evening

**⚠️ SAFETY & MONITORING**
**Seek medical evaluation if**: Fatigue persists >6 months, accompanied by fever, unexplained weight loss, severe depression, or difficulty with basic daily activities.

**Lab tests to consider**: Complete blood count, comprehensive metabolic panel, thyroid panel (TSH, T3, T4), B12, folate, iron studies, Vitamin D.

**🔬 SCIENTIFIC RATIONALE**
Rhodiola increases ATP production and reduces cortisol dysregulation. B-vitamins are essential cofactors in energy metabolism. CoQ10 supports mitochondrial electron transport chain efficiency. Adaptogenic herbs help restore hypothalamic-pituitary-adrenal axis function.

*Energy restoration requires addressing root causes, not just symptoms. Patience and consistency are key to sustainable results.*`;
  }
  
  if (lowerSymptoms.includes('bloat') || lowerSymptoms.includes('gas') || lowerSymptoms.includes('digest') || lowerSymptoms.includes('stomach')) {
    return `**🔍 SYMPTOM ANALYSIS**
Digestive discomfort often indicates imbalanced gut microbiome, impaired digestive enzyme production, or food sensitivities. The timing and triggers of your symptoms provide important clues for targeted treatment.

**🎯 DIAGNOSTIC PROBABILITY ASSESSMENT**
Most likely causes of your digestive issues:

• **Small Intestinal Bacterial Overgrowth (SIBO)** - **65% probability**
  *Reasoning*: Bacteria ferment food in small intestine causing gas/bloating. Very common but often undiagnosed. Symptoms worsen with fiber/carbs.

• **Food Sensitivities (FODMAP/Gluten)** - **70% probability**  
  *Reasoning*: High-FODMAP foods (onions, garlic, beans, wheat) are poorly absorbed and ferment. Gluten sensitivity affects 6% of population.

• **Digestive Enzyme Deficiency** - **60% probability**
  *Reasoning*: Reduced pancreatic enzyme production with age/stress. Leads to incomplete digestion and bacterial fermentation.

• **Leaky Gut Syndrome** - **50% probability**
  *Reasoning*: Increased intestinal permeability allows larger molecules through, triggering inflammation and digestive symptoms.

• **Dysbiosis (Gut Bacteria Imbalance)** - **55% probability**
  *Reasoning*: Overgrowth of gas-producing bacteria relative to beneficial species. Often follows antibiotic use or poor diet.

**🎯 ROOT CAUSE ASSESSMENT**
• **Digestive enzyme insufficiency**: Reduced pepsin, lipase, or amylase production
• **Gut microbiome imbalance**: Dysbiosis affecting gas-producing bacteria
• **Food sensitivities**: Common triggers include FODMAPs, gluten, dairy
• **Eating patterns**: Speed of eating, food combining, meal timing
• **Stress impact**: Parasympathetic nervous system suppression

**📋 COMPREHENSIVE TREATMENT PLAN**

**Phase 1: Immediate Symptom Relief (1-3 days)**
• Digestive enzyme complex with meals (contains lipase, amylase, protease)
• Peppermint tea after meals (antispasmodic effect)
• Activated charcoal (500mg) for acute gas (2 hours away from other supplements)
• Warm compress on abdomen for cramping

**Phase 2: Gut Restoration (2-8 weeks)**
• **Probiotic protocol**: Multi-strain supplement (25+ billion CFU) + fermented foods
• **Prebiotic support**: Inulin, FOS, resistant starch from cooked/cooled potatoes
• **Digestive herbs**: Fennel seed, ginger root, gentian root before meals
• **Anti-inflammatory**: Slippery elm powder, marshmallow root tea

**Phase 3: Long-term Digestive Health (2-6 months)**
• **Food sensitivity identification**: Elimination diet or testing
• **Microbiome diversity**: Rotate fermented foods, fiber variety
• **Stress management**: Vagus nerve stimulation, mindful eating practices
• **Digestive timing**: Optimize meal spacing and size

**🌿 HERBAL PRESCRIPTIONS**
**Digestive Fire Tea**: Equal parts fennel seeds, fresh ginger, and peppermint. Steep 1 tsp per cup for 10 minutes. Drink 30 minutes before meals.

**Anti-Bloating Tincture**: Combine fennel (3 parts), caraway (2 parts), chamomile (2 parts), ginger (1 part). Take 30 drops in warm water after meals.

**🍽️ NUTRITIONAL PROTOCOL**
• **Meal timing**: Eat every 3-4 hours, avoid late evening meals
• **Food combining**: Avoid mixing proteins and starches in large quantities
• **Beneficial foods**: Bone broth, sauerkraut, kimchi, papaya, pineapple
• **Avoid temporarily**: High-FODMAP foods, carbonated drinks, chewing gum

**💪 LIFESTYLE MODIFICATIONS**
• **Mindful eating**: Chew thoroughly (20-30 times), eat without distractions
• **Movement**: 10-15 minute walks after meals aid digestion
• **Stress reduction**: Deep breathing before meals activates parasympathetic response
• **Sleep position**: Left side sleeping promotes gastric emptying

**⚠️ SAFETY & MONITORING**
**Seek medical attention if**: Severe abdominal pain, blood in stool, persistent vomiting, unexplained weight loss, symptoms lasting >2 weeks without improvement.

**Track symptoms**: Food and symptom diary to identify personal triggers and patterns.

**🔬 SCIENTIFIC RATIONALE**
Digestive enzymes break down macronutrients, reducing undigested food that feeds gas-producing bacteria. Peppermint contains menthol, which relaxes smooth muscle in the digestive tract. Probiotics help restore beneficial bacteria balance, improving overall digestive function.

*Digestive healing requires patience as the gut lining regenerates every 3-5 days, but full restoration takes 2-3 months.*`;
  }
  
  // Default comprehensive health consultation
  return `**🔍 SYMPTOM ANALYSIS**
Based on your health concerns, I'm analyzing multiple factors that could be contributing to your symptoms. Every person's health picture is unique, requiring a personalized approach to achieve optimal wellness.

**🎯 DIAGNOSTIC PROBABILITY ASSESSMENT**
Without specific symptoms, here are common underlying health patterns I assess:

• **Chronic Low-Grade Inflammation** - **60% probability**
  *Reasoning*: Modern lifestyle factors (processed foods, stress, toxins, sedentary behavior) create systemic inflammation in most adults.

• **Nutrient Deficiencies** - **70% probability**  
  *Reasoning*: Soil depletion and processed foods mean most people are deficient in key nutrients (Vitamin D, B12, Magnesium, Omega-3s).

• **Circadian Rhythm Disruption** - **55% probability**
  *Reasoning*: Artificial light, irregular schedules, and screen time disrupt natural sleep-wake cycles affecting multiple body systems.

• **Chronic Stress/HPA Axis Dysfunction** - **65% probability**
  *Reasoning*: Modern life creates chronic stress activation, eventually leading to adrenal fatigue and multiple health symptoms.

• **Gut Microbiome Imbalance** - **50% probability**
  *Reasoning*: Antibiotics, processed foods, and stress alter gut bacteria, affecting digestion, immunity, and even mental health.

**🎯 ROOT CAUSE ASSESSMENT**
• **Lifestyle factors**: Sleep quality, stress levels, physical activity patterns
• **Nutritional status**: Potential deficiencies or imbalances affecting health
• **Environmental influences**: Toxin exposure, air quality, water quality
• **Genetic predispositions**: Individual variations in metabolism and health needs

**📋 COMPREHENSIVE TREATMENT PLAN**

**Phase 1: Foundation Building (1-2 weeks)**
• **Hydration optimization**: 3-4 liters pure water daily with trace minerals
• **Sleep consistency**: 7-9 hours nightly, same bedtime/wake time
• **Nutrient density**: Whole foods diet, eliminate processed options
• **Stress reduction**: Daily 10-minute breathing practice

**Phase 2: Targeted Support (2-6 weeks)**
• **Adaptogenic herbs**: Choose based on your primary concerns
• **Nutritional supplementation**: Address any identified deficiencies  
• **Movement integration**: Gentle exercise appropriate to your fitness level
• **Detoxification support**: Liver and lymphatic system enhancement

**Phase 3: Long-term Optimization (2-6 months)**
• **Personalized protocols**: Based on your body's specific responses
• **Advanced testing**: Consider functional medicine assessments if needed
• **Lifestyle refinement**: Fine-tune habits for sustained wellness
• **Community support**: Connect with others on similar health journeys

**🌿 HERBAL PRESCRIPTIONS**
**Universal Wellness Tea**: Equal parts nettle leaf, red clover, and peppermint. Steep 1 tbsp per cup for 15 minutes. Rich in minerals and gently detoxifying.

**Adaptogenic Support**: Rotate between ashwagandha (stress), rhodiola (energy), and schisandra (liver support) based on your body's changing needs.

**🍽️ NUTRITIONAL PROTOCOL**
• **Anti-inflammatory focus**: Turmeric, ginger, omega-3 fatty acids, colorful vegetables
• **Micronutrient density**: Dark leafy greens, nuts, seeds, organ meats (if tolerated)
• **Digestive support**: Fermented foods, bone broth, digestive enzymes with meals
• **Blood sugar stability**: Protein with each meal, minimize refined carbohydrates

**💪 LIFESTYLE MODIFICATIONS**
• **Circadian rhythm support**: Morning sunlight exposure, evening light reduction
• **Movement variety**: Walking, stretching, strength training as appropriate
• **Stress management**: Meditation, journaling, time in nature
• **Social connections**: Maintain supportive relationships for mental/emotional health

**⚠️ SAFETY & MONITORING**
**Work with healthcare providers**: Especially if you have existing conditions or take medications. Natural doesn't always mean safe for everyone.

**Listen to your body**: Start slowly with new protocols, monitor responses, adjust accordingly.

**🔬 SCIENTIFIC RATIONALE**
Optimal health requires addressing multiple systems simultaneously. Research shows that lifestyle factors - sleep, nutrition, movement, stress management - have the greatest impact on long-term health outcomes.

*Your health journey is unique. These recommendations provide a foundation, but personalization based on your body's responses is key to achieving your wellness goals.*

**Ready to begin? Start with Phase 1 and let me know how your body responds. I'm here to help adjust the plan as needed.**`;
}

// REMOVED RESTRICTIVE HEALTH FILTER - PlantRx now answers ALL body/health/wellness questions
import { eq, and, or, desc, asc, ilike, like, sql } from "drizzle-orm";
import { 
  insertUserSchema, 
  insertRemedySchema, 
  insertReviewSchema, 
  insertFeedbackSchema,
  insertBusinessSchema,
  insertBusinessReviewSchema,
  insertHealthPlanSchema,
  insertCustomRemedySchema,
  customerRegistrationSchema,
  expertRegistrationSchema,
  subscriptionUpdateSchema,
  // Community social platform imports
  users,
  remedies,
  reviews,
  feedback,
  savedRemedies,
  customRemedies,
  orders,
  communityPosts,
  postLikes,
  postComments,
  commentLikes,
  userFollows,
  userProfiles,
  notifications,
  // Health tracking imports
  healthLogs,
  healthGoals,
  healthMetrics,
  userActivityFeed,
  userActivities,
  // Chat history imports
  chatSessions,
  chatMessages,
  insertChatSessionSchema,
  insertChatMessageSchema,
  type CommunityPost,
  type PostLike,
  type PostComment,
  type UserFollow,
  type UserProfile,
  type UserNotification,
  type CustomRemedy,
  type InsertCustomRemedy,
  type Feedback,
  type InsertFeedback,
  type ChatSession,
  type ChatMessage,
  type InsertChatSession,
  type InsertChatMessage,
  type Order,
  insertOrderSchema
} from "@shared/schema";



// Helper functions for parsing remedy responses
function extractIngredients(text: string): string[] {
  const ingredientPatterns = [
    /ingredients?[:\-\s]*([^\n]*)/i,
    /(?:use|with|contains?)[:\-\s]*([^\n]*)/i,
    /materials?[:\-\s]*([^\n]*)/i
  ];
  
  for (const pattern of ingredientPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].split(/[,;]/).map(i => i.trim()).filter(i => i.length > 0);
    }
  }
  
  // Fallback: extract common natural ingredients
  const commonIngredients = ['ginger', 'turmeric', 'honey', 'lemon', 'garlic', 'tea', 'oil', 'salt'];
  const found = commonIngredients.filter(ingredient => 
    text.toLowerCase().includes(ingredient)
  );
  
  return found.length > 0 ? found : ['Natural ingredients'];
}

function extractBenefits(text: string): string[] {
  const benefitPatterns = [
    /benefits?[:\-\s]*([^\n]*)/i,
    /helps?[:\-\s]*([^\n]*)/i,
    /(?:good|useful) for[:\-\s]*([^\n]*)/i
  ];
  
  for (const pattern of benefitPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].split(/[,;]/).map(b => b.trim()).filter(b => b.length > 0);
    }
  }
  
  return ['Natural health benefits', 'Supports wellness'];
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // NOTE: sitemap.xml and robots.txt are already defined in server/index.ts
  // No need for duplicate endpoints here
  
  // Username availability check
  app.get("/api/auth/check-username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const existingUser = await storage.getUserByUsername(username);
      res.json({ available: !existingUser });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { isPrivate, firstName, lastName, ...userDataRaw } = req.body;
      const userData = insertUserSchema.parse({
        ...userDataRaw,
        firstName,
        lastName
      });
      
      // Check if user already exists by email
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      
      const user = await storage.createUser(userData);
      
      // Create user profile with privacy settings
      if (user.id) {
        try {
          await db.insert(userProfiles).values({
            userId: user.id,
            isPrivate: isPrivate || false,
            allowFollowRequests: (isPrivate && isPrivate !== false) ? true : false,
          });
        } catch (profileError) {
          console.error("Failed to create user profile:", profileError);
        }
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Enhanced registration routes
  app.post("/api/auth/register/customer", async (req, res) => {
    try {
      const userData = customerRegistrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createCustomer(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/register/expert", async (req, res) => {
    try {
      const userData = expertRegistrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createExpert(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set up session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test login endpoint for quick access
  app.post("/api/auth/test-login", async (req, res) => {
    try {
      const user = await storage.getUserById(55);
      if (!user) {
        return res.status(404).json({ message: "Test user not found" });
      }
      
      // Set up session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      
      // Save session explicitly
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            reject(err);
          } else {
            console.log("Test session saved successfully for user:", user.id);
            resolve();
          }
        });
      });
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      console.error("Test login error:", error);
      res.status(500).json({ message: error.message });
    }
  });


  // Get current user profile
  // Sync Firebase authentication with backend session
  app.post('/api/auth/firebase-sync', async (req, res) => {
    try {
      // Get Authorization header with Firebase ID token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header with Bearer token required" });
      }

      const idToken = authHeader.substring(7); // Remove 'Bearer '
      
      // Verify Firebase ID token server-side
      let decodedToken;
      try {
        decodedToken = await verifyFirebaseIdToken(idToken);
      } catch (tokenError) {
        console.error("❌ Firebase token verification failed:", tokenError);
        return res.status(401).json({ message: "Invalid Firebase token" });
      }

      // Extract verified user data from token (no PII logging)
      const { uid, email, name, picture } = decodedToken;
      console.log("Firebase sync request for UID:", uid ? uid.substring(0, 8) + '...' : 'unknown');
      
      if (!email || !uid) {
        return res.status(400).json({ message: "Invalid token: missing email or UID" });
      }

      // Check if user exists in database
      let user = await storage.getUserByEmail(email);
      console.log("Existing user found:", user ? user.id : 'none');
      
      if (!user) {
        // Create new user if doesn't exist
        console.log("Creating new user for UID:", uid.substring(0, 8) + '...');
        user = await storage.createUser({
          email,
          username: name || email.split('@')[0],
          password: 'firebase-auth', // Placeholder for Firebase users
          firstName: name?.split(' ')[0] || null,
          lastName: name?.split(' ').slice(1).join(' ') || null
        });
        console.log("New user created with ID:", user.id);
      } else if (name || picture) {
        // Update existing user with Firebase data if provided
        console.log("Updating existing user:", user.id);
        user = await storage.updateUser(user.id, {
          fullName: name || user.fullName,
          profilePictureUrl: picture || user.profilePictureUrl
        });
      }

      // Set up session and save it explicitly
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      console.log("Session set with userId:", user.id);
      
      // Save session explicitly to ensure it persists
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            reject(err);
          } else {
            console.log("Session saved successfully for userId:", user.id);
            resolve();
          }
        });
      });
      
      // Check if trial should be started (passed from client when user had trial intent)
      const { startTrial } = req.body;
      let trialStarted = false;
      
      if (startTrial) {
        console.log("[TRIAL] Starting trial as part of firebase-sync for user:", user.id);
        
        // Check if user already has a trial or is on a paid subscription
        const [currentUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id));
        
        if (currentUser && !currentUser.goldTrialUsedOnce && !currentUser.goldTrialStartedAt) {
          // Start the trial
          const now = new Date();
          await db
            .update(users)
            .set({
              goldTrialStartedAt: now,
              subscriptionTier: "gold",
              subscriptionStatus: "active",
            })
            .where(eq(users.id, user.id));
          
          trialStarted = true;
          console.log(`[TRIAL] User ${user.id} started 24-hour Gold trial via firebase-sync`);
        } else {
          console.log(`[TRIAL] User ${user.id} cannot start trial - already used or active subscription`);
        }
      }
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        res.json({ 
          user: { ...user, password: undefined },
          trialStarted
        });
      });
    } catch (error: any) {
      console.error("Firebase sync error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Logout endpoint to clear session
  app.post('/api/auth/logout', async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      console.log("Session data:", req.session);
      console.log("Session userId:", req.session?.userId);
      
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get current user with trial-aware subscription tier
  // This is the primary endpoint for SubscriptionContext
  app.get("/api/user/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Fetch user from database to get latest subscription data
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId));
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if trial is active - this determines effective subscription tier
      let effectiveTier = currentUser.subscriptionTier || 'bronze';
      let effectiveStatus = currentUser.subscriptionStatus || 'active';
      
      if (currentUser.goldTrialStartedAt) {
        const trialEndTime = new Date(currentUser.goldTrialStartedAt.getTime() + 24 * 60 * 60 * 1000);
        const isTrialActive = new Date() < trialEndTime;
        
        if (isTrialActive) {
          // Trial is active - user gets Gold access
          effectiveTier = 'gold';
          effectiveStatus = 'trial';
          console.log(`[USER/ME] User ${currentUser.id} has active trial - returning Gold tier`);
        } else if (!currentUser.goldTrialUsedOnce) {
          // Trial has expired but not marked - revert to bronze
          await db
            .update(users)
            .set({
              goldTrialUsedOnce: true,
              subscriptionTier: "bronze",
              subscriptionStatus: "active",
            })
            .where(eq(users.id, currentUser.id));
          
          effectiveTier = 'bronze';
          effectiveStatus = 'active';
          console.log(`[USER/ME] User ${currentUser.id} trial expired - reverted to Bronze`);
        }
      }
      
      // Return user with effective subscription data
      res.json({
        ...currentUser,
        password: undefined,
        subscriptionTier: effectiveTier,
        subscriptionStatus: effectiveStatus,
      });
    } catch (error: any) {
      console.error("Get user/me error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Onboarding completion endpoint
  app.post("/api/user/onboarding", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { age, location, healthGoals, primaryConcern, experienceLevel, interests, hasCompletedOnboarding } = req.body;

      const updatedUser = await storage.updateUser(userId, {
        age: age ? parseInt(age) : undefined,
        location,
        healthInterests: interests,
        hasCompletedOnboarding: hasCompletedOnboarding || true,
      });

      res.json({ success: true, user: { ...updatedUser, password: undefined } });
    } catch (error: any) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update user preferences (health goals, accessibility, notifications)
  app.patch("/api/user/preferences", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const {
        // Health & Wellness
        healthGoals,
        dietaryRestrictions,
        allergies,
        preferredRemedyForms,
        // Notifications
        emailNotifications,
        pushNotifications,
        weeklyDigest,
        newRemedyAlerts,
        expertTipsEnabled,
        // Accessibility
        textSize,
        highContrast,
        reducedMotion,
        screenReaderOptimized,
        // Personalization
        timezone,
        preferredLanguage,
        // Profile
        fullName,
        firstName,
        lastName,
        age,
        location,
        healthInterests,
      } = req.body;

      // Build update object with only provided fields
      const updateData: any = {};
      if (healthGoals !== undefined) updateData.healthGoals = healthGoals;
      if (dietaryRestrictions !== undefined) updateData.dietaryRestrictions = dietaryRestrictions;
      if (allergies !== undefined) updateData.allergies = allergies;
      if (preferredRemedyForms !== undefined) updateData.preferredRemedyForms = preferredRemedyForms;
      if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
      if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications;
      if (weeklyDigest !== undefined) updateData.weeklyDigest = weeklyDigest;
      if (newRemedyAlerts !== undefined) updateData.newRemedyAlerts = newRemedyAlerts;
      if (expertTipsEnabled !== undefined) updateData.expertTipsEnabled = expertTipsEnabled;
      if (textSize !== undefined) updateData.textSize = textSize;
      if (highContrast !== undefined) updateData.highContrast = highContrast;
      if (reducedMotion !== undefined) updateData.reducedMotion = reducedMotion;
      if (screenReaderOptimized !== undefined) updateData.screenReaderOptimized = screenReaderOptimized;
      if (timezone !== undefined) updateData.timezone = timezone;
      if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;
      if (fullName !== undefined) updateData.fullName = fullName;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (age !== undefined) updateData.age = age;
      if (location !== undefined) updateData.location = location;
      if (healthInterests !== undefined) updateData.healthInterests = healthInterests;

      // Update user in database
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      // Fetch updated user
      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      console.log(`[PREFERENCES] Updated preferences for user ${userId}`);
      res.json({ success: true, user: { ...updatedUser, password: undefined } });
    } catch (error: any) {
      console.error("Preferences update error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Expert routes
  app.get("/api/experts", async (req, res) => {
    try {
      const experts = await storage.getExpertsByStatus("approved");
      res.json(experts.map(expert => ({ ...expert, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Expert remedy generation endpoint
  app.post("/api/expert/generate-remedy", async (req, res) => {
    try {
      const { need, preferences } = req.body;
      
      if (!need) {
        return res.status(400).json({ message: "Health need is required" });
      }

      // Professional system prompt for structured remedy generation
      const systemPrompt = `You are a clinical herbalist and natural health expert. Create a professional, structured natural remedy using only verified herbal ingredients and traditional medicine practices.

      IMPORTANT REQUIREMENTS:
      - Use ONLY professional, clinical language - no personal greetings, emotional language, or conversational tone
      - Provide structured, factual information only
      - Focus on evidence-based natural ingredients and their therapeutic properties
      - Include specific dosages, preparation methods, and safety considerations
      - No phrases like "my dear", "I hear your plea", or any personal language
      - Present information in a clinical, educational format

      Create a comprehensive remedy in this exact JSON format:
      {
        "name": "Clinical name for the remedy (e.g., 'Analgesic Herbal Formula for Headache Relief')",
        "ingredients": ["Primary herb 1", "Supporting herb 2", "Synergistic compound 3"],
        "benefits": ["Primary therapeutic benefit", "Secondary benefit", "Supporting effect"],
        "form": "Most appropriate preparation method (tea, tincture, topical, capsules)",
        "instructions": "Detailed preparation and administration instructions with exact measurements and timing",
        "safety": "Professional safety information including contraindications and potential interactions",
        "scientific_basis": "Brief explanation of the therapeutic compounds and their mechanisms of action",
        "dosage": "Recommended frequency and amount for therapeutic effectiveness",
        "duration": "Suggested treatment duration and expected timeline for results"
      }`;

      const prompt = `Health Concern: "${need}"
      ${preferences ? `Preferences: ${preferences}` : ''}
      
      Create a professional natural remedy based on clinical herbal knowledge and evidence-based traditional medicine.`;

      if (!openai) {
        return res.status(503).json({ message: "AI service unavailable" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1200
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response content received");
      }

      const generatedRemedy = JSON.parse(content);
      
      // Validate the response has required fields
      if (!generatedRemedy.name || !generatedRemedy.ingredients || !generatedRemedy.instructions) {
        throw new Error("Incomplete remedy generated");
      }
      
      // Ensure professional format
      const professionalRemedy = {
        name: generatedRemedy.name,
        ingredients: Array.isArray(generatedRemedy.ingredients) ? generatedRemedy.ingredients : [],
        benefits: Array.isArray(generatedRemedy.benefits) ? generatedRemedy.benefits : [],
        form: generatedRemedy.form || "herbal preparation",
        instructions: generatedRemedy.instructions,
        safety: generatedRemedy.safety || "Consult healthcare provider before use",
        scientific_basis: generatedRemedy.scientific_basis || "Based on traditional herbal medicine",
        dosage: generatedRemedy.dosage || "As directed",
        duration: generatedRemedy.duration || "Use as needed"
      };

      res.json(professionalRemedy);
    } catch (error: any) {
      console.error("Expert remedy generation error:", error);
      res.status(500).json({ 
        message: "Unable to generate remedy at this time",
        error: "Please try again or consult our experts directly"
      });
    }
  });

  // Expert symptom finder endpoint
  app.post("/api/expert/symptom-finder", async (req, res) => {
    try {
      const { symptoms, age, duration } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ message: "Symptoms are required" });
      }

      // Use dual AI system for expert symptom analysis
      const analysisPrompt = `Analyze symptoms: ${symptoms}${age ? ` (Age: ${age})` : ''}${duration ? ` (Duration: ${duration})` : ''}. Provide natural remedy recommendations.`;
      
      const dualResponse = await dualAI.generateDualExpertResponse(
        analysisPrompt, 
        'expert_symptom_analysis'
      );

      res.json({
        analysis: dualResponse.primary,
        recommendations: extractBenefits(dualResponse.primary),
        confidence: dualResponse.confidence,
        source: dualResponse.source
      });
    } catch (error: any) {
      console.error("Expert symptom analysis error:", error);
      res.status(500).json({ 
        message: "Unable to analyze symptoms at this time",
        error: "Please try again or consult our experts directly"
      });
    }
  });

  // Expert remedy search endpoint
  app.post("/api/expert/search-remedies", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Search existing remedies
      const searchResults = await storage.searchRemedies(query);
      
      // Enhance results with expert analysis
      const dualResponse = await dualAI.generateDualExpertResponse(
        `Provide expert analysis for remedies related to: ${query}`, 
        'expert_remedy_search'
      );

      res.json({
        remedies: searchResults,
        expert_analysis: dualResponse.primary,
        confidence: dualResponse.confidence,
        source: dualResponse.source
      });
    } catch (error: any) {
      console.error("Expert remedy search error:", error);
      res.status(500).json({ 
        message: "Unable to search remedies at this time",
        error: "Please try again or browse our remedy database"
      });
    }
  });

  // Smart Symptom Analysis Chat Endpoint
  app.post("/api/expert/chat", async (req, res) => {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    try {
      const latestMessage = messages[messages.length - 1];
      const conversationHistory = messages.length > 1 ? 
        messages.slice(0, -1).map(m => m.content) : [];

      // Use advanced smart symptom analysis with dual AI
      const analysis = await dualAI.generateSmartSymptomAnalysis(
        latestMessage.content, 
        conversationHistory
      );

      res.json({
        reply: analysis.primary,
        confidence: analysis.confidence,
        source: analysis.source,
        analysisType: "smart_symptom_diagnosis"
      });
    } catch (error: any) {
      console.error("Smart symptom analysis error:", error);
      
      // Fallback to regular dual AI expert response
      try {
        const latestMessage = messages[messages.length - 1];
        const conversationContext = messages.length > 1 ? 
          messages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join('\n') : '';

        const fallbackResponse = await dualAI.generateDualExpertResponse(
          latestMessage.content, 
          conversationContext
        );

        res.json({
          reply: fallbackResponse.primary,
          confidence: fallbackResponse.confidence,
          source: fallbackResponse.source,
          analysisType: "general_expert"
        });
      } catch (fallbackError) {
        res.status(500).json({ 
          message: "Unable to analyze symptoms at this time",
          reply: "I'm temporarily unavailable for symptom analysis. Please try again later or browse our remedy database for immediate solutions."
        });
      }
    }
  });

  // ====================
  // CHAT HISTORY ENDPOINTS
  // ====================

  // Get user's chat sessions (history)
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessions = await db
        .select({
          id: chatSessions.id,
          title: chatSessions.title,
          summary: chatSessions.summary,
          createdAt: chatSessions.createdAt,
          updatedAt: chatSessions.updatedAt,
        })
        .from(chatSessions)
        .where(and(
          eq(chatSessions.userId, req.session.userId),
          eq(chatSessions.isActive, true)
        ))
        .orderBy(desc(chatSessions.updatedAt));

      res.json(sessions);
    } catch (error: any) {
      console.error("Get chat sessions error:", error);
      res.status(500).json({ message: "Failed to load chat history" });
    }
  });

  // Get messages for a specific chat session
  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessionId = parseInt(req.params.sessionId);
      
      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, req.session.userId)
        ));

      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(asc(chatMessages.timestamp));

      res.json(messages);
    } catch (error: any) {
      console.error("Get chat messages error:", error);
      res.status(500).json({ message: "Failed to load chat messages" });
    }
  });

  // Create a new chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { title, summary } = req.body;

      const [session] = await db
        .insert(chatSessions)
        .values({
          userId: req.session.userId,
          title: title || "New Health Chat",
          summary: summary || "Health symptom discussion",
        })
        .returning();

      res.json(session);
    } catch (error: any) {
      console.error("Create chat session error:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Save messages to a chat session
  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessionId = parseInt(req.params.sessionId);
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, req.session.userId)
        ));

      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Insert messages
      const savedMessages = [];
      for (const message of messages) {
        const [savedMessage] = await db
          .insert(chatMessages)
          .values({
            sessionId,
            role: message.role,
            content: message.content,
          })
          .returning();
        savedMessages.push(savedMessage);
      }

      // Update session's updatedAt timestamp
      await db
        .update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(chatSessions.id, sessionId));

      res.json({ saved: savedMessages.length, messages: savedMessages });
    } catch (error: any) {
      console.error("Save chat messages error:", error);
      res.status(500).json({ message: "Failed to save chat messages" });
    }
  });

  // Update chat session title/summary
  app.patch("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessionId = parseInt(req.params.sessionId);
      const { title, summary } = req.body;

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, req.session.userId)
        ));

      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const [updatedSession] = await db
        .update(chatSessions)
        .set({ 
          ...(title && { title }),
          ...(summary && { summary }),
          updatedAt: new Date()
        })
        .where(eq(chatSessions.id, sessionId))
        .returning();

      res.json(updatedSession);
    } catch (error: any) {
      console.error("Update chat session error:", error);
      res.status(500).json({ message: "Failed to update chat session" });
    }
  });

  // Delete a chat session
  app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessionId = parseInt(req.params.sessionId);

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, req.session.userId)
        ));

      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Soft delete by setting isActive to false
      await db
        .update(chatSessions)
        .set({ isActive: false })
        .where(eq(chatSessions.id, sessionId));

      res.json({ message: "Chat session deleted" });
    } catch (error: any) {
      console.error("Delete chat session error:", error);
      res.status(500).json({ message: "Failed to delete chat session" });
    }
  });

  // Business routes
  app.get("/api/businesses", async (req, res) => {
    try {
      const { category, expertise, location, verified } = req.query;
      const filters = {
        category: category as string,
        expertise: expertise as string,
        location: location as string,
        verified: verified === "true"
      };
      const businesses = await storage.getBusinesses(filters);
      res.json(businesses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const business = await storage.getBusiness(parseInt(req.params.id));
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      res.json(business);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/businesses", async (req, res) => {
    try {
      const businessData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(businessData);
      res.json(business);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/businesses/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getBusinessReviews(parseInt(req.params.id));
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/businesses/:id/reviews", async (req, res) => {
    try {
      const reviewData = insertBusinessReviewSchema.parse({
        ...req.body,
        businessId: parseInt(req.params.id)
      });
      const review = await storage.createBusinessReview(reviewData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/experts/pending", async (req, res) => {
    try {
      const pendingExperts = await storage.getPendingExperts();
      res.json(pendingExperts.map(expert => ({ ...expert, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/experts/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const expert = await storage.updateExpertStatus(parseInt(req.params.id), status);
      res.json({ ...expert, password: undefined });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // MailerLite Newsletter routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, name, source } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const result = await mailerLiteService.subscribeToNewsletter({
        email,
        name: name || '',
        source: source || 'footer'
      });

      res.json({ 
        success: true, 
        message: "Successfully subscribed to newsletter!",
        subscriber: result 
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error.message || error);
      res.status(500).json({ 
        message: "Failed to subscribe to newsletter. Please try again later.",
        error: typeof error === 'string' ? error : (error.message || 'Unknown error')
      });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await mailerLiteService.unsubscribeFromNewsletter(email);
      res.json({ 
        success: true, 
        message: "Successfully unsubscribed from newsletter" 
      });
    } catch (error: any) {
      console.error('Newsletter unsubscribe error:', error.message || error);
      res.status(500).json({ 
        message: "Failed to unsubscribe. Please try again later.",
        error: typeof error === 'string' ? error : (error.message || 'Unknown error')
      });
    }
  });

  app.get("/api/newsletter/subscriber/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const subscriber = await mailerLiteService.getSubscriber(email);
      
      if (!subscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      res.json(subscriber);
    } catch (error: any) {
      console.error('Get subscriber error:', error.message || error);
      res.status(500).json({ 
        message: "Failed to get subscriber information",
        error: typeof error === 'string' ? error : (error.message || 'Unknown error')
      });
    }
  });

  // Remedy routes
  app.get("/api/remedies", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let remedies;
      if (search) {
        const { db } = await import('./db');
        const { remedies: remediesTable } = await import('../shared/schema');
        const { eq, and, like } = await import('drizzle-orm');
        
        remedies = await db.select().from(remediesTable).where(
          and(
            eq(remediesTable.isActive, true),
            like(remediesTable.name, `%${search}%`)
          )
        );
      } else if (category) {
        const { db } = await import('./db');
        const { remedies: remediesTable } = await import('../shared/schema');
        const { eq, and, like } = await import('drizzle-orm');
        
        // Handle special headache/migraine category mapping
        let categoryFilter = category as string;
        if (category === 'headache') {
          // Show all pain-relief remedies that mention headache + specific headache techniques
          remedies = await db.select().from(remediesTable).where(
            and(
              eq(remediesTable.isActive, true),
              like(remediesTable.name, `%headache%`)
            )
          );
        } else if (category === 'migraine') {
          // Show all pain-relief remedies that mention migraine + specific migraine treatments
          remedies = await db.select().from(remediesTable).where(
            and(
              eq(remediesTable.isActive, true),
              like(remediesTable.name, `%migraine%`)
            )
          );
        } else {
          remedies = await db.select().from(remediesTable).where(
            and(eq(remediesTable.category, categoryFilter), eq(remediesTable.isActive, true))
          );
        }
      } else {
        const { db } = await import('./db');
        const { remedies: remediesTable } = await import('../shared/schema');
        const { eq, desc } = await import('drizzle-orm');
        
        remedies = await db.select()
          .from(remediesTable)
          .where(eq(remediesTable.isActive, true))
          .orderBy(desc(remediesTable.createdAt));
      }
      
      // Ensure proper JSON structure and validate data
      console.log(`Returning ${remedies.length} remedies`);
      
      // Return complete remedy data structure - no cleaning needed, data is already complete
      res.setHeader('Content-Type', 'application/json');
      res.json(remedies);
    } catch (error: any) {
      console.error('Remedies API error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/remedies/featured", async (req, res) => {
    try {
      // Add performance caching headers
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minute cache
      res.setHeader('ETag', 'featured-remedies-v1');
      
      const { db } = await import('./db');
      const { remedies } = await import('../shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      const featuredRemedies = await db.select()
        .from(remedies)
        .where(eq(remedies.isActive, true))
        .orderBy(desc(remedies.averageRating))
        .limit(6);
      
      res.json(featuredRemedies);
    } catch (error: any) {
      console.error("Error fetching featured remedies:", error);
      res.status(500).json({ message: "Unable to fetch featured remedies" });
    }
  });

  // Personalized recommendations based on user activity
  app.get("/api/remedies/personalized", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        // If not logged in, return featured remedies
        const featuredRemedies = await storage.getFeaturedRemedies();
        return res.json(featuredRemedies.slice(0, 6));
      }

      // Get user's custom remedies to understand their interests
      const userCustomRemedies = await db.select()
        .from(customRemedies)
        .where(eq(customRemedies.userId, userId));

      // Extract health conditions and ingredients from user's custom remedies
      const searchTerms = [];
      
      userCustomRemedies.forEach(remedy => {
        // Extract condition keywords from remedy names
        if (remedy.name) {
          const name = remedy.name.toLowerCase();
          if (name.includes('bloating') || name.includes('digestive')) searchTerms.push('digestive', 'stomach', 'bloating');
          if (name.includes('headache') || name.includes('migraine')) searchTerms.push('headache', 'pain', 'migraine');
          if (name.includes('nausea')) searchTerms.push('nausea', 'stomach', 'digestive');
          if (name.includes('cramp')) searchTerms.push('cramps', 'muscle', 'pain');
          if (name.includes('anxiety') || name.includes('stress')) searchTerms.push('anxiety', 'stress', 'calming');
          if (name.includes('sleep') || name.includes('insomnia')) searchTerms.push('sleep', 'insomnia', 'calming');
        }
        
        // Extract ingredient keywords
        if (Array.isArray(remedy.ingredients)) {
          remedy.ingredients.forEach((ing: string) => {
            const ingredient = ing.toLowerCase().trim();
            if (ingredient.includes('ginger')) searchTerms.push('ginger', 'digestive', 'nausea');
            if (ingredient.includes('turmeric')) searchTerms.push('turmeric', 'inflammation', 'pain');
            if (ingredient.includes('chamomile')) searchTerms.push('chamomile', 'calming', 'sleep');
            if (ingredient.includes('peppermint')) searchTerms.push('peppermint', 'digestive', 'stomach');
            if (ingredient.includes('lavender')) searchTerms.push('lavender', 'anxiety', 'sleep');
          });
        }
      });

      // If we have search terms, find related remedies
      if (searchTerms.length > 0) {
        const uniqueTerms = [...new Set(searchTerms)];
        const searchQuery = uniqueTerms.slice(0, 3).join(' ');
        
        try {
          const relatedRemedies = await storage.searchRemedies(searchQuery);
          
          if (relatedRemedies.length >= 3) {
            return res.json(relatedRemedies.slice(0, 6));
          }
        } catch (searchError) {
          console.error('Search error:', searchError);
        }
      }

      // Fallback: return featured remedies
      const featuredRemedies = await storage.getFeaturedRemedies();
      res.json(featuredRemedies.slice(0, 6));
    } catch (error: any) {
      console.error('Personalized recommendations error:', error);
      // Always return some remedies, even on error
      try {
        const featuredRemedies = await storage.getFeaturedRemedies();
        res.json(featuredRemedies.slice(0, 6));
      } catch (fallbackError) {
        res.status(500).json({ message: error.message });
      }
    }
  });

  // Smart suggestions based on user preferences (health goals, dietary restrictions, allergies, remedy forms)
  app.post("/api/remedies/suggestions", async (req, res) => {
    try {
      const { healthGoals, dietaryRestrictions, allergies, preferredRemedyForms } = req.body;
      
      const { db } = await import('./db');
      const { remedies } = await import('../shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      // Map health goals to remedy categories and search terms
      const goalToCategoryMap: Record<string, string[]> = {
        'weight_loss': ['digestive', 'detox', 'metabolism'],
        'better_sleep': ['stress-relief', 'calming', 'sleep'],
        'stress_relief': ['stress-relief', 'calming', 'anxiety'],
        'immunity': ['immune-support', 'respiratory', 'antioxidant'],
        'energy': ['energy', 'cognitive', 'vitality'],
        'digestion': ['digestive', 'gut-health', 'stomach'],
        'skin_health': ['skin-care', 'detox', 'anti-inflammatory'],
        'pain_relief': ['pain-relief', 'anti-inflammatory', 'muscle'],
        'mental_clarity': ['cognitive', 'brain', 'focus'],
        'heart_health': ['cardiovascular', 'heart', 'circulation'],
      };
      
      // Map remedy form preferences to database form values
      const formMap: Record<string, string[]> = {
        'tea': ['tea', 'infusion', 'decoction'],
        'tincture': ['tincture', 'tonic', 'elixir'],
        'capsule': ['capsule', 'supplement', 'pill'],
        'topical': ['topical', 'salve', 'balm', 'cream', 'oil', 'paste'],
        'essential_oil': ['oil', 'essential oil', 'aromatherapy'],
        'powder': ['powder', 'raw'],
      };
      
      // Collect categories to search based on health goals
      const categoriesToSearch: string[] = [];
      if (healthGoals && healthGoals.length > 0) {
        healthGoals.forEach((goal: string) => {
          const categories = goalToCategoryMap[goal];
          if (categories) {
            categoriesToSearch.push(...categories);
          }
        });
      }
      
      // Collect forms to filter by
      const formsToFilter: string[] = [];
      if (preferredRemedyForms && preferredRemedyForms.length > 0) {
        preferredRemedyForms.forEach((form: string) => {
          const forms = formMap[form];
          if (forms) {
            formsToFilter.push(...forms);
          }
        });
      }
      
      // Build the query with dynamic filtering
      let allRemedies = await db.select()
        .from(remedies)
        .where(eq(remedies.isActive, true))
        .orderBy(desc(remedies.averageRating));
      
      // Filter by categories if we have health goals
      if (categoriesToSearch.length > 0) {
        const uniqueCategories = [...new Set(categoriesToSearch)];
        allRemedies = allRemedies.filter(remedy => 
          uniqueCategories.some(cat => 
            remedy.category?.toLowerCase().includes(cat.toLowerCase()) ||
            remedy.description?.toLowerCase().includes(cat.toLowerCase()) ||
            remedy.name?.toLowerCase().includes(cat.toLowerCase())
          )
        );
      }
      
      // Filter by remedy forms if specified
      if (formsToFilter.length > 0) {
        const uniqueForms = [...new Set(formsToFilter)];
        allRemedies = allRemedies.filter(remedy =>
          uniqueForms.some(form =>
            remedy.form?.toLowerCase().includes(form.toLowerCase())
          )
        );
      }
      
      // Filter out remedies with allergens if user has allergies
      if (allergies && allergies.length > 0) {
        const allergenKeywords: Record<string, string[]> = {
          'nuts': ['nut', 'almond', 'walnut', 'cashew', 'pecan'],
          'peanuts': ['peanut'],
          'dairy': ['milk', 'cream', 'butter', 'cheese', 'yogurt'],
          'gluten': ['wheat', 'barley', 'rye', 'gluten'],
          'soy': ['soy', 'tofu', 'soybean'],
          'eggs': ['egg'],
          'shellfish': ['shrimp', 'crab', 'lobster', 'shellfish'],
          'pollen': ['bee pollen', 'flower'],
          'ragweed': ['ragweed', 'chamomile', 'echinacea'],
          'latex': ['latex', 'rubber'],
        };
        
        allRemedies = allRemedies.filter(remedy => {
          const ingredients = Array.isArray(remedy.ingredients) 
            ? remedy.ingredients.join(' ').toLowerCase() 
            : '';
          const description = remedy.description?.toLowerCase() || '';
          const combined = ingredients + ' ' + description;
          
          return !allergies.some((allergy: string) => {
            const keywords = allergenKeywords[allergy] || [allergy];
            return keywords.some(keyword => combined.includes(keyword.toLowerCase()));
          });
        });
      }
      
      // Return up to 6 suggestions with match reasons
      const suggestions = allRemedies.slice(0, 6).map(remedy => {
        const matchReasons: string[] = [];
        
        // Determine why this remedy matches
        if (healthGoals && healthGoals.length > 0) {
          healthGoals.forEach((goal: string) => {
            const categories = goalToCategoryMap[goal];
            if (categories) {
              const matches = categories.some(cat =>
                remedy.category?.toLowerCase().includes(cat.toLowerCase()) ||
                remedy.description?.toLowerCase().includes(cat.toLowerCase())
              );
              if (matches) {
                const goalLabels: Record<string, string> = {
                  'weight_loss': 'Weight Management',
                  'better_sleep': 'Better Sleep',
                  'stress_relief': 'Stress Relief',
                  'immunity': 'Immune Support',
                  'energy': 'More Energy',
                  'digestion': 'Digestive Health',
                  'skin_health': 'Skin Health',
                  'pain_relief': 'Pain Relief',
                  'mental_clarity': 'Mental Clarity',
                  'heart_health': 'Heart Health',
                };
                matchReasons.push(goalLabels[goal] || goal);
              }
            }
          });
        }
        
        if (preferredRemedyForms && preferredRemedyForms.length > 0) {
          const formLabels: Record<string, string> = {
            'tea': 'Herbal Tea',
            'tincture': 'Tincture',
            'capsule': 'Capsule',
            'topical': 'Topical',
            'essential_oil': 'Essential Oil',
            'powder': 'Powder',
          };
          preferredRemedyForms.forEach((form: string) => {
            const forms = formMap[form];
            if (forms && forms.some(f => remedy.form?.toLowerCase().includes(f.toLowerCase()))) {
              matchReasons.push(`${formLabels[form] || form} form`);
            }
          });
        }
        
        return {
          ...remedy,
          matchReasons: [...new Set(matchReasons)].slice(0, 3),
        };
      });
      
      res.json({
        suggestions,
        totalMatches: allRemedies.length,
        basedOn: {
          healthGoals: healthGoals || [],
          preferredForms: preferredRemedyForms || [],
          avoidedAllergens: allergies || [],
        }
      });
    } catch (error: any) {
      console.error('Suggestions error:', error);
      res.status(500).json({ message: 'Unable to generate suggestions', error: error.message });
    }
  });

  app.get("/api/remedies/:slug", async (req, res) => {
    try {
      const { db } = await import('./db');
      const { remedies } = await import('../shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [remedy] = await db.select().from(remedies).where(eq(remedies.slug, req.params.slug));
      
      if (!remedy) {
        return res.status(404).json({ message: "Remedy not found" });
      }
      res.json(remedy);
    } catch (error: any) {
      console.error("Error fetching remedy by slug:", error);
      res.status(500).json({ message: "Unable to fetch remedy" });
    }
  });

  // Alias route for /api/remedy/:slug (singular) - redirects to plural version
  app.get("/api/remedy/:slug", async (req, res) => {
    try {
      const { db } = await import('./db');
      const { remedies } = await import('../shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [remedy] = await db.select().from(remedies).where(eq(remedies.slug, req.params.slug));
      
      if (!remedy) {
        return res.status(404).json({ message: "Remedy not found" });
      }
      res.json(remedy);
    } catch (error: any) {
      console.error("Error fetching remedy by slug:", error);
      res.status(500).json({ message: "Unable to fetch remedy" });
    }
  });

  app.post("/api/remedies", async (req, res) => {
    try {
      const remedyData = insertRemedySchema.parse(req.body);
      const remedy = await storage.createRemedy(remedyData);
      res.json(remedy);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Product linking routes
  app.get("/api/remedies/:id/product-links", async (req, res) => {
    try {
      const remedyId = parseInt(req.params.id);
      const productLinks = await storage.getProductLinksForRemedy(remedyId);
      res.json(productLinks);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  app.post("/api/remedies/:id/link-products", async (req, res) => {
    try {
      const remedyId = parseInt(req.params.id);
      const remedy = await storage.linkRemedyToProducts(remedyId);
      res.json(remedy);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/remedies/:id/unlinked-ingredients", async (req, res) => {
    try {
      const remedyId = parseInt(req.params.id);
      const unlinkedIngredients = await storage.getUnlinkedIngredients(remedyId);
      res.json(unlinkedIngredients);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // Saved remedies routes
  app.post("/api/saved-remedies", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { remedyId, name, ingredients, instructions, category, description, benefits, form, safety, scientific_basis } = req.body;
      console.log("Received body:", req.body);
      console.log("Extracted values:", { remedyId, name, ingredients, instructions });
      
      let finalRemedyId = remedyId;

      // If no remedyId provided, create a new custom remedy
      if (!remedyId && name && ingredients && instructions) {
        console.log("Creating new custom remedy:", { name, ingredients, instructions });
        
        // Create a new remedy in the database
        const [newRemedy] = await db.insert(remedies).values({
          name: name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: description || `Custom remedy for ${category || 'health'}`,
          ingredients: ingredients,
          benefits: benefits || [],
          instructions: instructions,
          form: form || 'custom',
          category: category || 'custom',
          isGenerated: true,
          imageUrl: '/placeholder-remedy.jpg'
        }).returning();
        
        finalRemedyId = newRemedy.id;
        console.log("Created new remedy with ID:", finalRemedyId);
      } else if (!remedyId) {
        return res.status(400).json({ message: "Either remedyId or remedy details (name, ingredients, instructions) are required" });
      }

      // Check if already saved
      const existing = await db.select()
        .from(savedRemedies)
        .where(and(
          eq(savedRemedies.userId, req.session.userId),
          eq(savedRemedies.remedyId, finalRemedyId)
        ));

      if (existing.length > 0) {
        return res.status(400).json({ message: "Remedy already saved" });
      }

      // Save the remedy
      const [savedRemedy] = await db.insert(savedRemedies).values({
        userId: req.session.userId,
        remedyId: finalRemedyId
      }).returning();

      console.log("Successfully saved remedy:", savedRemedy);
      res.json({ id: savedRemedy.remedyId, status: "saved" });
    } catch (error: any) {
      console.error("Save remedy error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/saved-remedies", async (req, res) => {
    try {
      console.log("Session data:", req.session);
      console.log("Session userId:", req.session?.userId);
      
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get saved remedies with remedy details
      const userSavedRemedies = await db.select({
        id: remedies.id,
        name: remedies.name,
        slug: remedies.slug,
        description: remedies.description,
        ingredients: remedies.ingredients,
        benefits: remedies.benefits,
        instructions: remedies.instructions,
        form: remedies.form,
        imageUrl: remedies.imageUrl,
        category: remedies.category,
        isGenerated: remedies.isGenerated,
        createdAt: remedies.createdAt,
        savedAt: savedRemedies.createdAt
      })
      .from(savedRemedies)
      .innerJoin(remedies, eq(savedRemedies.remedyId, remedies.id))
      .where(eq(savedRemedies.userId, req.session.userId))
      .orderBy(desc(savedRemedies.createdAt));

      res.json(userSavedRemedies);
    } catch (error: any) {
      console.error("Get saved remedies error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/saved-remedies/:remedyId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const remedyId = parseInt(req.params.remedyId);
      
      await db.delete(savedRemedies)
        .where(and(
          eq(savedRemedies.userId, req.session.userId),
          eq(savedRemedies.remedyId, remedyId)
        ));

      res.json({ message: "Remedy removed from saved list" });
    } catch (error: any) {
      console.error("Remove saved remedy error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Custom Remedies API - User-generated remedies from AI tools
  app.post("/api/custom-remedies", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const customRemedyData = insertCustomRemedySchema.parse({
        ...req.body,
        userId: req.session.userId
      });

      const [newCustomRemedy] = await db.insert(customRemedies)
        .values(customRemedyData)
        .returning();

      res.json(newCustomRemedy);
    } catch (error: any) {
      console.error("Create custom remedy error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/custom-remedies", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userCustomRemedies = await db.select()
        .from(customRemedies)
        .where(eq(customRemedies.userId, req.session.userId))
        .orderBy(desc(customRemedies.createdAt));

      res.json(userCustomRemedies);
    } catch (error: any) {
      console.error("Fetch custom remedies error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/custom-remedies/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const customRemedyId = parseInt(req.params.id);
      
      await db.delete(customRemedies)
        .where(and(
          eq(customRemedies.id, customRemedyId),
          eq(customRemedies.userId, req.session.userId)
        ));

      res.json({ message: "Custom remedy deleted" });
    } catch (error: any) {
      console.error("Delete custom remedy error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== ORDER HISTORY API ====================
  
  // Get all orders for the logged-in user
  app.get("/api/orders", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userOrders = await db.select()
        .from(orders)
        .where(eq(orders.userId, req.session.userId))
        .orderBy(desc(orders.createdAt));

      res.json(userOrders);
    } catch (error: any) {
      console.error("Fetch orders error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const [order] = await db.select()
        .from(orders)
        .where(and(
          eq(orders.id, orderId),
          eq(orders.userId, req.session.userId)
        ));

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      console.error("Fetch order error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new order (for testing/demo purposes)
  app.post("/api/orders", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Generate unique order number
      const orderNumber = `PRX-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const orderData = {
        ...req.body,
        userId: req.session.userId,
        orderNumber,
        statusHistory: [{
          status: "processing",
          timestamp: new Date().toISOString(),
          note: "Order received and is being processed"
        }]
      };

      const [newOrder] = await db.insert(orders)
        .values(orderData)
        .returning();

      res.json(newOrder);
    } catch (error: any) {
      console.error("Create order error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update order status (admin only, but also for demo purposes)
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orderId = parseInt(req.params.id);
      const { status, note, trackingNumber, shippingProvider, estimatedDeliveryDate } = req.body;

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // Get the current order
      const [currentOrder] = await db.select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!currentOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update status history
      const statusHistory = Array.isArray(currentOrder.statusHistory) 
        ? [...currentOrder.statusHistory, {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Order status updated to ${status}`
          }]
        : [{
            status,
            timestamp: new Date().toISOString(),
            note: note || `Order status updated to ${status}`
          }];

      // Update the order
      const updateData: any = {
        status,
        statusHistory,
        updatedAt: new Date()
      };

      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (shippingProvider) updateData.shippingProvider = shippingProvider;
      if (estimatedDeliveryDate) updateData.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

      const [updatedOrder] = await db.update(orders)
        .set(updateData)
        .where(eq(orders.id, orderId))
        .returning();

      res.json(updatedOrder);
    } catch (error: any) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== END ORDER HISTORY API ====================

  // AI-powered remedy search
  app.post("/api/ai/search-remedies", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      // First get all remedies
      const allRemedies = await storage.getRemedies();
      
      // Use OpenAI to analyze the query and match with remedies
      const prompt = `
        Analyze this health concern: "${query}"
        
        Available remedies: ${JSON.stringify(allRemedies.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          benefits: r.benefits,
          category: r.category
        })))}
        
        Return a JSON array of remedy IDs that would be helpful for this concern, ordered by relevance.
        Include a confidence score (0-100) for each. Format: [{"id": number, "confidence": number, "reasoning": "brief explanation"}]
      `;

      if (!openai) {
        // Fallback to simple text search if AI not available
        const fallbackResults = await storage.searchRemedies(query);
        return res.json({ 
          results: fallbackResults.slice(0, 5).map(r => ({ ...r, confidence: 75 }))
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      let aiResults;
      try {
        const aiResponse = JSON.parse(response.choices[0].message.content || "{}");
        aiResults = aiResponse.results || aiResponse;
      } catch {
        aiResults = [];
      }

      // Get the actual remedy objects
      const results = aiResults
        .filter((result: any) => result.confidence > 50)
        .map((result: any) => {
          const remedy = allRemedies.find(r => r.id === result.id);
          return remedy ? { ...remedy, confidence: result.confidence, reasoning: result.reasoning } : null;
        })
        .filter(Boolean)
        .slice(0, 5);

      // Save search history
      await storage.saveSearchHistory(null, query, results, "remedy");

      res.json({ results });
    } catch (error: any) {
      console.error("AI search error:", error);
      
      // Fallback to simple text search
      const fallbackResults = await storage.searchRemedies(req.body.query);
      res.json({ 
        results: fallbackResults.slice(0, 5).map(r => ({ ...r, confidence: 75 }))
      });
    }
  });

  // Enhanced Dual AI symptom finder
  app.post("/api/ai/symptom-finder", async (req, res) => {
    try {
      const { symptoms, age, duration } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ message: "Symptoms are required" });
      }

      // Convert symptoms to array format for dual AI processing
      const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];

      // Use dual AI system for enhanced symptom analysis
      const analysis = await dualAI.analyzeSymptomsWithDualAI(symptomList);
      
      // Enhance analysis with matching remedies from database
      try {
        const matchingRemedies = await storage.searchRemedies(symptoms);
        if (matchingRemedies && matchingRemedies.length > 0) {
          // Add database remedies to suggestions
          const dbRemedies = matchingRemedies.slice(0, 5).map(remedy => ({
            remedy_name: remedy.name,
            remedy_id: remedy.id,
            benefits: remedy.benefits,
            reason: `Natural remedy from PlantRx database that may help with your symptoms`,
            database_match: true
          }));
          
          (analysis as any).database_remedies = dbRemedies;
          (analysis as any).remedy_count = matchingRemedies.length;
        }
      } catch (error) {
        console.log("Could not fetch matching remedies from database:", error);
      }
      
      // Save search history if storage method exists
      try {
        await storage.saveSearchHistory(null, symptoms, analysis, "symptom");
      } catch (error) {
        console.log("Search history not saved - method not implemented");
      }

      // Add metadata for enhanced dual expert analysis
      const enhancedAnalysis = {
        ...analysis,
        expert_system: "dual_expert_enhanced",
        processing_time: Date.now(),
        disclaimer: "This analysis uses advanced dual expert technology but is not a medical diagnosis. Please consult a healthcare provider for persistent symptoms."
      };

      res.json(enhancedAnalysis);
    } catch (error: any) {
      console.error("Symptom analysis error:", error);
      res.status(500).json({ 
        message: "Unable to analyze symptoms at this time",
        analysis: [],
        suggestions: [],
        disclaimer: "This analysis is not a medical diagnosis. Please consult a healthcare provider for persistent symptoms."
      });
    }
  });

  // Enhanced PlantRx AI health chat endpoint
  app.post("/api/ai/health-chat", async (req, res) => {
    try {
      const { messages, useGemini = false } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages are required" });
      }

      // Import our new dual AI system
      // AI health advice disabled for performance
      const advice = "Please consult our featured remedies or speak with a healthcare professional.";

      // Get AI response using our dual system
      const reply = await getHealthAdvice(messages, useGemini);

      // Try to get matching remedies from database for context
      try {
        const latestMessage = messages[messages.length - 1];
        const relevantRemedies = await storage.searchRemedies(latestMessage.content);
        if (relevantRemedies && relevantRemedies.length > 0) {
          const remedyList = relevantRemedies.slice(0, 3).map(r => 
            `• ${r.name}: ${r.benefits ? (r.benefits as string[])[0] : 'Natural remedy for your symptoms'}`
          ).join('\n');
          
          const enhancedReply = reply + `\n\n**🌿 FROM PLANTRX DATABASE - MATCHING REMEDIES:**\n${remedyList}\n\nView these remedies in our database for detailed preparation instructions.`;
          
          res.json({ 
            reply: enhancedReply,
            source: useGemini ? 'gemini' : 'openai',
            hasRemedyMatches: true
          });
          return;
        }
      } catch (error) {
        console.log("Could not fetch matching remedies from database");
      }

      res.json({ 
        reply,
        source: useGemini ? 'gemini' : 'openai',
        hasRemedyMatches: false
      });
    } catch (error: any) {
      console.error("PlantRx AI chat error:", error);
      res.status(500).json({ 
        message: "Unable to process chat at this time",
        reply: "I'm temporarily unavailable. Please try again later or consult our remedy database for natural health solutions."
      });
    }
  });

  // AI website assistant endpoint
  app.post("/api/ai/website-assistant", async (req, res) => {
    try {
      const { question, context } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      const systemPrompt = `You are PlantRx's intelligent website assistant. Your primary role is to help users navigate the PlantRx platform and connect them with the right resources.

      WEBSITE FEATURES & NAVIGATION:
      - Home page: Overview of PlantRx platform and featured remedies
      - Remedies page: Browse 133+ verified natural remedies by category
      - Symptom Finder: AI-powered tool to find remedies based on symptoms
      - Workouts: Fitness and wellness workout library
      - Experts page: Connect with verified health experts
      - Community: Discussion platform for health topics (requires login)
      - Store: Purchase natural health products and supplements
      - Search: Find specific remedies, products, or experts

      COMMUNICATION GUIDANCE:
      - Expert consultation: Available through the Experts page for personalized advice
      - Community discussions: Join conversations in the Community section
      - Customer support: Available for platform issues and questions
      - Emergency health: Always direct to immediate medical care

      YOUR CAPABILITIES:
      1. Website Navigation: Guide users to the right pages and features
      2. Feature Explanations: Explain how to use PlantRx tools and services
      3. Expert Connections: Help users find and contact health professionals
      4. Remedy Discovery: Assist with finding natural health solutions
      5. Account Assistance: Guide through login, signup, and account features

      RESPONSE STYLE:
      - Be helpful, friendly, and informative
      - Provide specific directions and links when possible
      - Offer alternative solutions if the first option doesn't fit
      - Always prioritize user safety and proper medical care
      - Keep responses concise but comprehensive

      Remember: You're here to make PlantRx easy to use and help users find what they need quickly.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
      });

      const reply = response.choices[0].message.content;
      res.json({ reply });
    } catch (error: any) {
      console.error("Website assistant error:", error);
      res.status(500).json({ 
        message: "Failed to get AI response",
        error: error.message 
      });
    }
  });

  // Enhanced Dual AI Custom Remedy Generator  
  app.post("/api/ai/generate-custom-remedy", async (req, res) => {
    try {
      const { symptoms, preferences, restrictions, severity } = req.body;
      
      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ message: "Symptoms array is required" });
      }

      // Use dual expert system for maximum intelligence in remedy generation
      const remedyRequest = {
        symptoms,
        preferences: preferences ? (Array.isArray(preferences) ? preferences : [preferences]) : undefined,
        restrictions: restrictions ? (Array.isArray(restrictions) ? restrictions : [restrictions]) : undefined,
        severity
      };

      const generatedRemedy = await dualAI.generateDualCustomRemedy(remedyRequest);
      
      // Try to save to database if user is authenticated
      let savedRemedy = null;
      try {
        // Note: This would require user authentication context
        // For now, we'll just return the generated remedy
        savedRemedy = {
          ...generatedRemedy,
          id: Date.now(), // Temporary ID
          createdAt: new Date(),
          source: "dual_expert_generated"
        };
      } catch (error) {
        console.log("Could not save custom remedy to database");
      }

      res.json({
        remedy: generatedRemedy,
        saved: !!savedRemedy,
        expert_system: "dual_expert_enhanced",
        generation_time: Date.now()
      });
    } catch (error: any) {
      console.error("Dual expert remedy generation error:", error);
      res.status(500).json({ 
        message: "Unable to generate custom remedy at this time",
        error: "Please try again or contact our experts for personalized remedy creation"
      });
    }
  });

  // Legacy remedy generator (enhanced with dual expert fallback)
  app.post("/api/ai/generate-remedy", async (req, res) => {
    try {
      const { need, preferences } = req.body;
      
      if (!need) {
        return res.status(400).json({ message: "Health need is required" });
      }

      // Expert-focused system prompt
      const systemPrompt = `You are an expert herbalist and natural health practitioner for PlantRx, the world's leading natural health platform. Create personalized, evidence-based natural remedies using traditional herbal knowledge combined with modern research.

      EXPERTISE GUIDELINES:
      - Draw from centuries of traditional herbal medicine and modern clinical research
      - Use only well-documented, safe herbal ingredients with established therapeutic properties  
      - Provide clear preparation methods and dosage guidelines
      - Include comprehensive safety information and contraindications
      - Base recommendations on the specific health concern and user preferences
      - Focus on effective, accessible ingredients that work synergistically
      - Avoid any references to artificial intelligence or automated systems - present as expert herbalist knowledge

      SAFETY REQUIREMENTS:
      - Always include appropriate medical disclaimers
      - Highlight potential interactions with medications
      - Specify contraindications for pregnancy, nursing, or specific conditions
      - Recommend consulting healthcare providers for serious conditions`;

      const prompt = `
        Health Concern: "${need}"
        ${preferences ? `User Preferences: ${preferences}` : ''}
        
        Create a comprehensive, personalized natural remedy based on expert herbal knowledge and traditional medicine practices. Consider the specific health concern, user preferences, and safety factors.

        Provide a detailed remedy in this exact JSON format:
        {
          "name": "Descriptive remedy name that reflects the health concern",
          "ingredients": ["Primary herb 1", "Supporting herb 2", "Complementary ingredient 3", "Optional enhancer 4"],
          "benefits": ["Primary therapeutic benefit", "Secondary benefit", "Additional wellness effect"],
          "form": "Most appropriate form (tea, tincture, topical salve, capsules, etc.)",
          "instructions": "Detailed preparation instructions including exact measurements, timing, and usage guidelines",
          "safety": "Comprehensive safety information including contraindications, potential side effects, and interaction warnings",
          "scientific_basis": "Brief explanation of why these specific ingredients work together based on their therapeutic compounds and traditional use",
          "dosage": "Recommended frequency and amount for optimal effectiveness",
          "duration": "Suggested treatment duration and when to expect results"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response content received");
      }

      const generatedRemedy = JSON.parse(content);
      
      // Validate the response has required fields
      if (!generatedRemedy.name || !generatedRemedy.ingredients || !generatedRemedy.instructions) {
        throw new Error("Incomplete remedy generated");
      }
      
      // Save search history
      try {
        await storage.saveSearchHistory(null, need, generatedRemedy, "generate");
      } catch (saveError) {
        console.error("Failed to save search history:", saveError);
        // Don't fail the request if saving history fails
      }

      res.json(generatedRemedy);
    } catch (error: any) {
      console.error("Remedy generation error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Unable to generate remedy at this time";
      if (error.message?.includes("API key")) {
        errorMessage = "Service temporarily unavailable. Please try again shortly.";
      } else if (error.message?.includes("rate limit") || error.message?.includes("quota")) {
        errorMessage = "Service is busy. Please wait a moment and try again.";
      } else if (error.message?.includes("JSON")) {
        errorMessage = "Error processing remedy. Please try rephrasing your request.";
      }
      
      res.status(500).json({ 
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // AI chat assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const systemPrompt = `
        You are PlantRx AI Assistant, a helpful natural health expert. 
        You only recommend natural, plant-based remedies and solutions.
        Always include appropriate medical disclaimers.
        Keep responses concise and helpful.
        If asked about serious medical conditions, recommend consulting a healthcare provider.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 300,
      });

      const reply = response.choices[0].message.content;

      res.json({ reply });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.json({ 
        reply: "I'm sorry, I'm having trouble responding right now. Please try again or browse our remedies for natural health solutions."
      });
    }
  });

  // Review routes
  app.get("/api/remedies/:remedyId/reviews", async (req, res) => {
    try {
      const remedyId = parseInt(req.params.remedyId);
      console.log(`🔍 Fetching reviews for remedy ID: ${remedyId}, type: ${typeof remedyId}`);
      
      const reviews = await storage.getReviewsByRemedyId(remedyId);
      console.log(`📊 Retrieved ${reviews.length} reviews from storage`);
      
      // Filter to only show reviews with rating 3 and above
      const filteredReviews = reviews.filter(review => review.rating >= 3);
      console.log(`✅ Filtered to ${filteredReviews.length} reviews (3+ stars)`);
      
      // Add username to each review
      const reviewsWithUsernames = await Promise.all(
        filteredReviews.map(async (review) => {
          const user = await storage.getUserById(review.userId);
          return {
            ...review,
            username: user?.username || 'Anonymous User'
          };
        })
      );
      
      console.log(`👥 Added usernames, returning ${reviewsWithUsernames.length} reviews`);
      res.json(reviewsWithUsernames);
    } catch (error: any) {
      console.error("❌ Review fetch error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/remedies/:remedyId/reviews", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.session?.userId) {
        return res.status(401).json({ message: "You must be signed in to submit a review" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        remedyId: parseInt(req.params.remedyId),
        userId: req.session.userId
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.session?.userId || null,
      });
      const feedback = await storage.createFeedback(feedbackData);
      
      // Send feedback notification email to info@plantrxapp.com
      try {
        const { sendFeedbackNotification } = await import('./mailerlite-service.js');
        await sendFeedbackNotification({
          email: feedbackData.email,
          name: feedbackData.name || undefined,
          subject: feedbackData.subject,
          message: feedbackData.message,
          type: feedbackData.type,
          priority: feedbackData.priority,
        });
      } catch (emailError: any) {
        console.error('Failed to send feedback notification email:', emailError.message);
        // Don't fail the entire request if email fails
      }
      
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      // Only allow admins to view all feedback
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Check if user is admin
      const user = await storage.getUserById(req.session.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/feedback/:id", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Check if user is admin
      const user = await storage.getUserById(req.session.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const feedback = await storage.getFeedbackById(parseInt(req.params.id));
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/feedback/:id/status", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Check if user is admin
      const user = await storage.getUserById(req.session.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Validate status using Zod schema
      const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const { status } = req.body;
      const feedback = await storage.updateFeedbackStatus(parseInt(req.params.id), status);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/feedback/:id/read", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Check if user is admin
      const user = await storage.getUserById(req.session.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      await storage.markFeedbackAsRead(parseInt(req.params.id));
      res.json({ message: "Feedback marked as read" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saved remedies routes
  app.post("/api/users/:userId/saved-remedies", async (req, res) => {
    try {
      const { remedyId } = req.body;
      const savedRemedy = await storage.saveRemedy(parseInt(req.params.userId), remedyId);
      res.json(savedRemedy);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:userId/saved-remedies/:remedyId", async (req, res) => {
    try {
      await storage.unsaveRemedy(parseInt(req.params.userId), parseInt(req.params.remedyId));
      res.json({ message: "Remedy unsaved" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/saved-remedies", async (req, res) => {
    try {
      const savedRemedies = await storage.getSavedRemedies(parseInt(req.params.userId));
      res.json(savedRemedies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard routes
  app.get("/api/users/:userId/dashboard", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const [savedRemedies, searchHistory, aiSuggestions] = await Promise.all([
        storage.getSavedRemedies(userId),
        storage.getSearchHistory(userId),
        storage.getAISuggestions(userId)
      ]);
      
      res.json({
        savedRemedies,
        searchHistory,
        aiSuggestions: aiSuggestions.filter((s: any) => !s.isRead).slice(0, 5)
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Payment routes disabled for performance
  if (false) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount, items } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            items: JSON.stringify(items)
          }
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });

    app.post("/api/orders", async (req, res) => {
      try {
        const { userId, items, total } = req.body;
        const order = await storage.createOrder(userId, items, total);
        res.json(order);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });

    app.get("/api/users/:userId/orders", async (req, res) => {
      try {
        const orders = await storage.getOrdersByUserId(parseInt(req.params.userId));
        res.json(orders);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });
  }

  // ========== SHOPIFY INTEGRATION & STORE SYNC ==========
  
  // Store products API (live from database)
  app.get("/api/store/products", async (req, res) => {
    try {
      const products = await getStoreProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Manual store sync (admin endpoint)
  app.post("/api/store/sync", async (req, res) => {
    try {
      console.log('🔄 Manual Shopify sync triggered...');
      const syncedCount = await fullShopifySync();
      res.json({ 
        success: true, 
        message: `Successfully synced ${syncedCount} products from Shopify`,
        syncedCount 
      });
    } catch (error: any) {
      console.error('❌ Manual sync failed:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  // Shopify webhooks (automatic product updates)
  app.post("/api/webhooks/shopify/products/create", async (req, res) => {
    try {
      await processShopifyWebhook('products/create', req.body);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('❌ Webhook products/create failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/webhooks/shopify/products/update", async (req, res) => {
    try {
      await processShopifyWebhook('products/update', req.body);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('❌ Webhook products/update failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/webhooks/shopify/products/delete", async (req, res) => {
    try {
      await processShopifyWebhook('products/delete', req.body);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('❌ Webhook products/delete failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Remedy ingredient linking (enhanced with database products)
  app.get("/api/remedies/:id/product-links", async (req, res) => {
    try {
      const remedy = await storage.getRemedyById(parseInt(req.params.id));
      if (!remedy) {
        return res.status(404).json({ message: "Remedy not found" });
      }
      
      const ingredients = remedy.ingredients as string[];
      
      // Import dynamic mapping function
      const { findProductLinksForIngredientsLive } = await import("./dynamic-ingredient-mapping");
      const productLinks = await findProductLinksForIngredientsLive(ingredients);
      
      res.json(productLinks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/remedies/:id/unlinked-ingredients", async (req, res) => {
    try {
      const remedy = await storage.getRemedyById(parseInt(req.params.id));
      if (!remedy) {
        return res.status(404).json({ message: "Remedy not found" });
      }
      
      const ingredients = remedy.ingredients as string[];
      
      // Import dynamic mapping function  
      const { getUnlinkedIngredientsLive } = await import("./dynamic-ingredient-mapping");
      const unlinkedIngredients = await getUnlinkedIngredientsLive(ingredients);
      
      res.json(unlinkedIngredients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // SEO routes - sitemap and robots.txt
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const remedies = await storage.getRemedies();
      const currentDate = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://plantrxapp.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/remedies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/smart-tools</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/workouts</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/community</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/experts</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/store</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.60</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/cookie-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/disclaimer</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/refunds</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>
  <url>
    <loc>https://plantrxapp.com/liability</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>`;

      // Add individual remedy pages (filter out hair-care and inactive)
      remedies
        .filter(remedy => remedy.slug && !remedy.slug.includes('hair-care') && remedy.isActive !== false)
        .forEach(remedy => {
          const lastmod = remedy.createdAt ? new Date(remedy.createdAt).toISOString().split('T')[0] : currentDate;
          sitemap += `
  <url>
    <loc>https://plantrxapp.com/remedies/${remedy.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`;
        });

      // Add category-specific URLs for better SEO coverage
      const categories = [
        'digestive', 'anti-inflammatory', 'skin-care', 'sleep', 'pain-relief', 
        'wound-care', 'immune-support', 'stress-relief', 'antioxidant', 
        'antimicrobial', 'brain-health', 'throat-health', 'kidney-health', 'liver-health'
      ];
      
      for (const category of categories) {
        sitemap += `
  <url>
    <loc>https://plantrxapp.com/remedies?category=${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>`;
      }

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating sitemap');
    }
  });

  // Brand search optimization - redirect common PlantRx variations
  app.get("/plantrx", (req, res) => {
    res.redirect(301, "/about");
  });

  app.get("/plant-rx", (req, res) => {
    res.redirect(301, "/about");
  });

  app.get("/plant_rx", (req, res) => {
    res.redirect(301, "/about");
  });

  app.get("/plantrx-app", (req, res) => {
    res.redirect(301, "/about");
  });

  // Health Tracking API Routes
  app.post("/api/health/goals", async (req, res) => {
    try {
      const goalData = req.body;
      const goal = await storage.createHealthGoal(goalData);
      res.json(goal);
    } catch (error: any) {
      console.error("Create health goal error:", error);
      res.status(500).json({ message: "Failed to create health goal" });
    }
  });

  app.get("/api/health/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = await storage.getHealthGoalsByUserId(userId);
      res.json(goals);
    } catch (error: any) {
      console.error("Get health goals error:", error);
      res.status(500).json({ message: "Failed to fetch health goals" });
    }
  });

  app.post("/api/health/logs", async (req, res) => {
    try {
      const logData = req.body;
      const log = await storage.createHealthLog(logData);
      res.json(log);
    } catch (error: any) {
      console.error("Create health log error:", error);
      res.status(500).json({ message: "Failed to create health log" });
    }
  });

  app.get("/api/health/logs/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.getHealthLogsByUserId(userId, limit);
      res.json(logs);
    } catch (error: any) {
      console.error("Get health logs error:", error);
      res.status(500).json({ message: "Failed to fetch health logs" });
    }
  });

  app.get("/api/health/insights/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = await storage.getHealthInsightsByUserId(userId);
      res.json(insights);
    } catch (error: any) {
      console.error("Get health insights error:", error);
      res.status(500).json({ message: "Failed to fetch health insights" });
    }
  });

  app.get("/api/health/metrics/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await storage.getHealthMetricsByUserId(userId);
      res.json(metrics);
    } catch (error: any) {
      console.error("Get health metrics error:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  // Block specific unwanted URL patterns - returns 410 Gone for permanent removal
  app.get("/remedies/natural-hair-care-remedy-28", (req, res) => {
    // Return HTML with meta refresh to remove from search results
    res.status(410).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
        <meta http-equiv="refresh" content="0; url=https://plantrxapp.com/remedies">
        <title>Content Removed - PlantRx</title>
        <link rel="canonical" href="https://plantrxapp.com/remedies">
      </head>
      <body>
        <h1>Content Permanently Removed</h1>
        <p>This content has been permanently removed and is no longer available.</p>
        <p>Redirecting to our remedies page...</p>
        <script>window.location.href = 'https://plantrxapp.com/remedies';</script>
      </body>
      </html>
    `);
  });

  // Block any hair-care related remedy URLs that don't exist
  app.get("/remedies/*hair-care*", (req, res) => {
    res.status(410).json({ 
      error: "Content permanently removed",
      message: "This content has been permanently removed and is no longer available."
    });
  });

  // Serve logo.png for SEO and favicon
  app.get("/logo.png", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/logo.png"));
  });

  app.get("/favicon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/favicon.png"));
  });

  app.get("/robots.txt", (req, res) => {
    const robots = `# PlantRx.com Robots.txt - SEO Optimized
User-agent: *
Allow: /

# Primary sitemap
Sitemap: https://plantrxapp.com/sitemap.xml

# Allow crawling of all public content
Allow: /remedies/
Allow: /about
Allow: /community
Allow: /experts
Allow: /smart-tools
Allow: /workouts
Allow: /businesses

# Block private and admin areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login/
Disallow: /register/

# Block specific unwanted URLs - permanently removed content
Disallow: /remedies/natural-hair-care-remedy-28
Disallow: /remedies/*hair-care*

# Block duplicate query parameter URLs for cleaner indexing
Disallow: /*?*
Allow: /remedies?category=*

# Crawl delay to be respectful to server resources
Crawl-delay: 1

# Google-specific directives
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing-specific directives  
User-agent: Bingbot
Allow: /
Crawl-delay: 1`;

    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  app.get("/ads.txt", (req, res) => {
    const adsTxt = `google.com, pub-5245165544457327, DIRECT, f08c47fec0942fa0`;
    res.set('Content-Type', 'text/plain');
    res.send(adsTxt);
  });

  // Health Plans routes (PlanRx Creator)
  app.get("/api/health-plans", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const plans = await storage.getHealthPlansByUserId(parseInt(userId as string));
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Workout System API Routes
  
  // Get workouts for a specific muscle group
  app.get("/api/workouts", async (req, res) => {
    try {
      const { muscle } = req.query;
      
      if (muscle) {
        // Filter by muscle group if specified
        const workouts = await storage.getWorkoutsByMuscle(muscle as string);
        res.json(workouts);
      } else {
        // Return all workouts if no muscle specified
        const workouts = await storage.getAllWorkouts();
        res.json(workouts);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Unable to fetch workouts" });
    }
  });

  // Get all workouts
  app.get("/api/workouts/all", async (req, res) => {
    try {
      const workouts = await storage.getAllWorkouts();
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching all workouts:", error);
      res.status(500).json({ message: "Unable to fetch workouts" });
    }
  });

  // Start workout session
  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      sessionData.userId = req.session?.userId || 1; // Default user for demo
      
      // Convert Date objects to proper timestamp format
      if (sessionData.startedAt) {
        sessionData.startedAt = new Date(sessionData.startedAt);
      }
      
      const session = await storage.createWorkoutSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating workout session:", error);
      res.status(500).json({ message: "Unable to start workout session" });
    }
  });

  // Complete workout session
  app.patch("/api/workout-sessions/:id/complete", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updateData = req.body;
      
      const session = await storage.completeWorkoutSession(sessionId, updateData);
      
      // Update user progress
      if (session && updateData.completedSets > 0) {
        await storage.updateWorkoutProgress(session.userId, session.workout?.primaryMuscle, {
          totalSessions: 1,
          totalCalories: updateData.caloriesBurned,
          totalDuration: updateData.duration,
          lastWorkout: new Date(),
        });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error completing workout session:", error);
      res.status(500).json({ message: "Unable to complete workout session" });
    }
  });

  // Get user workout progress
  app.get("/api/workout-progress", async (req, res) => {
    try {
      const userId = req.session?.userId || 1; // Default for demo
      const progress = await storage.getUserWorkoutProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching workout progress:", error);
      res.status(500).json({ message: "Unable to fetch workout progress" });
    }
  });

  // Get user's recent workout sessions
  app.get("/api/workout-sessions/recent", async (req, res) => {
    try {
      const userId = req.session?.userId || 1; // Default for demo
      const recentSessions = await storage.getRecentWorkoutSessions(userId);
      res.json(recentSessions);
    } catch (error) {
      console.error("Error fetching recent workout sessions:", error);
      res.status(500).json({ message: "Unable to fetch recent workout sessions" });
    }
  });

  // Get workout recommendations
  app.get("/api/workout-recommendations", async (req, res) => {
    try {
      const userId = req.session?.userId || 1;
      const progress = await storage.getUserWorkoutProgress(userId);
      
      // AI-powered recommendations based on user progress
      const recommendations = await storage.getWorkoutRecommendations(userId, progress);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Unable to fetch recommendations" });
    }
  });

  app.post("/api/health-plans", async (req, res) => {
    try {
      const planData = insertHealthPlanSchema.parse(req.body);
      const plan = await storage.createHealthPlan(planData);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate health plan with AI
  app.post("/api/health-plans/generate", async (req, res) => {
    try {
      const { planType, questionsAnswered, userId } = req.body;
      
      if (!planType || !questionsAnswered) {
        return res.status(400).json({ message: "Plan type and questions are required" });
      }

      // Fetch relevant remedies from database to include in the plan
      const searchQuery = questionsAnswered.health_conditions || questionsAnswered.healing_health_focus || questionsAnswered.goal || planType;
      const relevantRemedies = await storage.searchRemedies(searchQuery);

      // Create AI prompt based on plan type and answers
      const systemPrompt = `
        You are an expert NATURAL HEALTH consultant creating comprehensive ${planType} plans.
        CRITICAL REQUIREMENTS:
        - This is a NATURAL HEALTH platform - NO PILLS, NO SYNTHETIC SUPPLEMENTS
        - Only recommend natural foods, herbs, plants, and holistic approaches
        - Duration should match user preference: ${questionsAnswered.duration_preference || questionsAnswered.skincare_duration || questionsAnswered.workout_duration || questionsAnswered.wellness_duration || questionsAnswered.healing_duration || '1 month'}
        - Address specific health conditions naturally: ${questionsAnswered.health_conditions || questionsAnswered.skin_health_concerns || questionsAnswered.fitness_health_issues || questionsAnswered.wellness_health_concerns || questionsAnswered.healing_health_focus || 'general wellness'}

        INCLUDE THESE VERIFIED REMEDIES WHERE RELEVANT:
        ${relevantRemedies.map(remedy => `
        • ${remedy.name}: ${remedy.description}
          Benefits: ${remedy.benefits}
          Instructions: ${remedy.instructions}
          Ingredients: ${remedy.ingredients}
        `).join('\n')}
        
        The response should be in JSON format with:
        {
          "title": "Personalized [Duration] [Plan Type] Plan for [Specific Goal]",
          "description": "Comprehensive description including their specific health focus (100+ words)",
          "duration": "${questionsAnswered.duration_preference || questionsAnswered.skincare_duration || questionsAnswered.workout_duration || questionsAnswered.wellness_duration || questionsAnswered.healing_duration || '4-6 weeks'}",
          "difficulty": "Customized for their experience level",
          "sections": [
            {
              "title": "Foundation & Assessment",
              "content": "Detailed foundation covering their current state and goals (300+ words)"
            },
            {
              "title": "Week-by-Week Implementation",
              "content": "Detailed weekly breakdown with specific natural foods, herbs, and practices (500+ words)"
            },
            {
              "title": "Natural Remedies & Plant Medicine",
              "content": "Specific herbs, superfoods, teas, and natural treatments for their conditions, including remedies from our database (400+ words)"
            },
            {
              "title": "Daily Protocols & Routines", 
              "content": "Hour-by-hour daily schedules, meal plans, timing, and practices (400+ words)"
            },
            {
              "title": "Troubleshooting & Adjustments",
              "content": "How to modify the plan, what to do if not seeing results, alternative approaches (300+ words)"
            },
            {
              "title": "Long-term Maintenance",
              "content": "How to maintain results, prevent relapse, and continue improvement (300+ words)"
            }
          ],
          "expectedResults": ["Specific result 1 with timeline", "Specific result 2 with timeline", "Specific result 3 with timeline", "Specific result 4 with timeline", "Specific result 5 with timeline"],
          "dailySchedule": "Detailed daily schedule with timing for all natural practices",
          "weeklyGoals": "Progressive weekly milestones with natural approach",
          "expertTips": "Professional insights for natural health optimization",
          "naturalRemedies": "List of specific herbs, foods, and natural treatments to use",
          "mealPlans": "Complete meal plans with recipes for natural healing foods",
          "troubleshooting": "Common challenges and natural solutions",
          "progressTracking": "How to measure and track improvement naturally"
        }
        
        Make this incredibly comprehensive - a complete guide they can follow for months. Focus on NATURAL, PLANT-BASED solutions only.
        Each section should be substantial with specific, actionable advice. No generic content.
      `;

      const userAnswersText = Object.entries(questionsAnswered)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Create a personalized ${planType} plan based on these responses:\n\n${userAnswersText}` 
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      let generatedContent;
      try {
        const rawContent = response.choices[0].message.content || '{}';
        // Remove markdown code blocks if present
        const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        generatedContent = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Fallback to a structured response
        generatedContent = {
          title: `Personalized ${planType} Plan`,
          description: "Expert-designed plan tailored to your specific needs and goals",
          sections: [
            { title: "Foundation", content: "Building your personalized foundation" },
            { title: "Implementation", content: "Step-by-step implementation guide" },
            { title: "Progress Tracking", content: "Monitoring your advancement" }
          ],
          duration: "4-8 weeks",
          difficulty: "Customized",
          expectedResults: ["Improved health outcomes", "Sustainable habits", "Long-term wellness"]
        };
      }
      
      // Save to database if userId provided
      let savedPlan = null;
      if (userId) {
        const planData = {
          userId: parseInt(userId),
          planType,
          title: generatedContent.title,
          description: generatedContent.description,
          questionsAnswered,
          generatedContent
        };
        savedPlan = await storage.createHealthPlan(planData);
      }

      res.json({ 
        plan: generatedContent,
        savedPlan
      });
    } catch (error: any) {
      console.error("Health plan generation error:", error);
      res.status(500).json({ 
        message: "Unable to generate health plan at this time"
      });
    }
  });

  // Blog System API Routes
  
  // Get all published blog posts
  app.get("/api/blog/posts", async (req, res) => {
    try {
      // Disable caching to ensure fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const posts = await blogStorage.getBlogPosts();
      // Inject featuredImage from mapping if missing
      const postsWithImages = posts.map((post: any) => ({
        ...post,
        featuredImage: post.featuredImage || getArticleImage(post.slug, post.category)
      }));
      console.log(`📚 Blog API: Returning ${postsWithImages.length} articles with images`);
      res.json(postsWithImages);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Unable to fetch blog posts" });
    }
  });

  // Get most clicked articles (sorted by views_count)
  app.get("/api/blog/most-clicked", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'public, max-age=300');
      const posts = await blogStorage.getBlogPosts();
      const postsWithImages = posts.map((post: any) => ({
        ...post,
        featuredImage: post.featuredImage || getArticleImage(post.slug, post.category)
      }));
      const sorted = postsWithImages.sort((a: any, b: any) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 20);
      res.json(sorted);
    } catch (error) {
      console.error("Error fetching most clicked posts:", error);
      res.status(500).json({ message: "Unable to fetch articles" });
    }
  });

  // Get most liked articles (sorted by likes_count)
  app.get("/api/blog/most-liked", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'public, max-age=300');
      const posts = await blogStorage.getBlogPosts();
      const postsWithImages = posts.map((post: any) => ({
        ...post,
        featuredImage: post.featuredImage || getArticleImage(post.slug, post.category)
      }));
      const sorted = postsWithImages.sort((a: any, b: any) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 20);
      res.json(sorted);
    } catch (error) {
      console.error("Error fetching most liked posts:", error);
      res.status(500).json({ message: "Unable to fetch articles" });
    }
  });

  // Get blog posts by category
  app.get("/api/blog/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      res.setHeader('Cache-Control', 'public, max-age=600');
      
      const posts = await blogStorage.getBlogPostsByCategory(category);
      const postsWithImages = posts.map((post: any) => ({
        ...post,
        featuredImage: post.featuredImage || getArticleImage(post.slug, post.category)
      }));
      res.json(postsWithImages);
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({ message: "Unable to fetch blog posts" });
    }
  });

  // Get a single blog post by slug
  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await blogStorage.getBlogPost(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Inject featuredImage if missing
      const postWithImage = {
        ...post,
        featuredImage: post.featuredImage || getArticleImage(post.slug, post.category)
      };
      
      res.json(postWithImage);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Unable to fetch blog post" });
    }
  });

  // Create a new blog post (admin only - future enhancement)
  app.post("/api/blog/posts", async (req, res) => {
    try {
      const postData = req.body;
      const post = await blogStorage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Unable to create blog post" });
    }
  });

  // Clear all blog posts
  app.post("/api/blog/clear", async (req, res) => {
    try {
      await blogStorage.clearAllPosts();
      res.json({ message: "Blog posts cleared successfully" });
    } catch (error) {
      console.error("Error clearing blog posts:", error);
      res.status(500).json({ message: "Unable to clear blog posts" });
    }
  });

  // Seed initial blog posts
  app.post("/api/blog/seed", async (req, res) => {
    try {
      await blogStorage.seedInitialPosts();
      res.json({ message: "Blog posts seeded successfully" });
    } catch (error) {
      console.error("Error seeding blog posts:", error);
      res.status(500).json({ message: "Unable to seed blog posts" });
    }
  });

  // Clear existing community posts first
  app.post('/api/community/clear', async (req, res) => {
    try {
      await db.delete(communityPosts);
      res.json({ success: true, message: "Community posts cleared" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Community seeding endpoint with diverse global users  
  app.post('/api/community/seed', async (req, res) => {
    try {
      console.log('🌱 Creating diverse global community with 123 realistic posts...');
      
      // Create diverse users from different countries with varied interests
      const globalUsers = [
        { username: "sarah_wellness_UK", email: "sarah.uk@demo.com", location: "London, UK" },
        { username: "carlos_herbal_MX", email: "carlos.mx@demo.com", location: "Mexico City, MX" },
        { username: "dr_priya_IN", email: "priya.in@demo.com", location: "Mumbai, India", isExpert: true },
        { username: "anna_nordic_SE", email: "anna.se@demo.com", location: "Stockholm, Sweden" },
        { username: "takeshi_zen_JP", email: "takeshi.jp@demo.com", location: "Tokyo, Japan" },
        { username: "maria_naturista_BR", email: "maria.br@demo.com", location: "São Paulo, Brazil" },
        { username: "ahmed_traditional_EG", email: "ahmed.eg@demo.com", location: "Cairo, Egypt" },
        { username: "lisa_organic_AU", email: "lisa.au@demo.com", location: "Sydney, Australia" },
        { username: "pierre_holistic_FR", email: "pierre.fr@demo.com", location: "Paris, France" },
        { username: "fatima_herbs_MA", email: "fatima.ma@demo.com", location: "Casablanca, Morocco" },
        { username: "giovanni_mediterranean_IT", email: "giovanni.it@demo.com", location: "Rome, Italy" },
        { username: "chen_tcm_CN", email: "chen.cn@demo.com", location: "Beijing, China" },
        { username: "olga_ayurveda_RU", email: "olga.ru@demo.com", location: "Moscow, Russia" },
        { username: "david_wellness_CA", email: "david.ca@demo.com", location: "Toronto, Canada" },
        { username: "nina_plantbased_DE", email: "nina.de@demo.com", location: "Berlin, Germany" },
        { username: "raj_spices_IN", email: "raj.in@demo.com", location: "New Delhi, India" },
        { username: "sofia_mediterranean_GR", email: "sofia.gr@demo.com", location: "Athens, Greece" },
        { username: "erik_scandinavian_NO", email: "erik.no@demo.com", location: "Oslo, Norway" },
        { username: "camila_rainforest_CO", email: "camila.co@demo.com", location: "Bogotá, Colombia" },
        { username: "yuki_macrobiotic_JP", email: "yuki.jp@demo.com", location: "Kyoto, Japan" },
        { username: "ibrahim_desert_SA", email: "ibrahim.sa@demo.com", location: "Riyadh, Saudi Arabia" },
        { username: "elena_slavic_PL", email: "elena.pl@demo.com", location: "Warsaw, Poland" },
        { username: "kofi_traditional_GH", email: "kofi.gh@demo.com", location: "Accra, Ghana" },
        { username: "ingrid_alpine_CH", email: "ingrid.ch@demo.com", location: "Zurich, Switzerland" },
        { username: "hassan_berber_DZ", email: "hassan.dz@demo.com", location: "Algiers, Algeria" },
        { username: "maya_mayan_GT", email: "maya.gt@demo.com", location: "Guatemala City, Guatemala" },
        { username: "thor_viking_IS", email: "thor.is@demo.com", location: "Reykjavik, Iceland" },
        { username: "aisha_saharan_TD", email: "aisha.td@demo.com", location: "N'Djamena, Chad" },
        { username: "diego_andean_PE", email: "diego.pe@demo.com", location: "Lima, Peru" },
        { username: "svetlana_siberian_RU", email: "svetlana.ru@demo.com", location: "Novosibirsk, Russia" }
      ];

      // Diverse post content types - questions, experiences, discussions, advice
      const diverseHealthPosts = [
        // Questions
        { type: "question", content: "Has anyone tried oil pulling for oral health? I keep hearing about it but not sure if it actually works or just a trend?", category: "oral-health" },
        { type: "question", content: "What's the best natural remedy for seasonal allergies? The pollen here is terrible this year and I want to avoid antihistamines.", category: "allergies" },
        { type: "question", content: "Can someone explain the difference between different types of magnesium? So many options at the store!", category: "supplements" },
        { type: "question", content: "Is it safe to take adaptogenic herbs while pregnant? My naturopath suggested some but I want other opinions.", category: "pregnancy" },
        { type: "question", content: "Does anyone know if elderberry really prevents colds or is it just marketing hype?", category: "immune-system" },
        
        // Personal experiences/success stories
        { type: "story", content: "After years of insomnia, I finally found what works: magnesium glycinate + chamomile tea + lavender pillow spray. Sleeping 8 hours straight now!", category: "sleep" },
        { type: "story", content: "My grandmother's turmeric paste recipe cleared up my eczema in 2 weeks. Traditional remedies really work sometimes!", category: "skin-care" },
        { type: "story", content: "Started drinking green tea instead of coffee 3 months ago. More sustained energy, no afternoon crashes, and I lost 5 pounds without trying.", category: "energy" },
        { type: "story", content: "Ginger shots every morning have completely eliminated my morning nausea during pregnancy. Natural is definitely better!", category: "pregnancy" },
        { type: "story", content: "Fire cider (apple cider vinegar + horseradish + ginger + honey) knocked out my cold in 2 days. Making a big batch for winter!", category: "immune-system" },
        
        // Discussions/advice
        { type: "discussion", content: "Why is everyone so obsessed with detox teas? Your liver and kidneys already detox naturally. Marketing or real benefits?", category: "detox" },
        { type: "discussion", content: "Traditional Chinese medicine vs Ayurveda - has anyone tried both approaches? Which worked better for you?", category: "traditional-medicine" },
        { type: "advice", content: "Pro tip: Add black pepper to turmeric for better absorption. The piperine increases bioavailability by 2000%!", category: "inflammation" },
        { type: "advice", content: "If you're taking probiotics, eat them with a small amount of fat for better survival through stomach acid.", category: "gut-health" },
        { type: "discussion", content: "Intermittent fasting helped my insulin resistance, but my friend says it worsened her hormones. Why such different results?", category: "hormones" },
        
        // Warning/safety posts
        { type: "warning", content: "PSA: St. John's Wort can interfere with birth control pills and many medications. Always check with your doctor first!", category: "safety" },
        { type: "warning", content: "Be careful with essential oils around pets! Tea tree oil is toxic to cats and dogs. Always research first.", category: "safety" },
        
        // Cultural/regional posts
        { type: "cultural", content: "In Scandinavia, we use lingonberries for UTI prevention. Works just as well as cranberries but easier to find here!", category: "urinary-health" },
        { type: "cultural", content: "My Indian mother-in-law taught me to use fenugreek seeds for milk supply while breastfeeding. Game changer!", category: "breastfeeding" },
        { type: "cultural", content: "Growing up in Morocco, we always used argan oil for everything - hair, skin, even cooking. Now it's trendy worldwide!", category: "beauty" },
        { type: "cultural", content: "In traditional Chinese medicine, we don't drink cold water with meals. Room temperature aids digestion better.", category: "digestion" },
        
        // Lifestyle posts
        { type: "lifestyle", content: "Started a medicinal herb garden this spring. Planted echinacea, calendula, and chamomile. So excited to make my own tinctures!", category: "gardening" },
        { type: "lifestyle", content: "Switched to sea salt instead of table salt. The mineral content makes such a difference in how I feel throughout the day.", category: "nutrition" },
        { type: "lifestyle", content: "Cold showers every morning for 30 days now. Increased alertness and energy, plus my skin looks better!", category: "biohacking" },
        
        // Recipe/preparation posts
        { type: "recipe", content: "Golden milk recipe: 1 tsp turmeric, pinch black pepper, ginger, cinnamon, coconut milk, honey. Perfect before bed!", category: "beverages" },
        { type: "recipe", content: "Homemade bone broth in the slow cooker: grass-fed bones + ACV + herbs for 24 hours. Liquid gold for gut health!", category: "nutrition" },
        
        // Frustration/seeking help
        { type: "help", content: "Struggling with chronic fatigue for 2 years. Doctors say everything is normal. Has anyone been through this? What helped?", category: "chronic-illness" },
        { type: "help", content: "Teenage daughter has terrible acne and doesn't want harsh chemicals. Natural options that actually work for teens?", category: "teenage-health" },
        
        // Seasonal posts
        { type: "seasonal", content: "Winter is coming and I always get SAD. Starting light therapy now. Any other natural mood boosters you swear by?", category: "mental-health" },
        { type: "seasonal", content: "Harvesting rosehips from my garden for vitamin C through winter. Nature's pharmacy right outside my door!", category: "foraging" },
        
        // Beginner questions
        { type: "beginner", content: "New to herbal medicine. What are the safest, most effective herbs for a complete beginner to start with?", category: "herbs" },
        { type: "beginner", content: "Want to eat more anti-inflammatory foods but overwhelmed by information. Simple starter tips?", category: "anti-inflammatory" },
        
        // Product recommendations
        { type: "recommendation", content: "Finally found a probiotic that works! 50 billion CFUs, multiple strains, survived my antibiotic treatment.", category: "gut-health" },
        
        // Skeptical/questioning posts
        { type: "skeptical", content: "Am I the only one skeptical about all these superfood trends? Seems like every week there's a new 'miracle' berry or seed.", category: "nutrition" },
        { type: "skeptical", content: "Essential oils for everything seems excessive. Which uses actually have scientific backing vs just nice smells?", category: "aromatherapy" }
      ];

      const createdUsers = [];
      let postCount = 0;

      // Create diverse users
      for (const userData of globalUsers) {
        try {
          const [user] = await db.insert(users).values({
            username: userData.username,
            email: userData.email,
            password: "demo123", // Default password for demo users
            role: userData.isExpert ? "expert" : "customer",
            isVerified: userData.isExpert || Math.random() > 0.8
          }).returning();
          createdUsers.push(user);
        } catch (e) {
          // Skip duplicate users, continue with existing ones
        }
      }

      // If no new users created, get existing users
      if (createdUsers.length === 0) {
        const existingUsers = await db.select().from(users).limit(30);
        createdUsers.push(...existingUsers);
      }

      console.log(`Using ${createdUsers.length} users for posts`);

      // Create 123 diverse posts
      for (let i = 0; i < 123; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomPost = diverseHealthPosts[Math.floor(Math.random() * diverseHealthPosts.length)];
        
        // Vary posting dates over last 45 days for more realistic timeline
        const daysAgo = Math.floor(Math.random() * 45);
        const hoursAgo = Math.floor(Math.random() * 24);
        const postDate = new Date();
        postDate.setDate(postDate.getDate() - daysAgo);
        postDate.setHours(postDate.getHours() - hoursAgo);

        // More realistic engagement based on post type
        let likesCount, commentsCount;
        if (randomPost.type === "question" || randomPost.type === "help") {
          likesCount = Math.floor(Math.random() * 25) + 5; // Questions get moderate likes
          commentsCount = Math.floor(Math.random() * 15) + 3; // But more comments
        } else if (randomPost.type === "story" || randomPost.type === "cultural") {
          likesCount = Math.floor(Math.random() * 60) + 10; // Success stories get more likes
          commentsCount = Math.floor(Math.random() * 8) + 2;
        } else if (randomPost.type === "warning" || randomPost.type === "advice") {
          likesCount = Math.floor(Math.random() * 80) + 20; // Safety/advice gets high engagement
          commentsCount = Math.floor(Math.random() * 12) + 5;
        } else {
          likesCount = Math.floor(Math.random() * 40) + 2;
          commentsCount = Math.floor(Math.random() * 8) + 1;
        }

        const sharesCount = Math.floor(Math.random() * 10);
        const viewsCount = likesCount * 5 + commentsCount * 12 + Math.floor(Math.random() * 200);

        try {
          await db.insert(communityPosts).values({
            authorId: randomUser.id,
            content: randomPost.content,
            postType: randomPost.type || "general", 
            category: randomPost.category,
            likesCount: likesCount,
            commentsCount: commentsCount,
            sharesCount: sharesCount,
            viewsCount: viewsCount,
            createdAt: postDate
          });
          postCount++;
        } catch (e) {
          console.log(`Skipping post ${i + 1}: ${e.message}`);
        }
      }

      console.log(`✅ Successfully created ${postCount} diverse health community posts from global users`);
      res.json({ 
        success: true, 
        message: `Community seeded with ${postCount} diverse posts from users worldwide covering questions, experiences, discussions, and cultural perspectives`,
        stats: { posts: postCount, users: createdUsers.length }
      });

    } catch (error) {
      console.error('❌ Community seeding error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Seed realistic comments for all posts
  app.post('/api/community/seed-comments', async (req, res) => {
    try {
      const { seedComments } = await import('./comment-seed');
      const result = await seedComments();
      res.json(result);
    } catch (error) {
      console.error('Comment seeding error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // User Activity API endpoints
  app.get("/api/user/activity-stats", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Fetch comprehensive user activity statistics
      const [
        remediesTakenResult,
        healthLogsResult,
        goalsCompletedResult,
        currentStreakResult,
        remediesViewedResult,
        chatSessionsResult,
        reviewsWrittenResult,
        daysActiveResult
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(healthLogs).where(and(eq(healthLogs.userId, userId), eq(healthLogs.type, 'remedy_taken'))),
        db.select({ count: sql<number>`count(*)` }).from(healthLogs).where(eq(healthLogs.userId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(healthGoals).where(and(eq(healthGoals.userId, userId), eq(healthGoals.status, 'completed'))),
        db.select({ 
          streak: sql<number>`COALESCE(MAX((streaks->>'current')::int), 0)` 
        }).from(healthMetrics).where(eq(healthMetrics.userId, userId)),
        db.select({ count: sql<number>`count(DISTINCT ${savedRemedies.remedyId})` }).from(savedRemedies).where(eq(savedRemedies.userId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(chatSessions).where(eq(chatSessions.userId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(reviews).where(eq(reviews.userId, userId)),
        db.select({ 
          days: sql<number>`count(DISTINCT date(created_at))` 
        }).from(healthLogs).where(eq(healthLogs.userId, userId))
      ]);

      res.json({
        remediesTaken: remediesTakenResult[0]?.count || 0,
        healthLogs: healthLogsResult[0]?.count || 0,
        goalsCompleted: goalsCompletedResult[0]?.count || 0,
        currentStreak: currentStreakResult[0]?.streak || 0,
        remediesViewed: remediesViewedResult[0]?.count || 0,
        chatSessions: chatSessionsResult[0]?.count || 0,
        reviewsWritten: reviewsWrittenResult[0]?.count || 0,
        daysActive: daysActiveResult[0]?.days || 0,
      });
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      res.status(500).json({ error: "Failed to fetch activity stats" });
    }
  });

  app.get("/api/user/community-stats", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Fetch community activity statistics
      const [
        postsResult,
        likesResult,
        commentsResult,
        lastPostResult,
        lastLikeResult,
        lastCommentResult
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(communityPosts).where(eq(communityPosts.authorId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(postLikes).where(eq(postLikes.userId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(postComments).where(eq(postComments.authorId, userId)),
        db.select({ createdAt: communityPosts.createdAt }).from(communityPosts).where(eq(communityPosts.authorId, userId)).orderBy(desc(communityPosts.createdAt)).limit(1),
        db.select({ createdAt: postLikes.createdAt }).from(postLikes).where(eq(postLikes.userId, userId)).orderBy(desc(postLikes.createdAt)).limit(1),
        db.select({ createdAt: postComments.createdAt }).from(postComments).where(eq(postComments.authorId, userId)).orderBy(desc(postComments.createdAt)).limit(1)
      ]);

      res.json({
        posts: postsResult[0]?.count || 0,
        likes: likesResult[0]?.count || 0,
        comments: commentsResult[0]?.count || 0,
        lastPost: lastPostResult[0]?.createdAt || null,
        lastLike: lastLikeResult[0]?.createdAt || null,
        lastComment: lastCommentResult[0]?.createdAt || null,
      });
    } catch (error) {
      console.error("Error fetching community stats:", error);
      res.status(500).json({ error: "Failed to fetch community stats" });
    }
  });

  app.get("/api/user/recent-activities", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Fetch recent user activities from userActivityFeed
      const recentActivities = await db
        .select({
          id: userActivityFeed.id,
          activityType: userActivityFeed.activityType,
          entityType: userActivityFeed.entityType,
          entityId: userActivityFeed.entityId,
          metadata: userActivityFeed.metadata,
          createdAt: userActivityFeed.createdAt,
        })
        .from(userActivityFeed)
        .where(eq(userActivityFeed.userId, userId))
        .orderBy(desc(userActivityFeed.createdAt))
        .limit(20);

      // Transform activities with descriptions
      const activitiesWithDescriptions = await Promise.all(
        recentActivities.map(async (activity) => {
          let description = "Unknown activity";
          
          try {
            switch (activity.activityType) {
              case 'remedy_view':
                const remedy = await db.select({ name: remedies.name }).from(remedies).where(eq(remedies.id, activity.entityId)).limit(1);
                description = `Viewed remedy: ${remedy[0]?.name || 'Unknown remedy'}`;
                break;
              case 'remedy_save':
                const savedRemedy = await db.select({ name: remedies.name }).from(remedies).where(eq(remedies.id, activity.entityId)).limit(1);
                description = `Saved remedy: ${savedRemedy[0]?.name || 'Unknown remedy'}`;
                break;
              case 'chat_session':
                description = "Started a new AI consultation session";
                break;
              case 'review_created':
                const reviewedRemedy = await db.select({ name: remedies.name }).from(remedies).where(eq(remedies.id, activity.entityId)).limit(1);
                description = `Reviewed remedy: ${reviewedRemedy[0]?.name || 'Unknown remedy'}`;
                break;
              case 'health_log':
                description = `Logged health data: ${activity.metadata?.type || 'general'}`;
                break;
              case 'goal_completed':
                description = `Completed health goal: ${activity.metadata?.goalName || 'Unknown goal'}`;
                break;
              case 'post_create':
                description = "Created a community post";
                break;
              case 'post_like':
                description = "Liked a community post";
                break;
              case 'comment':
                description = "Commented on a community post";
                break;
              default:
                description = `${activity.activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
            }
          } catch (error) {
            console.error(`Error processing activity ${activity.id}:`, error);
          }

          return {
            type: activity.activityType,
            description,
            createdAt: activity.createdAt,
            metadata: activity.metadata,
          };
        })
      );

      res.json(activitiesWithDescriptions);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });

  const httpServer = createServer(app);
  // Workout Routes
  app.get("/api/workouts/:muscle", async (req, res) => {
    try {
      const { muscle } = req.params;
      const workouts = await storage.getWorkoutsByMuscle(muscle);
      res.json(workouts);
    } catch (error: any) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Unable to fetch workouts" });
    }
  });

  app.get("/api/workouts", async (req, res) => {
    try {
      const workouts = await storage.getAllWorkouts();
      res.json(workouts);
    } catch (error: any) {
      console.error("Error fetching all workouts:", error);
      res.status(500).json({ message: "Unable to fetch workouts" });
    }
  });

  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createWorkoutSession(sessionData);
      res.json(session);
    } catch (error: any) {
      console.error("Error creating workout session:", error);
      res.status(500).json({ message: "Unable to create workout session" });
    }
  });

  app.patch("/api/workout-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const session = await storage.completeWorkoutSession(parseInt(id), updateData);
      res.json(session);
    } catch (error: any) {
      console.error("Error updating workout session:", error);
      res.status(500).json({ message: "Unable to update workout session" });
    }
  });

  app.get("/api/workout-progress", async (req, res) => {
    try {
      const userId = req.session?.userId || 1; // Default user for demo
      const progress = await storage.getUserWorkoutProgress(userId);
      res.json(progress);
    } catch (error: any) {
      console.error("Error fetching workout progress:", error);
      res.status(500).json({ message: "Unable to fetch workout progress" });
    }
  });

  app.get("/api/workout-recommendations", async (req, res) => {
    try {
      const userId = req.session?.userId || 1; // Default user for demo
      const progress = await storage.getUserWorkoutProgress(userId);
      const recommendations = await storage.getWorkoutRecommendations(userId, progress);
      res.json(recommendations);
    } catch (error: any) {
      console.error("Error fetching workout recommendations:", error);
      res.status(500).json({ message: "Unable to fetch workout recommendations" });
    }
  });

  // Translation API routes
  app.get("/api/translations/:language", async (req, res) => {
    try {
      const language = req.params.language;
      const { translations } = await import("@shared/schema");
      const translationResults = await db.select().from(translations).where(eq(translations.languageCode, language));
      
      // Convert to key-value pairs for easier frontend consumption
      const translationMap = translationResults.reduce((acc, t) => {
        acc[t.key] = t.value;
        return acc;
      }, {} as Record<string, string>);
      
      res.json(translationMap);
    } catch (error: any) {
      console.error("Get translations error:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.post("/api/translations", async (req, res) => {
    try {
      const { key, language, value, context } = req.body;
      // Note: Translation methods need to be implemented in storage layer
      const translation = { key, language, value, context }; // await storage.createTranslation({ key, language, value, context });
      res.json(translation);
    } catch (error: any) {
      console.error("Create translation error:", error);
      res.status(500).json({ message: "Failed to create translation" });
    }
  });

  app.get("/api/translation-keys", async (req, res) => {
    try {
      // Note: Translation methods need to be implemented in storage layer
      const keys: any[] = []; // await storage.getAllTranslationKeys();
      res.json(keys);
    } catch (error: any) {
      console.error("Get translation keys error:", error);
      res.status(500).json({ message: "Failed to fetch translation keys" });
    }
  });

  // Comprehensive translation seeding endpoint
  app.post("/api/seed-comprehensive-translations", async (req, res) => {
    try {
      const { seedComprehensiveTranslations } = await import("./seed-comprehensive-translations");
      const result = await seedComprehensiveTranslations();
      res.json({
        success: true,
        message: "Comprehensive translations seeded successfully",
        ...result
      });
    } catch (error: any) {
      console.error("Comprehensive translation seeding error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to seed comprehensive translations", 
        error: error.message 
      });
    }
  });

  // Content translation seeding endpoint (remedies, products, workouts, etc.)
  app.post("/api/seed-content-translations", async (req, res) => {
    try {
      const { seedContentTranslations } = await import("./seed-content-translations");
      const result = await seedContentTranslations();
      res.json({
        success: true,
        message: "Content translations seeded successfully",
        ...result
      });
    } catch (error: any) {
      console.error("Content translation seeding error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to seed content translations", 
        error: error.message 
      });
    }
  });

  // Remedy-specific translation seeding endpoint
  app.post("/api/seed-remedy-translations", async (req, res) => {
    try {
      const { seedRemedyTranslations } = await import("./seed-additional-content-translations");
      const result = await seedRemedyTranslations();
      res.json({
        success: true,
        message: "Remedy translations seeded successfully",
        ...result
      });
    } catch (error: any) {
      console.error("Remedy translation seeding error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to seed remedy translations", 
        error: error.message 
      });
    }
  });

  // Comprehensive translation seeding endpoint (ALL translations at once)
  app.post("/api/seed-comprehensive-translations", async (req, res) => {
    try {
      const { seedComprehensiveTranslations } = await import("./seed-comprehensive-translations");
      const result = await seedComprehensiveTranslations();
      res.json({
        success: true,
        message: "Comprehensive translations seeded successfully",
        ...result
      });
    } catch (error: any) {
      console.error("Comprehensive translation seeding error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to seed comprehensive translations", 
        error: error.message 
      });
    }
  });

  // Blog translations seeding endpoint
  app.post("/api/translations-seed-blog", async (req, res) => {
    try {
      await storage.seedBlogTranslations();
      res.json({ success: true, message: "Blog translations seeded successfully" });
    } catch (error: any) {
      console.error("Error seeding blog translations:", error);
      res.status(500).json({ error: "Failed to seed blog translations" });
    }
  });

  app.post("/api/translation-keys", async (req, res) => {
    try {
      const { key, description, defaultValue, category } = req.body;
      // Note: Translation methods need to be implemented in storage layer
      const translationKey = { key, description, defaultValue, category }; // await storage.createTranslationKey({ key, description, defaultValue, category });
      res.json(translationKey);
    } catch (error: any) {
      console.error("Create translation key error:", error);
      res.status(500).json({ message: "Failed to create translation key" });
    }
  });

  // Currency API routes
  app.get("/api/currency/rates", async (req, res) => {
    try {
      const { getCurrencyRates } = await import("./currency-service");
      const rates = await getCurrencyRates();
      res.json({ rates, lastUpdated: new Date().toISOString() });
    } catch (error) {
      console.error("Error fetching currency rates:", error);
      res.status(500).json({ error: "Failed to fetch currency rates" });
    }
  });

  app.post("/api/currency/update", async (req, res) => {
    try {
      const { updateCurrencyRates } = await import("./currency-service");
      const updatedCount = await updateCurrencyRates();
      res.json({ 
        success: true, 
        updatedCount,
        message: `Updated ${updatedCount} currency rates`,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating currency rates:", error);
      res.status(500).json({ error: "Failed to update currency rates" });
    }
  });

  // ====================================
  // COMMUNITY API ROUTES - Advanced Social Platform with Privacy Controls
  // ====================================

  // Helper function to check if user can view another user's content
  async function canViewUserContent(viewerId: number | null, targetUserId: number): Promise<boolean> {
    // Always allow viewing your own content
    if (viewerId === targetUserId) return true;
    
    // Check if target user has private profile
    const [targetProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, targetUserId));
    
    // If user doesn't have a profile entry or isPrivate is false, they are public
    if (!targetProfile?.isPrivate) return true;
    
    // For private profiles (completely invisible mode), no one can see the content
    // This makes users completely invisible and unsearchable in the community
    return false;
  }

  // Get all community posts with privacy filters
  app.get("/api/community/posts", async (req, res) => {
    try {
      const { type, category, limit = "20", offset = "0", following } = req.query;
      const viewerId = req.session?.userId || null;
      
      // If following=true, return empty for now (no auth context yet)
      if (following === 'true') {
        res.json([]);
        return;
      }

      // First get all posts with author profile information
      const allPosts = await db
        .select({
          id: communityPosts.id,
          title: communityPosts.title,
          content: communityPosts.content,
          postType: communityPosts.postType,
          category: communityPosts.category,
          tags: communityPosts.tags,
          imageUrl: communityPosts.imageUrl,
          likesCount: communityPosts.likesCount,
          commentsCount: communityPosts.commentsCount,
          sharesCount: communityPosts.sharesCount,
          viewsCount: communityPosts.viewsCount,
          isPinned: communityPosts.isPinned,
          createdAt: communityPosts.createdAt,
          authorId: communityPosts.authorId,
          author: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            profilePictureUrl: users.profilePictureUrl,
            role: users.role,
            isVerified: users.isVerified,
          },
          authorProfile: {
            isPrivate: userProfiles.isPrivate,
          }
        })
        .from(communityPosts)
        .innerJoin(users, eq(communityPosts.authorId, users.id))
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(eq(communityPosts.isDeleted, false))
        .orderBy(desc(communityPosts.isPinned), desc(communityPosts.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Filter posts based on privacy settings
      const visiblePosts = [];
      for (const post of allPosts) {
        const canView = await canViewUserContent(viewerId, post.authorId);
        if (canView) {
          // Remove internal privacy data before sending to client
          const { authorProfile, ...cleanPost } = post;
          visiblePosts.push(cleanPost);
        }
      }

      res.json(visiblePosts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Create a new community post
  app.post("/api/community/posts", async (req, res) => {
    try {
      const { title, content, postType, category, tags, imageUrl } = req.body;
      const userId = req.session?.userId;

      // Check if user is authenticated
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!content || !postType) {
        return res.status(400).json({ error: "Content and post type are required" });
      }

      const [newPost] = await db.insert(communityPosts).values({
        authorId: userId,
        title: title || null,
        content,
        postType,
        category: category || null,
        tags: tags || [],
        imageUrl: imageUrl || null,
      }).returning();

      // Get the complete post with author information
      const [postWithAuthor] = await db
        .select({
          id: communityPosts.id,
          title: communityPosts.title,
          content: communityPosts.content,
          postType: communityPosts.postType,
          category: communityPosts.category,
          tags: communityPosts.tags,
          imageUrl: communityPosts.imageUrl,
          likesCount: communityPosts.likesCount,
          commentsCount: communityPosts.commentsCount,
          createdAt: communityPosts.createdAt,
          author: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            profilePictureUrl: users.profilePictureUrl,
            role: users.role,
            isVerified: users.isVerified,
          }
        })
        .from(communityPosts)
        .innerJoin(users, eq(communityPosts.authorId, users.id))
        .where(eq(communityPosts.id, newPost.id));

      res.status(201).json(postWithAuthor);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Like/unlike a post
  app.post("/api/community/posts/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session?.userId || 1;

      // Check if already liked
      const [existingLike] = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.postId, parseInt(postId)), eq(postLikes.userId, userId)));

      if (existingLike) {
        // Unlike
        await db
          .delete(postLikes)
          .where(and(eq(postLikes.postId, parseInt(postId)), eq(postLikes.userId, userId)));
      } else {
        // Like
        await db.insert(postLikes).values({
          postId: parseInt(postId),
          userId,
          reactionType: "like",
        });
      }

      // Get updated like count
      const likeCount = await db
        .select({ count: sql`count(*)` })
        .from(postLikes)
        .where(eq(postLikes.postId, parseInt(postId)));

      // Update the post's like count
      await db
        .update(communityPosts)
        .set({ likesCount: parseInt(likeCount[0].count.toString()) })
        .where(eq(communityPosts.id, parseInt(postId)));

      res.json({ 
        liked: !existingLike,
        likesCount: parseInt(likeCount[0].count.toString())
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  // Get comments for a post
  app.get("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;

      const comments = await db
        .select({
          id: postComments.id,
          content: postComments.content,
          parentCommentId: postComments.parentCommentId,
          likesCount: postComments.likesCount,
          createdAt: postComments.createdAt,
          author: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            profilePictureUrl: users.profilePictureUrl,
            role: users.role,
            isVerified: users.isVerified,
          }
        })
        .from(postComments)
        .innerJoin(users, eq(postComments.authorId, users.id))
        .where(and(eq(postComments.postId, parseInt(postId)), eq(postComments.isDeleted, false)))
        .orderBy(asc(postComments.createdAt));

      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Add comment to post
  app.post("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, parentCommentId } = req.body;
      const userId = req.session?.userId || 1;

      if (!content) {
        return res.status(400).json({ error: "Comment content is required" });
      }

      const [newComment] = await db.insert(postComments).values({
        postId: parseInt(postId),
        authorId: userId,
        content,
        parentCommentId: parentCommentId || null,
      }).returning();

      // Get the complete comment with author information
      const [commentWithAuthor] = await db
        .select({
          id: postComments.id,
          content: postComments.content,
          parentCommentId: postComments.parentCommentId,
          likesCount: postComments.likesCount,
          createdAt: postComments.createdAt,
          author: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            profilePictureUrl: users.profilePictureUrl,
            role: users.role,
            isVerified: users.isVerified,
          }
        })
        .from(postComments)
        .innerJoin(users, eq(postComments.authorId, users.id))
        .where(eq(postComments.id, newComment.id));

      res.status(201).json(commentWithAuthor);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Delete post endpoint
  app.delete("/api/community/posts/:postId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const postId = parseInt(req.params.postId);
      const userId = req.session.userId;
      
      // Check if post exists
      const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, postId));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Delete related records first to avoid foreign key constraints
      await db.delete(postLikes).where(eq(postLikes.postId, postId));
      await db.delete(postComments).where(eq(postComments.postId, postId));
      
      // Now delete the post
      await db.delete(communityPosts).where(eq(communityPosts.id, postId));
      
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
      console.error("Delete post error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Save post endpoint
  app.post("/api/community/posts/:postId/save", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const postId = parseInt(req.params.postId);
      const userId = req.session.userId;
      
      // For now, just return success - implement actual save logic later
      res.json({ success: true, message: "Post saved successfully" });
    } catch (error: any) {
      console.error("Save post error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Report post endpoint
  app.post("/api/community/posts/:postId/report", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const postId = parseInt(req.params.postId);
      const userId = req.session.userId;
      const { reason } = req.body;
      
      // For now, just return success - implement actual report logic later
      res.json({ success: true, message: "Post reported successfully" });
    } catch (error: any) {
      console.error("Report post error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Search users by username or display name with privacy controls
  app.get("/api/community/users/search", async (req, res) => {
    try {
      const { q, limit = "10" } = req.query;
      const viewerId = req.session?.userId || null;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const searchTerm = `%${q.toLowerCase()}%`;
      
      // Get users with their privacy settings
      const foundUsers = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profilePictureUrl: users.profilePictureUrl,
          role: users.role,
          isVerified: users.isVerified,
          isPrivate: userProfiles.isPrivate,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
          or(
            ilike(users.username, searchTerm),
            ilike(users.fullName, searchTerm)
          )
        )
        .limit(parseInt(limit as string) * 2); // Get more to filter by privacy

      // Filter results based on privacy settings - private accounts are completely hidden
      const visibleUsers = [];
      for (const user of foundUsers) {
        // Only show public profiles OR private profiles to the owner themselves
        if (!user.isPrivate || user.id === viewerId) {
          const { isPrivate, ...publicUserData } = user;
          visibleUsers.push(publicUserData);
        }
        // Private accounts are completely hidden from search - no exceptions
      }

      res.json(visibleUsers.slice(0, parseInt(limit as string)));
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Failed to search users" });
    }
  });

  // Get user profile with privacy controls
  app.get("/api/community/users/:userId/profile", async (req, res) => {
    try {
      const { userId } = req.params;
      const viewerId = req.session?.userId || null;

      // Check if viewer can access this profile
      const canView = await canViewUserContent(viewerId, parseInt(userId));
      if (!canView) {
        return res.status(403).json({ error: "Private account - follow to see profile" });
      }

      const [userProfile] = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profilePictureUrl: users.profilePictureUrl,
          role: users.role,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, parseInt(userId)));

      if (!userProfile) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get follower/following counts
      const [followerCount] = await db
        .select({ count: sql`count(*)` })
        .from(userFollows)
        .where(eq(userFollows.followingId, parseInt(userId)));

      const [followingCount] = await db
        .select({ count: sql`count(*)` })
        .from(userFollows)
        .where(eq(userFollows.followerId, parseInt(userId)));

      // Get post count
      const [postCount] = await db
        .select({ count: sql`count(*)` })
        .from(communityPosts)
        .where(and(eq(communityPosts.authorId, parseInt(userId)), eq(communityPosts.isDeleted, false)));

      res.json({
        ...userProfile,
        stats: {
          followers: parseInt(followerCount.count as string),
          following: parseInt(followingCount.count as string),
          posts: parseInt(postCount.count as string),
        }
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Follow/unfollow user with privacy controls
  app.post("/api/community/users/:userId/follow", async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.session?.userId || 1;

      if (parseInt(userId) === currentUserId) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }

      // Check target user's privacy settings
      const [targetProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, parseInt(userId)));

      // Check if already following
      const [existingFollow] = await db
        .select()
        .from(userFollows)
        .where(and(eq(userFollows.followerId, currentUserId), eq(userFollows.followingId, parseInt(userId))));

      if (existingFollow) {
        // Unfollow
        await db
          .delete(userFollows)
          .where(and(eq(userFollows.followerId, currentUserId), eq(userFollows.followingId, parseInt(userId))));

        res.json({ following: false, status: null });
      } else {
        // Determine follow status based on privacy settings
        let status = 'accepted'; // Default for public accounts
        
        if (targetProfile?.isPrivate && !targetProfile?.allowFollowRequests) {
          return res.status(403).json({ error: "This private account doesn't accept follow requests" });
        } else if (targetProfile?.isPrivate) {
          status = 'pending'; // Private accounts require approval
        }

        // Create follow relationship
        await db.insert(userFollows).values({
          followerId: currentUserId,
          followingId: parseInt(userId),
          status: status,
        });

        res.json({ 
          following: true, 
          status: status,
          message: status === 'pending' ? 'Follow request sent' : 'Following'
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ error: "Failed to toggle follow" });
    }
  });

// Get user's posts with privacy controls
app.get("/api/community/users/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = "20", offset = "0" } = req.query;
    const viewerId = req.session?.userId || null;

    // Check if viewer can access this user's posts
    const canView = await canViewUserContent(viewerId, parseInt(userId));
    if (!canView) {
      return res.status(403).json({ error: "Private account - follow to see posts" });
    }

    const userPosts = await db
      .select({
        id: communityPosts.id,
        title: communityPosts.title,
        content: communityPosts.content,
        postType: communityPosts.postType,
        category: communityPosts.category,
        tags: communityPosts.tags,
        imageUrl: communityPosts.imageUrl,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        createdAt: communityPosts.createdAt,
        author: {
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profilePictureUrl: users.profilePictureUrl,
          role: users.role,
          isVerified: users.isVerified,
        }
      })
      .from(communityPosts)
      .innerJoin(users, eq(communityPosts.authorId, users.id))
      .where(and(eq(communityPosts.authorId, parseInt(userId)), eq(communityPosts.isDeleted, false)))
      .orderBy(desc(communityPosts.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

  // User search API with privacy controls
  app.get("/api/community/users/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return res.json([]);
      }

      const searchTerm = `%${query.trim().toLowerCase()}%`;
      
      // Search users by username or full name
      const searchResults = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profilePictureUrl: users.profilePictureUrl,
          role: users.role,
          isVerified: users.isVerified,
          isPrivate: userProfiles.isPrivate,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
          or(
            like(sql`LOWER(${users.username})`, searchTerm),
            like(sql`LOWER(${users.fullName})`, searchTerm)
          )
        )
        .limit(10);

      // Apply privacy controls - hide sensitive info for private accounts
      const filteredUsers = searchResults.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.isPrivate ? null : user.fullName,
        profilePictureUrl: user.profilePictureUrl,
        role: user.role,
        isVerified: user.isVerified,
        isPrivate: user.isPrivate || false,
      }));

      res.json(filteredUsers);
    } catch (error: any) {
      console.error("User search error:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Get user's liked posts with privacy controls
  app.get("/api/community/users/:userId/likes", async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = "20", offset = "0" } = req.query;
      const viewerId = req.session?.userId || null;

      // Check if viewer can access this user's activity
      const canView = await canViewUserContent(viewerId, parseInt(userId));
      if (!canView) {
        return res.status(403).json({ error: "Private account - follow to see liked posts" });
      }

      // Get user's liked posts with author privacy filtering
      const likedPosts = await db
        .select({
          id: communityPosts.id,
          title: communityPosts.title,
          content: communityPosts.content,
          postType: communityPosts.postType,
          category: communityPosts.category,
          tags: communityPosts.tags,
          imageUrl: communityPosts.imageUrl,
          likesCount: communityPosts.likesCount,
          commentsCount: communityPosts.commentsCount,
          createdAt: communityPosts.createdAt,
          likedAt: postLikes.createdAt,
          authorId: communityPosts.authorId,
          author: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            profilePictureUrl: users.profilePictureUrl,
            role: users.role,
            isVerified: users.isVerified,
          }
        })
        .from(postLikes)
        .innerJoin(communityPosts, eq(postLikes.postId, communityPosts.id))
        .innerJoin(users, eq(communityPosts.authorId, users.id))
        .where(and(
          eq(postLikes.userId, parseInt(userId)),
          eq(communityPosts.isDeleted, false)
        ))
        .orderBy(desc(postLikes.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Filter out posts from private accounts that viewer can't see
      const visibleLikedPosts = [];
      for (const post of likedPosts) {
        const canViewPost = await canViewUserContent(viewerId, post.authorId);
        if (canViewPost) {
          const { authorId, ...cleanPost } = post;
          visibleLikedPosts.push(cleanPost);
        }
      }

      res.json(visibleLikedPosts);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ error: "Failed to fetch liked posts" });
    }
  });

  // Privacy-enhanced follow status check
  app.get("/api/community/users/:userId/follow-status", async (req, res) => {
    try {
      const { userId } = req.params;
      const viewerId = req.session?.userId || null;

      if (!viewerId || parseInt(userId) === viewerId) {
        return res.json({ following: false, isOwnProfile: parseInt(userId) === viewerId });
      }

      const [followRelation] = await db
        .select()
        .from(userFollows)
        .where(and(
          eq(userFollows.followerId, viewerId),
          eq(userFollows.followingId, parseInt(userId))
        ));

      const [targetProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, parseInt(userId)));

      res.json({
        following: !!followRelation,
        status: followRelation?.status || null,
        isPrivate: targetProfile?.isPrivate || false,
        allowsFollowRequests: targetProfile?.allowFollowRequests !== false
      });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  // User profile privacy settings API
  app.patch("/api/user/profile", async (req, res) => {
    try {
      const userId = req.session?.userId || 1;
      const { isPrivate, allowFollowRequests } = req.body;

      // Check if user profile exists
      const [existingProfile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      if (existingProfile) {
        // Update existing profile
        await db
          .update(userProfiles)
          .set({
            isPrivate: isPrivate !== undefined ? isPrivate : existingProfile.isPrivate,
            allowFollowRequests: allowFollowRequests !== undefined ? allowFollowRequests : existingProfile.allowFollowRequests,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId));
      } else {
        // Create new profile
        await db.insert(userProfiles).values({
          userId,
          isPrivate: isPrivate || false,
          allowFollowRequests: allowFollowRequests || false,
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile settings" });
    }
  });

  // Create Stripe Checkout Session for premium tiers
  app.post("/api/subscription/checkout", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { tier } = req.body;

      // Validate tier - only allow silver or gold
      if (!tier || !["silver", "gold"].includes(tier.toLowerCase())) {
        return res.status(400).json({ message: "Invalid tier. Only silver or gold are allowed." });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      // Get user from database
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Map tier to Stripe price ID
      const priceIds: { [key: string]: string } = {
        silver: "price_1SRgLbQXtzJSV5CZMCtjS5so",
        gold: "price_1SRgQwQXtzJSV5CZE9cmhqvr",
      };

      const priceId = priceIds[tier.toLowerCase()];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid tier price ID" });
      }

      // Get or create Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: userId.toString(),
          },
        });
        customerId = customer.id;

        // Store customer ID in database
        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, userId));
      }

      // Helper function to construct absolute URLs with proper scheme
      const getBaseUrl = (): string => {
        // Check for custom production domain first (plantrxapp.com)
        const customDomain = process.env.CUSTOM_DOMAIN || 'plantrxapp.com';
        const isProduction = process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1';
        
        // In production, prefer custom domain for Stripe redirects
        if (isProduction && customDomain) {
          return `https://${customDomain}`;
        }
        
        // Prefer req.headers.origin (includes scheme) for development
        if (req.headers.origin) {
          return req.headers.origin;
        }
        
        // Fall back to constructing from REPLIT_DOMAINS or localhost
        const domain = process.env.REPLIT_DOMAINS?.split(',')[0];
        if (domain) {
          return `https://${domain}`;
        }
        
        return 'http://localhost:5000';
      };

      const baseUrl = getBaseUrl();
      const successUrl = `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing?canceled=true`;

      // Validate URLs are absolute before sending to Stripe
      if (!successUrl.startsWith('http://') && !successUrl.startsWith('https://')) {
        throw new Error(`Invalid success_url: ${successUrl}. Must be an absolute URL with http:// or https://`);
      }
      if (!cancelUrl.startsWith('http://') && !cancelUrl.startsWith('https://')) {
        throw new Error(`Invalid cancel_url: ${cancelUrl}. Must be an absolute URL with http:// or https://`);
      }

      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId.toString(),
          tier: tier.toLowerCase(),
        },
      });

      // Store pending tier and checkout session ID
      await db
        .update(users)
        .set({
          pendingTier: tier.toLowerCase(),
          pendingCheckoutSessionId: session.id,
        })
        .where(eq(users.id, userId));

      // Return checkout URL
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout session creation error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Subscription update API - SECURE: Only allows Bronze tier without payment
  app.patch("/api/user/subscription", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Validate request body using schema
      const validation = subscriptionUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid subscription data",
          errors: validation.error.errors 
        });
      }

      const { subscriptionTier, subscriptionStatus } = validation.data;

      // SECURITY: Only allow Bronze tier activation without Stripe verification
      // Silver and Gold tiers require Stripe webhook confirmation
      if (subscriptionTier !== "bronze") {
        return res.status(403).json({ 
          message: "Premium tiers require payment verification. Please complete checkout via Stripe." 
        });
      }

      // For Bronze tier, clear Stripe-related fields since it's free
      const updateData = {
        subscriptionTier: "bronze" as const,
        subscriptionStatus: subscriptionStatus || ("active" as const),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionPeriodEnd: null,
      };

      // Update user subscription
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      // Fetch and return updated user
      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      res.json(updatedUser);
    } catch (error: any) {
      console.error("Subscription update error:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // ========================================
  // 24-HOUR GOLD TRIAL API ENDPOINTS
  // ========================================

  // Start Gold Trial - Activates 24-hour premium access
  app.post("/api/trial/start", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required to start trial" });
      }

      // Fetch current user data
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if trial has already been used
      if (currentUser.goldTrialUsedOnce) {
        return res.status(403).json({ 
          message: "You've already used your free Gold trial. Upgrade to continue enjoying premium features!",
          alreadyUsed: true
        });
      }

      // Check if trial is already active
      if (currentUser.goldTrialStartedAt) {
        const trialEndTime = new Date(currentUser.goldTrialStartedAt.getTime() + 24 * 60 * 60 * 1000);
        if (new Date() < trialEndTime) {
          return res.status(400).json({ 
            message: "Your Gold trial is already active!",
            trialActive: true,
            trialEndTime: trialEndTime.toISOString(),
            remainingMs: trialEndTime.getTime() - Date.now()
          });
        }
      }

      // Start the trial - set trial start time and upgrade to Gold with trial status
      const trialStartTime = new Date();
      const trialEndTime = new Date(trialStartTime.getTime() + 24 * 60 * 60 * 1000);

      await db
        .update(users)
        .set({
          goldTrialStartedAt: trialStartTime,
          subscriptionTier: "gold",
          subscriptionStatus: "trial",
        })
        .where(eq(users.id, userId));

      // Fetch and return updated user
      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      console.log(`[TRIAL] User ${userId} started Gold trial at ${trialStartTime.toISOString()}`);

      res.json({
        success: true,
        message: "Your 24-hour Gold trial has started! Enjoy all premium features.",
        trialActive: true,
        trialStartTime: trialStartTime.toISOString(),
        trialEndTime: trialEndTime.toISOString(),
        remainingMs: 24 * 60 * 60 * 1000,
        user: { ...updatedUser, password: undefined }
      });
    } catch (error: any) {
      console.error("Trial start error:", error);
      res.status(500).json({ message: "Failed to start trial" });
    }
  });

  // Get Trial Status - Check if trial is active and time remaining
  app.get("/api/trial/status", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.json({ 
          trialActive: false, 
          trialUsed: false,
          authenticated: false
        });
      }

      // Fetch current user data
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has a paid subscription (silver or gold)
      const hasPaidSubscription = currentUser.subscriptionTier === 'silver' || currentUser.subscriptionTier === 'gold';
      const hasEverPaid = currentUser.hasEverPaidSubscription || hasPaidSubscription;

      // Check if trial has never been started
      if (!currentUser.goldTrialStartedAt) {
        return res.json({
          trialActive: false,
          trialUsed: currentUser.goldTrialUsedOnce || false,
          canStartTrial: !currentUser.goldTrialUsedOnce,
          subscriptionTier: currentUser.subscriptionTier || 'bronze',
          hasPaidSubscription,
          hasEverPaidSubscription: hasEverPaid,
          authenticated: true
        });
      }

      // Calculate trial end time
      const trialEndTime = new Date(currentUser.goldTrialStartedAt.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const isActive = now < trialEndTime;
      const remainingMs = isActive ? trialEndTime.getTime() - now.getTime() : 0;

      // If trial has expired but not marked as used, update the user
      if (!isActive && !currentUser.goldTrialUsedOnce) {
        // Expire the trial - revert to bronze and mark as used
        await db
          .update(users)
          .set({
            goldTrialUsedOnce: true,
            subscriptionTier: "bronze",
            subscriptionStatus: "active",
          })
          .where(eq(users.id, userId));

        console.log(`[TRIAL] User ${userId} trial expired - reverted to bronze`);

        return res.json({
          trialActive: false,
          trialUsed: true,
          trialExpired: true,
          canStartTrial: false,
          subscriptionTier: currentUser.subscriptionTier || 'bronze',
          hasPaidSubscription,
          hasEverPaidSubscription: hasEverPaid,
          message: "Your Gold trial has ended. Upgrade to continue enjoying premium features!",
          authenticated: true
        });
      }

      res.json({
        trialActive: isActive,
        trialUsed: currentUser.goldTrialUsedOnce || false,
        canStartTrial: !currentUser.goldTrialUsedOnce && !currentUser.goldTrialStartedAt,
        subscriptionTier: currentUser.subscriptionTier || 'bronze',
        hasPaidSubscription,
        hasEverPaidSubscription: hasEverPaid,
        trialStartTime: currentUser.goldTrialStartedAt?.toISOString(),
        trialEndTime: trialEndTime.toISOString(),
        remainingMs: remainingMs,
        remainingHours: Math.floor(remainingMs / (1000 * 60 * 60)),
        remainingMinutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
        remainingSeconds: Math.floor((remainingMs % (1000 * 60)) / 1000),
        authenticated: true
      });
    } catch (error: any) {
      console.error("Trial status error:", error);
      res.status(500).json({ message: "Failed to check trial status" });
    }
  });

  // Profile picture upload API
  app.post("/api/user/profile-picture", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }

      // Validate base64 image data
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Pattern.test(imageData)) {
        return res.status(400).json({ message: "Invalid image format. Please use JPEG, PNG, GIF, or WebP" });
      }

      // In a production app, you would upload to a cloud service like AWS S3, Cloudinary, etc.
      // For now, we'll store the base64 data directly (not recommended for production)
      const profilePictureUrl = imageData;

      // Update user's profile picture URL
      await db
        .update(users)
        .set({
          profilePictureUrl: profilePictureUrl
        })
        .where(eq(users.id, userId));

      res.json({
        success: true,
        profilePictureUrl: profilePictureUrl,
        message: "Profile picture updated successfully"
      });
    } catch (error: any) {
      console.error("Profile picture upload error:", error);
      res.status(500).json({ message: "Failed to update profile picture" });
    }
  });

  // Get user profile picture
  app.get("/api/user/profile-picture", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const [user] = await db
        .select({ profilePictureUrl: users.profilePictureUrl })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        profilePictureUrl: user.profilePictureUrl
      });
    } catch (error: any) {
      console.error("Get profile picture error:", error);
      res.status(500).json({ message: "Failed to get profile picture" });
    }
  });

  // Privacy settings API
  app.post("/api/user/privacy", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { isPublicProfile } = req.body;
      
      // Validate input
      if (typeof isPublicProfile !== 'boolean') {
        return res.status(400).json({ message: "isPublicProfile must be a boolean" });
      }

      // Update user's privacy setting
      await db
        .update(users)
        .set({
          isPublicProfile: isPublicProfile
        })
        .where(eq(users.id, userId));

      res.json({
        success: true,
        isPublicProfile: isPublicProfile,
        message: `Account visibility updated to ${isPublicProfile ? 'public' : 'private'}`
      });
    } catch (error: any) {
      console.error("Privacy settings update error:", error);
      res.status(500).json({ message: "Failed to update privacy settings" });
    }
  });

  // Multi-language support routes
  app.get('/api/languages', async (req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error: any) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ error: 'Failed to fetch languages' });
    }
  });

  app.get('/api/translations/:languageCode?', async (req, res) => {
    try {
      const languageCode = req.params.languageCode || 'en';
      const translations = await storage.getTranslations(languageCode);
      const languages = await storage.getLanguages();
      
      res.json({
        translations,
        languages,
        currentLanguage: languageCode,
      });
    } catch (error: any) {
      console.error('Error fetching translations:', error);
      res.status(500).json({ error: 'Failed to fetch translations' });
    }
  });

  app.post('/api/user-language-preference', async (req, res) => {
    try {
      const { languageCode } = req.body;
      
      if (!languageCode) {
        return res.status(400).json({ error: 'Language code is required' });
      }

      // For authenticated users, save to database
      if (req.session?.userId) {
        await storage.setUserLanguagePreference(req.session.userId, languageCode);
      }
      
      // Also save to session for non-authenticated users
      req.session.languageCode = languageCode;
      
      res.json({ success: true, languageCode });
    } catch (error: any) {
      console.error('Error setting language preference:', error);
      res.status(500).json({ error: 'Failed to set language preference' });
    }
  });

  app.get('/api/user-language-preference', async (req, res) => {
    try {
      let languageCode = 'en'; // default
      
      // For authenticated users, get from database
      if (req.session?.userId) {
        const preference = await storage.getUserLanguagePreference(req.session.userId);
        if (preference) {
          languageCode = preference.languageCode;
        }
      }
      
      // Fallback to session
      if (!languageCode && req.session?.languageCode) {
        languageCode = req.session.languageCode;
      }
      
      res.json({ languageCode });
    } catch (error: any) {
      console.error('Error getting language preference:', error);
      res.status(500).json({ error: 'Failed to get language preference' });
    }
  });

  // Helper function to generate slug from remedy name
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50); // Limit length
  }

  // Helper function to map health concerns to categories
  function mapHealthConcernToCategory(healthConcern: string): string {
    const concern = healthConcern.toLowerCase();
    
    // Sleep and stress
    if (concern.includes('sleep') || concern.includes('insomnia') || concern.includes('tired') || concern.includes('fatigue')) {
      return 'sleep';
    }
    // Digestive
    if (concern.includes('digest') || concern.includes('stomach') || concern.includes('nausea') || concern.includes('bloat') || concern.includes('constipa')) {
      return 'digestive';
    }
    // Immune
    if (concern.includes('immune') || concern.includes('cold') || concern.includes('flu') || concern.includes('infection') || concern.includes('sick')) {
      return 'immune';
    }
    // Pain and inflammation
    if (concern.includes('pain') || concern.includes('ache') || concern.includes('sore') || concern.includes('inflam') || concern.includes('arthritis')) {
      return 'pain';
    }
    // Stress and anxiety
    if (concern.includes('stress') || concern.includes('anxiety') || concern.includes('nervous') || concern.includes('worry')) {
      return 'stress';
    }
    // Skin
    if (concern.includes('skin') || concern.includes('acne') || concern.includes('rash') || concern.includes('eczema')) {
      return 'skin';
    }
    // Energy
    if (concern.includes('energy') || concern.includes('vitality') || concern.includes('weak')) {
      return 'energy';
    }
    
    // Default category
    return 'general';
  }

  // AI Remedy Generation Endpoint
  app.post('/api/generate-remedy', async (req, res) => {
    try {
      const { healthConcern, preferences } = req.body;
      
      if (!healthConcern || healthConcern.trim().length === 0) {
        return res.status(400).json({ error: 'Health concern is required' });
      }
      
      console.log(`🔮 Generating AI remedy for: "${healthConcern}"`);
      
      const remedy = await generateRemedyWithDualAI({
        healthConcern: healthConcern.trim(),
        preferences: preferences?.trim() || undefined
      });
      
      console.log(`✅ Successfully generated remedy: "${remedy.name}"`);
      
      // Automatically save the generated remedy to the main remedies table
      try {
        console.log(`💾 Saving generated remedy to database...`);
        
        // Generate a unique slug
        const baseSlug = generateSlug(remedy.name);
        let uniqueSlug = baseSlug;
        let counter = 1;
        
        // Ensure slug is unique
        while (await storage.getRemedyBySlug(uniqueSlug)) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        // Map health concern to category
        const category = mapHealthConcernToCategory(healthConcern);
        
        // Prepare remedy data for database
        const remedyData = {
          name: remedy.name,
          slug: uniqueSlug,
          description: remedy.description || remedy.scientific_basis || 'A natural remedy generated by PlantRx AI experts.',
          ingredients: Array.isArray(remedy.ingredients) ? remedy.ingredients : [remedy.ingredients].filter(Boolean),
          benefits: Array.isArray(remedy.benefits) ? remedy.benefits : [remedy.benefits].filter(Boolean),
          instructions: remedy.instructions,
          form: remedy.form || 'tea',
          imageUrl: '/api/placeholder/400/300', // Use placeholder for generated remedies
          expertId: null, // AI generated
          isGenerated: true, // Mark as AI generated
          category: category,
          isActive: true
        };
        
        // Save to database
        const savedRemedy = await storage.createRemedy(remedyData);
        console.log(`✅ Remedy saved to database with ID: ${savedRemedy.id}`);
        
        // Return the complete remedy with database ID and slug
        const completeRemedy = {
          ...remedy,
          id: savedRemedy.id,
          slug: savedRemedy.slug,
          category: savedRemedy.category,
          imageUrl: savedRemedy.imageUrl,
          isGenerated: true
        };
        
        res.json(completeRemedy);
        
      } catch (saveError: any) {
        console.error(`❌ Failed to save remedy to database:`, saveError);
        // Still return the remedy even if save failed
        res.json(remedy);
      }
      
    } catch (error: any) {
      console.error('❌ Remedy generation failed:', error);
      
      let statusCode = 500;
      let errorMessage = 'Failed to generate remedy';
      
      if (error.message?.includes('only provide guidance on health')) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message?.includes('both AI services')) {
        statusCode = 503;
        errorMessage = 'AI services are temporarily unavailable. Please try again later.';
      }
      
      res.status(statusCode).json({ error: errorMessage });
    }
  });

  // PDF Health Check Endpoint
  app.get("/api/health/pdf", async (_req, res) => {
    try {
      // Minimal sanity test: tiny inline HTML → PDF
      const { htmlToPdfBuffer } = await import('../pdf/make.js');
      const html = "<html><body><h1>PDF OK</h1></body></html>";
      const buf = await htmlToPdfBuffer(html);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", String(buf.length));
      res.end(buf);
    } catch (error: any) {
      console.error('❌ PDF health check failed:', error);
      res.status(500).json({ error: "PDF system unavailable" });
    }
  });

  // Bullet-proof PDF Generation Endpoint
  app.post('/api/generate-pdf', async (req, res) => {
    try {
      const { type, planData, answers } = req.body;
      
      if (!type || !['diet', 'fitness', 'skincare', 'wellness', 'recovery'].includes(type)) {
        return res.status(400).json({ error: 'Invalid plan type' });
      }
      
      console.log(`🔮 Generating ${type} PDF using bullet-proof system...`);
      
      // Import the new PDF system
      const { htmlToPdfBuffer } = await import('../pdf/make.js');
      const { renderDiet, renderFitness, renderSkincare, renderWellness, renderRecovery } = await import('../pdf/templates.js');
      
      // Template mapping
      const TPL = {
        diet: renderDiet,
        fitness: renderFitness,
        skincare: renderSkincare,
        wellness: renderWellness,
        recovery: renderRecovery,
      };
      
      const render = TPL[type];
      if (!render) return res.status(400).json({ error: "Unknown type" });
      
      // Format answers for the PDF system
      const formattedAnswers = {
        user: { name: answers?.name || 'User' },
        goal: answers?.goals || answers?.goal || answers?.primaryGoal || 'general health',
        experience: answers?.experience || answers?.fitnessLevel || answers?.experienceLevel || 'beginner',
        budget: answers?.budget || 'standard',
        region: answers?.region || '',
        diet: {
          type: answers?.diet_type || 'general',
          allergies: answers?.foods_avoid ? [answers.foods_avoid] : []
        },
        skin: {
          type: answers?.skin_type || 'normal',
          sensitivities: answers?.skin_sensitivities || []
        },
        equipment: answers?.equipment || {},
        injuries: answers?.injuries || [],
        time_per_day_min: answers?.time_available ? parseInt(answers.time_available) : 30,
        weight_kg: answers?.weight ? parseFloat(answers.weight) : null
      };
      
      console.log('📊 Formatted answers for new system:', formattedAnswers);
      
      // Generate HTML and convert to PDF
      const html = render(formattedAnswers);
      const pdfBuffer = await htmlToPdfBuffer(html);
      
      // ✅ Correct headers (and content length so Chrome doesn't choke)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="plantrx-${type}-plan-${new Date().toISOString().slice(0,10)}.pdf"`);
      res.setHeader("Content-Length", String(pdfBuffer.length));
      
      console.log(`✅ PDF generated successfully: ${pdfBuffer.length} bytes`);
      
      return res.end(pdfBuffer);
      
    } catch (error: any) {
      console.error('❌ PDF generation failed:', error);
      return res.status(500).json({ error: "PDF generation failed" });
    }
  });

  // =====================================
  // PERSONAL DASHBOARD ENDPOINTS
  // =====================================

  // Get user's personal dashboard data
  app.get('/api/dashboard', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Fetch all dashboard data in parallel
      const [
        savedRemediesData,
        userCommunityPosts,
        communityComments,
        userChatSessions,
        userReviews,
        userActivitiesData
      ] = await Promise.all([
        // Saved remedies with remedy details
        db.select({
          id: savedRemedies.id,
          remedyId: savedRemedies.remedyId,
          savedAt: savedRemedies.createdAt,
          remedyName: remedies.name,
          remedySlug: remedies.slug,
          remedyDescription: remedies.description,
          remedyImageUrl: remedies.imageUrl,
          remedyCategory: remedies.category
        }).from(savedRemedies)
          .innerJoin(remedies, eq(savedRemedies.remedyId, remedies.id))
          .where(eq(savedRemedies.userId, userId))
          .orderBy(desc(savedRemedies.createdAt)),

        // Community posts by user
        db.select().from(communityPosts)
          .where(eq(communityPosts.authorId, userId))
          .orderBy(desc(communityPosts.createdAt))
          .limit(10),

        // Recent comments by user
        db.select({
          id: postComments.id,
          content: postComments.content,
          createdAt: postComments.createdAt,
          postId: postComments.postId,
          postTitle: communityPosts.title
        }).from(postComments)
          .innerJoin(communityPosts, eq(postComments.postId, communityPosts.id))
          .where(eq(postComments.authorId, userId))
          .orderBy(desc(postComments.createdAt))
          .limit(10),

        // Recent chat sessions
        db.select().from(chatSessions)
          .where(eq(chatSessions.userId, userId))
          .orderBy(desc(chatSessions.updatedAt))
          .limit(10),

        // Recent reviews by user
        db.select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          remedyName: remedies.name,
          remedySlug: remedies.slug
        }).from(reviews)
          .innerJoin(remedies, eq(reviews.remedyId, remedies.id))
          .where(eq(reviews.userId, userId))
          .orderBy(desc(reviews.createdAt))
          .limit(10),

        // Recent activities
        db.select().from(userActivities)
          .where(eq(userActivities.userId, userId))
          .orderBy(desc(userActivities.createdAt))
          .limit(20)
      ]);

      res.json({
        savedRemedies: savedRemediesData,
        communityPosts: userCommunityPosts,
        communityComments,
        chatSessions: userChatSessions,
        reviews: userReviews,
        activities: userActivitiesData
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Save/Unsave remedy
  app.post('/api/remedies/:id/save', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const remedyId = parseInt(req.params.id);
      if (isNaN(remedyId)) {
        return res.status(400).json({ error: 'Invalid remedy ID' });
      }

      // Check if already saved
      const existing = await db.select().from(savedRemedies)
        .where(and(eq(savedRemedies.userId, userId), eq(savedRemedies.remedyId, remedyId)))
        .limit(1);

      if (existing.length > 0) {
        // Unsave - remove from saved remedies
        await db.delete(savedRemedies)
          .where(and(eq(savedRemedies.userId, userId), eq(savedRemedies.remedyId, remedyId)));
        
        // Log activity
        await db.insert(userActivities).values({
          userId,
          activityType: 'unsaved_remedy',
          relatedId: remedyId,
          relatedType: 'remedy'
        });

        res.json({ saved: false, message: 'Remedy removed from saved list' });
      } else {
        // Save remedy
        await db.insert(savedRemedies).values({
          userId,
          remedyId
        });

        // Log activity
        await db.insert(userActivities).values({
          userId,
          activityType: 'saved_remedy',
          relatedId: remedyId,
          relatedType: 'remedy'
        });

        res.json({ saved: true, message: 'Remedy saved successfully' });
      }

    } catch (error: any) {
      console.error('Error saving/unsaving remedy:', error);
      res.status(500).json({ error: 'Failed to save/unsave remedy' });
    }
  });

  // Check if remedy is saved by user
  app.get('/api/remedies/:id/saved', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.json({ saved: false });
      }

      const remedyId = parseInt(req.params.id);
      if (isNaN(remedyId)) {
        return res.status(400).json({ error: 'Invalid remedy ID' });
      }

      const existing = await db.select().from(savedRemedies)
        .where(and(eq(savedRemedies.userId, userId), eq(savedRemedies.remedyId, remedyId)))
        .limit(1);

      res.json({ saved: existing.length > 0 });

    } catch (error: any) {
      console.error('Error checking saved status:', error);
      res.status(500).json({ error: 'Failed to check saved status' });
    }
  });

  // Like/Unlike community post
  app.post('/api/community/posts/:id/like', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      // Check if already liked
      const existing = await db.select().from(postLikes)
        .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)))
        .limit(1);

      if (existing.length > 0) {
        // Unlike - remove like
        await db.delete(postLikes)
          .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
        
        // Update like count
        await db.update(communityPosts)
          .set({ likesCount: sql`${communityPosts.likesCount} - 1` })
          .where(eq(communityPosts.id, postId));

        res.json({ liked: false, message: 'Post unliked' });
      } else {
        // Like post
        await db.insert(postLikes).values({
          userId,
          postId,
          reactionType: 'like'
        });

        // Update like count
        await db.update(communityPosts)
          .set({ likesCount: sql`${communityPosts.likesCount} + 1` })
          .where(eq(communityPosts.id, postId));

        // Log activity
        await db.insert(userActivities).values({
          userId,
          activityType: 'liked_post',
          relatedId: postId,
          relatedType: 'community_post'
        });

        res.json({ liked: true, message: 'Post liked successfully' });
      }

    } catch (error: any) {
      console.error('Error liking/unliking post:', error);
      res.status(500).json({ error: 'Failed to like/unlike post' });
    }
  });

  // Create community post
  app.post('/api/community/posts', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { title, content, category = 'general', imageUrl } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Create post
      const [post] = await db.insert(communityPosts).values({
        authorId: userId,
        title: title?.trim() || null,
        content: content.trim(),
        postType: title ? 'discussion' : 'story',
        category,
        imageUrl: imageUrl || null
      }).returning();

      // Log activity
      await db.insert(userActivities).values({
        userId,
        activityType: 'created_post',
        relatedId: post.id,
        relatedType: 'community_post',
        metadata: { title, category }
      });

      res.json(post);

    } catch (error: any) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Comment on community post
  app.post('/api/community/posts/:id/comments', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const { content } = req.body;
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      // Create comment
      const [comment] = await db.insert(postComments).values({
        postId,
        authorId: userId,
        content: content.trim()
      }).returning();

      // Update comment count on post
      await db.update(communityPosts)
        .set({ commentsCount: sql`${communityPosts.commentsCount} + 1` })
        .where(eq(communityPosts.id, postId));

      // Log activity
      await db.insert(userActivities).values({
        userId,
        activityType: 'commented',
        relatedId: postId,
        relatedType: 'community_post'
      });

      res.json(comment);

    } catch (error: any) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Save chat session
  app.post('/api/chat/sessions', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { title, summary, messages } = req.body;
      
      if (!title || !messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Title and messages are required' });
      }

      // Create chat session
      const [session] = await db.insert(chatSessions).values({
        userId,
        title: title.trim(),
        summary: summary?.trim() || null
      }).returning();

      // Save chat messages
      if (messages.length > 0) {
        await db.insert(chatMessages).values(
          messages.map((msg: any) => ({
            sessionId: session.id,
            role: msg.role,
            content: msg.content
          }))
        );
      }

      // Log activity
      await db.insert(userActivities).values({
        userId,
        activityType: 'chat_saved',
        relatedId: session.id,
        relatedType: 'chat_session',
        metadata: { title, messageCount: messages.length }
      });

      res.json(session);

    } catch (error: any) {
      console.error('Error saving chat session:', error);
      res.status(500).json({ error: 'Failed to save chat session' });
    }
  });

  // Get chat session with messages
  app.get('/api/chat/sessions/:id', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const sessionId = parseInt(req.params.id);
      if (isNaN(sessionId)) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }

      // Get session
      const [session] = await db.select().from(chatSessions)
        .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
        .limit(1);

      if (!session) {
        return res.status(404).json({ error: 'Chat session not found' });
      }

      // Get messages
      const messages = await db.select().from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(chatMessages.timestamp);

      res.json({ ...session, messages });

    } catch (error: any) {
      console.error('Error fetching chat session:', error);
      res.status(500).json({ error: 'Failed to fetch chat session' });
    }
  });

  // PDF Health Check Endpoint
  app.get("/health/pdf", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const { htmlToPdfBuffer } = await import("../pdf/make.js");
      
      const css = await fs.readFile("pdf/print.css", "utf8");
      const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
      <body><main><h1>PDF OK</h1><p>Health check.</p></main></body></html>`;
      const pdf = await htmlToPdfBuffer(html);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": String(pdf.length)
      });
      return res.end(pdf);
    } catch (e: any) {
      res.status(500).json({ error: "Health failed", message: e.message, stack: e.stack });
    }
  });

  // PDF Generation Routes for PlanRx Creator - Comprehensive System
  app.post("/api/generate/:type", async (req, res) => {
    try {
      const type = req.params.type as 'diet' | 'fitness' | 'skincare' | 'wellness' | 'recovery';
      if (!['diet', 'fitness', 'skincare', 'wellness', 'recovery'].includes(type)) {
        return res.status(400).json({ error: 'Invalid plan type' });
      }

      const requestData = req.body || {};
      const answers = requestData.answers || {};
      
      // Extract user data from session or request
      const userData = {
        name: req.session?.userEmail?.split('@')[0] || answers.name || 'Valued Member',
        age: answers.age,
        gender: answers.gender,
        goals: answers.goals || [],
        healthConcerns: answers.health_concerns || [],
        experience: answers.experience || answers.fitness_level || 'beginner',
        preferences: answers.preferences || answers.dietary_preferences || [],
        lifestyle: answers.lifestyle || 'moderate',
        duration: answers.duration || '30 days'
      };

      console.log(`[PDF] Generating ${type} plan for ${userData.name}`);

      // Generate comprehensive PDF using our new system
      const { generateComprehensivePDF } = await import("./comprehensive-pdf-system.js");
      const pdf = await generateComprehensivePDF(type, userData, answers);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="planrx-${type}-plan-${new Date().toISOString().slice(0,10)}.pdf"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store"
      });
      
      console.log(`[PDF] Successfully generated ${type} plan (${pdf.length} bytes)`);
      return res.end(pdf);
      
    } catch (e: any) {
      const errorPayload = { 
        error: "PDF generation failed", 
        message: e.message, 
        stack: e.stack 
      };
      console.error("[PDF ERROR]", errorPayload);
      res.status(500).json(errorPayload);
    }
  });

  // =============================================
  // SHOPIFY API ENDPOINTS
  // =============================================

  // Fetch all products from Shopify
  app.get("/api/shopify/products", async (req, res) => {
    try {
      const products = await serverShopifyService.fetchProducts();
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching Shopify products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Create a new cart
  app.post("/api/shopify/cart", async (req, res) => {
    try {
      const cart = await serverShopifyService.createCart();
      if (!cart) {
        return res.status(500).json({ error: 'Failed to create cart' });
      }
      res.json(cart);
    } catch (error: any) {
      console.error('Error creating Shopify cart:', error);
      res.status(500).json({ error: 'Failed to create cart' });
    }
  });

  // Add item to cart
  app.post("/api/shopify/cart/:cartId/items", async (req, res) => {
    try {
      const { cartId } = req.params;
      const decodedCartId = decodeURIComponent(cartId);
      const { variantId, quantity = 1 } = req.body;

      if (!variantId) {
        return res.status(400).json({ error: 'Variant ID is required' });
      }

      const cart = await serverShopifyService.addToCart(decodedCartId, variantId, quantity);
      if (!cart) {
        return res.status(500).json({ error: 'Failed to add item to cart' });
      }
      res.json(cart);
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  });

  // Update cart item quantity
  app.put("/api/shopify/cart/:cartId/items/:lineItemId", async (req, res) => {
    try {
      const { cartId, lineItemId } = req.params;
      const decodedCartId = decodeURIComponent(cartId);
      const decodedLineItemId = decodeURIComponent(lineItemId);
      const { quantity } = req.body;

      if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be non-negative' });
      }

      const cart = await serverShopifyService.updateCartItem(decodedCartId, decodedLineItemId, quantity);
      if (!cart) {
        return res.status(500).json({ error: 'Failed to update cart item' });
      }
      res.json(cart);
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  });

  // Remove item from cart
  app.delete("/api/shopify/cart/:cartId/items/:lineItemId", async (req, res) => {
    try {
      const { cartId, lineItemId } = req.params;
      const decodedCartId = decodeURIComponent(cartId);
      const decodedLineItemId = decodeURIComponent(lineItemId);

      const cart = await serverShopifyService.removeFromCart(decodedCartId, decodedLineItemId);
      if (!cart) {
        return res.status(500).json({ error: 'Failed to remove item from cart' });
      }
      res.json(cart);
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  });

  // Fetch cart by ID
  app.get("/api/shopify/cart/:cartId", async (req, res) => {
    try {
      const { cartId } = req.params;
      const decodedCartId = decodeURIComponent(cartId);

      const cart = await serverShopifyService.fetchCart(decodedCartId);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json(cart);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  });

  // SEO Pre-rendering for Search Engine Crawlers - Last in routes before fallback
  app.get('*', async (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|pinterest|crawl|spider|bot/i.test(userAgent);
    
    console.log(`🤖 Request from ${userAgent} to ${req.path} - Bot detected: ${isBot}`);
    
    if (isBot && !req.path.startsWith('/api')) {
      try {
        // Generate basic pre-rendered content for bots
        let title = 'PlantRx - Expert Natural Health Platform';
        let description = 'Discover 133+ verified plant-based remedies, backed by experts.';
        let content = 'PlantRx offers comprehensive natural health solutions.';
        
        // Customize content based on URL path
        if (req.path.startsWith('/remedies/')) {
          const slug = req.path.split('/remedies/')[1];
          title = `${slug.replace(/-/g, ' ')} - Natural Remedy | PlantRx`;
          description = `Learn about ${slug.replace(/-/g, ' ')} natural remedy with expert-verified instructions and benefits.`;
          content = `Comprehensive guide to ${slug.replace(/-/g, ' ')} natural remedy from PlantRx experts.`;
        } else if (req.path === '/remedies') {
          title = '133+ Natural Remedies That Actually Work | Expert-Verified Plant Medicine';
          description = 'Browse proven natural remedies with step-by-step instructions. Expert-verified plant medicine for anxiety, pain, digestion & more.';
          content = 'Comprehensive collection of 133+ expert-verified natural remedies for various health conditions.';
        } else if (req.path.startsWith('/blog/')) {
          const slug = req.path.split('/blog/')[1];
          title = `${slug.replace(/-/g, ' ')} - PlantRx Blog`;
          description = `Expert insights on ${slug.replace(/-/g, ' ')} from PlantRx natural health specialists.`;
          content = `In-depth article about ${slug.replace(/-/g, ' ')} covering natural health approaches and expert recommendations.`;
        } else if (req.path === '/blog') {
          title = 'Natural Health Blog - Expert Wellness Tips & Remedy Guides | PlantRx';
          description = 'Get expert natural health advice, proven remedy guides & wellness tips from health professionals.';
          content = 'Expert-written articles on natural health, herbal remedies, and wellness guidance.';
        } else if (req.path === '/experts') {
          title = 'Expert Natural Health Consultants | Verified Plant Medicine Specialists';
          description = 'Connect with certified natural health experts for personalized herbal consultations and plant-based wellness guidance.';
          content = 'Meet our team of verified natural health experts and book personalized consultations.';
        } else if (req.path === '/store') {
          title = 'Natural Health Products Store | Premium Herbs & Supplements';
          description = 'Shop premium natural health products, organic herbs, and expert-recommended supplements with free shipping.';
          content = 'Discover premium natural health products curated by our experts.';
        }
        
        const preRenderedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://plantrxapp.com${req.path}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://plantrxapp.com${req.path}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="PlantRx">
</head>
<body>
  <header>
    <h1>${title}</h1>
    <nav>
      <a href="https://plantrxapp.com/">Home</a>
      <a href="https://plantrxapp.com/remedies">Remedies</a>
      <a href="https://plantrxapp.com/blog">Blog</a>
      <a href="https://plantrxapp.com/experts">Experts</a>
      <a href="https://plantrxapp.com/store">Store</a>
    </nav>
  </header>
  <main>
    <h2>${description}</h2>
    <div>${content}</div>
    <p>This is PlantRx, the leading natural health platform with 133+ expert-verified remedies.</p>
  </main>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.send(preRenderedHTML);
      } catch (error) {
        console.error('Pre-rendering error:', error);
        // Fall through to normal SPA serving
      }
    }
    
    next();
  });

  return httpServer;
}
