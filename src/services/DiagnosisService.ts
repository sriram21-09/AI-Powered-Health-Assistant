import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Diagnosis, ConditionResult } from '../types';

// ===== Gemini AI Configuration =====

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are a medical triage AI assistant. Your role is to analyze user-reported symptoms and provide preliminary health assessments.

CRITICAL RULES:
1. You are NOT a doctor. Always recommend consulting a healthcare professional.
2. For emergency symptoms (chest pain, difficulty breathing, severe bleeding, stroke symptoms, suicidal thoughts), immediately flag as EMERGENCY urgency.
3. Be empathetic and clear in your communication.
4. Provide multiple possible conditions ranked by likelihood.
5. Never provide definitive diagnoses — only possibilities.

You MUST respond in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "condition": "Most likely condition name",
  "confidence": 0.85,
  "possibleConditions": [
    {"name": "Condition 1", "confidence": 0.85, "description": "Brief explanation of why this condition matches"},
    {"name": "Condition 2", "confidence": 0.65, "description": "Brief explanation"},
    {"name": "Condition 3", "confidence": 0.45, "description": "Brief explanation"}
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4",
    "Specific actionable recommendation 5"
  ],
  "shouldSeeDoctor": true,
  "severity": "medium",
  "urgencyLevel": "soon",
  "followUpQuestions": [
    "Question the user should consider 1",
    "Question 2"
  ],
  "lifestyleTips": [
    "General health tip relevant to their condition 1",
    "Tip 2",
    "Tip 3"
  ]
}

Rules for the JSON fields:
- "severity": must be one of "low", "medium", "high"
- "urgencyLevel": must be one of "routine", "soon", "urgent", "emergency"
- "confidence": a number between 0.0 and 1.0
- "possibleConditions": provide 2-4 possible conditions, sorted by confidence (highest first)
- "recommendations": provide 4-6 specific, actionable recommendations
- "followUpQuestions": provide 2-3 questions the user should think about
- "lifestyleTips": provide 2-3 general wellness tips related to their symptoms`;

// ===== Fallback Condition Database (used when no API key) =====

interface FallbackCondition {
  condition: string;
  symptoms: string[];
  minMatches: number;
  confidence: number;
  recommendations: string[];
  shouldSeeDoctor: boolean;
  severity: 'low' | 'medium' | 'high';
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency';
  description: string;
  followUpQuestions: string[];
  lifestyleTips: string[];
}

const FALLBACK_CONDITIONS: FallbackCondition[] = [
  {
    condition: "Common Cold",
    symptoms: ['runny', 'nose', 'sore', 'throat', 'sneezing', 'cough', 'congestion'],
    minMatches: 3,
    confidence: 0.82,
    recommendations: [
      "Rest and get plenty of sleep to help your body recover",
      "Stay hydrated with water, herbal teas, and warm broths",
      "Use over-the-counter cold medications for symptom relief",
      "Try saline nasal spray to relieve congestion",
      "Use a humidifier to add moisture to indoor air"
    ],
    shouldSeeDoctor: false,
    severity: 'low',
    urgencyLevel: 'routine',
    description: "A viral infection of the upper respiratory tract causing nasal congestion, sore throat, and mild cough.",
    followUpQuestions: [
      "Have your symptoms lasted more than 10 days?",
      "Do you have a high fever above 103°F (39.4°C)?",
      "Are you experiencing any shortness of breath?"
    ],
    lifestyleTips: [
      "Wash your hands frequently to prevent spreading the virus",
      "Vitamin C and zinc may help reduce cold duration",
      "Avoid close contact with others until symptoms improve"
    ]
  },
  {
    condition: "Influenza (Flu)",
    symptoms: ['fever', 'chills', 'muscle', 'aches', 'fatigue', 'cough', 'headache', 'body'],
    minMatches: 3,
    confidence: 0.78,
    recommendations: [
      "Rest in bed and avoid strenuous physical activity",
      "Take fever reducers like acetaminophen or ibuprofen as directed",
      "Stay well-hydrated with water, clear broths, and electrolyte drinks",
      "Consider antiviral medications if within 48 hours of symptom onset",
      "Monitor your temperature regularly"
    ],
    shouldSeeDoctor: true,
    severity: 'medium',
    urgencyLevel: 'soon',
    description: "A contagious respiratory illness caused by influenza viruses, typically more severe than the common cold.",
    followUpQuestions: [
      "When did your symptoms first appear?",
      "Have you been in contact with anyone who has the flu?",
      "Do you have any chronic health conditions?"
    ],
    lifestyleTips: [
      "Get an annual flu vaccine to reduce future risk",
      "Practice good respiratory hygiene — cover coughs and sneezes",
      "Strengthen your immune system with regular exercise and balanced nutrition"
    ]
  },
  {
    condition: "Seasonal Allergies",
    symptoms: ['sneezing', 'watery', 'eyes', 'itchy', 'runny', 'nose', 'congestion'],
    minMatches: 3,
    confidence: 0.88,
    recommendations: [
      "Take antihistamines as recommended by a pharmacist",
      "Avoid known allergens and check daily pollen counts",
      "Use air purifiers with HEPA filters indoors",
      "Try nasal irrigation with saline solution",
      "Keep windows closed during high pollen seasons"
    ],
    shouldSeeDoctor: false,
    severity: 'low',
    urgencyLevel: 'routine',
    description: "An immune system response to airborne allergens like pollen, dust mites, or pet dander.",
    followUpQuestions: [
      "Do your symptoms worsen during specific seasons?",
      "Have you identified any specific triggers?",
      "Do you have a family history of allergies or asthma?"
    ],
    lifestyleTips: [
      "Shower and change clothes after spending time outdoors",
      "Consider allergy testing to identify specific triggers",
      "Local honey may help build tolerance to local pollens"
    ]
  },
  {
    condition: "Migraine",
    symptoms: ['headache', 'throbbing', 'light', 'sound', 'sensitive', 'nausea', 'visual', 'migraine'],
    minMatches: 2,
    confidence: 0.80,
    recommendations: [
      "Rest in a quiet, dark room and minimize sensory stimulation",
      "Apply a cold or warm compress to your head or neck",
      "Take over-the-counter migraine medication early in the attack",
      "Stay hydrated and avoid skipping meals",
      "Track your triggers in a headache diary"
    ],
    shouldSeeDoctor: false,
    severity: 'medium',
    urgencyLevel: 'routine',
    description: "A neurological condition causing intense, often one-sided headaches with possible nausea and sensitivity to light/sound.",
    followUpQuestions: [
      "How often do you experience these headaches?",
      "Do you notice any visual disturbances before the headache?",
      "Have you identified any triggers (stress, food, sleep changes)?"
    ],
    lifestyleTips: [
      "Maintain a regular sleep schedule to prevent episodes",
      "Practice stress management through meditation or yoga",
      "Regular moderate exercise can help reduce migraine frequency"
    ]
  },
  {
    condition: "Gastroenteritis",
    symptoms: ['nausea', 'vomiting', 'stomach', 'abdominal', 'pain', 'diarrhea', 'cramps'],
    minMatches: 2,
    confidence: 0.80,
    recommendations: [
      "Stay hydrated with small, frequent sips of clear fluids",
      "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast)",
      "Avoid dairy, fatty, and spicy foods until recovered",
      "Rest your stomach for a few hours after vomiting episodes",
      "Consider over-the-counter anti-nausea medication"
    ],
    shouldSeeDoctor: false,
    severity: 'medium',
    urgencyLevel: 'routine',
    description: "Inflammation of the stomach and intestines, commonly caused by viral or bacterial infections.",
    followUpQuestions: [
      "Have you eaten anything unusual in the last 24-48 hours?",
      "Is there blood in your vomit or stool?",
      "Are you able to keep fluids down?"
    ],
    lifestyleTips: [
      "Wash hands thoroughly before eating and after using the restroom",
      "Ensure proper food storage and cooking temperatures",
      "Consider probiotics to support gut health during recovery"
    ]
  },
  {
    condition: "Possible Cardiac Issue",
    symptoms: ['chest', 'pain', 'shortness', 'breath', 'dizzy', 'lightheaded', 'palpitations', 'heartbeat'],
    minMatches: 2,
    confidence: 0.70,
    recommendations: [
      "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION — Call 112 / 102 or your local emergency number",
      "Sit or lie down immediately to prevent falls",
      "Take aspirin if not allergic (chew one regular-strength tablet)",
      "Loosen any tight clothing",
      "Do NOT drive yourself — wait for emergency services"
    ],
    shouldSeeDoctor: true,
    severity: 'high',
    urgencyLevel: 'emergency',
    description: "Symptoms suggestive of a possible cardiac event. This requires immediate medical evaluation.",
    followUpQuestions: [
      "Is the chest pain crushing, squeezing, or pressure-like?",
      "Does the pain radiate to your arm, jaw, or back?",
      "Do you have a history of heart disease?"
    ],
    lifestyleTips: [
      "Regular cardiovascular exercise strengthens the heart",
      "Maintain a heart-healthy diet low in saturated fats",
      "Know your family history of heart disease"
    ]
  },
  {
    condition: "Anxiety or Stress Response",
    symptoms: ['anxiety', 'anxious', 'panic', 'nervous', 'stress', 'worried', 'racing', 'heartbeat', 'insomnia'],
    minMatches: 2,
    confidence: 0.75,
    recommendations: [
      "Practice deep breathing: inhale for 4 counts, hold for 7, exhale for 8",
      "Try grounding techniques — focus on 5 things you can see, 4 you can touch, etc.",
      "Limit caffeine and alcohol intake",
      "Consider speaking with a mental health professional",
      "Regular physical exercise can significantly reduce anxiety symptoms"
    ],
    shouldSeeDoctor: true,
    severity: 'medium',
    urgencyLevel: 'soon',
    description: "Physical symptoms triggered by anxiety or chronic stress, which can mimic other medical conditions.",
    followUpQuestions: [
      "Have you been under unusual stress recently?",
      "Do these symptoms interfere with your daily activities?",
      "Have you experienced panic attacks before?"
    ],
    lifestyleTips: [
      "Establish a regular mindfulness or meditation practice",
      "Maintain a consistent sleep schedule of 7-9 hours",
      "Journaling can help process anxious thoughts"
    ]
  },
  {
    condition: "Dehydration",
    symptoms: ['thirsty', 'dark', 'urine', 'fatigue', 'dizzy', 'mouth', 'dry', 'dehydrated'],
    minMatches: 2,
    confidence: 0.83,
    recommendations: [
      "Drink water or oral rehydration solutions slowly and steadily",
      "Avoid caffeine and alcohol as they worsen dehydration",
      "Eat water-rich foods like watermelon, cucumbers, and oranges",
      "Rest in a cool, shaded environment",
      "Monitor urine color — aim for pale yellow"
    ],
    shouldSeeDoctor: false,
    severity: 'medium',
    urgencyLevel: 'routine',
    description: "A condition where the body loses more fluids than it takes in, affecting normal body functions.",
    followUpQuestions: [
      "Have you been vomiting or had diarrhea recently?",
      "Have you been exercising heavily or in hot weather?",
      "How much water have you been drinking today?"
    ],
    lifestyleTips: [
      "Carry a water bottle and aim for 8 glasses per day",
      "Increase fluid intake during exercise and hot weather",
      "Set reminders to drink water regularly throughout the day"
    ]
  },
  {
    condition: "Skin Condition (Dermatitis)",
    symptoms: ['rash', 'itchy', 'bumps', 'blisters', 'swelling', 'dry', 'peeling', 'skin', 'hives'],
    minMatches: 2,
    confidence: 0.75,
    recommendations: [
      "Avoid scratching the affected area to prevent infection",
      "Apply cool compresses for itch relief",
      "Use over-the-counter hydrocortisone cream (1%) for mild cases",
      "Take an oral antihistamine if itching is severe",
      "Use fragrance-free moisturizers to protect the skin barrier"
    ],
    shouldSeeDoctor: false,
    severity: 'low',
    urgencyLevel: 'routine',
    description: "An inflammatory skin reaction that may be caused by allergens, irritants, or underlying conditions.",
    followUpQuestions: [
      "Have you been exposed to any new products, soaps, or detergents?",
      "Is the rash spreading or getting worse?",
      "Do you have a history of eczema or psoriasis?"
    ],
    lifestyleTips: [
      "Use hypoallergenic and fragrance-free skincare products",
      "Keep skin moisturized, especially in dry weather",
      "Wear loose, breathable cotton clothing"
    ]
  },
  {
    condition: "Back Pain",
    symptoms: ['back', 'pain', 'stiff', 'stiffness', 'muscle', 'lower', 'spine'],
    minMatches: 2,
    confidence: 0.78,
    recommendations: [
      "Apply ice for the first 48 hours, then switch to heat therapy",
      "Take over-the-counter pain relievers like ibuprofen or naproxen",
      "Stay active with gentle stretching — avoid prolonged bed rest",
      "Practice proper posture and ergonomic workspace setup",
      "Consider gentle yoga or swimming for rehabilitation"
    ],
    shouldSeeDoctor: false,
    severity: 'medium',
    urgencyLevel: 'routine',
    description: "Musculoskeletal discomfort in the back region, commonly caused by strain, poor posture, or overuse.",
    followUpQuestions: [
      "Did the pain start after a specific injury or activity?",
      "Does the pain radiate down your legs (sciatica)?",
      "Do you have numbness or tingling in your legs?"
    ],
    lifestyleTips: [
      "Strengthen your core muscles to support your spine",
      "Use proper lifting techniques — bend at the knees, not the waist",
      "Take regular breaks from sitting — stand and stretch every 30 minutes"
    ]
  },
];

// ===== DiagnosisService Class =====

class DiagnosisService {
  private genAI: GoogleGenerativeAI | null = null;
  private isGeminiAvailable = false;

  constructor() {
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.isGeminiAvailable = true;
      } catch (err) {
        console.warn('Failed to initialize Gemini AI:', err);
        this.isGeminiAvailable = false;
      }
    }
  }

  /**
   * Returns whether Gemini AI is available.
   */
  public isAIAvailable(): boolean {
    return this.isGeminiAvailable;
  }

  /**
   * Main entry point: analyze symptoms and return a diagnosis.
   */
  public async getDiagnosis(inputText: string, severity: string): Promise<Diagnosis> {
    if (this.isGeminiAvailable && this.genAI) {
      try {
        return await this.geminiDiagnosis(inputText, severity);
      } catch (err) {
        console.error('Gemini AI error, falling back to rule-based:', err);
        return this.fallbackDiagnosis(inputText, severity);
      }
    }
    return this.fallbackDiagnosis(inputText, severity);
  }

  /**
   * Gemini AI-powered diagnosis.
   */
  private async geminiDiagnosis(inputText: string, severity: string): Promise<Diagnosis> {
    const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const userPrompt = `Patient reports the following symptoms (self-reported severity: ${severity}):

"${inputText}"

Analyze these symptoms and provide your assessment in the specified JSON format.`;

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    const responseText = result.response.text();
    
    // Parse JSON from response (handle possible markdown wrapping)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    // Also try to find raw JSON object
    const rawJsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (rawJsonMatch) {
      jsonStr = rawJsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    return {
      id: Date.now().toString(),
      condition: parsed.condition || 'Unspecified',
      confidence: parsed.confidence || 0.5,
      possibleConditions: (parsed.possibleConditions || []).map((c: { name?: string; confidence?: number; description?: string }) => ({
        name: c.name || 'Unknown',
        confidence: c.confidence || 0.5,
        description: c.description || '',
      })),
      recommendations: parsed.recommendations || [],
      shouldSeeDoctor: parsed.shouldSeeDoctor ?? true,
      severity: parsed.severity || 'medium',
      urgencyLevel: parsed.urgencyLevel || 'routine',
      followUpQuestions: parsed.followUpQuestions || [],
      lifestyleTips: parsed.lifestyleTips || [],
      timestamp: new Date().toISOString(),
      symptoms: [],
      inputText,
      aiModel: 'Gemini AI',
    };
  }

  /**
   * Rule-based fallback diagnosis (used when no API key or API fails).
   */
  private fallbackDiagnosis(inputText: string, severity: string): Diagnosis {
    const lowerInput = inputText.toLowerCase();
    const tokens = lowerInput.split(/\s+/);

    // Score each condition
    const scored = FALLBACK_CONDITIONS.map(condition => {
      const matchCount = condition.symptoms.filter(symptom =>
        tokens.some(token => token.includes(symptom) || symptom.includes(token))
      ).length;
      return { condition, matchCount };
    })
      .filter(s => s.matchCount >= s.condition.minMatches)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (scored.length > 0) {
      const best = scored[0].condition;
      const possibleConditions: ConditionResult[] = scored.slice(0, 3).map((s, i) => ({
        name: s.condition.condition,
        confidence: Math.max(0.3, s.condition.confidence - (i * 0.15)),
        description: s.condition.description,
      }));

      // Adjust severity based on user input
      let adjustedSeverity = best.severity;
      if (severity === 'severe' && adjustedSeverity === 'low') adjustedSeverity = 'medium';
      if (severity === 'severe' && adjustedSeverity === 'medium') adjustedSeverity = 'high';

      return {
        id: Date.now().toString(),
        condition: best.condition,
        confidence: best.confidence,
        possibleConditions,
        recommendations: best.recommendations,
        shouldSeeDoctor: best.shouldSeeDoctor,
        severity: adjustedSeverity,
        urgencyLevel: best.urgencyLevel,
        followUpQuestions: best.followUpQuestions,
        lifestyleTips: best.lifestyleTips,
        timestamp: new Date().toISOString(),
        symptoms: [],
        inputText,
        aiModel: 'Fallback (Rule-Based)',
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      condition: 'Unspecified Condition',
      confidence: 0.4,
      possibleConditions: [
        { name: 'Unspecified Condition', confidence: 0.4, description: 'The symptoms described do not clearly match a specific condition in our database.' }
      ],
      recommendations: [
        "Monitor your symptoms carefully over the next 24-48 hours",
        "Rest and stay well-hydrated",
        "Consider consulting a healthcare provider if symptoms persist or worsen",
        "Keep a symptom diary to track any changes or patterns",
        "Maintain good hygiene and a balanced diet to support recovery"
      ],
      shouldSeeDoctor: true,
      severity: severity === 'severe' ? 'high' : 'medium',
      urgencyLevel: 'soon',
      followUpQuestions: [
        "Can you describe your symptoms in more detail?",
        "When did you first notice these symptoms?",
        "Have you experienced anything similar before?"
      ],
      lifestyleTips: [
        "Ensure you're getting 7-9 hours of sleep each night",
        "Stay hydrated with at least 8 glasses of water daily",
        "Regular exercise and a balanced diet support overall health"
      ],
      timestamp: new Date().toISOString(),
      symptoms: [],
      inputText,
      aiModel: 'Fallback (Rule-Based)',
    };
  }
}

export { DiagnosisService };