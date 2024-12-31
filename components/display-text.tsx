"use client";

import {
  ItemProps,
  useStoredValueContext,
  VideoObject,
} from "@/components/stored-value-context";
import TextItem from "@/components/text-item";
import { VoiceActor } from "@/helper/available-voice-actors";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function DisplayText() {
  const { setItems, items } = useStoredValueContext();

  const handleEdit = (
    id: string,
    newText: string,
    newVoiceActor: VoiceActor | null
  ) => {
    // Create new id in order to force re-render
    const newId = uuidv4();

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              id: newId,
              text: newText,
              voice: newVoiceActor,
              audioFileName: null,
              audioDuration: null,
              videoFileName: null,
              videoDuration: null,
            }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateVideoData = (id: string, newVideo: VideoObject | null) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, video: newVideo } : item
      )
    );
  };

  const updateItem = (id: string, newItem: ItemProps) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? newItem : item))
    );
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
            updateVideoData={updateVideoData}
            updateItem={updateItem}
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
