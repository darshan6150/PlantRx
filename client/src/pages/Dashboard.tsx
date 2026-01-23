import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { 
  Heart, 
  ShoppingCart, 
  Calendar, 
  User, 
  LogOut, 
  Leaf, 
  Star,
  Package,
  CreditCard,
  BookOpen,
  Users,
  Settings,
  Zap,
  Brain,
  TrendingUp,
  Sparkles,
  Activity,
  Target,
  Award,
  Clock,
  Shield,
  ThumbsUp,
  Edit3,
  ChevronDown,
  ChevronUp,
  Bell,
  Eye,
  Accessibility,
  Mail,
  Globe,
  Moon,
  Sun,
  Type,
  Volume2,
  Contrast,
  Check,
  X,
  AlertTriangle,
  Crown,
  Gem,
  CircleUser,
  MapPin,
  Cake,
  Save,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "wouter";
import RemedyCard from "@/components/RemedyCard";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { GoldTrialDashboardBanner, ExpiredTrialDiscountBanner } from "@/components/GoldTrialDashboardBanner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Remedy, CustomRemedy, Order } from "@shared/schema";
import { signOut } from "@/auth";

// Health goal options
const HEALTH_GOALS = [
  { id: "weight_loss", label: "Weight Management", icon: "⚖️" },
  { id: "better_sleep", label: "Better Sleep", icon: "😴" },
  { id: "stress_relief", label: "Stress Relief", icon: "🧘" },
  { id: "immunity", label: "Immune Support", icon: "🛡️" },
  { id: "energy", label: "More Energy", icon: "⚡" },
  { id: "digestion", label: "Digestive Health", icon: "🌿" },
  { id: "skin_health", label: "Skin Health", icon: "✨" },
  { id: "pain_relief", label: "Pain Relief", icon: "💪" },
  { id: "mental_clarity", label: "Mental Clarity", icon: "🧠" },
  { id: "heart_health", label: "Heart Health", icon: "❤️" },
];

// Dietary restrictions options
const DIETARY_RESTRICTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten_free", label: "Gluten-Free" },
  { id: "dairy_free", label: "Dairy-Free" },
  { id: "nut_free", label: "Nut-Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
];

// Common allergies
const COMMON_ALLERGIES = [
  { id: "pollen", label: "Pollen" },
  { id: "ragweed", label: "Ragweed" },
  { id: "nuts", label: "Tree Nuts" },
  { id: "peanuts", label: "Peanuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "dairy", label: "Dairy" },
  { id: "gluten", label: "Gluten" },
  { id: "soy", label: "Soy" },
  { id: "eggs", label: "Eggs" },
  { id: "latex", label: "Latex" },
];

// Remedy form preferences
const REMEDY_FORMS = [
  { id: "tea", label: "Herbal Teas", icon: "🍵" },
  { id: "tincture", label: "Tinctures", icon: "💧" },
  { id: "capsule", label: "Capsules", icon: "💊" },
  { id: "topical", label: "Topical", icon: "🧴" },
  { id: "essential_oil", label: "Essential Oils", icon: "🌸" },
  { id: "powder", label: "Powders", icon: "🥄" },
];

export default function Dashboard() {
  useEnhancedPageTracking('dashboard', 'main');
  
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  
  // Editable preferences state
  const [editMode, setEditMode] = useState({
    profile: false,
    health: false,
    notifications: false,
    accessibility: false,
  });
  
  // Form state for preferences
  const [preferences, setPreferences] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    location: "",
    age: "",
    healthGoals: [] as string[],
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    preferredRemedyForms: [] as string[],
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    newRemedyAlerts: true,
    expertTipsEnabled: true,
    textSize: "medium",
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false,
  });
  
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    profile: false,
    health: false,
    notifications: false,
    accessibility: false,
    remedies: false,
    activity: false,
  });

  const { toast } = useToast();

  // Fetch current user with preferences
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ["/api/user/me"],
    enabled: !!user,
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/user/preferences", "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
      // Refetch personalized suggestions based on new preferences
      queryClient.invalidateQueries({ queryKey: ["/api/remedies/suggestions"] });
      toast({
        title: "Preferences saved",
        description: "Your personalized suggestions are now updated!",
      });
      setEditMode({ profile: false, health: false, notifications: false, accessibility: false });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Load preferences from currentUser
  useEffect(() => {
    if (currentUser) {
      setPreferences({
        fullName: (currentUser as any).fullName || "",
        firstName: (currentUser as any).firstName || "",
        lastName: (currentUser as any).lastName || "",
        location: (currentUser as any).location || "",
        age: (currentUser as any).age?.toString() || "",
        healthGoals: (currentUser as any).healthGoals || [],
        dietaryRestrictions: (currentUser as any).dietaryRestrictions || [],
        allergies: (currentUser as any).allergies || [],
        preferredRemedyForms: (currentUser as any).preferredRemedyForms || [],
        emailNotifications: (currentUser as any).emailNotifications ?? true,
        pushNotifications: (currentUser as any).pushNotifications ?? true,
        weeklyDigest: (currentUser as any).weeklyDigest ?? true,
        newRemedyAlerts: (currentUser as any).newRemedyAlerts ?? true,
        expertTipsEnabled: (currentUser as any).expertTipsEnabled ?? true,
        textSize: (currentUser as any).textSize || "medium",
        highContrast: (currentUser as any).highContrast ?? false,
        reducedMotion: (currentUser as any).reducedMotion ?? false,
        screenReaderOptimized: (currentUser as any).screenReaderOptimized ?? false,
      });
    }
  }, [currentUser]);

  // Apply accessibility settings
  useEffect(() => {
    // Apply text size
    const root = document.documentElement;
    const textSizeMap: Record<string, string> = {
      small: "14px",
      medium: "16px",
      large: "18px",
      extra_large: "20px",
    };
    root.style.fontSize = textSizeMap[preferences.textSize] || "16px";

    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [preferences.textSize, preferences.highContrast, preferences.reducedMotion]);

  // Check authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isAuthenticated) {
          setUser(userData);
          setIsLoading(false);
        } else {
          setLocation('/login');
        }
      } catch (error) {
        localStorage.removeItem('plantrx-user');
        setLocation('/login');
      }
    } else {
      setLocation('/login');
    }
  }, [setLocation]);

  // Check URL params for success messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      toast({
        title: "🎉 Subscription activated!",
        description: "Welcome to your new plan! Your premium features are now unlocked.",
      });
      window.history.replaceState({}, '', '/dashboard');
    }
    if (params.get('trial') === 'started') {
      toast({
        title: "🌟 Gold Trial Activated!",
        description: "You now have 24-hour access to all premium features.",
      });
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  // Fetch user data
  const { data: userSavedRemedies = [], refetch: refetchSavedRemedies } = useQuery<Remedy[]>({
    queryKey: ["/api/saved-remedies"],
    enabled: !!user,
  });

  const { data: customRemedies = [] } = useQuery<CustomRemedy[]>({
    queryKey: ["/api/custom-remedies"],
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: communityStats } = useQuery({
    queryKey: ["/api/user/community-stats"],
    enabled: !!user,
  });

  // Fetch personalized suggestions based on preferences
  const { data: suggestionsData, isLoading: suggestionsLoading, refetch: refetchSuggestions } = useQuery({
    queryKey: ["/api/remedies/suggestions", preferences.healthGoals, preferences.preferredRemedyForms, preferences.allergies],
    queryFn: async () => {
      const hasPreferences = preferences.healthGoals.length > 0 || preferences.preferredRemedyForms.length > 0;
      if (!hasPreferences) return null;
      
      const response = await fetch('/api/remedies/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          healthGoals: preferences.healthGoals,
          dietaryRestrictions: preferences.dietaryRestrictions,
          allergies: preferences.allergies,
          preferredRemedyForms: preferences.preferredRemedyForms,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    enabled: !!user && (preferences.healthGoals.length > 0 || preferences.preferredRemedyForms.length > 0),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setLocation('/');
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out of PlantRx.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue signing you out.",
        variant: "destructive"
      });
    }
  };

  const savePreferences = async (section: string) => {
    setIsSaving(true);
    try {
      const dataToSave: any = {};
      
      if (section === "profile" || section === "all") {
        dataToSave.fullName = preferences.fullName;
        dataToSave.firstName = preferences.firstName;
        dataToSave.lastName = preferences.lastName;
        dataToSave.location = preferences.location;
        dataToSave.age = preferences.age ? parseInt(preferences.age) : undefined;
      }
      
      if (section === "health" || section === "all") {
        dataToSave.healthGoals = preferences.healthGoals;
        dataToSave.dietaryRestrictions = preferences.dietaryRestrictions;
        dataToSave.allergies = preferences.allergies;
        dataToSave.preferredRemedyForms = preferences.preferredRemedyForms;
      }
      
      if (section === "notifications" || section === "all") {
        dataToSave.emailNotifications = preferences.emailNotifications;
        dataToSave.pushNotifications = preferences.pushNotifications;
        dataToSave.weeklyDigest = preferences.weeklyDigest;
        dataToSave.newRemedyAlerts = preferences.newRemedyAlerts;
        dataToSave.expertTipsEnabled = preferences.expertTipsEnabled;
      }
      
      if (section === "accessibility" || section === "all") {
        dataToSave.textSize = preferences.textSize;
        dataToSave.highContrast = preferences.highContrast;
        dataToSave.reducedMotion = preferences.reducedMotion;
        dataToSave.screenReaderOptimized = preferences.screenReaderOptimized;
      }
      
      await updatePreferencesMutation.mutateAsync(dataToSave);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleHealthGoal = (goalId: string) => {
    setPreferences(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalId)
        ? prev.healthGoals.filter(g => g !== goalId)
        : [...prev.healthGoals, goalId]
    }));
  };

  const toggleDietaryRestriction = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(id)
        ? prev.dietaryRestrictions.filter(d => d !== id)
        : [...prev.dietaryRestrictions, id]
    }));
  };

  const toggleAllergy = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(id)
        ? prev.allergies.filter(a => a !== id)
        : [...prev.allergies, id]
    }));
  };

  const toggleRemedyForm = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredRemedyForms: prev.preferredRemedyForms.includes(id)
        ? prev.preferredRemedyForms.filter(r => r !== id)
        : [...prev.preferredRemedyForms, id]
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSubscriptionIcon = () => {
    const tier = (currentUser as any)?.subscriptionTier || 'bronze';
    if (tier === 'gold') return <Crown className="w-5 h-5 text-yellow-500" />;
    if (tier === 'silver') return <Gem className="w-5 h-5 text-gray-400" />;
    return <Star className="w-5 h-5 text-amber-600" />;
  };

  const getSubscriptionColor = () => {
    const tier = (currentUser as any)?.subscriptionTier || 'bronze';
    if (tier === 'gold') return 'from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600/50';
    if (tier === 'silver') return 'from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600/50';
    return 'from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-600/50';
  };

  const getMemberSince = () => {
    const createdAt = (currentUser as any)?.createdAt;
    if (createdAt) {
      return new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Recently joined';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen luxury-gradient-bg relative">
      <SEOHead 
        title="My Dashboard - Personal Health Journey | PlantRx"
        description="Access your personalized PlantRx dashboard to track saved remedies, health progress, and manage your natural wellness journey."
        canonical="https://plantrxapp.com/dashboard"
        noindex={true}
      />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-green-200/20 dark:from-yellow-400/10 dark:to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 relative z-10">
        {/* Banners */}
        <GoldTrialDashboardBanner />
        <ExpiredTrialDiscountBanner />
        
        {/* ==================== PERSONALIZED IDENTITY CARD ==================== */}
        <Card className="luxury-glass luxury-border shadow-2xl backdrop-blur-xl mb-6 sm:mb-8 overflow-hidden" data-testid="card-identity">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/30 via-transparent to-emerald-50/30 dark:from-yellow-400/5 dark:via-transparent dark:to-emerald-400/5"></div>
          
          <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <ProfilePictureUpload 
                  user={currentUser} 
                  size="lg"
                  showUploadButton={true}
                />
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-welcome">
                  Welcome back, {(currentUser as any)?.fullName?.split(' ')[0] || (currentUser as any)?.firstName || user?.username || 'Explorer'}!
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Badge className={`bg-gradient-to-r ${getSubscriptionColor()} px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2`} data-testid="badge-subscription">
                    {getSubscriptionIcon()}
                    {((currentUser as any)?.subscriptionTier || 'bronze').charAt(0).toUpperCase() + ((currentUser as any)?.subscriptionTier || 'bronze').slice(1)} Member
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 text-green-800 dark:text-green-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Active
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="truncate">{(currentUser as any)?.email || user?.email || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2">
                    <CircleUser className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span>@{(currentUser as any)?.username || user?.username || 'guest'}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span>Member since {getMemberSince()}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link href="/settings">
                  <Button variant="outline" className="luxury-border min-h-[44px] w-full sm:w-auto text-sm sm:text-base" data-testid="button-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[44px] w-full sm:w-auto text-sm sm:text-base"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ==================== QUICK STATS ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
          <Card className="group relative overflow-hidden luxury-glass luxury-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" data-testid="card-stat-saved">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 sm:p-5 lg:p-6 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{userSavedRemedies.length}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Saved Remedies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden luxury-glass luxury-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" data-testid="card-stat-custom">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 sm:p-5 lg:p-6 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{customRemedies.length}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Custom Remedies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden luxury-glass luxury-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" data-testid="card-stat-orders">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 sm:p-5 lg:p-6 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Orders Placed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden luxury-glass luxury-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" data-testid="card-stat-community">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 sm:p-5 lg:p-6 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{(communityStats as any)?.posts || 0}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Community Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ==================== MAIN DASHBOARD TABS ==================== */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1.5 sm:gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="overview" 
              className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white py-2 sm:py-3 min-h-[44px] text-xs sm:text-sm"
              data-testid="tab-overview"
            >
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Overview</span>
              <span className="xs:hidden">View</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white py-2 sm:py-3 min-h-[44px] text-xs sm:text-sm"
              data-testid="tab-profile"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white py-2 sm:py-3 min-h-[44px] text-xs sm:text-sm"
              data-testid="tab-notifications"
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Notifications</span>
              <span className="xs:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility" 
              className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white py-2 sm:py-3 min-h-[44px] text-xs sm:text-sm"
              data-testid="tab-accessibility"
            >
              <Accessibility className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Accessibility</span>
              <span className="xs:hidden">Access</span>
            </TabsTrigger>
          </TabsList>

          {/* ==================== OVERVIEW TAB ==================== */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Saved Remedies Preview */}
            <Card className="luxury-glass luxury-border shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  Your Saved Remedies
                </CardTitle>
                <Link href="/remedies/saved">
                  <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm min-h-[44px]">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {userSavedRemedies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {userSavedRemedies.slice(0, 3).map((remedy: any) => (
                      <div key={remedy.id} className="p-3 sm:p-4 luxury-glass luxury-border rounded-xl hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">{remedy.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{remedy.description}</p>
                        <div className="flex items-center gap-1 sm:gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{remedy.category}</Badge>
                          <Badge variant="outline" className="text-xs">{remedy.form}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No saved remedies yet</p>
                    <Link href="/remedies">
                      <Button className="mt-3 sm:mt-4 min-h-[44px] text-sm sm:text-base" variant="outline">Browse Remedies</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personalized Suggestions Based on Preferences */}
            {(preferences.healthGoals.length > 0 || preferences.preferredRemedyForms.length > 0) && (
              <Card className="luxury-glass luxury-border shadow-xl overflow-hidden" data-testid="card-suggestions">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-emerald-50/50 dark:from-purple-900/20 dark:via-transparent dark:to-emerald-900/20 pointer-events-none"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    Personalized For You
                    {suggestionsData?.totalMatches && (
                      <Badge variant="secondary" className="ml-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        {suggestionsData.totalMatches} matches
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Remedies tailored to your health goals and preferences
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {preferences.healthGoals.slice(0, 4).map(goalId => {
                      const goal = HEALTH_GOALS.find(g => g.id === goalId);
                      return goal ? (
                        <Badge key={goalId} className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-800 dark:text-purple-200 px-2 py-1 text-xs">
                          {goal.icon} {goal.label}
                        </Badge>
                      ) : null;
                    })}
                    {preferences.preferredRemedyForms.slice(0, 2).map(formId => {
                      const form = REMEDY_FORMS.find(f => f.id === formId);
                      return form ? (
                        <Badge key={formId} className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-800 dark:text-emerald-200 px-2 py-1 text-xs">
                          {form.icon} {form.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  {suggestionsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 luxury-glass luxury-border rounded-xl animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : suggestionsData?.suggestions?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestionsData.suggestions.map((remedy: any) => (
                        <Link key={remedy.id} href={`/remedy/${remedy.slug}`}>
                          <div className="group p-4 luxury-glass luxury-border rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {remedy.name}
                              </h4>
                              {remedy.averageRating > 0 && (
                                <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-xs">{remedy.averageRating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                              {remedy.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              <Badge variant="outline" className="text-xs capitalize">{remedy.category}</Badge>
                              <Badge variant="outline" className="text-xs capitalize">{remedy.form}</Badge>
                            </div>
                            {remedy.matchReasons?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                {remedy.matchReasons.map((reason: string, idx: number) => (
                                  <span key={idx} className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                                    <Check className="w-3 h-3 mr-0.5" />
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">No matching remedies found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your health goals or preferences</p>
                    </div>
                  )}
                  
                  {suggestionsData?.suggestions?.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <Link href="/remedies">
                        <Button variant="outline" className="min-h-[44px] group">
                          View All Remedies
                          <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ==================== PROFILE TAB ==================== */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card className="luxury-glass luxury-border shadow-xl">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage your profile details
                  </CardDescription>
                </div>
                <Button
                  onClick={() => editMode.profile ? savePreferences("profile") : setEditMode(prev => ({ ...prev, profile: true }))}
                  disabled={isSaving}
                  className={`min-h-[44px] text-sm sm:text-base w-full sm:w-auto ${editMode.profile ? "bg-gradient-to-r from-emerald-500 to-green-600" : ""}`}
                  data-testid="button-edit-profile"
                >
                  {editMode.profile ? (
                    isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />
                  ) : <Edit3 className="w-4 h-4 mr-2" />}
                  {editMode.profile ? (isSaving ? "Saving..." : "Save Changes") : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-900 dark:text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      value={preferences.fullName}
                      onChange={(e) => setPreferences(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={!editMode.profile}
                      className="luxury-border"
                      placeholder="Enter your full name"
                      data-testid="input-fullname"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={preferences.location}
                      onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!editMode.profile}
                      className="luxury-border"
                      placeholder="City, Country"
                      data-testid="input-location"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Cake className="w-4 h-4" /> Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={preferences.age}
                      onChange={(e) => setPreferences(prev => ({ ...prev, age: e.target.value }))}
                      disabled={!editMode.profile}
                      className="luxury-border"
                      placeholder="Your age"
                      data-testid="input-age"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Label>
                    <Input
                      value={(currentUser as any)?.email || ""}
                      disabled
                      className="luxury-border bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>

                {/* Account Info Display */}
                <Separator className="my-4 sm:my-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 luxury-glass luxury-border rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {(currentUser as any)?.role || "Customer"}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 luxury-glass luxury-border rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Subscription</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {(currentUser as any)?.subscriptionTier || "Bronze"} Plan
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 luxury-glass luxury-border rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {getMemberSince()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== NOTIFICATIONS TAB ==================== */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="luxury-glass luxury-border shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell className="w-5 h-5 text-orange-500" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Control how and when you receive updates
                  </CardDescription>
                </div>
                <Button
                  onClick={() => savePreferences("notifications")}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-orange-500 to-amber-600"
                  data-testid="button-save-notifications"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Preferences
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                      data-testid="switch-email"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                      data-testid="switch-push"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary of new remedies and tips</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.weeklyDigest}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyDigest: checked }))}
                      data-testid="switch-digest"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">New Remedy Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new remedies matching your goals</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.newRemedyAlerts}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, newRemedyAlerts: checked }))}
                      data-testid="switch-remedy-alerts"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Expert Tips</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Personalized tips from health experts</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.expertTipsEnabled}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, expertTipsEnabled: checked }))}
                      data-testid="switch-expert-tips"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== ACCESSIBILITY TAB ==================== */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card className="luxury-glass luxury-border shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Accessibility className="w-5 h-5 text-pink-500" />
                    Accessibility Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Customize your viewing experience for comfort and accessibility
                  </CardDescription>
                </div>
                <Button
                  onClick={() => savePreferences("accessibility")}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-pink-500 to-rose-600"
                  data-testid="button-save-accessibility"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Preferences
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Size */}
                <div className="p-4 luxury-glass luxury-border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Type className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Text Size</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the size of text across the app</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "small", label: "Small", size: "text-sm" },
                      { id: "medium", label: "Medium", size: "text-base" },
                      { id: "large", label: "Large", size: "text-lg" },
                      { id: "extra_large", label: "Extra Large", size: "text-xl" },
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setPreferences(prev => ({ ...prev, textSize: size.id }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          preferences.textSize === size.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                        data-testid={`button-textsize-${size.id}`}
                      >
                        <span className={`${size.size} font-medium text-gray-900 dark:text-white`}>{size.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Contrast className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">High Contrast Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, highContrast: checked }))}
                    data-testid="switch-contrast"
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Reduce Motion</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations and transitions</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, reducedMotion: checked }))}
                    data-testid="switch-motion"
                  />
                </div>

                {/* Screen Reader Optimized */}
                <div className="flex items-center justify-between p-4 luxury-glass luxury-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Screen Reader Optimization</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Optimize for screen reader compatibility</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.screenReaderOptimized}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, screenReaderOptimized: checked }))}
                    data-testid="switch-screenreader"
                  />
                </div>

                {/* Preview Box */}
                <div className="p-6 luxury-glass luxury-border rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    This is how text will appear with your current settings. Adjust the options above to find what works best for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
