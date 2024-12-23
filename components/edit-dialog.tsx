"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { handleKeyDown } from "@/helper/handle-key-down";
import { Settings2 } from "lucide-react";
import { VoiceActor } from "@/helper/available-voice-actors";
import VoiceSelector from "@/components/voice-selector";

interface EditDialogProps {
  initialText: string;
  initialVoiceActor: VoiceActor | null;
  onEdit: (newText: string, newVoiceActor: VoiceActor | null) => void;
}

export function EditDialog({
  initialText,
  initialVoiceActor,
  onEdit,
}: EditDialogProps) {
  const [text, setText] = useState(initialText);
  const [voiceActor, setVoiceActor] = useState<VoiceActor | null>(
    initialVoiceActor
  );
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (text !== initialText || voiceActor !== initialVoiceActor) {
      onEdit(text, voiceActor);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-950/20 hover:bg-gray-600"
        >
          <Settings2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Edytuj tekst</DialogTitle>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            handleKeyDown(e, handleSave);
          }}
          className="min-h-[300px]"
        />
        <VoiceSelector voice={voiceActor} setVoice={setVoiceActor} />
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
