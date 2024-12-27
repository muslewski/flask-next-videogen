import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SiOpenai } from "react-icons/si";

interface FindOneWordChatGptProps {
  text: string;
  findTagInstruction: string;
  setFindTagInstruction: React.Dispatch<React.SetStateAction<string>>;
  queryTag: string;
  setQueryTag: React.Dispatch<React.SetStateAction<string>>;
}

export default function FindWordChatGpt({
  text,
  findTagInstruction,
  setFindTagInstruction,
  queryTag,
  setQueryTag,
}: FindOneWordChatGptProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryTags, setQueryTags] = useState<string[]>([]);

  const findWordWithChatGPT = async () => {
    setIsLoading(true);

    const finalMessage = findTagInstruction + ' "' + text + '"';

    try {
      const response = await fetch("/api/find-word-chat-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalMessage }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { queryTags } = await response.json();
      setQueryTags(queryTags);
      if (queryTags.length > 0) {
        setQueryTag(queryTags[0]);
      }
    } catch (error) {
      console.error("Error with chatGPT finding queryTag: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-fit min-w-[550px] py-4 px-6 bg-gradient-to-br from-gray-800/5 rounded-xl">
      <b className="flex gap-2 items-center">
        <SiOpenai size={18} />
        Instrukcja generowania Chat GPT
      </b>

      <div className="space-y-2">
        <Textarea
          className="rounded-b-none min-h-[150px]"
          style={{ fontSize: "0.75rem" }}
          value={findTagInstruction}
          onChange={(e) => setFindTagInstruction(e.target.value)}
        />
        <span className="flex max-h-28 overflow-y-auto border-[1px] rounded-b-md p-3 text-xs bg-black/20 text-gray-200/75">
          {text}
        </span>
      </div>

      <div className="flex items-center space-x-12">
        <Button disabled={isLoading} onClick={findWordWithChatGPT}>
          {isLoading ? "Myślę..." : "Definiuj"}
        </Button>
        <div className="space-x-3">
          <span>Wybierz:</span>
          {queryTags.map((tag, index) => (
            <Button
              key={index}
              onClick={() => setQueryTag(tag)}
              variant={queryTag === tag ? "default" : "outline"}
              className="font-medium px-3 py-1 rounded-lg cursor-pointer transition-all"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
