import AddText from "@/components/add-text";
import CombineButton from "@/components/combine-button";
import CombineDisplay from "@/components/combine-display";
import DeleteAll from "@/components/delete-all";
import DisplayText from "@/components/display-text";
import ElevenLabsCredits from "@/components/eleven-labs-credits";
import GenerateAudioButton from "@/components/generate-audio-button";
import GenerateScenarioButton from "@/components/generate-scenario-button";
import AutoFindVideosButton from "@/components/auto-find-videos-button";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/3 p-6 sticky top-0 h-screen overflow-auto flex flex-col gap-12 justify-between">
        <AddText />

        <div className="flex flex-col gap-12">
          <div className="flex flex-wrap items-center gap-6 self-end bg-gradient-to-br from-gray-600/5 rounded-xl px-4 py-3">
            <GenerateScenarioButton />
            <GenerateAudioButton />
            <AutoFindVideosButton />
            <CombineButton />

            <DeleteAll />
          </div>
          <ElevenLabsCredits />
        </div>

        {/* Absolute bottom right */}
        <CombineDisplay />
      </div>

      {/* Right Side */}
      <div className="w-2/3 p-6">
        <DisplayText />
      </div>
    </div>
  );
}
