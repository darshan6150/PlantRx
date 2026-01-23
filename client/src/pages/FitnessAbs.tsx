import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "wouter";
import { Heart, Clock, Flame, Target, Play, ChevronDown, ChevronUp, ArrowLeft, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

const workouts = [
  {
    id: 1,
    name: "Core Fundamentals",
    duration: 10,
    difficulty: "Beginner",
    calories: 60,
    exercises: [
      { name: "Dead Bug", sets: 3, reps: "10 each side", description: "Lie on back, extend opposite arm and leg while maintaining flat back." },
      { name: "Bird Dog", sets: 3, reps: "10 each side", description: "On all fours, extend opposite arm and leg, hold briefly." },
      { name: "Glute Bridge", sets: 3, reps: "15", description: "Lie on back, lift hips squeezing glutes, lower with control." },
      { name: "Basic Plank", sets: 3, reps: "30 sec", description: "Forearms and toes, body straight, engage core throughout." },
    ],
    tips: ["Focus on keeping lower back flat", "Breathe steadily throughout", "Quality over quantity"],
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 2,
    name: "Ab Definition Training",
    duration: 15,
    difficulty: "Intermediate",
    calories: 100,
    exercises: [
      { name: "Crunches", sets: 4, reps: "20", description: "Lift shoulders off ground, squeeze at top, lower with control." },
      { name: "Bicycle Crunches", sets: 3, reps: "20 each side", description: "Twist to bring elbow to opposite knee, alternate sides." },
      { name: "Leg Raises", sets: 3, reps: "15", description: "Lie flat, raise legs to 90 degrees, lower slowly without touching ground." },
      { name: "Russian Twists", sets: 3, reps: "20 total", description: "Seated, lean back slightly, rotate torso side to side with weight." },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", description: "Plank position, drive knees to chest alternating quickly." },
    ],
    tips: ["Don't pull on your neck during crunches", "Control the movement on leg raises", "Keep core tight during mountain climbers"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "Advanced Core Strength",
    duration: 20,
    difficulty: "Advanced",
    calories: 150,
    exercises: [
      { name: "Dragon Flags", sets: 3, reps: "8", description: "Hold bench, lift body up and lower while keeping straight." },
      { name: "Hanging Leg Raises", sets: 4, reps: "12", description: "Hang from bar, raise legs to 90 degrees or higher." },
      { name: "Ab Wheel Rollouts", sets: 3, reps: "10", description: "Roll wheel forward extending body, roll back maintaining tension." },
      { name: "Toes to Bar", sets: 3, reps: "10", description: "Hang from bar, swing legs up to touch bar with toes." },
      { name: "L-Sit Hold", sets: 3, reps: "20 sec", description: "Support on bars or floor, legs extended horizontal." },
      { name: "Windshield Wipers", sets: 3, reps: "10 each side", description: "Hanging or lying, legs together rotate side to side." },
    ],
    tips: ["These exercises require solid core foundation", "Progress slowly to avoid injury", "Focus on quality reps"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 4,
    name: "Plank Variations",
    duration: 12,
    difficulty: "Intermediate",
    calories: 80,
    exercises: [
      { name: "Standard Plank", sets: 3, reps: "45 sec", description: "Forearms down, body straight from head to heels." },
      { name: "Side Plank", sets: 3, reps: "30 sec each", description: "On one forearm, body in straight line, hold each side." },
      { name: "Plank with Shoulder Taps", sets: 3, reps: "10 each side", description: "High plank, tap opposite shoulder minimizing hip rotation." },
      { name: "Plank Up-Downs", sets: 3, reps: "10", description: "Transition from forearm to high plank position and back." },
      { name: "Reverse Plank", sets: 3, reps: "30 sec", description: "Face up, support on hands and heels, hips lifted." },
      { name: "Plank Jacks", sets: 3, reps: "20", description: "Plank position, jump feet out and in like jumping jacks." },
    ],
    tips: ["Keep hips level throughout", "Engage glutes for stability", "Don't hold your breath"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 5,
    name: "HIIT Core Burner",
    duration: 15,
    difficulty: "Advanced",
    calories: 180,
    exercises: [
      { name: "Burpees", sets: 4, reps: "30 sec", description: "Full burpee with push-up, explosive jump at top." },
      { name: "High Knees", sets: 4, reps: "30 sec", description: "Run in place driving knees high, pump arms." },
      { name: "Mountain Climbers", sets: 4, reps: "30 sec", description: "Fast knee drives in plank position." },
      { name: "Plank Hold", sets: 4, reps: "30 sec", description: "Active recovery, maintain perfect plank form." },
      { name: "Bicycle Crunches", sets: 4, reps: "30 sec", description: "Fast alternating elbow to knee rotations." },
    ],
    tips: ["Work at maximum effort during work periods", "Rest 15 seconds between exercises", "Stay hydrated"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 6,
    name: "Lower Abs Focus",
    duration: 15,
    difficulty: "Intermediate",
    calories: 90,
    exercises: [
      { name: "Reverse Crunches", sets: 4, reps: "15", description: "Lift hips off ground curling pelvis toward chest." },
      { name: "Hanging Knee Raises", sets: 3, reps: "12", description: "Hang from bar, bring knees to chest with control." },
      { name: "Lying Leg Raises", sets: 3, reps: "15", description: "Legs straight, raise to 90 degrees, lower slowly." },
      { name: "Scissor Kicks", sets: 3, reps: "20 each leg", description: "Legs slightly off ground, alternate raising each leg." },
      { name: "Dead Bug", sets: 3, reps: "12 each side", description: "Lower opposite arm and leg while keeping back flat." },
      { name: "Hollow Hold", sets: 3, reps: "30 sec", description: "Arms overhead, legs extended, back pressed to floor." },
    ],
    tips: ["Keep lower back pressed to floor", "Don't let legs swing during hangs", "Control is more important than speed"],
    color: "from-green-500 to-green-600",
  },
];

export default function FitnessAbs() {
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
        <title>Ab Workouts - Core Training | PlantRx</title>
        <meta name="description" content="Build core strength and defined abs with comprehensive workout programs. From fundamentals to advanced training." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Ab Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Build core strength with {workouts.length} targeted programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{workouts.length}</div>
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
