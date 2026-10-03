export interface AllergyAlert {
  substance: string;
  matchedMedication: string;
  severity: 'CRITICAL' | 'HIGH';
  reaction: string;
  recommendation: string;
}

export interface DdiAlert {
  drugA: string;
  drugB: string;
  severity: 'MAJOR' | 'MODERATE';
  mechanism: string;
  clinicalConsequence: string;
  recommendation: string;
}

export interface ClinicalSafetyReport {
  hasAlert: boolean;
  allergyAlerts: AllergyAlert[];
  ddiAlerts: DdiAlert[];
}

// Common drug allergy classes & cross-reactivity
const ALLERGY_MAP: Record<string, { triggers: string[]; reaction: string; alternatives: string }> = {
  penicillin: {
    triggers: ['amoxicillin', 'ampicillin', 'augmentin', 'penicillin', 'piperacillin', 'cloxacillin'],
    reaction: 'Anaphylaxis, severe cutaneous urticaria, bronchospasm',
    alternatives: 'Azithromycin, Clarithromycin, Ciprofloxacin, Doxycycline',
  },
  sulfa: {
    triggers: ['bactrim', 'septra', 'sulfamethoxazole', 'sulfadiazine', 'sulfasalazine'],
    reaction: 'Stevens-Johnson Syndrome (SJS), severe rash, hemolytic anemia',
    alternatives: 'Nitrofurantoin, Amoxicillin-Clavulanate, Fluoroquinolones',
  },
  nsaid: {
    triggers: ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac', 'ketorolac', 'indomethacin', 'celecoxib'],
    reaction: 'Asthma exacerbation, angioedema, GI bleeding',
    alternatives: 'Acetaminophen (Paracetamol), Tramadol',
  },
  aspirin: {
    triggers: ['aspirin', 'ecosprin', 'acetylsalicylic acid'],
    reaction: 'Samter triad bronchospasm, gastrointestinal ulceration',
    alternatives: 'Clopidogrel, Acetaminophen',
  },
  cephalosporin: {
    triggers: ['cefixime', 'ceftriaxone', 'cephalexin', 'cefuroxime', 'cefepime'],
    reaction: 'Cross-reactive allergic rash, anaphylactoid reaction',
    alternatives: 'Levofloxacin, Azithromycin',
  },
  codeine: {
    triggers: ['codeine', 'morphine', 'tramadol', 'fentanyl'],
    reaction: 'Histamine release, severe pruritus, respiratory depression',
    alternatives: 'Acetaminophen, Ibuprofen',
  },
};

// Known critical drug-drug interaction pairs
interface DdiRule {
  drug1Keywords: string[];
  drug2Keywords: string[];
  severity: 'MAJOR' | 'MODERATE';
  mechanism: string;
  clinicalConsequence: string;
  recommendation: string;
}

const DDI_RULES: DdiRule[] = [
  {
    drug1Keywords: ['warfarin', 'coumadin'],
    drug2Keywords: ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac'],
    severity: 'MAJOR',
    mechanism: 'Additive antithrombotic & ulcerogenic gastrointestinal mucosal irritation.',
    clinicalConsequence: 'Severe life-threatening gastrointestinal hemorrhage or internal bleeding.',
    recommendation: 'Avoid co-prescription. Use Paracetamol for analgesia; monitor INR closely if co-therapy is mandatory.',
  },
  {
    drug1Keywords: ['ciprofloxacin', 'norfloxacin'],
    drug2Keywords: ['theophylline', 'aminophylline'],
    severity: 'MAJOR',
    mechanism: 'CYP1A2 enzyme inhibition causing toxic accumulation of theophylline.',
    clinicalConsequence: 'Theophylline toxicity: cardiac arrhythmias, seizures, and intractable nausea.',
    recommendation: 'Switch antimicrobial to Azithromycin or reduce theophylline dose by 50% with serum level monitoring.',
  },
  {
    drug1Keywords: ['metformin'],
    drug2Keywords: ['contrast', 'iodinated', 'iopamidol', 'iohexol'],
    severity: 'MAJOR',
    mechanism: 'Contrast-induced acute nephropathy reduces metformin clearance.',
    clinicalConsequence: 'High risk of fatal Metformin-associated Lactic Acidosis (MALA).',
    recommendation: 'Withhold Metformin 48 hours prior to contrast imaging and re-evaluate eGFR before resuming.',
  },
  {
    drug1Keywords: ['ramipril', 'enalapril', 'lisinopril', 'telmisartan', 'losartan'],
    drug2Keywords: ['spironolactone', 'eplerenone', 'potassium'],
    severity: 'MAJOR',
    mechanism: 'Concurrent inhibition of aldosterone with potassium-sparing action.',
    clinicalConsequence: 'Severe life-threatening Hyperkalemia (>6.5 mEq/L) and fatal ventricular arrhythmias.',
    recommendation: 'Check baseline serum potassium and creatinine within 5 days of initiation.',
  },
  {
    drug1Keywords: ['clopidogrel'],
    drug2Keywords: ['omeprazole', 'esomeprazole'],
    severity: 'MODERATE',
    mechanism: 'CYP2C19 competitive inhibition prevents biotransformation of clopidogrel to active metabolite.',
    clinicalConsequence: 'Attenuated antiplatelet protection increasing secondary ischemic stroke / stent thrombosis risk.',
    recommendation: 'Switch gastroprotective agent to Pantoprazole or Famotidine (minimal CYP2C19 interaction).',
  },
  {
    drug1Keywords: ['sildenafil', 'tadalafil'],
    drug2Keywords: ['nitroglycerin', 'isosorbide', 'mononitrate', 'sorbitrate'],
    severity: 'MAJOR',
    mechanism: 'Synergistic cGMP accumulation causing profound systemic vasodilation.',
    clinicalConsequence: 'Catastrophic refractory hypotension, coronary hypoperfusion, and cardiovascular collapse.',
    recommendation: 'Absolute contraindication. Never administer nitrates within 24–48 hours of PDE5 inhibitors.',
  },
  {
    drug1Keywords: ['atorvastatin', 'simvastatin'],
    drug2Keywords: ['clarithromycin', 'erythromycin', 'itraconazole'],
    severity: 'MAJOR',
    mechanism: 'Potent CYP3A4 inhibition elevates statin plasma concentration 5-fold.',
    clinicalConsequence: 'Acute Rhabdomyolysis with massive myoglobinuria and acute renal failure.',
    recommendation: 'Temporarily pause statin during antibiotic course or substitute with Rosuvastatin (CYP2C9 pathway).',
  }
];

export const clinicalSafetyEngine = {
  /**
   * Evaluates candidate medications against known patient allergies and existing medications
   */
  evaluatePrescriptionSafety(
    patientAllergies: string[] | string | undefined,
    currentPrescriptions: string[],
    newMedicationName: string
  ): ClinicalSafetyReport {
    const allergyAlerts: AllergyAlert[] = [];
    const ddiAlerts: DdiAlert[] = [];

    const normNewMed = newMedicationName.toLowerCase().trim();
    if (!normNewMed) {
      return { hasAlert: false, allergyAlerts: [], ddiAlerts: [] };
    }

    // 1. Evaluate Allergies
    const allergiesList: string[] = Array.isArray(patientAllergies)
      ? patientAllergies
      : typeof patientAllergies === 'string'
      ? patientAllergies.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : [];

    for (const allergy of allergiesList) {
      const allergyKey = Object.keys(ALLERGY_MAP).find(k => allergy.includes(k) || k.includes(allergy));
      if (allergyKey) {
        const entry = ALLERGY_MAP[allergyKey];
        const isMatched = entry.triggers.some(trigger => normNewMed.includes(trigger));
        if (isMatched) {
          allergyAlerts.push({
            substance: allergy,
            matchedMedication: newMedicationName,
            severity: 'CRITICAL',
            reaction: entry.reaction,
            recommendation: `Patient has documented allergy to "${allergy}". Recommended alternatives: ${entry.alternatives}`,
          });
        }
      } else if (normNewMed.includes(allergy) || allergy.includes(normNewMed)) {
        allergyAlerts.push({
          substance: allergy,
          matchedMedication: newMedicationName,
          severity: 'CRITICAL',
          reaction: 'Documented hypersensitivity reaction',
          recommendation: `Patient has recorded intolerance to ${allergy}. Please verify clinical indication.`,
        });
      }
    }

    // 2. Evaluate Drug-Drug Interactions (against existing prescribed drugs)
    for (const existingMed of currentPrescriptions) {
      const normExisting = existingMed.toLowerCase().trim();
      if (!normExisting || normExisting === normNewMed) continue;

      for (const rule of DDI_RULES) {
        const matches1 = rule.drug1Keywords.some(k => normNewMed.includes(k)) &&
                         rule.drug2Keywords.some(k => normExisting.includes(k));
        const matches2 = rule.drug2Keywords.some(k => normNewMed.includes(k)) &&
                         rule.drug1Keywords.some(k => normExisting.includes(k));

        if (matches1 || matches2) {
          ddiAlerts.push({
            drugA: newMedicationName,
            drugB: existingMed,
            severity: rule.severity,
            mechanism: rule.mechanism,
            clinicalConsequence: rule.clinicalConsequence,
            recommendation: rule.recommendation,
          });
        }
      }
    }

    return {
      hasAlert: allergyAlerts.length > 0 || ddiAlerts.length > 0,
      allergyAlerts,
      ddiAlerts,
    };
  }
};
