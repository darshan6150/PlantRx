// Enhanced Ingredient Product Mapping System
export interface ProductLink {
  id: string;
  productId: string;
  ingredientName: string;
  productTitle: string;
  price: number;
  buyLink: string;
  confidence: number;
}

export interface IngredientMapping {
  ingredient: string;
  alternativeNames: string[];
  productKeywords: string[];
  category: string;
}

// Comprehensive ingredient database
const ingredientMappings: IngredientMapping[] = [
  {
    ingredient: 'turmeric',
    alternativeNames: ['curcumin', 'haldi', 'curcuma longa'],
    productKeywords: ['turmeric', 'curcumin', 'anti-inflammatory', 'golden milk'],
    category: 'herbs'
  },
  {
    ingredient: 'ginger',
    alternativeNames: ['zingiber officinale', 'ginger root'],
    productKeywords: ['ginger', 'digestive', 'nausea', 'tea'],
    category: 'herbs'
  },
  {
    ingredient: 'ashwagandha',
    alternativeNames: ['withania somnifera', 'indian winter cherry'],
    productKeywords: ['ashwagandha', 'adaptogen', 'stress', 'energy'],
    category: 'adaptogens'
  }
];

export async function findProductLinksForIngredients(ingredients: string[]): Promise<ProductLink[]> {
  const productLinks: ProductLink[] = [];
  
  for (const ingredient of ingredients) {
    const mapping = ingredientMappings.find(m => 
      m.ingredient.toLowerCase() === ingredient.toLowerCase() ||
      m.alternativeNames.some(name => name.toLowerCase().includes(ingredient.toLowerCase()))
    );
    
    if (mapping) {
      productLinks.push({
        id: `${mapping.ingredient}-prod`,
        productId: `prod-${mapping.ingredient}`,
        ingredientName: mapping.ingredient,
        productTitle: `Premium ${mapping.ingredient} Supplement`,
        price: 29.99,
        buyLink: `/store/${mapping.ingredient.toLowerCase()}`,
        confidence: 85
      });
    }
  }

  return productLinks.sort((a, b) => b.confidence - a.confidence);
}

export function getUnlinkedIngredients(ingredients: string[]): string[] {
  return ingredients.filter(ingredient => {
    return !ingredientMappings.some(mapping => 
      mapping.ingredient.toLowerCase() === ingredient.toLowerCase() ||
      mapping.alternativeNames.some(name => name.toLowerCase().includes(ingredient.toLowerCase()))
    );
  });
}

export const ingredientProductMapping = {
  mapIngredients: findProductLinksForIngredients,
  getProductsForIngredient: async (ingredient: string) => {
    return await findProductLinksForIngredients([ingredient]);
  },
  getAllMappings: () => ingredientMappings
};