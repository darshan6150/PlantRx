import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "wouter";
import { Activity, Clock, Flame, Target, Play, ChevronDown, ChevronUp, ArrowLeft, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

const workouts = [
  {
    id: 1,
    name: "Back Strengthening Basics",
    duration: 15,
    difficulty: "Beginner",
    calories: 100,
    exercises: [
      { name: "Superman Hold", sets: 3, reps: "30 sec", description: "Lie face down, lift arms and legs off ground, hold." },
      { name: "Reverse Snow Angels", sets: 3, reps: "12", description: "Face down, arms overhead to sides in arc motion." },
      { name: "Bird Dogs", sets: 3, reps: "10 each side", description: "Quadruped position, extend opposite arm and leg, hold briefly." },
      { name: "Wall Slides", sets: 3, reps: "12", description: "Back against wall, slide arms up and down maintaining contact." },
    ],
    tips: ["Focus on squeezing shoulder blades together", "These exercises improve posture", "Great for desk workers"],
    color: "from-green-500 to-green-600",
  },
  {
    id: 2,
    name: "Pull & Row Variations",
    duration: 18,
    difficulty: "Intermediate",
    calories: 140,
    exercises: [
      { name: "Dumbbell Rows", sets: 4, reps: "10 each arm", description: "Support with one arm, row dumbbell to hip, squeeze at top." },
      { name: "Inverted Rows", sets: 3, reps: "12", description: "Under a bar, pull chest to bar, body stays straight." },
      { name: "Face Pulls", sets: 3, reps: "15", description: "Cable to face height, pull to cheeks with external rotation." },
      { name: "Seated Cable Rows", sets: 3, reps: "12", description: "Pull cable to lower chest, squeeze shoulder blades." },
      { name: "Resistance Band Pulls", sets: 3, reps: "15", description: "Band attached, pull apart at chest level." },
    ],
    tips: ["Lead with your elbows not your hands", "Squeeze at the peak contraction", "Control the negative portion"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "Complete Back Development",
    duration: 24,
    difficulty: "Advanced",
    calories: 200,
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "8-10", description: "Wide grip, pull chin above bar, controlled descent." },
      { name: "Barbell Rows", sets: 4, reps: "8", description: "Hinge at hips, row bar to lower chest, keep back flat." },
      { name: "Lat Pulldowns", sets: 4, reps: "10", description: "Wide grip, pull to upper chest, squeeze lats." },
      { name: "T-Bar Rows", sets: 3, reps: "10", description: "Straddle bar, row with neutral grip, great for thickness." },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12", description: "Arms straight, pull cable down engaging lats." },
      { name: "Shrugs", sets: 3, reps: "15", description: "Heavy weights at sides, shrug shoulders to ears." },
    ],
    tips: ["Warm up rotator cuffs before pulling", "Vary grip width for complete development", "Train back twice per week for best results"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    name: "Posture Correction",
    duration: 20,
    difficulty: "Beginner",
    calories: 90,
    exercises: [
      { name: "Chin Tucks", sets: 3, reps: "15", description: "Pull chin back creating double chin, hold briefly." },
      { name: "Thoracic Extensions", sets: 3, reps: "12", description: "Over foam roller, extend upper back over it." },
      { name: "Cat-Cow Stretches", sets: 3, reps: "10", description: "Alternate arching and rounding spine on all fours." },
      { name: "Doorway Chest Stretch", sets: 3, reps: "30 sec each", description: "Arm on doorframe, lean forward to stretch chest." },
      { name: "Wall Angels", sets: 3, reps: "10", description: "Back to wall, slide arms up and down keeping contact." },
      { name: "Prone Y Raises", sets: 3, reps: "12", description: "Face down, arms in Y position, lift and lower." },
    ],
    tips: ["Perfect for desk workers", "Do these exercises daily", "Combine with regular breaks from sitting"],
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 5,
    name: "Power Back Training",
    duration: 30,
    difficulty: "Advanced",
    calories: 280,
    exercises: [
      { name: "Deadlifts", sets: 5, reps: "5", description: "Conventional deadlift, drive through heels, lock out at top." },
      { name: "Weighted Pull-ups", sets: 4, reps: "6", description: "Add weight belt, pull explosively, control descent." },
      { name: "Pendlay Rows", sets: 4, reps: "6", description: "Explosive row from dead stop on floor." },
      { name: "Rack Pulls", sets: 4, reps: "5", description: "Deadlift from knee height, heavier loads for upper back." },
      { name: "Kroc Rows", sets: 2, reps: "15-20 each", description: "Heavy dumbbell rows with slight body English." },
    ],
    tips: ["Focus on explosive power", "Perfect deadlift form before adding weight", "Allow adequate recovery between sessions"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 6,
    name: "Bodyweight Back Builder",
    duration: 20,
    difficulty: "Intermediate",
    calories: 130,
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "Max", description: "Wide grip, controlled reps, full range of motion." },
      { name: "Inverted Rows", sets: 4, reps: "12", description: "Body horizontal under bar, pull chest to bar." },
      { name: "Australian Pull-ups", sets: 3, reps: "15", description: "Feet elevated inverted rows, challenging variation." },
      { name: "Towel Pull-ups", sets: 3, reps: "6", description: "Grip towels for intense forearm and grip work." },
      { name: "Scapular Pull-ups", sets: 3, reps: "12", description: "Hang, retract shoulder blades only, no arm bend." },
      { name: "Superman Pulses", sets: 3, reps: "20", description: "Superman position, small pulsing movements." },
    ],
    tips: ["Excellent for calisthenics enthusiasts", "Progress with harder variations", "Can be done anywhere with a bar"],
    color: "from-orange-500 to-orange-600",
  },
];

export default function FitnessBack() {
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
        <title>Back Workouts - Fitness Training | PlantRx</title>
        <meta name="description" content="Strengthen your back and improve posture with comprehensive workout programs. From basics to advanced power training." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Back Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Build a stronger back with {workouts.length} comprehensive programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{workouts.length}</div>
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
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / workouts.length)}</div>
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
