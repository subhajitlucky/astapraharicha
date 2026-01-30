import { create } from 'zustand';

export interface Prahari {
  id: number;
  nameOdia: string;
  nameEn: string;
  timeRange: string;
  phase: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    mist: string;
  };
  mantra: string;
  significance: string;
  intensity: number;
  theme: 'light' | 'dark';
}

const praharis: Prahari[] = [
  {
    id: 1,
    nameOdia: "ପ୍ରଥମ ପ୍ରହର",
    nameEn: "First Watch",
    timeRange: "6:00 AM - 9:00 AM",
    phase: "Morning Dawn",
    colors: {
      primary: "#831843",
      secondary: "#fda4af",
      accent: "#f43f5e",
      mist: "rgba(253,164,175,0.15)"
    },
    mantra: "ମଙ୍ଗଳ ଆରତୀ",
    significance: "The day begins. Light conquers darkness. The temple doors open.",
    intensity: 0.8,
    theme: 'dark'
  },
  {
    id: 2,
    nameOdia: "ଦ୍ଵିତୀୟ ପ୍ରହର",
    nameEn: "Second Watch", 
    timeRange: "9:00 AM - 12:00 PM",
    phase: "Morning",
    colors: {
      primary: "#064e3b",
      secondary: "#6ee7b7",
      accent: "#34d399",
      mist: "rgba(110,231,183,0.2)"
    },
    mantra: "ଦୀନବନ୍ଧୁ",
    significance: "Community gathers. Prasad is distributed. The sun rises high.",
    intensity: 0.9,
    theme: 'dark'
  },
  {
    id: 3,
    nameOdia: "ତୃତୀୟ ପ୍ରହର",
    nameEn: "Third Watch",
    timeRange: "12:00 PM - 3:00 PM", 
    phase: "Noon Peak",
    colors: {
      primary: "#1e3a8a",
      secondary: "#93c5fd",
      accent: "#3b82f6",
      mist: "rgba(147,197,253,0.25)"
    },
    mantra: "ଜୟ ମା ଲକ୍ଷ୍ମୀ",
    significance: "Maximum solar energy. The chant reaches fever pitch.",
    intensity: 1.0,
    theme: 'dark'
  },
  {
    id: 4,
    nameOdia: "ଚତୁର୍ଥ ପ୍ରହର",
    nameEn: "Fourth Watch",
    timeRange: "3:00 PM - 6:00 PM",
    phase: "Afternoon",
    colors: {
      primary: "#5d4037",
      secondary: "#d4a373",
      accent: "#faedcd",
      mist: "rgba(212,163,115,0.1)"
    },
    mantra: "ଶାନ୍ତି ପାଠ",
    significance: "Winding down. The circle prepares to close.",
    intensity: 0.4,
    theme: 'dark'
  },
  {
    id: 5,
    nameOdia: "ପଞ୍ଚମ ପ୍ରହର",
    nameEn: "Fifth Watch",
    timeRange: "6:00 PM - 9:00 PM",
    phase: "Evening Twilight",
    colors: {
      primary: "#1a0b2e",
      secondary: "#ff6b35",
      accent: "#f7931e",
      mist: "rgba(255,107,53,0.1)"
    },
    mantra: "ଜୟ ଜଗନ୍ନାଥ",
    significance: "The lamps are lit. The material world fades.",
    intensity: 0.3,
    theme: 'dark'
  },
  {
    id: 6,
    nameOdia: "ଷଷ୍ଠ ପ୍ରହର",
    nameEn: "Sixth Watch",
    timeRange: "9:00 PM - 12:00 AM",
    phase: "Night",
    colors: {
      primary: "#0d1b2a",
      secondary: "#778da9",
      accent: "#e0e1dd",
      mist: "rgba(119,141,169,0.08)"
    },
    mantra: "ହରେ କୃଷ୍ଣ",
    significance: "The mind stills. The first ecstasy arrives.",
    intensity: 0.5,
    theme: 'dark'
  },
  {
    id: 7,
    nameOdia: "ସପ୍ତମ ପ୍ରହର",
    nameEn: "Seventh Watch",
    timeRange: "12:00 AM - 3:00 AM",
    phase: "Midnight Void",
    colors: {
      primary: "#0a0a0a",
      secondary: "#a855f7",
      accent: "#e879f9",
      mist: "rgba(168,85,247,0.1)"
    },
    mantra: "ରାଧେ ରାଧେ",
    significance: "The deepest hour. Spirits walk. Chanting becomes breathing.",
    intensity: 0.2,
    theme: 'dark'
  },
  {
    id: 8,
    nameOdia: "ଅଷ୍ଟମ ପ୍ରହର",
    nameEn: "Eighth Watch",
    timeRange: "3:00 AM - 6:00 AM",
    phase: "Brahma Muhurta",
    colors: {
      primary: "#1d3557",
      secondary: "#f4a261",
      accent: "#e9c46a",
      mist: "rgba(244,162,97,0.1)"
    },
    mantra: "ଗୋବିନ୍ଦ ବୋଲୋ",
    significance: "The gods awaken. The most potent time for devotion.",
    intensity: 0.6,
    theme: 'dark'
  }
];

interface PrahariState {
  currentPrahari: Prahari;
  setPrahari: (id: number) => void;
  isTransitioning: boolean;
  setTransitioning: (status: boolean) => void;
  totalRotation: number;
  setTotalRotation: (rotation: number) => void;
}

export const usePrahariStore = create<PrahariState>((set) => ({
  currentPrahari: praharis[0],
  setPrahari: (id) => set({ currentPrahari: praharis[id - 1] }),
  isTransitioning: false,
  setTransitioning: (status) => set({ isTransitioning: status }),
  totalRotation: 0,
  setTotalRotation: (rotation) => set({ totalRotation: rotation })
}));

export { praharis };
