"use client";

import AddText from "@/components/add-text";
import CombineAudio from "@/components/combine-audio";
import DeleteAll from "@/components/delete-all";
import DisplayText from "@/components/display-text";
import ElevenLabsCredits from "@/components/eleven-labs-credits";
import GenerateAudio from "@/components/generate-audio";
import { removeFile } from "@/helper/remove-file";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface TextItemProps {
  id: string;
  text: string;
  audioFileName: string | null;
  audioDuration: number | null;
}

export default function Home() {
  const [textItems, setTextItems] = useState<TextItemProps[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load textItems from cookie on component mount
  useEffect(() => {
    const savedItems = Cookies.get("textItems");
    if (savedItems) {
      setTextItems(JSON.parse(savedItems));
    }
  }, []);

  // Save textItems to cookie whenever it changes
  useEffect(() => {
    Cookies.set("textItems", JSON.stringify(textItems), { expires: 7 });
  }, [textItems]);

  // Add text from AddText component
  const handleAddText = (text: string) => {
    // Divide the text into lines
    const lines = text.split("\n").filter((line) => line.length > 0);
    // Create new items
    const newItems = lines.map(
      (line) =>
        ({
          id: uuidv4(),
          text: line,
          audioFileName: null,
          audioDuration: null,
        } as TextItemProps)
    );
    // Add new items to the list
    setTextItems((prev) => [...prev, ...newItems]);
  };

  // Delete all text items
  const handleDeleteAll = () => {
    // Delete every audio file
    textItems.forEach((item) => {
      if (item.audioFileName) {
        removeFile(item.audioFileName);
      }
    });

    setTextItems([]);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 p-6 sticky top-0 h-screen overflow-auto flex flex-col gap-12 justify-between">
        <AddText onAdd={handleAddText} />
        <div className="flex items-center gap-6 self-end">
          <GenerateAudio
            textItems={textItems}
            setTextItems={setTextItems}
            setIsGenerating={setIsGenerating}
          />
          <CombineAudio />

          <DeleteAll onDeleteAll={handleDeleteAll} />
        </div>
        <ElevenLabsCredits isGenerating={isGenerating} />
      </div>
      <div className="w-2/3 p-6">
        <DisplayText items={textItems} setItems={setTextItems} />
      </div>
    </div>
  );
}
