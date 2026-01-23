import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Calculator, Info, RotateCcw, Activity, Ruler, Scale, Heart, Zap, AlertCircle, BookOpen, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";

type HeightUnit = "cm" | "ftin";
type WeightUnit = "kg" | "lb";
type WaistUnit = "cm" | "in";
type ActivityLevel = "sedentary" | "light" | "moderate" | "high";

interface CalculatorResults {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  whtr: number;
  whtrCategory: string;
  whtrColor: string;
  metabolicScore: number;
  metabolicCategory: string;
  metabolicColor: string;
}

interface FormErrors {
  height?: string;
  weight?: string;
  waist?: string;
  feet?: string;
  inches?: string;
}

const educationalCards = [
  {
    icon: Scale,
    title: "Body Mass Index (BMI)",
    formula: "Weight (kg) ÷ Height (m)²",
    description: "BMI is a simple calculation using your height and weight to estimate whether you're in a healthy weight range. It's been used by doctors for decades as a quick screening tool.",
    categories: [
      { range: "Under 18.5", label: "Underweight", color: "text-blue-600 dark:text-blue-400" },
      { range: "18.5 – 24.9", label: "Normal", color: "text-green-600 dark:text-green-400" },
      { range: "25 – 29.9", label: "Overweight", color: "text-yellow-600 dark:text-yellow-400" },
      { range: "30+", label: "Obese", color: "text-red-600 dark:text-red-400" },
    ],
    limitation: "BMI doesn't distinguish between muscle and fat, so very muscular people may show as \"overweight\" even when healthy.",
    gradient: "from-blue-500 to-indigo-500",
    bgGlow: "bg-blue-500/10 dark:bg-blue-500/5"
  },
  {
    icon: Ruler,
    title: "Waist-to-Height Ratio (WHtR)",
    formula: "Waist (cm) ÷ Height (cm)",
    description: "WHtR measures how your body stores fat around your midsection. Research shows it's often a better predictor of health risks than BMI because belly fat is more metabolically active.",
    categories: [
      { range: "Under 0.50", label: "Healthy", color: "text-green-600 dark:text-green-400" },
      { range: "0.50 – 0.59", label: "Increased Risk", color: "text-yellow-600 dark:text-yellow-400" },
      { range: "0.60+", label: "High Risk", color: "text-red-600 dark:text-red-400" },
    ],
    limitation: "The golden rule: keep your waist circumference to less than half your height for optimal health.",
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/10 dark:bg-purple-500/5"
  },
  {
    icon: Heart,
    title: "Metabolic Health Score",
    formula: "Composite Score (0-100)",
    description: "Our unique wellness score combines your BMI, waist ratio, activity level, and age to give you a snapshot of your overall metabolic health. Higher scores indicate better metabolic function.",
    categories: [
      { range: "80-100", label: "Strong", color: "text-green-600 dark:text-green-400" },
      { range: "60-79", label: "Fair", color: "text-yellow-600 dark:text-yellow-400" },
      { range: "40-59", label: "Needs Attention", color: "text-orange-600 dark:text-orange-400" },
      { range: "0-39", label: "High Risk", color: "text-red-600 dark:text-red-400" },
    ],
    limitation: "This score is a wellness estimate, not a medical diagnosis. Use it as motivation for healthy lifestyle changes.",
    gradient: "from-teal-500 to-emerald-500",
    bgGlow: "bg-teal-500/10 dark:bg-teal-500/5"
  }
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ToolsHealthCalculators() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [waistUnit, setWaistUnit] = useState<WaistUnit>("cm");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  
  const [heightCm, setHeightCm] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [age, setAge] = useState("");
  
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showEducation, setShowEducation] = useState(true);

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (heightUnit === "cm") {
      if (!heightCm || parseFloat(heightCm) <= 0) {
        newErrors.height = "Please enter a valid height";
      }
    } else {
      if (!feet || parseFloat(feet) < 0) {
        newErrors.feet = "Please enter valid feet";
      }
      if (inches && (parseFloat(inches) < 0 || parseFloat(inches) > 11)) {
        newErrors.inches = "Inches must be 0-11";
      }
    }
    
    if (!weight || parseFloat(weight) <= 0) {
      newErrors.weight = "Please enter a valid weight";
    }
    
    if (!waist || parseFloat(waist) <= 0) {
      newErrors.waist = "Please enter a valid waist circumference";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateResults = () => {
    if (!validateInputs()) return;
    
    let height_cm: number;
    if (heightUnit === "cm") {
      height_cm = parseFloat(heightCm);
    } else {
      const totalInches = (parseFloat(feet) * 12) + (parseFloat(inches) || 0);
      height_cm = totalInches * 2.54;
    }
    const height_m = height_cm / 100;
    
    let weight_kg: number;
    if (weightUnit === "kg") {
      weight_kg = parseFloat(weight);
    } else {
      weight_kg = parseFloat(weight) * 0.45359237;
    }
    
    let waist_cm: number;
    if (waistUnit === "cm") {
      waist_cm = parseFloat(waist);
    } else {
      waist_cm = parseFloat(waist) * 2.54;
    }
    
    const bmi = weight_kg / (height_m * height_m);
    const whtr = waist_cm / height_cm;
    
    let bmiCategory: string;
    let bmiColor: string;
    if (bmi < 18.5) {
      bmiCategory = "Underweight";
      bmiColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    } else if (bmi <= 24.9) {
      bmiCategory = "Normal";
      bmiColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    } else if (bmi <= 29.9) {
      bmiCategory = "Overweight";
      bmiColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else {
      bmiCategory = "Obese";
      bmiColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    
    let whtrCategory: string;
    let whtrColor: string;
    if (whtr < 0.50) {
      whtrCategory = "Healthy range";
      whtrColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    } else if (whtr < 0.60) {
      whtrCategory = "Increased risk";
      whtrColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else {
      whtrCategory = "High risk";
      whtrColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    
    let score = 100;
    
    if (bmi < 18.5) score -= 8;
    else if (bmi <= 24.9) score -= 0;
    else if (bmi <= 29.9) score -= 10;
    else if (bmi <= 34.9) score -= 18;
    else if (bmi <= 39.9) score -= 25;
    else score -= 32;
    
    if (whtr < 0.50) score -= 0;
    else if (whtr < 0.60) score -= 15;
    else score -= 25;
    
    switch (activityLevel) {
      case "sedentary": score -= 12; break;
      case "light": score -= 6; break;
      case "moderate": score += 0; break;
      case "high": score += 4; break;
    }
    
    if (age) {
      const ageNum = parseInt(age);
      if (ageNum >= 40 && ageNum < 60) score -= 4;
      else if (ageNum >= 60) score -= 8;
    }
    
    score = Math.max(0, Math.min(100, score));
    
    let metabolicCategory: string;
    let metabolicColor: string;
    if (score >= 80) {
      metabolicCategory = "Strong";
      metabolicColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    } else if (score >= 60) {
      metabolicCategory = "Fair";
      metabolicColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else if (score >= 40) {
      metabolicCategory = "Needs attention";
      metabolicColor = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    } else {
      metabolicCategory = "High risk";
      metabolicColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    
    setResults({
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmiColor,
      whtr: Math.round(whtr * 100) / 100,
      whtrCategory,
      whtrColor,
      metabolicScore: Math.round(score),
      metabolicCategory,
      metabolicColor,
    });
  };

  const resetForm = () => {
    setHeightCm("");
    setFeet("");
    setInches("");
    setWeight("");
    setWaist("");
    setAge("");
    setResults(null);
    setErrors({});
  };

  const getBmiTip = (category: string) => {
    switch (category) {
      case "Underweight": return "Focus on nutrient-dense foods like nuts, avocados, and whole grains.";
      case "Normal": return "Maintain your healthy habits with balanced meals and regular activity.";
      case "Overweight": return "Try consistent daily walking + whole-food meals for gradual improvement.";
      case "Obese": return "Consider consulting a healthcare provider for a personalized wellness plan.";
      default: return "";
    }
  };

  const getWhtrTip = (category: string) => {
    switch (category) {
      case "Healthy range": return "Great job! Continue maintaining a balanced diet and active lifestyle.";
      case "Increased risk": return "Reducing waist size improves long-term metabolic health.";
      case "High risk": return "Focus on core-strengthening exercises and reducing processed foods.";
      default: return "";
    }
  };

  const getMetabolicTip = (score: number) => {
    if (score >= 80) return "Excellent! Keep up your healthy lifestyle with regular movement and plant-based meals.";
    if (score >= 60) return "Aim for 7-8k steps/day + plant-heavy meals + better sleep.";
    if (score >= 40) return "Start with small changes: 20-min walks, more vegetables, consistent sleep schedule.";
    return "Consider working with a healthcare provider to create a gradual improvement plan.";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      <ScrollProgress />
      <SEOHead
        title="Health Calculators - BMI, Waist Ratio & Metabolic Score | PlantRx"
        description="Calculate your BMI, Waist-to-Height Ratio, and Metabolic Health Score with our free wellness calculators. Get personalized natural health tips."
        canonical="/tools/health-calculators"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-24 pb-20 scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40 text-teal-700 dark:text-teal-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm"
            >
              <Calculator className="w-5 h-5 sm:w-5 sm:h-5" />
              Wellness Tools
            </motion.div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 tracking-tight leading-tight">
              Health Calculators
            </h1>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Understand your body better with our science-backed wellness calculators. 
              <span className="block mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-500">General wellness estimates. Not medical advice.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <button
              onClick={() => setShowEducation(!showEducation)}
              className="flex items-center gap-2 sm:gap-3 mx-auto text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors group bg-teal-50 dark:bg-teal-900/30 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/50 text-base sm:text-lg"
              data-testid="toggle-education-button"
            >
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{showEducation ? "Hide" : "Show"} How Calculations Work</span>
              <motion.span
                animate={{ rotate: showEducation ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block text-lg"
              >
                ↓
              </motion.span>
            </button>
          </motion.div>

          <AnimatePresence>
            {showEducation && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="mb-14"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                  {educationalCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className={`h-full bg-white dark:bg-gray-900/80 shadow-xl border-0 overflow-hidden backdrop-blur-sm ${card.bgGlow}`}>
                        <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`} />
                        <CardContent className="p-6 lg:p-8">
                          <div className="flex items-center gap-3 mb-5">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                              <card.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{card.title}</h3>
                          </div>
                          
                          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg px-4 py-3 mb-5 font-mono text-sm text-gray-700 dark:text-gray-300">
                            {card.formula}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            {card.description}
                          </p>
                          
                          <div className="space-y-2 mb-6">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-semibold mb-3">Categories</p>
                            {card.categories.map((cat) => (
                              <div key={cat.label} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{cat.range}</span>
                                <span className={`font-medium ${cat.color}`}>{cat.label}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                                {card.limitation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeInSection>
            <Card className="bg-white dark:bg-gray-900/80 shadow-2xl border-0 mb-10 overflow-hidden backdrop-blur-sm">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500" />
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 p-5 sm:p-6 lg:p-8">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  Enter Your Measurements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 lg:p-8 xl:p-10 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                  <div className="space-y-3 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-300">Height</Label>
                      <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as HeightUnit)}>
                        <SelectTrigger className="w-28 sm:w-24 h-11 sm:h-9 text-base sm:text-sm" data-testid="height-unit-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="ftin">ft/in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {heightUnit === "cm" ? (
                      <div>
                        <Input
                          type="number"
                          placeholder="e.g., 175"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className={`h-14 sm:h-12 text-lg sm:text-base ${errors.height ? "border-red-500" : ""}`}
                          data-testid="height-cm-input"
                        />
                        {errors.height && <p className="text-red-500 text-sm mt-2">{errors.height}</p>}
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Feet"
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            className={`h-14 sm:h-12 text-lg sm:text-base ${errors.feet ? "border-red-500" : ""}`}
                            data-testid="height-feet-input"
                          />
                          {errors.feet && <p className="text-red-500 text-sm mt-2">{errors.feet}</p>}
                        </div>
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Inches"
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                            className={`h-14 sm:h-12 text-lg sm:text-base ${errors.inches ? "border-red-500" : ""}`}
                            data-testid="height-inches-input"
                          />
                          {errors.inches && <p className="text-red-500 text-sm mt-2">{errors.inches}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-300">Weight</Label>
                      <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as WeightUnit)}>
                        <SelectTrigger className="w-28 sm:w-24 h-11 sm:h-9 text-base sm:text-sm" data-testid="weight-unit-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder={weightUnit === "kg" ? "e.g., 70" : "e.g., 154"}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className={`h-14 sm:h-12 text-lg sm:text-base ${errors.weight ? "border-red-500" : ""}`}
                      data-testid="weight-input"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-2">{errors.weight}</p>}
                  </div>

                  <div className="space-y-3 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-300">Waist Circumference</Label>
                      <Select value={waistUnit} onValueChange={(v) => setWaistUnit(v as WaistUnit)}>
                        <SelectTrigger className="w-28 sm:w-24 h-11 sm:h-9 text-base sm:text-sm" data-testid="waist-unit-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="in">in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder={waistUnit === "cm" ? "e.g., 85" : "e.g., 33"}
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className={`h-14 sm:h-12 text-lg sm:text-base ${errors.waist ? "border-red-500" : ""}`}
                      data-testid="waist-input"
                    />
                    {errors.waist && <p className="text-red-500 text-sm mt-2">{errors.waist}</p>}
                  </div>

                  <div className="space-y-3 sm:space-y-3">
                    <Label className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-300">Age (optional)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-14 sm:h-12 text-lg sm:text-base"
                      data-testid="age-input"
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-3 md:col-span-2 xl:col-span-2">
                    <Label className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-300">Activity Level</Label>
                    <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
                      <SelectTrigger className="h-14 sm:h-12 text-base sm:text-base" data-testid="activity-level-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                        <SelectItem value="high">High (6-7 days/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <Button
                    onClick={calculateResults}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-4 sm:py-4 h-14 sm:h-auto text-base sm:text-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
                    data-testid="calculate-button"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate My Results
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="px-8 h-14 sm:h-auto py-4 text-base"
                    data-testid="reset-button"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          <AnimatePresence>
            {results && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-white dark:bg-gray-900/80 shadow-xl border-0 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2" />
                    <CardContent className="p-5 sm:p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                            <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">BMI</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Body Mass Index</p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Estimates weight relative to height.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="text-center mb-5 sm:mb-6">
                        <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3" data-testid="bmi-result">
                          {results.bmi}
                        </div>
                        <Badge className={`${results.bmiColor} px-4 sm:px-4 py-1.5 sm:py-1.5 text-sm font-semibold`}>{results.bmiCategory}</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3 sm:p-4">
                        <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          <strong className="font-semibold">PlantRx Tip:</strong> {getBmiTip(results.bmiCategory)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-white dark:bg-gray-900/80 shadow-xl border-0 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2" />
                    <CardContent className="p-5 sm:p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                            <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">WHtR</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Waist-to-Height Ratio</p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fat distribution indicator; often more useful than BMI.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="text-center mb-5 sm:mb-6">
                        <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3" data-testid="whtr-result">
                          {results.whtr}
                        </div>
                        <Badge className={`${results.whtrColor} px-4 sm:px-4 py-1.5 sm:py-1.5 text-sm font-semibold`}>{results.whtrCategory}</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3 sm:p-4">
                        <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          <strong className="font-semibold">PlantRx Tip:</strong> {getWhtrTip(results.whtrCategory)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-white dark:bg-gray-900/80 shadow-xl border-0 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2" />
                    <CardContent className="p-5 sm:p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
                            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Metabolic</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Health Score</p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Wellness score based on BMI, waist ratio, and activity.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="text-center mb-5 sm:mb-6">
                        <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-1" data-testid="metabolic-result">
                          {results.metabolicScore}
                        </div>
                        <div className="text-xl sm:text-2xl text-gray-400 dark:text-gray-500 mb-2 sm:mb-3">/ 100</div>
                        <Badge className={`${results.metabolicColor} px-4 sm:px-4 py-1.5 sm:py-1.5 text-sm font-semibold`}>{results.metabolicCategory}</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3 sm:p-4">
                        <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          <strong className="font-semibold">PlantRx Tip:</strong> {getMetabolicTip(results.metabolicScore)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeInSection className="mt-10 sm:mt-12 lg:mt-16">
            <div className="flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-amber-200/50 dark:border-amber-800/30">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-semibold text-amber-800 dark:text-amber-300 text-base sm:text-lg">Important Disclaimer</p>
                <p className="text-sm sm:text-base text-amber-700 dark:text-amber-400 leading-relaxed">
                  These calculators provide general wellness estimates only and are not intended as medical advice, diagnosis, or treatment. 
                  Individual health needs vary significantly. Please consult with a qualified healthcare provider for personalized guidance about your health.
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </>
  );
}
