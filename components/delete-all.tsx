"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleKeyDown } from "@/helper/handle-key-down";
import { Trash2 } from "lucide-react";

interface DeleteAllProps {
  onDeleteAll: () => void;
}

export default function DeleteAll({ onDeleteAll }: DeleteAllProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDeleteAll();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 size={18} />
          Usuń Wszystko
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onKeyDown={(e) => {
          handleKeyDown(e, handleDelete);
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć wszystkie elementy? Tej akcji nie można
            cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
