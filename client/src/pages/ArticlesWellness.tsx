import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Heart } from "lucide-react";

const categoryConfig = {
  id: "wellness",
  name: "Wellness",
  description: "Holistic approaches to mind-body balance and self-care practices",
  longDescription: "Discover holistic wellness strategies for achieving mind-body balance, stress management, quality sleep, and natural self-care routines that support lasting health.",
  icon: Heart,
  color: "from-rose-500 via-pink-500 to-red-500",
  lightBg: "bg-rose-50",
  darkBg: "dark:bg-rose-900/20",
  accentColor: "text-rose-600 dark:text-rose-400",
  metaTitle: "Wellness Articles - Holistic Health & Self-Care | PlantRx",
  metaDescription: "Expert guides on holistic wellness, stress relief, sleep optimization, and natural self-care practices for complete mind-body health.",
  keywords: "wellness, holistic health, self-care, stress relief, sleep, mindfulness, PlantRx"
};

const relatedCategories = [
  { name: "Mental Health", href: "/articles/mental-health", color: "border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20" },
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  { name: "Skin & Beauty", href: "/articles/skin-beauty", color: "border-pink-500 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20" }
];

export default function ArticlesWellness() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
