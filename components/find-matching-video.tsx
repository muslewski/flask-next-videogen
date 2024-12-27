import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FindMatchingVideoProps {
  queryTag: string;
}

export default function FindMatchingVideo({
  queryTag,
}: FindMatchingVideoProps) {
  return (
    <div className="space-y-6 h-fit py-4 px-6 bg-gradient-to-br from-gray-800/5 rounded-xl">
      <b className="flex gap-2 items-center">
        <Search size={18} />
        Znajdź idealny film
      </b>

      <div>
        Dla zapytania: <i className="underline">{queryTag}</i>
      </div>

      <div className="flex space-x-4 items-center">
        <span>Wybierz źródło:</span>
        <Button variant="outline">Pixabay</Button>
        <Button variant="outline">Pexels</Button>
      </div>

      <Button>Szukaj</Button>
    </div>
  );
}
