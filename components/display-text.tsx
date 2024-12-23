"use client";

import { TextItemProps } from "@/components/home";
import TextItem from "@/components/text-item";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

interface DisplayTextProps {
  items: TextItemProps[];
  setItems: React.Dispatch<React.SetStateAction<TextItemProps[]>>;
}

export default function DisplayText({ items, setItems }: DisplayTextProps) {
  const handleEdit = (id: string, newText: string) => {
    // Create new id in order to force re-render
    const newId = uuidv4();

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              id: newId,
              text: newText,
              audioFileName: null,
              audioDuration: null,
            }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Scenariusz:</h2>
      <Reorder.Group
        as="ul"
        axis="y"
        values={items}
        onReorder={setItems}
        id="reorder-group"
        className="w-full flex flex-col gap-0 list-none border-2 rounded-xl overflow-hidden"
      >
        {items.map((item, index) => (
          <TextItem
            key={item.id}
            item={item}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Reorder.Group>
      <span
        className="pointer-events-none select-none opacity-0"
        id="scroll-here"
      >
        Scroll Here
      </span>
    </div>
  );
}
