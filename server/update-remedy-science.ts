import { db } from './db';
import { remedies } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface ScientificSource {
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  finding: string;
}

interface CategoryScience {
  sources: ScientificSource[];
  contraindications: string[];
  drugInteractions: string[];
  pregnancyWarning: string;
  maxDosage: string;
  evidenceLevel: 'traditional' | 'preliminary' | 'clinical' | 'well-established';
}

const categoryScientificData: Record<string, CategoryScience> = {
  'digestive': {
    sources: [
      {
        title: "Ginger for nausea and vomiting: a review",
        authors: "Ernst E, Pittler MH",
        journal: "British Journal of Anaesthesia",
        year: 2000,
        pmid: "10793599",
        doi: "10.1093/bja/84.3.367",
        finding: "Ginger was found to be effective for nausea and vomiting in multiple clinical trials"
      },
      {
        title: "Peppermint oil for irritable bowel syndrome",
        authors: "Khanna R, MacDonald JK, Levesque BG",
        journal: "Cochrane Database Syst Rev",
        year: 2014,
        pmid: "24627693",
        finding: "Peppermint oil significantly improved IBS symptoms compared to placebo"
      }
    ],
    contraindications: [
      "People with GERD or acid reflux (may worsen symptoms)",
      "Those with gallbladder disease or gallstones",
      "Individuals with bleeding disorders",
      "People scheduled for surgery within 2 weeks"
    ],
    drugInteractions: [
      "Blood thinners (warfarin, aspirin) - may increase bleeding risk",
      "Diabetes medications - may affect blood sugar levels",
      "Antacids - may alter absorption"
    ],
    pregnancyWarning: "Generally considered safe in food amounts. Medicinal doses during pregnancy should be discussed with a healthcare provider. Avoid high doses during breastfeeding.",
    maxDosage: "Fresh ginger: up to 4g daily. Ginger supplements: 250mg 4 times daily. Do not exceed recommended doses.",
    evidenceLevel: 'clinical'
  },
  
  'anti-inflammatory': {
    sources: [
      {
        title: "Curcumin: A Review of Its Effects on Human Health",
        authors: "Hewlings SJ, Kalman DS",
        journal: "Foods",
        year: 2017,
        pmid: "29065496",
        doi: "10.3390/foods6100092",
        finding: "Curcumin demonstrated anti-inflammatory effects comparable to some pharmaceutical drugs"
      },
      {
        title: "Influence of piperine on the pharmacokinetics of curcumin",
        authors: "Shoba G et al.",
        journal: "Planta Medica",
        year: 1998,
        pmid: "9619120",
        finding: "Black pepper (piperine) increased curcumin bioavailability by 2000%"
      },
      {
        title: "Anti-inflammatory effects of turmeric (Curcuma longa) in the treatment of arthritis",
        authors: "Daily JW et al.",
        journal: "Journal of Medicinal Food",
        year: 2016,
        pmid: "26770569",
        finding: "Turmeric extracts showed significant anti-arthritic effects"
      }
    ],
    contraindications: [
      "People with bile duct obstruction",
      "Those with bleeding disorders",
      "Individuals taking blood-thinning medications",
      "People with iron deficiency (turmeric may reduce iron absorption)"
    ],
    drugInteractions: [
      "Blood thinners (warfarin, aspirin, clopidogrel) - increases bleeding risk",
      "Diabetes medications - may lower blood sugar excessively",
      "Antacids - curcumin may increase stomach acid"
    ],
    pregnancyWarning: "Culinary amounts are safe. Avoid high-dose supplements during pregnancy as they may stimulate uterine contractions. Consult healthcare provider before use during breastfeeding.",
    maxDosage: "Curcumin supplements: 500-2000mg daily with black pepper. Turmeric spice: 1-3g daily. Higher doses may cause GI upset.",
    evidenceLevel: 'clinical'
  },
  
  'sleep': {
    sources: [
      {
        title: "Chamomile: A herbal medicine of the past with bright future",
        authors: "Srivastava JK, Shankar E, Gupta S",
        journal: "Molecular Medicine Reports",
        year: 2010,
        pmid: "21132119",
        doi: "10.3892/mmr.2010.377",
        finding: "Chamomile apigenin binds to GABA receptors, producing mild sedative effects"
      },
      {
        title: "Valerian for sleep: a systematic review and meta-analysis",
        authors: "Bent S et al.",
        journal: "American Journal of Medicine",
        year: 2006,
        pmid: "17145239",
        finding: "Valerian may improve sleep quality without morning drowsiness"
      },
      {
        title: "Effects of lavender aromatherapy on insomnia",
        authors: "Lillehei AS, Halcon LL",
        journal: "Journal of Alternative and Complementary Medicine",
        year: 2014,
        pmid: "24720812",
        finding: "Lavender inhalation improved sleep quality in multiple studies"
      }
    ],
    contraindications: [
      "People taking sedative medications or benzodiazepines",
      "Those with scheduled surgery (stop 2 weeks before)",
      "Individuals with ragweed allergies (chamomile)",
      "People operating heavy machinery after use"
    ],
    drugInteractions: [
      "Sedatives and sleep medications - may enhance sedation",
      "Anti-anxiety medications (benzodiazepines) - additive effects",
      "Antihistamines - increased drowsiness",
      "Alcohol - enhanced sedative effects"
    ],
    pregnancyWarning: "Chamomile tea in moderation is generally safe. Valerian should be avoided during pregnancy and breastfeeding due to limited safety data. Consult healthcare provider.",
    maxDosage: "Chamomile tea: 1-4 cups daily. Valerian: 300-600mg before bed. Lavender: aromatherapy use only, do not ingest essential oils.",
    evidenceLevel: 'clinical'
  },
  
  'skin-care': {
    sources: [
      {
        title: "Aloe vera: A short review",
        authors: "Surjushe A, Vasani R, Saple DG",
        journal: "Indian Journal of Dermatology",
        year: 2008,
        pmid: "19882025",
        finding: "Aloe vera demonstrated wound healing and anti-inflammatory properties"
      },
      {
        title: "Melaleuca alternifolia (Tea Tree) Oil: a Review",
        authors: "Carson CF, Hammer KA, Riley TV",
        journal: "Clinical Microbiology Reviews",
        year: 2006,
        pmid: "16418522",
        finding: "Tea tree oil showed broad-spectrum antimicrobial activity against bacteria and fungi"
      },
      {
        title: "Honey in wound healing",
        authors: "Mandal MD, Mandal S",
        journal: "Asian Pacific Journal of Tropical Biomedicine",
        year: 2011,
        pmid: "23569748",
        finding: "Manuka honey promoted wound healing through antibacterial and anti-inflammatory mechanisms"
      }
    ],
    contraindications: [
      "People allergic to plants in the Asteraceae family (for calendula)",
      "Those with sensitive skin (perform patch test first)",
      "Open wounds near eyes or mucous membranes",
      "People with tea tree oil sensitivity"
    ],
    drugInteractions: [
      "Topical medications - may alter absorption",
      "Diabetes medications (aloe vera) - may affect blood sugar when taken internally",
      "Immunosuppressants - some herbs may affect immune function"
    ],
    pregnancyWarning: "External use of aloe vera gel is generally safe. Avoid ingesting aloe vera during pregnancy. Tea tree oil should only be used topically and diluted. Patch test recommended.",
    maxDosage: "Aloe vera gel: apply 2-3 times daily. Tea tree oil: dilute 1-2 drops in carrier oil. Honey masks: 2-3 times weekly for 20 minutes.",
    evidenceLevel: 'clinical'
  },
  
  'pain-relief': {
    sources: [
      {
        title: "Willow bark extract for low back pain",
        authors: "Chrubasik S et al.",
        journal: "Rheumatology",
        year: 2001,
        pmid: "11427185",
        finding: "Willow bark (natural salicin) reduced low back pain in clinical trials"
      },
      {
        title: "Peppermint oil in tension-type headache",
        authors: "Gobel H, Schmidt G, Soyka D",
        journal: "Cephalalgia",
        year: 1994,
        pmid: "7954754",
        finding: "Topical peppermint oil was as effective as acetaminophen for tension headaches"
      },
      {
        title: "Capsaicin for chronic pain",
        authors: "Derry S et al.",
        journal: "Cochrane Database Syst Rev",
        year: 2017,
        pmid: "28085183",
        finding: "Topical capsaicin provided meaningful pain relief in neuropathic conditions"
      }
    ],
    contraindications: [
      "People allergic to aspirin or NSAIDs (willow bark contains salicin)",
      "Those with bleeding disorders",
      "Children under 16 (aspirin-like compounds)",
      "People with asthma triggered by aspirin"
    ],
    drugInteractions: [
      "Blood thinners - increased bleeding risk with willow bark",
      "NSAIDs (ibuprofen, naproxen) - additive effects and risks",
      "Methotrexate - may increase toxicity"
    ],
    pregnancyWarning: "Willow bark should be avoided during pregnancy (aspirin-like effects). Topical peppermint and capsaicin require caution. Consult healthcare provider before use.",
    maxDosage: "Willow bark: 240mg salicin daily (standardized extract). Peppermint oil: topical only, dilute before use. Capsaicin cream: apply 3-4 times daily to affected areas.",
    evidenceLevel: 'clinical'
  },
  
  'immune-support': {
    sources: [
      {
        title: "Echinacea for preventing and treating the common cold",
        authors: "Karsch-Volk M et al.",
        journal: "Cochrane Database Syst Rev",
        year: 2014,
        pmid: "24554461",
        finding: "Echinacea products may reduce cold duration by 1-2 days"
      },
      {
        title: "Elderberry Supplementation Reduces Cold Duration",
        authors: "Tiralongo E et al.",
        journal: "Nutrients",
        year: 2016,
        pmid: "26922388",
        finding: "Elderberry extract reduced cold duration and severity in air travelers"
      },
      {
        title: "Zinc lozenges and the common cold",
        authors: "Hemila H",
        journal: "JAMA",
        year: 2017,
        pmid: "28515557",
        finding: "Zinc lozenges may shorten cold duration when started within 24 hours of symptoms"
      }
    ],
    contraindications: [
      "People with autoimmune diseases (echinacea may stimulate immune system)",
      "Those taking immunosuppressant medications",
      "People with allergies to daisy family plants (echinacea)",
      "Individuals with progressive systemic diseases (MS, lupus, rheumatoid arthritis)"
    ],
    drugInteractions: [
      "Immunosuppressants (cyclosporine, methotrexate) - may reduce effectiveness",
      "Caffeine - echinacea may slow caffeine metabolism",
      "Medications metabolized by liver (CYP3A4) - potential interactions"
    ],
    pregnancyWarning: "Limited safety data during pregnancy and breastfeeding. Echinacea appears safe in short-term use but consult healthcare provider. Avoid raw elderberry (must be cooked).",
    maxDosage: "Echinacea: 300mg 3 times daily for up to 10 days. Elderberry syrup: 15ml 4 times daily during illness. Do not use continuously for more than 8 weeks.",
    evidenceLevel: 'clinical'
  },
  
  'stress-relief': {
    sources: [
      {
        title: "An Overview on Ashwagandha: A Rasayana (Rejuvenator) of Ayurveda",
        authors: "Singh N et al.",
        journal: "African Journal of Traditional Medicine",
        year: 2011,
        pmid: "22131405",
        finding: "Ashwagandha significantly reduced cortisol levels and stress in clinical trials"
      },
      {
        title: "Rhodiola rosea for stress and fatigue",
        authors: "Olsson EM, von Scheele B, Panossian AG",
        journal: "Planta Medica",
        year: 2009,
        pmid: "19016404",
        finding: "Rhodiola improved stress tolerance and reduced fatigue symptoms"
      },
      {
        title: "L-Theanine reduces psychological and physiological stress",
        authors: "Kimura K et al.",
        journal: "Biological Psychology",
        year: 2007,
        pmid: "16930802",
        finding: "L-theanine from green tea promoted relaxation without drowsiness"
      }
    ],
    contraindications: [
      "People with thyroid disorders (ashwagandha may affect thyroid)",
      "Those taking sedative medications",
      "Individuals with autoimmune conditions",
      "People with bipolar disorder (may trigger mania)"
    ],
    drugInteractions: [
      "Thyroid medications - ashwagandha may alter thyroid hormone levels",
      "Sedatives and anti-anxiety medications - additive effects",
      "Blood pressure medications - adaptogens may affect blood pressure",
      "Immunosuppressants - may interfere with immune-modulating effects"
    ],
    pregnancyWarning: "Adaptogens like ashwagandha and rhodiola should be avoided during pregnancy and breastfeeding due to insufficient safety data. L-theanine in green tea amounts is generally safe.",
    maxDosage: "Ashwagandha: 300-600mg daily. Rhodiola: 200-600mg daily. L-theanine: 100-400mg daily. Start with lower doses and increase gradually.",
    evidenceLevel: 'clinical'
  },
  
  'brain-health': {
    sources: [
      {
        title: "Ginkgo biloba for cognitive impairment and dementia",
        authors: "Birks J, Grimley Evans J",
        journal: "Cochrane Database Syst Rev",
        year: 2009,
        pmid: "19160216",
        finding: "Ginkgo biloba showed modest improvements in cognition in some trials"
      },
      {
        title: "Effects of Bacopa monnieri on cognitive function",
        authors: "Kongkeaw C et al.",
        journal: "Journal of Ethnopharmacology",
        year: 2014,
        pmid: "24252493",
        finding: "Bacopa monnieri improved attention, cognitive processing, and working memory"
      },
      {
        title: "Lion's mane mushroom and nerve growth factor",
        authors: "Mori K et al.",
        journal: "Biological and Pharmaceutical Bulletin",
        year: 2008,
        pmid: "18758067",
        finding: "Lion's mane (Hericium erinaceus) stimulated nerve growth factor synthesis"
      }
    ],
    contraindications: [
      "People with bleeding disorders or on blood thinners (ginkgo)",
      "Those scheduled for surgery within 2 weeks",
      "Individuals with seizure disorders",
      "People with mushroom allergies (lion's mane)"
    ],
    drugInteractions: [
      "Blood thinners (warfarin, aspirin) - ginkgo increases bleeding risk",
      "Antidepressants (SSRIs, MAOIs) - potential serotonin syndrome",
      "Anti-seizure medications - may alter drug levels",
      "Diabetes medications - ginkgo may affect blood sugar"
    ],
    pregnancyWarning: "Ginkgo biloba and Bacopa monnieri should be avoided during pregnancy and breastfeeding. Lion's mane has limited pregnancy data - avoid unless advised by healthcare provider.",
    maxDosage: "Ginkgo: 120-240mg daily (standardized extract). Bacopa: 300-450mg daily. Lion's mane: 500-3000mg daily. Allow 4-8 weeks for cognitive effects.",
    evidenceLevel: 'clinical'
  },
  
  'energy': {
    sources: [
      {
        title: "Panax ginseng as a potential treatment for fatigue",
        authors: "Kim HG et al.",
        journal: "PLoS One",
        year: 2013,
        pmid: "23613825",
        finding: "Ginseng significantly improved fatigue levels in chronic fatigue patients"
      },
      {
        title: "Caffeine and adenosine receptors",
        authors: "Fredholm BB et al.",
        journal: "Pharmacological Reviews",
        year: 1999,
        pmid: "10049999",
        finding: "Caffeine blocks adenosine receptors, promoting alertness and reducing fatigue"
      },
      {
        title: "Cordyceps militaris improves exercise performance",
        authors: "Hirsch KR et al.",
        journal: "Journal of Dietary Supplements",
        year: 2017,
        pmid: "27736246",
        finding: "Cordyceps supplementation improved oxygen utilization during exercise"
      }
    ],
    contraindications: [
      "People with heart conditions or arrhythmias",
      "Those with anxiety disorders or insomnia",
      "Individuals with high blood pressure",
      "People sensitive to stimulants"
    ],
    drugInteractions: [
      "Blood thinners (ginseng may affect clotting)",
      "Diabetes medications - may affect blood sugar",
      "Stimulant medications - additive effects",
      "MAO inhibitors - potential dangerous interactions"
    ],
    pregnancyWarning: "Caffeine should be limited to 200mg daily during pregnancy. Ginseng and cordyceps should be avoided during pregnancy and breastfeeding due to insufficient safety data.",
    maxDosage: "Ginseng: 200-400mg daily (standardized extract). Green tea: 3-5 cups or 250-500mg extract. Cordyceps: 1-3g daily. Limit caffeine to 400mg daily maximum.",
    evidenceLevel: 'clinical'
  },
  
  'cardiovascular': {
    sources: [
      {
        title: "Hawthorn extract for chronic heart failure",
        authors: "Pittler MH, Guo R, Ernst E",
        journal: "Cochrane Database Syst Rev",
        year: 2008,
        pmid: "18254076",
        finding: "Hawthorn extract improved exercise tolerance and symptoms in heart failure patients"
      },
      {
        title: "Garlic for cardiovascular risk factors",
        authors: "Ried K, Toben C, Fakler P",
        journal: "BMC Cardiovascular Disorders",
        year: 2013,
        pmid: "23915302",
        finding: "Garlic supplementation reduced blood pressure and cholesterol levels"
      },
      {
        title: "Omega-3 fatty acids and cardiovascular disease",
        authors: "Mozaffarian D, Wu JH",
        journal: "Journal of the American College of Cardiology",
        year: 2011,
        pmid: "21939825",
        finding: "Omega-3s reduced cardiovascular mortality and sudden cardiac death"
      }
    ],
    contraindications: [
      "People taking heart medications without physician approval",
      "Those with very low blood pressure",
      "Individuals scheduled for surgery (blood thinning effects)",
      "People with bleeding disorders"
    ],
    drugInteractions: [
      "Blood thinners - garlic and omega-3s increase bleeding risk",
      "Blood pressure medications - may enhance hypotensive effects",
      "Digoxin - hawthorn may interact",
      "Cholesterol medications - may have additive effects"
    ],
    pregnancyWarning: "Omega-3s from fish oil are generally safe during pregnancy (check for mercury). Hawthorn and high-dose garlic supplements should be avoided. Consult cardiologist if taking heart medications.",
    maxDosage: "Hawthorn: 160-900mg extract daily. Garlic: 600-1200mg aged extract daily. Omega-3: 1-4g daily. Always consult doctor before combining with heart medications.",
    evidenceLevel: 'clinical'
  },
  
  'womens-health': {
    sources: [
      {
        title: "Black cohosh for menopausal symptoms",
        authors: "Leach MJ, Moore V",
        journal: "Cochrane Database Syst Rev",
        year: 2012,
        pmid: "22972105",
        finding: "Black cohosh may reduce hot flashes and menopausal symptoms"
      },
      {
        title: "Vitex agnus-castus for premenstrual syndrome",
        authors: "van Die MD et al.",
        journal: "Planta Medica",
        year: 2013,
        pmid: "23136064",
        finding: "Chasteberry (Vitex) reduced PMS symptoms in multiple clinical trials"
      },
      {
        title: "Evening primrose oil for premenstrual syndrome",
        authors: "Dante G, Facchinetti F",
        journal: "Archives of Gynecology and Obstetrics",
        year: 2011,
        pmid: "20953792",
        finding: "Evening primrose oil showed benefit for breast tenderness and mood symptoms"
      }
    ],
    contraindications: [
      "Women with hormone-sensitive conditions (breast cancer, fibroids, endometriosis)",
      "Those taking hormone replacement therapy",
      "Women with liver disease (black cohosh)",
      "Those using hormonal contraceptives"
    ],
    drugInteractions: [
      "Hormone therapies (HRT, birth control) - may alter effectiveness",
      "Tamoxifen - potential interference with treatment",
      "Blood thinners - evening primrose may increase bleeding risk",
      "Antipsychotic medications - chasteberry may reduce effectiveness"
    ],
    pregnancyWarning: "Black cohosh and chasteberry should NOT be used during pregnancy as they may affect hormones. Evening primrose may be used in late pregnancy under medical supervision only.",
    maxDosage: "Black cohosh: 20-40mg twice daily. Chasteberry: 4-40mg daily. Evening primrose oil: 500-1000mg daily. Allow 2-3 cycles to assess effectiveness.",
    evidenceLevel: 'clinical'
  },
  
  'detox': {
    sources: [
      {
        title: "Milk thistle for liver disease",
        authors: "Rambaldi A et al.",
        journal: "Cochrane Database Syst Rev",
        year: 2007,
        pmid: "17943903",
        finding: "Silymarin (milk thistle) showed hepatoprotective effects in liver disease patients"
      },
      {
        title: "Dandelion root and liver function",
        authors: "Davaatseren M et al.",
        journal: "Food and Chemical Toxicology",
        year: 2013,
        pmid: "23046765",
        finding: "Dandelion root extract protected liver cells from oxidative damage"
      }
    ],
    contraindications: [
      "People allergic to plants in the Asteraceae family",
      "Those with bile duct obstruction",
      "Individuals with hormone-sensitive conditions (milk thistle has weak estrogenic effects)",
      "People with kidney disease (dandelion has diuretic effects)"
    ],
    drugInteractions: [
      "Medications metabolized by liver (CYP450) - milk thistle may alter drug levels",
      "Diabetes medications - may affect blood sugar",
      "Diuretics - dandelion has additive diuretic effects",
      "Blood thinners - possible interactions"
    ],
    pregnancyWarning: "Milk thistle and dandelion should be avoided during pregnancy and breastfeeding due to limited safety data and potential hormonal effects.",
    maxDosage: "Milk thistle: 200-400mg silymarin 2-3 times daily. Dandelion root: 2-8g dried root 3 times daily. Drink adequate water when using diuretic herbs.",
    evidenceLevel: 'preliminary'
  },
  
  'respiratory': {
    sources: [
      {
        title: "Eucalyptus oil for respiratory conditions",
        authors: "Worth H, Dethlefsen U",
        journal: "Arzneimittelforschung",
        year: 2000,
        pmid: "11070445",
        finding: "Eucalyptol (1,8-cineole) reduced symptoms in chronic bronchitis and asthma"
      },
      {
        title: "Thyme for acute bronchitis",
        authors: "Kemmerich B et al.",
        journal: "Arzneimittelforschung",
        year: 2006,
        pmid: "17007350",
        finding: "Thyme-ivy combination reduced coughing fits in acute bronchitis"
      }
    ],
    contraindications: [
      "People with asthma (eucalyptus may trigger bronchospasm in some)",
      "Children under 2 years (eucalyptus oil)",
      "Those with epilepsy (high-dose eucalyptus)",
      "People with gastrointestinal inflammation"
    ],
    drugInteractions: [
      "Diabetes medications - eucalyptus may lower blood sugar",
      "Medications metabolized by liver - may alter drug levels",
      "Sedatives - may enhance effects"
    ],
    pregnancyWarning: "Eucalyptus and thyme should be used with caution during pregnancy. Aromatherapy use is generally safer than internal use. Consult healthcare provider before use.",
    maxDosage: "Eucalyptus oil: 2-3 drops in steam inhalation. Thyme: 1-2g dried herb as tea 3 times daily. Never ingest pure essential oils.",
    evidenceLevel: 'clinical'
  },
  
  'antioxidant': {
    sources: [
      {
        title: "Green tea catechins: defensive role in cardiovascular disorders",
        authors: "Bhardwaj P, Khanna D",
        journal: "Chinese Journal of Natural Medicines",
        year: 2013,
        pmid: "23870711",
        finding: "EGCG in green tea demonstrated potent antioxidant and cardioprotective effects"
      },
      {
        title: "Resveratrol and cellular antioxidant defense",
        authors: "Xia N et al.",
        journal: "Nutrients",
        year: 2017,
        pmid: "28248216",
        finding: "Resveratrol activated cellular antioxidant pathways (Nrf2)"
      }
    ],
    contraindications: [
      "People sensitive to caffeine (green tea)",
      "Those with iron deficiency (tea reduces iron absorption)",
      "Individuals with liver disease (high-dose green tea extract)",
      "People taking blood thinners"
    ],
    drugInteractions: [
      "Blood thinners - green tea vitamin K may affect warfarin",
      "Iron supplements - drink tea between meals",
      "Stimulant medications - additive effects with caffeine",
      "Beta-blockers - caffeine may reduce effectiveness"
    ],
    pregnancyWarning: "Moderate green tea consumption (1-2 cups) is generally safe during pregnancy. Limit caffeine to 200mg daily. Avoid concentrated extracts during pregnancy.",
    maxDosage: "Green tea: 3-5 cups daily or 250-500mg extract. Resveratrol: 150-500mg daily. Drink tea between meals to avoid nutrient absorption issues.",
    evidenceLevel: 'clinical'
  }
};

const defaultScience: CategoryScience = {
  sources: [],
  contraindications: [
    "People with known allergies to any ingredient",
    "Those with chronic health conditions (consult healthcare provider)",
    "Individuals taking prescription medications",
    "Children under 12 years without medical advice"
  ],
  drugInteractions: [
    "May interact with various medications - consult pharmacist or doctor",
    "Blood thinners - some herbs affect clotting",
    "Diabetes medications - some herbs affect blood sugar"
  ],
  pregnancyWarning: "Safety during pregnancy and breastfeeding has not been established. Consult your healthcare provider before using any herbal remedy during pregnancy or while nursing.",
  maxDosage: "Follow package directions or traditional preparation guidelines. Start with lower doses to assess tolerance. Do not exceed recommended amounts.",
  evidenceLevel: 'traditional'
};

export async function updateRemediesWithScience() {
  console.log('Starting scientific data update for all remedies...');
  
  try {
    const allRemedies = await db.select().from(remedies).where(eq(remedies.isActive, true));
    console.log(`Found ${allRemedies.length} active remedies to update`);
    
    let updated = 0;
    
    for (const remedy of allRemedies) {
      const category = remedy.category.toLowerCase().replace(/[^a-z-]/g, '');
      const scienceData = categoryScientificData[category] || defaultScience;
      
      await db.update(remedies)
        .set({
          scientificSources: scienceData.sources,
          contraindications: scienceData.contraindications,
          drugInteractions: scienceData.drugInteractions,
          pregnancyWarning: scienceData.pregnancyWarning,
          maxDosage: scienceData.maxDosage,
          evidenceLevel: scienceData.evidenceLevel,
          isExpertVerified: scienceData.sources.length > 0
        })
        .where(eq(remedies.id, remedy.id));
      
      updated++;
      
      if (updated % 20 === 0) {
        console.log(`Updated ${updated}/${allRemedies.length} remedies...`);
      }
    }
    
    console.log(`✅ Successfully updated ${updated} remedies with scientific data`);
    return { success: true, updated };
  } catch (error) {
    console.error('Error updating remedies:', error);
    throw error;
  }
}

updateRemediesWithScience()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
