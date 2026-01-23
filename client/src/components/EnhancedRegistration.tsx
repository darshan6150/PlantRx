import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Stethoscope, Users, ArrowRight, CheckCircle, Globe, MapPin } from "lucide-react";
import { customerRegistrationSchema, expertRegistrationSchema } from "@shared/schema";
import type { CustomerRegistration, ExpertRegistration } from "@shared/schema";

const HEALTH_INTERESTS = [
  "Natural Remedies", "Herbal Medicine", "Nutrition", "Mental Wellness", 
  "Fitness", "Sleep Health", "Digestive Health", "Skin Care", 
  "Pain Management", "Stress Relief", "Women's Health", "Heart Health"
];

const EXPERTISE_FIELDS = [
  "Naturopathy", "Herbalism", "Nutrition & Dietetics", "Ayurveda", 
  "Traditional Chinese Medicine", "Homeopathy", "Acupuncture", 
  "Massage Therapy", "Aromatherapy", "Yoga Therapy", "Mental Health", 
  "Chiropractic", "Reflexology", "Energy Healing", "Clinical Psychology"
];

interface EnhancedRegistrationProps {
  onSuccess?: (user: any) => void;
  className?: string;
}

export function EnhancedRegistration({ onSuccess, className = "" }: EnhancedRegistrationProps) {
  const [activeTab, setActiveTab] = useState("customer");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Customer form
  const customerForm = useForm<CustomerRegistration>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      age: undefined,
      location: "",
      healthInterests: [],
    },
  });

  // Expert form
  const expertForm = useForm<ExpertRegistration>({
    resolver: zodResolver(expertRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      linkedinUrl: "",
      highestDegree: "",
      fieldOfExpertise: "",
      businessAddress: "",
      contactNumber: "",
      shortBio: "",
      profilePictureUrl: "",
    },
  });

  // Customer registration mutation
  const customerMutation = useMutation({
    mutationFn: async (data: CustomerRegistration) => {
      const response = await fetch("/api/auth/register/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome to PlantRx!",
        description: "Your customer account has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      onSuccess?.(data.user);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Expert registration mutation
  const expertMutation = useMutation({
    mutationFn: async (data: ExpertRegistration) => {
      const response = await fetch("/api/auth/register/expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Expert Application Submitted!",
        description: "Your application is under review. We'll contact you within 24-48 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experts"] });
      onSuccess?.(data.user);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCustomerSubmit = (data: CustomerRegistration) => {
    customerMutation.mutate({
      ...data,
      healthInterests: selectedInterests,
    });
  };

  const onExpertSubmit = (data: ExpertRegistration) => {
    expertMutation.mutate(data);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-sage-200 dark:border-sage-800 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            Join PlantRx Community
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your path to natural wellness. Join as a customer to discover remedies, or apply as an expert to share your knowledge.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="customer" className="flex items-center gap-2 py-3 text-gray-900 dark:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                Customer Account
              </TabsTrigger>
              <TabsTrigger value="expert" className="flex items-center gap-2 py-3 text-gray-900 dark:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Stethoscope className="h-4 w-4" />
                Expert Application
              </TabsTrigger>
            </TabsList>

            {/* Customer Registration */}
            <TabsContent value="customer" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create Your Customer Account</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access personalized remedies, track your health journey, and connect with experts.
                </p>
              </div>

              <Form {...customerForm}>
                <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={customerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={customerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={customerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={customerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={customerForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Age (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Your age" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={customerForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Location (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-900 dark:text-white">Health Interests (Optional)</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Select areas you're interested in to get personalized recommendations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {HEALTH_INTERESTS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={selectedInterests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={customerMutation.isPending}
                  >
                    {customerMutation.isPending ? (
                      "Creating Account..."
                    ) : (
                      <>
                        Create Customer Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Expert Registration */}
            <TabsContent value="expert" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Apply to Become a Verified Expert</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your expertise with our community. All applications are thoroughly reviewed for quality and authenticity.
                </p>
              </div>

              <Form {...expertForm}>
                <form onSubmit={expertForm.handleSubmit(onExpertSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                      <UserPlus className="h-5 w-5" />
                      Basic Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={expertForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. Jane Smith" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={expertForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="dr.janesmith" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={expertForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Professional Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@clinic.com" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={expertForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a secure password" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={expertForm.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+44 20 1234 5678" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                      <CheckCircle className="h-5 w-5" />
                      Professional Credentials
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={expertForm.control}
                        name="highestDegree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Highest Degree</FormLabel>
                            <FormControl>
                              <Input placeholder="PhD in Naturopathic Medicine" {...field} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={expertForm.control}
                        name="fieldOfExpertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white">Field of Expertise</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                  <SelectValue placeholder="Select your primary expertise" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                {EXPERTISE_FIELDS.map((field) => (
                                  <SelectItem key={field} value={field} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {field}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={expertForm.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">LinkedIn Profile (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://linkedin.com/in/yourprofile" 
                              {...field} 
                              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                      <MapPin className="h-5 w-5" />
                      Business Information
                    </h4>
                    
                    <FormField
                      control={expertForm.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Business Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="123 Wellness Street, London, UK, SW1A 1AA"
                              className="min-h-[60px] text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={expertForm.control}
                      name="shortBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your background, experience, and approach to natural health..."
                              className="min-h-[100px] text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={expertForm.control}
                      name="profilePictureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">Profile Picture URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/your-photo.jpg" 
                              {...field} 
                              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-900 dark:text-white">Application Review Process</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Your application will be reviewed within 24-48 hours</li>
                      <li>• We may contact you for additional verification</li>
                      <li>• Once approved, you'll have access to expert features</li>
                      <li>• You can create and share remedies with the community</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={expertMutation.isPending}
                  >
                    {expertMutation.isPending ? (
                      "Submitting Application..."
                    ) : (
                      <>
                        Submit Expert Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}