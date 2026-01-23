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
    name: "Shoulder Press Fundamentals",
    duration: 15,
    difficulty: "Beginner",
    calories: 110,
    exercises: [
      { name: "Seated Dumbbell Press", sets: 3, reps: "12", description: "Sit with back supported, press dumbbells overhead with controlled movement." },
      { name: "Front Raises", sets: 3, reps: "12", description: "Lift dumbbells in front to shoulder height, keeping arms straight." },
      { name: "Lateral Raises", sets: 3, reps: "12", description: "Raise arms to the sides, slight bend in elbows, control the descent." },
      { name: "Rear Delt Flyes", sets: 3, reps: "12", description: "Bent over, raise arms to the sides targeting rear deltoids." },
    ],
    tips: ["Start light to perfect form", "Keep slight bend in elbows during raises", "Don't shrug shoulders during presses"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 2,
    name: "Lateral Raise & Flyes",
    duration: 18,
    difficulty: "Intermediate",
    calories: 130,
    exercises: [
      { name: "Cable Lateral Raises", sets: 4, reps: "12 each arm", description: "Constant tension with cable, raise arm to shoulder height." },
      { name: "Incline Reverse Flyes", sets: 3, reps: "12", description: "Lie face-down on incline bench, fly motion targeting rear delts." },
      { name: "Single Arm Lateral Raise", sets: 3, reps: "10 each", description: "Focus on one shoulder at a time for better mind-muscle connection." },
      { name: "Bent Over Lateral Raises", sets: 3, reps: "15", description: "Hinge at hips, raise arms out to sides." },
      { name: "Face Pulls", sets: 3, reps: "15", description: "Cable pull to face level, externally rotate at the end." },
    ],
    tips: ["Use lighter weight for isolation exercises", "Focus on the squeeze at the top", "Control the negative for muscle growth"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "Complete Shoulder Complex",
    duration: 25,
    difficulty: "Advanced",
    calories: 200,
    exercises: [
      { name: "Barbell Overhead Press", sets: 4, reps: "8", description: "Standing press, bar from chest to overhead with full lockout." },
      { name: "Arnold Press", sets: 4, reps: "10", description: "Rotating dumbbell press hitting all three deltoid heads." },
      { name: "Upright Rows", sets: 3, reps: "12", description: "Pull bar to chin level, elbows lead the movement." },
      { name: "Cable Front Raises", sets: 3, reps: "12", description: "Constant tension front raise using cable machine." },
      { name: "Machine Lateral Raises", sets: 3, reps: "15", description: "Controlled isolation movement for side delts." },
      { name: "Rear Delt Machine", sets: 3, reps: "15", description: "Reverse pec deck for complete rear delt development." },
    ],
    tips: ["Warm up rotator cuffs before heavy pressing", "Keep core tight during overhead movements", "Train all three heads equally"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 4,
    name: "Rotator Cuff Strength",
    duration: 15,
    difficulty: "Beginner",
    calories: 70,
    exercises: [
      { name: "External Rotation", sets: 3, reps: "15 each", description: "Elbow at side, rotate forearm outward with light resistance." },
      { name: "Internal Rotation", sets: 3, reps: "15 each", description: "Elbow at side, rotate forearm inward with controlled movement." },
      { name: "Shoulder Circles", sets: 3, reps: "10 each direction", description: "Arms extended, small circles progressing to larger." },
      { name: "Band Pull-Aparts", sets: 3, reps: "20", description: "Hold band at shoulder width, pull apart to shoulder height." },
      { name: "YTWL Pattern", sets: 2, reps: "10 each", description: "Lie face down, form Y, T, W, and L shapes with arms." },
    ],
    tips: ["Essential for injury prevention", "Use light resistance, focus on control", "Perform before heavy shoulder work"],
    color: "from-green-500 to-green-600",
  },
  {
    id: 5,
    name: "Power Shoulders",
    duration: 30,
    difficulty: "Advanced",
    calories: 250,
    exercises: [
      { name: "Push Press", sets: 5, reps: "6", description: "Use leg drive to press heavier weight overhead explosively." },
      { name: "Landmine Press", sets: 4, reps: "10 each", description: "Angled pressing motion, easier on shoulders than straight overhead." },
      { name: "Z Press", sets: 3, reps: "8", description: "Seated on floor, no back support, pure shoulder strength." },
      { name: "Handstand Push-up Progression", sets: 3, reps: "8", description: "Wall-assisted handstand push-ups for bodyweight strength." },
      { name: "Behind Neck Press", sets: 3, reps: "10", description: "Light weight, controlled movement, excellent for rear delts." },
      { name: "Drop Set Lateral Raises", sets: 3, reps: "12-10-8", description: "Reduce weight each set without rest for maximum pump." },
    ],
    tips: ["Master technique before adding weight", "Keep core braced during explosive lifts", "Allow adequate recovery between sessions"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 6,
    name: "Bodyweight Shoulders",
    duration: 20,
    difficulty: "Intermediate",
    calories: 140,
    exercises: [
      { name: "Pike Push-ups", sets: 4, reps: "12", description: "Inverted V position, lower head toward ground, press up." },
      { name: "Wall Walks", sets: 3, reps: "5", description: "Walk hands up wall into handstand position and back down." },
      { name: "Decline Push-ups", sets: 3, reps: "15", description: "Feet elevated, targets upper chest and front delts." },
      { name: "Plank to Downward Dog", sets: 3, reps: "10", description: "Flow between plank and downward dog for dynamic stretch." },
      { name: "Arm Circles", sets: 3, reps: "30 sec each direction", description: "Extended arms, progressively larger circles." },
      { name: "Bear Crawl", sets: 3, reps: "30 sec", description: "Quadruped crawling for shoulder stability and endurance." },
    ],
    tips: ["Great for home or travel", "Progress to harder variations over time", "Maintain proper form throughout"],
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function FitnessShoulders() {
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
        <title>Shoulder Workouts - Fitness Training | PlantRx</title>
        <meta name="description" content="Build boulder shoulders with comprehensive workout programs. From rotator cuff health to advanced power training." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Shoulder Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Sculpt powerful shoulders with {workouts.length} targeted programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{workouts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Workouts</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{workouts.reduce((acc, w) => acc + w.exercises.length, 0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Exercises</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{Math.round(workouts.reduce((acc, w) => acc + w.calories, 0) / workouts.length)}</div>
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
