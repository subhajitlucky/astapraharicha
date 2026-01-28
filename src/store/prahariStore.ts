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
  intensity: number; // 0-1 for animation speed
  theme: 'light' | 'dark';
}

const praharis: Prahari[] = [
  {
    id: 1,
    nameOdia: "ପ୍ରଥମ ପ୍ରହର",
    nameEn: "First Watch",
    timeRange: "6:00 PM - 9:00 PM",
    phase: "Twilight",
    colors: {
      primary: "#1a0b2e", // Deep purple
      secondary: "#ff6b35", // Sunset orange
      accent: "#f7931e",
      mist: "rgba(255,107,53,0.1)"
    },
    mantra: "ଜୟ ଜଗନ୍ନାଥ",
    significance: "The lamps are lit. The material world fades.",
    intensity: 0.3,
    theme: 'dark'
  },
  {
    id: 2,
    nameOdia: "ଦ୍ଵିତୀୟ ପ୍ରହର",
    nameEn: "Second Watch", 
    timeRange: "9:00 PM - 12:00 AM",
    phase: "Night",
    colors: {
      primary: "#0d1b2a", // Deep blue-black
      secondary: "#778da9", // Moon silver
      accent: "#e0e1dd",
      mist: "rgba(119,141,169,0.08)"
    },
    mantra: "ହରେ କୃଷ୍ଣ",
    significance: "The mind stills. The first ecstasy arrives.",
    intensity: 0.5,
    theme: 'dark'
  },
  {
    id: 3,
    nameOdia: "ତୃତୀୟ ପ୍ରହର",
    nameEn: "Third Watch",
    timeRange: "12:00 AM - 3:00 AM", 
    phase: "Midnight Void",
    colors: {
      primary: "#050505", // True void
      secondary: "#2d00f7", // deep violet
      accent: "#ff00ff", // mystical magenta
      mist: "rgba(45,0,247,0.05)"
    },
    mantra: "ରାଧେ ରାଧେ",
    significance: "The deepest hour. Spirits walk. Chanting becomes breathing.",
    intensity: 0.2,
    theme: 'dark'
  },
  {
    id: 4,
    nameOdia: "ଚତୁର୍ଥ ପ୍ରହର",
    nameEn: "Fourth Watch",
    timeRange: "3:00 AM - 6:00 AM",
    phase: "Brahma Muhurta",
    colors: {
      primary: "#1d3557", // Pre-dawn blue
      secondary: "#f4a261", // Warm amber
      accent: "#e9c46a",
      mist: "rgba(244,162,97,0.1)"
    },
    mantra: "ଗୋବିନ୍ଦ ବୋଲୋ",
    significance: "The gods awaken. The most potent time for devotion.",
    intensity: 0.6,
    theme: 'dark'
  },
  {
    id: 5,
    nameOdia: "ପଞ୍ଚମ ପ୍ରହର",
    nameEn: "Fifth Watch",
    timeRange: "6:00 AM - 9:00 AM",
    phase: "Dawn",
    colors: {
      primary: "#fb8500", // Sunrise orange
      secondary: "#ffb703", // Golden yellow
      accent: "#fefae0",
      mist: "rgba(255,183,3,0.15)"
    },
    mantra: "ମଙ୍ଗଳ ଆରତୀ",
    significance: "Light conquers darkness. The temple doors open.",
    intensity: 0.8,
    theme: 'light'
  },
  {
    id: 6,
    nameOdia: "ଷଷ୍ଠ ପ୍ରହର",
    nameEn: "Sixth Watch",
    timeRange: "9:00 AM - 12:00 PM",
    phase: "Morning",
    colors: {
      primary: "#e9c46a", // Turmeric
      secondary: "#f4a261", // Saffron
      accent: "#e76f51",
      mist: "rgba(233,196,106,0.2)"
    },
    mantra: "ଦୀନବନ୍ଧୁ",
    significance: "Community gathers. Prasad is distributed.",
    intensity: 0.9,
    theme: 'light'
  },
  {
    id: 7,
    nameOdia: "ସପ୍ତମ ପ୍ରହର",
    nameEn: "Seventh Watch",
    timeRange: "12:00 PM - 3:00 PM",
    phase: "Noon Peak",
    colors: {
      primary: "#ffffff", // Bright white
      secondary: "#ffd700", // Blazing gold
      accent: "#ff8c00",
      mist: "rgba(255,215,0,0.25)"
    },
    mantra: "ଜୟ ମା ଲକ୍ଷ୍ମୀ",
    significance: "Maximum solar energy. The chant reaches fever pitch.",
    intensity: 1.0,
    theme: 'light'
  },
  {
    id: 8,
    nameOdia: "ଅଷ୍ଟମ ପ୍ରହର",
    nameEn: "Eighth Watch",
    timeRange: "3:00 PM - 6:00 PM",
    phase: "Afternoon",
    colors: {
      primary: "#9c6644", // Earthy
      secondary: "#d4a373", // Sandalwood
      accent: "#faedcd",
      mist: "rgba(156,102,68,0.1)"
    },
    mantra: "ଶାନ୍ତି ପାଠ",
    significance: "Winding down. The circle prepares to close.",
    intensity: 0.4,
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