"use client";

import { useState } from "react";

export default function DisplayThreeVideos() {
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<string[]>([]);

  const fetchVideos = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/get-videos");

      if (response.ok) {
        console.log("Videos fetched successfully");
        const urls = await response.json();
        setVideos(urls);
        console.log("Videos:", videos[0], videos[1], videos[2]);
      } else {
        console.error("Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={fetchVideos}
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Searching..." : "Find Videos"}
      </button>

      <div className="flex items-center justify-center gap-12">
        {videos.map((video, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <video
              src={`api/videos/${video}`}
              controls
              className="rounded-lg shadow-lg"
              style={{ width: "320px", height: "240px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
