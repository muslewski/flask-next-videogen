import { useStoredValueContext } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";

export default function GenerateAudioButton() {
  const { items, setItems, setIsGeneratingAudio } = useStoredValueContext();

  const handleGenerateAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Destructure the data and message from the response
      const { newItems } = await response.json();

      // Update the text items
      setItems(newItems);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <Button onClick={handleGenerateAudio}>
      <AudioLines size={18} />
      Generuj dźwięki
    </Button>
  );
}
