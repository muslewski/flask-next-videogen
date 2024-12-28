"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { removeFile } from "@/helper/remove-file";
import { Blend } from "lucide-react";
import { toast } from "sonner";

export default function CombineAudioButton() {
  const {
    items,
    setIsCombiningProject,
    isCombiningProject,
    combinedFileName,
    setCombinedFileName,
  } = useStoredValueContext();

  const checkIfEveryTextItemHasAudio = () => {
    return items.every((item) => item.audioFileName !== null);
  };

  const handleCombineAudio = async () => {
    if (!checkIfEveryTextItemHasAudio()) {
      toast("Brakuje Audio!", {
        description:
          "Nie wszystkie elementy tekstu mają przypisane pliki audio.",
      });
      return;
    }

    if (items.length === 0) return;

    setIsCombiningProject(true);

    // Remove previous combined audio if it exists
    if (combinedFileName) {
      removeFile(combinedFileName);
      setCombinedFileName(null);
    }

    try {
      const response = await fetch("/api/combine-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      const { combinedAudioFileName } = data;
      setCombinedFileName(combinedAudioFileName);

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error combining audio:", error);
    } finally {
      setIsCombiningProject(false);
    }
  };

  return (
    <Button onClick={handleCombineAudio} className="flex items-center">
      <Blend size={18} />
      <span className="ml-2 w-28 text-center">
        {isCombiningProject ? "Łączenie" : "Połącz wszystko"}
      </span>
    </Button>
  );
}
