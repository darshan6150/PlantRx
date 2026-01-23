import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Ajv from 'ajv';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const argv = yargs(hideBin(process.argv))
  .option('type', { type: 'string', demandOption: true, choices: ['diet','skincare','fitness','recovery','wellness'] })
  .option('provider', { type: 'string', default: 'auto', choices: ['auto','openai','gemini'] })
  .option('tone', { type: 'string', default: 'simple' })
  .option('audience', { type: 'string', default: 'beginner' })
  .option('out', { type: 'string', demandOption: true })
  .argv;

const SCHEMAS = {
  diet: {
    type: 'object',
    required: ['meta','weekly_plan','shopping_list','days'],
    properties: {
      meta: {
        type: 'object',
        required: ['title','duration','type','difficulty'],
        properties: {
          title:{type:'string'}, duration:{type:'string'}, type:{type:'string'}, difficulty:{type:'string'}
        }
      },
      weekly_plan: {
        type: 'array',
        minItems: 7,
        items: {
          type:'object',
          required:['day','breakfast','lunch','dinner','snacks'],
          properties: {
            day:{type:'string'},
            breakfast:{type:'string'},
            lunch:{type:'string'},
            dinner:{type:'string'},
            snacks:{type:'array', items:{type:'string'}}
          }
        }
      },
      shopping_list: {
        type: 'array',
        items: {
          type:'object',
          required:['category','items'],
          properties:{ category:{type:'string'}, items:{type:'array', items:{type:'string'}} }
        }
      },
      days: { type:'array', items:{type:'string'}, minItems: 7 }
    }
  },
  skincare: {
    type: 'object',
    required: ['meta','days30'],
    properties: {
      meta: {
        type: 'object',
        required: ['title','duration','type','difficulty'],
        properties: {
          title:{type:'string'}, duration:{type:'string'}, type:{type:'string'}, difficulty:{type:'string'}
        }
      },
      days30: { type:'array', items:{type:'integer'}, minItems: 30 }
    }
  },
  fitness: {
    type: 'object',
    required: ['meta','weeks','structure','logs'],
    properties: {
      meta: {
        type: 'object',
        required: ['title','duration','type','difficulty'],
        properties: {
          title:{type:'string'}, duration:{type:'string'}, type:{type:'string'}, difficulty:{type:'string'}
        }
      },
      weeks: {
        type: 'array', minItems: 4,
        items: {
          type:'object',
          required:['focus','days'],
          properties:{
            focus:{type:'string'},
            days:{
              type:'array', minItems: 7,
              items:{
                type:'object',
                required:['name','workout','sets_reps'],
                properties:{ name:{type:'string'}, workout:{type:'string'}, sets_reps:{type:'string'}, notes:{type:'string'} }
              }
            }
          }
        }
      },
      structure: {
        type: 'object',
        required: ['warmup','main','cooldown'],
        properties: {
          warmup:{type:'array', items:{type:'string'}},
          main:{type:'array', items:{type:'string'}},
          cooldown:{type:'array', items:{type:'string'}}
        }
      },
      logs: {
        type: 'object',
        required: ['strength','endurance','flexibility'],
        properties: {
          strength:{type:'array', items:{type:'string'}},
          endurance:{type:'array', items:{type:'string'}},
          flexibility:{type:'array', items:{type:'string'}}
        }
      }
    }
  },
  recovery: {
    type: 'object',
    required: ['meta','blocks','habits'],
    properties: {
      meta: {
        type: 'object',
        required: ['title','duration','type','difficulty'],
        properties: {
          title:{type:'string'}, duration:{type:'string'}, type:{type:'string'}, difficulty:{type:'string'}
        }
      },
      blocks: {
        type:'object',
        required:['morning','midday','evening'],
        properties: {
          morning:{type:'array', items:{type:'string'}},
          midday:{type:'array', items:{type:'string'}},
          evening:{type:'array', items:{type:'string'}}
        }
      },
      habits: { type:'array', items:{type:'string'} }
    }
  },
  wellness: {
    type: 'object',
    required: ['meta','morning_ritual','days','weekly_challenges','affirmations'],
    properties: {
      meta: {
        type: 'object',
        required: ['title','duration','type','difficulty'],
        properties: {
          title:{type:'string'}, duration:{type:'string'}, type:{type:'string'}, difficulty:{type:'string'}
        }
      },
      morning_ritual:{ type:'array', items:{type:'string'} },
      days:{ type:'array', items:{type:'string'} },
      weekly_challenges:{
        type:'array',
        items:{
          type:'object',
          required:['title','steps'],
          properties:{ title:{type:'string'}, steps:{type:'array', items:{type:'string'}} }
        }
      },
      affirmations:{ type:'array', items:{type:'string'} }
    }
  }
};

const EXAMPLES = {
  diet: {
    meta:{ title:"30-Day Nutrition Reset", duration:"30 days", type:"Diet Plan", difficulty:"Easy" },
    weekly_plan:[
      {day:"Mon", breakfast:"Oats + berries", lunch:"Quinoa bowl", dinner:"Salmon + greens", snacks:["Apple","Almonds"]},
      {day:"Tue", breakfast:"Greek yogurt", lunch:"Lentil soup", dinner:"Chicken + veg", snacks:["Carrots","Hummus"]},
      {day:"Wed", breakfast:"Smoothie", lunch:"Chickpea salad", dinner:"Tofu stir-fry", snacks:["Banana","Walnuts"]},
      {day:"Thu", breakfast:"Eggs + spinach", lunch:"Turkey wrap", dinner:"Beef + broccoli", snacks:["Orange","Pumpkin seeds"]},
      {day:"Fri", breakfast:"Overnight oats", lunch:"Sardines + toast", dinner:"Pasta + veg", snacks:["Pear","Yogurt"]},
      {day:"Sat", breakfast:"Pancakes (oat)", lunch:"Buddha bowl", dinner:"Shrimp rice", snacks:["Dates","Cashews"]},
      {day:"Sun", breakfast:"Chia pudding", lunch:"Soup + salad", dinner:"Roast veg + beans", snacks:["Berries","Dark choc"]}
    ],
    shopping_list:[
      {category:"Proteins",items:["Chicken","Tofu","Eggs","Greek yogurt","Salmon"]},
      {category:"Carbs",items:["Oats","Rice","Quinoa","Wholegrain pasta","Bread"]},
      {category:"Produce",items:["Spinach","Broccoli","Berries","Banana","Avocado"]}
    ],
    days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  },
  skincare: { meta:{ title:"30-Day Skin Health Plan", duration:"30 days", type:"Skin Care", difficulty:"Easy" }, days30: Array.from({length:30},(_,i)=>i+1) },
  fitness: {
    meta:{ title:"1-Month Strength & Energy Program", duration:"4 weeks", type:"Fitness Plan", difficulty:"Moderate" },
    weeks:[
      { focus:"Foundation", days:[
        {name:"Mon", workout:"Full-Body A", sets_reps:"3×10", notes:"Light load"},
        {name:"Tue", workout:"Mobility + Walk", sets_reps:"—"},
        {name:"Wed", workout:"Full-Body B", sets_reps:"3×8"},
        {name:"Thu", workout:"Restorative", sets_reps:"—"},
        {name:"Fri", workout:"Full-Body A", sets_reps:"4×8", notes:"Add load"},
        {name:"Sat", workout:"Cardio Intervals", sets_reps:"8×1min", notes:"RPE 7"},
        {name:"Sun", workout:"Rest", sets_reps:"—", notes:"Recovery"}
      ]}
    ],
    structure:{ warmup:["5–8 min easy cardio","Dynamic mobility","Activation"], main:["Compounds","Accessory circuits","Conditioning"], cooldown:["Breathing","Light stretch","Notes"] },
    logs:{ strength:["Squat","Bench Press","Deadlift","Overhead Press"], endurance:["1-mile time","Row 2k","Bike 10 min dist"], flexibility:["Toe touch","Hip flexor lunge","Shoulder reach"] }
  },
  recovery: {
    meta:{ title:"30-Day Recovery & Balance Plan", duration:"30 days", type:"Recovery", difficulty:"Easy" },
    blocks:{
      morning:["Hydration + mobility","Sunlight exposure (5–10 min)","Breathing reset (2 min)"],
      midday:["Posture check + walk (10 min)","Hip/Thoracic mobility (8 min)","Mindfulness (3 min)"],
      evening:["Screen dim + stretch (10 min)","Sleep routine setup","Gratitude journal (3 lines)"]
    },
    habits:["8+ cups water","10k steps","No caffeine after 2pm","Bedtime routine","5-min breathwork"]
  },
  wellness: {
    meta:{ title:"30-Day Wellness Blueprint", duration:"30 days", type:"Wellness", difficulty:"Easy" },
    morning_ritual:["Hydration","Mindfulness (5 min)","Journaling (3 lines)","Movement (10 min)","Gratitude"],
    days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    weekly_challenges:[
      {title:"Week 1 — Gratitude", steps:["Write 3 things daily","Share 1 with a friend","Reflect on impact"]},
      {title:"Week 2 — Sleep Hygiene", steps:["No screens 1h before bed","Consistent bedtime","Cool, dark room"]},
      {title:"Week 3 — Movement Snacks", steps:["3×5 min mobility","Stand each hour","Walk after meals"]},
      {title:"Week 4 — Digital Boundaries", steps:["Mute non-essential notifs","Social media window","One offline hour/day"]}
    ],
    affirmations:["I am consistent.","Small steps compound.","My choices support my health.","I create my energy."]
  }
};

function buildPrompt(type, audience, tone) {
  const schema = JSON.stringify(SCHEMAS[type], null, 2);
  const example = JSON.stringify(EXAMPLES[type], null, 2);
  return `You are PlantRx's PDF Content Generator.
Goal: Return JSON ONLY (no markdown fences, no prose) that strictly matches the JSON Schema below for a ${type} plan.
Audience: ${audience}. Tone: ${tone}, friendly, simple language, no jargon, no images.
- Keep it practical and actionable with checklists and weekly/day layouts.
- Title must be consumer-friendly and motivating.
- Do NOT add any fields not in the schema.
- Ensure arrays meet minItems requirements (e.g., 7 days, 4 weeks, 30 days).

JSON SCHEMA (use exactly these keys):
${schema}

FORMAT RULES:
- Output must be valid JSON (UTF-8), nothing else.
- Keep text concise and clear.

EXAMPLE (style guide only; adapt content):
${example}
`;
}

function extractJSON(text){
  // Try raw parse first
  try { return JSON.parse(text); } catch(e){}
  // Try to find first {...} block
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.slice(start, end+1);
    try { return JSON.parse(candidate); } catch(e){}
  }
  throw new Error('Could not parse JSON from model output');
}

async function askOpenAI(prompt){
  const apiKey = process.env.OPENAI_API_KEY;
  if(!apiKey) throw new Error('Missing OPENAI_API_KEY');
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini', // Using gpt-4o-mini as it supports temperature parameter
    messages: [
      { role: 'system', content: 'Return ONLY valid JSON. No code fences. No extra text.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3
  });
  return res.choices[0].message.content;
}

async function askGemini(prompt){
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if(!apiKey) throw new Error('Missing GOOGLE_API_KEY or GEMINI_API_KEY');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const res = await model.generateContent(prompt);
  return res.response.text();
}

async function main(){
  const prompt = buildPrompt(argv.type, argv.audience, argv.tone);

  let provider = argv.provider;
  if (provider === 'auto') {
    provider = process.env.OPENAI_API_KEY ? 'openai' : (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY ? 'gemini' : 'openai');
  }

  let raw;
  if (provider === 'openai') raw = await askOpenAI(prompt);
  else raw = await askGemini(prompt);

  let obj = extractJSON(raw);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(SCHEMAS[argv.type]);
  const ok = validate(obj);
  if (!ok) {
    console.error('❌ Validation errors:', validate.errors);
    throw new Error('Model output failed schema validation. Try again or switch provider.');
  }

  // Ensure meta fields are set properly
  obj.meta = obj.meta || {};
  obj.meta.type = obj.meta.type || (argv.type.charAt(0).toUpperCase() + argv.type.slice(1));
  obj.meta.duration = obj.meta.duration || (argv.type === 'fitness' ? '4 weeks' : '30 days');
  obj.meta.difficulty = obj.meta.difficulty || 'Easy';

  const outPath = argv.out;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`✅ JSON saved: ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});