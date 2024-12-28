"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { useEffect, useRef, useState } from "react";

export default function CombineAudioDisplay() {
  const { isCombiningProject, combinedFileName } = useStoredValueContext();

  const [combinedAudioExists, setCombinedAudioExists] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const checkCombinedAudio = async () => {
    if (!combinedFileName) {
      return;
    }
    try {
      const response = await fetch(`/api/get-audio/${combinedFileName}`);
      setCombinedAudioExists(response.ok);

      if (response.ok && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }
    } catch (error) {
      setCombinedAudioExists(false);
    }
  };

  useEffect(() => {
    checkCombinedAudio();
  }, [isCombiningProject, combinedFileName]);

  return (
    <div className="self-end">
      {combinedAudioExists && combinedFileName && (
        <div className="space-y-2">
          <h3 className="text-base font-medium text-gray-700">
            Połączony plik:
          </h3>
          <audio
            ref={audioRef}
            controls
            src={`/api/get-audio/${combinedFileName}`}
          />
        </div>
      )}
    </div>
  );
}
