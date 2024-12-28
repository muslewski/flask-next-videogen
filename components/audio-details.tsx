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

      <audio
        controls
        className="rounded-md bg-white"
        src={`/api/get-audio/${fileName}`}
      />

      {voice && (
        <div>
          Czyta:{" "}
          <span
            className="rounded-xl px-3 py-2 ml-2"
            style={{
              background: `linear-gradient(45deg, ${voice.color} 20%, transparent)`,
            }}
          >
            {voice.emoji} {voice.name}
          </span>
        </div>
      )}
    </div>
  );
}
