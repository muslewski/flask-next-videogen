import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  availableVoiceActors,
  VoiceActor,
} from "@/helper/available-voice-actors";

interface VoiceSelectorProps {
  voice: VoiceActor | null;
  setVoice: React.Dispatch<React.SetStateAction<VoiceActor | null>>;
  clearError?: () => void;
}

export default function VoiceSelector({
  voice,
  setVoice,
  clearError,
}: VoiceSelectorProps) {
  return (
    <Select
      value={voice ? voice.id : ""}
      onValueChange={(value) => {
        const selectedVoice =
          availableVoiceActors.find((actor) => actor.id === value) || null;
        setVoice(selectedVoice);
        if (clearError) clearError();
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Wybierz głos" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableVoiceActors.map((actor) => (
            <SelectItem value={actor.id} key={actor.id}>
              <span className="bg-gray-950/50 rounded-xl p-1 text-lg">
                {actor.emoji}
              </span>
              <span className="ml-2">{actor.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
