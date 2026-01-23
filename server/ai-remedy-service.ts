import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;
let gemini: GoogleGenAI | null = null;

// Initialize clients only if API keys are available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

interface RemedyRequest {
  healthConcern: string;
  preferences?: string;
}

interface GeneratedRemedy {
  name: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  instructions: string;
  form: string;
  dosage: string;
  duration: string;
  safety: string;
  scientific_basis: string;
}

const HEALTH_SYSTEM_PROMPT = `You are an expert natural health practitioner with decades of experience in herbal medicine, nutrition, and holistic wellness. You ONLY provide guidance on health, wellness, natural remedies, and related topics. 

CRITICAL RULES:
- ONLY respond to health, wellness, nutrition, fitness, mental health, natural remedies, or medical-related questions
- If asked about anything non-health related, respond: "I can only provide guidance on health and wellness topics. Please ask me about natural remedies, nutrition, fitness, or other health concerns."
- Always include safety warnings and recommend consulting healthcare providers
- Base recommendations on traditional herbal knowledge and scientific evidence
- Be specific about dosages, preparation methods, and duration
- Include contraindications and potential interactions

Your response must be a valid JSON object with these exact fields:
{
  "name": "Descriptive remedy name",
  "description": "Brief description of what this remedy addresses",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "instructions": "Detailed preparation and usage instructions",
  "form": "tea/tincture/capsule/topical/etc",
  "dosage": "Specific dosage recommendations",
  "duration": "How long to use this remedy",
  "safety": "Important safety information and contraindications",
  "scientific_basis": "Brief explanation of why this works"
}`;

export async function generateRemedyWithChatGPT(request: RemedyRequest): Promise<GeneratedRemedy> {
  // Validate health-related content
  if (!isHealthRelated(request.healthConcern)) {
    throw new Error("I can only provide guidance on health and wellness topics. Please ask me about natural remedies, nutrition, fitness, or other health concerns.");
  }

  const userPrompt = `Health concern: ${request.healthConcern}
${request.preferences ? `Preferences: ${request.preferences}` : ''}

Please provide a natural remedy recommendation for this health concern.`;

  if (!openai) {
    throw new Error("OpenAI client not available - API key not configured");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: HEALTH_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response generated");
    }

    const remedy = JSON.parse(content) as GeneratedRemedy;
    
    // Validate the response has all required fields
    if (!remedy.name || !remedy.ingredients || !remedy.instructions) {
      throw new Error("Incomplete remedy generated");
    }

    return remedy;
  } catch (error: any) {
    console.error("ChatGPT remedy generation error:", error);
    throw new Error(`ChatGPT service error: ${error.message}`);
  }
}

export async function generateRemedyWithGemini(request: RemedyRequest): Promise<GeneratedRemedy> {
  // Validate health-related content
  if (!isHealthRelated(request.healthConcern)) {
    throw new Error("I can only provide guidance on health and wellness topics. Please ask me about natural remedies, nutrition, fitness, or other health concerns.");
  }

  const prompt = `${HEALTH_SYSTEM_PROMPT}

User Request:
Health concern: ${request.healthConcern}
${request.preferences ? `Preferences: ${request.preferences}` : ''}

Please provide a natural remedy recommendation for this health concern.`;

  if (!gemini) {
    throw new Error("Gemini client not available - API key not configured");
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            benefits: { type: "array", items: { type: "string" } },
            instructions: { type: "string" },
            form: { type: "string" },
            dosage: { type: "string" },
            duration: { type: "string" },
            safety: { type: "string" },
            scientific_basis: { type: "string" }
          },
          required: ["name", "ingredients", "instructions"]
        }
      },
      contents: prompt,
    });

    const content = response.text;
    if (!content) {
      throw new Error("No response generated");
    }

    const remedy = JSON.parse(content) as GeneratedRemedy;
    
    // Validate the response has all required fields
    if (!remedy.name || !remedy.ingredients || !remedy.instructions) {
      throw new Error("Incomplete remedy generated");
    }

    return remedy;
  } catch (error: any) {
    console.error("Gemini remedy generation error:", error);
    throw new Error(`Gemini service error: ${error.message}`);
  }
}

export async function generateRemedyWithDualAI(request: RemedyRequest): Promise<GeneratedRemedy> {
  // Validate health-related content first
  if (!isHealthRelated(request.healthConcern)) {
    throw new Error("I can only provide guidance on health and wellness topics. Please ask me about natural remedies, nutrition, fitness, or other health concerns.");
  }

  console.log("🤖 Attempting remedy generation with ChatGPT...");
  
  try {
    return await generateRemedyWithChatGPT(request);
  } catch (chatgptError) {
    console.log("⚠️ ChatGPT failed, trying Gemini...", chatgptError);
    
    try {
      return await generateRemedyWithGemini(request);
    } catch (geminiError) {
      console.error("❌ Both AI services failed:", { chatgptError, geminiError });
      
      // Return a fallback remedy if both AI services fail but request is health-related
      return generateFallbackRemedy(request);
    }
  }
}

function generateFallbackRemedy(request: RemedyRequest): GeneratedRemedy {
  const concern = request.healthConcern.toLowerCase();
  
  // Basic fallback remedies for common health concerns
  if (concern.includes('headache')) {
    return {
      name: "Peppermint & Ginger Headache Relief",
      description: "A natural remedy combining cooling peppermint with warming ginger to ease headache pain.",
      ingredients: ["Fresh peppermint leaves", "Fresh ginger root", "Lavender essential oil"],
      benefits: ["Reduces headache pain", "Relaxes tense muscles", "Improves circulation", "Calms the nervous system"],
      instructions: "Steep 1 tsp dried peppermint and 1 tsp fresh grated ginger in hot water for 10 minutes. Add 1 drop lavender oil. Drink warm.",
      form: "Herbal tea",
      dosage: "1 cup as needed, up to 3 times daily",
      duration: "Use when headaches occur",
      safety: "Avoid if pregnant or breastfeeding. Consult healthcare provider if headaches persist.",
      scientific_basis: "Peppermint contains menthol which has natural analgesic properties. Ginger has anti-inflammatory compounds."
    };
  }
  
  if (concern.includes('bloat') || concern.includes('gas') || concern.includes('digest') || concern.includes('stomach')) {
    return {
      name: "Digestive Comfort Tea Blend",
      description: "A soothing herbal blend to reduce bloating, gas, and support healthy digestion.",
      ingredients: ["Fennel seeds", "Peppermint leaves", "Ginger root", "Chamomile flowers"],
      benefits: ["Reduces bloating and gas", "Supports digestive function", "Soothes stomach discomfort", "Promotes healthy gut bacteria"],
      instructions: "Mix 1 tsp fennel seeds, 1 tsp dried peppermint, 1/2 tsp grated ginger, and 1 tsp chamomile. Steep in hot water for 15 minutes. Strain and drink warm after meals.",
      form: "Herbal tea",
      dosage: "1 cup after meals, up to 3 times daily",
      duration: "Use as needed for digestive comfort",
      safety: "Generally safe. Avoid large amounts if pregnant. Consult healthcare provider if symptoms persist.",
      scientific_basis: "Fennel and peppermint contain compounds that relax digestive muscles and reduce gas. Ginger stimulates digestion."
    };
  }
  
  if (concern.includes('stress') || concern.includes('anxiety')) {
    return {
      name: "Chamomile Stress Relief Blend",
      description: "A calming herbal blend to reduce stress and promote relaxation.",
      ingredients: ["Chamomile flowers", "Lemon balm", "Passionflower"],
      benefits: ["Reduces stress hormones", "Promotes relaxation", "Improves sleep quality", "Calms nervous tension"],
      instructions: "Mix equal parts of herbs. Steep 1 tbsp in hot water for 15 minutes. Strain and drink warm.",
      form: "Herbal tea",
      dosage: "1 cup 2-3 times daily",
      duration: "Use as needed for stress relief",
      safety: "Generally safe. May cause drowsiness. Avoid if allergic to ragweed family.",
      scientific_basis: "Chamomile contains apigenin which binds to brain receptors to promote calmness."
    };
  }
  
  // Default general wellness remedy
  return {
    name: "General Wellness Support",
    description: "A balanced herbal blend to support overall health and wellbeing.",
    ingredients: ["Green tea", "Turmeric root", "Honey"],
    benefits: ["Supports immune system", "Reduces inflammation", "Provides antioxidants", "Boosts energy naturally"],
    instructions: "Brew green tea, add 1/2 tsp turmeric powder and honey to taste. Stir well and drink warm.",
    form: "Herbal tea",
    dosage: "1 cup daily with meals",
    duration: "Safe for daily use",
    safety: "Generally safe. Consult healthcare provider before use if on medications.",
    scientific_basis: "Green tea and turmeric contain powerful antioxidants and anti-inflammatory compounds."
  };
}

function isHealthRelated(text: string): boolean {
  const healthKeywords = [
    // General health terms
    'pain', 'ache', 'sick', 'illness', 'disease', 'symptom', 'health', 'wellness', 'medical',
    'tired', 'fatigue', 'sleep', 'insomnia', 'stress', 'anxiety', 'depression', 'mood',
    
    // Digestive & stomach issues
    'digestion', 'digestive', 'stomach', 'nausea', 'bloating', 'bloated', 'gas', 'constipation', 
    'diarrhea', 'indigestion', 'heartburn', 'acid', 'reflux', 'ibs', 'cramps', 'gut', 'intestinal',
    
    // Head & neurological
    'headache', 'migraine', 'dizziness', 'vertigo', 'brain', 'neurological',
    
    // Body systems & inflammation
    'inflammation', 'swelling', 'joint', 'arthritis', 'muscle', 'bone', 'injury', 'wound', 'healing',
    
    // Skin & hair
    'skin', 'rash', 'acne', 'eczema', 'psoriasis', 'dermatitis', 'wrinkles', 'aging', 'hair', 'scalp',
    'dandruff', 'bald', 'thinning', 'dry', 'oily', 'itchy', 'sensitive',
    
    // Respiratory & immune
    'allergy', 'allergies', 'immune', 'cold', 'flu', 'fever', 'asthma', 'cough', 'throat', 
    'sinus', 'congestion', 'runny', 'stuffy', 'breathing', 'respiratory',
    
    // Cardiovascular & metabolic
    'blood', 'pressure', 'diabetes', 'cholesterol', 'heart', 'circulation', 'hypertension',
    'weight', 'obesity', 'metabolism', 'thyroid',
    
    // Infections & pathogens
    'infection', 'bacteria', 'virus', 'fungal', 'yeast', 'candida', 'parasites',
    
    // Nutrition & lifestyle
    'diet', 'nutrition', 'vitamin', 'mineral', 'supplement', 'exercise', 'fitness',
    'detox', 'cleanse', 'liver', 'kidney',
    
    // Mental & cognitive
    'mental', 'cognitive', 'memory', 'focus', 'concentration', 'energy', 'vitality',
    'depression', 'anxiety', 'panic', 'phobia',
    
    // Reproductive & hormonal
    'hormonal', 'hormone', 'menstrual', 'period', 'pms', 'pregnancy', 'menopause', 
    'testosterone', 'estrogen', 'adrenal', 'fertility',
    
    // Treatment terms
    'natural', 'herbal', 'remedy', 'treatment', 'cure', 'relief', 'healing', 'therapy'
  ];
  
  const lowerText = text.toLowerCase();
  // Always allow health-related terms - be more permissive
  if (healthKeywords.some(keyword => lowerText.includes(keyword))) {
    return true;
  }
  
  // Also allow if it contains common health problem patterns
  const healthPatterns = [
    /feel.*(bad|sick|unwell|ill)/i,
    /trouble.*(sleep|digest|breath)/i,
    /problems?.*(with|in).*(stomach|head|back|joint)/i,
    /need.*(help|remedy|treatment).*(for|with)/i
  ];
  
  return healthPatterns.some(pattern => pattern.test(text));
}