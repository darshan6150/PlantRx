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
    name: "Arm Toning Basics",
    duration: 15,
    difficulty: "Beginner",
    calories: 100,
    exercises: [
      { name: "Bicep Curls", sets: 3, reps: "12-15", description: "Stand with dumbbells at sides, curl weights toward shoulders keeping elbows stationary." },
      { name: "Tricep Dips", sets: 3, reps: "10-12", description: "Using a chair or bench, lower your body by bending elbows, then push back up." },
      { name: "Hammer Curls", sets: 3, reps: "12", description: "Curl weights with palms facing each other to target the brachialis." },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", description: "Hold weight overhead with both hands, lower behind head, then extend." },
    ],
    tips: ["Keep your core engaged throughout", "Control the weight, don't swing", "Squeeze at the top of each curl"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 2,
    name: "Bicep Blast",
    duration: 20,
    difficulty: "Intermediate",
    calories: 150,
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: "10", description: "Grip barbell shoulder-width, curl with strict form and controlled tempo." },
      { name: "Preacher Curls", sets: 3, reps: "12", description: "Use a preacher bench to isolate biceps, preventing body momentum." },
      { name: "Incline Dumbbell Curls", sets: 3, reps: "10 each arm", description: "Lie back on incline bench for a deeper stretch at the bottom." },
      { name: "Concentration Curls", sets: 3, reps: "12 each arm", description: "Seated, rest elbow on inner thigh and curl with full focus." },
      { name: "Cable Curls", sets: 3, reps: "15", description: "Constant tension throughout the movement using cable machine." },
    ],
    tips: ["Supinate your wrists at the top for peak contraction", "Don't let your elbows drift forward", "Use a full range of motion"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    name: "Tricep Torcher",
    duration: 22,
    difficulty: "Intermediate",
    calories: 160,
    exercises: [
      { name: "Close-Grip Bench Press", sets: 4, reps: "10", description: "Hands shoulder-width on barbell, focus on tricep engagement during press." },
      { name: "Skull Crushers", sets: 3, reps: "12", description: "Lie flat, lower weights toward forehead, extend arms keeping elbows fixed." },
      { name: "Rope Pushdowns", sets: 3, reps: "15", description: "Cable pushdowns with rope attachment, spread at the bottom." },
      { name: "Diamond Push-ups", sets: 3, reps: "12", description: "Hands form a diamond shape, elbows close to body during push-up." },
      { name: "Kickbacks", sets: 3, reps: "12 each arm", description: "Bent over, extend arm backward, squeezing tricep at full extension." },
    ],
    tips: ["Keep elbows tucked for maximum tricep activation", "Pause at the bottom of skull crushers", "Control the negative portion"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 4,
    name: "Forearm Strength Builder",
    duration: 18,
    difficulty: "Beginner",
    calories: 90,
    exercises: [
      { name: "Wrist Curls", sets: 3, reps: "20", description: "Rest forearms on bench, curl wrists upward holding dumbbells." },
      { name: "Reverse Wrist Curls", sets: 3, reps: "20", description: "Same as wrist curls but with palms facing down." },
      { name: "Farmer's Walks", sets: 3, reps: "40 steps", description: "Carry heavy weights at your sides, walk with good posture." },
      { name: "Plate Pinch Hold", sets: 3, reps: "30 sec", description: "Pinch weight plates between fingers and thumb, hold for time." },
      { name: "Dead Hangs", sets: 3, reps: "30 sec", description: "Hang from a pull-up bar with full grip to build grip strength." },
    ],
    tips: ["Strong forearms improve all upper body lifts", "Train grip 2-3 times per week", "Use fat grips for extra challenge"],
    color: "from-green-500 to-green-600",
  },
  {
    id: 5,
    name: "Complete Arm Workout",
    duration: 35,
    difficulty: "Advanced",
    calories: 280,
    exercises: [
      { name: "Weighted Chin-ups", sets: 4, reps: "8", description: "Supinated grip pull-ups with added weight for bicep emphasis." },
      { name: "EZ Bar Curls", sets: 4, reps: "10", description: "Use EZ bar for comfortable wrist position, strict form." },
      { name: "Close-Grip Bench Press", sets: 4, reps: "8", description: "Heavy compound movement for tricep mass." },
      { name: "Dips", sets: 4, reps: "10", description: "Parallel bar dips, lean slightly forward for tricep focus." },
      { name: "Spider Curls", sets: 3, reps: "12", description: "Face-down on incline bench, arms hanging, curl with full squeeze." },
      { name: "Overhead Rope Extensions", sets: 3, reps: "15", description: "Face away from cable, extend overhead with rope." },
      { name: "21s", sets: 2, reps: "21 total", description: "7 lower half reps, 7 upper half reps, 7 full reps for finisher." },
    ],
    tips: ["Superset biceps and triceps for efficiency", "Allow 48 hours recovery before training arms again", "Progressively overload weekly"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 6,
    name: "Bodyweight Arms",
    duration: 20,
    difficulty: "Beginner",
    calories: 120,
    exercises: [
      { name: "Push-ups", sets: 4, reps: "15", description: "Standard push-ups with hands shoulder-width, engage chest and triceps." },
      { name: "Diamond Push-ups", sets: 3, reps: "12", description: "Hands together forming diamond, intense tricep focus." },
      { name: "Pike Push-ups", sets: 3, reps: "10", description: "Hips high in V position, targets shoulders and triceps." },
      { name: "Chin-up Hold", sets: 3, reps: "20 sec", description: "Hold at the top of a chin-up, chin above bar." },
      { name: "Bench Dips", sets: 3, reps: "15", description: "Feet elevated, hands on bench, lower and press up." },
      { name: "Plank to Push-up", sets: 3, reps: "10", description: "Transition from forearm plank to full push-up position." },
    ],
    tips: ["Perfect for home or travel workouts", "Focus on time under tension", "Elevate feet to increase difficulty"],
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function FitnessArms() {
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
        <title>Arm Workouts - Fitness Training | PlantRx</title>
        <meta name="description" content="Build stronger arms with targeted bicep and tricep workouts. From beginner toning to advanced muscle building." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Arm Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Build powerful biceps and triceps with {workouts.length} targeted programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{workouts.length}</div>
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
