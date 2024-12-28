"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleKeyDown } from "@/helper/handle-key-down";
import { Trash2 } from "lucide-react";
import { useStoredValueContext } from "@/components/stored-value-context";
import { removeFile } from "@/helper/remove-file";

export default function DeleteAll() {
  const { items, setItems, setCombinedFileName, combinedFileName } =
    useStoredValueContext();
  const [open, setOpen] = useState(false);

  // Delete all items
  const handleDeleteAll = () => {
    // Delete every audio file
    items.forEach((item) => {
      if (item.audioFileName) {
        removeFile(item.audioFileName, "audio");
      }

      if (item.video && item.video.videoFileName) {
        removeFile(item.video.videoFileName, "video");
      }
    });

    if (combinedFileName) {
      console.log("CombinedURL", combinedFileName);
      removeFile(combinedFileName, "video");
      setCombinedFileName(null);
    }

    setItems([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 size={18} />
          Resetuj projekt
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onKeyDown={(e) => {
          handleKeyDown(e, handleDeleteAll);
        }}
      >
        <DialogHeader>
          <DialogTitle>Potwierdź usuwanie całkowite</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć wszystkie elementy? Tej akcji nie można
            cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDeleteAll}>
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
