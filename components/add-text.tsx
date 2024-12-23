"use client";

import { handleKeyDown } from "@/helper/handle-key-down";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VoiceActor } from "@/helper/available-voice-actors";
import VoiceSelector from "@/components/voice-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AddTextProps {
  onAdd: (text: string, voiceActor: VoiceActor | null) => void;
}

export default function AddText({ onAdd }: AddTextProps) {
  const [text, setText] = useState("");
  const [currentVoiceActor, setCurrentVoiceActor] = useState<VoiceActor | null>(
    null
  );
  const [error, setError] = useState("");

  const handleAdd = () => {
    // Check if voice actor is selected
    if (!currentVoiceActor) {
      setError("Wybierz głos, zanim dodasz tekst.");
      return;
    }

    if (text.trim()) {
      onAdd(text, currentVoiceActor); // Wywołuje funkcję przekazaną z Home
      setText(""); // Czyści pole tekstowe
      setError("");

      // Scroll to the last item
      setTimeout(() => {
        const reorderGroup = document.getElementById("scroll-here");
        if (reorderGroup) {
          reorderGroup.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 1);
    }
  };

  return (
    <div className="max-w-7xl space-y-4">
      <h2 className="text-lg font-bold">Dodaj tekst:</h2>
      <Textarea
        placeholder="Wpisz tekst..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e, handleAdd);
        }}
        className="min-h-[300px]"
      />
      <VoiceSelector
        voice={currentVoiceActor}
        setVoice={setCurrentVoiceActor}
        clearError={() => setError("")}
      />
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Błąd</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleAdd} className="w-full">
        Dodaj
      </Button>
    </div>
  );
}
