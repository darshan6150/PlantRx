import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Camera, 
  User, 
  ArrowLeft, 
  Check, 
  Upload, 
  Lock, 
  Key,
  Bell,
  Palette,
  Globe,
  CreditCard,
  Download,
  Trash2,
  LogOut,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Crown,
  Mail,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Laptop,
  Link2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Clock,
  MapPin,
  FileText
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { changePassword, logoutUser } from "@/lib/firebase";
import { useTheme } from "@/components/ThemeProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  useEnhancedPageTracking('settings', 'account');
  
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProfilePictureOpen, setIsProfilePictureOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [newRemedyAlerts, setNewRemedyAlerts] = useState(true);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsPublicProfile(userData.isPublicProfile !== false);
        setEmailNotifications(userData.emailNotifications !== false);
        setPushNotifications(userData.pushNotifications !== false);
        setMarketingEmails(userData.marketingEmails === true);
        setWeeklyDigest(userData.weeklyDigest !== false);
        setNewRemedyAlerts(userData.newRemedyAlerts !== false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLocation('/login');
      }
    } else {
      setLocation('/login');
    }
    setIsLoading(false);
  }, [setLocation]);

  const privacyMutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      const response = await fetch('/api/user/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isPublicProfile: isPublic }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update privacy settings');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Privacy settings updated!", description: "Your account visibility has been changed." });
      updateLocalStorage({ isPublicProfile });
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setIsPublicProfile(!isPublicProfile);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageData }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload profile picture');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Profile picture updated!", description: "Your new profile picture has been saved." });
      updateLocalStorage({ profilePictureUrl: data.profilePictureUrl });
      setIsProfilePictureOpen(false);
      setPreviewImage(null);
    },
    onError: (error: Error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      await changePassword(currentPassword, newPassword);
    },
    onSuccess: () => {
      toast({ title: "Password updated!", description: "Your password has been changed successfully." });
      setIsPasswordChangeOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({ title: "Password change failed", description: error.message || "Failed to update password.", variant: "destructive" });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch('/api/user/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update notification settings');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Notification preferences saved!", description: "Your notification settings have been updated." });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Could not save notification preferences.", variant: "destructive" });
    },
  });

  const updateLocalStorage = (updates: any) => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      const userData = { ...JSON.parse(savedUser), ...updates };
      localStorage.setItem('plantrx-user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const handlePrivacyToggle = (checked: boolean) => {
    setIsPublicProfile(checked);
    privacyMutation.mutate(checked);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const setters: any = {
      emailNotifications: setEmailNotifications,
      pushNotifications: setPushNotifications,
      marketingEmails: setMarketingEmails,
      weeklyDigest: setWeeklyDigest,
      newRemedyAlerts: setNewRemedyAlerts,
    };
    setters[key]?.(value);
    updateLocalStorage({ [key]: value });
    notificationMutation.mutate({ [key]: value });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both password fields match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const handleSignOutEverywhere = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('plantrx-user');
      toast({ title: "Signed out everywhere", description: "All sessions have been terminated." });
      setLocation('/');
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
    }
  };

  const handleDownloadData = () => {
    const dataToDownload = {
      profile: {
        username: user?.username,
        email: user?.email,
        fullName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        memberSince: user?.createdAt || new Date().toISOString(),
      },
      preferences: {
        isPublicProfile,
        emailNotifications,
        pushNotifications,
        marketingEmails,
        weeklyDigest,
        newRemedyAlerts,
        theme,
      },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantrx-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Data downloaded!", description: "Your account data has been exported successfully." });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileValidation(file);
  };

  const handleFileValidation = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file type", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image smaller than 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileValidation(files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleUpload = () => { if (previewImage) uploadMutation.mutate(previewImage); };

  const getSubscriptionBadge = () => {
    const tier = user?.subscriptionTier || 'bronze';
    const colors: any = {
      bronze: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      silver: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
      gold: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
    };
    return colors[tier] || colors.bronze;
  };

  const getMemberSince = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Recently joined';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen luxury-gradient-bg">
      <SEOHead
        title="Account Settings - PlantRx"
        description="Manage your PlantRx account settings, privacy preferences, and profile information."
        keywords="settings, account, privacy, profile, plantrx"
        noindex={true}
      />
      
      <Header />
      
      <div className="container mx-auto mobile-safe-area py-3 sm:py-6 md:py-8 relative z-10 ios-safe-area-bottom px-3 sm:px-4 max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Back to Dashboard</span>
            </Button>
          </Link>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="luxury-glass rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl luxury-border backdrop-blur-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Manage your account, privacy, and preferences</p>
              </div>
              <Badge className={`${getSubscriptionBadge()} px-3 py-1.5 text-xs sm:text-sm font-medium hidden sm:flex items-center gap-1.5`}>
                <Crown className="w-3.5 h-3.5" />
                {(user?.subscriptionTier || 'bronze').charAt(0).toUpperCase() + (user?.subscriptionTier || 'bronze').slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1.5 sm:gap-2 bg-transparent p-0">
            <TabsTrigger value="account" className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white py-2.5 sm:py-3 text-xs sm:text-sm" data-testid="tab-account">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white py-2.5 sm:py-3 text-xs sm:text-sm" data-testid="tab-notifications">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white py-2.5 sm:py-3 text-xs sm:text-sm" data-testid="tab-appearance">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="support" className="luxury-glass luxury-border data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white py-2.5 sm:py-3 text-xs sm:text-sm" data-testid="tab-support">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* ==================== ACCOUNT TAB ==================== */}
          <TabsContent value="account" className="space-y-4 sm:space-y-6">
            {/* Profile Settings */}
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Your personal details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="w-14 h-14 sm:w-16 sm:h-16 luxury-border shadow-xl">
                      {user?.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white text-lg sm:text-xl font-bold">
                          {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || user.username}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">@{user.username || user.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  
                  <Dialog open={isProfilePictureOpen} onOpenChange={setIsProfilePictureOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Change Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md luxury-glass">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Update Profile Picture</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">Upload a new profile picture</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <Avatar className="w-32 h-32">
                            {previewImage ? (
                              <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-full" />
                            ) : user?.profilePictureUrl ? (
                              <img src={user.profilePictureUrl} alt="Current" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <AvatarFallback className="bg-green-600 text-white text-2xl font-semibold">
                                {user?.firstName?.[0]?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-green-400'}`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag and drop or click to select</p>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="profile-picture-input" />
                          <Label htmlFor="profile-picture-input">
                            <Button type="button" variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button>
                          </Label>
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={handleUpload} disabled={!previewImage || uploadMutation.isPending} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white">
                            {uploadMutation.isPending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Uploading...</> : <><Check className="w-4 h-4 mr-2" />Save Photo</>}
                          </Button>
                          <Button variant="outline" onClick={() => { setIsProfilePictureOpen(false); setPreviewImage(null); }} disabled={uploadMutation.isPending}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase">Email</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white truncate">{user.email}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase">Member Since</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">{getMemberSince()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                  Security
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Protect your account with strong security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">Password</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last changed: Unknown</p>
                    </div>
                  </div>
                  <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">Change</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md luxury-glass">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Change Password</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">Enter your current password and choose a new one</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-900 dark:text-white">Current Password</Label>
                          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" placeholder="Enter current password" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-900 dark:text-white">New Password</Label>
                          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" placeholder="Min 6 characters" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</Label>
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" placeholder="Confirm password" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword || passwordMutation.isPending} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white">
                            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                          </Button>
                          <Button variant="outline" onClick={() => { setIsPasswordChangeOpen(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FaGoogle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">Google Account</p>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Connected</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Linked</Badge>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20" data-testid="btn-signout-everywhere">
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out Everywhere</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="luxury-glass">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900 dark:text-white">Sign out of all devices?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">This will sign you out of all devices and browsers where you're currently logged in.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOutEverywhere} className="bg-orange-600 hover:bg-orange-700">Sign Out Everywhere</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Privacy
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Control your visibility and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">Public Profile</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{isPublicProfile ? "Others can see your activity" : "Your profile is hidden"}</p>
                  </div>
                  <Switch checked={isPublicProfile} onCheckedChange={handlePrivacyToggle} disabled={privacyMutation.isPending} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Data & Privacy</h4>
                  
                  <Button variant="outline" className="w-full justify-between" onClick={handleDownloadData} data-testid="btn-download-data">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Download My Data</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>

                  <Link href="/privacy-policy">
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">Privacy Policy</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white capitalize">{user?.subscriptionTier || 'Bronze'} Plan</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {user?.subscriptionTier === 'gold' ? 'Full access to all features' : 'Upgrade for more features'}
                      </p>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium" data-testid="btn-manage-subscription">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {user?.subscriptionTier === 'gold' ? 'Manage Plan' : 'Upgrade'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="luxury-glass border-red-200 dark:border-red-800">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20" data-testid="btn-delete-account">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete Account</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="luxury-glass">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        This action cannot be undone. All your data, saved remedies, and preferences will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => toast({ title: "Contact Support", description: "Please email support@plantrx.com to delete your account." })}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== NOTIFICATIONS TAB ==================== */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Choose what emails you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {[
                  { key: 'emailNotifications', label: 'Account Updates', desc: 'Important updates about your account', value: emailNotifications, icon: Mail },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A summary of new remedies and tips', value: weeklyDigest, icon: FileText },
                  { key: 'newRemedyAlerts', label: 'New Remedy Alerts', desc: 'Get notified when new remedies are added', value: newRemedyAlerts, icon: Sparkles },
                  { key: 'marketingEmails', label: 'Marketing & Promotions', desc: 'Special offers and announcements', value: marketingEmails, icon: Bell },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <Switch checked={item.value} onCheckedChange={(v) => handleNotificationChange(item.key, v)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Push Notifications
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Browser and mobile notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">Enable Push Notifications</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Receive instant updates in your browser</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={(v) => handleNotificationChange('pushNotifications', v)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== APPEARANCE TAB ==================== */}
          <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                  Theme
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Clean & bright' },
                    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on eyes' },
                    { value: 'system', label: 'System', icon: Laptop, desc: 'Auto switch' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === option.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                      data-testid={`theme-${option.value}`}
                    >
                      <option.icon className={`w-6 h-6 mx-auto mb-2 ${theme === option.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                      {theme === option.value && <Check className="w-4 h-4 text-purple-500 mx-auto mt-2" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">More languages coming soon. Currently supporting English.</p>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English (US)</SelectItem>
                      <SelectItem value="en-gb">🇬🇧 English (UK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== SUPPORT TAB ==================== */}
          <TabsContent value="support" className="space-y-4 sm:space-y-6">
            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Help & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Link href="/about">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">About PlantRx</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </Link>
                
                <a href="mailto:support@plantrx.com">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Contact Support</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </Button>
                </a>

                <Link href="/medical-disclaimer">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Medical Disclaimer</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </Link>

                <Link href="/terms">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Terms & Conditions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="luxury-glass luxury-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                  Feedback
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Help us improve PlantRx
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    We'd love to hear your thoughts! Share your feedback, report bugs, or suggest new features.
                  </p>
                  <a href="mailto:feedback@plantrx.com?subject=PlantRx Feedback">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Feedback
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="luxury-glass luxury-border">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">PlantRx</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Version 2.0.0</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">© 2025 PlantRx. All rights reserved.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
