"use client";

import { handleKeyDown } from "@/helper/handle-key-down";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VoiceActor } from "@/helper/available-voice-actors";
import VoiceSelector from "@/components/voice-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface AddTextProps {
  onAdd: (
    text: string,
    voiceActor: VoiceActor | null,
    audioDuration?: number | null
  ) => void;
}

export default function AddText({ onAdd }: AddTextProps) {
  const [text, setText] = useState("");
  const [currentVoiceActor, setCurrentVoiceActor] = useState<VoiceActor | null>(
    null
  );
  const [error, setError] = useState("");
  const [breakDuration, setBreakDuration] = useState<number>(0);

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

  const handleAddBreak = () => {
    if (breakDuration > 0) {
      onAdd(" ", null, breakDuration);
      setBreakDuration(0);
      setError("");

      // Scroll to the last item
      setTimeout(() => {
        const reorderGroup = document.getElementById("scroll-here");
        if (reorderGroup) {
          reorderGroup.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 1);
    } else {
      setError("Ustaw czas trwania przerwy.");
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

      <Button onClick={handleAdd} className="w-full">
        Dodaj
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Błąd</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4 pt-10">
        <Input
          type="number"
          placeholder="Czas trwania (sekundy)"
          value={breakDuration || ""}
          onChange={(e) => setBreakDuration(Number(e.target.value))}
          className="flex-grow"
        />
        <Button onClick={handleAddBreak}>Dodaj Przerwę</Button>
      </div>
    </div>
  );
}
