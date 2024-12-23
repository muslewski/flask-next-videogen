import { TextItemProps } from "@/components/home";
import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";

interface GenerateAudioProps {
  textItems: TextItemProps[];
  setTextItems: React.Dispatch<React.SetStateAction<TextItemProps[]>>;
}

export default function GenerateAudio({
  textItems,
  setTextItems,
}: GenerateAudioProps) {
  const handleGenerateAudio = async () => {
    try {
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

      // Log old
      console.log("Old text items:", textItems);

      // Update the text items
      setTextItems(newTextItems);

      // Log new text items
      console.log("New text items:", newTextItems);
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  return (
    <Button
      className="relative px-7 py-4 bg-black hover:bg-black/95 rounded-lg flex items-center divide-x divide-gray-100 transition-transform duration-300 ease-in-out transform hover:scale-[1.01] 
    shadow-[0_0_5px_5px_rgba(75,0,130,0.1),0_0_5px_5px_rgba(0,0,255,0.1)] hover:shadow-[0_0_5px_5px_rgba(75,0,130,0.2),0_0_2px_5px_rgba(0,0,255,0.2)]"
      onClick={handleGenerateAudio}
    >
      <span className="flex items-center space-x-5">
        <AudioLines className="h-6 w-6 text-indigo-600 transition-colors duration-300 hover:text-blue-500" />
        <span className="text-gray-100">Generuj Audio</span>
      </span>
    </Button>
  );
}
