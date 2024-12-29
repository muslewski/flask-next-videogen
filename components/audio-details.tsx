import { Alert } from "@/components/ui/alert";
import { VoiceActor } from "@/helper/available-voice-actors";
import { formatTime } from "@/helper/format-time";
import { Headphones } from "lucide-react";

export default function AudioDetails({
  fileName,
  duration,
  voice,
}: {
  fileName: string | null;
  duration: number | null;
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
          className="rounded-xl px-4 py-3 w-fit font-semibold"
          style={{
            background: `linear-gradient(45deg, ${voice.color} 20%, transparent)`,
          }}
        >
          {voice.emoji} {voice.name}
        </div>
      )}
      {duration && (
        <div>
          <b>Czas trwania:</b> {formatTime(duration)}
        </div>
      )}

      {fileName ? (
        <audio
          controls
          className="rounded-md bg-white"
          src={`/api/get-audio/${fileName}`}
        />
      ) : (
        <Alert className="font-bold" variant="destructive">
          Brakuje pliku audio
        </Alert>
      )}
    </div>
  );
}
