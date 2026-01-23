import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions", className = "" }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  if (!items?.length) return null;

  return (
    <Card className={`w-full ${className}`} data-testid="faq-section">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          {items.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                data-testid={`faq-question-${index}`}
              >
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white pr-3 sm:pr-4">
                  {item.question}
                </h3>
                {openItems.has(index) ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openItems.has(index) && (
                <div 
                  className="px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                  data-testid={`faq-answer-${index}`}
                >
                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}