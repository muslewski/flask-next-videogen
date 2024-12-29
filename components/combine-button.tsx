"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { removeFile } from "@/helper/remove-file";
import { Blend } from "lucide-react";
import { useState } from "react";
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
    return items.every(
      (item) => item.video && item.video.videoFileName !== null
    );
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
      console.log("REMOVING FILE", combinedFileName);
      await removeFile(combinedFileName, "output");
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

      if (data.status === "success") {
        pollTaskStatus(data.taskId);
      }
    } catch (error) {
      toast("Błąd!", {
        description: "Wystąpił błąd podczas łączenia mediów.",
      });
      setIsCombiningProject(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/task-status/${taskId}`);
      const data = await response.json();

      if (data.status === "completed") {
        setCombinedFileName(data.fileName);
        toast("Sukces!", {
          description: "Łączenie mediów zakończone.",
        });
        setIsCombiningProject(false);
      } else if (data.status === "error") {
        toast("Błąd!", {
          description: data.message,
        });
        setIsCombiningProject(false);
      } else {
        setTimeout(() => pollTaskStatus(taskId), 1000); // Poll every 1s
      }
    } catch (error) {
      toast("Błąd!", {
        description: "Wystąpił błąd podczas sprawdzania statusu zadania.",
      });
      setIsCombiningProject(false);
    }
  };

  return (
    <Button
      onClick={handleCombineMedia}
      disabled={isCombiningProject}
      className="flex items-center"
    >
      <Blend size={18} />
      <span className="ml-2 w-28 text-center">
        {isCombiningProject ? "Łączenie" : "Połącz wszystko"}
      </span>
    </Button>
  );
}
