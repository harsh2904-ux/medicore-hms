export interface AiClinicalPlan {
  provisionalDiagnosis: string;
  icd10Code: string;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  recommendedMedications: Array<{
    name: string;
    dosage: string;
    route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Sublingual';
    frequency: 'Once daily' | 'Twice daily (BD)' | 'Thrice daily (TDS)' | 'Four times daily (QID)' | 'SOS / As needed' | 'Before bed';
    duration: number;
    instructions: string;
  }>;
  recommendedLabs: string[];
  recommendedRadiology: string[];
  lifestyleAdvice: string;
}

export interface AiLabExplanation {
  overallSummary: string;
  keyFindings: Array<{
    parameter: string;
    status: 'NORMAL' | 'ELEVATED' | 'LOW';
    patientValue: string;
    referenceRange: string;
    plainEnglishMeaning: string;
  }>;
  dietaryRecommendations: string[];
  lifestyleTips: string[];
  followUpAdvice: string;
}

const CLINICAL_PRESETS: Record<string, AiClinicalPlan> = {
  'acute-bronchitis': {
    provisionalDiagnosis: 'Acute Asthmatic Bronchitis with Secondary Infection',
    icd10Code: 'J20.9 (Acute bronchitis, unspecified)',
    soapNotes: {
      subjective: 'Patient presents with a 4-day history of persistent productive cough, wheezing, low-grade fever, and mild retrosternal discomfort on coughing.',
      objective: 'Bilateral expiratory wheezes on chest auscultation. Rhonchi audible at lung bases. Throat congested. SpO2 96% on room air.',
      assessment: 'Acute bronchitis with reactive airway component. Viral vs early bacterial tracheobronchitis.',
      plan: 'Initiate bronchodilator therapy, anti-inflammatory mucolytic, and symptomatic antipyretics. Order sputum and inflammatory markers.',
    },
    recommendedMedications: [
      {
        name: 'Levocetirizine + Montelukast (10mg/5mg)',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Before bed',
        duration: 10,
        instructions: 'Take 1 hour before sleep',
      },
      {
        name: 'Acebrophylline 100mg Capsule',
        dosage: '1 Capsule',
        route: 'Oral',
        frequency: 'Twice daily (BD)',
        duration: 7,
        instructions: 'After breakfast and dinner',
      },
      {
        name: 'Paracetamol 650mg (Dolo)',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'SOS / As needed',
        duration: 5,
        instructions: 'Take for fever > 100°F or body aches (max 3/day)',
      },
      {
        name: 'Azithromycin 500mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Once daily',
        duration: 3,
        instructions: 'Take 1 hour before lunch for 3 days',
      },
    ],
    recommendedLabs: ['Complete Blood Count (CBC)', 'C-Reactive Protein (CRP) Quantitative'],
    recommendedRadiology: ['Chest X-Ray PA View'],
    lifestyleAdvice: 'Steam inhalation twice daily. Strict avoidance of cold beverages, smoke, and air pollution. Maintain warm fluid hydration.',
  },
  'type-2-diabetes': {
    provisionalDiagnosis: 'Type 2 Diabetes Mellitus with Suboptimal Glycemic Control',
    icd10Code: 'E11.65 (Type 2 diabetes mellitus with hyperglycemia)',
    soapNotes: {
      subjective: 'Patient presents for routine metabolic review with increasing lethargy, polydipsia, and mild polyuria. Reports intermittent blurred vision.',
      objective: 'BP 138/86 mmHg, BMI 28.2 kg/m². Peripheral pulses palpable bilaterally. Monofilament test normal.',
      assessment: 'Poorly controlled Type 2 Diabetes with metabolic syndrome.',
      plan: 'Optimize oral hypoglycemic regimen. Order comprehensive diabetic panel including microalbuminuria and fundoscopy.',
    },
    recommendedMedications: [
      {
        name: 'Metformin Hydrochloride 500mg SR',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Twice daily (BD)',
        duration: 30,
        instructions: 'Take immediately with meals to prevent gastrointestinal upset',
      },
      {
        name: 'Dapagliflozin 10mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Once daily',
        duration: 30,
        instructions: 'Take morning before breakfast with a glass of water',
      },
      {
        name: 'Atorvastatin 10mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Before bed',
        duration: 30,
        instructions: 'Bedtime cardiovascular primary prevention',
      },
    ],
    recommendedLabs: ['HbA1c Glycated Hemoglobin', 'Fasting Blood Sugar (FBS)', 'Lipid Profile', 'Serum Creatinine & eGFR', 'Urine Microalbumin / Creatinine Ratio'],
    recommendedRadiology: ['ECG 12-Lead Rest'],
    lifestyleAdvice: 'Strict low-glycemic index diabetic diet (limit refined carbohydrates and sugar). 30 minutes brisk walking daily. Self-monitor fasting and post-prandial blood glucose twice weekly.',
  },
  'hypertension-stage2': {
    provisionalDiagnosis: 'Primary Essential Hypertension (Stage 2)',
    icd10Code: 'I10 (Essential (primary) hypertension)',
    soapNotes: {
      subjective: 'Patient reports morning occipital headaches, dizziness upon sudden standing, and intermittent facial flushing.',
      objective: 'Resting BP 154/96 mmHg (confirmed on two readings separated by 15 mins). S1, S2 audible, no murmurs.',
      assessment: 'Stage 2 Primary Hypertension requiring dual-drug antihypertensive therapy.',
      plan: 'Dual mechanism blood pressure reduction. Order baseline renal function, electrolytes, and echocardiogram.',
    },
    recommendedMedications: [
      {
        name: 'Telmisartan 40mg + Amlodipine 5mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Once daily',
        duration: 30,
        instructions: 'Take morning at 8:00 AM consistently',
      },
      {
        name: 'Ecosprin 75mg (Aspirin)',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Before bed',
        duration: 30,
        instructions: 'Take after dinner',
      },
    ],
    recommendedLabs: ['Kidney Function Test (KFT)', 'Serum Electrolytes (Na+, K+, Cl-)', 'Lipid Profile'],
    recommendedRadiology: ['ECG 12-Lead Rest', '2D Echocardiography with Doppler'],
    lifestyleAdvice: 'DASH diet protocol (Dietary Approaches to Stop Hypertension). Limit dietary sodium to < 2 grams per day. Avoid processed foods and manage stress.',
  },
  'acute-gastroenteritis': {
    provisionalDiagnosis: 'Acute Infective Gastroenteritis with Moderate Dehydration',
    icd10Code: 'A09 (Infectious gastroenteritis and colitis, unspecified)',
    soapNotes: {
      subjective: 'Patient presents with 6 episodes of watery diarrhea, severe colicky abdominal cramps, nausea, and 2 episodes of non-bilious vomiting following restaurant food intake.',
      objective: 'Dry buccal mucosa, skin turgor mildly reduced, diffuse mild periumbilical tenderness without guarding or rebound. Vitals: Pulse 94 bpm, BP 110/70 mmHg.',
      assessment: 'Acute infective gastroenteritis with dehydration.',
      plan: 'Aggressive oral/IV rehydration, gut motility regulator, probiotic reconstitution.',
    },
    recommendedMedications: [
      {
        name: 'Oral Rehydration Salts (ORS) Sachet',
        dosage: '1 Sachet in 1L Water',
        route: 'Oral',
        frequency: 'SOS / As needed',
        duration: 3,
        instructions: 'Sip continuously after every loose motion',
      },
      {
        name: 'Rifaximin 400mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Twice daily (BD)',
        duration: 5,
        instructions: 'Take after meals',
      },
      {
        name: 'Drotaverine 80mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'SOS / As needed',
        duration: 3,
        instructions: 'Take for severe abdominal cramps (max 3 tablets daily)',
      },
      {
        name: 'Probiotic Spores (Bacillus clausii)',
        dosage: '1 Mini Bottle',
        route: 'Oral',
        frequency: 'Twice daily (BD)',
        duration: 5,
        instructions: 'Drink oral suspension directly',
      },
    ],
    recommendedLabs: ['Stool Routine & Microscopy', 'Serum Electrolytes', 'Complete Blood Count (CBC)'],
    recommendedRadiology: ['USG Abdomen & Pelvis'],
    lifestyleAdvice: 'Strict bland diet (BRAT: Bananas, Rice, Applesauce, Toast). Avoid milk, dairy, fatty, and spicy foods until bowel movements normalize.',
  },
};

export const aiMedicalService = {
  getAvailablePresets() {
    return [
      { id: 'acute-bronchitis', title: 'Acute Bronchitis & Cough', specialty: 'Pulmonology / OPD' },
      { id: 'type-2-diabetes', title: 'Type 2 Diabetes Review', specialty: 'Endocrinology' },
      { id: 'hypertension-stage2', title: 'Stage 2 Hypertension', specialty: 'Cardiology' },
      { id: 'acute-gastroenteritis', title: 'Acute Gastroenteritis', specialty: 'Gastroenterology' },
    ];
  },

  async generateClinicalPlan(promptOrId: string, currentComplaint?: string): Promise<AiClinicalPlan> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Check preset match
    const lower = (promptOrId + ' ' + (currentComplaint || '')).toLowerCase();
    if (lower.includes('bronch') || lower.includes('cough') || lower.includes('wheez')) {
      return CLINICAL_PRESETS['acute-bronchitis'];
    }
    if (lower.includes('diabet') || lower.includes('sugar') || lower.includes('glucose')) {
      return CLINICAL_PRESETS['type-2-diabetes'];
    }
    if (lower.includes('hyperten') || lower.includes('bp') || lower.includes('blood pressure')) {
      return CLINICAL_PRESETS['hypertension-stage2'];
    }
    if (lower.includes('gastro') || lower.includes('diarrhea') || lower.includes('vomit') || lower.includes('stomach')) {
      return CLINICAL_PRESETS['acute-gastroenteritis'];
    }

    // Default to acute bronchitis or first preset
    return CLINICAL_PRESETS['acute-bronchitis'];
  },

  async explainLabReport(reportName: string): Promise<AiLabExplanation> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const lower = reportName.toLowerCase();
    if (lower.includes('lipid') || lower.includes('cholesterol')) {
      return {
        overallSummary: 'Your lipid profile shows a mildly elevated Total Cholesterol and LDL ("bad cholesterol"), with satisfactory HDL ("good cholesterol"). Overall cardiovascular risk is moderate and can be managed effectively with dietary adjustments.',
        keyFindings: [
          {
            parameter: 'Total Cholesterol',
            status: 'ELEVATED',
            patientValue: '218 mg/dL',
            referenceRange: '< 200 mg/dL',
            plainEnglishMeaning: 'Total amount of circulating fats in your bloodstream; slightly above ideal baseline.',
          },
          {
            parameter: 'LDL ("Bad") Cholesterol',
            status: 'ELEVATED',
            patientValue: '136 mg/dL',
            referenceRange: '< 100 mg/dL',
            plainEnglishMeaning: 'Can cause gradual plaque buildup in coronary arteries if unmanaged.',
          },
          {
            parameter: 'HDL ("Good") Cholesterol',
            status: 'NORMAL',
            patientValue: '48 mg/dL',
            referenceRange: '> 40 mg/dL',
            plainEnglishMeaning: 'Protective cholesterol that carries bad fats back to the liver for disposal.',
          },
          {
            parameter: 'Triglycerides',
            status: 'NORMAL',
            patientValue: '142 mg/dL',
            referenceRange: '< 150 mg/dL',
            plainEnglishMeaning: 'Fat from unused calories stored for energy; within safe optimal boundaries.',
          },
        ],
        dietaryRecommendations: [
          'Incorporate soluble fiber: oats, psyllium husk, chia seeds, and legumes.',
          'Replace butter and hydrogenated oils with cold-pressed olive or mustard oil.',
          'Avoid fried foods, red meats, pastries, and trans fats.',
        ],
        lifestyleTips: [
          'Perform 30 minutes of aerobic exercise (brisk walking, cycling, swimming) at least 5 days a week.',
          'Maintain adequate hydration (2.5 - 3 Liters of water daily).',
        ],
        followUpAdvice: 'Re-test fasting lipid panel in 12 weeks to assess improvement after dietary changes.',
      };
    }

    // Default to CBC
    return {
      overallSummary: 'Your Complete Blood Count (CBC) is overall very healthy! Your red blood cells, hemoglobin, and platelets are in optimal ranges. A very slight elevation in White Blood Cells points toward a healing, mild seasonal viral or allergic reaction.',
      keyFindings: [
        {
          parameter: 'Hemoglobin (Hb)',
          status: 'NORMAL',
          patientValue: '14.2 g/dL',
          referenceRange: '13.0 - 17.0 g/dL',
          plainEnglishMeaning: 'Excellent oxygen-carrying capacity throughout your organs and brain.',
        },
        {
          parameter: 'Total Leukocyte Count (WBC)',
          status: 'ELEVATED',
          patientValue: '11,200 /µL',
          referenceRange: '4,000 - 10,000 /µL',
          plainEnglishMeaning: 'Slightly raised, indicating your immune system is actively fighting a mild infection.',
        },
        {
          parameter: 'Platelet Count',
          status: 'NORMAL',
          patientValue: '265,000 /µL',
          referenceRange: '150,000 - 450,000 /µL',
          plainEnglishMeaning: 'Healthy clotting ability; no risk of bleeding or thrombotic disorder.',
        },
      ],
      dietaryRecommendations: [
        'Maintain iron and vitamin C rich diet: spinach, pomegranate, oranges, and lentils.',
        'Drink plenty of warm water and electrolyte-rich fluids (coconut water, herbal teas).',
      ],
      lifestyleTips: [
        'Ensure 7-8 hours of sound nighttime sleep for immune recovery.',
        'Avoid strenuous gym workouts until WBC normalizes.',
      ],
      followUpAdvice: 'Routine follow-up in OPD. No emergency medical intervention needed.',
    };
  }
};
