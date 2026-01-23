import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, Star, Award, Users, BookOpen, MapPin, UserPlus, Mail } from "lucide-react";
import ExpertCard from "@/components/ExpertCard";
import { BusinessMap } from "@/components/BusinessMap";
import { EnhancedRegistration } from "@/components/EnhancedRegistration";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

export default function Experts() {
  return (
    <UpgradeInterstitial feature={Feature.EXPERT_CONSULTATIONS}>
      <ExpertsContent />
    </UpgradeInterstitial>
  );
}

function ExpertsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("experts");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: experts = [], isLoading } = useQuery({
    queryKey: ["/api/experts"],
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Here you would typically send to your backend
      console.log('Email submitted for notifications:', email);
      setIsSubmitted(true);
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const filteredExperts = (experts as any[]).filter((expert: any) =>
    expert.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (expert.expertCredentials?.specialization || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample expert data with clearly fictional names for demonstration purposes
  const featuredExperts = [
    {
      id: 1,
      name: "Dr. Sage Herbwell",
      title: "Naturopathic Doctor",
      specialization: "Herbal Medicine & Digestive Health",
      experience: "15+ years",
      education: "ND from Fictional University, MS in Herbal Medicine",
      certifications: ["Licensed Naturopathic Doctor", "Certified Herbalist", "AANP Member"],
      remedies: 127,
      rating: 4.9,
      bio: "Dr. Herbwell specializes in integrative approaches to digestive health, combining traditional herbal medicine with modern nutritional science.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Felix Plantwise",
      title: "Clinical Herbalist",
      specialization: "Stress, Anxiety & Mental Wellness",
      experience: "12+ years",
      education: "Master's in Botanical Medicine, PhD in Demo Studies",
      certifications: ["Registered Herbalist (Demo)", "Clinical Aromatherapist", "Mindfulness Teacher"],
      remedies: 89,
      rating: 4.8,
      bio: "Dr. Plantwise focuses on plant-based approaches to mental wellness, specializing in adaptogenic herbs and stress management.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Luna Wellspring",
      title: "Ayurvedic Practitioner",
      specialization: "Constitutional Medicine & Nutrition",
      experience: "18+ years",
      education: "BAMS from Example College, MS in Nutrition",
      certifications: ["Certified Ayurvedic Practitioner", "Clinical Nutritionist", "Demo Specialist"],
      remedies: 156,
      rating: 4.9,
      bio: "Dr. Wellspring brings authentic Ayurvedic wisdom to modern wellness, specializing in constitutional analysis and personalized nutrition.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-gray-950 dark:to-black">
      <SEOHead 
        title="Expert Health Professionals - Natural Medicine Specialists"
        description="Connect with verified natural health experts, naturopathic doctors, and certified herbalists. Find professional health guidance and join our expert network for natural medicine and wellness consultations."
        keywords="natural health experts, naturopathic doctors, certified herbalists, health professionals, expert consultations, natural medicine specialists, wellness experts"
        canonical="https://plantrxapp.com/experts"
      />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              Expert Network
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover verified health professionals, explore our business directory, and join our expert community
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 sm:mb-12 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/20 h-auto">
            <TabsTrigger 
              value="experts" 
              className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[48px] sm:min-h-[60px]"
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">
                <span className="hidden sm:inline">Expert Profiles</span>
                <span className="sm:hidden">Experts</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[48px] sm:min-h-[60px]"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">
                <span className="hidden sm:inline">Business Map</span>
                <span className="sm:hidden">Map</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="join" 
              className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[48px] sm:min-h-[60px]"
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Join Us</span>
            </TabsTrigger>
          </TabsList>

          {/* Expert Profiles Tab */}
          <TabsContent value="experts" className="space-y-6 sm:space-y-8">
            {/* Coming Soon Overlay */}
            <div className="relative">
              {/* Blurred Background Content */}
              <div className="blur-sm opacity-30 pointer-events-none">
                {/* Search */}
                <div className="max-w-3xl mx-auto mb-8 sm:mb-16">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1 border border-gray-200/50 dark:border-gray-800/50">
                      <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 sm:w-6 sm:h-6" />
                      <Input
                        placeholder="Search experts by name or specialization..."
                        value=""
                        className="pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 bg-transparent border-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:ring-0 text-base sm:text-lg rounded-xl sm:rounded-2xl"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">127+</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-base">Verified Experts</div>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">850+</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-base">Expert Remedies</div>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                        <Award className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">25+</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-base">Specializations</div>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-4 flex items-center justify-center shadow-lg">
                        <Star className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">4.8</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-base">Average Rating</div>
                    </div>
                  </div>
                </div>

                {/* Featured Experts */}
                <div className="mb-12 sm:mb-20">
                  <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-12 text-center">Featured Experts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl sm:rounded-3xl shadow-xl">
                      <CardContent className="p-4 sm:p-8 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3 sm:mb-4"></div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Dr. Expert Name</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Natural Health Specialist</p>
                        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full">
                          Verified Expert
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-xl">
                      <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dr. Another Expert</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Herbal Medicine Expert</p>
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full">
                          Verified Expert
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-xl">
                      <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dr. Third Expert</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Wellness Practitioner</p>
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold rounded-full">
                          Verified Expert
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center max-w-2xl mx-auto px-4 sm:px-8">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl sm:rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <Card className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl sm:rounded-3xl shadow-2xl">
                      <CardContent className="p-6 sm:p-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl">
                          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                          Coming Soon
                        </h2>
                        
                        <p className="text-base sm:text-xl text-gray-700 dark:text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                          We're building the world's largest network of verified natural health experts. Get exclusive early access to:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Expert consultations</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Custom remedy creation</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Professional networking</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Verified credentials</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Notification Signup */}
            <div className="mt-8 sm:mt-12">
              <div className="relative group max-w-2xl mx-auto px-4 sm:px-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <Card className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl sm:rounded-3xl shadow-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-center mb-4 sm:mb-6">
                      <Mail className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4 p-2 sm:p-3 text-white" />
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Notified When We Launch</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Be the first to access our expert network and receive exclusive health insights
                      </p>
                    </div>
                    
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4">
                      <Input
                        placeholder="Enter your email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 py-3 px-4 text-gray-900 dark:text-white bg-white/90 dark:bg-black/90 border-gray-200 dark:border-gray-700 rounded-xl"
                      />
                      <Button 
                        type="submit"
                        disabled={isSubmitted}
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitted ? "Added!" : "Notify Me"}
                      </Button>
                    </form>
                    
                    {isSubmitted ? (
                      <p className="text-center text-sm text-green-600 dark:text-green-400 mt-4 font-medium">
                        ✓ Thank you! You'll be notified when our expert network launches.
                      </p>
                    ) : (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        No spam, just exclusive updates about our expert network launch
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Business Map Tab */}
          <TabsContent value="map" className="space-y-8">
            {/* Coming Soon - Business Map */}
            <div className="text-center py-20">
              <div className="relative group max-w-2xl mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <Card className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl">
                  <CardContent className="p-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      Interactive Business Map
                    </h2>
                    
                    <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                      Discover verified natural health businesses near you with our interactive map featuring real-time location data and expert-verified establishments.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Location-based search</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Business verification</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Expert recommendations</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Real-time availability</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Coming soon - Sign up above to get notified when this feature launches
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Join Us Tab */}
          <TabsContent value="join" className="space-y-8">
            {/* Coming Soon - Expert Applications */}
            <div className="text-center py-20">
              <div className="relative group max-w-2xl mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <Card className="relative bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-2xl">
                  <CardContent className="p-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                      <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      Expert Applications
                    </h2>
                    
                    <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                      Join the world's most trusted network of natural health professionals. Our rigorous verification process ensures only qualified experts join our community.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Credential verification</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Professional networking</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Revenue opportunities</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">Global reach</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Applications opening soon - Join our notification list above for early access
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
