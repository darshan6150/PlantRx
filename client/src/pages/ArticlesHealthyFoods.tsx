import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Apple } from "lucide-react";

const categoryConfig = {
  id: "healthy-foods",
  name: "Healthy Foods",
  description: "Superfoods, meal planning, and nutritional powerhouses for vitality",
  longDescription: "Discover the world's most nutrient-dense foods and learn how to incorporate healing superfoods into your daily diet for optimal health and vitality.",
  icon: Apple,
  color: "from-lime-500 via-green-500 to-emerald-600",
  lightBg: "bg-lime-50",
  darkBg: "dark:bg-lime-900/20",
  accentColor: "text-lime-600 dark:text-lime-400",
  metaTitle: "Healthy Foods Articles - Superfoods & Nutrition Guides | PlantRx",
  metaDescription: "Expert guides on superfoods, healthy eating, meal planning, and nutrient-dense foods. Learn which foods boost health and how to incorporate them.",
  keywords: "healthy foods, superfoods, nutrition, meal planning, nutrient-dense, PlantRx"
};

const relatedCategories = [
  { name: "Nutrition", href: "/articles/nutrition", color: "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" },
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" }
];

export default function ArticlesHealthyFoods() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
