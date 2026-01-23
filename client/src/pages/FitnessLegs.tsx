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
    name: "Leg Strengthening Fundamentals",
    duration: 18,
    difficulty: "Beginner",
    calories: 120,
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "12-15", description: "Stand with feet shoulder-width apart, lower your body as if sitting back into a chair, keep your chest up and core engaged." },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", description: "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees." },
      { name: "Glute Bridges", sets: 3, reps: "15", description: "Lie on your back with knees bent, lift hips toward the ceiling by squeezing your glutes." },
      { name: "Calf Raises", sets: 3, reps: "20", description: "Stand on the balls of your feet, raise your heels as high as possible, then lower slowly." },
    ],
    tips: ["Focus on form over speed", "Keep your knees aligned with your toes", "Breathe steadily throughout"],
    color: "from-green-500 to-green-600",
  },
  {
    id: 2,
    name: "Squats & Lunges Mastery",
    duration: 20,
    difficulty: "Intermediate",
    calories: 180,
    exercises: [
      { name: "Goblet Squats", sets: 4, reps: "12", description: "Hold a weight at chest level, perform a deep squat keeping your elbows inside your knees." },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", description: "Place rear foot on an elevated surface, lower into a lunge position." },
      { name: "Sumo Squats", sets: 3, reps: "15", description: "Wide stance with toes pointed out, squat down keeping your back straight." },
      { name: "Reverse Lunges", sets: 3, reps: "12 each leg", description: "Step backward into a lunge, keeping front knee over ankle." },
      { name: "Jump Squats", sets: 3, reps: "10", description: "Perform a squat then explosively jump up, land softly." },
    ],
    tips: ["Warm up thoroughly before starting", "Progress weights gradually", "Rest 60-90 seconds between sets"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "Advanced Leg Building",
    duration: 28,
    difficulty: "Advanced",
    calories: 280,
    exercises: [
      { name: "Barbell Back Squats", sets: 5, reps: "8", description: "Position bar on upper back, squat below parallel while maintaining proper form." },
      { name: "Romanian Deadlifts", sets: 4, reps: "10", description: "Hinge at hips with slight knee bend, lower weight along legs, feel hamstring stretch." },
      { name: "Leg Press", sets: 4, reps: "12", description: "Push platform away using full leg drive, control the descent." },
      { name: "Walking Lunges with Weights", sets: 3, reps: "12 each leg", description: "Hold dumbbells at sides, perform controlled walking lunges." },
      { name: "Box Jumps", sets: 4, reps: "8", description: "Jump onto a stable box, step down with control." },
      { name: "Single Leg RDL", sets: 3, reps: "10 each leg", description: "Balance on one leg while hinging forward, keeping back straight." },
    ],
    tips: ["Use a spotter for heavy squats", "Focus on eccentric control", "Proper rest between sessions is crucial"],
    color: "from-red-500 to-red-600",
  },
  {
    id: 4,
    name: "Explosive Power Training",
    duration: 25,
    difficulty: "Advanced",
    calories: 250,
    exercises: [
      { name: "Power Cleans", sets: 4, reps: "6", description: "Explosive hip extension to pull weight from floor to shoulders." },
      { name: "Depth Jumps", sets: 4, reps: "8", description: "Step off box, immediately jump up upon landing." },
      { name: "Tuck Jumps", sets: 3, reps: "10", description: "Jump explosively, bringing knees to chest at the peak." },
      { name: "Broad Jumps", sets: 4, reps: "6", description: "Jump forward as far as possible, land softly with bent knees." },
      { name: "Sprint Intervals", sets: 6, reps: "30 sec", description: "Maximum effort sprints with 90 second recovery." },
    ],
    tips: ["Ensure full recovery between sets", "Quality over quantity", "Stop if form deteriorates"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 5,
    name: "Leg Flexibility & Mobility",
    duration: 22,
    difficulty: "Beginner",
    calories: 90,
    exercises: [
      { name: "Deep Squat Hold", sets: 3, reps: "30 sec", description: "Hold a deep squat position, keeping heels flat on ground." },
      { name: "Pigeon Pose", sets: 2, reps: "60 sec each", description: "Hip opener stretch targeting the glutes and hip flexors." },
      { name: "Hamstring Stretch", sets: 3, reps: "45 sec each", description: "Seated or standing forward fold to stretch hamstrings." },
      { name: "Quad Stretch", sets: 2, reps: "45 sec each", description: "Pull heel to glute while standing or lying down." },
      { name: "Ankle Circles", sets: 3, reps: "10 each direction", description: "Rotate ankles to improve mobility and warm up joints." },
      { name: "Hip Circles", sets: 2, reps: "10 each direction", description: "Large circles with the knee to open hip joints." },
    ],
    tips: ["Never force a stretch", "Breathe deeply throughout", "Great for recovery days"],
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 6,
    name: "HIIT Leg Burner",
    duration: 15,
    difficulty: "Intermediate",
    calories: 200,
    exercises: [
      { name: "Jump Squats", sets: 4, reps: "30 sec on/15 sec off", description: "Explosive squat jumps at maximum intensity." },
      { name: "Alternating Lunges", sets: 4, reps: "30 sec on/15 sec off", description: "Quick alternating forward lunges." },
      { name: "High Knees", sets: 4, reps: "30 sec on/15 sec off", description: "Drive knees up rapidly while staying on balls of feet." },
      { name: "Burpees", sets: 4, reps: "30 sec on/15 sec off", description: "Full body explosive movement including a squat jump." },
      { name: "Mountain Climbers", sets: 4, reps: "30 sec on/15 sec off", description: "Rapid alternating knee drives in plank position." },
    ],
    tips: ["Stay hydrated", "Push through the burn", "Modify intensity if needed"],
    color: "from-orange-500 to-orange-600",
  },
];

export default function FitnessLegs() {
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
        <title>Leg Workouts - Fitness Training | PlantRx</title>
        <meta name="description" content="Comprehensive leg workout routines for building strength and endurance. From beginner fundamentals to advanced power training." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/fitness" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fitness
          </Link>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Leg Workouts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Build powerful legs with {workouts.length} comprehensive workout programs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{workouts.length}</div>
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
                            <div className="flex items-center gap-4 mt-2">
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
                          <Button className={`bg-gradient-to-r ${workout.color} hover:opacity-90 text-white`}>
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
