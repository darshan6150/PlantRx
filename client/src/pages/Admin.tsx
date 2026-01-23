import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Activity, 
  Eye,
  Plus,
  Settings,
  BarChart3,
  FileText,
  Shield,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { insertRemedySchema } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newRemedyData, setNewRemedyData] = useState({
    name: "",
    slug: "",
    description: "",
    ingredients: "",
    benefits: "",
    instructions: "",
    form: "",
    category: "",
    imageUrl: ""
  });
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const { toast } = useToast();

  // Fetch pending experts
  const { data: pendingExperts = [], isLoading: isLoadingExperts } = useQuery({
    queryKey: ["/api/experts/pending"],
  });

  // Fetch all remedies for management
  const { data: allRemedies = [], isLoading: isLoadingRemedies } = useQuery({
    queryKey: ["/api/remedies"],
  });

  // Expert approval mutations
  const approveExpertMutation = useMutation({
    mutationFn: async ({ expertId, status }: { expertId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/experts/${expertId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experts/pending"] });
      toast({
        title: "Expert status updated",
        description: "The expert's status has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating expert",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create remedy mutation
  const createRemedyMutation = useMutation({
    mutationFn: async (remedyData: any) => {
      const response = await apiRequest("POST", "/api/remedies", remedyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/remedies"] });
      toast({
        title: "Remedy created",
        description: "New remedy has been successfully created.",
      });
      // Reset form
      setNewRemedyData({
        name: "",
        slug: "",
        description: "",
        ingredients: "",
        benefits: "",
        instructions: "",
        form: "",
        category: "",
        imageUrl: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating remedy",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleExpertAction = (expertId: number, status: "approved" | "rejected") => {
    approveExpertMutation.mutate({ expertId, status });
  };

  const handleCreateRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const remedyData = {
        ...newRemedyData,
        slug: newRemedyData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        ingredients: newRemedyData.ingredients.split(',').map(i => i.trim()),
        benefits: newRemedyData.benefits.split(',').map(b => b.trim()),
        expertId: null,
        isGenerated: false
      };

      createRemedyMutation.mutate(remedyData);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewRemedyData(prev => ({ ...prev, [field]: value }));
  };

  // Mock analytics data
  const mockAnalytics = {
    totalUsers: 1247,
    totalRemedies: allRemedies.length,
    totalExperts: 23,
    monthlySearches: 8945,
    conversionRate: 12.5,
    popularCategories: [
      { name: "Sleep", count: 156 },
      { name: "Digestive", count: 142 },
      { name: "Immune", count: 89 },
      { name: "Anti-inflammatory", count: 67 }
    ]
  };

  return (
    <div className="min-h-screen luxury-gradient-bg">
      <SEOHead 
        title="Admin Dashboard - PlantRx Management"
        description="PlantRx administrative dashboard for managing experts, remedies, and platform analytics."
        noindex={true}
        canonical="https://plantrxapp.com/admin"
      />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage experts, remedies, and platform analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockAnalytics.totalUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-sage/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <FileText className="w-6 h-6 text-sage" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockAnalytics.totalRemedies}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Remedies</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockAnalytics.totalExperts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified Experts</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockAnalytics.monthlySearches}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Searches</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="experts">Expert Approval</TabsTrigger>
            <TabsTrigger value="remedies">Remedies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-900">Expert Applications</div>
                      <div className="text-sm text-orange-700">{pendingExperts.length} pending review</div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-600">
                      {pendingExperts.length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Content Moderation</div>
                      <div className="text-sm text-blue-700">3 remedies flagged</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-600">3</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-sage" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>New expert application from Dr. Johnson</span>
                      <span className="text-gray-500 text-xs">2h ago</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>AI generated new remedy for stress relief</span>
                      <span className="text-gray-500 text-xs">4h ago</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>157 new user registrations today</span>
                      <span className="text-gray-500 text-xs">6h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sage mb-2">{mockAnalytics.conversionRate}%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-calmBlue mb-2">4.8★</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Expert Applications ({pendingExperts.length})
                  </div>
                  <Badge className="bg-orange-100 text-orange-600">
                    {pendingExperts.length} Pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingExperts ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
                    ))}
                  </div>
                ) : pendingExperts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending expert applications at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingExperts.map((expert: any) => (
                      <div key={expert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <img
                                src={`https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1582750433449-648ed127bb54' : '1612349317150-e413f6a5b16d'}?w=60&h=60&fit=crop&crop=face`}
                                alt={expert.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Dr. {expert.username}</h4>
                                <p className="text-sm text-gray-600">{expert.email}</p>
                              </div>
                            </div>
                            
                            {expert.expertCredentials && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Specialization:</span>
                                  <p className="text-sm text-gray-600">{expert.expertCredentials.specialization || "Not specified"}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Experience:</span>
                                  <p className="text-sm text-gray-600">{expert.expertCredentials.experience || "Not specified"}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Education:</span>
                                  <p className="text-sm text-gray-600">{expert.expertCredentials.education || "Not specified"}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Website:</span>
                                  <p className="text-sm text-gray-600">{expert.expertCredentials.website || "Not provided"}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedExpert(expert)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Expert Application Review</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-4">
                                    <img
                                      src={`https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1582750433449-648ed127bb54' : '1612349317150-e413f6a5b16d'}?w=80&h=80&fit=crop&crop=face`}
                                      alt={expert.username}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                      <h3 className="font-semibold text-lg">Dr. {expert.username}</h3>
                                      <p className="text-gray-600">{expert.email}</p>
                                      <p className="text-sm text-gray-500">Applied {new Date(expert.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  {expert.expertCredentials && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="font-medium">Specialization</Label>
                                        <p className="text-gray-700">{expert.expertCredentials.specialization}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Experience</Label>
                                        <p className="text-gray-700">{expert.expertCredentials.experience}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Education & Qualifications</Label>
                                        <p className="text-gray-700">{expert.expertCredentials.education}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Professional Website</Label>
                                        <p className="text-gray-700">{expert.expertCredentials.website || "Not provided"}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleExpertAction(expert.id, "rejected")}
                                      disabled={approveExpertMutation.isPending}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleExpertAction(expert.id, "approved")}
                                      disabled={approveExpertMutation.isPending}
                                      className="bg-sage hover:bg-forest"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              onClick={() => handleExpertAction(expert.id, "rejected")}
                              variant="outline"
                              disabled={approveExpertMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleExpertAction(expert.id, "approved")}
                              disabled={approveExpertMutation.isPending}
                              className="bg-sage hover:bg-forest"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remedies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Remedy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Remedy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRemedy} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Remedy Name</Label>
                      <Input
                        id="name"
                        value={newRemedyData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g., Golden Turmeric Blend"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newRemedyData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe the remedy and its primary purpose..."
                        className="resize-none h-20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="form">Form</Label>
                        <Select value={newRemedyData.form} onValueChange={(value) => handleInputChange("form", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select form" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tea">Tea</SelectItem>
                            <SelectItem value="tincture">Tincture</SelectItem>
                            <SelectItem value="capsule">Capsule</SelectItem>
                            <SelectItem value="topical">Topical</SelectItem>
                            <SelectItem value="powder">Powder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newRemedyData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sleep">Sleep & Relaxation</SelectItem>
                            <SelectItem value="digestive">Digestive Health</SelectItem>
                            <SelectItem value="immune-support">Immune Support</SelectItem>
                            <SelectItem value="anti-inflammatory">Anti-Inflammatory</SelectItem>
                            <SelectItem value="stress-relief">Stress & Anxiety</SelectItem>
                            <SelectItem value="pain-relief">Pain Relief</SelectItem>
                            <SelectItem value="skin-care">Skin Care</SelectItem>
                            <SelectItem value="wound-care">Wound Care</SelectItem>
                            <SelectItem value="antioxidant">Antioxidant</SelectItem>
                            <SelectItem value="antimicrobial">Antimicrobial</SelectItem>
                            <SelectItem value="brain-health">Brain & Cognitive</SelectItem>
                            <SelectItem value="throat-health">Throat Health</SelectItem>
                            <SelectItem value="kidney-health">Kidney Health</SelectItem>
                            <SelectItem value="liver-health">Liver Health</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                      <Input
                        id="ingredients"
                        value={newRemedyData.ingredients}
                        onChange={(e) => handleInputChange("ingredients", e.target.value)}
                        placeholder="e.g., Turmeric Extract, Black Pepper, Ginger Root"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                      <Input
                        id="benefits"
                        value={newRemedyData.benefits}
                        onChange={(e) => handleInputChange("benefits", e.target.value)}
                        placeholder="e.g., Reduces inflammation, Supports joint health"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={newRemedyData.instructions}
                        onChange={(e) => handleInputChange("instructions", e.target.value)}
                        placeholder="How to prepare and use this remedy..."
                        className="resize-none h-20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Image URL (optional)</Label>
                      <Input
                        id="imageUrl"
                        value={newRemedyData.imageUrl}
                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createRemedyMutation.isPending}
                      className="w-full bg-sage hover:bg-forest"
                    >
                      {createRemedyMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </div>
                      ) : (
                        "Create Remedy"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Remedy Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Remedy Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRemedies ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-16"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 mb-4">
                        <Search className="w-4 h-4 text-gray-400" />
                        <Input placeholder="Search remedies..." className="flex-1" />
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {allRemedies.slice(0, 10).map((remedy: any) => (
                          <div key={remedy.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{remedy.name}</div>
                              <div className="text-xs text-gray-500">
                                {remedy.category} • {remedy.form}
                                {remedy.isGenerated && " • AI Generated"}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={remedy.isActive ? "default" : "secondary"}>
                                {remedy.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Popular Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.popularCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm text-gray-500">{category.count} searches</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-sage h-2 rounded-full"
                              style={{ width: `${(category.count / 156) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Usage Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium text-blue-900">AI Searches</div>
                        <div className="text-sm text-blue-700">Daily average</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">298</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-medium text-purple-900">Symptom Analysis</div>
                        <div className="text-sm text-purple-700">Daily average</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">156</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-900">Remedy Generation</div>
                        <div className="text-sm text-green-700">Daily average</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">42</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600">API Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sage mb-2">245ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-calmBlue mb-2">15.2K</div>
                    <div className="text-sm text-gray-600">Daily API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">0.02%</div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Platform Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      Platform configuration settings. Changes require admin approval.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Expert Auto-Approval</div>
                        <div className="text-sm text-gray-600">Automatically approve certain expert types</div>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">AI Content Generation</div>
                        <div className="text-sm text-gray-600">Allow AI to create new remedies</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Public API Access</div>
                        <div className="text-sm text-gray-600">Enable external API integrations</div>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connection</span>
                      <Badge className="bg-green-100 text-green-600">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">OpenAI API</span>
                      <Badge className="bg-green-100 text-green-600">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stripe Integration</span>
                      <Badge className="bg-green-100 text-green-600">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firebase Auth</span>
                      <Badge className="bg-green-100 text-green-600">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Service</span>
                      <Badge className="bg-yellow-100 text-yellow-600">Limited</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-sage hover:bg-forest">
                    Run System Check
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
