import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedButton } from "@/components/ProtectedButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Flame, 
  Target, 
  Repeat,
  User,
  UserX,
  Trophy,
  Zap,
  Heart,
  Timer,
  CheckCircle,
  Star,
  ArrowRight,
  ArrowLeft,
  Dumbbell,
  X,
  Apple,
  Droplets,
  Circle,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";



import type { Workout, WorkoutSession, UserWorkoutProgress } from "@shared/schema";

const MUSCLE_GROUPS = {
  chest: { name: "Chest", color: "#ef4444", position: { x: 150, y: 85 } },
  shoulders: { name: "Shoulders", color: "#f97316", position: { x: 150, y: 65 } },
  arms: { name: "Arms", color: "#eab308", position: { x: 98, y: 90 } },
  back: { name: "Back", color: "#22c55e", position: { x: 150, y: 115 } },
  core: { name: "Core", color: "#06b6d4", position: { x: 150, y: 185 } },
  legs: { name: "Legs", color: "#8b5cf6", position: { x: 150, y: 285 } },
  glutes: { name: "Glutes", color: "#ec4899", position: { x: 150, y: 230 } },
  calves: { name: "Calves", color: "#14b8a6", position: { x: 150, y: 365 } },
};

const MUSCLE_MOTIVATIONS = {
  chest: ["Build that powerful chest!", "Chest day is the best day!", "Push your limits!"],
  shoulders: ["Boulder shoulders incoming!", "Strong shoulders, strong foundation!", "Power through!"],
  arms: ["Arm day = gun show!", "Feel the burn, see the gains!", "Biceps and triceps unite!"],
  back: ["Build a strong foundation!", "Back width and thickness!", "Pull with purpose!"],
  core: ["Core strength = total strength!", "Abs are made here!", "Stability and power!"],
  legs: ["Never skip leg day!", "Legs are your foundation!", "Squat your way to strength!"],
  glutes: ["Glute gains for days!", "Power from your posterior!", "Strong glutes, strong you!"],
  calves: ["Calf raises to new heights!", "Standing strong!", "Every step counts!"],
};

export default function InteractiveMuscleMap() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<WorkoutSession>>({});
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  
  const workoutDetailsRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  
  const handleMuscleSelect = (muscle: string) => {
    if (selectedMuscle === muscle) {
      setSelectedMuscle(null);
    } else {
      setSelectedMuscle(muscle);
      setTimeout(() => {
        workoutDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Helper function to toggle card expansion
  const toggleCardExpansion = (workoutId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedCards(newExpanded);
  };

  // Fetch workouts for selected muscle using the correct endpoint
  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: [`/api/workouts/${selectedMuscle}`],
    enabled: !!selectedMuscle,
  });

  // Fetch user progress
  const { data: progress = [] } = useQuery<UserWorkoutProgress[]>({
    queryKey: ['/api/workout-progress'],
  });

  // Start workout session mutation
  const startSessionMutation = useMutation({
    mutationFn: (data: Partial<WorkoutSession>) => 
      apiRequest('/api/workout-sessions', 'POST', data),
    onSuccess: (session: WorkoutSession) => {
      setSessionData(session);
      queryClient.invalidateQueries({ queryKey: ['/api/workout-progress'] });
    },
  });

  // Complete workout session mutation
  const completeSessionMutation = useMutation({
    mutationFn: (sessionId: number) => 
      apiRequest(`/api/workout-sessions/${sessionId}/complete`, 'PATCH', {
        duration: workoutTimer,
        caloriesBurned: Math.round((workoutTimer / 60) * (currentWorkout?.caloriesPerMinute || 5)),
        completedSets: currentSet,
        completedAt: new Date(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-progress'] });
      setIsWorkoutActive(false);
      setCurrentWorkout(null);
      setWorkoutTimer(0);
      setCurrentSet(1);
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused]);

  const startWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    setCurrentSet(1);
    setIsPaused(false);
    
    // Start session tracking
    startSessionMutation.mutate({
      workoutId: workout.id,
      startedAt: new Date(),
      duration: 0,
      caloriesBurned: 0,
      completedSets: 0,
    });
  };

  const pauseWorkout = () => setIsPaused(!isPaused);

  const stopWorkout = () => {
    // Immediately exit workout interface
    setIsWorkoutActive(false);
    setCurrentWorkout(null);
    setWorkoutTimer(0);
    setCurrentSet(1);
    setIsPaused(false);
    
    // Complete session in background if exists
    if (sessionData.id) {
      completeSessionMutation.mutate(sessionData.id);
    }
  };

  const nextSet = () => {
    if (currentWorkout && currentSet < (currentWorkout.sets || 1)) {
      setCurrentSet(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivation = (muscle: string) => {
    const motivations = MUSCLE_MOTIVATIONS[muscle as keyof typeof MUSCLE_MOTIVATIONS] || ["Let's do this!"];
    return motivations[Math.floor(Math.random() * motivations.length)];
  };

  const getMuscleProgress = (muscle: string) => {
    const muscleProgress = progress.find(p => p.muscleGroup === muscle);
    return muscleProgress || { totalSessions: 0, weeklyFrequency: 0, strengthLevel: 'beginner' as const };
  };



  // Create individual queries for each muscle group to get session counts
  const chestWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/chest'] });
  const shouldersWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/shoulders'] });
  const armsWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/arms'] });
  const backWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/back'] });
  const coreWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/core'] });
  const legsWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/legs'] });
  const glutesWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/glutes'] });
  const calvesWorkouts = useQuery<Workout[]>({ queryKey: ['/api/workouts/calves'] });

  const getActualSessionCount = (muscle: string): number => {
    switch (muscle) {
      case 'chest': return chestWorkouts.data?.length || 0;
      case 'shoulders': return shouldersWorkouts.data?.length || 0;
      case 'arms': return armsWorkouts.data?.length || 0;
      case 'back': return backWorkouts.data?.length || 0;
      case 'core': return coreWorkouts.data?.length || 0;
      case 'legs': return legsWorkouts.data?.length || 0;
      case 'glutes': return glutesWorkouts.data?.length || 0;
      case 'calves': return calvesWorkouts.data?.length || 0;
      default: return 0;
    }
  };

  // Exercise instruction functions
  const getExerciseInstructions = (exerciseName: string): string[] => {
    const instructions: { [key: string]: string[] } = {
      // Chest exercises
      "Push-ups": [
        "Start in a plank position with hands slightly wider than shoulder-width apart",
        "Keep your body in a straight line from head to heels",
        "Lower your chest towards the floor by bending your elbows",
        "Push back up to the starting position with control",
        "Keep your core engaged throughout the movement"
      ],
      "Bench Press": [
        "Lie flat on the bench with your feet firmly on the ground",
        "Grip the barbell with hands slightly wider than shoulder-width",
        "Lower the bar to your chest with control",
        "Press the bar back up until your arms are fully extended",
        "Keep your shoulder blades retracted throughout"
      ],
      "Incline Dumbbell Press": [
        "Set the bench to a 30-45 degree incline",
        "Hold dumbbells at chest level with palms facing forward",
        "Press the weights up and slightly inward",
        "Lower with control back to chest level",
        "Keep your core tight and back pressed against the bench"
      ],
      // Shoulder exercises
      "Shoulder Press": [
        "Stand with feet hip-width apart, core engaged",
        "Hold dumbbells at shoulder height with palms facing forward",
        "Press weights straight up overhead",
        "Lower back to shoulder height with control",
        "Avoid arching your back excessively"
      ],
      "Lateral Raises": [
        "Stand with feet hip-width apart holding dumbbells at your sides",
        "Raise weights out to your sides until parallel with the floor",
        "Keep a slight bend in your elbows",
        "Lower with control back to starting position",
        "Focus on lifting with your shoulders, not momentum"
      ],
      // Arms exercises
      "Bicep Curls": [
        "Stand with feet hip-width apart, dumbbells at your sides",
        "Keep your elbows close to your torso",
        "Curl the weights up by contracting your biceps",
        "Squeeze at the top of the movement",
        "Lower back down with control"
      ],
      "Tricep Dips": [
        "Sit on the edge of a chair or bench with hands beside your hips",
        "Slide your hips off the edge, supporting your weight with your arms",
        "Lower your body by bending your elbows to 90 degrees",
        "Press back up to the starting position",
        "Keep your back close to the chair throughout"
      ],
      // Back exercises
      "Pull-ups": [
        "Hang from a pull-up bar with palms facing away",
        "Start with arms fully extended",
        "Pull your body up until your chin clears the bar",
        "Lower back down with control",
        "Keep your core engaged and avoid swinging"
      ],
      "Bent-over Rows": [
        "Stand with feet hip-width apart, holding dumbbells",
        "Bend forward at the hips, keeping your back straight",
        "Let the weights hang straight down from your shoulders",
        "Pull the weights up to your lower ribs",
        "Lower back down with control"
      ],
      // Core exercises
      "Plank": [
        "Start in a push-up position on your forearms",
        "Keep your body in a straight line from head to heels",
        "Engage your core muscles",
        "Hold the position while breathing normally",
        "Avoid letting your hips sag or pike up"
      ],
      "Crunches": [
        "Lie on your back with knees bent, feet flat on the floor",
        "Place your hands behind your head lightly",
        "Lift your shoulders off the ground by contracting your abs",
        "Hold briefly at the top",
        "Lower back down with control"
      ],
      // Legs exercises
      "Squats": [
        "Stand with feet slightly wider than hip-width apart",
        "Keep your chest up and core engaged",
        "Lower down as if sitting back into a chair",
        "Go down until your thighs are parallel to the floor",
        "Drive through your heels to return to standing"
      ],
      "Lunges": [
        "Stand with feet hip-width apart",
        "Step forward with one leg, lowering your hips",
        "Lower until both knees are at 90-degree angles",
        "Push back to the starting position",
        "Keep your torso upright throughout the movement"
      ],
      // Glutes exercises
      "Glute Bridges": [
        "Lie on your back with knees bent, feet flat on the floor",
        "Engage your core and squeeze your glutes",
        "Lift your hips up towards the ceiling",
        "Hold briefly at the top",
        "Lower back down with control"
      ],
      // Calves exercises
      "Calf Raises": [
        "Stand with feet hip-width apart",
        "Rise up onto your toes by contracting your calf muscles",
        "Hold briefly at the top",
        "Lower back down with control",
        "Keep your core engaged for balance"
      ]
    };
    
    // Find the best match for the exercise name
    const exactMatch = instructions[exerciseName];
    if (exactMatch) return exactMatch;
    
    // Try to find a partial match
    const partialMatch = Object.keys(instructions).find(key => 
      exerciseName.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(exerciseName.toLowerCase())
    );
    
    if (partialMatch) return instructions[partialMatch];
    
    // Default instructions
    return [
      "Position yourself correctly with proper form",
      "Start the movement slowly and with control",
      "Focus on the target muscles throughout the exercise",
      "Complete the full range of motion",
      "Breathe properly - exhale on exertion, inhale on return"
    ];
  };

  const getExerciseTips = (exerciseName: string): string[] => {
    const tips: { [key: string]: string[] } = {
      "Push-ups": [
        "Keep your head in neutral position, don't look up",
        "Engage your glutes to maintain straight body line",
        "If too difficult, modify on your knees",
        "Focus on quality over quantity"
      ],
      "Bench Press": [
        "Keep your feet planted firmly on the ground",
        "Maintain natural arch in your lower back",
        "Control the weight on the way down",
        "Use a spotter for safety with heavy weights"
      ],
      "Shoulder Press": [
        "Keep your core tight to protect your lower back",
        "Don't press directly overhead - slightly forward is better",
        "Start with lighter weights to master the form",
        "Keep your shoulders down and back"
      ],
      "Squats": [
        "Keep your knees tracking over your toes",
        "Don't let your knees cave inward",
        "Keep your weight in your heels",
        "Maintain a proud chest throughout"
      ],
      "Plank": [
        "Breathe normally, don't hold your breath",
        "Keep your hands directly under your shoulders",
        "Engage your entire core, not just abs",
        "Quality of hold is more important than duration"
      ]
    };
    
    const exactMatch = tips[exerciseName];
    if (exactMatch) return exactMatch;
    
    const partialMatch = Object.keys(tips).find(key => 
      exerciseName.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(exerciseName.toLowerCase())
    );
    
    if (partialMatch) return tips[partialMatch];
    
    return [
      "Start with lighter weight to master proper form",
      "Focus on controlled movements, not speed",
      "Keep your core engaged throughout",
      "Listen to your body and rest when needed"
    ];
  };

  const getExerciseMistakes = (exerciseName: string): string[] => {
    const mistakes: { [key: string]: string[] } = {
      "Push-ups": [
        "Letting hips sag or pike up too high",
        "Not going through full range of motion",
        "Moving too fast without control",
        "Flaring elbows out too wide"
      ],
      "Bench Press": [
        "Bouncing the bar off your chest",
        "Not controlling the eccentric (lowering) phase",
        "Lifting your head off the bench",
        "Using too much weight before mastering form"
      ],
      "Squats": [
        "Letting knees cave inward",
        "Not going deep enough",
        "Leaning too far forward",
        "Lifting heels off the ground"
      ],
      "Shoulder Press": [
        "Arching your back excessively",
        "Using momentum to lift the weight",
        "Not controlling the descent",
        "Pressing too far back behind your head"
      ],
      "Plank": [
        "Holding your breath",
        "Looking up instead of down",
        "Letting shoulders roll forward",
        "Holding for too long with poor form"
      ]
    };
    
    const exactMatch = mistakes[exerciseName];
    if (exactMatch) return exactMatch;
    
    const partialMatch = Object.keys(mistakes).find(key => 
      exerciseName.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(exerciseName.toLowerCase())
    );
    
    if (partialMatch) return mistakes[partialMatch];
    
    return [
      "Using too much weight too soon",
      "Rushing through the movement",
      "Not maintaining proper posture",
      "Ignoring pain or discomfort signals"
    ];
  };

  if (isWorkoutActive && currentWorkout) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
        <Button
          onClick={stopWorkout}
          variant="outline"
          size="lg"
          className="absolute top-4 left-4 z-60 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-2 border-emerald-400/30 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium sm:font-semibold backdrop-blur-sm text-sm sm:text-base"
        >
          <X className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center p-2 sm:p-4 flex-1">
          <Card className="w-full max-w-sm sm:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-purple-500/30 shadow-2xl">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
            
            <div className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold">{currentWorkout.name}</CardTitle>
              <p className="text-blue-100">{currentWorkout.description}</p>
              
              {/* Real-time Stats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6 md:grid-cols-4">
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold">{formatTime(workoutTimer)}</div>
                  <div className="text-xs sm:text-sm text-blue-100">Time Elapsed</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold">{currentSet}/{currentWorkout.sets}</div>
                  <div className="text-xs sm:text-sm text-blue-100">Sets Progress</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold">{Math.round((workoutTimer / 60) * (currentWorkout.caloriesPerMinute || 5))}</div>
                  <div className="text-xs sm:text-sm text-blue-100">Calories Burned</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold">{Math.round((currentSet / (currentWorkout.sets || 1)) * 100)}%</div>
                  <div className="text-xs sm:text-sm text-blue-100">Complete</div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-2 sm:p-6 space-y-3 sm:space-y-6">
            {/* Current Exercise Spotlight */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-3 sm:p-6 border border-purple-500/30">
              <div className="text-center space-y-3 sm:space-y-4">
                <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 border-purple-400 text-purple-400">
                  Current Exercise
                </Badge>
                <h3 className="text-lg sm:text-2xl font-bold text-white px-2">
                  {(currentWorkout.exercises as string[])?.[currentSet - 1] || 'Workout Complete!'}
                </h3>
                
                {/* Exercise Instructions */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
                  <div className="text-center">
                    <Repeat className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-blue-400" />
                    <div className="text-xs sm:text-sm text-gray-300">Target Reps</div>
                    <div className="text-lg sm:text-xl font-bold text-white">{currentWorkout.reps}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-green-400" />
                    <div className="text-xs sm:text-sm text-gray-300">Rest Time</div>
                    <div className="text-lg sm:text-xl font-bold text-white">{currentWorkout.restTime || 60}s</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-purple-400" />
                    <div className="text-xs sm:text-sm text-gray-300">Set {currentSet}</div>
                    <div className="text-lg sm:text-xl font-bold text-white">of {currentWorkout.sets}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Exercise Instructions */}
            {(currentWorkout.exercises as string[])?.[currentSet - 1] && (
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-orange-300 flex items-center gap-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">How to Perform: {(currentWorkout.exercises as string[])?.[currentSet - 1]}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3 sm:space-y-4">
                    <h5 className="text-base sm:text-lg font-semibold text-white">Step-by-Step Instructions:</h5>
                    <div className="space-y-2 sm:space-y-3">
                      {getExerciseInstructions((currentWorkout.exercises as string[])[currentSet - 1]).map((instruction: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Tips & Safety */}
                  <div className="space-y-3 sm:space-y-4">
                    <h5 className="text-base sm:text-lg font-semibold text-white">Form Tips & Safety:</h5>
                    <div className="bg-yellow-900/30 rounded-lg p-3 sm:p-4 border border-yellow-600/30">
                      <div className="space-y-2">
                        {getExerciseTips((currentWorkout.exercises as string[])[currentSet - 1]).map((tip: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full shrink-0 mt-2"></div>
                            <p className="text-yellow-100 text-xs sm:text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Common Mistakes */}
                    <div className="bg-red-900/30 rounded-lg p-3 sm:p-4 border border-red-600/30">
                      <h6 className="font-semibold text-red-300 mb-2 text-sm sm:text-base">Common Mistakes to Avoid:</h6>
                      <div className="space-y-2">
                        {getExerciseMistakes((currentWorkout.exercises as string[])[currentSet - 1]).map((mistake: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full shrink-0 mt-2"></div>
                            <p className="text-red-100 text-xs sm:text-sm">{mistake}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button
                onClick={pauseWorkout}
                variant="outline"
                size="lg"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                onClick={nextSet}
                disabled={currentSet >= (currentWorkout.sets || 1)}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentSet >= (currentWorkout.sets || 1) ? 'Complete!' : 'Next Set'}
              </Button>
              
              <Button
                onClick={stopWorkout}
                variant="destructive"
                size="lg"
                className="px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                <Square className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Finish Early
              </Button>
            </div>

            {/* Progress Visualization */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Overall Progress</span>
                <span>{Math.round((currentSet / (currentWorkout.sets || 1)) * 100)}% Complete</span>
              </div>
              <Progress 
                value={(currentSet / (currentWorkout.sets || 1)) * 100} 
                className="h-4 bg-gray-700"
              />
            </div>

            {/* Exercise Plan Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Exercise List */}
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-purple-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Exercise Plan ({(currentWorkout.exercises as string[] || []).length} exercises)
                </h4>
                <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                  {(currentWorkout.exercises as string[] || []).map((exercise: string, index: number) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all ${
                        index === currentSet - 1 
                          ? 'bg-purple-600/50 border-2 border-purple-400 shadow-lg' 
                          : index < currentSet - 1 
                          ? 'bg-green-600/30 border border-green-500/50' 
                          : 'bg-gray-700/50 border border-gray-600'
                      }`}
                    >
                      {index < currentSet - 1 ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      ) : index === currentSet - 1 ? (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                      )}
                      <span className={`font-medium text-xs sm:text-sm ${
                        index === currentSet - 1 ? 'text-white' : 
                        index < currentSet - 1 ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {exercise}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workout Stats & Tips */}
              <div className="space-y-4 sm:space-y-6">
                {/* Equipment Needed */}
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                  <h4 className="font-bold text-base sm:text-lg mb-3 text-blue-300 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
                    Equipment Needed
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {(currentWorkout.equipment as string[] || []).map((item: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-blue-400 text-blue-300 text-xs sm:text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Post-Workout Nutrition */}
                {currentWorkout.postWorkoutNutrition && (
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                    <h4 className="font-bold text-base sm:text-lg mb-3 text-green-300 flex items-center gap-2">
                      <Apple className="w-4 h-4 sm:w-5 sm:h-5" />
                      Post-Workout Nutrition
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{currentWorkout.postWorkoutNutrition}</p>
                  </div>
                )}

                {/* Hydration Tips */}
                {currentWorkout.hydration && (
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                    <h4 className="font-bold text-base sm:text-lg mb-3 text-cyan-300 flex items-center gap-2">
                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                      Hydration Tips
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{currentWorkout.hydration}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivational Section */}
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 sm:p-6 border border-orange-500/30 text-center">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-orange-400" />
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">You're Crushing It! 🔥</h4>
              <p className="text-orange-100 text-sm sm:text-base">
                {currentSet === 1 ? "Great start! Keep the momentum going!" :
                 currentSet === Math.floor((currentWorkout.sets || 1) / 2) ? "Halfway there! You've got this!" :
                 currentSet === (currentWorkout.sets || 1) - 1 ? "Final set! Give it everything you've got!" :
                 "Stay focused and maintain proper form!"}
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 overflow-x-auto">
      {/* Interactive Body Map */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-4">
          {/* Simple CSS for clean interactions */}
          <style>{`
            .body-container {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            .dark .body-container {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            }
            .muscle-dot {
              transition: filter 0.2s ease;
            }
            .muscle-dot:hover {
              filter: brightness(1.3);
            }
          `}</style>

          <div className="relative mx-auto max-w-md">
            {/* Clean, Modern Human Body Model */}
            <div className="body-container relative w-full h-[520px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md">

              <svg
                viewBox="0 0 300 400"
                className="w-full h-full"
                style={{ maxHeight: "520px" }}
              >
                {/* Define advanced gradients and effects */}
                <defs>
                  {/* Clean body gradient */}
                  <linearGradient id="bodyGradient" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                {/* Clean Anatomical Human Body Model */}
                <g className="body-outline">
                  {/* Head */}
                  <ellipse cx="150" cy="30" rx="18" ry="22" 
                           fill="url(#bodyGradient)" 
                           stroke="#64748b" 
                           strokeWidth="1.5" />
                  
                  {/* Neck */}
                  <path d="M 142 50 Q 150 48 158 50 L 158 62 Q 150 64 142 62 Z" 
                        fill="url(#bodyGradient)" 
                        stroke="#64748b" 
                        strokeWidth="1.5" />
                  
                  {/* Torso */}
                  <path d="M 115 65 Q 130 58 150 58 Q 170 58 185 65 Q 192 74 194 84 L 194 102 Q 190 112 182 120 L 175 135 Q 168 145 158 150 L 150 155 Q 142 150 132 145 L 125 135 Q 118 120 110 112 L 106 102 Q 106 84 115 65 Z" 
                        fill="url(#bodyGradient)" 
                        stroke="#64748b" 
                        strokeWidth="1.5" />
                  
                  {/* Chest definition */}
                  <path d="M 128 78 Q 138 83 150 80 Q 162 83 172 78" stroke="#94a3b8" strokeWidth="1" fill="none" />
                  <path d="M 132 90 Q 142 95 150 92 Q 158 95 168 90" stroke="#94a3b8" strokeWidth="1" fill="none" />
                  
                  {/* Arms */}
                  <ellipse cx="98" cy="90" rx="16" ry="34" 
                           fill="url(#bodyGradient)" 
                           stroke="#64748b" 
                           strokeWidth="1.5" 
                           transform="rotate(-8 98 90)" />
                  <ellipse cx="202" cy="90" rx="16" ry="34" 
                           fill="url(#bodyGradient)" 
                           stroke="#64748b" 
                           strokeWidth="1.5" 
                           transform="rotate(8 202 90)" />
                  
                  {/* Forearms */}
                  <ellipse cx="88" cy="135" rx="13" ry="30" 
                           fill="url(#bodyGradient)" 
                           stroke="#64748b" 
                           strokeWidth="1.5" 
                           transform="rotate(-12 88 135)" />
                  <ellipse cx="212" cy="135" rx="13" ry="30" 
                           fill="url(#bodyGradient)" 
                           stroke="#64748b" 
                           strokeWidth="1.5" 
                           transform="rotate(12 212 135)" />
                  
                  {/* Hands with realistic proportions */}
                  <ellipse cx="82" cy="172" rx="10" ry="16" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.5)" 
                           strokeWidth="1.8" />
                  <ellipse cx="218" cy="172" rx="10" ry="16" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.5)" 
                           strokeWidth="1.8" />
                  
                  {/* Enhanced core/abdomen with detailed 6-pack definition */}
                  <path d="M 138 155 Q 150 150 162 155 L 168 180 Q 165 195 160 208 L 150 220 Q 140 208 135 195 Q 132 180 138 155 Z" 
                        fill="url(#bodyGradient)" 
                        stroke="rgba(99, 102, 241, 0.8)" 
                        strokeWidth="3"
                        filter="url(#holographic)" />
                  
                  {/* Detailed ab definition with 3D effect */}
                  <path d="M 140 165 Q 150 162 160 165" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1.5" fill="none" />
                  <path d="M 140 178 Q 150 175 160 178" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1.5" fill="none" />
                  <path d="M 141 191 Q 150 188 159 191" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1.5" fill="none" />
                  <path d="M 142 204 Q 150 201 158 204" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1.5" fill="none" />
                  <line x1="150" y1="160" x2="150" y2="208" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.2" />
                  
                  {/* Enhanced pelvis/glutes with 3D shading */}
                  <ellipse cx="150" cy="230" rx="30" ry="22" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.7)" 
                           strokeWidth="2.5"
                           filter="url(#holographic)" />
                  
                  {/* Detailed thigh muscles with anatomical accuracy */}
                  <ellipse cx="128" cy="275" rx="19" ry="42" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.7)" 
                           strokeWidth="2.5" 
                           transform="rotate(-3 128 275)"
                           filter="url(#holographic)" />
                  <ellipse cx="172" cy="275" rx="19" ry="42" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.7)" 
                           strokeWidth="2.5" 
                           transform="rotate(3 172 275)"
                           filter="url(#holographic)" />
                  
                  {/* Quadricep definition with 3D muscle lines */}
                  <path d="M 121 255 Q 128 252 135 255" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 121 272 Q 128 269 135 272" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 121 289 Q 128 286 135 289" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 255 Q 172 252 179 255" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 272 Q 172 269 179 272" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 289 Q 172 286 179 289" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  
                  {/* Enhanced knees with proper anatomy */}
                  <circle cx="128" cy="322" r="10" 
                          fill="url(#bodyGradient)" 
                          stroke="rgba(99, 102, 241, 0.6)" 
                          strokeWidth="2.2" />
                  <circle cx="172" cy="322" r="10" 
                          fill="url(#bodyGradient)" 
                          stroke="rgba(99, 102, 241, 0.6)" 
                          strokeWidth="2.2" />
                  
                  {/* Detailed calf muscles with 3D definition */}
                  <ellipse cx="128" cy="365" rx="15" ry="38" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.7)" 
                           strokeWidth="2.5"
                           filter="url(#holographic)" />
                  <ellipse cx="172" cy="365" rx="15" ry="38" 
                           fill="url(#bodyGradient)" 
                           stroke="rgba(99, 102, 241, 0.7)" 
                           strokeWidth="2.5"
                           filter="url(#holographic)" />
                  
                  {/* Calf definition with muscle striations */}
                  <path d="M 121 350 Q 128 347 135 350" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 121 365 Q 128 362 135 365" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 121 380 Q 128 377 135 380" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 350 Q 172 347 179 350" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 365 Q 172 362 179 365" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                  <path d="M 165 380 Q 172 377 179 380" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.3" fill="none" />
                </g>
                
                {/* Simple Dot Indicators for Muscle Groups */}
                {Object.entries(MUSCLE_GROUPS).map(([muscle, data]) => {
                  const isSelected = selectedMuscle === muscle;
                  const isHovered = hoveredMuscle === muscle;
                  
                  return (
                    <g key={muscle}>
                      {/* Clean dot indicator */}
                      <circle
                        cx={data.position.x}
                        cy={data.position.y}
                        r={isSelected ? "8" : isHovered ? "6" : "4"}
                        fill={data.color}
                        stroke="white"
                        strokeWidth="2"
                        className="muscle-dot cursor-pointer"
                        onClick={() => handleMuscleSelect(muscle)}
                        onMouseEnter={() => setHoveredMuscle(muscle)}
                        onMouseLeave={() => setHoveredMuscle(null)}
                      />
                      
                      {/* Clean, readable muscle label on hover */}
                      {isHovered && (
                        <g className="transition-all duration-300">
                          {/* Simple background for label */}
                          <rect
                            x={data.position.x - (data.name.length * 4)}
                            y={data.position.y - 35}
                            width={data.name.length * 8}
                            height="18"
                            fill="rgba(0, 0, 0, 0.85)"
                            stroke={data.color}
                            strokeWidth="1"
                            rx="6"
                            className="drop-shadow-lg"
                          />
                          
                          {/* Clear, readable muscle name */}
                          <text
                            x={data.position.x}
                            y={data.position.y - 23}
                            textAnchor="middle"
                            className="font-medium fill-white pointer-events-none"
                            style={{ 
                              fontSize: '12px'
                            }}
                          >
                            {data.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}


              </svg>


            </div>
          </div>

          {/* Clean Muscle Selection Buttons */}
          <div className="mt-4 space-y-3 w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Muscle Group
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click on the body or choose from the options below
              </p>
            </div>
            
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-w-full">
              {Object.entries(MUSCLE_GROUPS).map(([muscle, data]) => {
                const sessionCount = getActualSessionCount(muscle);
                const isSelected = selectedMuscle === muscle;
                return (
                  <Button
                    key={muscle}
                    variant="outline"
                    onClick={() => handleMuscleSelect(muscle)}
                    className={`
                      relative flex items-center gap-2 h-auto p-3 transition-all duration-500
                      border-2 rounded-xl overflow-hidden group
                      ${isSelected 
                        ? `border-${data.color} bg-gradient-to-r from-${data.color}/20 to-${data.color}/10 shadow-lg shadow-${data.color}/25` 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }
                      hover:scale-105 hover:shadow-xl transform-gpu
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                    `}
                    style={{
                      boxShadow: isSelected 
                        ? `0 0 20px ${data.color}33, inset 0 1px 0 rgba(255,255,255,0.1)` 
                        : "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
                      borderColor: isSelected ? data.color : undefined
                    }}
                  >
                    {/* Animated background overlay */}
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      style={{
                        background: `linear-gradient(135deg, ${data.color}15, transparent)`
                      }}
                    />
                    
                    {/* Clean content */}
                    <div className="relative flex items-center justify-center w-full h-full z-10">
                      <div className="text-center">
                        <div className={`font-bold transition-colors duration-300 ${
                          isSelected 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {data.name.toUpperCase()}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <div className={`text-xs font-medium transition-colors duration-300 ${
                            isSelected 
                              ? 'text-gray-600 dark:text-gray-300' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scanning line effect for selected muscle */}
                    {isSelected && (
                      <div 
                        className="absolute bottom-0 left-0 w-full h-0.5 opacity-80"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
                          animation: "scan 2s ease-in-out infinite"
                        }}
                      />
                    )}
                  </Button>
                );
              })}
              </div>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Instructions Panel when no muscle selected */}
      {!selectedMuscle && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Select a Muscle Group
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Click on any muscle group in the body diagram above or use the buttons below to see targeted workout bundles.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selected Muscle Workouts */}
      {selectedMuscle && (
        <Card ref={workoutDetailsRef}>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                    style={{ backgroundColor: MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS].color }}
                  />
                  {MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS].name} Workouts
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                  {getMotivation(selectedMuscle)}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm sm:text-lg px-2 sm:px-3 py-1 self-start sm:self-auto">
                {workouts.length} workout bundles
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading {MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS]?.name} workouts...</span>
                  </div>
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : workouts && workouts.length > 0 ? (
              <div className="space-y-3 w-full overflow-visible">
                {/* Workout Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {workouts.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Available Workouts</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(workouts.reduce((acc, w) => acc + ((w.duration || 30) * (w.caloriesPerMinute || 5)), 0) / workouts.length)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg Calories</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(workouts.reduce((acc, w) => acc + (w.duration || 30), 0) / workouts.length)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg Duration (min)</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {workouts.reduce((acc, w) => acc + ((w.exercises as string[] || []).length), 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Exercises</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Workout Cards - Clean Design */}
                <div className="space-y-3 w-full max-w-none">
                  {workouts.map((workout: Workout, index: number) => (
                    <Card 
                      key={workout.id} 
                      className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 animate-slide-up" 
                      style={{ 
                        borderLeftWidth: '4px', 
                        borderLeftColor: MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS].color,
                        animationDelay: `${index * 150}ms`,
                        animationFillMode: 'both'
                      }}>
                      <CardContent className="p-3 lg:p-4">
                        {/* Clean Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm lg:text-base font-bold flex items-center justify-center shadow-md">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{workout.name}</h3>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant={workout.difficulty === 'beginner' ? 'secondary' : workout.difficulty === 'intermediate' ? 'default' : 'destructive'} className="text-xs font-medium">
                                  {workout.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Clean Action Button */}
                          <ProtectedButton
                            onAuthenticatedClick={() => startWorkout(workout)}
                            className="lg:hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                            <Play className="w-4 h-4" />
                          </ProtectedButton>
                        </div>

                        {/* Clean Stats Grid - Mobile */}
                        <div className="grid grid-cols-4 gap-1 mb-3 lg:hidden bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                          <div className="text-center">
                            <Repeat className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                            <div className="text-xs text-gray-500 dark:text-gray-400">Sets</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{workout.sets}</div>
                          </div>
                          <div className="text-center">
                            <Target className="w-4 h-4 mx-auto mb-1 text-green-500" />
                            <div className="text-xs text-gray-500 dark:text-gray-400">Reps</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{workout.reps}</div>
                          </div>
                          <div className="text-center">
                            <Clock className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                            <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{workout.duration}m</div>
                          </div>
                          <div className="text-center">
                            <Flame className="w-4 h-4 mx-auto mb-1 text-red-500" />
                            <div className="text-xs text-gray-500 dark:text-gray-400">Burn</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round((workout.duration || 30) * (workout.caloriesPerMinute || 5))}</div>
                          </div>
                        </div>

                        {/* Clean Desktop Layout */}
                        <div className="hidden lg:block">
                          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                            <div className="grid lg:grid-cols-3 gap-6">
                              {/* Workout Info */}
                              <div className="lg:col-span-2 space-y-6">
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{workout.description}</p>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <Repeat className="w-5 h-5 text-blue-500" />
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">Sets</div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">{workout.sets}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <Target className="w-5 h-5 text-green-500" />
                                    <div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">Reps</div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">{workout.reps}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Equipment */}
                                <div>
                                  <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                    <Dumbbell className="w-5 h-5 text-blue-500" />
                                    Equipment Required
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {(workout.equipment as string[] || []).map((item: string, eqIndex: number) => (
                                      <Badge key={eqIndex} variant="outline" className="text-sm bg-white dark:bg-gray-800">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Exercise List */}
                                <div>
                                  <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Exercises ({(workout.exercises as string[] || []).length} total)
                                  </h4>
                                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {(workout.exercises as string[] || []).map((exercise: string, exIndex: number) => (
                                      <div key={exIndex} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 py-2 px-3 bg-white dark:bg-gray-800 rounded-md">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                                          {exIndex + 1}
                                        </div>
                                        <span className="flex-1">{exercise}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Action Section */}
                              <div className="flex flex-col justify-center space-y-6">
                                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Burn</div>
                                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                    {Math.round((workout.duration || 30) * (workout.caloriesPerMinute || 5))}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">calories</div>
                                  <div className="text-xs text-gray-500 mt-2">{workout.duration} minutes</div>
                                </div>
                                
                                <ProtectedButton
                                  onAuthenticatedClick={() => startWorkout(workout)}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                                  <Play className="w-5 h-5 mr-3" />
                                  Start Workout
                                  <ArrowRight className="w-5 h-5 ml-3" />
                                </ProtectedButton>
                                
                                <div className="text-center">
                                  <Badge variant="outline" className="text-sm" style={{ borderColor: MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS].color }}>
                                    {MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS]?.name} Focus
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Clean Mobile Collapsible Details */}
                        <div className="lg:hidden">
                          <Collapsible open={expandedCards.has(workout.id)} onOpenChange={() => toggleCardExpansion(workout.id)}>
                            <CollapsibleTrigger className="flex items-center justify-center w-full py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 -mx-3 transition-colors border border-gray-200 dark:border-gray-600">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                View Details
                                {expandedCards.has(workout.id) ? (
                                  <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </span>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="mt-4 space-y-4">
                              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{workout.description}</p>
                                
                                {/* Equipment */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                    <Dumbbell className="w-4 h-4 text-blue-500" />
                                    Equipment
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {(workout.equipment as string[] || []).map((item: string, eqIndex: number) => (
                                      <Badge key={eqIndex} variant="outline" className="text-xs bg-white dark:bg-gray-800">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Exercise List */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Exercises ({(workout.exercises as string[] || []).length} total)
                                  </h4>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {(workout.exercises as string[] || []).map((exercise: string, exIndex: number) => (
                                      <div key={exIndex} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 py-2 px-3 bg-white dark:bg-gray-800 rounded-md">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                                          {exIndex + 1}
                                        </div>
                                        <span className="flex-1">{exercise}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Full-width Start Button for Mobile */}
                                <ProtectedButton
                                  onAuthenticatedClick={() => startWorkout(workout)}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Workout
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </ProtectedButton>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Dumbbell className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No workouts available for {MUSCLE_GROUPS[selectedMuscle as keyof typeof MUSCLE_GROUPS]?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  We're working on adding more targeted workout bundles for this muscle group. Check back soon!
                </p>
                <Button className="mt-4" onClick={() => setSelectedMuscle(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Choose Different Muscle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}