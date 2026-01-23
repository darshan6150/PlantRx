import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProtectedButton } from "@/components/ProtectedButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  X, 
  Clock, 
  Flame, 
  Heart, 
  Target,
  Activity,
  Trophy,
  Volume2,
  VolumeX
} from "lucide-react";

interface Workout {
  id: number;
  title: string;
  duration: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
  targetAreas: string[];
  caloriesPerMinute: number;
  benefits: string[];
  description: string;
}

interface WorkoutTimerProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutTimer({ workout, isOpen, onClose }: WorkoutTimerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Parse workout duration to get total seconds
  const getTotalSeconds = (duration: string): number => {
    const match = duration.match(/(\d+)\s*min/);
    return match ? parseInt(match[1]) * 60 : 1800; // Default 30 minutes
  };

  const totalSeconds = getTotalSeconds(workout.duration);
  const progress = (currentTime / totalSeconds) * 100;
  const remainingTime = totalSeconds - currentTime;
  const caloriesBurned = Math.round((currentTime / 60) * workout.caloriesPerMinute);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer logic
  useEffect(() => {
    if (isPlaying && currentTime < totalSeconds) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalSeconds - 1) {
            setIsPlaying(false);
            // Workout completed
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTime, totalSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleClose = () => {
    handleStop();
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200";
      default: return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl rounded-3xl">
        <CardHeader className="relative pb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-6 right-6 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full w-10 h-10 p-0"
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="pr-16 pt-2">
            <CardTitle className="text-4xl font-bold luxury-heading text-gray-900 dark:text-white mb-4 leading-tight">
              {workout.title}
            </CardTitle>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={`${getDifficultyColor(workout.difficulty)} px-4 py-2 text-sm font-semibold rounded-full`}>
                {workout.difficulty}
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 text-sm font-semibold rounded-full">
                {workout.category}
              </Badge>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 luxury-body font-medium">
              with {workout.instructor}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {/* Small Timer Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold luxury-heading text-blue-900 dark:text-blue-100">
                  {formatTime(remainingTime)}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ProtectedButton
                  onAuthenticatedClick={handlePlayPause}
                  size="sm"
                  className="luxury-button-primary h-10 px-4"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </ProtectedButton>
                <ProtectedButton
                  onAuthenticatedClick={handleStop}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4"
                >
                  <Square className="w-4 h-4" />
                </ProtectedButton>
              </div>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {/* Equipment & Setup */}
          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                Equipment & Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Equipment Needed:</h4>
                  <ul className="space-y-2">
                    {workout.equipment?.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions:</h4>
                  <ul className="space-y-2">
                    {workout.instructions?.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Exercises - Main Content */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-blue-900 dark:text-blue-100">
                <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Workout Exercises
              </CardTitle>
              <p className="text-blue-700 dark:text-blue-300 mt-2">
                Follow these exercises in order. Read the instructions carefully and follow the tips for best results.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workout.exercises?.map((exercise, index) => (
                  <Card key={index} className="bg-white/80 dark:bg-gray-800/80 border border-blue-200 dark:border-blue-700/50 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exercise.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                                {exercise.duration}
                              </Badge>
                              {exercise.sets && (
                                <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200">
                                  {exercise.sets}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{exercise.instructions}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tips:</h4>
                        <ul className="space-y-1">
                          {exercise.tips?.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              <span className="text-gray-600 dark:text-gray-400 text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-800/50">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-900 dark:text-orange-100">{caloriesBurned}</div>
              <div className="text-xs text-orange-700 dark:text-orange-300">Calories</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800/50">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{Math.floor(currentTime / 60)}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Minutes</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-200 dark:border-red-800/50">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-900 dark:text-red-100">{Math.round(120 + (currentTime / 60) * 15)}</div>
              <div className="text-xs text-red-700 dark:text-red-300">Heart Rate</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-800/50">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-900 dark:text-green-100">{workout.targetAreas.length}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Target Areas</div>
            </div>
          </div>

          {/* Completion Message */}
          {currentTime >= totalSeconds && (
            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-4 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl">
              <CardContent className="p-10 text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-4xl font-bold luxury-heading text-green-900 dark:text-green-100 mb-4">
                  Workout Complete! 🎉
                </h3>
                <p className="text-xl text-green-800 dark:text-green-200 mb-8 max-w-md mx-auto leading-relaxed">
                  Excellent work! You burned <span className="font-bold">{caloriesBurned} calories</span> and completed your {workout.title} workout.
                </p>
                <div className="flex justify-center gap-6">
                  <Button onClick={handleStop} className="luxury-button-primary h-14 px-8 text-lg font-semibold rounded-2xl">
                    Start New Workout
                  </Button>
                  <Button onClick={handleClose} variant="outline" className="h-14 px-8 text-lg font-semibold rounded-2xl border-2">
                    Close Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}