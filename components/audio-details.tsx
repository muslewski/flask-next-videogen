import { Headphones } from "lucide-react";

export default function AudioDetails({
  fileName,
}: {
  fileName: string | null;
}) {
  return (
    <div className="space-y-6 h-fit py-4 px-6 bg-gradient-to-br from-gray-800/5 rounded-xl">
      <b className="flex gap-2 items-center">
        <Headphones size={18} />
        Odtwórz audio
      </b>
      <audio controls src={`/api/get-audio/${fileName}`} />
    </div>
  );
}
