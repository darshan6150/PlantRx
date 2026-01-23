import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Instagram, ChevronDown, ChevronUp, Mail, Send } from "lucide-react";
import { SiTiktok, SiFacebook, SiX, SiLinkedin, SiPinterest } from "react-icons/si";
import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FeedbackModal } from "@/components/FeedbackModal";

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 md:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default touch-manipulation"
      >
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h4>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 md:overflow-visible ${isOpen ? 'max-h-96 pb-4' : 'max-h-0 md:max-h-none'}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (emailData: { email: string; source: string }) => {
      return apiRequest('/api/newsletter/subscribe', 'POST', emailData);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to PlantRx!",
        description: "You've successfully subscribed to our newsletter.",
        duration: 5000,
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleNewsletterSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    subscribeToNewsletter.mutate({ email, source: 'footer' });
  };

  return (
    <>
      <footer className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Newsletter Section - Shown first on mobile */}
          <div className="md:hidden py-8 border-b border-gray-200 dark:border-gray-800">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Join The Herb Club</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get 10% off your first purchase + exclusive wellness tips
              </p>
            </div>
            <form onSubmit={handleNewsletterSubscription} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                data-testid="input-newsletter-email-mobile"
              />
              <Button 
                type="submit" 
                disabled={subscribeToNewsletter.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium h-12 px-4 touch-manipulation"
                data-testid="button-newsletter-subscribe-mobile"
              >
                {subscribeToNewsletter.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>

          {/* Mobile Social Links - Horizontal row */}
          <div className="md:hidden py-6 border-b border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mb-4">Follow Us</h4>
            <div className="flex items-center justify-center gap-4">
              <a href="https://www.instagram.com/plantrxapp/" onClick={(e) => { e.preventDefault(); window.open('https://www.instagram.com/plantrxapp/', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578851222577" onClick={(e) => { e.preventDefault(); window.open('https://www.facebook.com/profile.php?id=61578851222577', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="Facebook">
                <SiFacebook className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a href="https://uk.pinterest.com/PlantRxApp/" onClick={(e) => { e.preventDefault(); window.open('https://uk.pinterest.com/PlantRxApp/', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="Pinterest">
                <SiPinterest className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a href="https://www.tiktok.com/@plantrx" onClick={(e) => { e.preventDefault(); window.open('https://www.tiktok.com/@plantrx', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="TikTok">
                <SiTiktok className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a href="https://x.com/PlantRxApp" onClick={(e) => { e.preventDefault(); window.open('https://x.com/PlantRxApp', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="X (Twitter)">
                <SiX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a href="https://www.linkedin.com/in/zayan-beg-91002a378/" onClick={(e) => { e.preventDefault(); window.open('https://www.linkedin.com/in/zayan-beg-91002a378/', '_blank', 'noopener,noreferrer'); }} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer" aria-label="LinkedIn">
                <SiLinkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>

          {/* Mobile Collapsible Links */}
          <div className="md:hidden">
            <CollapsibleSection title="Explore">
              <ul className="space-y-3 pl-1">
                <li><Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Home</Link></li>
                <li><Link href="/remedies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Remedies</Link></li>
                <li><Link href="/articles" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Articles</Link></li>
                <li><Link href="/store" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Store</Link></li>
                <li><Link href="/smart-tools" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Tools</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Pricing</Link></li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Company">
              <ul className="space-y-3 pl-1">
                <li><Link href="/about/plantrx" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">About PlantRx</Link></li>
                <li><Link href="/experts" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Expert Network</Link></li>
                <li><a href="https://af.uppromote.com/0yx2kn-wu/register" onClick={(e) => { e.preventDefault(); window.open('https://af.uppromote.com/0yx2kn-wu/register', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1 cursor-pointer">Affiliate Program</a></li>
                <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Contact Us</Link></li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Legal">
              <ul className="space-y-3 pl-1">
                <li><Link href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Terms of Service</Link></li>
                <li><Link href="/refunds" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Refund Policy</Link></li>
                <li><Link href="/disclaimer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Medical Disclaimer</Link></li>
                <li><Link href="/cookie-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Cookie Policy</Link></li>
                <li><Link href="/dmca-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">DMCA Policy</Link></li>
                <li><Link href="/liability" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1">Liability Waiver</Link></li>
              </ul>
            </CollapsibleSection>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:block py-12">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">PlantRx</span>
            </div>

            {/* Main Grid: 5 columns */}
            <div className="grid grid-cols-5 gap-8 mb-10">
              {/* Column 1: PLATFORM */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Platform</h4>
                <ul className="space-y-3">
                  <li><Link href="/about/plantrx" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">About PlantRx</Link></li>
                  <li><Link href="/remedies" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Our Remedies</Link></li>
                  <li><Link href="/experts" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Expert Network</Link></li>
                  <li><a href="https://af.uppromote.com/0yx2kn-wu/register" onClick={(e) => { e.preventDefault(); window.open('https://af.uppromote.com/0yx2kn-wu/register', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">Affiliate Program</a></li>
                  <li><Link href="/privacy-policy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Column 2: SUPPORT */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><Link href="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Contact Us</Link></li>
                  <li><Link href="/refunds" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Refund Policy</Link></li>
                  <li><Link href="/disclaimer" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Medical Disclaimer</Link></li>
                  <li><Link href="/liability" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Liability Waiver</Link></li>
                  <li><Link href="/cookie-policy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
                  <li><Link href="/dmca-policy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">DMCA Policy</Link></li>
                </ul>
              </div>

              {/* Column 3: EXPLORE */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Explore</h4>
                <ul className="space-y-3">
                  <li><Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link></li>
                  <li><Link href="/remedies" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Remedies</Link></li>
                  <li><Link href="/articles" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Articles</Link></li>
                  <li><Link href="/store" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Store</Link></li>
                  <li><Link href="/smart-tools" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Tools</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing</Link></li>
                </ul>
              </div>

              {/* Column 4: CONNECT */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Connect</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="https://www.instagram.com/plantrxapp/" onClick={(e) => { e.preventDefault(); window.open('https://www.instagram.com/plantrxapp/', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/profile.php?id=61578851222577" onClick={(e) => { e.preventDefault(); window.open('https://www.facebook.com/profile.php?id=61578851222577', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <SiFacebook className="w-4 h-4" /> Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://uk.pinterest.com/PlantRxApp/" onClick={(e) => { e.preventDefault(); window.open('https://uk.pinterest.com/PlantRxApp/', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <SiPinterest className="w-4 h-4" /> Pinterest
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/@plantrx" onClick={(e) => { e.preventDefault(); window.open('https://www.tiktok.com/@plantrx', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <SiTiktok className="w-4 h-4" /> TikTok
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/PlantRxApp" onClick={(e) => { e.preventDefault(); window.open('https://x.com/PlantRxApp', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <SiX className="w-4 h-4" /> X (Twitter)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/zayan-beg-91002a378/" onClick={(e) => { e.preventDefault(); window.open('https://www.linkedin.com/in/zayan-beg-91002a378/', '_blank', 'noopener,noreferrer'); }} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer">
                      <SiLinkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 5: FEEDBACK */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">We Value Your Opinion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Help us grow by sharing your thoughts. Your feedback shapes the future of PlantRx.
                </p>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-4">
                  Get 15% off any purchase as a thank you!
                </p>
                <a 
                  href="https://tally.so/r/xXjYaG"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.preventDefault(); window.open('https://tally.so/r/xXjYaG', '_blank', 'noopener,noreferrer'); }}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors cursor-pointer"
                  data-testid="button-feedback"
                >
                  Share Feedback
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Logo + Copyright */}
          <div className="md:hidden py-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">PlantRx</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 px-4">
              *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; 2025 PlantRx Ltd. All rights reserved.
            </p>
          </div>

          {/* Desktop Bottom Section */}
          <div className="hidden md:block py-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-xs text-gray-500 dark:text-gray-500 mb-4">
              *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; 2025, PlantRx Ltd. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
      
      <FeedbackModal 
        isOpen={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
      />
    </>
  );
}
