"use client";

import { handleKeyDown } from "@/helper/handle-key-down";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VoiceActor } from "@/helper/available-voice-actors";
import VoiceSelector from "@/components/voice-selector";
import {
  ItemProps,
  useStoredValueContext,
} from "@/components/stored-value-context";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ErrorObject {
  text: string;
  place: "choose-voice" | "add-break" | "textarea" | "";
}

export default function AddText() {
  const [isOpen, setIsOpen] = useState(true);
  const { setItems } = useStoredValueContext();
  const [text, setText] = useState("");
  const [currentVoiceActor, setCurrentVoiceActor] = useState<VoiceActor | null>(
    null
  );
  const [error, setError] = useState<ErrorObject>({ text: "", place: "" });
  const [breakDuration, setBreakDuration] = useState<number>(1);

  const handleAdd = () => {
    // Check if voice actor is selected
    if (!currentVoiceActor) {
      setError({
        text: "Wybierz głos, zanim dodasz tekst.",
        place: "choose-voice",
      });
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
      setError({ text: "", place: "" }); // Czyści błąd

      // Scroll to the last item
      setTimeout(() => {
        const reorderGroup = document.getElementById("scroll-here");
        if (reorderGroup) {
          reorderGroup.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 1);
    } else {
      setError({ text: "Wpisz tekst, zanim dodasz.", place: "textarea" });
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
      setError({ text: "", place: "" });

      // Scroll to the last item
      setTimeout(() => {
        const reorderGroup = document.getElementById("scroll-here");
        if (reorderGroup) {
          reorderGroup.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 1);
    } else {
      setError({ text: "Ustaw czas trwania przerwy.", place: "add-break" });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Dodaj do scenariusza:</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-4 ">
        <div className="max-w-7xl space-y-4">
          <Textarea
            placeholder={
              error.place === "textarea" ? error.text : "Wpisz tekst..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              setError({ text: "", place: "" });
              handleKeyDown(e, handleAdd);
            }}
            className={clsx(
              "min-h-[300px]",
              error.place === "textarea" &&
                "border-destructive placeholder-destructive"
            )}
          />

          <div className="flex items-center space-x-4">
            <div className="w-1/2 flex flex-col gap-2">
              <VoiceSelector
                voice={currentVoiceActor}
                setVoice={setCurrentVoiceActor}
                error={error}
                clearError={() => setError({ text: "", place: "" })}
              />

              <Button onClick={handleAdd} className="w-full">
                Dodaj tekst
              </Button>
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              <Input
                type="number"
                placeholder={
                  error.place === "add-break"
                    ? error.text
                    : "Czas trwania (sekundy)"
                }
                value={breakDuration || ""}
                onChange={(e) => {
                  setBreakDuration(Number(e.target.value));
                  setError({ text: "", place: "" });
                }}
                className={clsx(
                  "flex-grow",
                  error.place === "add-break" &&
                    "border-destructive placeholder-destructive text-destructive"
                )}
              />
              <Button onClick={handleAddBreak}>Dodaj przerwę</Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
