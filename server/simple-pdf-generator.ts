import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI services with proper error handling
let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.error('AI initialization failed:', error);
}

interface PlanRequest {
  type: string;
  userInfo: {
    name: string;
    goal: string;
    level: string;
    duration: string;
  };
  answers: any;
}

export async function generateRichPDFContent(request: PlanRequest): Promise<string> {
  const { type, userInfo } = request;
  
  try {
    // Generate content with AI
    const aiContent = await generateAIContent(type, userInfo);
    
    // Create comprehensive HTML
    const html = createComprehensivePDF(type, userInfo, aiContent);
    return html;
    
  } catch (error) {
    console.error('AI PDF generation failed:', error);
    // Return fallback comprehensive content
    return createFallbackPDF(type, userInfo);
  }
}

async function generateAIContent(type: string, userInfo: any): Promise<any> {
  let openaiContent = {};
  let geminiContent = {};
  
  // Try OpenAI first
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert ${type} coach. Create detailed, personalized plans with specific recommendations, schedules, and tracking tools.`
          },
          {
            role: "user",
            content: `Create a comprehensive ${type} plan for ${userInfo.name}. 
            Goal: ${userInfo.goal}
            Level: ${userInfo.level}
            Duration: ${userInfo.duration}
            
            Include: weekly schedule, daily activities, tracking methods, tips, and resources.
            Format as JSON with keys: overview, weekly_plan, daily_activities, tips, resources`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000
      });
      
      openaiContent = JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('OpenAI generation failed:', error);
    }
  }
  
  // Try Gemini for additional content
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`Create additional ${type} content:
      - Shopping/equipment lists
      - Troubleshooting tips
      - Success strategies
      - Progress milestones
      Format as JSON with keys: shopping, troubleshooting, strategies, milestones`);
      
      const text = result.response.text();
      geminiContent = JSON.parse(text);
    } catch (error) {
      console.error('Gemini generation failed:', error);
    }
  }
  
  return { openai: openaiContent, gemini: geminiContent };
}

function createComprehensivePDF(type: string, userInfo: any, aiContent: any): string {
  const today = new Date().toLocaleDateString();
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your ${type.charAt(0).toUpperCase() + type.slice(1)} Plan</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0;
      font-size: 12px;
    }
    
    .header { 
      background: linear-gradient(135deg, #16a34a, #22c55e); 
      color: white; 
      padding: 25px; 
      text-align: center; 
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header .subtitle { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
    
    .page-break { page-break-before: always; }
    
    .section { 
      margin-bottom: 25px; 
      padding: 15px; 
      border: 1px solid #e5e7eb; 
      border-radius: 6px;
      background: #fafafa;
    }
    
    .section h2 { 
      color: #16a34a; 
      margin: 0 0 15px 0; 
      font-size: 20px;
      border-bottom: 2px solid #16a34a;
      padding-bottom: 5px;
    }
    
    .section h3 { 
      color: #059669; 
      margin: 15px 0 10px 0; 
      font-size: 16px;
    }
    
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 15px; 
      margin: 15px 0; 
    }
    
    .card { 
      border: 1px solid #d1d5db; 
      border-radius: 6px; 
      padding: 15px; 
      background: white;
    }
    .card h4 { margin: 0 0 10px 0; color: #16a34a; font-size: 14px; font-weight: bold; }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0; 
      background: white;
      font-size: 11px;
    }
    th, td { 
      border: 1px solid #d1d5db; 
      padding: 8px; 
      text-align: left; 
    }
    th { 
      background: #16a34a; 
      color: white; 
      font-weight: bold;
      font-size: 10px;
    }
    tr:nth-child(even) { background: #f9fafb; }
    
    ul, ol { padding-left: 18px; }
    li { margin: 5px 0; font-size: 11px; }
    
    .highlight { 
      background: #fef3c7; 
      border-left: 4px solid #f59e0b; 
      padding: 12px; 
      margin: 15px 0;
      border-radius: 4px;
    }
    
    .footer { 
      margin-top: 30px; 
      padding: 15px; 
      background: #f3f4f6; 
      text-align: center; 
      font-size: 10px; 
      color: #6b7280;
      border-radius: 6px;
    }
    
    .page-info {
      text-align: center;
      color: #666;
      font-size: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <!-- Page 1: Header & Overview -->
  <div class="header">
    <h1>Your Personalized ${type.charAt(0).toUpperCase() + type.slice(1)} Plan</h1>
    <div class="subtitle">Created for ${userInfo.name} • ${userInfo.duration} Program</div>
    <div class="subtitle">Goal: ${userInfo.goal} • Level: ${userInfo.level} • Generated: ${today}</div>
    <div class="subtitle">PlantRx - Your Health Journey Partner</div>
  </div>

  <div class="section">
    <h2>🎯 Your Journey Overview</h2>
    <div class="highlight">
      <p><strong>Welcome ${userInfo.name}!</strong> This comprehensive ${type} plan has been crafted specifically for your goals and experience level.</p>
      <p><strong>Your Goal:</strong> ${userInfo.goal}</p>
      <p><strong>Plan Duration:</strong> ${userInfo.duration}</p>
      <p><strong>Experience Level:</strong> ${userInfo.level}</p>
    </div>
    
    <h3>What You'll Achieve</h3>
    ${generateAchievements(type, aiContent)}
  </div>

  <div class="page-info">Page 1 of 5+</div>
  <div class="page-break"></div>

  <!-- Page 2: Weekly Schedule -->
  <div class="section">
    <h2>📅 Your ${userInfo.duration} Schedule</h2>
    ${generateWeeklySchedule(type, userInfo, aiContent)}
  </div>

  <div class="page-info">Page 2 of 5+</div>
  <div class="page-break"></div>

  <!-- Page 3: Daily Activities & Tracking -->
  <div class="section">
    <h2>📊 Daily Activities & Tracking</h2>
    ${generateDailyTracking(type, aiContent)}
  </div>

  <div class="page-info">Page 3 of 5+</div>
  <div class="page-break"></div>

  <!-- Page 4: Resources & Tips -->
  <div class="section">
    <h2>🛠️ Resources & Success Tips</h2>
    ${generateResources(type, aiContent)}
  </div>

  <div class="page-info">Page 4 of 5+</div>
  <div class="page-break"></div>

  <!-- Page 5: Progress & Reflection -->
  <div class="section">
    <h2>📝 Progress Tracking & Reflection</h2>
    ${generateProgressTracking(type, userInfo)}
  </div>

  <div class="section">
    <h2>🏆 Milestones & Celebrations</h2>
    ${generateMilestones(type, aiContent)}
  </div>

  <div class="footer">
    <p><strong>PlantRx App - Your Personalized Health Journey</strong></p>
    <p>This plan is for educational purposes only. Consult healthcare professionals for medical advice.</p>
    <p>© ${new Date().getFullYear()} PlantRx • plantrxapp.com</p>
  </div>

  <div class="page-info">Page 5+ of 5+ • Complete Guide</div>
</body>
</html>`;
}

function generateAchievements(type: string, aiContent: any): string {
  const defaultAchievements = {
    diet: ["Improved energy levels", "Better digestion", "Healthy weight management", "Enhanced nutrient intake"],
    fitness: ["Increased strength", "Better endurance", "Improved flexibility", "Enhanced muscle tone"],
    wellness: ["Reduced stress", "Better sleep quality", "Increased mindfulness", "Enhanced emotional balance"],
    skincare: ["Clearer complexion", "Improved skin texture", "Better hydration", "Reduced signs of aging"],
    recovery: ["Faster healing", "Better sleep", "Reduced inflammation", "Enhanced energy"]
  };

  const achievements = aiContent?.openai?.overview || defaultAchievements[type as keyof typeof defaultAchievements] || defaultAchievements.wellness;
  
  return `
    <div class="grid">
      ${achievements.map((achievement: string) => `
        <div class="card">
          <h4>✓ ${achievement}</h4>
        </div>
      `).join('')}
    </div>
  `;
}

function generateWeeklySchedule(type: string, userInfo: any, aiContent: any): string {
  const schedule = aiContent?.openai?.weekly_plan || getDefaultSchedule(type);
  
  return `
    <h3>Weekly Structure</h3>
    <table>
      <thead>
        <tr><th>Week</th><th>Focus Area</th><th>Key Activities</th><th>Goals</th></tr>
      </thead>
      <tbody>
        ${schedule.map((week: any, index: number) => `
          <tr>
            <td><strong>Week ${index + 1}</strong></td>
            <td>${week.focus || `Phase ${index + 1}`}</td>
            <td>${Array.isArray(week.activities) ? week.activities.join(', ') : 'Daily practice and consistency'}</td>
            <td>${week.goal || 'Progress and improvement'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <h3>Daily Structure Template</h3>
    <table>
      <thead>
        <tr><th>Time</th><th>Activity</th><th>Duration</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>Morning</td><td>Primary ${type} activity</td><td>30-45 min</td><td>Peak energy time</td></tr>
        <tr><td>Midday</td><td>Progress check-in</td><td>5-10 min</td><td>Track and adjust</td></tr>
        <tr><td>Evening</td><td>Reflection & planning</td><td>10-15 min</td><td>Prepare for tomorrow</td></tr>
      </tbody>
    </table>
  `;
}

function generateDailyTracking(type: string, aiContent: any): string {
  const activities = aiContent?.openai?.daily_activities || getDefaultActivities(type);
  
  return `
    <h3>Weekly Progress Tracker</h3>
    <table>
      <thead>
        <tr><th>Day</th><th>Completed</th><th>Energy (1-10)</th><th>Satisfaction (1-10)</th><th>Notes</th></tr>
      </thead>
      <tbody>
        ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => `
          <tr>
            <td>${day}</td>
            <td>☐</td>
            <td>_____</td>
            <td>_____</td>
            <td>________________________________</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3>Daily Habit Tracker</h3>
    <div class="grid">
      ${activities.map((activity: string) => `
        <div class="card">
          <h4>${activity}</h4>
          <p>☐ ☐ ☐ ☐ ☐ ☐ ☐</p>
          <small>Track daily completion</small>
        </div>
      `).join('')}
    </div>
  `;
}

function generateResources(type: string, aiContent: any): string {
  const tips = aiContent?.openai?.tips || getDefaultTips(type);
  const resources = aiContent?.gemini?.shopping || getDefaultResources(type);
  
  return `
    <h3>Essential Resources</h3>
    <div class="grid">
      ${resources.map((resource: string) => `
        <div class="card">
          <h4>• ${resource}</h4>
        </div>
      `).join('')}
    </div>
    
    <h3>Success Tips</h3>
    <ul>
      ${tips.map((tip: string) => `<li>${tip}</li>`).join('')}
    </ul>
    
    <div class="highlight">
      <h3>Troubleshooting Common Challenges</h3>
      ${(aiContent?.gemini?.troubleshooting || getDefaultTroubleshooting(type)).map((item: string) => `
        <p><strong>•</strong> ${item}</p>
      `).join('')}
    </div>
  `;
}

function generateProgressTracking(type: string, userInfo: any): string {
  return `
    <h3>Weekly Reflection Questions</h3>
    <table>
      <thead>
        <tr><th>Question</th><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th></tr>
      </thead>
      <tbody>
        <tr><td>How did I feel this week?</td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td></tr>
        <tr><td>What worked well?</td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td></tr>
        <tr><td>What was challenging?</td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td></tr>
        <tr><td>Rate progress (1-10)</td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td><td style="height: 40px;"></td></tr>
      </tbody>
    </table>
    
    <h3>Monthly Goal Assessment</h3>
    <div class="grid">
      <div class="card">
        <h4>Achievements This Month</h4>
        <ol>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
        </ol>
      </div>
      <div class="card">
        <h4>Areas for Improvement</h4>
        <ol>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
          <li style="height: 25px; border-bottom: 1px dashed #ccc;"></li>
        </ol>
      </div>
    </div>
  `;
}

function generateMilestones(type: string, aiContent: any): string {
  const milestones = aiContent?.gemini?.milestones || getDefaultMilestones(type);
  
  return `
    <h3>Achievement Milestones</h3>
    <table>
      <thead>
        <tr><th>Milestone</th><th>Target Date</th><th>Achieved</th><th>Notes</th></tr>
      </thead>
      <tbody>
        ${milestones.map((milestone: string) => `
          <tr>
            <td>${milestone}</td>
            <td>___________</td>
            <td>☐</td>
            <td>_________________________</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="highlight">
      <h3>Celebration Ideas</h3>
      <p>Reward yourself when you hit these milestones:</p>
      <ul>
        <li>Week 1 completion: Treat yourself to something special</li>
        <li>Halfway point: Share your progress with a friend</li>
        <li>Final goal: Plan a celebration that aligns with your new lifestyle</li>
      </ul>
    </div>
  `;
}

// Default content functions
function getDefaultSchedule(type: string) {
  return [
    { focus: "Foundation Building", activities: ["Basic habits", "Routine establishment"], goal: "Consistency" },
    { focus: "Skill Development", activities: ["Technique improvement", "Knowledge building"], goal: "Competence" },
    { focus: "Optimization", activities: ["Fine-tuning", "Advanced practices"], goal: "Excellence" },
    { focus: "Mastery & Maintenance", activities: ["Long-term planning", "Habit reinforcement"], goal: "Sustainability" }
  ];
}

function getDefaultActivities(type: string) {
  const activities = {
    diet: ["Meal preparation", "Water intake", "Portion control", "Mindful eating", "Nutrient tracking"],
    fitness: ["Workout completion", "Stretching", "Step count", "Rest day", "Progress photos"],
    wellness: ["Meditation", "Gratitude journal", "Sleep hygiene", "Stress management", "Mindful moments"],
    skincare: ["Morning routine", "Evening routine", "Sun protection", "Hydration", "Product application"],
    recovery: ["Rest periods", "Gentle movement", "Stress reduction", "Sleep quality", "Nutrition support"]
  };
  return activities[type as keyof typeof activities] || activities.wellness;
}

function getDefaultTips(type: string) {
  return [
    "Start small and build consistency over time",
    "Track your progress daily to stay motivated",
    "Celebrate small wins along the way",
    "Adjust the plan based on your needs and feedback",
    "Be patient and kind to yourself during the process",
    "Focus on progress, not perfection"
  ];
}

function getDefaultResources(type: string) {
  const resources = {
    diet: ["Fresh fruits and vegetables", "Lean proteins", "Whole grains", "Healthy fats", "Meal prep containers"],
    fitness: ["Comfortable workout clothes", "Water bottle", "Exercise mat", "Resistance bands", "Supportive shoes"],
    wellness: ["Meditation app", "Journal", "Essential oils", "Comfortable space", "Timer"],
    skincare: ["Gentle cleanser", "Moisturizer", "Sunscreen", "Clean towels", "Products for your skin type"],
    recovery: ["Comfortable clothing", "Supportive pillow", "Relaxation tools", "Healthy snacks", "Recovery supplements"]
  };
  return resources[type as keyof typeof resources] || resources.wellness;
}

function getDefaultTroubleshooting(type: string) {
  return [
    "Low motivation: Review your goals and start with smaller steps",
    "Time constraints: Break activities into 10-15 minute segments",
    "Plateau: Gradually increase intensity or try new variations",
    "Setbacks: Remember they're normal - focus on getting back on track"
  ];
}

function getDefaultMilestones(type: string) {
  return [
    "Complete first week consistently",
    "Reach halfway point of program",
    "Notice first improvements",
    "Complete full program duration",
    "Maintain habits for one month post-program"
  ];
}

function createFallbackPDF(type: string, userInfo: any): string {
  return createComprehensivePDF(type, userInfo, {});
}