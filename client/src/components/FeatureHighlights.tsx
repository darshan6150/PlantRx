import { CheckCircle, Zap, Shield, Users, Brain, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/TranslationContext";

export function FeatureHighlights() {
  const { t } = useTranslation();
  const features = [
    {
      icon: Brain,
      title: t('features.ai.title', 'AI Health Analysis'),
      description: t('features.ai.description', 'Advanced symptom analysis with personalized remedy recommendations'),
      benefits: [t('features.ai.instant', 'Instant diagnosis'), t('features.ai.accuracy', '95% accuracy'), t('features.ai.personalized', 'Personalized results')],
      badge: t('features.ai.badge', 'Most Popular')
    },
    {
      icon: Leaf,
      title: t('features.remedies.title', 'Expert-Verified Remedies'),
      description: t('features.remedies.description', '166+ natural remedies curated by health professionals'),
      benefits: [t('features.remedies.scientifically', 'Science-backed'), t('features.remedies.traditional', 'Safety tested'), t('features.remedies.quality', 'Traditional knowledge')],
      badge: t('features.remedies.badge', 'Verified')
    },
    {
      icon: Users,
      title: t('features.expert.title', 'Expert Community'),
      description: t('features.expert.description', 'Connect with certified natural health practitioners'),
      benefits: [t('features.expert.support', '24/7 support'), t('features.expert.guidance', 'Professional guidance'), t('features.expert.wisdom', 'Community wisdom')],
      badge: t('features.expert.badge', 'Premium')
    },
    {
      icon: Shield,
      title: t('features.safe.title', 'Safe & Natural'),
      description: t('features.safe.description', 'No side effects, no synthetic chemicals, just pure plant power'),
      benefits: [t('features.safe.nontoxic', 'Non-toxic'), t('features.safe.gentle', 'Gentle healing'), t('features.safe.longterm', 'Long-term wellness')],
      badge: t('features.safe.badge', 'Guaranteed')
    },
    {
      icon: Zap,
      title: t('features.instant.title', 'Instant Results'),
      description: t('features.instant.description', 'Get remedy recommendations in seconds, not hours'),
      benefits: [t('features.instant.realtime', 'Real-time analysis'), t('features.instant.quick', 'Quick relief'), t('features.instant.emergency', 'Emergency guidance')],
      badge: t('features.instant.badge', 'Fast')
    },
    {
      icon: CheckCircle,
      title: t('features.proven.title', 'Proven Success'),
      description: t('features.proven.description', 'Join 50,000+ users who transformed their health naturally'),
      benefits: [t('features.proven.testimonials', 'Real testimonials'), t('features.proven.measurable', 'Measurable results'), t('features.proven.lifechanging', 'Life-changing')],
      badge: t('features.proven.badge', 'Trusted')
    }
  ];

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            {t('features.title', 'Why PlantRx is Different')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle', 'Experience the most advanced natural health platform combining smart technology, expert knowledge, and proven remedies')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="relative hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-lg group">
                <CardHeader className="pb-2 sm:pb-4 p-3 sm:p-6">
                  <div className="flex items-start justify-between mb-2 sm:mb-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}