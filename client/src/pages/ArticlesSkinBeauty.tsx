import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Sparkles } from "lucide-react";

const categoryConfig = {
  id: "skin-beauty",
  name: "Skin & Beauty",
  description: "Natural skincare routines and plant-based beauty solutions",
  longDescription: "Discover the secrets to radiant, healthy skin through natural skincare routines, plant-based beauty treatments, and holistic approaches to lasting beauty.",
  icon: Sparkles,
  color: "from-pink-500 via-rose-500 to-red-500",
  lightBg: "bg-pink-50",
  darkBg: "dark:bg-pink-900/20",
  accentColor: "text-pink-600 dark:text-pink-400",
  metaTitle: "Skin & Beauty Articles - Natural Skincare Guides | PlantRx",
  metaDescription: "Expert guides on natural skincare, plant-based beauty treatments, anti-aging solutions, and holistic beauty routines for radiant, healthy skin.",
  keywords: "natural skincare, beauty, plant-based beauty, anti-aging, skin health, PlantRx"
};

const relatedCategories = [
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" },
  { name: "Healthy Foods", href: "/articles/healthy-foods", color: "border-lime-500 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20" },
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" }
];

export default function ArticlesSkinBeauty() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
