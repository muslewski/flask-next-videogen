"use client";

import { VideoObject } from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function VideosControls({
  videoObjects,
}: {
  videoObjects: VideoObject[] | null;
}) {
  const [isVolumeOff, setIsVolumeOff] = useState(false);
  const [areVideosPaused, setAreVideosPaused] = useState(false);

  const updateVideoElements = () => {
    const videoList = document.getElementById("video-list");
    if (videoList) {
      const videos = videoList.querySelectorAll("video");
      videos.forEach((video) => {
        if (!document.contains(video)) return; // Check if video is still in the document
        video.muted = isVolumeOff;
        if (areVideosPaused) {
          video.pause();
        } else {
          video.play().catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Error playing video:", error);
            }
          });
        }
      });
    }
  };

  const handleToggleVolume = () => {
    setIsVolumeOff((prevState) => {
      const newVolumeState = !prevState;
      updateVideoElements();
      return newVolumeState;
    });
  };

  const handleTogglePause = () => {
    setAreVideosPaused((prevState) => {
      const newPauseState = !prevState;
      updateVideoElements();
      return newPauseState;
    });
  };

  useEffect(() => {
    updateVideoElements();
  }, [videoObjects, isVolumeOff, areVideosPaused]);

  return (
    <div className="flex space-x-4">
      <Button onClick={handleToggleVolume} variant="ghost">
        {isVolumeOff ? <VolumeOff size={18} /> : <Volume2 size={18} />}
      </Button>
      <Button onClick={handleTogglePause} variant="ghost">
        {areVideosPaused ? <Play size={18} /> : <Pause size={18} />}
      </Button>
    </div>
  );
}
