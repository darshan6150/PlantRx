import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Shield, AlertTriangle, MessageCircle, HelpCircle, Sparkles, Clock, CheckCircle2, Leaf } from "lucide-react";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  useEnhancedPageTracking('contact', 'main');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    urgent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine the correct email based on category
      let toEmail = "support@plantrxapp.com";
      if (formData.category === "billing") {
        toEmail = "billing@plantrxapp.com";
      } else if (formData.category === "privacy") {
        toEmail = "legal@plantrxapp.com";
      }

      // Get category label for display
      const categoryLabel = contactCategories.find(c => c.value === formData.category)?.label || formData.category;

      // Format the email body
      const emailBody = `
Hello PlantRx Support Team,

${formData.message}

---
Contact Details:
Name: ${formData.name}
Email: ${formData.email}
Category: ${categoryLabel}
${formData.urgent ? "⚠️ URGENT: This requires immediate attention" : ""}

Sent via PlantRx Contact Form
      `.trim();

      // Create subject line
      const emailSubject = formData.urgent 
        ? `[URGENT] ${formData.subject}` 
        : formData.subject;

      // Create mailto link and open email client
      const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      toast({
        title: "Opening Email Client",
        description: "Your email app should open with your message ready to send.",
      });

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
          urgent: false
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Refunds" },
    { value: "privacy", label: "Privacy & Data Deletion" },
    { value: "expert", label: "Expert Application" },
    { value: "report", label: "Report Content/User" },
    { value: "partnership", label: "Business Partnership" },
    { value: "media", label: "Media & Press" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="Contact PlantRx - Support & Customer Service"
        description="Get in touch with PlantRx support team for help with natural remedies, expert consultations, billing questions, or technical issues. We're here to help you on your natural health journey."
        keywords="PlantRx contact, customer support, natural health help, remedy questions, technical support, billing help, expert consultation"
        canonical="https://plantrxapp.com/contact"
      />
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            We're Here to Help
          </div>
          <h1 className="luxury-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">How Can We Help You?</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the fastest way to get support for your natural health journey.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email Support Card */}
          <Card className="luxury-glass hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Send us a detailed message
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                Response within 24 hours
              </div>
            </CardContent>
          </Card>

          {/* Live Chat Card - Primary (Center) */}
          <Card className="luxury-glass border-2 border-green-500 dark:border-green-400 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                    (window as any).Tawk_API.maximize();
                  }
                }}
                data-testid="live-chat-card">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
              Fastest
            </div>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat with Remy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Get instant support via live chat
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Available Now
              </div>
            </CardContent>
          </Card>

          {/* Ask Remy AI Card */}
          <Card className="luxury-glass hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = '/symptom-finder'}
                data-testid="ask-remy-card">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ask Remy AI</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Get health advice from our AI expert
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                24/7 AI Assistant
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Email Addresses */}
            <Card className="luxury-glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  Email Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">General Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">support@plantrxapp.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Privacy & GDPR</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">legal@plantrxapp.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Billing & Refunds</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">billing@plantrxapp.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="luxury-glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Live Chat</span>
                  <span className="text-sm font-semibold text-green-600">Instant</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email Support</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">24 hours</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Urgent Issues</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2-6 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="luxury-glass">
              <CardHeader>
                <CardTitle className="text-xl">Send us a Message</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fill out the form below and our team will get back to you promptly.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                        data-testid="input-name"
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                        data-testid="input-email"
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Category *</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger data-testid="select-category" className="bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Subject *</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description"
                        required
                        data-testid="input-subject"
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please describe your inquiry in detail..."
                      rows={5}
                      required
                      data-testid="textarea-message"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={formData.urgent}
                      onChange={(e) => setFormData({...formData, urgent: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      data-testid="checkbox-urgent"
                    />
                    <label htmlFor="urgent" className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Mark as urgent (requires immediate attention)
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Your information is protected by our privacy policy and GDPR compliant.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">Medical Emergency?</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Don't use this form for emergencies. Call your local emergency services immediately: 
                    <span className="font-semibold"> 911 (US) • 999 (UK) • 112 (EU)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Quick answers to common questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I get instant support?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click the chat bubble in the bottom-right corner of any page to start a live chat with Remy. 
                  It's the fastest way to get help with any questions or issues.
                </p>
              </CardContent>
            </Card>

            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How quickly will I receive an email response?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We typically respond to emails within 24 hours on business days. Urgent matters 
                  are prioritized and addressed within 2-6 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I request a refund?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Yes! Contact billing@plantrxapp.com for refund requests. We offer a satisfaction guarantee 
                  and process refunds within 5-7 business days.
                </p>
              </CardContent>
            </Card>

            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I delete my data?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  For GDPR data deletion requests, select "Privacy & Data Deletion" in the form above 
                  or email legal@plantrxapp.com. We process requests within 30 days.
                </p>
              </CardContent>
            </Card>

            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I suggest a new remedy?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Absolutely! We love community suggestions. Use the contact form with "General Inquiry" 
                  to share remedy ideas or feature requests.
                </p>
              </CardContent>
            </Card>

            <Card className="luxury-glass hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How can I speak with a health expert?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use our "Ask Remy" AI feature for 24/7 health guidance, or select "Expert Application" 
                  in the form to inquire about premium expert consultations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full cursor-pointer hover:shadow-lg transition-all"
               onClick={() => {
                 if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                   (window as any).Tawk_API.maximize();
                 }
               }}
               data-testid="bottom-chat-cta">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Still have questions? Chat with us now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
