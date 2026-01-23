import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CalendarDays, 
  Clock, 
  ArrowLeft, 
  Share2, 
  BookOpen, 
  User, 
  Microscope, 
  AlertCircle,
  ChevronRight,
  List,
  Heart,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Sparkles,
  Leaf,
  CheckCircle2,
  GraduationCap,
  Shield,
  FileText,
  ExternalLink,
  MessageCircle,
  Award,
  Beaker,
  ClipboardCheck,
  History,
  Quote,
  ThumbsUp,
  Star,
  HelpCircle
} from "lucide-react";
import { BlogSEOTemplate } from "@/components/BlogSEOTemplate";
import { InternalLinkingWidget } from "@/components/InternalLinkingWidget";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";

// Content helper functions for article features - AdSense compliant
// All fabricated content (clinical studies, FAQs, nutrient tables, fake reviewers, testimonials) has been removed
// Keeping only legitimate helper functions for trending topics, related articles, and remedies


const generateTrendingTopics = (category: string) => {
  const allTopics: Record<string, Array<{title: string; href: string; count: string}>> = {
    nutrition: [
      { title: "Superfoods Guide", href: "/blog?tag=superfoods", count: "24 articles" },
      { title: "Plant Proteins", href: "/blog?tag=protein", count: "18 articles" },
      { title: "Vitamin Deficiency", href: "/blog?tag=vitamins", count: "31 articles" },
      { title: "Anti-Inflammatory Diet", href: "/blog?tag=inflammation", count: "27 articles" },
      { title: "Gut Health Foods", href: "/blog?tag=gut-health", count: "22 articles" }
    ],
    wellness: [
      { title: "Holistic Healing", href: "/blog?tag=holistic", count: "35 articles" },
      { title: "Mind-Body Connection", href: "/blog?tag=mind-body", count: "19 articles" },
      { title: "Natural Detox", href: "/blog?tag=detox", count: "16 articles" },
      { title: "Energy Boosters", href: "/blog?tag=energy", count: "28 articles" },
      { title: "Wellness Rituals", href: "/blog?tag=rituals", count: "21 articles" }
    ],
    sleep: [
      { title: "Natural Sleep Aids", href: "/blog?tag=sleep-aids", count: "23 articles" },
      { title: "Circadian Rhythm", href: "/blog?tag=circadian", count: "14 articles" },
      { title: "Herbal Teas for Sleep", href: "/blog?tag=sleep-tea", count: "19 articles" },
      { title: "Sleep Hygiene", href: "/blog?tag=sleep-hygiene", count: "26 articles" },
      { title: "Relaxation Techniques", href: "/blog?tag=relaxation", count: "31 articles" }
    ],
    digestive: [
      { title: "Gut Microbiome", href: "/blog?tag=microbiome", count: "29 articles" },
      { title: "Digestive Enzymes", href: "/blog?tag=enzymes", count: "17 articles" },
      { title: "Fermented Foods", href: "/blog?tag=fermented", count: "24 articles" },
      { title: "Fiber Benefits", href: "/blog?tag=fiber", count: "21 articles" },
      { title: "IBS Natural Relief", href: "/blog?tag=ibs", count: "18 articles" }
    ],
    stress: [
      { title: "Adaptogens Guide", href: "/blog?tag=adaptogens", count: "32 articles" },
      { title: "Anxiety Relief", href: "/blog?tag=anxiety", count: "27 articles" },
      { title: "Cortisol Management", href: "/blog?tag=cortisol", count: "15 articles" },
      { title: "Calming Herbs", href: "/blog?tag=calming", count: "29 articles" },
      { title: "Stress Reduction", href: "/blog?tag=stress-relief", count: "34 articles" }
    ],
    immunity: [
      { title: "Immune Boosters", href: "/blog?tag=immunity", count: "38 articles" },
      { title: "Medicinal Mushrooms", href: "/blog?tag=mushrooms", count: "22 articles" },
      { title: "Antiviral Herbs", href: "/blog?tag=antiviral", count: "19 articles" },
      { title: "Cold & Flu Remedies", href: "/blog?tag=cold-flu", count: "31 articles" },
      { title: "Vitamin C Sources", href: "/blog?tag=vitamin-c", count: "25 articles" }
    ],
    general: [
      { title: "Natural Remedies", href: "/blog?tag=remedies", count: "45 articles" },
      { title: "Herbal Medicine", href: "/blog?tag=herbal", count: "52 articles" },
      { title: "Holistic Health", href: "/blog?tag=holistic", count: "38 articles" },
      { title: "Wellness Tips", href: "/blog?tag=wellness", count: "41 articles" },
      { title: "Plant Medicine", href: "/blog?tag=plants", count: "33 articles" }
    ]
  };
  return allTopics[category] || allTopics.general;
};

const generateRelatedRemedies = (category: string) => {
  const allRemedies: Record<string, Array<{name: string; benefit: string; href: string}>> = {
    nutrition: [
      { name: "Spirulina", benefit: "Complete protein & nutrients", href: "/remedies/spirulina" },
      { name: "Moringa", benefit: "Nutrient-dense superfood", href: "/remedies/moringa" },
      { name: "Chlorella", benefit: "Detox & mineral support", href: "/remedies/chlorella" },
      { name: "Wheatgrass", benefit: "Alkalizing & energizing", href: "/remedies/wheatgrass" }
    ],
    wellness: [
      { name: "Turmeric", benefit: "Anti-inflammatory support", href: "/remedies/turmeric" },
      { name: "Ginger", benefit: "Digestive & immune health", href: "/remedies/ginger" },
      { name: "Holy Basil", benefit: "Stress adaptation", href: "/remedies/holy-basil" },
      { name: "Elderberry", benefit: "Immune enhancement", href: "/remedies/elderberry" }
    ],
    sleep: [
      { name: "Valerian Root", benefit: "Natural sedative", href: "/remedies/valerian" },
      { name: "Chamomile", benefit: "Gentle relaxation", href: "/remedies/chamomile" },
      { name: "Lavender", benefit: "Calming aromatherapy", href: "/remedies/lavender" },
      { name: "Passionflower", benefit: "Anxiety & sleep aid", href: "/remedies/passionflower" }
    ],
    digestive: [
      { name: "Peppermint", benefit: "Digestive comfort", href: "/remedies/peppermint" },
      { name: "Ginger", benefit: "Nausea relief", href: "/remedies/ginger" },
      { name: "Fennel", benefit: "Bloating reduction", href: "/remedies/fennel" },
      { name: "Slippery Elm", benefit: "Gut lining support", href: "/remedies/slippery-elm" }
    ],
    stress: [
      { name: "Ashwagandha", benefit: "Cortisol balance", href: "/remedies/ashwagandha" },
      { name: "Rhodiola", benefit: "Mental clarity", href: "/remedies/rhodiola" },
      { name: "Lemon Balm", benefit: "Mood support", href: "/remedies/lemon-balm" },
      { name: "Kava", benefit: "Anxiety relief", href: "/remedies/kava" }
    ],
    immunity: [
      { name: "Echinacea", benefit: "Immune activation", href: "/remedies/echinacea" },
      { name: "Elderberry", benefit: "Antiviral properties", href: "/remedies/elderberry" },
      { name: "Reishi", benefit: "Immune modulation", href: "/remedies/reishi" },
      { name: "Astragalus", benefit: "Deep immune support", href: "/remedies/astragalus" }
    ],
    general: [
      { name: "Turmeric", benefit: "Inflammation support", href: "/remedies/turmeric" },
      { name: "Ashwagandha", benefit: "Adaptogenic herb", href: "/remedies/ashwagandha" },
      { name: "Ginger", benefit: "Multi-purpose healing", href: "/remedies/ginger" },
      { name: "Chamomile", benefit: "Gentle wellness", href: "/remedies/chamomile" }
    ]
  };
  return allRemedies[category] || allRemedies.general;
};

const generateIngredientSpotlight = (category: string) => {
  const allIngredients: Record<string, Array<{name: string; description: string; benefits: string[]; image: string; origin: string}>> = {
    nutrition: [
      { name: "Spirulina", description: "A blue-green algae packed with protein, vitamins, and antioxidants", benefits: ["60-70% complete protein", "Rich in B vitamins", "Powerful antioxidant"], image: "🌿", origin: "Fresh & saltwater lakes" },
      { name: "Kale", description: "The king of leafy greens with exceptional nutrient density", benefits: ["High in vitamin K", "Cancer-fighting compounds", "Excellent fiber source"], image: "🥬", origin: "Mediterranean region" },
      { name: "Chia Seeds", description: "Ancient superfood with omega-3s and fiber", benefits: ["Highest plant omega-3s", "11g fiber per ounce", "Complete protein source"], image: "🌱", origin: "Central America" },
      { name: "Quinoa", description: "A complete protein grain with all essential amino acids", benefits: ["Complete protein", "Gluten-free", "Rich in minerals"], image: "🌾", origin: "Andean region" }
    ],
    wellness: [
      { name: "Turmeric", description: "Golden spice with powerful anti-inflammatory curcumin", benefits: ["Reduces inflammation", "Brain health support", "Joint comfort"], image: "🧡", origin: "South Asia" },
      { name: "Ginger", description: "Warming root with digestive and immune benefits", benefits: ["Digestive support", "Nausea relief", "Immune boost"], image: "🫚", origin: "Southeast Asia" },
      { name: "Honey", description: "Nature's sweetener with antimicrobial properties", benefits: ["Wound healing", "Cough relief", "Antioxidant rich"], image: "🍯", origin: "Worldwide" },
      { name: "Apple Cider Vinegar", description: "Fermented tonic with digestive benefits", benefits: ["Blood sugar balance", "Digestive enzymes", "Alkalizing effect"], image: "🍎", origin: "Ancient Babylon" }
    ],
    sleep: [
      { name: "Valerian Root", description: "Natural sedative herb used for centuries", benefits: ["Promotes relaxation", "Improves sleep quality", "Reduces anxiety"], image: "🌸", origin: "Europe & Asia" },
      { name: "Chamomile", description: "Gentle flower with calming apigenin compounds", benefits: ["Soothes nerves", "Anti-inflammatory", "Gentle sedative"], image: "🌼", origin: "Western Europe" },
      { name: "Lavender", description: "Aromatic herb for relaxation and sleep", benefits: ["Reduces anxiety", "Improves sleep", "Calming aroma"], image: "💜", origin: "Mediterranean" },
      { name: "Magnesium", description: "Essential mineral for muscle relaxation", benefits: ["Muscle relaxation", "Stress reduction", "Better sleep"], image: "✨", origin: "Natural mineral" }
    ],
    digestive: [
      { name: "Peppermint", description: "Cooling herb that relaxes digestive muscles", benefits: ["Relieves bloating", "IBS symptom relief", "Fresh breath"], image: "🌿", origin: "Europe" },
      { name: "Fennel", description: "Sweet licorice-like seed for digestive comfort", benefits: ["Reduces gas", "Aids digestion", "Anti-spasmodic"], image: "🌱", origin: "Mediterranean" },
      { name: "Ginger", description: "Warming digestive aid and nausea remedy", benefits: ["Nausea relief", "Digestive fire", "Anti-inflammatory"], image: "🫚", origin: "Southeast Asia" },
      { name: "Probiotics", description: "Beneficial bacteria for gut health", benefits: ["Gut balance", "Immune support", "Nutrient absorption"], image: "🦠", origin: "Fermented foods" }
    ],
    stress: [
      { name: "Ashwagandha", description: "Premier adaptogenic root from Ayurveda", benefits: ["Cortisol balance", "Energy support", "Mental clarity"], image: "🌿", origin: "India" },
      { name: "Rhodiola", description: "Arctic root for mental and physical resilience", benefits: ["Stress resistance", "Mental focus", "Fatigue reduction"], image: "🏔️", origin: "Arctic regions" },
      { name: "Holy Basil", description: "Sacred adaptogen for mind-body balance", benefits: ["Stress relief", "Blood sugar balance", "Antioxidant"], image: "🌿", origin: "India" },
      { name: "Lemon Balm", description: "Calming mint-family herb for nervous tension", benefits: ["Anxiety relief", "Mood support", "Better sleep"], image: "🍋", origin: "Mediterranean" }
    ],
    immunity: [
      { name: "Elderberry", description: "Dark berry with potent antiviral compounds", benefits: ["Antiviral action", "Immune boost", "Rich in vitamin C"], image: "🫐", origin: "Europe" },
      { name: "Echinacea", description: "Purple coneflower for immune activation", benefits: ["Immune stimulant", "Cold prevention", "Wound healing"], image: "🌸", origin: "North America" },
      { name: "Reishi", description: "Medicinal mushroom for deep immune support", benefits: ["Immune modulation", "Stress relief", "Longevity support"], image: "🍄", origin: "East Asia" },
      { name: "Vitamin C", description: "Essential antioxidant vitamin for immunity", benefits: ["Immune function", "Collagen synthesis", "Antioxidant"], image: "🍊", origin: "Citrus fruits" }
    ],
    general: [
      { name: "Turmeric", description: "Golden anti-inflammatory spice", benefits: ["Reduces inflammation", "Antioxidant power", "Brain support"], image: "🧡", origin: "South Asia" },
      { name: "Green Tea", description: "Antioxidant-rich beverage with L-theanine", benefits: ["Mental clarity", "Antioxidants", "Metabolism boost"], image: "🍵", origin: "China" },
      { name: "Garlic", description: "Pungent bulb with immune and heart benefits", benefits: ["Heart health", "Immune support", "Antimicrobial"], image: "🧄", origin: "Central Asia" },
      { name: "Aloe Vera", description: "Succulent plant for skin and digestive health", benefits: ["Skin healing", "Digestive soothe", "Hydration"], image: "🌵", origin: "Arabian Peninsula" }
    ]
  };
  return allIngredients[category] || allIngredients.general;
};

const generateRelatedArticles = (category: string, currentSlug: string) => {
  const allArticles: Record<string, Array<{title: string; excerpt: string; slug: string; readTime: string; image: string}>> = {
    nutrition: [
      { title: "Top 10 Superfoods You Should Eat Daily", excerpt: "Discover the most nutrient-dense foods to transform your health", slug: "top-10-superfoods", readTime: "8 min", image: "🥗" },
      { title: "The Complete Guide to Plant-Based Protein", excerpt: "Everything you need to know about getting enough protein from plants", slug: "plant-based-protein-guide", readTime: "12 min", image: "🌱" },
      { title: "Anti-Inflammatory Foods That Heal", excerpt: "Reduce chronic inflammation naturally with these powerful foods", slug: "anti-inflammatory-foods", readTime: "7 min", image: "🍊" },
      { title: "Vitamin Deficiency Signs to Watch For", excerpt: "How to recognize when your body needs more nutrients", slug: "vitamin-deficiency-signs", readTime: "9 min", image: "💊" }
    ],
    wellness: [
      { title: "Morning Routines of the Healthiest People", excerpt: "Start your day right with these wellness-boosting habits", slug: "healthy-morning-routines", readTime: "10 min", image: "☀️" },
      { title: "Natural Detox Methods That Actually Work", excerpt: "Evidence-based ways to support your body's detoxification", slug: "natural-detox-methods", readTime: "11 min", image: "🌿" },
      { title: "The Mind-Body Connection Explained", excerpt: "How your thoughts affect your physical health", slug: "mind-body-connection", readTime: "8 min", image: "🧠" },
      { title: "Holistic Health Principles for Beginners", excerpt: "A complete introduction to whole-person wellness", slug: "holistic-health-beginners", readTime: "14 min", image: "✨" }
    ],
    sleep: [
      { title: "Natural Sleep Remedies That Work", excerpt: "Herbs and techniques to help you fall asleep naturally", slug: "natural-sleep-remedies", readTime: "9 min", image: "😴" },
      { title: "The Science of Circadian Rhythms", excerpt: "Understanding your body's internal clock for better sleep", slug: "circadian-rhythm-science", readTime: "11 min", image: "🌙" },
      { title: "Creating the Perfect Sleep Environment", excerpt: "Optimize your bedroom for restorative rest", slug: "perfect-sleep-environment", readTime: "7 min", image: "🛏️" },
      { title: "Herbs for Deep, Restful Sleep", excerpt: "The best natural sedatives for quality sleep", slug: "herbs-for-deep-sleep", readTime: "8 min", image: "🌿" }
    ],
    digestive: [
      { title: "Healing Your Gut Naturally", excerpt: "A complete guide to digestive wellness", slug: "healing-gut-naturally", readTime: "13 min", image: "🦠" },
      { title: "The Best Probiotic Foods to Eat", excerpt: "Fermented foods to boost your microbiome", slug: "best-probiotic-foods", readTime: "8 min", image: "🥬" },
      { title: "Natural Remedies for Bloating", excerpt: "Quick relief from digestive discomfort", slug: "natural-bloating-remedies", readTime: "6 min", image: "🌿" },
      { title: "Fiber: The Forgotten Superfood", excerpt: "Why fiber is essential for gut health", slug: "fiber-superfood-guide", readTime: "9 min", image: "🌾" }
    ],
    stress: [
      { title: "Adaptogens: Nature's Stress Fighters", excerpt: "How these herbs help your body adapt to stress", slug: "adaptogens-stress-guide", readTime: "10 min", image: "🌿" },
      { title: "Breathing Techniques for Instant Calm", excerpt: "Simple exercises to reduce anxiety in minutes", slug: "breathing-techniques-calm", readTime: "5 min", image: "🧘" },
      { title: "Natural Anxiety Relief Methods", excerpt: "Evidence-based ways to manage anxiety naturally", slug: "natural-anxiety-relief", readTime: "12 min", image: "💆" },
      { title: "The Cortisol Connection", excerpt: "Understanding how stress hormones affect your health", slug: "cortisol-connection", readTime: "9 min", image: "📊" }
    ],
    immunity: [
      { title: "Building Natural Immunity", excerpt: "Strengthen your immune system with food and lifestyle", slug: "building-natural-immunity", readTime: "11 min", image: "🛡️" },
      { title: "Medicinal Mushrooms for Immune Health", excerpt: "The healing power of reishi, chaga, and more", slug: "medicinal-mushrooms-immunity", readTime: "10 min", image: "🍄" },
      { title: "Natural Cold and Flu Remedies", excerpt: "Feel better faster with these natural treatments", slug: "cold-flu-natural-remedies", readTime: "8 min", image: "🤧" },
      { title: "Elderberry: The Immune Superstar", excerpt: "Everything you need to know about elderberry", slug: "elderberry-immune-guide", readTime: "7 min", image: "🫐" }
    ],
    general: [
      { title: "Getting Started with Natural Health", excerpt: "Your complete guide to natural wellness", slug: "natural-health-guide", readTime: "15 min", image: "🌱" },
      { title: "The Best Herbal Teas for Health", excerpt: "Healing beverages for every ailment", slug: "herbal-teas-health", readTime: "9 min", image: "🍵" },
      { title: "Natural Remedies 101", excerpt: "An introduction to plant-based healing", slug: "natural-remedies-101", readTime: "12 min", image: "🌿" },
      { title: "Creating Your Home Apothecary", excerpt: "Essential herbs to keep on hand", slug: "home-apothecary-guide", readTime: "10 min", image: "🏡" }
    ]
  };
  const articles = allArticles[category] || allArticles.general;
  return articles.filter(a => a.slug !== currentSlug).slice(0, 3);
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  authorName: string;
  publishedAt: string;
  readingTime?: number;
  tags?: string[];
  highlights?: string[];
  scientificEvidence?: string[];
};

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("");

  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/blog/posts/${slug}`],
    enabled: !!slug,
  });

  // Fetch all blog posts for suggested articles
  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  const blogPost = post as BlogPost;

  const tableOfContents = useMemo(() => {
    if (!blogPost?.content) return [];
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;
    while ((match = headingRegex.exec(blogPost.content)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level: parseInt(match[1]), text, id });
    }
    return headings;
  }, [blogPost?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(h => document.getElementById(h.id));
      const scrollPos = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = blogPost?.title || "PlantRx Blog Post";
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The blog post link has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to copy link. Please share manually.",
          variant: "destructive",
        });
      }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Share this article with others." });
    } catch (e) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  // Article metadata for dynamic content
  const articleCategory = (blogPost?.tags?.[0] || 'wellness').toLowerCase();
  
  const trendingTopics = useMemo(() => 
    generateTrendingTopics(articleCategory), 
    [articleCategory]
  );
  
  const relatedRemedies = useMemo(() => 
    generateRelatedRemedies(articleCategory), 
    [articleCategory]
  );
  
  const ingredientSpotlight = useMemo(() => 
    generateIngredientSpotlight(articleCategory), 
    [articleCategory]
  );
  
  const relatedArticles = useMemo(() => 
    generateRelatedArticles(articleCategory, blogPost?.slug || ''), 
    [articleCategory, blogPost?.slug]
  );

  // Get suggested articles from the database (same category, excluding current)
  const suggestedArticles = useMemo(() => {
    if (!allPosts || !blogPost) return [];
    
    // Filter by same category/tag, excluding current article
    const currentTags = blogPost.tags || [];
    const sameCategoryPosts = allPosts.filter(p => 
      p.slug !== blogPost.slug && 
      p.tags?.some(tag => currentTags.includes(tag))
    );
    
    // If not enough same-category articles, add random ones
    let suggestions = sameCategoryPosts.slice(0, 6);
    if (suggestions.length < 6) {
      const otherPosts = allPosts.filter(p => 
        p.slug !== blogPost.slug && 
        !suggestions.some(s => s.slug === p.slug)
      );
      // Shuffle and take remaining
      const shuffled = otherPosts.sort(() => 0.5 - Math.random());
      suggestions = [...suggestions, ...shuffled.slice(0, 6 - suggestions.length)];
    }
    
    return suggestions;
  }, [allPosts, blogPost]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 sm:px-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-stone-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-stone-400 dark:text-gray-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Article Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <Link href="/blog">
            <Button className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="animate-pulse space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="h-4 bg-stone-200 dark:bg-gray-800 rounded w-32 sm:w-48"></div>
            <div className="h-8 sm:h-10 lg:h-12 bg-stone-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-5 sm:h-6 bg-stone-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="h-px bg-stone-200 dark:bg-gray-800"></div>
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-3 sm:h-4 bg-stone-200 dark:bg-gray-800 rounded" style={{ width: `${85 + Math.random() * 15}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contentWithIds = blogPost.content.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (match, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950">
      <BlogSEOTemplate
        title={blogPost.metaTitle || blogPost.title}
        description={blogPost.metaDescription || blogPost.excerpt}
        content={blogPost.content}
        author={blogPost.authorName}
        publishDate={blogPost.publishedAt}
        category="Health & Wellness"
        tags={blogPost.tags || ['natural health', 'herbal remedies']}
        slug={blogPost.slug}
        image={blogPost.featuredImage}
        readingTime={blogPost.readingTime ? `${blogPost.readingTime} min read` : undefined}
      />

      {/* Premium Header Section */}
      <header className="bg-white dark:bg-gray-900 border-b border-stone-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-5 lg:mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <Link href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Articles
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">
              {blogPost.title}
            </span>
          </nav>

          {/* Article Meta Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
            {blogPost.tags && blogPost.tags[0] && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 font-medium px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {blogPost.tags[0]}
              </Badge>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {format(new Date(blogPost.publishedAt), 'MMM dd, yyyy')}
            </div>
            {blogPost.readingTime && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {blogPost.readingTime} min read
              </div>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-3 sm:mb-4 lg:mb-6">
            {blogPost.title}
          </h1>

          {/* Article Excerpt */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
            {blogPost.excerpt}
          </p>

          {/* Author Info - Enhanced for E-E-A-T */}
          <div className="flex items-start gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-stone-100 dark:border-gray-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <User className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{blogPost.authorName}</p>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] sm:text-xs px-1.5 py-0.5">
                  Editorial Team
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Wellness content curated from traditional herbal knowledge and general health resources. Not medical advice.
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Published: {format(new Date(blogPost.publishedAt), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last reviewed: {format(new Date(blogPost.publishedAt), 'MMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Width */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        
          {/* Main Article Content - Full Width */}
          <article className="w-full">
            
            {/* Inline Table of Contents & Share - Full Width Bar */}
            <div className="mb-6 sm:mb-8 lg:mb-10 grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Table of Contents - Horizontal */}
              {tableOfContents.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                    <List className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    In This Article
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((heading, idx) => (
                      <a
                        key={idx}
                        href={`#${heading.id}`}
                        className={`block text-xs sm:text-sm py-1 transition-colors ${
                          activeSection === heading.id
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share & Quick Tip Combined */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Quick Tip
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Save this article to your bookmarks and revisit when needed.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-gray-600 dark:text-gray-400 border-stone-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 h-9 w-9 p-0"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      data-testid="button-share-twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-gray-600 dark:text-gray-400 border-stone-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 h-9 w-9 p-0"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      data-testid="button-share-facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-gray-600 dark:text-gray-400 border-stone-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 h-9 w-9 p-0"
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blogPost.title)}`, '_blank')}
                      data-testid="button-share-linkedin"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-gray-600 dark:text-gray-400 border-stone-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 h-9 w-9 p-0"
                      onClick={copyLink}
                      data-testid="button-copy-link"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Key Highlights Box */}
            {blogPost.highlights && blogPost.highlights.length > 0 && (
              <div className="mb-6 sm:mb-8 lg:mb-10 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-5 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-md sm:rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Key Takeaways
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {blogPost.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      <span className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Body - Premium Typography */}
            <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-6 lg:p-10">
              <div 
                className="
                  prose prose-lg max-w-none
                  prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-stone-100 dark:prose-h2:border-gray-800
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-[17px] prose-p:leading-[1.8] prose-p:mb-6
                  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-[17px] prose-li:leading-[1.8] prose-li:mb-2
                  prose-ul:my-6 prose-ol:my-6
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-hr:border-stone-200 dark:prose-hr:border-gray-800 prose-hr:my-10
                "
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </div>

            {/* Research Context - Transparent Editorial Section */}
            <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8" data-testid="research-context-section">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Research Context
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                General scientific background on topics discussed in this article.
              </p>
              <div className="bg-stone-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-5 border border-stone-100 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The information in this article draws on established research in natural health and wellness. While we strive for accuracy, this content is for educational purposes and reflects general scientific understanding rather than specific clinical recommendations.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a 
                    href="https://pubmed.ncbi.nlm.nih.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">PubMed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Search medical research</p>
                    </div>
                  </a>
                  <a 
                    href="https://www.nccih.nih.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">NCCIH (NIH)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Complementary health info</p>
                    </div>
                  </a>
                  <a 
                    href="https://www.mayoclinic.org/drugs-supplements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Mayo Clinic</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Supplements & herbs</p>
                    </div>
                  </a>
                  <a 
                    href="https://ods.od.nih.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">NIH Office of Dietary Supplements</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Supplement fact sheets</p>
                    </div>
                  </a>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 italic">
                  We encourage readers to explore these authoritative sources for the latest peer-reviewed research on natural health topics.
                </p>
              </div>
            </div>

            {/* Editorial Review - Transparent Team Attribution */}
            <div className="mt-6 sm:mt-8 lg:mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-800/30 p-4 sm:p-6 lg:p-8" data-testid="editorial-review-section">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Editorial Standards
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Our commitment to quality content and responsible health information.
              </p>
              
              {/* Transparent Editorial Process */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-5 border border-stone-200 dark:border-gray-700 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Our Editorial Process
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-gray-900 dark:text-white">Research-Based Content:</strong> Our articles draw on peer-reviewed studies and established health literature.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-gray-900 dark:text-white">Internal Review:</strong> All content is reviewed by our editorial team for accuracy and clarity.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-gray-900 dark:text-white">Regular Updates:</strong> We periodically update articles to reflect current scientific understanding.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-gray-900 dark:text-white">Educational Focus:</strong> Content is for informational purposes and not a substitute for professional medical advice.</span>
                  </div>
                </div>
              </div>

              {/* Publication Info */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-stone-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Article Information
                </h3>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CalendarDays className="w-3 h-3" />
                    <span>Published: {format(new Date(blogPost.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    <User className="w-3 h-3" />
                    <span>By: PlantRx Editorial Team</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{blogPost.readingTime || 5} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Further Reading Section - Legitimate External Resources */}
            <div className="mt-6 sm:mt-8 lg:mt-10 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8" data-testid="further-reading-section">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </div>
                Further Reading
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Explore these trusted resources to learn more about natural health topics.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <a 
                  href="https://www.ncbi.nlm.nih.gov/pmc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-gray-800/50 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  data-testid="further-reading-pmc"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">PubMed Central</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Free full-text research articles</p>
                  </div>
                </a>
                <a 
                  href="https://www.webmd.com/vitamins/ai/ingredientmono-702/aloe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-gray-800/50 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  data-testid="further-reading-webmd"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">WebMD Vitamins & Supplements</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Detailed supplement information</p>
                  </div>
                </a>
                <a 
                  href="https://www.healthline.com/nutrition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-gray-800/50 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  data-testid="further-reading-healthline"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Healthline Nutrition</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Evidence-based nutrition articles</p>
                  </div>
                </a>
                <a 
                  href="https://examine.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-gray-800/50 rounded-lg border border-stone-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  data-testid="further-reading-examine"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Microscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Examine.com</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Independent supplement research</p>
                  </div>
                </a>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 italic">
                These external resources provide additional information on topics discussed in this article. PlantRx is not affiliated with these websites.
              </p>
            </div>

            {/* Soft Divider */}
            <div className="my-6 sm:my-8 lg:my-10 flex items-center gap-3 sm:gap-4">
              <Separator className="flex-1 bg-stone-200 dark:bg-gray-800" />
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400" />
              <Separator className="flex-1 bg-stone-200 dark:bg-gray-800" />
            </div>

            {/* Medical Disclaimer - AdSense Compliant */}
            <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg sm:rounded-xl border border-amber-200/50 dark:border-amber-800/30 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-amber-100 dark:bg-amber-900/30 rounded-md sm:rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                </div>
                Medical Disclaimer
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">This content is for educational purposes only</strong> and is not intended as a substitute for professional medical advice, diagnosis, or treatment. The information provided may help support general wellness but does not claim to cure, treat, or prevent any disease.
                </p>
                <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Always consult a qualified healthcare professional before starting any new supplement or remedy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Natural remedies may interact with medications — discuss with your doctor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Individual results may vary; what works for one person may not work for another</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>If you experience adverse effects, discontinue use and seek medical attention</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-amber-200/30 dark:border-amber-800/20">
                  PlantRx provides traditionally used and research-supported information. We do not make any guarantees about health outcomes. For serious health concerns, please contact a licensed healthcare provider.
                </p>
              </div>
            </div>

            {/* About the Author - Extended Bio */}
            <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-md sm:rounded-lg flex items-center justify-center">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                About the Author
              </h2>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{blogPost.authorName}</h3>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 text-[10px] px-1.5 py-0.5">
                      PlantRx Editorial Team
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    Our editorial team compiles information from traditional herbal knowledge and publicly available health resources. This content is for educational purposes only and should not replace professional medical advice.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">Educational Content</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">Traditional Knowledge</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">General Wellness</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals - E-E-A-T Footer */}
            <div className="bg-stone-100/50 dark:bg-gray-800/30 rounded-lg sm:rounded-xl border border-stone-200 dark:border-gray-700 p-4 sm:p-5 lg:p-6 mb-6 sm:mb-8 lg:mb-10">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                Trust & Transparency
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-[10px] sm:text-xs">
                <Link href="/about/plantrx" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  About PlantRx
                </Link>
                <Link href="/contact" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Contact Us
                </Link>
                <Link href="/privacy" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Privacy Policy
                </Link>
                <Link href="/terms" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Terms of Service
                </Link>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-3 pt-3 border-t border-stone-200 dark:border-gray-700">
                PlantRx is committed to providing trustworthy, research-backed health information. We follow strict editorial guidelines and our content is regularly reviewed and updated.
              </p>
            </div>

            {/* Internal Linking Widget */}
            <InternalLinkingWidget 
              title="Continue Your Natural Health Journey"
              links={[
                {
                  title: "Try These Natural Remedies",
                  href: "/remedies?category=wellness",
                  description: "Discover 131+ expert-verified plant-based solutions for your health concerns",
                  category: "Remedies"
                },
                {
                  title: "Shop Recommended Products", 
                  href: "/store",
                  description: "High-quality organic supplements and herbs mentioned in our articles",
                  category: "Store"
                },
                {
                  title: "Book Expert Consultation",
                  href: "/experts",
                  description: "Get personalized advice from our natural health specialists",
                  category: "Experts"
                }
              ]}
            />

          </article>

        {/* Full-Width Premium Sections */}
        <div className="mt-10 sm:mt-12 lg:mt-16 space-y-8 sm:space-y-10 lg:space-y-12">
          
          {/* Ingredient Spotlight - Full Width */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl sm:rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-6 sm:p-8 lg:p-10" data-testid="ingredient-spotlight-section">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Ingredient Spotlight
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Key natural ingredients mentioned in this article with their unique health benefits.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {ingredientSpotlight.map((ingredient, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-stone-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1" data-testid={`ingredient-card-${idx}`}>
                  <div className="text-4xl sm:text-5xl mb-4" data-testid={`ingredient-image-${idx}`}>{ingredient.image}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1" data-testid={`ingredient-name-${idx}`}>{ingredient.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 italic" data-testid={`ingredient-origin-${idx}`}>Origin: {ingredient.origin}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed" data-testid={`ingredient-desc-${idx}`}>{ingredient.description}</p>
                  <ul className="space-y-2">
                    {ingredient.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Articles from Database - Full Width */}
          {suggestedArticles.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-gray-800 p-6 sm:p-8" data-testid="suggested-articles-section">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Suggested For You
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                More expert articles on related health topics you'll love.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {suggestedArticles.map((article, idx) => (
                  <Link 
                    key={article.id} 
                    href={`/blog/${article.slug}`}
                    className="group block rounded-xl border border-stone-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:shadow-lg overflow-hidden bg-stone-50 dark:bg-gray-800/50"
                    data-testid={`suggested-article-${idx}`}
                  >
                    {article.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          data-testid={`suggested-article-image-${idx}`}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {article.tags && article.tags[0] && (
                        <Badge variant="secondary" className="mb-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                          {article.tags[0]}
                        </Badge>
                      )}
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2" data-testid={`suggested-article-title-${idx}`}>
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2" data-testid={`suggested-article-excerpt-${idx}`}>
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span data-testid={`suggested-article-time-${idx}`}>{article.readingTime || 5} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">{article.authorName}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Posts CTA - Clean Design */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-gray-800 p-6 sm:p-8 lg:p-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Explore More Health Insights
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed">
              Discover more expert-backed natural remedies and wellness tips from our curated collection.
            </p>
            <Link href="/blog">
              <Button className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 h-auto text-sm sm:text-base font-medium">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
