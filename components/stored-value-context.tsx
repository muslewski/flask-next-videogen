"use client";

import { VoiceActor } from "@/helper/available-voice-actors";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ItemProps {
  id: string;
  text: string;
  voice: VoiceActor | null;
  audioFileName: string | null;
  audioDuration: number | null;
  video: VideoObject | null;
}

export interface VideoObject {
  id: string;
  videoFileName: string | null;
  videoDuration: number | null;
  videos: {
    [key: string]: {
      url: string;
      width: number;
      height: number;
      size: number;
      thumbnail: string;
    };
  };
  tags: string[];
  pageUrl: string;
}

interface StoredValueContextProps {
  usedVideoIDs: string[] | null;
  setUsedVideoIDs: React.Dispatch<React.SetStateAction<string[] | null>>;
  items: ItemProps[];
  setItems: React.Dispatch<React.SetStateAction<ItemProps[]>>;
  isGeneratingAudio: boolean;
  setIsGeneratingAudio: React.Dispatch<React.SetStateAction<boolean>>;
  isCombiningProject: boolean;
  setIsCombiningProject: React.Dispatch<React.SetStateAction<boolean>>;
  combinedFileName: string | null;
  setCombinedFileName: React.Dispatch<React.SetStateAction<string | null>>;
}

const StoredValueContext = createContext<StoredValueContextProps | undefined>(
  undefined
);

export const StoredValueProvider = ({ children }: { children: ReactNode }) => {
  const [usedVideoIDs, setUsedVideoIDs] = useState<string[] | null>([]);

  // main items that store information about text, audio, video, voice etc...
  const [items, setItems] = useState<ItemProps[]>([]);

  // Bool that will tell us if we are generating audio in ElevenLabs
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);

  // Bool that will inform if we are combining project to one file
  const [isCombiningProject, setIsCombiningProject] = useState<boolean>(false);

  // Filename for combined file if we have one
  const [combinedFileName, setCombinedFileName] = useState<string | null>(null);

  return (
    <StoredValueContext.Provider
      value={{
        usedVideoIDs,
        setUsedVideoIDs,
        items,
        setItems,
        isGeneratingAudio,
        setIsGeneratingAudio,
        isCombiningProject,
        setIsCombiningProject,
        combinedFileName,
        setCombinedFileName,
      }}
    >
      {children}
    </StoredValueContext.Provider>
  );
};

export const useStoredValueContext = () => {
  const context = useContext(StoredValueContext);
  if (!context) {
    throw new Error(
      "useStoredValueContext must be used within a StoredValueProvider"
    );
  }
  return context;
};
