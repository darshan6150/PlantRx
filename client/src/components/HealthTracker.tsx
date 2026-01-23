import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Target, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Moon,
  Brain,
  Apple,
  Droplets,
  Weight,
  Smile
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { HealthGoal, HealthLog, HealthInsight, InsertHealthGoal, InsertHealthLog } from "@shared/schema";

interface HealthTrackerProps {
  userId: number;
}

const healthCategories = [
  { value: "digestive", label: "Digestive Health", icon: Apple, color: "green" },
  { value: "sleep", label: "Sleep Quality", icon: Moon, color: "blue" },
  { value: "immunity", label: "Immune System", icon: Heart, color: "red" },
  { value: "energy", label: "Energy Levels", icon: Activity, color: "yellow" },
  { value: "stress", label: "Stress Management", icon: Brain, color: "purple" },
  { value: "weight", label: "Weight Management", icon: Weight, color: "orange" },
  { value: "skin", label: "Skin Health", icon: Smile, color: "pink" },
];

const logTypes = [
  { value: "symptom", label: "Symptom Check", description: "Log how you're feeling" },
  { value: "remedy_taken", label: "Remedy Taken", description: "Track natural remedies used" },
  { value: "mood", label: "Mood Rating", description: "Rate your overall mood" },
  { value: "energy", label: "Energy Level", description: "Track your energy throughout the day" },
  { value: "sleep", label: "Sleep Quality", description: "Log your sleep quality and duration" },
  { value: "exercise", label: "Physical Activity", description: "Track workouts and movement" },
  { value: "water", label: "Water Intake", description: "Monitor hydration levels" },
];

export default function HealthTracker({ userId }: HealthTrackerProps) {
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<InsertHealthGoal>>({
    category: "digestive",
    priority: "medium",
  });
  const [newLog, setNewLog] = useState<Partial<InsertHealthLog>>({
    type: "symptom",
    severity: 5,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's health data
  const { data: healthGoals } = useQuery({
    queryKey: ["/api/health/goals", userId],
    enabled: !!userId,
  });

  const { data: recentLogs } = useQuery({
    queryKey: ["/api/health/logs", userId],
    enabled: !!userId,
  });

  const { data: healthInsights } = useQuery({
    queryKey: ["/api/health/insights", userId],
    enabled: !!userId,
  });

  const { data: healthMetrics } = useQuery({
    queryKey: ["/api/health/metrics", userId],
    enabled: !!userId,
  });

  // Mutations
  const createGoalMutation = useMutation({
    mutationFn: (goal: InsertHealthGoal) => apiRequest("/api/health/goals", "POST", goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health/metrics"] });
      toast({
        title: "Goal Created",
        description: "Your health goal has been added successfully!",
      });
      setShowGoalDialog(false);
      setNewGoal({ category: "digestive", priority: "medium" });
    },
  });

  const createLogMutation = useMutation({
    mutationFn: (log: InsertHealthLog) => apiRequest("/api/health/logs", "POST", log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health/insights"] });
      toast({
        title: "Health Update Logged",
        description: "Your health information has been recorded!",
      });
      setShowLogDialog(false);
      setNewLog({ type: "symptom", severity: 5 });
    },
  });

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.category) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and category for your goal.",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate({
      ...newGoal,
      userId: userId,
    } as InsertHealthGoal);
  };

  const handleCreateLog = () => {
    if (!newLog.type) {
      toast({
        title: "Missing Information",
        description: "Please select a log type.",
        variant: "destructive",
      });
      return;
    }

    createLogMutation.mutate({
      ...newLog,
      userId: userId,
    } as InsertHealthLog);
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = healthCategories.find(c => c.value === category);
    return categoryInfo ? categoryInfo.icon : Target;
  };

  const getOverallScore = () => {
    return healthMetrics?.overallScore || 85;
  };

  const getGoalProgress = (goal: HealthGoal) => {
    const goalLogs = Array.isArray(recentLogs) ? recentLogs.filter((log: HealthLog) => 
      log.goalId === goal.id || log.type === goal.category
    ) : [];
    
    if (goal.targetValue && goalLogs.length > 0) {
      const avgValue = goalLogs.reduce((sum: number, log: HealthLog) => sum + (log.value || 0), 0) / goalLogs.length;
      return Math.min((avgValue / goal.targetValue) * 100, 100);
    }
    
    return goalLogs.length > 0 ? Math.min(goalLogs.length * 10, 100) : 0;
  };

  return (
    <div className="space-y-8">
      {/* Health Overview */}
      <Card className="luxury-glass luxury-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Health Dashboard</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Track your wellness journey with smart insights
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold luxury-text-gradient">{getOverallScore()}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overall Health Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="luxury-glass p-4 rounded-xl luxury-border">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Array.isArray(healthGoals) ? healthGoals.filter((g: HealthGoal) => g.status === 'active').length : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Goals</p>
                </div>
              </div>
            </div>
            
            <div className="luxury-glass p-4 rounded-xl luxury-border">
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Array.isArray(recentLogs) ? recentLogs.length : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Recent Logs</p>
                </div>
              </div>
            </div>
            
            <div className="luxury-glass p-4 rounded-xl luxury-border">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card 
          className="luxury-glass luxury-border hover:shadow-xl transition-all duration-300 cursor-pointer group"
          onClick={() => setShowLogDialog(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Health Update</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Record symptoms, mood, or activities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="luxury-glass luxury-border hover:shadow-xl transition-all duration-300 cursor-pointer group"
          onClick={() => setShowGoalDialog(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set Health Goal</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Create a new wellness target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Health Update</DialogTitle>
            <DialogDescription>
              Track your health progress with a quick update
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="log-type">Update Type</Label>
              <Select 
                value={newLog.type || ""} 
                onValueChange={(value) => setNewLog(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type of update" />
                </SelectTrigger>
                <SelectContent>
                  {logTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(newLog.type === "symptom" || newLog.type === "mood" || newLog.type === "energy") && (
              <div>
                <Label htmlFor="severity">Rating (1-10)</Label>
                <Input
                  id="severity"
                  type="number"
                  min="1"
                  max="10"
                  value={newLog.severity || 5}
                  onChange={(e) => setNewLog(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                />
              </div>
            )}

            {(newLog.type === "water" || newLog.type === "sleep" || newLog.type === "exercise") && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newLog.value || ""}
                    onChange={(e) => setNewLog(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={newLog.unit || ""} 
                    onValueChange={(value) => setNewLog(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cups">Cups</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="glasses">Glasses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                value={newLog.notes || ""}
                onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateLog} disabled={createLogMutation.isPending} className="flex-1">
                {createLogMutation.isPending ? "Logging..." : "Log Update"}
              </Button>
              <Button variant="outline" onClick={() => setShowLogDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Health Goal Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Health Goal</DialogTitle>
            <DialogDescription>
              Set a specific target for your wellness journey
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Improve sleep quality"
                value={newGoal.title || ""}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="goal-category">Category</Label>
              <Select 
                value={newGoal.category || ""} 
                onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select health category" />
                </SelectTrigger>
                <SelectContent>
                  {healthCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal-description">Description</Label>
              <Textarea
                id="goal-description"
                placeholder="Describe your goal and how you plan to achieve it..."
                value={newGoal.description || ""}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="target-value">Target Value (Optional)</Label>
                <Input
                  id="target-value"
                  type="number"
                  placeholder="e.g., 8"
                  value={newGoal.targetValue || ""}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="target-unit">Unit (Optional)</Label>
                <Input
                  id="target-unit"
                  placeholder="e.g., hours"
                  value={newGoal.targetUnit || ""}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetUnit: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newGoal.priority || "medium"} 
                onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreateGoal} disabled={createGoalMutation.isPending} className="flex-1">
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
              <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Goals */}
      {Array.isArray(healthGoals) && healthGoals.length > 0 && (
        <Card className="luxury-glass luxury-border">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Active Health Goals</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Track your progress toward better health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthGoals.filter((goal: HealthGoal) => goal.status === 'active').map((goal: HealthGoal) => {
                const IconComponent = getCategoryIcon(goal.category);
                const progress = getGoalProgress(goal);
                
                return (
                  <div key={goal.id} className="luxury-glass p-4 rounded-xl luxury-border">
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-6 h-6 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                          <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                            {goal.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        {goal.targetValue && (
                          <p className="text-xs text-gray-500 mt-2">
                            Target: {goal.targetValue} {goal.targetUnit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Insights */}
      {Array.isArray(healthInsights) && healthInsights.length > 0 && (
        <Card className="luxury-glass luxury-border">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Health Insights & Recommendations</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              AI-powered suggestions for your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthInsights.slice(0, 3).map((insight: HealthInsight) => (
                <div key={insight.id} className="luxury-glass p-4 rounded-xl luxury-border">
                  <div className="flex items-start space-x-3">
                    {insight.type === 'achievement' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    ) : insight.priority === 'high' ? (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{insight.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          {insight.category || insight.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(insight.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}