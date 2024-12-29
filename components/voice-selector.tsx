import { ErrorObject } from "@/components/add-text";
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
  error?: ErrorObject;
  clearError?: () => void;
}

export default function VoiceSelector({
  voice,
  setVoice,
  error,
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
      <SelectTrigger
        className={
          error?.place === "choose-voice"
            ? "border-red-500/50 text-red-500/50"
            : ""
        }
      >
        <SelectValue
          placeholder={
            error?.place === "choose-voice" ? error.text : "Wybierz głos"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableVoiceActors.map((actor) => (
            <SelectItem
              value={actor.id}
              key={actor.id}
              className="border-l-2 cursor-pointer"
              style={{
                borderColor: actor.color,
                background: `linear-gradient(45deg, ${actor.color} -99%, transparent 9%)`,
              }}
            >
              <span
                className="rounded-xl p-0.5 text-lg"
                style={{
                  background: `linear-gradient(45deg, ${actor.color} 30%, transparent)`,
                }}
              >
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
