"use client";

import { handleKeyDown } from "@/helper/handle-key-down";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VoiceActor } from "@/helper/available-voice-actors";
import VoiceSelector from "@/components/voice-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ItemProps,
  useStoredValueContext,
} from "@/components/stored-value-context";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";

export default function AddText() {
  const { setItems } = useStoredValueContext();
  const [text, setText] = useState("");
  const [currentVoiceActor, setCurrentVoiceActor] = useState<VoiceActor | null>(
    null
  );
  const [error, setError] = useState("");
  const [breakDuration, setBreakDuration] = useState<number>(1);

  const handleAdd = () => {
    // Check if voice actor is selected
    if (!currentVoiceActor) {
      setError("Wybierz głos, zanim dodasz tekst.");
      return;
    }

    if (text.trim()) {
      // Divide the text into lines
      const lines = text.split("\n").filter((line) => line.length > 0);
      // Create new items
      const newItems = lines.map(
        (line) =>
          ({
            id: uuidv4(),
            text: line,
            voice: currentVoiceActor,
            audioFileName: null,
            audioDuration: null,
            video: null,
          } as ItemProps)
      );
      // Add new items to the list
      setItems((prev) => [...prev, ...newItems]);

      setText(""); // Czyści pole tekstowe
      setError("");

      // Scroll to the last item
      setTimeout(() => {
        const reorderGroup = document.getElementById("scroll-here");
        if (reorderGroup) {
          reorderGroup.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 1);
    } else {
      setError("Wpisz tekst, zanim dodasz.");
    }
  };

  const handleAddBreak = () => {
    if (breakDuration > 0) {
      const breakItem = {
        id: uuidv4(),
        text: " ",
        voice: null,
        audioFileName: null,
        audioDuration: breakDuration,
        video: null,
      } as ItemProps;

      setItems((prev) => [...prev, breakItem]);
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
      <h2 className="text-lg font-bold">Dodaj do scenariusza:</h2>
      <Textarea
        placeholder="Wpisz tekst..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e, handleAdd);
        }}
        className="min-h-[300px]"
      />

      <div className="flex items-center space-x-4">
        <div className="w-1/2 flex flex-col gap-2">
          <VoiceSelector
            voice={currentVoiceActor}
            setVoice={setCurrentVoiceActor}
            clearError={() => setError("")}
          />

          <Button onClick={handleAdd} className="w-full">
            Dodaj tekst
          </Button>
        </div>

        <div className="w-1/2 flex flex-col gap-2">
          <Input
            type="number"
            placeholder="Czas trwania (sekundy)"
            value={breakDuration || ""}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="flex-grow"
          />
          <Button onClick={handleAddBreak}>Dodaj przerwę</Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Błąd</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
