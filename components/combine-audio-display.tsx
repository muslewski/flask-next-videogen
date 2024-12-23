"use client";

import { useEffect, useRef, useState } from "react";

interface CombineAudioDisplayProps {
  isCombining: boolean;
  combinedAudioUrl: string | null;
}

export default function CombineAudioDisplay({
  isCombining,
  combinedAudioUrl,
}: CombineAudioDisplayProps) {
  const [combinedAudioExists, setCombinedAudioExists] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const checkCombinedAudio = async () => {
    if (!combinedAudioUrl) {
      return;
    }
    try {
      const response = await fetch(`/api/get-audio/${combinedAudioUrl}`);
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
  }, [isCombining, combinedAudioUrl]);

  return (
    <div className="self-end">
      {combinedAudioExists && combinedAudioUrl && (
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-700">
            Połączony plik audio:
          </h3>
          <audio
            ref={audioRef}
            controls
            src={`/api/get-audio/${combinedAudioUrl}`}
          />
        </div>
      )}
    </div>
  );
}
