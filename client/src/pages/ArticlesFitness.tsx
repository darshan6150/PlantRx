import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Dumbbell } from "lucide-react";

const categoryConfig = {
  id: "fitness",
  name: "Fitness & Body",
  description: "Natural training methods, recovery techniques, and athletic performance",
  longDescription: "Discover natural approaches to fitness, athletic performance, and physical recovery. Learn how to optimize your training with plant-based nutrition and herbal support.",
  icon: Dumbbell,
  color: "from-orange-500 via-amber-500 to-yellow-600",
  lightBg: "bg-orange-50",
  darkBg: "dark:bg-orange-900/20",
  accentColor: "text-orange-600 dark:text-orange-400",
  metaTitle: "Fitness & Body Articles - Natural Training & Recovery | PlantRx",
  metaDescription: "Expert guides on natural fitness training, recovery techniques, plant-based athletic nutrition, and herbal supplements for peak performance.",
  keywords: "fitness, natural training, athletic performance, recovery, plant-based fitness, PlantRx"
};

const relatedCategories = [
  { name: "Nutrition", href: "/articles/nutrition", color: "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" },
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" },
  { name: "Healthy Foods", href: "/articles/healthy-foods", color: "border-lime-500 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20" }
];

export default function ArticlesFitness() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
