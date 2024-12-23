"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PlayAudioButton({ file }: { file: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ensure the audio is preloaded when the component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // Preload the audio
    }
  }, [file]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }

    setIsPlaying((prev) => !prev);
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="bg-gray-950/20 hover:bg-gray-600"
        onClick={handlePlay}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </Button>
      <audio
        src={`/api/get-audio/${file}`}
        ref={audioRef}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
    </>
  );
}
