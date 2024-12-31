"use client";

import {
  ItemProps,
  useStoredValueContext,
} from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { set } from "lodash";
import { AudioLines } from "lucide-react";
import { toast } from "sonner";

interface GenerateSingleAudioButtonProps {
  item: ItemProps;
  updateItem: (id: string, newItem: ItemProps) => void;
}

export default function GenerateSingleAudioButton({
  item,
  updateItem,
}: GenerateSingleAudioButtonProps) {
  const { setIsGeneratingAudio } = useStoredValueContext();

  const handleGenerateSingleAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      const response = await fetch("api/generate-single-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { newItem } = await response.json();
      updateItem(item.id, newItem);
      console.log("New Items: ", newItem);
    } catch (error) {
      toast("Problem z generowaniem dźwięku");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-gray-950/20 hover:bg-gray-600"
      title="Generuj dźwięk"
      onClick={handleGenerateSingleAudio}
    >
      <AudioLines size={18} />
    </Button>
  );
}
