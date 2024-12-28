import { Button } from "@/components/ui/button";
import { FileVideo, Video } from "lucide-react";

export default function PreviewVideoButton({ file }: { file: string }) {
  return (
    <Button
      size="icon"
      variant="outline"
      className="bg-gray-950/20 hover:bg-gray-600"
    >
      <FileVideo size={18} />
    </Button>
  );
}
