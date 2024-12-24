"use client";

import AddText from "@/components/add-text";
import CombineAudioButton from "@/components/combine-audio-button";
import CombineAudioDisplay from "@/components/combine-audio-display";
import DeleteAll from "@/components/delete-all";
import DisplayText from "@/components/display-text";
import ElevenLabsCredits from "@/components/eleven-labs-credits";
import GenerateAudioButton from "@/components/generate-audio-button";
import GenerateVideoButton from "@/components/generate-video-button";
import { VoiceActor } from "@/helper/available-voice-actors";
import { removeFile } from "@/helper/remove-file";
import Cookies from "js-cookie";
import { set } from "lodash";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface TextItemProps {
  id: string;
  text: string;
  voice: VoiceActor | null;
  audioFileName: string | null;
  audioDuration: number | null;
}

export default function Home() {
  const [textItems, setTextItems] = useState<TextItemProps[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isCombining, setIsCombining] = useState(false);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState<string | null>(null);

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
  const handleAddText = (text: string, voiceActor: VoiceActor | null) => {
    // Divide the text into lines
    const lines = text.split("\n").filter((line) => line.length > 0);
    // Create new items
    const newItems = lines.map(
      (line) =>
        ({
          id: uuidv4(),
          text: line,
          voice: voiceActor,
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

    if (combinedAudioUrl) {
      removeFile(combinedAudioUrl);
      setCombinedAudioUrl(null);
    }

    setTextItems([]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/3 p-6 sticky top-0 h-screen overflow-auto flex flex-col gap-12 justify-between">
        <AddText onAdd={handleAddText} />

        <div className="flex flex-col gap-12">
          <CombineAudioDisplay
            isCombining={isCombining}
            combinedAudioUrl={combinedAudioUrl}
          />

          <div className="flex flex-wrap items-center gap-6 self-end bg-gradient-to-br from-gray-600/5 rounded-xl px-4 py-3">
            <GenerateVideoButton />
            <GenerateAudioButton
              textItems={textItems}
              setTextItems={setTextItems}
              setIsGenerating={setIsGenerating}
            />
            <CombineAudioButton
              textItems={textItems}
              setIsCombining={setIsCombining}
              isCombining={isCombining}
              setCombinedAudioUrl={setCombinedAudioUrl}
              combinedAudioUrl={combinedAudioUrl}
            />

            <DeleteAll onDeleteAll={handleDeleteAll} />
          </div>
          <ElevenLabsCredits isGenerating={isGenerating} />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-2/3 p-6">
        <DisplayText items={textItems} setItems={setTextItems} />
      </div>
    </div>
  );
}
