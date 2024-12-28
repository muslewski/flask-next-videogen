"use client";

import {
  useStoredValueContext,
  VideoObject,
} from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce, set } from "lodash";
import {
  FileCheck,
  MonitorPlay,
  MousePointerClick,
  Search,
} from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { CgPexels } from "react-icons/cg";
import { SiPixabay } from "react-icons/si";

interface FindMatchingVideoProps {
  queryTag: string;
  setQueryTag: React.Dispatch<React.SetStateAction<string>>;
  newVideo: VideoObject | null;
  setNewVideo: React.Dispatch<React.SetStateAction<VideoObject | null>>;
}

export default function FindMatchingVideo({
  queryTag,
  setQueryTag,
  newVideo,
  setNewVideo,
}: FindMatchingVideoProps) {
  const { usedVideoIDs } = useStoredValueContext();

  const [source, setSource] = useState<"pixabay" | "pexels">("pixabay");
  const [isLoading, setIsLoading] = useState(false);
  const [videoObjects, setVideoObjects] = useState<VideoObject[] | null>([]);
  const [page, setPage] = useState(1);

  const handleQueryChanges = useCallback(
    debounce((query: string) => {
      setPage(1);
      handleSearch(query, 1);
    }, 500),
    []
  );

  // when query tag changes, reset page
  useEffect(() => {
    handleQueryChanges(queryTag);
  }, [queryTag, handleQueryChanges]);

  const handleSearch = async (query: string, page: number) => {
    setIsLoading(true);
    // Reset video links
    setVideoObjects(null);
    try {
      // TODO: Add desired resolution
      const response = await fetch("/api/find-video-pixabay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryTag: query, page }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { videoObjects } = await response.json();
      setVideoObjects(videoObjects);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(queryTag, nextPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      handleSearch(queryTag, prevPage);
    }
  };

  return (
    <div className="space-y-6 h-fit py-4 px-6 bg-gradient-to-br from-gray-800/5 rounded-xl">
      <b className="flex gap-2 items-center">
        <Search size={18} />
        Znajdź idealny film
      </b>

      <div className="flex space-x-4 items-center">
        <span>Wybierz źródło:</span>
        <Button
          variant={source === "pixabay" ? "default" : "outline"}
          onClick={() => setSource("pixabay")}
        >
          <SiPixabay size={18} /> Pixabay
        </Button>
        <Button
          variant={source === "pexels" ? "default" : "outline"}
          onClick={() => setSource("pexels")}
        >
          <CgPexels size={18} /> Pexels
        </Button>
      </div>

      <div className="flex gap-6 items-center">
        {/* <Button
          onClick={() => handleSearch(queryTag, page)}
          disabled={isLoading}
        >
          <MonitorPlay size={18} /> {isLoading ? "Szukam..." : "Szukaj"}
        </Button> */}

        <div className="flex gap-2 items-center">
          <Input
            type="text"
            value={queryTag}
            onChange={(e) => setQueryTag(e.target.value)}
            placeholder="Enter query tag"
          />
        </div>
      </div>

      {videoObjects && (
        <div>
          <ul className="flex flex-wrap justify-between gap-6 max-h-[550px] overflow-auto">
            {videoObjects.map((object) => {
              const lastVideoIndex = Array.isArray(object.videos)
                ? object.videos.length - 1
                : 0;
              const lowestResolutionVideo = object.videos[lastVideoIndex].url;

              const isActive = object.id === newVideo?.id;

              return (
                <li
                  key={object.id}
                  className="relative rounded-md"
                  style={{
                    border:
                      usedVideoIDs?.includes(object.id) && !isActive
                        ? "2px dashed red"
                        : "none",
                  }}
                >
                  <video controls autoPlay className="w-fit h-64 rounded-sm">
                    <source src={lowestResolutionVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    className="absolute top-2 right-2"
                    onClick={() => setNewVideo(object)}
                    variant={isActive ? "default" : "outline"}
                  >
                    {isActive ? (
                      <>
                        <FileCheck size={18} /> Wybrano
                      </>
                    ) : (
                      <>
                        <MousePointerClick size={18} /> Wybierz
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={isLoading}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
