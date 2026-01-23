import { ArticleCategoryPage } from "@/components/ArticleCategoryPage";
import { Microscope } from "lucide-react";

const categoryConfig = {
  id: "science",
  name: "Science & Research",
  description: "Evidence-based insights from clinical studies and phytochemistry research",
  longDescription: "Explore the scientific foundations of natural medicine. Research-backed insights, clinical studies, and evidence-based analysis of herbal remedies and their therapeutic applications.",
  icon: Microscope,
  color: "from-blue-500 via-indigo-500 to-violet-600",
  lightBg: "bg-blue-50",
  darkBg: "dark:bg-blue-900/20",
  accentColor: "text-blue-600 dark:text-blue-400",
  metaTitle: "Science Articles - Research & Clinical Evidence | PlantRx",
  metaDescription: "Evidence-based articles on herbal medicine, phytochemistry, and clinical research supporting natural health solutions.",
  keywords: "herbal medicine research, clinical studies, phytochemistry, natural medicine science, PlantRx"
};

const relatedCategories = [
  { name: "Herbs & Remedies", href: "/articles/herbs-remedies", color: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  { name: "Nutrition", href: "/articles/nutrition", color: "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" },
  { name: "Wellness", href: "/articles/wellness", color: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" }
];

export default function ArticlesScience() {
  return <ArticleCategoryPage category={categoryConfig} relatedCategories={relatedCategories} />;
}
