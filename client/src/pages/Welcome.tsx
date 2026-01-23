import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Leaf, CheckCircle2, ArrowRight, Heart, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [userData, setUserData] = useState({
    age: '',
    location: '',
    healthGoals: [] as string[],
    primaryConcern: '',
    experienceLevel: 'beginner',
    interests: [] as string[],
  });

  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const healthGoalOptions = [
    'Improve digestive health',
    'Better sleep quality',
    'Boost immune system',
    'Reduce stress & anxiety',
    'Increase energy levels',
    'Pain management',
    'Weight management',
    'Skin health',
  ];

  const interestOptions = [
    'Herbal teas',
    'Essential oils',
    'Natural supplements',
    'Meditation & mindfulness',
    'Nutrition guidance',
    'Home remedies',
    'Expert consultations',
    'Community support',
  ];

  const handleGoalToggle = (goal: string) => {
    setUserData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Save user preferences to backend
      await apiRequest('/api/user/onboarding', 'POST', {
        ...userData,
        hasCompletedOnboarding: true
      });

      toast({
        title: "Welcome to PlantRx!",
        description: "Your profile has been set up successfully.",
      });

      // Redirect to dashboard
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !agreedToDisclaimer) {
      toast({
        title: "Agreement required",
        description: "Please read and agree to the disclaimer to continue.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen luxury-gradient-bg relative">
      <SEOHead 
        title="Welcome to PlantRx | Start Your Natural Healing Journey"
        description="Welcome to PlantRx! Let's personalize your natural health journey with expert-guided remedies and holistic wellness solutions."
        noindex={true}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 dark:from-green-400/10 dark:to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200/20 to-amber-200/20 dark:from-yellow-400/10 dark:to-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to PlantRx!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Let's personalize your natural healing journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {currentStep > step ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step 
                    ? 'bg-green-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <Card className="luxury-glass shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Disclaimer */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Important Information
                  </h2>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-lg">
                      Medical Disclaimer
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <p>
                        <strong>PlantRx is an educational platform</strong> providing information about natural remedies and wellness practices. Our content is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.
                      </p>
                      <p>
                        <strong>Always consult with a qualified healthcare professional</strong> before starting any new health regimen, especially if you have pre-existing medical conditions, are pregnant, nursing, or taking medications.
                      </p>
                      <p>
                        <strong>Natural does not always mean safe.</strong> Some herbs and remedies can interact with medications or cause allergic reactions. Individual results may vary.
                      </p>
                      <p>
                        <strong>In case of emergency,</strong> always seek immediate medical attention from licensed healthcare providers.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 mt-6">
                      <Checkbox 
                        id="disclaimer"
                        checked={agreedToDisclaimer}
                        onCheckedChange={(checked) => setAgreedToDisclaimer(checked as boolean)}
                        data-testid="checkbox-disclaimer"
                      />
                      <label 
                        htmlFor="disclaimer" 
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-tight"
                      >
                        I understand and agree that PlantRx provides educational information only, and I will consult healthcare professionals for medical advice.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-600" />
                    Tell Us About Yourself
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Help us personalize your experience with natural remedies
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 28"
                      value={userData.age}
                      onChange={(e) => setUserData({...userData, age: e.target.value})}
                      data-testid="input-age"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (optional)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., London, UK"
                      value={userData.location}
                      onChange={(e) => setUserData({...userData, location: e.target.value})}
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primaryConcern">Primary Health Concern (optional)</Label>
                  <Input
                    id="primaryConcern"
                    placeholder="e.g., Better sleep, stress relief, digestive health"
                    value={userData.primaryConcern}
                    onChange={(e) => setUserData({...userData, primaryConcern: e.target.value})}
                    data-testid="input-primary-concern"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">What are your health goals? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {healthGoalOptions.map((goal) => (
                      <div
                        key={goal}
                        onClick={() => handleGoalToggle(goal)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          userData.healthGoals.includes(goal)
                            ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                        }`}
                        data-testid={`goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={userData.healthGoals.includes(goal)}
                            onCheckedChange={() => handleGoalToggle(goal)}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Experience with natural remedies</Label>
                  <RadioGroup 
                    value={userData.experienceLevel}
                    onValueChange={(value) => setUserData({...userData, experienceLevel: value})}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" data-testid="radio-beginner" />
                        <Label htmlFor="beginner" className="cursor-pointer">Beginner - Just starting out</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" data-testid="radio-intermediate" />
                        <Label htmlFor="intermediate" className="cursor-pointer">Intermediate - Some experience</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" data-testid="radio-advanced" />
                        <Label htmlFor="advanced" className="cursor-pointer">Advanced - Extensive knowledge</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-600" />
                    Your Interests
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    What aspects of natural health interest you most?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <div
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        userData.interests.includes(interest)
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                      }`}
                      data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={userData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{interest}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              <div className={currentStep === 1 ? 'ml-auto' : ''}>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting || (currentStep === 1 && !agreedToDisclaimer)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-next"
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : currentStep === 3 ? (
                    <>
                      Complete & Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
