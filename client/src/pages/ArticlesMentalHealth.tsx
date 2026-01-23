import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Brain } from "lucide-react";

const categoryConfig = {
  id: "mental-health",
  name: "Mental Health",
  description: "Natural approaches to stress, anxiety, focus, and emotional wellness",
  longDescription: "Explore natural approaches to mental wellness including stress management, anxiety relief, cognitive enhancement, and emotional balance through plant-based solutions.",
  icon: Brain,
  color: "from-purple-500 via-violet-500 to-indigo-600",
  lightBg: "bg-purple-50",
  darkBg: "dark:bg-purple-900/20",
  accentColor: "text-purple-600 dark:text-purple-400",
  metaTitle: "Mental Health Articles - Natural Stress & Anxiety Relief | PlantRx",
  metaDescription: "Expert guides on natural mental health support including stress relief, anxiety management, focus enhancement, and emotional wellness techniques.",
  keywords: "mental health, stress relief, anxiety, focus, emotional wellness, natural remedies, PlantRx"
};

const relatedCategories = [
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" },
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  { name: "Fitness & Body", href: "/articles/fitness", color: "border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20" }
];

export default function ArticlesMentalHealth() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
