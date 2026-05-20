// Enhanced text processing utilities with negation detection and synonym expansion

const SYNONYM_MAP: Record<string, string[]> = {
  'headache': ['head hurts', 'head pain', 'head ache', 'head pounding', 'migraine'],
  'fever': ['temperature', 'feverish', 'hot', 'burning up'],
  'cough': ['coughing', 'hacking'],
  'nausea': ['nauseous', 'queasy', 'sick to stomach', 'feel sick'],
  'vomiting': ['throwing up', 'vomit', 'puking'],
  'fatigue': ['tired', 'exhausted', 'no energy', 'lethargic', 'weak'],
  'diarrhea': ['loose stool', 'watery stool', 'runs'],
  'chest pain': ['chest hurts', 'chest tightness', 'chest pressure'],
  'shortness of breath': ['cant breathe', 'hard to breathe', 'breathing difficulty', 'breathless', 'difficulty breathing'],
  'sore throat': ['throat hurts', 'throat pain', 'scratchy throat'],
  'runny nose': ['nose running', 'stuffy nose', 'nasal congestion', 'blocked nose'],
  'dizziness': ['dizzy', 'lightheaded', 'room spinning', 'vertigo', 'faint'],
  'rash': ['skin rash', 'hives', 'breakout', 'skin irritation'],
  'stomach pain': ['tummy ache', 'stomach ache', 'belly pain', 'abdominal pain', 'stomach hurts', 'cramps'],
  'muscle pain': ['muscle aches', 'body aches', 'sore muscles', 'muscles hurt'],
  'joint pain': ['joint aches', 'joints hurt', 'arthritis', 'stiff joints'],
  'insomnia': ['cant sleep', 'trouble sleeping', 'sleepless'],
  'anxiety': ['anxious', 'nervous', 'worried', 'panic', 'stressed'],
  'depression': ['depressed', 'sad', 'hopeless', 'down'],
  'back pain': ['backache', 'back hurts', 'lower back pain', 'spine pain'],
  'constipation': ['constipated', 'cant go', 'hard stool'],
  'sneezing': ['sneeze', 'sneezy'],
  'chills': ['shivering', 'cold sweats', 'shaking'],
  'swelling': ['swollen', 'puffy', 'inflamed', 'inflammation'],
  'loss of appetite': ['not hungry', 'no appetite', 'dont want to eat'],
  'blurry vision': ['vision blurry', 'cant see clearly', 'blurred vision'],
  'ear pain': ['earache', 'ear hurts', 'ear infection'],
};

const NEGATION_WORDS = new Set([
  'no', 'not', 'none', 'never', 'without', 'dont', "don't",
  'doesnt', "doesn't", 'didnt', "didn't", 'cant', "can't",
  'cannot', 'hardly', 'barely', 'neither', 'nor', 'absence',
]);

const STOP_WORDS = new Set([
  'and', 'the', 'is', 'in', 'it', 'of', 'i', 'have', 'has', 'had',
  'am', 'feeling', 'feel', 'experiencing', 'with', 'a', 'an', 'or',
  'my', 'me', 'to', 'been', 'having', 'also', 'very', 'really',
  'some', 'bit', 'lot', 'little', 'much', 'since', 'for', 'from',
  'was', 'were', 'be', 'being', 'get', 'getting', 'got', 'that',
  'this', 'these', 'those', 'just', 'like', 'think', 'know', 'seem',
  'seems', 'started', 'start', 'day', 'days', 'week', 'weeks',
  'ago', 'today', 'yesterday', 'morning', 'night', 'evening',
]);

const MEDICAL_TERMS = new Set([
  // Cold and Flu
  'fever', 'cough', 'sore', 'throat', 'runny', 'nose', 'sneezing',
  'chills', 'muscle', 'aches', 'fatigue', 'tired', 'exhausted',
  // COVID-19
  'shortness', 'breath', 'breathing', 'taste', 'smell', 'loss',
  // Allergy
  'watery', 'eyes', 'itchy', 'itching', 'allergies', 'pollen',
  // Headache and Migraine
  'headache', 'migraine', 'throbbing', 'light', 'sound', 'sensitive',
  'sensitivity', 'nausea', 'vomiting', 'visual', 'aura', 'flashing',
  // Stomach Issues
  'stomach', 'abdominal', 'pain', 'diarrhea', 'constipation', 'cramps',
  'bloating', 'gas', 'indigestion', 'acid', 'reflux',
  // Heart
  'chest', 'dizzy', 'dizziness', 'lightheaded', 'palpitations', 'heartbeat',
  // Skin
  'rash', 'rashes', 'bumps', 'blisters', 'swelling', 'swollen',
  'dry', 'peeling', 'skin', 'hives', 'acne',
  // Dehydration
  'thirsty', 'dehydrated', 'urine', 'dark', 'mouth',
  // Mental health
  'anxiety', 'anxious', 'depression', 'depressed', 'insomnia', 'stress',
  'panic', 'nervous',
  // Musculoskeletal
  'back', 'joint', 'stiff', 'stiffness', 'weakness', 'numbness', 'tingling',
  // ENT
  'ear', 'earache', 'tinnitus', 'congestion', 'sinus',
  // General
  'fever', 'weight', 'appetite', 'infection', 'inflammation', 'bleeding',
  'bruising', 'lump', 'swelling',
]);

// ===== Exported Functions =====

export const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const tokenize = (text: string): string[] => {
  return text.split(/\s+/).filter(Boolean);
};

export const removeStopWords = (tokens: string[]): string[] => {
  return tokens.filter(token => !STOP_WORDS.has(token));
};

export const extractRelevantTerms = (tokens: string[]): string[] => {
  return tokens.filter(token => MEDICAL_TERMS.has(token));
};

/**
 * Detects negated terms in a token array.
 * E.g., "no fever" or "not coughing" → "fever" and "coughing" are negated.
 */
export const detectNegations = (tokens: string[]): { affirmed: string[]; negated: string[] } => {
  const affirmed: string[] = [];
  const negated: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (NEGATION_WORDS.has(token)) {
      // Mark the next 1-3 tokens as negated (negation window)
      const windowEnd = Math.min(i + 4, tokens.length);
      for (let j = i + 1; j < windowEnd; j++) {
        if (MEDICAL_TERMS.has(tokens[j])) {
          negated.push(tokens[j]);
        }
      }
    } else if (MEDICAL_TERMS.has(token) && !negated.includes(token)) {
      affirmed.push(token);
    }
  }

  return { affirmed, negated };
};

/**
 * Expands synonym phrases in the input text to their canonical medical terms.
 */
export const expandSynonyms = (text: string): string => {
  let expanded = text.toLowerCase();
  for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
    for (const synonym of synonyms) {
      if (expanded.includes(synonym)) {
        expanded = expanded.replace(synonym, canonical);
      }
    }
  }
  return expanded;
};

/**
 * Extracts severity hints from the text.
 */
export const extractSeverityHints = (text: string): 'mild' | 'moderate' | 'severe' | null => {
  const lower = text.toLowerCase();
  const severeWords = ['severe', 'terrible', 'worst', 'extreme', 'unbearable', 'excruciating', 'intense', 'very bad', 'really bad'];
  const mildWords = ['mild', 'slight', 'minor', 'little', 'faint', 'somewhat'];

  if (severeWords.some(w => lower.includes(w))) return 'severe';
  if (mildWords.some(w => lower.includes(w))) return 'mild';
  return null;
};