"use client";

import AudioDetails from "@/components/audio-details";
import FindMatchingVideo from "@/components/find-matching-video";
import FindWordChatGpt from "@/components/find-word-chat-gpt";
import {
  ItemProps,
  useStoredValueContext,
  VideoObject,
} from "@/components/stored-value-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { set } from "lodash";

import { Video } from "lucide-react";
import { useEffect, useState } from "react";

interface FindSigmleVideoButtonProps {
  item: ItemProps;
  updateVideoData: (id: string, newVideo: VideoObject) => void;
}

export default function FindSingleVideoButton({
  item,
  updateVideoData,
}: FindSigmleVideoButtonProps) {
  const { setIsSavingVideo } = useStoredValueContext();

  const [findTagInstruction, setFindTagInstruction] = useState<string>(
    `Please extract exactly three single keywords from the following video script. The keywords should be:
- keywords can only be in English language,
- Common english words suitable for stock media searches (e.g., on Pixabay or Pexels)
- Separated by commas
- Simple nouns or verbs that capture the main themes
- No phrases or complex terms
- Example response format: "tree, water, sunset"

Return only result from:`
  );
  const [queryTag, setQueryTag] = useState<string>("");
  const [newVideo, setNewVideo] = useState<VideoObject | null>(null);
  const [initialVideo, setInitialVideo] = useState<VideoObject | null>(
    item.video
  );
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  // Update initialVideo when item.video changes
  useEffect(() => {
    setInitialVideo(item.video);

    setNewVideo(item.video);
  }, [item.video]);

  //  Function to remove previous video
  const handleRemovePreviousVideo = async (videoFileName: string | null) => {
    if (!videoFileName) return;

    try {
      const response = await fetch(`/api/remove-video/${videoFileName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove the previous video");
      }
    } catch (error) {
      console.error("Error removing previous video:", error);
    }
  };

  // Function to save changes
  const handleSaveChanges = async () => {
    if (newVideo && newVideo !== initialVideo) {
      // Remove previous video
      if (initialVideo && initialVideo.videoFileName) {
        await handleRemovePreviousVideo(initialVideo.videoFileName);
      }

      // Set videoUrl to the second best quality video url
      const videoUrl = newVideo.videos?.[1].url;

      setIsSavingVideo(true);

      try {
        const response = await fetch("/api/save-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl,
          }),
        });
        const data = await response.json();
        const { videoFileName } = data;
        setVideoFileName(videoFileName);
        newVideo.videoFileName = videoFileName;
      } catch (error) {
        console.error("Error saving video:", error);
      } finally {
        updateVideoData(item.id, newVideo);
        setIsSavingVideo(false);
      }
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setNewVideo(initialVideo);
    }
  };

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="bg-gray-950/20 hover:bg-gray-600"
        >
          <Video size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[85%] h-[95%] overflow-y-hidden">
        <DialogHeader>
          <DialogTitle>Znajdź idealne Video</DialogTitle>
          <DialogDescription>
            Tutaj możesz wybrać film, który najlepiej pasuje do Twojego tekstu.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-12">
          <div className="max-w-xl space-y-12">
            <AudioDetails
              fileName={item.audioFileName}
              duration={item.audioDuration}
              voice={item.voice}
            />
            <FindWordChatGpt
              findTagInstruction={findTagInstruction}
              setFindTagInstruction={setFindTagInstruction}
              text={item.text}
              queryTag={queryTag}
              setQueryTag={setQueryTag}
            />
          </div>

          <div className="w-full h-fit">
            <FindMatchingVideo
              queryTag={queryTag}
              setQueryTag={setQueryTag}
              newVideo={newVideo}
              setNewVideo={setNewVideo}
              initialVideo={initialVideo}
              audioDuration={item.audioDuration}
            />
          </div>
        </div>

        <DialogFooter className="">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveChanges}
            >
              Zapisz zmiany
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
