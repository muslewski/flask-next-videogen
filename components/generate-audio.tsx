import { TextItemProps } from "@/components/home";
import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";

interface GenerateAudioProps {
  textItems: TextItemProps[];
  setTextItems: React.Dispatch<React.SetStateAction<TextItemProps[]>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GenerateAudio({
  textItems,
  setTextItems,
  setIsGenerating,
}: GenerateAudioProps) {
  const handleGenerateAudio = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textItems }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Destructure the data and message from the response
      const { newTextItems } = await response.json();

      // Update the text items
      setTextItems(newTextItems);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGenerateAudio}>
      <AudioLines size={18} />
      Generuj Audio
    </Button>
  );
}
