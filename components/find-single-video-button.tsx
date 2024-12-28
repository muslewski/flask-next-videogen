"use client";

import AudioDetails from "@/components/audio-details";
import FindMatchingVideo from "@/components/find-matching-video";
import FindWordChatGpt from "@/components/find-word-chat-gpt";
import { ItemProps, VideoObject } from "@/components/stored-value-context";
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

import { Video } from "lucide-react";
import { useState } from "react";

interface FindSigmleVideoButtonProps {
  item: ItemProps;
  updateVideoData: (id: string, newVideo: VideoObject) => void;
}

export default function FindSingleVideoButton({
  item,
  updateVideoData,
}: FindSigmleVideoButtonProps) {
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
  const initialVideo = item.video as VideoObject;
  const handleSaveChanges = () => {
    if (newVideo && newVideo !== initialVideo) {
      updateVideoData(item.id, newVideo);
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
      <DialogContent className="min-w-[85%] min-h-[75%] max-h-[95%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Znajdź idealne Video</DialogTitle>
          <DialogDescription>
            Tutaj możesz wybrać film, który najlepiej pasuje do Twojego tekstu.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-12">
          <div className="max-w-xl space-y-12">
            <AudioDetails fileName={item.audioFileName} voice={item.voice} />
            <FindWordChatGpt
              findTagInstruction={findTagInstruction}
              setFindTagInstruction={setFindTagInstruction}
              text={item.text}
              queryTag={queryTag}
              setQueryTag={setQueryTag}
            />
          </div>

          <div className="w-full">
            <FindMatchingVideo
              queryTag={queryTag}
              setQueryTag={setQueryTag}
              newVideo={newVideo}
              setNewVideo={setNewVideo}
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
