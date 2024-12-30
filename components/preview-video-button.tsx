import {
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
import { FileVideo } from "lucide-react";

interface PreviewVideoButtonProps {
  file: string;
  onDelete: () => void;
}

export default function PreviewVideoButton({
  file,
  onDelete,
}: PreviewVideoButtonProps) {
  const { isSavingVideo } = useStoredValueContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="bg-green-900/30 hover:bg-green-800"
          disabled={isSavingVideo}
        >
          <FileVideo size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Podejrzyj Video</DialogTitle>
          <DialogDescription>
            Tutaj możesz podejrzeć jak wygląda Twoje video.
          </DialogDescription>
        </DialogHeader>

        <video controls autoPlay className="w-full h-auto rounded-lg">
          <source src={`/api/get-video/${file}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <DialogFooter>
          <Button
            onClick={onDelete}
            variant="destructive"
            disabled={isSavingVideo}
          >
            Usuń Video
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Zamknij Podgląd
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
