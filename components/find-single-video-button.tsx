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

export default function FindSingleVideoButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="bg-gray-950/20 hover:bg-gray-600"
        >
          <Video size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[85%] min-h-[75%]">
        <DialogHeader>
          <DialogTitle>Znajdź idealne Video</DialogTitle>
          <DialogDescription>
            Tutaj możesz wybrać film, który najlepiej pasuje do Twojego tekstu.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Zapisz zmiany
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
