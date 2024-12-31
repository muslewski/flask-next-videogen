"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Video } from "lucide-react";
import { toast } from "sonner";

export default function AutoFindVideosButton() {
  const { setIsSearchingForVideos, isSearchingForVideos, items, setItems } =
    useStoredValueContext();

  const handleAutoFindVideos = async () => {
    setIsSearchingForVideos(true);
    try {
      const response = await fetch("/api/auto-find-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: items }),
      });

      const data = await response.json();

      if (data.status === "success") {
        pollTaskStatus(data.taskId);
      }
    } catch (error) {
      console.error(error);
      toast("Wystąpił błąd podczas wyszukiwania filmów");
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/task-status/${taskId}`);
      const data = await response.json();

      if (data.status === "completed") {
        setItems(data.updatedItems);
        toast("Sukces!", {
          description: "Wyszukiwanie filmów zakończone.",
        });
        setIsSearchingForVideos(false);
      } else if (data.status === "error") {
        toast("Błąd!", {
          description: data.message,
        });
        setIsSearchingForVideos(false);
      } else {
        setTimeout(() => pollTaskStatus(taskId), 2000); // Poll every 2s
      }
    } catch (error) {
      toast("Błąd!", {
        description: "Wystąpił błąd podczas sprawdzania statusu zadania.",
      });
      setIsSearchingForVideos(false);
    }
  };

  return (
    <Button onClick={handleAutoFindVideos} disabled={isSearchingForVideos}>
      <Video
        size={18}
        className={clsx({ "animate-bounce": isSearchingForVideos })}
      />
      Szukaj filmów
    </Button>
  );
}
