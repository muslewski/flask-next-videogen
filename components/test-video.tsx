"use client";

import { useState } from "react";

const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVideo = async () => {
    setLoading(true);

    try {
      // Make a request to Flask to generate the video
      const response = await fetch("http://localhost:3000/api/test");

      if (response.ok) {
        // Assuming Flask sends the video back as a file
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
      } else {
        console.error("Failed to fetch video");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchVideo} disabled={loading} className="border-2 ">
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {videoUrl ? (
        <div>
          <video width="640" height="360" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p>No video generated yet.</p>
      )}
    </div>
  );
};

export default VideoPlayer;
