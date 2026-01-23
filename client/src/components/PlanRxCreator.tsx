import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { navigateTo } from "@/utils/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generatePersonalizedContent, type PersonalizedContent } from '@/utils/aiContentGenerator';
import { generateAIPoweredPDF } from './SimplePDFGenerator';
import { requireAuthForAction } from '@/lib/authGate';
import { UpgradeInterstitial } from '@/components/FeatureLock';
import { Feature } from '@shared/subscriptionFeatures';
import { 
  Heart, 
  Dumbbell, 
  Apple, 
  Sparkles, 
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Download,
  Zap,
  Target,
  Calendar,
  Clock,
  X,
  FileText,
  Star,
  User,
  Leaf,
  Crown,
  Award,
  Shield
} from "lucide-react";

// Plan Types
const PLAN_TYPES = [
  {
    id: "diet",
    name: "Custom Diet Plans",
    description: "Personalized nutrition for your goals",
    icon: Apple,
    color: "from-green-500 to-emerald-600",
    examples: ["Weight Loss", "Muscle Building"],
    features: [
      "Personalized meal plans",
      "Detailed shopping lists",
      "Nutrition tips & guidance",
      "Progress tracking tools"
    ]
  },
  {
    id: "workout",
    name: "Fitness Routines",
    description: "Workouts tailored to your lifestyle",
    icon: Dumbbell,
    color: "from-blue-500 to-cyan-600",
    examples: ["Home Workouts", "Gym Plans"],
    features: [
      "Custom workout schedules",
      "Exercise demonstrations",
      "Progressive training plans",
      "Recovery & rest guidance"
    ]
  },
  {
    id: "skincare",
    name: "Skin Care Routines",
    description: "Natural skincare for radiant health",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    examples: ["Acne Treatment", "Anti-Aging"],
    features: [
      "Morning & evening routines",
      "Product recommendations",
      "Natural ingredient guides",
      "Skin progress tracking"
    ]
  },
  {
    id: "wellness",
    name: "Wellness Plans",
    description: "Holistic health optimization",
    icon: Heart,
    color: "from-purple-500 to-violet-600",
    examples: ["Sleep Improvement", "Stress Relief"],
    features: [
      "Daily wellness practices",
      "Mindfulness exercises",
      "Lifestyle recommendations",
      "Mental health support"
    ]
  },
  {
    id: "healing",
    name: "Recovery Plans",
    description: "Targeted healing & recovery",
    icon: Brain,
    color: "from-orange-500 to-amber-600",
    examples: ["Injury Recovery", "Immune Support"],
    features: [
      "Recovery techniques",
      "Therapeutic exercises",
      "Natural healing methods",
      "Progress monitoring"
    ]
  }
];

// Question Sets for Each Plan Type - Enhanced with engaging questions
const QUESTION_SETS = {
  diet: [
    {
      id: "goal",
      question: "Let's start with your nutrition goals! What would you most like to achieve?",
      subtitle: "This helps us customize your meal plans perfectly",
      options: [
        "Lose weight and feel lighter",
        "Build muscle and get stronger", 
        "Boost my daily energy levels",
        "Improve digestion and gut health",
        "Eat healthier overall"
      ]
    },
    {
      id: "current_eating",
      question: "How would you describe your current eating habits?",
      subtitle: "Be honest - there's no judgment here!",
      options: [
        "I eat pretty healthy most days",
        "I try but often fall off track",
        "I skip meals and snack a lot",
        "I eat out or order takeout often",
        "I want to completely overhaul my diet"
      ]
    },
    {
      id: "foods_avoid",
      question: "Are there any foods you need to avoid or simply don't like?",
      subtitle: "We'll make sure to exclude these from your plan",
      options: [
        "No restrictions - I eat everything!",
        "Dairy products (milk, cheese, yogurt)",
        "Gluten and wheat products",
        "Meat and poultry",
        "Seafood and fish",
        "Nuts and seeds",
        "I have multiple dietary restrictions"
      ]
    },
    {
      id: "cooking_skill",
      question: "How confident are you in the kitchen?",
      subtitle: "We'll match recipes to your skill level",
      options: [
        "Complete beginner - keep it super simple!",
        "I can follow basic recipes",
        "Comfortable cooking most dishes",
        "I love cooking and trying new things"
      ]
    },
    {
      id: "time_available",
      question: "How much time can you realistically spend on meal prep each day?",
      subtitle: "Includes cooking, prepping, and cleanup",
      options: [
        "15 minutes or less - I need quick options",
        "15-30 minutes - moderate time",
        "30-60 minutes - I can invest more time",
        "1+ hours - I enjoy meal prepping"
      ]
    },
    {
      id: "meals_per_day",
      question: "How many meals do you typically eat per day?",
      subtitle: "This helps structure your plan",
      options: [
        "2 meals (I often skip breakfast)",
        "3 main meals",
        "3 meals + 1-2 snacks",
        "I graze throughout the day"
      ]
    },
    {
      id: "budget",
      question: "What's your grocery budget looking like?",
      subtitle: "We'll suggest ingredients that fit your budget",
      options: [
        "Budget-conscious - affordable meals please",
        "Moderate - balanced cost and quality",
        "Flexible - quality ingredients matter most"
      ]
    },
    {
      id: "duration",
      question: "How long would you like this diet plan to be?",
      subtitle: "Longer plans include more variety and progression",
      options: [
        "1 week - Quick start program",
        "1 month - Solid foundation plan",
        "3 months - Complete transformation"
      ]
    }
  ],
  workout: [
    {
      id: "goal",
      question: "What's driving your fitness journey right now?",
      subtitle: "Your goal shapes every workout in your plan",
      options: [
        "Burn fat and get lean",
        "Build strength and muscle",
        "Improve stamina and endurance",
        "Increase flexibility and mobility",
        "Feel stronger and more confident"
      ]
    },
    {
      id: "fitness_level",
      question: "How would you describe your current fitness level?",
      subtitle: "Be honest so we can start you at the right intensity",
      options: [
        "Beginner - New to exercise or returning after a long break",
        "Intermediate - I exercise regularly but want to level up",
        "Advanced - I train consistently and want a challenge"
      ]
    },
    {
      id: "location",
      question: "Where will you be working out most often?",
      subtitle: "We'll design workouts for your environment",
      options: [
        "At home - no gym access",
        "At the gym - full equipment available",
        "Outdoors - parks, trails, fresh air",
        "Mix of locations - variety is key"
      ]
    },
    {
      id: "equipment",
      question: "What equipment do you have access to?",
      subtitle: "We'll work with whatever you've got",
      options: [
        "Just my body - no equipment",
        "Basics - dumbbells, resistance bands, mat",
        "Full gym - machines, barbells, everything"
      ]
    },
    {
      id: "time_available",
      question: "How much time can you dedicate to each workout?",
      subtitle: "Quality matters more than quantity",
      options: [
        "15-20 minutes - quick and efficient",
        "30-40 minutes - solid session",
        "45-60 minutes - full training",
        "60+ minutes - I want comprehensive sessions"
      ]
    },
    {
      id: "days_per_week",
      question: "How many days per week can you commit to training?",
      subtitle: "Consistency beats intensity every time",
      options: [
        "2-3 days - fitting it in where I can",
        "4-5 days - dedicated training schedule",
        "6-7 days - I want to train almost daily"
      ]
    },
    {
      id: "focus_areas",
      question: "Any specific areas you want to focus on?",
      subtitle: "We can emphasize certain body parts",
      options: [
        "Full body - balanced development",
        "Upper body - arms, chest, back, shoulders",
        "Lower body - legs, glutes, hips",
        "Core - abs and midsection",
        "Functional fitness - overall athleticism"
      ]
    },
    {
      id: "duration",
      question: "How long should your fitness program be?",
      subtitle: "Longer programs include progressive overload",
      options: [
        "1 week - Kickstart program",
        "1 month - Build solid habits",
        "3 months - Complete transformation"
      ]
    }
  ],
  skincare: [
    {
      id: "goal",
      question: "What's your #1 skin goal right now?",
      subtitle: "We'll focus your routine on achieving this",
      options: [
        "Clear up acne and breakouts",
        "Reduce signs of aging",
        "Get deep hydration for dry skin",
        "Achieve a natural healthy glow",
        "Even out skin tone"
      ]
    },
    {
      id: "skin_type",
      question: "How would you describe your skin type?",
      subtitle: "This determines product and ingredient recommendations",
      options: [
        "Oily - shiny, prone to breakouts",
        "Dry - tight, flaky, sometimes irritated",
        "Combination - oily T-zone, dry cheeks",
        "Sensitive - reacts easily to products",
        "Normal - balanced, few issues"
      ]
    },
    {
      id: "current_routine",
      question: "What does your current skincare routine look like?",
      subtitle: "We'll build on what you're already doing",
      options: [
        "I barely do anything - just water and moisturizer",
        "Basic routine - cleanser and moisturizer",
        "Moderate - I use a few products regularly",
        "Extensive - I have a full multi-step routine"
      ]
    },
    {
      id: "approach",
      question: "What type of skincare approach appeals to you most?",
      subtitle: "We'll match products to your preferences",
      options: [
        "All-natural - DIY remedies and organic products",
        "Science-backed - active ingredients that work",
        "Balanced mix of natural and clinical",
        "Budget-friendly - effective but affordable"
      ]
    },
    {
      id: "time_available",
      question: "How much time can you spend on skincare daily?",
      subtitle: "We'll design a routine that fits your lifestyle",
      options: [
        "5 minutes max - quick and simple",
        "10-15 minutes - moderate commitment",
        "20-30 minutes - I enjoy my routine",
        "30+ minutes - skincare is self-care time"
      ]
    },
    {
      id: "concerns",
      question: "Any specific skin concerns we should address?",
      subtitle: "We'll incorporate targeted treatments",
      options: [
        "No specific concerns",
        "Dark spots or hyperpigmentation",
        "Large pores",
        "Fine lines and wrinkles",
        "Redness or rosacea",
        "Acne scars"
      ]
    },
    {
      id: "lifestyle",
      question: "Any lifestyle factors affecting your skin?",
      subtitle: "These influence our recommendations",
      options: [
        "Stress and poor sleep",
        "Lots of sun exposure",
        "Pollution and urban environment",
        "Diet could be better",
        "None that I'm aware of"
      ]
    },
    {
      id: "duration",
      question: "How long should your skincare program be?",
      subtitle: "Skin transformation takes time - be patient!",
      options: [
        "1 week - Quick refresh routine",
        "1 month - See real improvements",
        "3 months - Complete skin transformation"
      ]
    }
  ],
  wellness: [
    {
      id: "goal",
      question: "What would make the biggest difference in your life right now?",
      subtitle: "Your wellness journey starts with intention",
      options: [
        "Sleep better and wake up refreshed",
        "Have more energy throughout the day",
        "Reduce stress and feel calmer",
        "Find better work-life balance",
        "Feel happier and more positive"
      ]
    },
    {
      id: "biggest_challenge",
      question: "What's your biggest wellness challenge currently?",
      subtitle: "We'll tackle this head-on in your plan",
      options: [
        "I can't seem to sleep well",
        "I feel exhausted all the time",
        "Stress and anxiety are overwhelming",
        "I've lost motivation and joy",
        "I can't stick to healthy habits"
      ]
    },
    {
      id: "stress_style",
      question: "How do you prefer to unwind and destress?",
      subtitle: "We'll include practices that resonate with you",
      options: [
        "Quiet meditation and breathing",
        "Movement - walking, yoga, stretching",
        "Creative outlets - journaling, art, music",
        "Nature and fresh air",
        "I'm open to trying new methods"
      ]
    },
    {
      id: "morning_routine",
      question: "What's your morning like right now?",
      subtitle: "Morning habits set the tone for your day",
      options: [
        "Rushed - I hit snooze and scramble",
        "Basic - I get ready but no real routine",
        "Decent - I have some good habits",
        "I'd love to create a morning ritual"
      ]
    },
    {
      id: "sleep_quality",
      question: "How would you rate your sleep quality?",
      subtitle: "Sleep is the foundation of wellness",
      options: [
        "Terrible - I struggle to fall or stay asleep",
        "Poor - I wake up tired most days",
        "Okay - some good nights, some bad",
        "Good - I generally sleep well"
      ]
    },
    {
      id: "time_for_self",
      question: "How much time can you dedicate to self-care daily?",
      subtitle: "Even 10 minutes makes a difference",
      options: [
        "10-15 minutes",
        "20-30 minutes",
        "30-60 minutes",
        "I can commit to longer practices"
      ]
    },
    {
      id: "support_needed",
      question: "What kind of support would help you most?",
      subtitle: "We'll emphasize these in your plan",
      options: [
        "Step-by-step daily guidance",
        "Mindfulness and meditation practices",
        "Journaling prompts and reflection",
        "Nutrition and lifestyle tips",
        "All of the above"
      ]
    },
    {
      id: "duration",
      question: "How long should your wellness program be?",
      subtitle: "Lasting change happens gradually",
      options: [
        "1 week - Reset and recharge",
        "1 month - Build lasting habits",
        "3 months - Deep transformation"
      ]
    }
  ],
  healing: [
    {
      id: "recovery_type",
      question: "What kind of healing or recovery do you need most right now?",
      subtitle: "We'll tailor your plan to address this specifically",
      options: [
        "Physical injury or pain recovery",
        "Chronic fatigue and exhaustion",
        "Muscle tension and soreness",
        "Mental burnout and overwhelm",
        "General restoration and rejuvenation"
      ]
    },
    {
      id: "current_state",
      question: "How are you feeling overall right now?",
      subtitle: "Be honest about where you're starting from",
      options: [
        "Really struggling - need gentle support",
        "Running on empty but managing",
        "Could be better but functioning",
        "Just need a tune-up and reset"
      ]
    },
    {
      id: "energy_level",
      question: "How would you rate your current energy levels?",
      subtitle: "This helps us pace your recovery",
      options: [
        "Very low - everything feels exhausting",
        "Below average - getting through the day is hard",
        "Moderate - some good moments",
        "Decent but inconsistent"
      ]
    },
    {
      id: "sleep_quality",
      question: "How well are you sleeping?",
      subtitle: "Sleep is crucial for recovery",
      options: [
        "Poorly - struggle to fall or stay asleep",
        "Inconsistent - some good nights, many bad",
        "Okay but wake up tired",
        "Sleep is fine, other issues need focus"
      ]
    },
    {
      id: "recovery_style",
      question: "What type of recovery approach appeals to you?",
      subtitle: "We'll match your plan to your preferences",
      options: [
        "Gentle and nurturing - soft approach",
        "Structured with clear daily steps",
        "Natural remedies and holistic practices",
        "Mix of everything that works"
      ]
    },
    {
      id: "time_available",
      question: "How much time can you realistically dedicate to recovery each day?",
      subtitle: "Small consistent steps are powerful",
      options: [
        "10-15 minutes - keep it simple",
        "20-30 minutes - moderate commitment",
        "30-60 minutes - ready to invest time",
        "As much as needed - recovery is priority"
      ]
    },
    {
      id: "support_type",
      question: "What would help you most in your recovery?",
      subtitle: "We'll emphasize these elements",
      options: [
        "Gentle movement and stretching",
        "Rest and restorative practices",
        "Nutrition for healing",
        "Mindfulness and mental recovery",
        "All of the above"
      ]
    },
    {
      id: "duration",
      question: "How long should your recovery program be?",
      subtitle: "True healing takes time - be patient with yourself",
      options: [
        "1 week - Quick reset",
        "1 month - Proper recovery",
        "3 months - Deep restoration"
      ]
    }
  ]
};

// PDF Templates Configuration
type PDFTemplate = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

const PDF_TEMPLATES: Record<string, PDFTemplate> = {
  modern: {
    name: "Modern",
    colors: {
      primary: "#3B82F6",
      secondary: "#64748B",
      accent: "#10B981"
    }
  },
  elegant: {
    name: "Elegant",
    colors: {
      primary: "#8B5CF6",
      secondary: "#6B7280",
      accent: "#F59E0B"
    }
  },
  wellness: {
    name: "Wellness",
    colors: {
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399"
    }
  },
  fitness: {
    name: "Fitness",
    colors: {
      primary: "#EF4444",
      secondary: "#DC2626",
      accent: "#F97316"
    }
  },
  minimal: {
    name: "Minimal",
    colors: {
      primary: "#374151",
      secondary: "#6B7280",
      accent: "#9CA3AF"
    }
  },
  luxury: {
    name: "Luxury",
    colors: {
      primary: "#7C3AED",
      secondary: "#A855F7",
      accent: "#C084FC"
    }
  }
};

interface PlanType {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
}

interface GeneratedPlan {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  userAnswers: Record<string, any>;
  planType: string;
  sections: Array<{title: string; content: string}>;
  expectedResults: string[];
  dailySchedule: Record<string, string[]>;
  shoppingLists: Record<string, string[]>;
  expertTips: string[];
  affirmations: string[];
  progressMetrics: string[];
}

interface PlanRxCreatorProps {
  user?: any;
  onAuthRequired?: () => void;
  initialPlanType?: 'diet' | 'workout' | 'skincare' | 'wellness' | 'healing';
}

export default function PlanRxCreator({ user, onAuthRequired, initialPlanType }: PlanRxCreatorProps) {
  return (
    <UpgradeInterstitial feature={Feature.WELLNESS_BLUEPRINT_DESIGNER}>
      <PlanRxCreatorContent user={user} onAuthRequired={onAuthRequired} initialPlanType={initialPlanType} />
    </UpgradeInterstitial>
  );
}

function PlanRxCreatorContent({ user, onAuthRequired, initialPlanType }: PlanRxCreatorProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(initialPlanType ? "questionnaire" : "selection");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(() => {
    if (initialPlanType) {
      return PLAN_TYPES.find(p => p.id === initialPlanType) || null;
    }
    return null;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  // Load questions when initialPlanType is provided
  useEffect(() => {
    if (initialPlanType && selectedPlan) {
      setQuestions(QUESTION_SETS[initialPlanType as keyof typeof QUESTION_SETS] || []);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [initialPlanType, selectedPlan]);

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handlePlanTypeSelect = (planId: string) => {
    const plan = PLAN_TYPES.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setQuestions(QUESTION_SETS[planId as keyof typeof QUESTION_SETS] || []);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentStep("questionnaire");
    }
  };

  const handleAnswerSelect = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generatePlan(newAnswers);
    }
  };

  const generatePlan = async (answers: Record<string, any>) => {
    setCurrentStep("generating");
    
    // Simulate comprehensive plan generation
    setTimeout(() => {
      const duration = answers.duration || "1 month";
      const planType = selectedPlan?.id || 'diet';
      
      const plan = {
        title: `Complete ${duration} ${selectedPlan?.name || 'Health'} Transformation Guide`,
        description: `Your personalized ${duration} lifestyle transformation plan designed specifically for your goals, preferences, and lifestyle. This comprehensive guide includes daily schedules, shopping lists, tracking tools, expert tips, and everything you need for success.`,
        duration: duration,
        difficulty: "Moderate",
        userAnswers: answers,
        planType: planType,
        sections: generatePlanSections(planType, duration, answers),
        expectedResults: getExpectedResults(duration),
        dailySchedule: generateDailySchedule(planType, answers),
        shoppingLists: generateShoppingLists(planType, answers),
        trackingTools: generateTrackingTools(planType),
        expertTips: generateExpertTips(planType),
        affirmations: generateAffirmations(planType),
        progressMetrics: generateProgressMetrics(planType, duration)
      };
      
      setGeneratedPlan(plan);
      setCurrentStep("results");
    }, 3000);
  };

  const generatePlanSections = (planType: string, duration: string, answers: Record<string, any>) => {
    const baseSections = [
      {
        title: "SECTION 1: Complete Transformation Protocol",
        content: "Advanced bio-optimization framework with personalized metabolic profiling, circadian rhythm alignment, and neuroplasticity enhancement strategies."
      },
      {
        title: "SECTION 2: Precision Implementation System",
        content: "Hour-by-hour execution protocols with micro-habit stacking, environmental design principles, and behavioral trigger optimization."
      },
      {
        title: "SECTION 3: Advanced Nutritional Architecture",
        content: "Molecular nutrition protocols, macronutrient timing strategies, micronutrient optimization, and gut microbiome enhancement."
      },
      {
        title: "SECTION 4: Biometric Monitoring & Analytics",
        content: "Comprehensive tracking systems with biomarker analysis, performance metrics, recovery indicators, and progress algorithms."
      },
      {
        title: "SECTION 5: Cognitive Enhancement Protocols",
        content: "Neuroplasticity training, mental resilience building, stress inoculation, and peak performance mindset development."
      },
      {
        title: "SECTION 6: Recovery & Regeneration Systems",
        content: "Advanced recovery protocols, sleep optimization, stress management, and cellular repair enhancement strategies."
      },
      {
        title: "SECTION 7: Lifestyle Engineering Blueprint",
        content: "Environmental optimization, social support systems, digital wellness protocols, and habit architecture design."
      },
      {
        title: "SECTION 8: Scientific Foundation & Research",
        content: "Latest research findings, evidence-based protocols, mechanism explanations, and scientific rationale behind each strategy."
      },
      {
        title: "SECTION 9: Troubleshooting & Optimization",
        content: "Common challenges, plateau breakthrough strategies, advanced modifications, and personalization protocols."
      },
      {
        title: "SECTION 10: Long-term Mastery Framework",
        content: "Progression models, advanced techniques, mastery milestones, and continuous improvement systems."
      }
    ];

    // Add advanced plan-specific sections
    if (planType === 'diet') {
      baseSections.push(
        {
          title: "SECTION 11: Metabolic Optimization Protocols",
          content: "Advanced meal timing, insulin sensitivity optimization, thermogenesis enhancement, and metabolic flexibility training."
        },
        {
          title: "SECTION 12: Precision Nutrition Formulas",
          content: "Bioindividualized recipes, nutrient density calculations, anti-inflammatory compounds, and longevity nutrition protocols."
        },
        {
          title: "SECTION 13: Gut Health Mastery System",
          content: "Microbiome optimization, digestive enzyme protocols, prebiotic/probiotic strategies, and intestinal barrier enhancement."
        }
      );
    } else if (planType === 'workout') {
      baseSections.push(
        {
          title: "SECTION 11: Advanced Training Methodologies",
          content: "Periodization models, neural adaptation protocols, power development systems, and biomechanical optimization."
        },
        {
          title: "SECTION 12: Recovery Technology Integration",
          content: "HRV monitoring, sleep tracking, recovery modalities, and performance enhancement technologies."
        },
        {
          title: "SECTION 13: Injury Prevention & Longevity",
          content: "Movement quality assessment, corrective exercise protocols, joint health strategies, and longevity training principles."
        }
      );
    } else if (planType === 'skincare') {
      baseSections.push(
        {
          title: "SECTION 11: Cellular Regeneration Protocols",
          content: "Collagen synthesis optimization, cellular turnover enhancement, antioxidant delivery systems, and DNA repair mechanisms."
        },
        {
          title: "SECTION 12: Advanced Ingredient Synergies",
          content: "Molecular compatibility matrices, pH optimization, ingredient layering protocols, and bioavailability enhancement."
        },
        {
          title: "SECTION 13: Skin Microbiome Optimization",
          content: "Bacterial balance restoration, barrier function enhancement, inflammation modulation, and immune system support."
        }
      );
    } else if (planType === 'wellness') {
      baseSections.push(
        {
          title: "SECTION 11: Stress Resilience Engineering",
          content: "HPA axis optimization, cortisol regulation, adaptive stress response training, and nervous system balance protocols."
        },
        {
          title: "SECTION 12: Circadian Biology Mastery",
          content: "Light therapy protocols, melatonin optimization, sleep architecture enhancement, and chronotype alignment strategies."
        },
        {
          title: "SECTION 13: Cognitive Performance Optimization",
          content: "Neuroplasticity training, memory enhancement, focus protocols, and cognitive longevity strategies."
        }
      );
    } else if (planType === 'healing') {
      baseSections.push(
        {
          title: "SECTION 11: Cellular Repair Acceleration",
          content: "Autophagy enhancement, mitochondrial biogenesis, inflammation resolution, and tissue regeneration protocols."
        },
        {
          title: "SECTION 12: Advanced Recovery Modalities",
          content: "Cold therapy protocols, heat shock protein activation, breathwork techniques, and energy medicine approaches."
        },
        {
          title: "SECTION 13: Systemic Health Restoration",
          content: "Detoxification pathways, immune system optimization, hormonal balance restoration, and vitality enhancement."
        }
      );
    }

    return baseSections;
  };

  const getExpectedResults = (duration: string) => {
    switch (duration) {
      case "7 days":
        return [
          "Increased energy and better sleep quality",
          "2-3 lbs weight loss or improved body composition",
          "Better digestion and reduced bloating",
          "Clearer, more radiant skin",
          "Improved mood and mental clarity",
          "Established foundation for healthy habits"
        ];
      case "1 month":
        return [
          "5-10 lbs weight loss or significant body transformation",
          "Stronger, more consistent healthy habits",
          "Dramatically improved sleep and energy levels",
          "Reduced stress and better emotional balance",
          "Visible improvements in skin health and appearance",
          "Increased strength, flexibility, or fitness level"
        ];
      case "3 months":
        return [
          "15-20 lbs weight loss or complete body transformation",
          "Sustainable lifestyle changes that feel natural",
          "Optimal energy levels throughout the day",
          "Significant improvements in overall health markers",
          "Confident, glowing skin and improved appearance",
          "Long-term habits for continued success"
        ];
      default:
        return [
          "Noticeable improvements within the first week",
          "Significant progress by the end of your plan",
          "Long-term sustainable habits formed",
          "Enhanced overall well-being and confidence"
        ];
    }
  };

  const generateDailySchedule = (planType: string, answers: Record<string, any>) => {
    const baseSchedule = {
      "5:30-6:00 AM": [
        "Circadian Optimization Protocol: Natural light exposure + grounding (10 min)",
        "Hydration Formula: 16-20oz structured water + electrolyte complex",
        "Neural Activation: 5-minute cognitive priming + intention setting"
      ],
      "6:00-7:00 AM": [
        "Morning Movement Matrix: Dynamic warm-up + mobility sequence",
        "Breathwork Protocol: 4-7-8 breathing + box breathing technique", 
        "Mindfulness Integration: Meditation + gratitude practice"
      ],
      "7:00-8:30 AM": [
        "Precision Nutrition Window: Optimized breakfast + supplement protocol",
        "Cognitive Enhancement: Reading/learning + brain training exercises",
        "Energy Optimization: Cold exposure therapy (optional)"
      ],
      "12:00-1:00 PM": [
        "Midday Nutrition Protocol: Balanced lunch + digestive optimization",
        "Movement Snack: 10-minute activation + posture reset",
        "Stress Inoculation: Brief mindfulness + stress release technique"
      ],
      "3:00-4:00 PM": [
        "Afternoon Energy Management: Herbal adaptogen protocol",
        "Cognitive Refresh: 5-minute meditation + hydration",
        "Productivity Optimization: Environment reset + focus protocol"
      ],
      "5:00-7:00 PM": [
        "Primary Training Block: Structured exercise + recovery protocol",
        "Performance Tracking: Biometric monitoring + progress logging",
        "Social Connection: Community engagement + relationship nurturing"
      ],
      "7:00-8:30 PM": [
        "Evening Nutrition: Anti-inflammatory dinner + nutrient timing",
        "Digestion Optimization: Mindful eating + digestive enzymes",
        "Preparation Protocol: Next-day planning + environment setup"
      ],
      "8:30-10:00 PM": [
        "Recovery Initiation: Blue light filtering + dim lighting",
        "Nervous System Downregulation: Gentle stretching + relaxation",
        "Sleep Preparation: Bedroom optimization + sleep hygiene protocol"
      ],
      "10:00-10:30 PM": [
        "Final Wind-down: Journal reflection + gratitude practice",
        "Sleep Optimization: Temperature regulation + supplement protocol",
        "Recovery Enhancement: Sleep tracking setup + environment control"
      ]
    };
    
    // Add plan-specific optimizations
    if (planType === 'diet') {
      baseSchedule["7:00-8:30 AM"].push("Metabolic Activation: MCT oil + intermittent fasting protocol");
      baseSchedule["12:00-1:00 PM"].push("Insulin Optimization: Protein priority + fiber sequencing");
      baseSchedule["7:00-8:30 PM"].push("Metabolic Recovery: Early dinner + digestive support");
    }
    
    return baseSchedule;
  };

  const generateShoppingLists = (planType: string, answers: Record<string, any>) => {
    const advancedLists = {
      diet: {
        "Metabolic Optimization Foods": [
          "Wild-caught fatty fish (salmon, sardines, mackerel)",
          "Grass-fed organ meats (liver, heart)",
          "Pastured eggs with omega-3 enhancement",
          "Fermented vegetables (sauerkraut, kimchi, kvass)",
          "Sprouted nuts and seeds (almonds, pumpkin seeds)",
          "Ancient grains (quinoa, amaranth, millet)",
          "Adaptogenic mushrooms (reishi, chaga, cordyceps)"
        ],
        "Bioactive Compounds": [
          "Cold-pressed extra virgin olive oil (polyphenol-rich)",
          "Raw unfiltered apple cider vinegar with mother",
          "Organic turmeric root + black pepper extract",
          "Fresh ginger root + lemon for bioavailability",
          "Dark leafy greens (kale, spinach, arugula)",
          "Cruciferous vegetables (broccoli sprouts, Brussels sprouts)",
          "Colorful berries (blueberries, goji berries, acai)"
        ],
        "Precision Supplements": [
          "Omega-3 EPA/DHA (molecular distilled, 2000mg+)",
          "Vitamin D3 + K2 complex (bioavailable forms)",
          "Magnesium glycinate or malate (400-600mg)",
          "Probiotics (multi-strain, 50+ billion CFU)",
          "Digestive enzymes (broad-spectrum)",
          "B-complex (methylated forms)",
          "Zinc bisglycinate + copper balance"
        ],
        "Optimization Tools": [
          "pH testing strips for body alkalinity",
          "Food scale for precision portioning",
          "Glass food storage containers (BPA-free)",
          "High-speed blender for nutrient extraction",
          "Sprouting jars for fresh microgreens",
          "Water filtration system (reverse osmosis)",
          "Meal prep containers (portion-controlled)"
        ]
      },
      workout: {
        "Performance Equipment": [
          "Adjustable resistance bands (multiple tensions)",
          "Suspension trainer (TRX-style system)",
          "Kettlebells (adjustable or multiple weights)",
          "Medicine ball (slam ball + wall ball)",
          "Agility ladder + speed cones",
          "Foam roller (firm density) + massage balls",
          "Resistance loops (mini bands, various tensions)"
        ],
        "Recovery Technology": [
          "Heart rate variability monitor (HRV4Training)",
          "Sleep tracking device (Oura ring or equivalent)",
          "Percussive therapy device (massage gun)",
          "Compression gear for recovery",
          "Ice bath setup or cold plunge",
          "Infrared sauna blanket (optional)",
          "TENS unit for muscle recovery"
        ],
        "Performance Supplements": [
          "Whey protein isolate (grass-fed, minimal ingredients)",
          "Creatine monohydrate (micronized, 5g daily)",
          "Beta-alanine for muscular endurance",
          "Citrulline malate for blood flow",
          "Electrolyte replacement (no artificial additives)",
          "Branched-chain amino acids (2:1:1 ratio)",
          "ZMA (zinc, magnesium, B6) for recovery"
        ],
        "Monitoring Tools": [
          "Digital body composition scale",
          "Circumference measuring tape",
          "Workout journal or app",
          "Timer for interval training",
          "Mirror for form checking",
          "Resistance band door anchor",
          "Exercise mat (non-slip, cushioned)"
        ]
      },
      skincare: {
        "Cellular Regeneration Actives": [
          "Retinol serum (encapsulated, time-release)",
          "Vitamin C serum (L-ascorbic acid or magnesium ascorbyl)",
          "Niacinamide 10% (pore minimizing)",
          "Alpha hydroxy acids (glycolic, lactic)",
          "Beta hydroxy acid (salicylic acid)",
          "Peptide complex serums",
          "Growth factor serums"
        ],
        "Barrier Optimization": [
          "Ceramide-rich moisturizer",
          "Hyaluronic acid multi-molecular weight",
          "Squalane oil (plant-derived)",
          "Barrier repair cream with cholesterol",
          "pH-balanced gentle cleanser",
          "Microbiome-supporting prebiotic serum",
          "Mineral zinc oxide sunscreen SPF 30+"
        ],
        "Professional Tools": [
          "Derma roller (0.25mm for home use)",
          "LED light therapy device (red/near-infrared)",
          "Facial steamer for deep cleansing",
          "Jade or rose quartz gua sha tool",
          "Silicone face brush for gentle exfoliation",
          "Humidifier for skin hydration",
          "UV protection clothing/hat"
        ],
        "Natural Enhancement": [
          "Manuka honey (medical grade UMF 15+)",
          "Collagen peptides (marine or grass-fed)",
          "Astaxanthin (powerful antioxidant)",
          "Evening primrose oil (gamma-linolenic acid)",
          "Green tea extract (EGCG standardized)",
          "Resveratrol supplement",
          "Bone broth powder (collagen support)"
        ]
      },
      wellness: {
        "Stress Optimization": [
          "Adaptogenic herbs (ashwagandha, rhodiola, holy basil)",
          "Magnesium complex (multiple forms)",
          "L-theanine for calm focus",
          "GABA supplement for relaxation",
          "Phosphatidylserine for cortisol management",
          "5-HTP for serotonin support",
          "Valerian root for sleep support"
        ],
        "Cognitive Enhancement": [
          "Lion's mane mushroom extract",
          "Bacopa monnieri for memory",
          "Ginkgo biloba for circulation",
          "Alpha-GPC for brain health",
          "Curcumin with piperine",
          "Omega-3 DHA (brain-specific)",
          "NAD+ precursors for cellular energy"
        ],
        "Environmental Optimization": [
          "Air purifier with HEPA filtration",
          "Salt lamp for negative ions",
          "Essential oil diffuser + calming oils",
          "Blue light blocking glasses",
          "Blackout curtains for sleep",
          "White noise machine or earplugs",
          "Grounding mat for electrical balance"
        ],
        "Monitoring Technology": [
          "Continuous glucose monitor (optional)",
          "HRV monitoring device",
          "Sleep tracking technology",
          "Meditation app subscription",
          "Mood tracking journal",
          "Stress monitoring wearable",
          "Air quality monitor"
        ]
      }
    };
    
    return advancedLists[planType as keyof typeof advancedLists] || advancedLists.diet;
  };

  const generateTrackingTools = (planType: string) => {
    return [
      "Advanced Biometric Dashboard: Heart rate variability, sleep stages, recovery scores",
      "Cognitive Performance Metrics: Focus duration, mental clarity, processing speed",
      "Metabolic Indicators: Blood glucose trends, ketone levels, insulin sensitivity",
      "Inflammatory Markers: Subjective inflammation scale, joint mobility, energy patterns",
      "Stress Resilience Index: Cortisol rhythm tracking, stress response, adaptation capacity",
      "Micronutrient Status: Symptoms tracking, deficiency indicators, absorption markers",
      "Hormonal Balance Indicators: Energy patterns, mood stability, sleep quality",
      "Performance Analytics: Strength gains, endurance improvements, power output",
      "Recovery Metrics: Muscle soreness, sleep quality, motivation levels",
      "Environmental Factors: Air quality, light exposure, temperature optimization",
      "Social Wellness: Relationship quality, community engagement, support systems",
      "Progress Photography: Standardized lighting, angles, and measurement protocols",
      "Biomarker Timeline: Lab results tracking, trend analysis, optimization targets",
      "Habit Consolidation Matrix: Consistency tracking, trigger identification, reward systems"
    ];
  };

  const generateExpertTips = (planType: string) => {
    const advancedTips = {
      diet: [
        "METABOLIC FLEXIBILITY: Alternate between glucose and ketone fuel sources through strategic carbohydrate cycling and intermittent fasting protocols",
        "NUTRIENT TIMING: Consume protein within 30 minutes post-workout, carbohydrates during your most insulin-sensitive window (typically morning), and fats in the evening for hormone production",
        "MICROBIOME OPTIMIZATION: Rotate prebiotic fiber sources weekly, include fermented foods from different cultures, and avoid antibiotics unless absolutely necessary",
        "CIRCADIAN NUTRITION: Align your largest meals with cortisol peaks (morning) and avoid eating 3-4 hours before sleep to optimize growth hormone release",
        "THERMAL PROCESSING: Minimize advanced glycation end products (AGEs) by using low-temperature cooking methods, marinades with acidic components, and avoiding charred foods",
        "BIOAVAILABILITY HACKING: Combine fat-soluble vitamins with healthy fats, vitamin C with iron for absorption, and black pepper with turmeric for curcumin enhancement",
        "HYDRATION OPTIMIZATION: Drink structured water, add electrolytes without artificial additives, and monitor urine color for hydration status throughout the day"
      ],
      workout: [
        "NEURAL ADAPTATION PERIODIZATION: Vary rep ranges every 3-4 weeks (strength: 1-6, hypertrophy: 6-12, endurance: 12+) to continually challenge neuromuscular adaptations",
        "RECOVERY OPTIMIZATION: Use heart rate variability to determine training intensity, implement contrast showers for vascular adaptation, and prioritize sleep for growth hormone release",
        "MOVEMENT QUALITY FIRST: Master bodyweight patterns before adding external load, maintain perfect form through full range of motion, and address mobility restrictions daily",
        "PROGRESSIVE OVERLOAD VARIABLES: Manipulate volume, intensity, density, and complexity systematically rather than just adding weight to ensure continuous adaptation",
        "ENERGY SYSTEM DEVELOPMENT: Train different metabolic pathways (phosphocreatine, glycolytic, oxidative) with specific work-to-rest ratios for comprehensive fitness",
        "FASCIAL RELEASE PROTOCOLS: Implement self-myofascial release before workouts for activation and after for recovery, targeting specific fascial lines related to your training",
        "BREATHING INTEGRATION: Use diaphragmatic breathing during lifts for core stability, breath holds for mental resilience, and controlled breathing for recovery between sets"
      ],
      skincare: [
        "CELLULAR TURNOVER OPTIMIZATION: Use retinoids progressively (start 2x/week, build to daily), always apply to clean skin, and never mix with vitamin C in the same routine",
        "pH CASCADE MANAGEMENT: Apply products from lowest to highest pH (vitamin C first, then niacinamide, then retinol), wait 10-15 minutes between active ingredients",
        "BARRIER FUNCTION ENHANCEMENT: Use the 'sandwich method' - apply humectants on damp skin, seal with occlusives, and maintain skin pH between 4.5-5.5",
        "PHOTOPROTECTION MASTERY: Reapply sunscreen every 2 hours, use zinc oxide for sensitive skin, wear UVA/UVB protective clothing, and seek shade during peak hours",
        "MICROBIOME PRESERVATION: Avoid over-cleansing, use pH-balanced products, include prebiotic ingredients, and minimize antibiotic use to maintain healthy skin flora",
        "COLLAGEN SYNTHESIS SUPPORT: Consume vitamin C with collagen peptides, use topical vitamin C in morning routines, and include copper peptides for enzymatic support",
        "INFLAMMATION MODULATION: Identify and eliminate trigger foods, use omega-3 fatty acids internally, apply anti-inflammatory ingredients topically, and manage stress levels"
      ],
      wellness: [
        "HPA AXIS REGULATION: Implement stress inoculation through controlled stressors (cold exposure, breathwork), maintain consistent sleep-wake cycles, and use adaptogenic herbs strategically",
        "CIRCADIAN RHYTHM OPTIMIZATION: Get 10-15 minutes of morning sunlight within 30 minutes of waking, dim lights 2 hours before bed, and maintain consistent meal timing",
        "VAGAL TONE ENHANCEMENT: Practice diaphragmatic breathing, cold water face immersion, humming or singing, and progressive muscle relaxation to activate parasympathetic nervous system",
        "COGNITIVE LOAD MANAGEMENT: Use time-blocking for deep work, implement digital minimalism, practice single-tasking, and create buffer time between demanding activities",
        "SOCIAL CONNECTION OPTIMIZATION: Prioritize face-to-face interactions, practice active listening, engage in community service, and maintain supportive relationships",
        "MINDFULNESS INTEGRATION: Start with 5-minute daily meditation, practice mindful eating, use body scan techniques, and implement mindful transitions between activities",
        "ENVIRONMENTAL DESIGN: Optimize air quality with plants and purifiers, control lighting for circadian health, minimize noise pollution, and create designated spaces for relaxation"
      ],
      healing: [
        "INFLAMMATION RESOLUTION: Use specialized pro-resolving mediators (omega-3 derivatives), implement anti-inflammatory protocols, and identify/eliminate inflammatory triggers",
        "MITOCHONDRIAL SUPPORT: Practice intermittent fasting for mitophagy, use red light therapy for cellular energy, consume CoQ10 and PQQ, and avoid mitochondrial toxins",
        "AUTOPHAGY ACTIVATION: Implement time-restricted eating, use sauna therapy for heat shock proteins, practice extended fasting under supervision, and consume autophagy-supporting compounds",
        "STRESS INOCULATION: Use controlled stressors (cold therapy, breathwork, exercise) to build resilience, practice meditation for mental resilience, and maintain social support systems",
        "SLEEP ARCHITECTURE OPTIMIZATION: Maintain consistent sleep schedule, optimize bedroom environment (cool, dark, quiet), limit screens before bed, and consider sleep tracking",
        "NERVOUS SYSTEM REGULATION: Practice breathwork for vagal tone, use progressive muscle relaxation, implement grounding techniques, and maintain emotional regulation practices",
        "DETOXIFICATION SUPPORT: Support liver function with cruciferous vegetables, maintain hydration for kidney function, use sauna for toxin elimination, and avoid environmental toxins"
      ]
    };
    
    return advancedTips[planType as keyof typeof advancedTips] || advancedTips.diet;
  };

  const generateAffirmations = (planType: string) => {
    return [
      "I am committed to my health and well-being",
      "Every small step I take creates positive change",
      "I choose foods/activities that nourish my body",
      "I am becoming the healthiest version of myself",
      "My consistency today creates my success tomorrow",
      "I deserve to feel vibrant and energetic",
      "I am grateful for my body and treat it with respect"
    ];
  };

  const generateProgressMetrics = (planType: string, duration: string) => {
    const common = ["Energy levels (1-10)", "Sleep quality (1-10)", "Mood (1-10)", "Overall satisfaction (1-10)"];
    
    const specific = {
      diet: ["Weight", "Body measurements", "Digestive health", "Food cravings"],
      workout: ["Strength levels", "Endurance", "Flexibility", "Recovery time"],
      skincare: ["Skin clarity", "Hydration", "Texture", "Breakouts"],
      wellness: ["Stress levels", "Mental clarity", "Productivity", "Happiness"],
      healing: ["Pain levels", "Inflammation", "Mobility", "Recovery rate"]
    };
    
    return [...common, ...(specific[planType as keyof typeof specific] || specific.diet)];
  };

  const downloadPlan = requireAuthForAction(async () => {
    if (!selectedPlan || !generatedPlan) {
      alert('Please generate a plan first!');
      return;
    }

    // Check authentication status before download
    try {
      const authCheck = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (!authCheck.ok) {
        toast({
          title: "Sign up required",
          description: "Please create an account to download your personalized plan.",
          variant: "destructive"
        });
        // Redirect to signup page
        navigateTo('/signup');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Sign up required",
        description: "Please create an account to download your personalized plan.",
        variant: "destructive"
      });
      navigateTo('/signup');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      // Map our plan types to the PDF system types
      const pdfTypeMap: Record<string, string> = {
        'diet': 'diet',
        'workout': 'fitness', 
        'skincare': 'skincare',
        'wellness': 'wellness',
        'healing': 'recovery'
      };
      
      const pdfType = pdfTypeMap[selectedPlan.id] || 'wellness';
      
      // Call the backend API to generate PDF using the new endpoint with debug
      const response = await fetch(`/api/generate/${pdfType}?debug=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          answers: answers
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const errorMsg = contentType.includes("application/json")
          ? JSON.stringify(await response.json(), null, 2)
          : await response.text();
        throw new Error(`PDF HTTP ${response.status}: ${errorMsg.slice(0, 1200)}`);
      }

      // Get the PDF as a blob for download
      const blob = await response.blob();
      
      // Verify we got a valid PDF
      if (!blob || blob.size < 1024) {
        throw new Error("Empty PDF (size < 1KB)");
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `planrx-${pdfType}-plan-${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      
      // Track PDF download before clicking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pdf_download', {
          file_name: fileName,
          plan_type: pdfType,
          page_url: window.location.pathname,
          event_category: 'downloads',
          send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
        });
        console.log(`📄 PDF Download tracked: ${fileName}`);
      }
      
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Downloaded! ✨",
        description: "Your personalized plan has been downloaded successfully.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Generation Failed",
        description: error?.message || String(error),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  });

  const downloadPlanOld = async () => {
    // Check if user is authenticated before allowing PDF download
    if (!user) {
      // If user is not authenticated, trigger the auth modal
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    
    // User is authenticated, proceed with AI-powered PDF generation
    try {
      const success = await generateAIPoweredPDF({
        selectedPlan,
        generatedPlan,
        selectedTemplate
      });
      
      if (success) {
        console.log('AI-powered PDF generated successfully!');
      } else {
        console.log('PDF generated with fallback content');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generateProfessionalPDF = async (templateKey: string) => {
    try {
      // Generate AI-powered personalized content
      console.log('Generating AI content for PDF...');
      const aiContent = await generatePersonalizedContent(
        selectedPlan?.id || 'diet',
        generatedPlan?.duration || '7 days',
        generatedPlan?.userAnswers || {}
      );
      console.log('AI content generated:', aiContent);

      const template = PDF_TEMPLATES[templateKey];
      const pdf = new jsPDF('p', 'mm', 'a4');
      let currentPage = 1;
      let yPosition = 25;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pdf.internal.pageSize.width - (margin * 2);

      // Helper function to add new page if needed
      const checkPageBreak = (neededSpace = 25) => {
        if (yPosition + neededSpace > pageHeight - 25) {
          pdf.addPage();
          currentPage++;
          yPosition = 25;
          return true;
        }
        return false;
      };

      // Helper function to add visual divider
      const addDivider = () => {
        pdf.setDrawColor(template.colors.primary);
        pdf.setLineWidth(1);
        pdf.line(margin, yPosition, pdf.internal.pageSize.width - margin, yPosition);
        yPosition += 8;
      };

      // Helper function to add checkbox
      const addCheckbox = (x: number, y: number, size = 3) => {
        pdf.setDrawColor('#666666');
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, size, size);
      };

      // Helper function to add rich text content
      const addRichText = (text: string, fontSize: number = 11, textWidth: number = maxWidth - 20) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor('#333333');
        const lines = pdf.splitTextToSize(text, textWidth);
        lines.forEach((line: string) => {
          checkPageBreak(10);
          pdf.text(line, margin + 10, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      };

    // Generate AI-powered personalized workbook content
    const generateAIWorkbookContent = (content: PersonalizedContent) => {
      const planType = selectedPlan?.id;
      
      if (planType === 'diet') {
        generateAIDietWorkbook(content);
      } else if (planType === 'skincare') {
        generateAISkincareWorkbook(content);
      } else if (planType === 'workout') {
        generateAIFitnessWorkbook(content);
      } else if (planType === 'healing') {
        generateAIRecoveryWorkbook(content);
      } else if (planType === 'wellness') {
        generateAIWellnessWorkbook(content);
      } else {
        generateAIDietWorkbook(content);
      }
    };

    // AI-powered Diet Workbook Generator
    const generateAIDietWorkbook = (content: PersonalizedContent) => {
      // PAGE 2: Detailed Meal Plans with Recipes
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personalized Meal Plan", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      // Generate detailed meal plans for each day
      content.mealPlans?.forEach((dayPlan, index) => {
        checkPageBreak(150);
        
        pdf.setTextColor(template.colors.primary);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${dayPlan.day} Meal Plan`, margin, yPosition);
        yPosition += 20;

        // Breakfast
        pdf.setTextColor('#333333');
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("🍳 Breakfast: " + dayPlan.breakfast.name, margin, yPosition);
        yPosition += 15;
        
        addRichText("Recipe: " + dayPlan.breakfast.recipe, 10);
        addRichText("Why this works: " + dayPlan.breakfast.nutrition, 9);
        
        // Lunch
        checkPageBreak(60);
        pdf.setTextColor('#333333');
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("🥗 Lunch: " + dayPlan.lunch.name, margin, yPosition);
        yPosition += 15;
        
        addRichText("Recipe: " + dayPlan.lunch.recipe, 10);
        addRichText("Why this works: " + dayPlan.lunch.nutrition, 9);
        
        // Dinner
        checkPageBreak(60);
        pdf.setTextColor('#333333');
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("🍽️ Dinner: " + dayPlan.dinner.name, margin, yPosition);
        yPosition += 15;
        
        addRichText("Recipe: " + dayPlan.dinner.recipe, 10);
        addRichText("Why this works: " + dayPlan.dinner.nutrition, 9);
        
        // Snacks
        if (dayPlan.snacks && dayPlan.snacks.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text("🍎 Healthy Snacks:", margin, yPosition);
          yPosition += 10;
          
          dayPlan.snacks.forEach(snack => {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text("• " + snack, margin + 10, yPosition);
            yPosition += 8;
          });
        }
        
        yPosition += 20;
      });

      // PAGE: Comprehensive Shopping List
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personalized Shopping List", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      content.shoppingList?.forEach(category => {
        checkPageBreak(40);
        
        pdf.setTextColor('#333333');
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(category.category, margin, yPosition);
        yPosition += 15;
        
        category.items.forEach(item => {
          addCheckbox(margin + 10, yPosition - 3);
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "normal");
          pdf.text(item, margin + 20, yPosition);
          yPosition += 12;
        });
        yPosition += 10;
      });

      // PAGE: Expert Tips & Advice
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Expert Nutrition Tips", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      content.tips?.forEach((tip, index) => {
        checkPageBreak(30);
        
        pdf.setTextColor(template.colors.primary);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Tip #${index + 1}:`, margin, yPosition);
        yPosition += 15;
        
        addRichText(tip, 11);
        yPosition += 10;
      });
    };

    // AI-powered Fitness Workbook Generator
    const generateAIFitnessWorkbook = (content: PersonalizedContent) => {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personal Fitness Program", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      content.workoutPlans?.forEach(workout => {
        checkPageBreak(100);
        
        pdf.setTextColor(template.colors.primary);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${workout.day}: ${workout.workoutName}`, margin, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Duration: ${workout.duration}`, margin, yPosition);
        yPosition += 20;

        workout.exercises?.forEach(exercise => {
          checkPageBreak(25);
          
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(`• ${exercise.name}`, margin + 5, yPosition);
          yPosition += 12;
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Sets: ${exercise.sets} | Reps: ${exercise.reps}`, margin + 15, yPosition);
          yPosition += 8;
          
          addRichText(exercise.description, 9, maxWidth - 30);
        });
        
        yPosition += 15;
      });
    };

    // Simplified generators for other plan types
    const generateAISkincareWorkbook = (content: PersonalizedContent) => {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personal Skincare Routine", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      if (content.routines?.morning) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Morning Routine:", margin, yPosition);
        yPosition += 15;
        
        content.routines.morning.forEach(step => {
          addRichText("• " + step, 11);
        });
      }

      if (content.routines?.evening) {
        yPosition += 20;
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Evening Routine:", margin, yPosition);
        yPosition += 15;
        
        content.routines.evening.forEach(step => {
          addRichText("• " + step, 11);
        });
      }

      content.tips?.forEach(tip => {
        checkPageBreak(25);
        addRichText("💡 " + tip, 11);
      });
    };

    const generateAIRecoveryWorkbook = (content: PersonalizedContent) => {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personal Recovery Plan", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      content.recoveryPlans?.forEach(plan => {
        checkPageBreak(40);
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(plan.technique, margin, yPosition);
        yPosition += 15;
        
        addRichText("Description: " + plan.description, 11);
        addRichText("Benefits: " + plan.benefits, 10);
        yPosition += 10;
      });
    };

    const generateAIWellnessWorkbook = (content: PersonalizedContent) => {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personal Wellness Blueprint", margin, yPosition);
      yPosition += 25;
      
      addDivider();

      content.tips?.forEach(tip => {
        checkPageBreak(25);
        addRichText("🌟 " + tip, 11);
      });
    };

      // COVER PAGE GENERATION  
      yPosition = 25;
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      
      const mainTitle = selectedPlan?.name === 'Custom Diet Plans' ? `${generatedPlan?.duration} Nutrition Plan` :
                       selectedPlan?.name === 'Skin Care Routines' ? `${generatedPlan?.duration} Skin Health Plan` :
                       selectedPlan?.name === 'Fitness Routines' ? `${generatedPlan?.duration} Fitness Program` :
                       selectedPlan?.name === 'Recovery Plans' ? `${generatedPlan?.duration} Recovery Guide` :
                       `${generatedPlan?.duration} Wellness Blueprint`;
      
      const titleLines = pdf.splitTextToSize(mainTitle, maxWidth);
      pdf.text(titleLines, margin, yPosition + 20);
      yPosition += titleLines.length * 12 + 25;

      // Subtitle with value proposition
      pdf.setTextColor('#444444');
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      
      const subtitle = selectedPlan?.name === 'Custom Diet Plans' ? 'Personalized meal plans with recipes, shopping lists, and expert nutrition tips' :
                      selectedPlan?.name === 'Skin Care Routines' ? 'Custom morning & evening routines with progress tracking and expert advice' :
                      selectedPlan?.name === 'Fitness Routines' ? 'Tailored workouts with detailed instructions and progress monitoring' :
                      selectedPlan?.name === 'Recovery Plans' ? 'Comprehensive recovery strategies with daily routines and healing techniques' :
                      'Complete wellness program with daily practices and expert guidance';
      
      pdf.text(subtitle, margin, yPosition);
      yPosition += 35;

      // Quick start box
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(template.colors.primary);
      pdf.setLineWidth(2);
      pdf.roundedRect(margin, yPosition, maxWidth, 50, 5, 5, 'FD');
      
      pdf.setTextColor('#333333');
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Personalized Guide Includes:", margin + 10, yPosition + 15);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("✓ AI-generated content tailored to your goals and preferences", margin + 10, yPosition + 25);
      pdf.text("✓ Detailed instructions, recipes, and expert recommendations", margin + 10, yPosition + 32);
      pdf.text("✓ Progress tracking tools and interactive checklists", margin + 10, yPosition + 39);
      pdf.text("✓ Professional design with 15+ pages of comprehensive content", margin + 10, yPosition + 46);
      
      yPosition += 70;

      // Duration and creation info
      pdf.setTextColor('#666666');
      pdf.setFontSize(10);
      pdf.text(`Plan Duration: ${generatedPlan?.duration}`, margin, yPosition);
      pdf.text(`Created: ${new Date().toLocaleDateString()}`, margin, yPosition + 8);
      pdf.text("AI-Powered • Print-Ready • Professional Design • Interactive Tracking", margin, yPosition + 16);

      // Generate the comprehensive AI workbook content
      generateAIWorkbookContent(aiContent);

      // Save the PDF
      const filename = `PlantRx_${selectedPlan?.name?.replace(/\s+/g, '_') || 'Health'}_${generatedPlan?.duration?.replace(/\s+/g, '_') || '7_Days'}_Plan.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      
      // Fallback to basic PDF if AI generation fails
      const pdf = new jsPDF('p', 'mm', 'a4');
      const template = PDF_TEMPLATES[templateKey];
      
      pdf.setTextColor(template.colors.primary);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Health Plan", 20, 40);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("We're generating your personalized content. Please try again in a moment.", 20, 60);
      
      pdf.save(`PlantRx_${selectedPlan?.name?.replace(/\s+/g, '_') || 'Health'}_Plan.pdf`);
    }
  };

  const goBack = () => {
    if (currentStep === "questionnaire") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        setCurrentStep("selection");
      }
    } else {
      setCurrentStep("selection");
    }
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentQuestion = questions[currentQuestionIndex];

  if (currentStep === 'selection') {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 overflow-y-auto">
        {/* Mobile Header - Compact */}
        <div className="text-center mb-6 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 dark:from-amber-400 dark:via-yellow-500 dark:to-amber-600 rounded-full mb-4 sm:mb-8 shadow-2xl">
            <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6 leading-tight px-2">
            Elite Health <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-500 dark:to-yellow-600 bg-clip-text text-transparent">Transformation</span>
          </h1>
          <p className="text-sm sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-10 px-4">
            Premium, personalized health plans crafted by expert nutritionists and fitness professionals. 
            Get results that matter with science-backed strategies tailored exclusively for you.
          </p>
          
          {/* Value Proposition Badge - Mobile Responsive */}
          <div className="inline-flex items-center bg-purple-100 dark:bg-emerald-900/40 backdrop-blur-sm rounded-full px-3 sm:px-8 py-2 sm:py-4 border border-purple-300 dark:border-emerald-600/50 mx-2">
            <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-emerald-400 mr-2 sm:mr-3" />
            <span className="text-xs sm:text-lg font-semibold text-gray-900 dark:text-white">Professional Quality • Instant Download • Money-Back Guarantee</span>
          </div>
        </div>

        {/* Mobile: Compact Card Selection */}
        <div className="sm:hidden grid grid-cols-1 gap-4 mb-12">
          {PLAN_TYPES.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                onClick={() => handlePlanTypeSelect(plan.id)}
                className="group cursor-pointer"
              >
                <div className="relative bg-white dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-600/50 group-hover:border-purple-400 dark:group-hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-amber-500 dark:to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-tight mb-2">{plan.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-700 dark:text-gray-200">
                            <CheckCircle className="w-3 h-3 text-purple-600 dark:text-emerald-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-amber-500 dark:to-yellow-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg">
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Premium Plan Selection */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {PLAN_TYPES.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                onClick={() => handlePlanTypeSelect(plan.id)}
                className="group cursor-pointer"
              >
                <div className="relative">
                  {/* Premium glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-amber-600 dark:via-yellow-600 dark:to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-600/50 group-hover:border-purple-400 dark:group-hover:border-amber-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20 dark:group-hover:shadow-amber-500/20 group-hover:scale-105">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-amber-500 dark:to-yellow-600 rounded-xl mb-4 shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{plan.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{plan.description}</p>
                    </div>
                    
                    {/* Premium features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                          <CheckCircle className="w-4 h-4 text-purple-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-amber-500 dark:to-yellow-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group-hover:from-purple-400 group-hover:to-pink-400 dark:group-hover:from-amber-400 dark:group-hover:to-yellow-500">
                      Start Your Transformation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentStep === 'questionnaire') {
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return (
        <div className="min-h-screen w-full p-4 flex flex-col">
          <Card className="bg-white dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-600/50 shadow-2xl flex-1 flex flex-col">
            <CardContent className="p-8 flex-1 flex flex-col justify-center items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Loading Questions...</h3>
              <Button onClick={() => setCurrentStep('selection')} className="mt-4">
                Back to Selection
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Get plan-specific icon and colors
    const getPlanTheme = () => {
      switch (selectedPlan?.id) {
        case 'diet':
          return { icon: Apple, lightGradient: 'from-emerald-400 via-green-500 to-teal-500', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
        case 'workout':
          return { icon: Dumbbell, lightGradient: 'from-blue-400 via-indigo-500 to-purple-500', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
        case 'skincare':
          return { icon: Sparkles, lightGradient: 'from-pink-400 via-rose-500 to-red-400', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
        case 'wellness':
          return { icon: Heart, lightGradient: 'from-purple-400 via-violet-500 to-indigo-500', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
        case 'healing':
          return { icon: Brain, lightGradient: 'from-orange-400 via-amber-500 to-yellow-500', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
        default:
          return { icon: Sparkles, lightGradient: 'from-purple-400 via-pink-500 to-rose-500', darkGradient: 'from-amber-400 via-yellow-500 to-orange-400' };
      }
    };
    const planTheme = getPlanTheme();
    const PlanIcon = planTheme.icon;

    // Get gradient colors for inline styles (needed for dynamic dark mode)
    const getGradientStyle = (isSecondary = false) => {
      const lightColors = {
        diet: ['#34d399', '#10b981', '#14b8a6'],
        workout: ['#60a5fa', '#6366f1', '#a855f7'],
        skincare: ['#f472b6', '#f43f5e', '#ef4444'],
        wellness: ['#a78bfa', '#8b5cf6', '#6366f1'],
        healing: ['#fb923c', '#f59e0b', '#eab308']
      };
      const planId = selectedPlan?.id || 'wellness';
      const colors = lightColors[planId as keyof typeof lightColors] || lightColors.wellness;
      return {
        background: `linear-gradient(135deg, ${colors[0]}40, ${colors[1]}30, ${colors[2]}20)`
      };
    };

    return (
      <div className="min-h-screen w-full flex flex-col overflow-hidden relative">
        {/* Simple, performant background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          {/* Luxury Header */}
          <div className="max-w-4xl mx-auto w-full">
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="ghost" 
                onClick={goBack} 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Button>
              
              {/* Step indicator with luxury styling */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planTheme.lightGradient} dark:${planTheme.darkGradient} flex items-center justify-center shadow-lg`}>
                  <PlanIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Question</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentQuestionIndex + 1} <span className="text-gray-400 dark:text-gray-500 font-normal">/ {questions.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Progress Bar */}
            <motion.div 
              className="relative mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${planTheme.lightGradient} dark:${planTheme.darkGradient} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </motion.div>
              </div>
              {/* Progress percentage */}
              <motion.div 
                className="absolute -top-6 text-xs font-semibold text-gray-500 dark:text-gray-400"
                style={{ left: `${Math.min(progress, 95)}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.round(progress)}%
              </motion.div>
            </motion.div>
          </div>

          {/* Question Card */}
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex-1 flex flex-col"
              >
                {/* Question Header */}
                <div className="text-center mb-8 sm:mb-10">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 mb-4 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500 dark:text-amber-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {selectedPlan?.name || 'Your Wellness Journey'}
                    </span>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight px-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                  >
                    {currentQuestion.question}
                  </motion.h2>
                  {currentQuestion.subtitle && (
                    <motion.p 
                      className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                    >
                      {currentQuestion.subtitle}
                    </motion.p>
                  )}
                </div>

                {/* Answer Options */}
                <div className="flex-1 overflow-y-auto pb-6 px-2">
                  <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.2,
                          delay: 0.1 + index * 0.04,
                        }}
                      >
                        <motion.button
                          onClick={() => handleAnswerSelect(option)}
                          whileHover={{ scale: 1.015, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="w-full text-left group"
                        >
                          {/* Clean, performant card */}
                          <div className="relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-xl hover:border-purple-400 dark:hover:border-amber-400 transition-all duration-200">
                            <div className="flex items-center gap-4 sm:gap-5">
                              {/* Premium circular letter badge */}
                              <div className="flex-shrink-0 relative">
                                {/* Outer ring */}
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${planTheme.lightGradient} p-0.5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                  {/* Inner circle */}
                                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center group-hover:bg-opacity-90 transition-all">
                                    <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-br ${planTheme.lightGradient} bg-clip-text text-transparent`}>
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                  </div>
                                </div>
                                {/* Subtle glow on hover - CSS only */}
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${planTheme.lightGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 scale-110`} />
                              </div>

                              {/* Option text */}
                              <div className="flex-1 min-w-0">
                                <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-white leading-relaxed block">
                                  {option}
                                </span>
                              </div>

                              {/* Arrow indicator with circle bg */}
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:bg-purple-100 dark:group-hover:bg-amber-500/20">
                                <ArrowRight className="w-5 h-5 text-purple-500 dark:text-amber-400" />
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom hint */}
          <motion.div 
            className="text-center mt-4 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Click to select your answer
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen w-full p-3 sm:p-4 flex flex-col">
        {/* Back Button - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <Button variant="outline" onClick={() => setCurrentStep('selection')} className="flex items-center gap-2 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">New Plan</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-600/50 shadow-2xl flex-1 flex flex-col">
          <CardContent className="p-4 sm:p-8 flex-1 flex flex-col justify-center items-center">
            {/* Mobile: Compact Crown Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 dark:from-amber-400 dark:via-yellow-500 dark:to-amber-600 rounded-full mb-4 sm:mb-6 flex items-center justify-center shadow-xl">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            
            {/* Spinner */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin mb-4 sm:mb-6"></div>
            
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center px-2">Generating Your Personalized Plan</h3>
            <p className="text-gray-600 dark:text-gray-200 text-center mb-4 text-sm sm:text-base px-4 leading-relaxed">
              Our experts are creating your customized {selectedPlan?.name.toLowerCase()} plan based on your answers...
            </p>
            
            {/* Progress Bar - Mobile Responsive */}
            <div className="w-full max-w-xs sm:max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-amber-400 dark:to-yellow-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">This will only take a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results') {
    if (!generatedPlan) {
      return (
        <div className="min-h-screen w-full p-4 flex flex-col">
          <Card className="bg-white dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-600/50 shadow-2xl flex-1 flex flex-col">
            <CardContent className="p-8 flex-1 flex flex-col justify-center items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Plan Generation Error</h3>
              <p className="text-gray-600 dark:text-gray-200 text-center mb-8">Something went wrong. Please try again.</p>
              <Button onClick={() => setCurrentStep('selection')} className="mt-4">
                Back to Selection
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <motion.div 
        className="w-full min-h-screen max-w-none mx-0 p-4 sm:p-8 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Success Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('selection')} 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Plan</span>
            </Button>
          </div>

          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 mb-6"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Your Plan is Ready!</span>
          </motion.div>

          {/* Plan Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
          >
            {generatedPlan.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {generatedPlan.duration}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {generatedPlan.difficulty}
            </span>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Plan Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Overview Card */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-400" />
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500 dark:text-amber-400" />
                  Plan Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base">
                  {generatedPlan.description}
                </p>
                
                {/* Sections Preview */}
                <div className="space-y-4">
                  {generatedPlan.sections?.slice(0, 3).map((section, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-l-4 border-purple-500 dark:border-amber-400"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{section.content?.substring(0, 120)}...</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expected Results Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500 dark:text-amber-400" />
                    Expected Results
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedPlan.expectedResults?.slice(0, 6).map((result, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{result}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Column - Download CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border-2 border-purple-200 dark:border-amber-500/30 shadow-xl overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-400" />
                <CardContent className="p-6 sm:p-8">
                  {/* Icon */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 dark:from-amber-400 dark:to-yellow-500 flex items-center justify-center shadow-xl"
                  >
                    <FileText className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Download Your Guide
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Get your complete personalized plan as a beautiful PDF
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Personalized recommendations',
                      'Daily schedules & tracking',
                      'Shopping lists & tips',
                      'Progress tracking tools',
                      '15+ pages of content'
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-amber-500/20 flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Download Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button 
                      onClick={downloadPlan}
                      disabled={isGeneratingPDF}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-500 dark:to-yellow-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-amber-600 dark:hover:to-yellow-600 text-white py-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                      size="lg"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <Sparkles className="mr-2 h-6 w-6 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-6 w-6" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    Instant download • Print ready
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
}
