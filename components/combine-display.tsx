"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";

export default function CombineDisplay() {
  const { isCombiningProject, combinedFileName } = useStoredValueContext();
  const [isOpen, setIsOpen] = useState(false);

  const [combinedVideoExists, setCombinedVideoExists] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const checkCombinedVideo = async () => {
    if (!combinedFileName) {
      return;
    }
    try {
      const response = await fetch(`/api/get-output/${combinedFileName}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        setCombinedVideoExists(true);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.load();
        }
      } else {
        setCombinedVideoExists(false);
      }
    } catch (error) {
      setCombinedVideoExists(false);
    }
  };

  useEffect(() => {
    checkCombinedVideo();
    setIsOpen(true);
  }, [isCombiningProject, combinedFileName]);

  return (
    <div className="fixed bottom-4 left-6 z-10">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full max-w-md bg-black/25 backdrop-blur-xl shadow-lg rounded-lg overflow-hidden"
      >
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-base font-medium text-white">Rezultat</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {combinedVideoExists && videoSrc ? (
            <div className="p-4">
              <video ref={videoRef} controls className="w-full">
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : isCombiningProject ? (
            <div className="flex flex-col items-center gap-4 w-fit px-12 pb-12">
              <span className="font-bold text-[#74ff92]">Łączenie...</span>
              <HashLoader color="#74ff92" size={56} />
            </div>
          ) : (
            <div className="p-4 text-gray-500">Brak połączonego pliku.</div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
