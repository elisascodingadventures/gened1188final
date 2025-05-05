"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [poem, setPoem] = useState<string>("");

  // Committed settings for API
  const [committedTemp, setCommittedTemp] = useState<number>(1.2);
  const [committedRepPenalty, setCommittedRepPenalty] = useState<number>(1.0);
  // Draft settings in the panel
  const [draftTemp, setDraftTemp] = useState<number>(committedTemp);
  const [draftRepPenalty, setDraftRepPenalty] = useState<number>(committedRepPenalty);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Handle key input, including Enter to generate using committed settings
  useEffect(() => {
    const onKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        await generatePoem();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setInput((t) => t.slice(0, -1));
      } else if (e.key.length === 1) {
        setInput((t) => t + e.key);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [input, committedTemp, committedRepPenalty]);

  // Function to call the API
  const generatePoem = async () => {
    const res = await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
        temperature: committedTemp,
        repetition_penalty: committedRepPenalty,
      }),
    });
    const data = await res.json();
    setPoem(data.poem ?? "");
  };

  // Save settings and regenerate automatically using new settings
  const saveSettings = async () => {
    setCommittedTemp(draftTemp);
    setCommittedRepPenalty(draftRepPenalty);
    setShowSettings(false);
    if (input) {
      // Directly call API with new draft values, bypassing delayed state update
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          temperature: draftTemp,
          repetition_penalty: draftRepPenalty,
        }),
      });
      const data = await res.json();
      setPoem(data.poem ?? "");
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white font-helvetica text-5xl p-8 whitespace-pre-wrap">
      <span>{input}</span>
      <span className="border-r border-white animate-blink">&nbsp;</span>

      {poem && (
        <>
          <br />
          <span>{poem}</span>
        </>
      )}

      {/* Settings Toggle */}
      <div
        className="fixed bottom-4 right-4 text-xs cursor-pointer"
        onClick={() => setShowSettings((s) => !s)}
      >
        Settings
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed bottom-12 right-4 bg-black text-white p-2 rounded-lg shadow-lg w-48">
          <div className="mb-1 flex justify-between items-center">
            <strong className="text-xs">Settings</strong>
            <button className="text-xs" onClick={() => setShowSettings(false)}>
              ✕
            </button>
          </div>
          <div className="mb-1">
            <label className="block text-xs">
              Temperature: {draftTemp.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={draftTemp}
              onChange={(e) => setDraftTemp(parseFloat(e.target.value))}
              className="w-full accent-white bg-gray-700"
            />
          </div>
          <div className="mb-1">
            <label className="block text-xs">
              Repetition Penalty: {draftRepPenalty.toFixed(1)}
            </label>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={draftRepPenalty}
              onChange={(e) => setDraftRepPenalty(parseFloat(e.target.value))}
              className="w-full accent-white bg-gray-700"
            />
          </div>
          <button
            onClick={saveSettings}
            className="mt-1 w-full py-1 text-xs bg-white text-black rounded"
          >
            Save
          </button>
        </div>
      )}
    </main>
  );
}
