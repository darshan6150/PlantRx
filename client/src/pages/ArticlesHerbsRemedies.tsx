import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Leaf } from "lucide-react";

const categoryConfig = {
  id: "herbs-remedies",
  name: "Herbs & Remedies",
  description: "Traditional herbal medicine meets modern clinical research",
  longDescription: "Explore the healing power of nature through our comprehensive guides on medicinal herbs, traditional remedies, and plant-based therapies backed by modern science.",
  icon: Leaf,
  color: "from-emerald-500 via-teal-500 to-green-600",
  lightBg: "bg-emerald-50",
  darkBg: "dark:bg-emerald-900/20",
  accentColor: "text-emerald-600 dark:text-emerald-400",
  metaTitle: "Herbs & Remedies Articles - Natural Healing Guides | PlantRx",
  metaDescription: "Expert guides on medicinal herbs, traditional remedies, and plant-based healing. Discover evidence-based natural treatments and herbal medicine protocols.",
  keywords: "herbal remedies, medicinal herbs, plant medicine, natural healing, herbal medicine, PlantRx"
};

const relatedCategories = [
  { name: "Nutrition", href: "/articles/nutrition", color: "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" },
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" },
  { name: "Mental Health", href: "/articles/mental-health", color: "border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20" }
];

export default function ArticlesHerbsRemedies() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
