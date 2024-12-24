import { DeleteDialog } from "@/components/delete-dialog";
import { EditDialog } from "@/components/edit-dialog";
import FindSingleVideoButton from "@/components/find-single-video-button";
import { TextItemProps } from "@/components/home";
import PlayAudioButton from "@/components/play-audio-button";
import { VoiceActor } from "@/helper/available-voice-actors";
import { formatTime } from "@/helper/format-time";
import { removeFile } from "@/helper/remove-file";
import clsx from "clsx";
import { Reorder } from "framer-motion";

interface TextItemComponentProps {
  item: TextItemProps;
  index: number;
  onEdit: (
    id: string,
    newText: string,
    newVoiceActor: VoiceActor | null
  ) => void;
  onDelete: (id: string) => void;
}

function detectNumbers(text: string): boolean {
  return /\d/.test(text); // Zwraca true, jeśli tekst zawiera cyfry
}

export default function TextItem({
  item,
  index,
  onEdit,
  onDelete,
}: TextItemComponentProps) {
  const handleEdit = (newText: string, newVoiceActor: VoiceActor | null) => {
    //  Remove audio file when text is edited
    if (item.audioFileName) removeFile(item.audioFileName);

    onEdit(item.id, newText, newVoiceActor);
  };

  const handleDelete = async () => {
    // Remove audio file
    if (item.audioFileName) removeFile(item.audioFileName);

    onDelete(item.id);
  };

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      as="li"
      className={clsx(
        "text-sm bg-gray-400/5 hover:bg-gray-500/10 transition-colors px-6 py-3 backdrop-blur-md cursor-grab active:cursor-grabbing flex items-center gap-2 justify-between",
        detectNumbers(item.text) && "text-red-500"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Display Index */}
        <span className="text-gray-500/30 bg-gray-600/5 rounded-md py-0.5 px-1 text-xs font-light">
          {index + 1}.
        </span>
        {/* Display Voice Actor Emoji */}
        {item.voice?.emoji && (
          <span className="bg-gray-950/20 rounded-md py-0.5 px-1 text-xs">
            {item.voice.emoji}
          </span>
        )}
        {/* Display Audio Duration */}
        {item.audioDuration && (
          <span className="text-blue-500/50 bg-indigo-600/5 rounded-md py-0.5 px-1 text-xs font-light">
            {formatTime(item.audioDuration)}
          </span>
        )}
        <span>{item.text}</span>
      </div>
      <div className="space-x-2 flex-shrink-0">
        <FindSingleVideoButton />
        {item.audioFileName && <PlayAudioButton file={item.audioFileName} />}

        <EditDialog
          initialText={item.text}
          initialVoiceActor={item.voice}
          onEdit={handleEdit}
        />
        <DeleteDialog onDelete={handleDelete} />
      </div>
    </Reorder.Item>
  );
}
