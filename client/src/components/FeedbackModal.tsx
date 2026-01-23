import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MessageSquare, AlertTriangle, Lightbulb, Bug, X, Send, Star } from "lucide-react";

const feedbackSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
  type: z.enum(["feedback", "complaint", "bug_report", "suggestion"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const feedbackTypes = [
  { 
    value: "feedback", 
    label: "General Feedback", 
    icon: MessageSquare, 
    description: "Share your thoughts about PlantRx",
    color: "text-blue-600 dark:text-blue-400"
  },
  { 
    value: "complaint", 
    label: "Complaint", 
    icon: AlertTriangle, 
    description: "Report an issue or concern",
    color: "text-red-600 dark:text-red-400"
  },
  { 
    value: "bug_report", 
    label: "Bug Report", 
    icon: Bug, 
    description: "Report technical problems",
    color: "text-orange-600 dark:text-orange-400"
  },
  { 
    value: "suggestion", 
    label: "Suggestion", 
    icon: Lightbulb, 
    description: "Suggest improvements or new features",
    color: "text-green-600 dark:text-green-400"
  },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>("feedback");

  // Get user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
      subject: "",
      message: "",
      type: "feedback",
      priority: "medium",
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      return await apiRequest("/api/feedback", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "✅ Feedback Submitted Successfully!",
        description: "Thank you for your feedback. We'll review it and get back to you soon.",
        duration: 5000,
      });
      form.reset();
      setSelectedType("");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Failed to Submit Feedback",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: FeedbackFormData) => {
    submitFeedbackMutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setSelectedType("feedback");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pb-4">
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              Help us improve PlantRx by sharing your thoughts, reporting issues, or suggesting new features. 
              Your feedback is valuable to us and helps make our platform better for everyone.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            {/* Feedback Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                What type of feedback would you like to share?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.value;
                  
                  return (
                    <div
                      key={type.value}
                      onClick={() => {
                        setSelectedType(type.value);
                        form.setValue("type", type.value as any);
                      }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                      }`}
                      data-testid={`type-${type.value}`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className={`w-5 h-5 mt-0.5 ${type.color}`} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {type.label}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.type && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...form.register("email")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                    Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...form.register("name")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-900 dark:text-white">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Brief summary of your feedback"
                    {...form.register("subject")}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    data-testid="input-subject"
                  />
                  {form.formState.errors.subject && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium text-gray-900 dark:text-white">
                    Priority
                  </Label>
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(value: any) => form.setValue("priority", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" data-testid="select-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-900 dark:text-white">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please provide detailed information about your feedback, including any steps to reproduce issues or specific suggestions..."
                  rows={6}
                  {...form.register("message")}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 resize-none"
                  data-testid="message-input"
                />
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {form.formState.errors.message
                      ? form.formState.errors.message.message
                      : "Minimum 10 characters required"}
                  </span>
                  <span>{form.watch("message")?.length || 0}/1000</span>
                </div>
              </div>

              {/* Privacy Notice */}
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Privacy Notice:</strong> Your feedback will be reviewed by our team and may be used to improve PlantRx. 
                  We respect your privacy and will never share your contact information with third parties.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitFeedbackMutation.isPending || !form.formState.isValid}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
                  data-testid="button-submit-feedback"
                >
                  {submitFeedbackMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}