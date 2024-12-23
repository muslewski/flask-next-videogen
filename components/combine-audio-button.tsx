"use client";

import { TextItemProps } from "@/components/home";
import { Button } from "@/components/ui/button";
import { removeFile } from "@/helper/remove-file";
import { Blend } from "lucide-react";
import { toast } from "sonner";
import { text } from "stream/consumers";

interface CombineAudioProps {
  textItems: TextItemProps[];
  setIsCombining: React.Dispatch<React.SetStateAction<boolean>>;
  isCombining: boolean;
  setCombinedAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
  combinedAudioUrl: string | null;
}

export default function CombineAudioButton({
  textItems,
  setIsCombining,
  isCombining,
  setCombinedAudioUrl,
  combinedAudioUrl,
}: CombineAudioProps) {
  const checkIfEveryTextItemHasAudio = () => {
    return textItems.every((item) => item.audioFileName !== null);
  };

  const handleCombineAudio = async () => {
    if (!checkIfEveryTextItemHasAudio()) {
      toast("Brakuje Audio!", {
        description:
          "Nie wszystkie elementy tekstu mają przypisane pliki audio.",
      });
      return;
    }

    if (textItems.length === 0) return;

    setIsCombining(true);

    // Remove previous combined audio if it exists
    if (combinedAudioUrl) {
      removeFile(combinedAudioUrl);
      setCombinedAudioUrl(null);
    }

    try {
      const response = await fetch("/api/combine-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textItems }),
      });

      const data = await response.json();
      const { combinedAudioFileName } = data;
      setCombinedAudioUrl(combinedAudioFileName);

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error combining audio:", error);
    } finally {
      setIsCombining(false);
    }
  };

  return (
    <Button onClick={handleCombineAudio}>
      <Blend size={18} />
      {isCombining ? "Łączenie..." : "Połącz"}
    </Button>
  );
}
