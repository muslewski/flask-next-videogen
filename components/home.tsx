"use client";

import AddText from "@/components/add-text";
import CombineAudioButton from "@/components/combine-audio-button";
import CombineAudioDisplay from "@/components/combine-audio-display";
import DeleteAll from "@/components/delete-all";
import DisplayText from "@/components/display-text";
import ElevenLabsCredits from "@/components/eleven-labs-credits";
import GenerateAudioButton from "@/components/generate-audio-button";
import GenerateScenarioButton from "@/components/generate-scenario-button";
import GenerateVideoButton from "@/components/generate-video-button";
import {
  ItemProps,
  useStoredValueContext,
} from "@/components/stored-value-context";
import { VoiceActor } from "@/helper/available-voice-actors";
import { removeFile } from "@/helper/remove-file";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { items, setItems, combinedFileName, setCombinedFileName } =
    useStoredValueContext();

  // Load items from cookie on component mount
  useEffect(() => {
    const savedItems = Cookies.get("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to cookie whenever it changes
  useEffect(() => {
    Cookies.set("items", JSON.stringify(items), { expires: 7 });
    console.log(items);
  }, [items]);

  // Add item from AddText component
  const handleAddItem = (
    text: string,
    voiceActor: VoiceActor | null,
    audioDuration?: number | null
  ) => {
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
          audioDuration: audioDuration,
          video: null,
        } as ItemProps)
    );
    // Add new items to the list
    setItems((prev) => [...prev, ...newItems]);
  };

  // Delete all items
  const handleDeleteAll = () => {
    // Delete every audio file
    items.forEach((item) => {
      if (item.audioFileName) {
        removeFile(item.audioFileName);
      }
    });

    if (combinedFileName) {
      console.log("CombinedURL", combinedFileName);
      removeFile(combinedFileName);
      setCombinedFileName(null);
    }

    setItems([]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/3 p-6 sticky top-0 h-screen overflow-auto flex flex-col gap-12 justify-between">
        <AddText onAdd={handleAddItem} />

        <div className="flex flex-col gap-12">
          <CombineAudioDisplay />

          <div className="flex flex-wrap items-center gap-6 self-end bg-gradient-to-br from-gray-600/5 rounded-xl px-4 py-3">
            <GenerateScenarioButton />
            <GenerateAudioButton />
            <GenerateVideoButton />
            <CombineAudioButton />

            <DeleteAll onDeleteAll={handleDeleteAll} />
          </div>
          <ElevenLabsCredits />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-2/3 p-6">
        <DisplayText />
      </div>
    </div>
  );
}
