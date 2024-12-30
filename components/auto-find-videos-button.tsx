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
        const { updatedItems } = data;
        setItems(updatedItems);
        toast("Filmy zostały automatycznie znalezione");
      }
    } catch (error) {
      console.error(error);
      toast("Wystąpił błąd podczas wyszukiwania filmów");
    } finally {
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
