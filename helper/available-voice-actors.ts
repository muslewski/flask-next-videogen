export interface VoiceActor {
  id: string;
  emoji: string;
  name: string;
  language: string;
  gender: "male" | "female" | "other";
  recommendedLanguageModel?: string;
}

export const availableVoiceActors: VoiceActor[] = [
  {
    id: "XKJsKliiz249nqhxRTTK",
    emoji: "🤓",
    name: "Jerzy",
    language: "Polish",
    gender: "male",
  },
  {
    id: "D38z5RcWu1voky8WS1ja",
    emoji: "👴🏻",
    name: "Fin (Legacy)",
    language: "English",
    gender: "male",
  },
  {
    id: "onwK4e9ZLuTAKqWW03F9",
    emoji: "👨‍💼",
    name: "Daniel",
    language: "English",
    gender: "male",
  },
  {
    id: "X103yr7FZVoJMPQk9Yen",
    emoji: "🧔🏻",
    name: "David",
    language: "English",
    gender: "male",
  },
];
