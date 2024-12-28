"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { removeFile } from "@/helper/remove-file";
import { Blend } from "lucide-react";
import { toast } from "sonner";

export default function CombineButton() {
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

  const checkIfEveryTextItemHasVideo = () => {
    return items.every((item) => item.video?.videoFileName !== null);
  };

  const handleCombineMedia = async () => {
    if (!checkIfEveryTextItemHasAudio()) {
      toast("Brakuje Audio!", {
        description:
          "Nie wszystkie elementy tekstu mają przypisane pliki audio.",
      });
      return;
    }

    if (!checkIfEveryTextItemHasVideo()) {
      toast("Brakuje Video!", {
        description:
          "Nie wszystkie elementy tekstu mają przypisane pliki video.",
      });
      return;
    }

    if (items.length === 0) return;

    setIsCombiningProject(true);

    // Remove previous combined audio if it exists
    if (combinedFileName) {
      removeFile(combinedFileName, "video");
      setCombinedFileName(null);
    }

    try {
      const response = await fetch("/api/combine-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      const { combinedMediaFileName } = data;
      setCombinedFileName(combinedMediaFileName);

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error combining media:", error);
    } finally {
      setIsCombiningProject(false);
    }
  };

  return (
    <Button onClick={handleCombineMedia} className="flex items-center">
      <Blend size={18} />
      <span className="ml-2 w-28 text-center">
        {isCombiningProject ? "Łączenie" : "Połącz wszystko"}
      </span>
    </Button>
  );
}
