"use client";

import { TextItemProps } from "@/components/home";
import { useEffect, useState } from "react";

export default function ElevenLabsCredits({
  isGenerating,
}: {
  isGenerating: boolean;
}) {
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [usedCredits, setUsedCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // When text items change, fetch the credits from the server
  useEffect(() => {
    // fetch the credits from the server
    const fetchCredits = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/eleven-labs-credits");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const { characterCount, characterLimit } = await response.json();
        setTotalCredits(characterLimit);
        setUsedCredits(characterCount);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [isGenerating]);

  const percentage =
    totalCredits && usedCredits ? (usedCredits / totalCredits) * 100 : 0;

  return (
    <div className="w-full max-w-md self-end">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex gap-2">
          Wykorzystane kredyty
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {usedCredits} / {totalCredits}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-2.5 rounded-full ${
            isLoading
              ? "animate-pulse bg-gradient-to-r from-blue-500 to-indigo-500"
              : "bg-blue-600"
          }`}
          style={{
            width: `${percentage}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
}
