"use client";

import {
  useStoredValueContext,
  VideoObject,
} from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideosControls from "@/components/videos-controls";
import clsx from "clsx";
import { debounce } from "lodash";
import {
  ArrowBigLeft,
  ArrowBigRight,
  FileCheck,
  Frown,
  Images,
  MousePointerClick,
  Save,
  Search,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CgPexels } from "react-icons/cg";
import { SiOpenai, SiPixabay, SiYoutube } from "react-icons/si";

interface FindMatchingVideoProps {
  queryTag: string;
  setQueryTag: React.Dispatch<React.SetStateAction<string>>;
  newVideo: VideoObject | null;
  setNewVideo: React.Dispatch<React.SetStateAction<VideoObject | null>>;
  initialVideo: VideoObject | null;
}

export default function FindMatchingVideo({
  queryTag,
  setQueryTag,
  newVideo,
  setNewVideo,
  initialVideo,
}: FindMatchingVideoProps) {
  const { items } = useStoredValueContext();
  const [source, setSource] = useState<
    "pixabay" | "pexels" | "istock" | "youtube" | "sora" | "attachment"
  >("pixabay");
  const [isLoading, setIsLoading] = useState(false);
  const [videoObjects, setVideoObjects] = useState<VideoObject[] | null>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const maxResults = 4; // Define maxResults with an appropriate value

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

      const { videoObjects, totalResults } = await response.json();
      setVideoObjects(videoObjects);
      setTotalResults(totalResults);
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

  // Disable next button if on the last page
  const isLastPage = page * maxResults >= totalResults;

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
          disabled
        >
          <CgPexels size={18} /> Pexels
        </Button>
        <Button
          variant={source === "istock" ? "default" : "outline"}
          onClick={() => setSource("istock")}
          disabled
        >
          <Images size={18} /> iStock
        </Button>
        <Button
          variant={source === "youtube" ? "default" : "outline"}
          onClick={() => setSource("youtube")}
          disabled
        >
          <SiYoutube size={18} /> YouTube
        </Button>
        <Button
          variant={source === "sora" ? "default" : "outline"}
          onClick={() => setSource("sora")}
          disabled
        >
          <SiOpenai size={18} /> Sora AI
        </Button>
        <Button
          variant={source === "attachment" ? "default" : "outline"}
          onClick={() => setSource("attachment")}
          disabled
        >
          <Upload size={18} /> Własny załącznik
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

      <div>
        <ul
          id="video-list"
          className="flex flex-wrap justify-between gap-6 h-[550px] overflow-auto"
        >
          {videoObjects &&
            videoObjects.map((object) => {
              // Get the index of the last video from videos
              const lastVideoIndex = Array.isArray(object.videos)
                ? object.videos.length - 1
                : 0;
              // Get the url of lowest resolution video for faster loading
              const lowestResolutionVideo = object.videos[lastVideoIndex].url;

              const isSaved = initialVideo?.id === object.id;

              // Check if video is selected
              const isSelected = object.id === newVideo?.id;

              // Check if our object id is in any of item video id so we will not used same video twice
              const isAlreadyUsed = items.some(
                (item) => item.video?.id === object.id
              );

              console.log("object.id:", object.id);
              console.log("newVideo?.id:", newVideo?.id);
              console.log("initialVideo?.id:", initialVideo?.id);
              console.log("isSelected:", isSelected);
              console.log("isSaved:", isSaved);

              return (
                <li
                  key={object.id}
                  style={{
                    border:
                      isAlreadyUsed && !isSaved
                        ? "2px solid red"
                        : isSelected
                        ? "2px solid #0047b3"
                        : isSaved
                        ? "2px solid green"
                        : "2px solid transparent",
                    opacity: isAlreadyUsed && !isSaved ? 0.5 : 1,
                  }}
                  className="relative rounded-md"
                >
                  <video controls autoPlay className="w-fit h-64 rounded-sm">
                    <source src={lowestResolutionVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    className="absolute top-2 right-2"
                    onClick={() => setNewVideo(object)}
                    variant={isSelected ? "default" : "outline"}
                    disabled={isAlreadyUsed && !isSaved}
                  >
                    {isSelected ? (
                      <>
                        <FileCheck size={18} /> Wybrane
                      </>
                    ) : isSaved ? (
                      <>
                        <Save size={18} /> Zapisane
                      </>
                    ) : isAlreadyUsed ? (
                      <>
                        <Frown size={18} /> Wykorzystane
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
            <ArrowBigLeft size={18} /> Poprzedni
          </Button>

          <VideosControls videoObjects={videoObjects} />

          <Button onClick={handleNextPage} disabled={isLastPage || isLoading}>
            Następny <ArrowBigRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
