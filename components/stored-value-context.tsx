"use client";

import { VoiceActor } from "@/helper/available-voice-actors";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  items: ItemProps[];
  setItems: React.Dispatch<React.SetStateAction<ItemProps[]>>;
  isGeneratingAudio: boolean;
  setIsGeneratingAudio: React.Dispatch<React.SetStateAction<boolean>>;
  isCombiningProject: boolean;
  setIsCombiningProject: React.Dispatch<React.SetStateAction<boolean>>;
  combinedFileName: string | null;
  setCombinedFileName: React.Dispatch<React.SetStateAction<string | null>>;
  isSavingVideo: boolean;
  setIsSavingVideo: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoredValueContext = createContext<StoredValueContextProps | undefined>(
  undefined
);

export const StoredValueProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Main items that store information about text, audio, video, voice etc.
   */
  const [items, setItems] = useState<ItemProps[]>([]);

  /**
   * Boolean that indicates if we are generating audio in ElevenLabs
   */
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);

  /**
   * Boolean that informs if we are combining project to one file
   */
  const [isCombiningProject, setIsCombiningProject] = useState<boolean>(false);

  /**
   * Filename for combined file if we have one
   */
  const [combinedFileName, setCombinedFileName] = useState<string | null>(null);

  /**
   * Boolean that indicates if we are saving video in Pixabay, Pexels, etc.
   */
  const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    const savedCombinedFileName = localStorage.getItem("combinedFileName");

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error("Error parsing saved items:", error);
      }
    }

    if (savedCombinedFileName) {
      setCombinedFileName(savedCombinedFileName);
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    console.log("Items saved to localStorage:", items);
  }, [items]);

  // Save combinedFileName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("combinedFileName", combinedFileName || "");
    console.log("Combined file name saved to localStorage:", combinedFileName);
  }, [combinedFileName]);

  return (
    <StoredValueContext.Provider
      value={{
        items,
        setItems,
        isGeneratingAudio,
        setIsGeneratingAudio,
        isCombiningProject,
        setIsCombiningProject,
        combinedFileName,
        setCombinedFileName,
        isSavingVideo,
        setIsSavingVideo,
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
