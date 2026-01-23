// Image loader for Natural Remedies
// Uses actual remedy photos when available, falls back to generated SVG

interface RemedyImageProps {
  remedy: any;
  className?: string;
}

// Mapping of remedy names to their image files
// All images are stored in attached_assets/remedy images /
const remedyImageMap: { [key: string]: string } = {
  "Acne Fighting Face Mask": "Acne Fighting Face Mask.jpg",
  "Amazon Energy Seeds": "Amazon Energy Seeds.jpg",
  "Ancient Willow Bark": "Ancient Willow Bark.jpg",
  "Ancient Willow Bark Pain Reliever": "Ancient Willow Bark Pain Reliever.jpg",
  "Antibacterial Sage Throat Gargle": "Antibacterial Sage Throat Gargle.jpg",
  "Anti-Inflammatory Ginger Turmeric Tea": "Anti-Inflammatory Ginger Turmeric Tea.jpg",
  "Antioxidant Immune Tea": "Antioxidant Immune Tea.jpg",
  "Apple Cider Vinegar Digestive Aid": "Apple Cider Vinegar Digestive Aid.jpg",
  "Arctic Energy Root": "Arctic Energy Root.jpg",
  "Asian Energy Tonic": "Asian Energy Tonic.jpg",
  "Athletic Performance Boost": "Athletic Performance Boost.jpg",
  "Baking Soda Headache Drink": "Baking Soda Headache Drink.jpg",
  "Banana Potassium Muscle Cramp Reliever": "banana-potassium-muscle-cramp-reliever.jpg",
  "Bedtime Chamomile Honey Sleep Tea": "Bedtime Chamomile Honey Sleep Tea.jpg",
  "Black Maca Vitality": "Black Maca Vitality.jpg",
  "Blood Pressure Tea": "hibiscus-blood-pressure-tea.jpg",
  "Blood Purifier": "Blood Purifier.jpg",
  "Blood Sugar Support": "Blood Sugar Support.jpg",
  "Brain Boosting Herbal Tea": "brain-boosting-herbal-tea.jpg",
  "Brain Circulation Booster": "Brain Circulation Booster.jpg",
  "Brain Power Mushroom": "Brain Power Mushroom.jpg",
  "Breastfeeding Support": "Breastfeeding Support.jpg",
  "California Poppy Sleep Tincture": "California Poppy Sleep Tincture.jpg",
  "Calming Lavender Honey Sleep Aid": "Calming Lavender Honey Sleep Aid.jpg",
  "Calming Lavender Stress Relief Balm": "Calming Lavender Stress Relief Balm.jpg",
  "Calming Passionflower Relief Tincture": "Calming Passionflower Relief Tincture.jpg",
  "Cellular Age Reversal": "Cellular Age Reversal.jpg",
  "Cellular Cleanup Formula": "Cellular Cleanup Formula.jpg",
  "Cellular Energy Boost": "Cellular Energy Boost.jpg",
  "Cholesterol Support": "Cholesterol Support.jpg",
  "Circulation Enhancer": "Circulation Enhancer.jpg",
  "Classic Turmeric Golden Milk Elixir": "Classic Turmeric Golden Milk Elixir.jpg",
  "Cleansing Dandelion Root Liver Detox Tea": "Cleansing Dandelion Root Liver Detox Tea.jpg",
  "Clinical-Grade Calendula Wound Healing Salve": "Clinical-Grade Calendula Wound Healing Salve.jpg",
  "Cold & Flu Fighter": "Cold & Flu Fighter.jpg",
  "Cold & Heat Protocol": "Cold & Heat Protocol.jpg",
  "Cooling Cucumber Eye Compress": "Cooling Cucumber Eye Compress.jpg",
  "Cooling Peppermint Temple Balm": "Cooling Peppermint Temple Balm.jpg",
  "Cool Peppermint Headache Soother": "Cool Peppermint Headache Soother.jpg",
  "Deep Breathing Stress-Release Method": "Deep Breathing Stress-Release Method.jpg",
  "Detoxing Juniper Berry Kidney Tincture": "Detoxing Juniper Berry Kidney Tincture.jpg",
  "Digestive Enzyme": "Digestive Enzyme.jpg",
  "Digestive Harmony Herbal Tea": "Digestive Harmony Herbal Tea.jpg",
  "Digestive Support Formula": "Digestive Support Formula.jpg",
  "Dreamy Chamomile Sleep Elixir": "Dreamy Chamomile Sleep Elixir.jpg",
  "Echinacea": "Echinacea.jpg",
  "Electrolyte-Rich Cramp Prevention Formula": "Electrolyte-Rich Cramp Prevention Formula.jpg",
  "Energizing Green Tea Antioxidant Blend": "Energizing Green Tea Antioxidant Blend.jpg",
  "Energizing Green Tea Morning Boost": "Energizing Green Tea Morning Boost.jpg",
  "Energizing Lemon Water Morning Detox": "Energizing Lemon Water Morning Detox.jpg",
  "Energizing Panax Ginseng Brain Tea": "Energizing Panax Ginseng Brain Tea.jpg",
  "Female Energy Tonic": "Female Energy Tonic.jpg",
  "Five-Flavor Energy Berry": "Five-Flavor Energy Berry.jpg",
  "Fresh Ginger Nausea Tea": "Fresh Ginger Nausea Tea.jpg",
  "Fresh Kitchen Garlic Immune Booster": "fresh-kitchen-garlic-immune-booster.jpg",
  "Fresh Tomato Antioxidant Face Mask": "Fresh Tomato Antioxidant Face Mask.jpg",
  "Garlic Immune Booster": "Garlic Immune Booster.jpg",
  "Gentle Calendula Skin Soother": "Gentle Calendula Skin Soother.jpg",
  "Gentle Cleanse Formula": "Gentle Cleanse Formula.jpg",
  "Gentle Corn Silk Kidney Support Tea": "Gentle Corn Silk Kidney Support Tea.jpg",
  "German Chamomile Peaceful Sleep Tea": "German Chamomile Peaceful Sleep Tea.jpg",
  "Ginger Support Formula": "Ginger Support Formula.jpg",
  "Golden Turmeric Inflammation Fighter": "Golden Turmeric Inflammation Fighter.jpg",
  "Green Superfood Powder": "Green Superfood Powder.jpg",
  "Gut Lining body": "Gut Lining body.jpg",
  "Healing Aloe Burn Recovery Gel": "Healing Aloe Burn Recovery Gel.jpg",
  "Healing Digestive Juice": "Healing Digestive Juice.jpg",
  "Healing Honey Ginger Throat Soother": "Healing Honey Ginger Throat Soother.jpg",
  "Healing Recovery Gel": "Healing Recovery Gel.jpg",
  "Heart Circulation Support": "Heart Circulation Support.jpg",
  "Heart Supporting Herbal Tincture": "Heart Supporting Herbal Tincture.jpg",
  "Homemade Onion Honey Cough Syrup": "Homemade Onion Honey Cough Syrup.jpg",
  "Hormonal Balance Support": "Hormonal Balance Support.jpg",
  "Hormone Balance Support": "Hormone Balance Support.jpg",
  "Household Apple Cider Vinegar Digestive Tonic": "Household Apple Cider Vinegar Digestive Tonic.jpg",
  "Hydration & Electrolyte Rebalance": "Hydration & Electrolyte Rebalance.jpg",
  "Ice Pack & Towel Therapy": "Ice Pack & Towel Therapy.jpg",
  "Immune Defense Formula": "Immune Defense Formula.jpg",
  "Immune-Shield Echinacea Throat Support": "Immune-Shield Echinacea Throat Support.jpg",
  "Immune Strengthening Herbal Tea": "immune-strengthening-herbal-tea.jpg",
  "Inflammation Fighter": "Inflammation Fighter.jpg",
  "Internal Clay Cleanse": "bentonite-clay-internal-cleanse.jpg",
  "Instant Acupressure Headache": "Instant Acupressure Headache.jpg",
  "Jatamansi Calming Sleep Oil": "Jatamansi Calming Sleep Oil.jpg",
  "Joint Support Formula": "Joint Support Formula.jpg",
  "Kanna Stress Relief Tincture": "Kanna Stress Relief Tincture.jpg",
  "Kitchen Ginger Turmeric Anti-Inflammatory Drink": "Kitchen Ginger Turmeric Anti-Inflammatory Drink.jpg",
  "Magnolia Bark Sleep Tea": "Magnolia Bark Sleep Tea.jpg",
  "Male Enhancement Formula": "Male Enhancement Formula.jpg",
  "Male Vitality Support": "Male Vitality Support.jpg",
  "Memory Booster": "Memory Booster.jpg",
  "Mens Vitality Herbal Blend": "Mens Vitality Herbal Blend.jpg",
  "Metabolism Booster": "Metabolism Booster.jpg",
  "Metal Elimination Formula": "Metal Elimination Formula.jpg",
  "Morning Detox Drink": "Morning Detox Drink.jpg",
  "Morning Energy Herbal Blend": "Morning Energy Herbal Blend.jpg",
  "Mucuna Pruriens Mood Support": "Mucuna Pruriens Mood Support.jpg",
  "Natural DHT Support": "Natural DHT Support.jpg",
  "Natural Energy Tea": "Natural Energy Tea.jpg",
  "Natural Garlic Antimicrobial": "Natural Garlic Antimicrobial.jpg",
  "Natural Garlic Antimicrobial Defense": "Natural Garlic Antimicrobial Defense.jpg",
  "Natural Hormone Support": "Natural Hormone Support.jpg",
  "Natural Longevity Complex": "Natural Longevity Complex.jpg",
  "Natural Menopause Support": "Natural Menopause Support.jpg",
  "Natural Oat Bath Skin Soother": "Natural Oat Bath Skin Soother.jpg",
  "Natural Olive Oil Hair Mask": "Natural Olive Oil Hair Mask.jpg",
  "Natural Pain Relief Herbal Oil": "natural-pain-relief-herbal-oil.jpg",
  "Natural Retinol Alternative": "Natural Retinol Alternative.jpg",
  "Natural Salt Water Gargle": "Natural Salt Water Gargle.jpg",
  "Natural White Willow Bark": "Natural White Willow Bark.jpg",
  "Natural Willow Bark Aspirin Alternative": "Natural Willow Bark Aspirin Alternative.jpg",
  "Neck & Shoulder Stretches": "Neck & Shoulder Stretches.jpg",
  "Nourishing Rice Water Hair Treatment": "Nourishing Rice Water Hair Treatment.jpg",
  "Pain Relief Gel": "Pain Relief Gel.jpg",
  "Peaceful Valerian Root Sleep Enhancement Tea": "Peaceful Valerian Root Sleep Enhancement Tea.jpg",
  "Peaceful Valerian Root Sleep Support": "Peaceful Valerian Root Sleep Support.jpg",
  "Peruvian Power Root": "Peruvian Power Root.jpg",
  "Migraine-Prevention Butterbur Extract": "Prevention Butterbur Extract.jpg",
  "Prostate Support Formula": "Prostate Support Formula.jpg",
  "Pure Honey Acne Treatment Mask": "Pure Honey Acne Treatment Mask.jpg",
  "Purifying Dandelion Nettle Kidney Cleanse": "Purifying Dandelion Nettle Kidney Cleanse.jpg",
  "Refreshing Cucumber Eye Compress": "Refreshing Cucumber Eye Compress.jpg",
  "Regenerating Schisandra Berry Liver Tonic": "Regenerating Schisandra Berry Liver Tonic.jpg",
  "Reishi Mushroom Deep Sleep Formula": "Reishi Mushroom Deep Sleep Formula.jpg",
  "Relaxing Epsom Salt Foot Soak": "Relaxing Epsom Salt Foot Soak.jpg",
  "Relaxing Lavender Chamomile Tension Blend": "Relaxing Lavender Chamomile Tension Blend.jpg",
  "Relaxing Warm Milk Honey Sleep Drink": "Relaxing Warm Milk Honey Sleep Drink.jpg",
  "Salt Water Headache Relief": "Salt Water Headache Relief.jpg",
  "Scar Healing Cream": "Scar Healing Cream.jpg",
  "Sharp Mind Ginkgo Memory Enhancer": "Sharp Mind Ginkgo Memory Enhancer.jpg",
  "Shield Feverfew": "Shield Feverfew.jpg",
  "Siberian Strength Boost": "Siberian Strength Boost.jpg",
  "Silky Marshmallow Root Throat Tea": "Silky Marshmallow Root Throat Tea.jpg",
  "Simple Baking Soda Heartburn Relief": "simple-baking-soda-heartburn-relief.jpg",
  "Simple Honey Lemon Sore Throat Soother": "Simple Honey Lemon Sore Throat Soother.jpg",
  "Simple Ice Pack Pain Relief": "Simple Ice Pack Pain Relief.jpg",
  "Simple Peppermint Tea Digestive Aid": "Simple Peppermint Tea Digestive Aid.jpg",
  "Skin Hydration Complex": "Skin Hydration Complex.jpg",
  "Skin Regeneration Oil": "Skin Regeneration Oil.jpg",
  "Sleep Support Herbal Tea": "Sleep Support Herbal Tea.jpg",
  "Sleepy-Time Chamomile Tea Aid": "Sleepy-Time Chamomile Tea Aid.jpg",
  "Smart Lions Mane Mushroom Brain Tonic": "Smart Lions Mane Mushroom Brain Tonic.jpg",
  "Soothing Ginger Nausea Relief Tea": "Soothing Ginger Nausea Relief Tea.jpg",
  "Soothing Oatmeal Skin Mask": "Soothing Oatmeal Skin Mask.jpg",
  "Stress-Relief Deep Breathing Exercise": "Stress-Relief Deep Breathing Exercise.jpg",
  "Stress Relief Herbal Tea": "Stress Relief Herbal Tea.jpg",
  "Stress Shield Complex": "rhodiola-stress-shield-complex.jpg",
  "Sweet Honey & Lemon Cough Syrup": "Sweet Honey & Lemon Cough Syrup.jpg",
  "Throat Defense Spray": "Throat Defense Spray.jpg",
  "Traditional Echinacea Immune Support Tincture": "Traditional Echinacea Immune Support Tincture.jpg",
  "Uterine Tonic Tea": "Uterine Tonic Tea.jpg",
  "Vervain Nervous Exhaustion Formula": "Vervain Nervous Exhaustion Formula.jpg",
  "Warming Cinnamon Honey Circulation Booster": "warming-cinnamon-honey-circulation-booster.jpg",
  "Warming Turmeric Golden Milk": "Warming Turmeric Golden Milk.jpg",
  "Womens Balance Herbal Tea": "Womens Balance Herbal Tea.jpg",
  "Wood Betony Anxiety Relief Tea": "wood-betony-anxiety-relief-tea.jpg",
  "Wood Betony Relief Tea": "Wood Betony Relief Tea.jpg",
  "Youth Activation Formula": "Youth Activation Formula.jpg",
  "Youth Cell Renewal": "Youth Cell Renewal.jpg",
  "Ziziphus Sleep Support Capsules": "Ziziphus Sleep Support Capsules.jpg"
};

// Helper function to get image path for a remedy
const getRemedyImagePath = (remedyName: string): string | null => {
  const imageFilename = remedyImageMap[remedyName];
  if (imageFilename) {
    return `/attached_assets/remedy_images/${imageFilename}`;
  }
  return null;
};

// Fallback SVG generator (same as before, for remedies without photos)
export const generateRemedyImage = (remedy: any): string => {
  const remedyName = remedy.name.toLowerCase();
  const category = remedy.category?.toLowerCase() || 'default';
  const ingredients = (remedy.ingredients as string[])?.map(ing => ing.toLowerCase()) || [];

  // Color schemes based on remedy categories
  const colorSchemes = {
    'skin-care': {
      primary: '#10B981', // emerald
      secondary: '#34D399',
      accent: '#6EE7B7',
      background: '#ECFDF5'
    },
    'digestive': {
      primary: '#F59E0B', // amber
      secondary: '#FBBF24',
      accent: '#FCD34D',
      background: '#FFFBEB'
    },
    'anti-inflammatory': {
      primary: '#EF4444', // red
      secondary: '#F87171',
      accent: '#FCA5A5',
      background: '#FEF2F2'
    },
    'sleep': {
      primary: '#8B5CF6', // violet
      secondary: '#A78BFA',
      accent: '#C4B5FD',
      background: '#F5F3FF'
    },
    'pain-relief': {
      primary: '#059669', // emerald-600
      secondary: '#10B981',
      accent: '#34D399',
      background: '#ECFDF5'
    },
    'immune-support': {
      primary: '#DC2626', // red-600
      secondary: '#EF4444',
      accent: '#F87171',
      background: '#FEF2F2'
    },
    'default': {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#ECFDF5'
    }
  };

  const colors = colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.default;

  // Generate ingredient-specific elements
  const getIngredientElements = () => {
    const elements: string[] = [];

    if (ingredients.some(ing => ing.includes('honey'))) {
      elements.push(`
        <g transform="translate(280, 120)">
          <ellipse cx="0" cy="0" rx="25" ry="15" fill="#FCD34D" opacity="0.8"/>
          <ellipse cx="-8" cy="-5" rx="12" ry="8" fill="#F59E0B" opacity="0.9"/>
          <ellipse cx="8" cy="5" rx="10" ry="6" fill="#FBBF24" opacity="0.7"/>
        </g>
      `);
    }

    if (ingredients.some(ing => ing.includes('ginger'))) {
      elements.push(`
        <g transform="translate(320, 160)">
          <path d="M0,0 Q15,-10 25,0 Q20,15 5,20 Q-5,10 0,0 Z" fill="#F59E0B" opacity="0.8"/>
          <path d="M5,5 Q12,0 18,8 Q15,15 8,12 Q3,8 5,5 Z" fill="#FBBF24" opacity="0.6"/>
        </g>
      `);
    }

    if (ingredients.some(ing => ing.includes('turmeric'))) {
      elements.push(`
        <g transform="translate(100, 180)">
          <circle cx="0" cy="0" r="18" fill="#F59E0B" opacity="0.7"/>
          <circle cx="-5" cy="-3" r="12" fill="#FBBF24" opacity="0.8"/>
          <circle cx="5" cy="5" r="8" fill="#FCD34D" opacity="0.6"/>
        </g>
      `);
    }

    if (ingredients.some(ing => ing.includes('lavender'))) {
      elements.push(`
        <g transform="translate(150, 100)">
          <ellipse cx="0" cy="0" rx="8" ry="20" fill="#8B5CF6" opacity="0.8"/>
          <ellipse cx="-12" cy="0" rx="6" ry="18" fill="#A78BFA" opacity="0.7"/>
          <ellipse cx="12" cy="0" rx="6" ry="18" fill="#A78BFA" opacity="0.7"/>
          <circle cx="0" cy="-15" r="4" fill="#C4B5FD"/>
        </g>
      `);
    }

    if (ingredients.some(ing => ing.includes('aloe'))) {
      elements.push(`
        <g transform="translate(200, 140)">
          <ellipse cx="0" cy="0" rx="12" ry="25" fill="#10B981" opacity="0.8"/>
          <ellipse cx="-8" cy="0" rx="8" ry="20" fill="#34D399" opacity="0.7"/>
          <ellipse cx="8" cy="0" rx="8" ry="20" fill="#34D399" opacity="0.7"/>
        </g>
      `);
    }

    if (ingredients.some(ing => ing.includes('chamomile'))) {
      elements.push(`
        <g transform="translate(250, 100)">
          <circle cx="0" cy="0" r="6" fill="#FCD34D"/>
          <ellipse cx="0" cy="-12" rx="3" ry="8" fill="#FBBF24" opacity="0.8"/>
          <ellipse cx="10" cy="-4" rx="3" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(60)"/>
          <ellipse cx="10" cy="4" rx="3" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(120)"/>
          <ellipse cx="0" cy="12" rx="3" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(180)"/>
          <ellipse cx="-10" cy="4" rx="3" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(240)"/>
          <ellipse cx="-10" cy="-4" rx="3" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(300)"/>
        </g>
      `);
    }

    return elements.join('');
  };

  // Generate category-specific background patterns
  const getBackgroundPattern = () => {
    switch (category) {
      case 'skin-care':
        return `
          <defs>
            <pattern id="skinPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="${colors.accent}" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#skinPattern)"/>
        `;
      
      case 'sleep':
        return `
          <defs>
            <pattern id="sleepPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="3" fill="${colors.accent}" opacity="0.4"/>
              <circle cx="15" cy="15" r="2" fill="${colors.secondary}" opacity="0.3"/>
              <circle cx="45" cy="45" r="1.5" fill="${colors.primary}" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#sleepPattern)"/>
        `;
      
      case 'digestive':
        return `
          <defs>
            <pattern id="digestivePattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25,10 Q35,25 25,40 Q15,25 25,10 Z" fill="${colors.accent}" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#digestivePattern)"/>
        `;
      
      default:
        return `
          <defs>
            <pattern id="defaultPattern" x="0" y="0" width="45" height="45" patternUnits="userSpaceOnUse">
              <circle cx="22.5" cy="22.5" r="2.5" fill="${colors.accent}" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#defaultPattern)"/>
        `;
    }
  };

  // Main plant/herb illustration based on primary ingredient
  const getMainPlantElement = () => {
    if (remedyName.includes('honey')) {
      return `
        <g transform="translate(200, 100)">
          <ellipse cx="0" cy="0" rx="40" ry="25" fill="#FCD34D" opacity="0.9"/>
          <ellipse cx="-15" cy="-8" rx="25" ry="15" fill="#F59E0B" opacity="0.8"/>
          <ellipse cx="15" cy="8" rx="20" ry="12" fill="#FBBF24" opacity="0.7"/>
          <path d="M-20,-5 Q-10,-15 0,-5 Q10,-15 20,-5" stroke="#D97706" stroke-width="2" fill="none"/>
        </g>
      `;
    }

    if (remedyName.includes('ginger')) {
      return `
        <g transform="translate(200, 100)">
          <path d="M0,0 Q30,-20 50,0 Q40,30 10,40 Q-10,20 0,0 Z" fill="#F59E0B" opacity="0.9"/>
          <path d="M10,10 Q25,5 35,15 Q30,25 15,22 Q8,15 10,10 Z" fill="#FBBF24" opacity="0.7"/>
          <path d="M-5,15 Q5,10 15,20 Q10,30 0,25 Q-8,18 -5,15 Z" fill="#FCD34D" opacity="0.6"/>
        </g>
      `;
    }

    if (remedyName.includes('turmeric')) {
      return `
        <g transform="translate(200, 100)">
          <ellipse cx="0" cy="0" rx="35" ry="20" fill="#F59E0B" opacity="0.9"/>
          <ellipse cx="-10" cy="-5" rx="25" ry="15" fill="#FBBF24" opacity="0.8"/>
          <ellipse cx="10" cy="8" rx="20" ry="12" fill="#FCD34D" opacity="0.7"/>
          <circle cx="-15" cy="0" r="8" fill="#D97706" opacity="0.6"/>
          <circle cx="15" cy="-3" r="6" fill="#D97706" opacity="0.5"/>
        </g>
      `;
    }

    if (remedyName.includes('lavender')) {
      return `
        <g transform="translate(200, 100)">
          <ellipse cx="0" cy="0" rx="15" ry="40" fill="#8B5CF6" opacity="0.9"/>
          <ellipse cx="-20" cy="0" rx="12" ry="35" fill="#A78BFA" opacity="0.8"/>
          <ellipse cx="20" cy="0" rx="12" ry="35" fill="#A78BFA" opacity="0.8"/>
          <ellipse cx="-35" cy="5" rx="8" ry="25" fill="#C4B5FD" opacity="0.7"/>
          <ellipse cx="35" cy="5" rx="8" ry="25" fill="#C4B5FD" opacity="0.7"/>
          <circle cx="0" cy="-30" r="8" fill="#DDD6FE"/>
        </g>
      `;
    }

    if (remedyName.includes('aloe')) {
      return `
        <g transform="translate(200, 100)">
          <ellipse cx="0" cy="0" rx="25" ry="50" fill="#10B981" opacity="0.9"/>
          <ellipse cx="-15" cy="0" rx="18" ry="40" fill="#34D399" opacity="0.8"/>
          <ellipse cx="15" cy="0" rx="18" ry="40" fill="#34D399" opacity="0.8"/>
          <ellipse cx="-25" cy="10" rx="12" ry="30" fill="#6EE7B7" opacity="0.7"/>
          <ellipse cx="25" cy="10" rx="12" ry="30" fill="#6EE7B7" opacity="0.7"/>
        </g>
      `;
    }

    // Default plant illustration
    return `
      <g transform="translate(200, 100)">
        <ellipse cx="0" cy="0" rx="30" ry="35" fill="${colors.primary}" opacity="0.9"/>
        <ellipse cx="-12" cy="-5" rx="20" ry="25" fill="${colors.secondary}" opacity="0.8"/>
        <ellipse cx="12" cy="5" rx="18" ry="22" fill="${colors.accent}" opacity="0.7"/>
        <circle cx="0" cy="-20" r="10" fill="${colors.secondary}" opacity="0.6"/>
      </g>
    `;
  };

  // Generate the complete SVG
  const svg = `
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <dropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="200" fill="url(#bgGradient)"/>
      
      <!-- Background Pattern -->
      ${getBackgroundPattern()}
      
      <!-- Main Plant Element -->
      ${getMainPlantElement()}
      
      <!-- Additional Ingredient Elements -->
      ${getIngredientElements()}
      
      <!-- Decorative Elements -->
      <g opacity="0.4">
        <circle cx="50" cy="50" r="4" fill="${colors.accent}"/>
        <circle cx="350" cy="50" r="3" fill="${colors.secondary}"/>
        <circle cx="80" cy="150" r="5" fill="${colors.primary}"/>
        <circle cx="320" cy="140" r="4" fill="${colors.accent}"/>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const RemedyImage: React.FC<RemedyImageProps> = ({ remedy, className = "" }) => {
  // Debug logging for errors only
  if (remedy && !remedy.name) {
    console.error('[RemedyImage] ERROR: Remedy object missing name!', remedy);
  }
  
  // First, try to find actual photo
  const photoPath = getRemedyImagePath(remedy.name);
  
  if (photoPath) {
    return (
      <img 
        src={photoPath}
        alt={`${remedy.name} - Natural Remedy | PlantRx Expert-Verified Treatment`}
        className={className}
        loading="lazy"
        onError={(e) => {
          // If real image fails to load, fallback to generated SVG
          const target = e.target as HTMLImageElement;
          target.src = generateRemedyImage(remedy);
        }}
      />
    );
  }
  
  // Fallback to generated SVG for remedies without photos
  const imageData = generateRemedyImage(remedy);
  
  return (
    <img 
      src={imageData}
      alt={`${remedy.name} - Natural Remedy | PlantRx Expert-Verified Treatment`}
      className={className}
      loading="lazy"
    />
  );
};
