"use client";

import { useStoredValueContext } from "@/components/stored-value-context";
import { useEffect, useRef, useState } from "react";

export default function CombineDisplay() {
  const { isCombiningProject, combinedFileName } = useStoredValueContext();

  const [combinedVideoExists, setCombinedVideoExists] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const checkCombinedVideo = async () => {
    if (!combinedFileName) {
      return;
    }
    try {
      const response = await fetch(`/api/get-output/${combinedFileName}`);
      setCombinedVideoExists(response.ok);

      if (response.ok && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.load();
      }
    } catch (error) {
      setCombinedVideoExists(false);
    }
  };

  useEffect(() => {
    checkCombinedVideo();
  }, [isCombiningProject, combinedFileName]);

  return (
    <div className="self-end">
      {combinedVideoExists && combinedFileName && (
        <div className="space-y-2">
          <h3 className="text-base font-medium text-gray-700">
            Połączony plik:
          </h3>
          <video ref={videoRef} controls>
            <source
              src={`/api/get-output/${combinedFileName}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
