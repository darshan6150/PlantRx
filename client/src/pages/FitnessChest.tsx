import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "wouter";
import { Dumbbell, Clock, Flame, Target, Play, ChevronDown, ChevronUp, ArrowLeft, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

const workouts = [
  {
    id: 1,
    name: "Push-Up Mastery",
    duration: 12,
    difficulty: "Beginner",
    calories: 80,
    exercises: [
      { name: "Standard Push-ups", sets: 3, reps: "10-15", description: "Hands shoulder-width, lower chest to floor, push back up with control." },
      { name: "Incline Push-ups", sets: 3, reps: "12", description: "Hands on elevated surface, easier variation to build strength." },
      { name: "Wide Push-ups", sets: 3, reps: "10", description: "Hands wider than shoulders to emphasize outer chest." },
      { name: "Knee Push-ups", sets: 3, reps: "15", description: "Knees on ground for reduced resistance, perfect form builder." },
    ],
    tips: ["Keep body in straight line", "Engage core throughout", "Progress to standard when ready"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 2,
    name: "Chest Press Techniques",
    duration: 16,
    difficulty: "Intermediate",
    calories: 140,
    exercises: [
      { name: "Dumbbell Bench Press", sets: 4, reps: "10", description: "Lie flat, press dumbbells up and together, control the descent." },
      { name: "Incline Dumbbell Press", sets: 3, reps: "12", description: "30-45 degree angle, targets upper chest development." },
      { name: "Decline Dumbbell Press", sets: 3, reps: "12", description: "Head lower than hips, emphasizes lower chest." },
      { name: "Dumbbell Flyes", sets: 3, reps: "12", description: "Wide arc motion, stretch at bottom, squeeze at top." },
      { name: "Close Grip Press", sets: 3, reps: "10", description: "Dumbbells together throughout, inner chest focus." },
    ],
    tips: ["Retract shoulder blades for stability", "Don't bounce at the bottom", "Full range of motion is key"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "Advanced Chest Building",
    duration: 22,
    difficulty: "Advanced",
    calories: 200,
    exercises: [
      { name: "Barbell Bench Press", sets: 5, reps: "5-8", description: "Classic compound movement, bar to mid-chest, explosive press." },
      { name: "Incline Barbell Press", sets: 4, reps: "8", description: "Upper chest builder, control the bar throughout." },
      { name: "Cable Crossovers", sets: 4, reps: "12", description: "High to low cable movement, squeeze in the middle." },
      { name: "Chest Dips", sets: 4, reps: "10", description: "Lean forward to target chest, go deep for full stretch." },
      { name: "Weighted Push-ups", sets: 3, reps: "12", description: "Plate on back for added resistance during push-ups." },
      { name: "Low Cable Flyes", sets: 3, reps: "12", description: "Low to high movement, targets upper inner chest." },
    ],
    tips: ["Use a spotter for heavy bench", "Focus on mind-muscle connection", "Include variety for complete development"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    name: "Chest & Core Combo",
    duration: 20,
    difficulty: "Intermediate",
    calories: 160,
    exercises: [
      { name: "Stability Ball Push-ups", sets: 3, reps: "12", description: "Hands on ball, engage core for balance while pressing." },
      { name: "Plank to Push-up", sets: 3, reps: "10", description: "Alternate between forearm plank and push-up position." },
      { name: "Medicine Ball Chest Pass", sets: 3, reps: "15", description: "Explosive chest pass against wall, catch and repeat." },
      { name: "Decline Crunches with Press", sets: 3, reps: "12", description: "Combine decline crunch with dumbbell press at top." },
      { name: "Push-up to Side Plank", sets: 3, reps: "8 each side", description: "Push-up, then rotate to side plank, alternate." },
    ],
    tips: ["Excellent for functional strength", "Control breathing throughout", "Great for athletic performance"],
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 5,
    name: "High-Volume Pump",
    duration: 25,
    difficulty: "Intermediate",
    calories: 180,
    exercises: [
      { name: "Push-up Ladder", sets: 1, reps: "1-10-1", description: "1 rep, rest, 2 reps, rest... up to 10 and back down." },
      { name: "Superset: Press + Flyes", sets: 4, reps: "10 each", description: "Dumbbell press immediately followed by flyes, no rest." },
      { name: "21s - Bench Press", sets: 3, reps: "21 total", description: "7 lower half, 7 upper half, 7 full reps." },
      { name: "Drop Set Flyes", sets: 3, reps: "10-10-10", description: "Three weight drops without rest for maximum pump." },
      { name: "Finisher Push-ups", sets: 1, reps: "Max", description: "As many reps as possible to failure." },
    ],
    tips: ["Prepare for an intense pump", "Stay hydrated throughout", "This is a muscle-building finisher"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 6,
    name: "Bodyweight Chest Blast",
    duration: 18,
    difficulty: "Beginner",
    calories: 120,
    exercises: [
      { name: "Standard Push-ups", sets: 4, reps: "15", description: "Foundation exercise, perfect form is essential." },
      { name: "Diamond Push-ups", sets: 3, reps: "10", description: "Hands form diamond, targets inner chest and triceps." },
      { name: "Archer Push-ups", sets: 3, reps: "8 each side", description: "Wide stance, shift weight to one arm, great for strength." },
      { name: "Explosive Push-ups", sets: 3, reps: "8", description: "Push up explosively, hands leave ground briefly." },
      { name: "Slow Negative Push-ups", sets: 3, reps: "6", description: "5-second descent, explosive push up, builds strength." },
      { name: "Hindu Push-ups", sets: 3, reps: "10", description: "Flowing movement through pike, push-up, and upward dog." },
    ],
    tips: ["No equipment needed", "Perfect for home workouts", "Progress difficulty over time"],
    color: "from-green-500 to-green-600",
  },
];

export default function FitnessChest() {
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <UpgradeInterstitial feature={Feature.INTERACTIVE_MUSCLE_TRAINER}>
      <Helmet>
        <title>Chest Workouts - Fitness Training | PlantRx</title>
        <meta name="description" content="Build a powerful chest with comprehensive workout programs. From push-up mastery to advanced muscle building." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Chest Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Build a stronger chest with {workouts.length} comprehensive programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{workouts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Workouts</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{workouts.reduce((acc, w) => acc + w.exercises.length, 0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Exercises</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{Math.round(workouts.reduce((acc, w) => acc + w.calories, 0) / workouts.length)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg Calories</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / workouts.length)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg Minutes</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {workouts.map((workout, index) => (
              <Collapsible
                key={workout.id}
                open={expandedWorkout === workout.id}
                onOpenChange={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
              >
                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${workout.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-xl text-gray-900 dark:text-white">{workout.name}</CardTitle>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <Badge className={getDifficultyColor(workout.difficulty)}>
                                <Star className="w-3 h-3 mr-1" />
                                {workout.difficulty}
                              </Badge>
                              <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="w-4 h-4 mr-1" />
                                {workout.duration} min
                              </span>
                              <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Flame className="w-4 h-4 mr-1 text-orange-500" />
                                {workout.calories} cal
                              </span>
                              <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Target className="w-4 h-4 mr-1" />
                                {workout.exercises.length} exercises
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button className={`bg-gradient-to-r ${workout.color} hover:opacity-90 text-white hidden sm:flex`}>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                          {expandedWorkout === workout.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0 border-t border-gray-200 dark:border-gray-700">
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          Exercises
                        </h4>
                        <div className="grid gap-3">
                          {workout.exercises.map((exercise, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.sets} sets × {exercise.reps}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{exercise.description}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Pro Tips</h5>
                          <ul className="space-y-1">
                            {workout.tips.map((tip, idx) => (
                              <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                                <span className="text-yellow-500">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </UpgradeInterstitial>
  );
}
