// Text processing utilities
export const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
};

export const tokenize = (text: string): string[] => {
  return text.split(/\s+/).filter(Boolean);
};

export const removeStopWords = (tokens: string[]): string[] => {
  const stopWords = new Set([
    'and', 'the', 'is', 'in', 'it', 'of', 'i', 'have', 'has', 'had',
    'am', 'feeling', 'feel', 'experiencing', 'with', 'a', 'an', 'or',
    'my', 'me', 'to', 'been', 'having'
  ]);
  return tokens.filter(token => !stopWords.has(token));
};

export const extractRelevantTerms = (tokens: string[]): string[] => {
  const medicalTerms = new Set([
    // Cold and Flu Symptoms
    'fever', 'cough', 'sore', 'throat', 'runny', 'nose', 'sneezing',
    'chills', 'muscle', 'aches', 'fatigue', 'tired', 'exhausted',
    
    // COVID-19 Symptoms
    'shortness', 'breath', 'breathing', 'taste', 'smell', 'loss',
    
    // Allergy Symptoms
    'watery', 'eyes', 'itchy', 'itching',
    
    // Headache and Migraine
    'headache', 'migraine', 'throbbing', 'light', 'sound', 'sensitive',
    'sensitivity', 'nausea', 'vomiting', 'visual', 'aura', 'flashing',
    
    // Stomach Issues
    'stomach', 'abdominal', 'pain', 'diarrhea', 'constipation',
    
    // Heart Symptoms
    'chest', 'dizzy', 'dizziness', 'lightheaded', 'palpitations',
    
    // Skin Issues
    'rash', 'rashes', 'bumps', 'blisters', 'swelling', 'swollen',
    'dry', 'peeling', 'skin',
    
    // Dehydration
    'thirsty', 'dehydrated', 'urine', 'dark', 'mouth'
  ]);
  return tokens.filter(token => medicalTerms.has(token));
};