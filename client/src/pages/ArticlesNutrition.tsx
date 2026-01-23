import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Apple } from "lucide-react";

const categoryConfig = {
  id: "nutrition",
  name: "Nutrition",
  description: "Science-backed dietary guidance for optimal health and disease prevention",
  longDescription: "Explore evidence-based nutrition strategies, understand macronutrients, and discover how proper diet can prevent disease and optimize your health naturally.",
  icon: Apple,
  color: "from-green-500 via-emerald-500 to-teal-600",
  lightBg: "bg-green-50",
  darkBg: "dark:bg-green-900/20",
  accentColor: "text-green-600 dark:text-green-400",
  metaTitle: "Nutrition Articles - Plant-Based Diet & Natural Foods | PlantRx",
  metaDescription: "Expert articles on plant-based nutrition, superfoods, and natural dietary approaches for optimal health and disease prevention.",
  keywords: "nutrition, plant-based diet, superfoods, natural foods, healthy eating, PlantRx"
};

const relatedCategories = [
  { name: "Healthy Foods", href: "/articles/healthy-foods", color: "border-lime-500 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20" },
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" }
];

export default function ArticlesNutrition() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
