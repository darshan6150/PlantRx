import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Button } from "@/components/ui/button";
import { ProtectedButton } from "@/components/ProtectedButton";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import InteractiveMuscleMap from "@/components/InteractiveMuscleMap";
import { SEOHead } from "@/components/SEOHead";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

import { 
  Dumbbell, 
  Target, 
  Trophy, 
  Zap, 
  Timer,
  Heart,
  Star,
  Play,
  Clock,
  Flame,
  Users,
  Map,
  ArrowLeft,
  ArrowRight,
  Pause,
  SkipForward,
  CheckCircle,
  Apple
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Workout Interface Component
function WorkoutInterface({ workout, onBack, timer, setTimer, isRunning, setIsRunning, currentExercise, setCurrentExercise }: any) {
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, setTimer]);

  // Sample exercises based on workout type
  const getExercises = (workoutName: string) => {
    const exerciseData: any = {
      "Push-Up Power": [
        { name: "Standard Push-ups", duration: 60, rest: 30, reps: "8-12" },
        { name: "Incline Push-ups", duration: 60, rest: 30, reps: "10-15" },
        { name: "Diamond Push-ups", duration: 45, rest: 30, reps: "6-10" },
        { name: "Wide-grip Push-ups", duration: 60, rest: 30, reps: "8-12" }
      ],
      "HIIT Inferno": [
        { name: "Jumping Jacks", duration: 45, rest: 15, reps: "Max reps" },
        { name: "Burpees", duration: 30, rest: 30, reps: "Max reps" },
        { name: "Mountain Climbers", duration: 45, rest: 15, reps: "Max reps" },
        { name: "High Knees", duration: 30, rest: 30, reps: "Max reps" }
      ],
      "Morning Flow": [
        { name: "Cat-Cow Stretch", duration: 60, rest: 0, reps: "8-10 cycles" },
        { name: "Downward Dog", duration: 60, rest: 0, reps: "Hold" },
        { name: "Warrior I", duration: 45, rest: 0, reps: "Each side" },
        { name: "Child's Pose", duration: 60, rest: 0, reps: "Hold" }
      ]
    };
    
    return exerciseData[workoutName] || [
      { name: "Exercise 1", duration: 60, rest: 30, reps: "8-12" },
      { name: "Exercise 2", duration: 60, rest: 30, reps: "8-12" },
      { name: "Exercise 3", duration: 60, rest: 30, reps: "8-12" },
      { name: "Exercise 4", duration: 60, rest: 30, reps: "8-12" }
    ];
  };

  // Get exercises from the actual workout data from database
  const exercises = workout?.exercises && typeof workout.exercises === 'string' 
    ? workout.exercises.split(',').map((exerciseName: string, index: number) => ({
        name: exerciseName.trim(),
        duration: 45,
        rest: 15,
        reps: `${workout.sets || 3} sets x ${workout.reps || '8-12'}`
      })) 
    : getExercises(workout.name);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setIsCompleted(true);
      setIsRunning(false);
    }
  };

  const getNutritionRecommendations = () => {
    return [
      { food: "Protein Shake", description: "Whey protein with banana for muscle recovery", icon: "🥛" },
      { food: "Greek Yogurt", description: "High protein, low fat recovery snack", icon: "🥣" },
      { food: "Sweet Potato", description: "Complex carbs to refuel glycogen stores", icon: "🍠" },
      { food: "Almonds", description: "Healthy fats and protein for sustained energy", icon: "🌰" },
      { food: "Grilled Chicken", description: "Lean protein for muscle repair", icon: "🍗" },
      { food: "Quinoa Salad", description: "Complete protein with fresh vegetables", icon: "🥗" }
    ];
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Complete!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Great job finishing {workout.name}</p>
          <Badge className="mt-2 text-lg px-4 py-2">Time: {formatTime(timer)}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-500" />
              Post-Workout Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Fuel your recovery with these recommended foods within 30-60 minutes:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {getNutritionRecommendations().map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.food}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workouts
          </Button>
          <Button 
            onClick={() => {
              setIsCompleted(false);
              setTimer(0);
              setCurrentExercise(0);
            }}
            className="flex-1"
          >
            Workout Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{workout.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{workout.description}</p>
        </div>
      </div>

      {/* Timer and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timer)}
            </div>
            <div className="flex items-center justify-center gap-4">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg" className="px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="outline" className="px-8">
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleNextExercise} size="lg" variant="outline">
                <SkipForward className="w-5 h-5 mr-2" />
                Next Exercise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Current Exercise ({currentExercise + 1}/{exercises.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {exercises[currentExercise]?.name}
            </h3>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{exercises[currentExercise]?.duration}s work</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span>{exercises[currentExercise]?.rest}s rest</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span>{exercises[currentExercise]?.reps}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Plan ({exercises.length} exercises)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {exercises.map((exercise: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between py-2 px-3 rounded ${
                  index === currentExercise
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                    : index < currentExercise
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {exercise.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                    {exercise.reps}
                  </span>
                  {index < currentExercise && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Workouts Component with Analytics
function WorkoutsComponent() {
  // Enhanced analytics tracking for workouts page
  useEnhancedPageTracking('workouts', 'main');
  
  return <WorkoutsContent />;
}

function WorkoutsContent() {
  return <WorkoutsInner />;
}

function WorkoutsInner() {
  const [showMuscleMap, setShowMuscleMap] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

  // Fetch workouts from database for each category
  const { data: strengthWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/chest'],
    enabled: selectedCategory === 'strength'
  });
  
  const { data: cardioWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/core'],
    enabled: selectedCategory === 'cardio'
  });
  
  const { data: yogaWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/back'],
    enabled: selectedCategory === 'yoga'
  });
  
  const { data: fullBodyWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/legs'],
    enabled: selectedCategory === 'fullbody'
  });
  
  const { data: quickWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/arms'],
    enabled: selectedCategory === 'quick'
  });
  
  const { data: beginnerWorkouts = [] } = useQuery({
    queryKey: ['/api/workouts/shoulders'],
    enabled: selectedCategory === 'beginner'
  });

  // Scroll to top when navigation occurs
  useEffect(() => {
    if (selectedCategory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (activeWorkout) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeWorkout]);

  useEffect(() => {
    if (showMuscleMap) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showMuscleMap]);
  
  // Fetch user data for stats
  const { data: userProgress = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/workout-progress'],
    enabled: true
  });

  const { data: recentSessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['/api/workout-sessions/recent'],
    enabled: true
  });

  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/workout-recommendations'],
    enabled: true
  });

  // Get category color based on category type
  const getCategoryColor = (category: string) => {
    const colors = {
      strength: '#dc2626', // red
      cardio: '#2563eb', // blue  
      yoga: '#16a34a', // green
      fullbody: '#7c3aed', // purple
      quick: '#ea580c', // orange
      beginner: '#db2777' // pink
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  // Get workouts from database based on category
  const getWorkoutsByCategory = (category: string): any[] => {
    switch (category) {
      case 'strength':
        return Array.isArray(strengthWorkouts) ? strengthWorkouts : [];
      case 'cardio':
        return Array.isArray(cardioWorkouts) ? cardioWorkouts : [];
      case 'yoga':
        return Array.isArray(yogaWorkouts) ? yogaWorkouts : [];
      case 'fullbody':
        return Array.isArray(fullBodyWorkouts) ? fullBodyWorkouts : [];
      case 'quick':
        return Array.isArray(quickWorkouts) ? quickWorkouts : [];
      case 'beginner':
        return Array.isArray(beginnerWorkouts) ? beginnerWorkouts : [];
      default:
        return [];
    }
  };

  return (
    <UpgradeInterstitial feature={Feature.WORKOUT_LIBRARY_FULL}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SEOHead 
        title="Workout Bundles - Personalized Fitness Programs | PlantRx"
        description="Transform your fitness with PlantRx workout bundles. Personalized exercise programs, nutrition plans, and progress tracking for natural health and wellness."
        keywords="workout bundles, fitness programs, exercise plans, natural fitness, personalized workouts, wellness training"
        canonical="https://plantrxapp.com/workouts"
      />
      <Header />
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            {showMuscleMap ? "Interactive Muscle Trainer" : "Choose Your Workout"}
          </h1>
          <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-3xl mx-auto px-2">
            {showMuscleMap 
              ? "Click on any muscle group to see targeted workouts designed for that area."
              : "Pick from our expertly designed workouts to reach your fitness goals. Every workout is optimized for results."
            }
          </p>
          
        </div>

        {/* Conditional Content */}
        {showMuscleMap ? (
          // Muscle Map
          <Card className="mx-2 sm:mx-0">
            <CardContent className="p-6">
              <InteractiveMuscleMap />
            </CardContent>
          </Card>
        ) : activeWorkout ? (
          // Active Workout Interface
          <WorkoutInterface 
            workout={activeWorkout}
            onBack={() => setActiveWorkout(null)}
            timer={workoutTimer}
            setTimer={setWorkoutTimer}
            isRunning={isWorkoutRunning}
            setIsRunning={setIsWorkoutRunning}
            currentExercise={currentExercise}
            setCurrentExercise={setCurrentExercise}
          />
        ) : selectedCategory ? (
          // Selected Category Workouts
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
              <Button 
                onClick={() => setSelectedCategory(null)}
                variant="outline"
                className="flex items-center gap-2"
                data-testid="button-back-to-categories"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </Button>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white capitalize">{selectedCategory} Workouts</h2>
            </div>
            
            <div className="grid gap-3 sm:gap-6 px-2 sm:px-0">
              {getWorkoutsByCategory(selectedCategory).map((workout: any, index: number) => (
                <Card key={index} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 hover:shadow-lg transition-all" style={{ borderLeftColor: getCategoryColor(selectedCategory) }}>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
                      {/* Workout Info */}
                      <div className="lg:col-span-2 space-y-2 sm:space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{workout.name}</h3>
                              </div>
                              <Badge variant={workout.difficulty === 'Beginner' ? 'secondary' : workout.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                                {workout.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{workout.description}</p>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                            <div>
                              <div className="text-xs sm:text-sm text-gray-500">Duration</div>
                              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{workout.duration}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            <div>
                              <div className="text-xs sm:text-sm text-gray-500">Level</div>
                              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{workout.difficulty}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            <div>
                              <div className="text-xs sm:text-sm text-gray-500">Calories</div>
                              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{workout.calories}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                            <div>
                              <div className="text-xs sm:text-sm text-gray-500">Exercises</div>
                              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{workout.exercises.length}</div>
                            </div>
                          </div>
                        </div>

                        {/* Exercise List */}
                        <div className="space-y-1 sm:space-y-2">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            Exercises ({workout.exercises && typeof workout.exercises === 'string' ? workout.exercises.split(',').length : 0} total):
                          </h4>
                          <div className="space-y-0.5 sm:space-y-1">
                            {workout.exercises && typeof workout.exercises === 'string' ? workout.exercises.split(',').map((exercise: string, exIndex: number) => (
                              <div key={exIndex} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 sm:gap-2 py-0.5 sm:py-1">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center font-medium">
                                  {exIndex + 1}
                                </div>
                                <span className="flex-1">{exercise.trim()}</span>
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded">{workout.reps || '8-12'}</span>
                              </div>
                            )) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400">No exercises available</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Section */}
                      <div className="flex flex-col justify-center space-y-2 sm:space-y-4">
                        <div className="text-center p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl">
                          <div className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Estimated Burn</div>
                          <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {workout.calories}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">calories</div>
                        </div>
                        
                        <ProtectedButton
                          onAuthenticatedClick={() => setActiveWorkout(workout)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 sm:py-4 text-sm sm:text-lg font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                          data-testid={`button-start-${workout.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-3" />
                          Start Workout
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-3" />
                        </ProtectedButton>
                        
                        <div className="text-center space-y-0.5 sm:space-y-1">
                          <div className="text-xs sm:text-sm text-gray-500">
                            {workout.exercises.length} exercises • {workout.duration}
                          </div>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: getCategoryColor(selectedCategory) }}>
                            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Focus
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
    </UpgradeInterstitial>
  );
}

export default WorkoutsComponent;