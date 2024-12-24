import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export default function GenerateVideoButton() {
  return (
    <Button>
      <Video size={18} />
      Szukaj Video
    </Button>
  );
}
