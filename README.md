# 🏥 AI-Powered Health Assistant

An intelligent, privacy-first health assistant that provides **AI-powered preliminary diagnoses** based on user-reported symptoms. Built with **React**, **TypeScript**, and **Google Gemini AI**, it offers real-time analysis, voice input support, and personalized health recommendations.

> ⚠️ **Disclaimer:** This tool provides general health information only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Gemini AI Analysis** | Real AI-powered symptom analysis using Google Gemini 2.0 Flash |
| 🎤 **Voice Input** | Speak your symptoms using the Web Speech API (Chrome/Edge) |
| 📊 **Multi-Condition Diagnosis** | Shows multiple possible conditions with confidence percentages |
| 🚨 **Emergency Detection** | Automatically flags critical symptoms with an emergency banner |
| 📜 **Diagnosis History** | Saves past diagnoses to localStorage for future reference |
| 💬 **Follow-up Questions** | AI suggests relevant questions to consider |
| 💡 **Lifestyle Tips** | Personalized wellness tips based on your symptoms |
| 📋 **Copy & Save** | Copy report to clipboard or save to local history |
| 🔒 **Privacy-First** | No data is stored on any server — everything stays on your device |
| 🌙 **Dark Mode UI** | Premium glassmorphism design with smooth animations |
| ♿ **Accessible** | ARIA labels, keyboard navigation, screen reader support |
| 📱 **Responsive** | Fully responsive design for desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Google Gemini AI** | Large language model for symptom analysis |
| **Framer Motion** | Smooth animations and transitions |
| **Web Speech API** | Browser-native speech-to-text |
| **Lucide React** | Icon library |
| **localStorage** | Client-side data persistence |

---

## 🏗️ Architecture

```
src/
├── App.tsx                      # Root layout with providers
├── types.ts                     # TypeScript interfaces
├── index.css                    # Design system & animations
├── components/
│   ├── Header.tsx               # Animated header with AI status
│   ├── Footer.tsx               # Medical disclaimer footer
│   ├── SymptomInput.tsx         # Text + voice symptom input
│   ├── SymptomSuggestions.tsx   # Quick symptom chips
│   ├── DiagnosisResult.tsx      # Multi-condition result card
│   ├── DisclaimerModal.tsx      # Health notice modal
│   ├── HistoryPanel.tsx         # Saved diagnosis history
│   ├── LoadingAnalysis.tsx      # Premium loading animation
│   ├── EmergencyBanner.tsx      # Emergency detection banner
│   ├── Toast.tsx                # Toast notifications
│   └── ToastProvider.tsx        # Toast context provider
├── hooks/
│   └── useSpeechRecognition.ts  # Web Speech API hook
├── services/
│   ├── DiagnosisService.ts      # Gemini AI + fallback engine
│   └── HistoryService.ts        # localStorage history manager
└── utils/
    └── textProcessing.ts        # NLP preprocessing utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A modern browser (Chrome or Edge recommended for voice input)
- (Optional) A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sriram21-09/AI-Powered-Health-Assistant.git
cd AI-Powered-Health-Assistant

# 2. Install dependencies
npm install

# 3. Set up your API key (optional but recommended)
cp .env.example .env
# Edit .env and paste your Gemini API key

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Without an API Key

The app works perfectly without an API key! It will automatically use an enhanced rule-based analysis engine as a fallback. You'll see an "Using Offline Analysis" badge in the header.

---

## 🔮 How It Works

1. **User Inputs Symptoms** → Via text input or voice recording
2. **NLP Preprocessing** → Text is cleaned, synonyms expanded, negations detected
3. **AI Analysis** → Symptoms are sent to Gemini AI (or processed by the fallback engine)
4. **Structured Response** → AI returns possible conditions, confidence levels, and recommendations
5. **Emergency Check** → Critical symptoms trigger an emergency banner
6. **Results Displayed** → Interactive result card with expandable sections
7. **History Saved** → User can save diagnoses locally for future reference

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ star on GitHub!

🚑 **Stay healthy and take care!**
