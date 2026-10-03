export type TriageBand = 'RED' | 'YELLOW' | 'GREEN';

export interface TriageQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface TriageAssessment {
  triageBand: TriageBand;
  bandLabel: string;
  urgencyDescription: string;
  recommendedDepartment: string;
  recommendedDoctorName: string;
  recommendedDoctorSpecialty: string;
  suggestedChamber: string;
  possibleCauses: string[];
  selfCareAdvice: string;
  isEmergency: boolean;
  appointmentType: 'Emergency' | 'First Visit' | 'Routine Checkup';
}

export interface TriageMessage {
  id: string;
  sender: 'ai' | 'patient';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  assessment?: TriageAssessment;
  isBookingConfirmed?: boolean;
  confirmedToken?: string;
}

export const triageBotService = {
  /**
   * Evaluates the initial complaint and returns appropriate follow-up questions
   */
  generateInitialClarifications(complaint: string): { questions: TriageQuestion[]; initialDept: string } {
    const text = complaint.toLowerCase();

    // Abdominal / Gastrointestinal
    if (text.includes('stomach') || text.includes('abdom') || text.includes('belly') || text.includes('burn') || text.includes('gastric') || text.includes('nausea') || text.includes('vomit')) {
      return {
        initialDept: 'Gastroenterology',
        questions: [
          {
            id: 'severity',
            question: 'How severe is the pain on a scale of 1 to 10?',
            options: ['Mild (1 - 3)', 'Moderate (4 - 6)', 'Severe (7 - 9)', 'Unbearable (10/10)'],
          },
          {
            id: 'duration',
            question: 'How long have you been experiencing these symptoms?',
            options: ['Since this morning (< 6 hrs)', '1 to 2 days', '3 to 7 days', 'More than a week'],
          },
          {
            id: 'redflags',
            question: 'Do you notice any of these warning signs?',
            options: ['Persistent vomiting or dizziness', 'Black or bloody stools', 'High fever (> 101°F)', 'None of these'],
          },
        ],
      };
    }

    // Chest / Cardiac / Shortness of Breath
    if (text.includes('chest') || text.includes('heart') || text.includes('breath') || text.includes('tightness') || text.includes('palpitat')) {
      return {
        initialDept: 'Cardiology Care',
        questions: [
          {
            id: 'pain_type',
            question: 'How would you describe the chest discomfort?',
            options: ['Heavy pressure / squeezing', 'Sharp stabbing on breathing', 'Burning sensation (heartburn)', 'Mild flutter / palpitations'],
          },
          {
            id: 'radiation',
            question: 'Does the pain spread anywhere else?',
            options: ['Radiates to left arm, neck, or jaw', 'Radiates to upper back', 'Stays in center of chest only', 'No radiation'],
          },
          {
            id: 'associated',
            question: 'Are you experiencing sweating, extreme dizziness, or nausea?',
            options: ['Yes, severe sweating and dizziness', 'Mild nausea only', 'No associated symptoms'],
          },
        ],
      };
    }

    // Headache / Neurological
    if (text.includes('headache') || text.includes('migraine') || text.includes('head') || text.includes('dizz') || text.includes('vision') || text.includes('numb')) {
      return {
        initialDept: 'Neurology',
        questions: [
          {
            id: 'onset',
            question: 'How quickly did this headache develop?',
            options: ['Sudden "thunderclap" worst headache of life', 'Gradual buildup over hours', 'Frequent throbbing episode', 'Mild dull pressure'],
          },
          {
            id: 'neurological',
            question: 'Do you have facial weakness, speech difficulty, or arm numbness?',
            options: ['Yes, sudden numbness or slurred speech', 'Visual aura / sensitivity to light', 'None of these'],
          },
          {
            id: 'fever_neck',
            question: 'Is there high fever or neck stiffness?',
            options: ['Yes, fever with stiff neck', 'Mild fever only', 'No fever or stiffness'],
          },
        ],
      };
    }

    // Respiratory / Cough / Cold / Throat
    if (text.includes('cough') || text.includes('cold') || text.includes('fever') || text.includes('throat') || text.includes('flu') || text.includes('phlegm')) {
      return {
        initialDept: 'General Medicine / Pulmonology',
        questions: [
          {
            id: 'duration',
            question: 'How many days has the fever or cough lasted?',
            options: ['1 to 2 days', '3 to 5 days', 'More than 7 days', 'More than 2 weeks'],
          },
          {
            id: 'breathing',
            question: 'Are you having difficulty breathing or shortness of breath while resting?',
            options: ['Yes, breathless even while sitting', 'Only when walking/exerting', 'No breathing difficulty'],
          },
          {
            id: 'temp',
            question: 'What is your recorded body temperature?',
            options: ['Above 102°F (38.9°C)', 'Between 99°F - 101°F', 'Normal / Haven\'t measured'],
          },
        ],
      };
    }

    // Bone / Joint / Orthopedic
    if (text.includes('bone') || text.includes('joint') || text.includes('knee') || text.includes('back') || text.includes('fall') || text.includes('fracture') || text.includes('ankle') || text.includes('sprain')) {
      return {
        initialDept: 'Orthopedics & Joint Care',
        questions: [
          {
            id: 'cause',
            question: 'Did this pain start after a direct injury, fall, or accident?',
            options: ['Yes, sudden fall or twist', 'Gradual wear and tear over weeks', 'Woke up with sudden stiffness'],
          },
          {
            id: 'weight_bearing',
            question: 'Are you able to put weight or walk on the affected limb?',
            options: ['Cannot bear any weight at all', 'Can limp with moderate pain', 'Can walk normally with mild ache'],
          },
          {
            id: 'deformity',
            question: 'Is there noticeable rapid swelling, deformity, or numbness?',
            options: ['Severe swelling or visible deformity', 'Mild swelling only', 'No swelling'],
          },
        ],
      };
    }

    // General Fallback
    return {
      initialDept: 'General Medicine',
      questions: [
        {
          id: 'severity',
          question: 'How would you rate the overall intensity of your discomfort?',
          options: ['Mild (Manageable at home)', 'Moderate (Affecting daily routine)', 'Severe (Disabling)'],
        },
        {
          id: 'duration',
          question: 'How long have you felt unwell?',
          options: ['Less than 24 hours', '2 to 4 days', 'More than 1 week'],
        },
        {
          id: 'fever',
          question: 'Do you have high fever, vomiting, or breathing trouble?',
          options: ['Yes, one or more of these', 'None of these'],
        },
      ],
    };
  },

  /**
   * Final clinical rule engine evaluation to compute Triage Band and Routing
   */
  evaluateTriage(
    complaint: string,
    answers: Record<string, string>
  ): TriageAssessment {
    const raw = (complaint + ' ' + Object.values(answers).join(' ')).toLowerCase();

    // 1. RED BAND CHECKS (Immediate Critical Emergency)
    const isRed =
      raw.includes('thunderclap') ||
      raw.includes('unbearable (10/10)') ||
      raw.includes('radiates to left arm') ||
      raw.includes('sweating and dizziness') ||
      raw.includes('sudden numbness or slurred speech') ||
      raw.includes('breathless even while sitting') ||
      raw.includes('black or bloody stools') ||
      raw.includes('fever with stiff neck') ||
      raw.includes('visible deformity') ||
      (raw.includes('severe') && raw.includes('dizzy') && raw.includes('vomit'));

    if (isRed) {
      return {
        triageBand: 'RED',
        bandLabel: 'CRITICAL / IMMEDIATE EMERGENCY',
        urgencyDescription: 'High risk of acute systemic or cardiovascular compromise. Immediate physician evaluation required.',
        recommendedDepartment: 'Emergency Trauma & Resuscitation Bay',
        recommendedDoctorName: 'Dr. Emergency Triage Physician (On Duty)',
        recommendedDoctorSpecialty: 'Emergency Medicine',
        suggestedChamber: 'Trauma Bay 01',
        possibleCauses: [
          'Acute Coronary Syndrome (Unstable Angina / MI)',
          'Upper Gastrointestinal Hemorrhage',
          'Acute Cerebrovascular Event (Stroke / TIA)',
          'Severe Systemic Sepsis / Anaphylactoid Shock',
        ],
        selfCareAdvice: 'DO NOT DRIVE YOURSELF. Sit upright, rest quietly, and proceed immediately to the Emergency Entrance. Our trauma team has been notified.',
        isEmergency: true,
        appointmentType: 'Emergency',
      };
    }

    // 2. YELLOW BAND CHECKS (Urgent Priority Care - Same Day)
    const isYellow =
      raw.includes('moderate (4 - 6)') ||
      raw.includes('severe (7 - 9)') ||
      raw.includes('since this morning') ||
      raw.includes('1 to 2 days') ||
      raw.includes('persistent vomiting') ||
      raw.includes('above 102') ||
      raw.includes('cannot bear any weight') ||
      raw.includes('burning') ||
      raw.includes('stomach') ||
      raw.includes('nausea') ||
      raw.includes('migraine');

    if (isYellow) {
      if (raw.includes('stomach') || raw.includes('burn') || raw.includes('vomit') || raw.includes('abdom') || raw.includes('gastric')) {
        return {
          triageBand: 'YELLOW',
          bandLabel: 'URGENT MEDICAL PRIORITY',
          urgencyDescription: 'Active acute symptoms requiring same-day clinical assessment, diagnostic blood work, or ultrasonography.',
          recommendedDepartment: 'Department of Gastroenterology',
          recommendedDoctorName: 'Dr. Rajesh Mehta, MD, DM',
          recommendedDoctorSpecialty: 'Senior Gastroenterologist',
          suggestedChamber: 'OPD Chamber 204 (Tower A)',
          possibleCauses: [
            'Acute Peptic Ulcer Disease / Gastritis',
            'Gastroesophageal Reflux (GERD) with mucosal erosion',
            'Biliary Colic / Early Cholecystitis',
            'Acute Gastroenteritis with dehydration risk',
          ],
          selfCareAdvice: 'Avoid spicy, oily, acidic foods and NSAID painkillers like Ibuprofen/Aspirin. Sip small amounts of room-temperature water or oral rehydration fluids.',
          isEmergency: false,
          appointmentType: 'First Visit',
        };
      }

      if (raw.includes('chest') || raw.includes('heart') || raw.includes('breath') || raw.includes('palpitat')) {
        return {
          triageBand: 'YELLOW',
          bandLabel: 'URGENT CARDIAC EVALUATION',
          urgencyDescription: 'Prompt clinical ECG and biomarker assessment required to rule out acute ischemia.',
          recommendedDepartment: 'Department of Cardiology Care',
          recommendedDoctorName: 'Dr. Sarah Jenkins, MD, FACC',
          recommendedDoctorSpecialty: 'Cardiologist',
          suggestedChamber: 'Cardiology Clinic 301',
          possibleCauses: ['Atypical Angina Pectoris', 'Costochondritis / Musculoskeletal Strain', 'Gastroesophageal Spasm'],
          selfCareAdvice: 'Rest in a well-ventilated room. Avoid exertion or heavy meals.',
          isEmergency: false,
          appointmentType: 'First Visit',
        };
      }

      if (raw.includes('head') || raw.includes('dizz') || raw.includes('vision')) {
        return {
          triageBand: 'YELLOW',
          bandLabel: 'URGENT NEUROLOGICAL REVIEW',
          urgencyDescription: 'Acute persistent headache or vertigo requiring neurological cranial nerve examination.',
          recommendedDepartment: 'Department of Neurology',
          recommendedDoctorName: 'Dr. Alan Vance, MD, DM',
          recommendedDoctorSpecialty: 'Neurologist',
          suggestedChamber: 'Neurology Suite 402',
          possibleCauses: ['Acute Migraine with Aura', 'Tension-type Headache', 'Vestibular Vertigo / Labyrinthitis'],
          selfCareAdvice: 'Rest in a quiet, dark room. Avoid screen exposure and drink adequate fluids.',
          isEmergency: false,
          appointmentType: 'First Visit',
        };
      }

      // Default Yellow
      return {
        triageBand: 'YELLOW',
        bandLabel: 'URGENT MEDICAL PRIORITY',
        urgencyDescription: 'Significant symptom burden requiring timely physician review today.',
        recommendedDepartment: 'Department of General Medicine',
        recommendedDoctorName: 'Dr. James Wilson, MD',
        recommendedDoctorSpecialty: 'Internal Medicine Specialist',
        suggestedChamber: 'Chamber 101 (Ground Floor)',
        possibleCauses: ['Acute Viral Syndrome with Pyrexia', 'Bacterial Pharyngitis / Sinusitis', 'Acute Dehydration'],
        selfCareAdvice: 'Maintain hydration, track temperature, and avoid strenuous physical activity.',
        isEmergency: false,
        appointmentType: 'First Visit',
      };
    }

    // 3. GREEN BAND (Routine Outpatient Consultation)
    return {
      triageBand: 'GREEN',
      bandLabel: 'ROUTINE OUTPATIENT CARE',
      urgencyDescription: 'Stable, non-emergency symptoms appropriate for standard clinic booking or telemedicine review.',
      recommendedDepartment: 'Department of General Medicine',
      recommendedDoctorName: 'Dr. James Wilson, MD',
      recommendedDoctorSpecialty: 'Internal Medicine Specialist',
      suggestedChamber: 'Chamber 101 (Ground Floor)',
      possibleCauses: ['Mild seasonal viral syndrome', 'Tension-related fatigue', 'Routine health checkup requirement'],
      selfCareAdvice: 'Adequate rest, balanced nutrition, and hydration. Monitor symptoms over the next 48 hours.',
      isEmergency: false,
      appointmentType: 'Routine Checkup',
    };
  }
};
