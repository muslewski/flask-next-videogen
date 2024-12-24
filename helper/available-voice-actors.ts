export interface VoiceActor {
  id: string;
  emoji: string;
  color: string;
  name: string;
  language: string;
  gender: "male" | "female" | "other";
  recommendedLanguageModel?: string;
}

export const availableVoiceActors: VoiceActor[] = [
  {
    id: "XKJsKliiz249nqhxRTTK",
    emoji: "🤓",
    color: "rgba(77, 38, 0, 0.5)",
    name: "Jerzy",
    language: "Polish",
    gender: "male",
  },
  {
    id: "D38z5RcWu1voky8WS1ja",
    emoji: "👴🏻",
    color: "rgba(0, 77, 128, 0.5)",
    name: "Fin (Legacy)",
    language: "English",
    gender: "male",
  },
  {
    id: "onwK4e9ZLuTAKqWW03F9",
    emoji: "👨‍💼",
    color: "rgba(0, 77, 0, 0.5)",
    name: "Daniel",
    language: "English",
    gender: "male",
  },
  {
    id: "X103yr7FZVoJMPQk9Yen",
    emoji: "🧔🏻",
    color: "rgba(0, 77, 77, 0.5)",
    name: "David",
    language: "English",
    gender: "male",
  },
];
