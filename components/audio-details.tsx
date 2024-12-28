import { VoiceActor } from "@/helper/available-voice-actors";
import { Headphones } from "lucide-react";

export default function AudioDetails({
  fileName,
  voice,
}: {
  fileName: string | null;
  voice: VoiceActor | null;
}) {
  return (
    <div className="space-y-6 h-fit py-4 px-6 bg-gradient-to-br from-gray-800/5 rounded-xl">
      <b className="flex gap-2 items-center">
        <Headphones size={18} />
        Odtwórz audio
      </b>
      {voice && (
        <div
          className="rounded-xl px-3 py-2 w-fit"
          style={{
            background: `linear-gradient(45deg, ${voice.color} 20%, transparent)`,
          }}
        >
          {voice.emoji} {voice.name}
        </div>
      )}
      <audio
        controls
        className="rounded-md bg-white"
        src={`/api/get-audio/${fileName}`}
      />
    </div>
  );
}
