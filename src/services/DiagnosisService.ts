import type { ProcessedSymptom, Diagnosis, ModelType } from '../types';

interface ConditionPattern {
  condition: string;
  symptoms: string[];
  minMatches: number;
  confidence: number;
  recommendations: string[];
  shouldSeeDoctor: boolean;
  severity: 'low' | 'medium' | 'high';
  urgent: boolean;
}

class DiagnosisService {
  private models: Map<ModelType, (symptoms: ProcessedSymptom[]) => Diagnosis>;
  private conditions: ConditionPattern[];

  constructor() {
    this.models = new Map();
    this.initializeModels();
    this.initializeConditions();
  }

  private initializeConditions() {
    this.conditions = [
      {
        condition: "Common Cold",
        symptoms: ['runny', 'nose', 'sore', 'throat', 'sneezing', 'cough', 'mild', 'fever'],
        minMatches: 3,
        confidence: 0.85,
        recommendations: [
          "Rest and get plenty of sleep",
          "Stay hydrated with water and warm liquids",
          "Use over-the-counter cold medications if needed",
          "Try saline nasal drops or sprays",
          "Use a humidifier to add moisture to the air"
        ],
        shouldSeeDoctor: false,
        severity: 'low',
        urgent: false
      },
      {
        condition: "Influenza (Flu)",
        symptoms: ['fever', 'chills', 'muscle', 'aches', 'fatigue', 'sore', 'throat', 'cough'],
        minMatches: 4,
        confidence: 0.8,
        recommendations: [
          "Rest in bed and avoid physical exertion",
          "Take fever reducers like acetaminophen",
          "Stay hydrated with water and clear broths",
          "Use a humidifier to ease breathing",
          "Consider antiviral medications if caught early"
        ],
        shouldSeeDoctor: true,
        severity: 'medium',
        urgent: false
      },
      {
        condition: "Possible COVID-19",
        symptoms: ['fever', 'cough', 'shortness', 'breath', 'taste', 'smell', 'loss', 'fatigue'],
        minMatches: 3,
        confidence: 0.75,
        recommendations: [
          "Isolate immediately to protect others",
          "Get tested for COVID-19",
          "Monitor your oxygen levels if possible",
          "Stay hydrated and rest",
          "Take fever reducers if needed"
        ],
        shouldSeeDoctor: true,
        severity: 'high',
        urgent: true
      },
      {
        condition: "Seasonal Allergies",
        symptoms: ['sneezing', 'watery', 'eyes', 'itchy', 'runny', 'nose', 'cough'],
        minMatches: 3,
        confidence: 0.9,
        recommendations: [
          "Take antihistamines as recommended",
          "Avoid known allergens when possible",
          "Use air purifiers indoors",
          "Try nasal irrigation with saline",
          "Keep windows closed during high pollen times"
        ],
        shouldSeeDoctor: false,
        severity: 'low',
        urgent: false
      },
      {
        condition: "Migraine",
        symptoms: ['headache', 'throbbing', 'light', 'sound', 'sensitive', 'nausea', 'visual'],
        minMatches: 3,
        confidence: 0.85,
        recommendations: [
          "Rest in a quiet, dark room",
          "Apply cold or warm compresses to your head or neck",
          "Stay hydrated and avoid triggers",
          "Try over-the-counter migraine medications",
          "Practice relaxation techniques"
        ],
        shouldSeeDoctor: false,
        severity: 'medium',
        urgent: false
      },
      {
        condition: "Gastroenteritis",
        symptoms: ['nausea', 'vomiting', 'stomach', 'abdominal', 'pain', 'diarrhea'],
        minMatches: 3,
        confidence: 0.8,
        recommendations: [
          "Stay hydrated with clear fluids",
          "Try the BRAT diet (Bananas, Rice, Applesauce, Toast)",
          "Avoid dairy and fatty foods",
          "Rest your stomach for a few hours after vomiting",
          "Gradually return to normal diet"
        ],
        shouldSeeDoctor: false,
        severity: 'medium',
        urgent: false
      },
      {
        condition: "Possible Heart Issue",
        symptoms: ['chest', 'pain', 'shortness', 'breath', 'dizzy', 'lightheaded', 'fatigue'],
        minMatches: 2,
        confidence: 0.7,
        recommendations: [
          "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION",
          "Call emergency services (911)",
          "Sit or lie down to prevent falls",
          "Take prescribed heart medications if any",
          "Stay calm and take slow breaths"
        ],
        shouldSeeDoctor: true,
        severity: 'high',
        urgent: true
      },
      {
        condition: "Skin Condition",
        symptoms: ['rash', 'itchy', 'bumps', 'blisters', 'swelling', 'dry', 'peeling'],
        minMatches: 2,
        confidence: 0.75,
        recommendations: [
          "Avoid scratching the affected area",
          "Apply cool compresses for relief",
          "Use over-the-counter hydrocortisone cream",
          "Take an antihistamine if itching is severe",
          "Keep the area clean and dry"
        ],
        shouldSeeDoctor: false,
        severity: 'low',
        urgent: false
      },
      {
        condition: "Dehydration",
        symptoms: ['thirsty', 'dark', 'urine', 'fatigue', 'dizzy', 'mouth', 'dry'],
        minMatches: 3,
        confidence: 0.85,
        recommendations: [
          "Drink water or sports drinks slowly",
          "Avoid caffeine and alcohol",
          "Eat foods high in water content",
          "Rest in a cool environment",
          "Monitor urine color - should be light yellow"
        ],
        shouldSeeDoctor: false,
        severity: 'medium',
        urgent: false
      }
    ];
  }

  private initializeModels() {
    this.models.set('NLP', this.nlpModel.bind(this));
    this.models.set('ML/DL', this.mlModel.bind(this));
    this.models.set('Decision Trees', this.decisionTreeModel.bind(this));
    this.models.set('SVM', this.svmModel.bind(this));
  }

  private matchSymptoms(relevantTerms: string[], condition: ConditionPattern): number {
    return condition.symptoms.filter(symptom => 
      relevantTerms.some(term => term.includes(symptom) || symptom.includes(term))
    ).length;
  }

  private nlpModel(symptoms: ProcessedSymptom[]): Diagnosis {
    const relevantTerms = symptoms.flatMap(s => s.relevantTerms);
    
    // Find the best matching condition
    let bestMatch: ConditionPattern | null = null;
    let highestMatchCount = 0;

    for (const condition of this.conditions) {
      const matchCount = this.matchSymptoms(relevantTerms, condition);
      if (matchCount >= condition.minMatches && matchCount > highestMatchCount) {
        bestMatch = condition;
        highestMatchCount = matchCount;
      }
    }

    if (bestMatch) {
      return {
        id: Date.now().toString(),
        condition: bestMatch.condition,
        confidence: bestMatch.confidence,
        recommendations: bestMatch.recommendations,
        shouldSeeDoctor: bestMatch.shouldSeeDoctor,
        severity: bestMatch.severity,
        timestamp: new Date().toISOString(),
        symptoms
      };
    }

    // Default response if no condition matches
    return {
      id: Date.now().toString(),
      condition: "Unspecified Condition",
      confidence: 0.5,
      recommendations: [
        "Monitor your symptoms",
        "Rest and stay hydrated",
        "Consider consulting a healthcare provider if symptoms persist or worsen",
        "Keep track of any changes in symptoms",
        "Maintain good hygiene practices"
      ],
      shouldSeeDoctor: true,
      severity: 'medium',
      timestamp: new Date().toISOString(),
      symptoms
    };
  }

  private mlModel(symptoms: ProcessedSymptom[]): Diagnosis {
    return this.nlpModel(symptoms);
  }

  private decisionTreeModel(symptoms: ProcessedSymptom[]): Diagnosis {
    return this.nlpModel(symptoms);
  }

  private svmModel(symptoms: ProcessedSymptom[]): Diagnosis {
    return this.nlpModel(symptoms);
  }

  public getDiagnosis(symptoms: ProcessedSymptom[]): Diagnosis {
    return this.nlpModel(symptoms);
  }
}

export { DiagnosisService }