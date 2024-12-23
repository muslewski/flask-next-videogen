"use client";

import { handleKeyDown } from "@/helper/handle-key-down";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AddTextProps {
  onAdd: (text: string) => void;
}

export default function AddText({ onAdd }: AddTextProps) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text); // Wywołuje funkcję przekazaną z Home
      setText(""); // Czyści pole tekstowe

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
    <div className="max-w-7xl space-y-2">
      <h2 className="text-lg font-bold">Dodaj tekst:</h2>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e, handleAdd);
        }}
        rows={32}
      />
      <Button onClick={handleAdd} className="w-full">
        Dodaj
      </Button>
    </div>
  );
}
