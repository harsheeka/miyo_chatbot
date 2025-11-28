import { useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeech";
import SakuraWaveform from "./SakuraWaveform";

export default function InputBar({ onSend, language }) {
  const [value, setValue] = useState("");
  const [isRecordMode, setIsRecordMode] = useState(false);

  const {
    isRecording,
    transcript,
    volume,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition(language);

  /* -------------------------------------------------------
     TEXT SUBMIT
  -------------------------------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  /* -------------------------------------------------------
     VOICE RECORDING — Start
  -------------------------------------------------------- */
  const handleMicClick = async () => {
    if (isRecordMode) return;
    setIsRecordMode(true);
    resetTranscript();
    await startRecording();
  };

  /* -------------------------------------------------------
     Cancel recording (X)
  -------------------------------------------------------- */
  const handleCancelRecording = () => {
    stopRecording();
    resetTranscript();
    setIsRecordMode(false);
  };

  /* -------------------------------------------------------
     Accept recording (✓)
  -------------------------------------------------------- */
  const handleAcceptRecording = () => {
    stopRecording();

    const spoken = transcript.trim();
    if (spoken) {
      setValue((prev) =>
        prev ? `${prev.trim()} ${spoken}`.trim() : spoken
      );
    }

    resetTranscript();
    setIsRecordMode(false);
  };

  /* -------------------------------------------------------
     RECORDING MODE UI
     (This is the part we beautified)
  -------------------------------------------------------- */
  if (isRecordMode) {
    return (
      <div className="flex items-center gap-3 w-full">

        {/* Waveform Container */}
        <div
          className="
            flex-1 
            rounded-2xl 
            px-4 py-3
            backdrop-blur-lg 
            shadow-[0_4px_18px_rgba(0,0,0,0.12)]
            border
            transition

            bg-white/85 
            border-neutral-300/60 
            text-neutral-800

            dark:bg-neutral-900/70 
            dark:border-neutral-700/60 
            dark:text-neutral-100
          "
        >
          <SakuraWaveform volume={volume} />
        </div>

        {/* Cancel (X) */}
        <button
          type="button"
          onClick={handleCancelRecording}
          className="
            h-10 w-10 rounded-full flex items-center justify-center

            border border-neutral-300 
            bg-white 
            text-neutral-800 
            shadow-sm 
            hover:bg-neutral-100

            dark:border-neutral-700 
            dark:bg-neutral-900 
            dark:text-neutral-200 
            dark:hover:bg-neutral-800
            transition
          "
          aria-label="Cancel recording"
        >
          ✕
        </button>

        {/* Accept (✓) */}
        <button
          type="button"
          onClick={handleAcceptRecording}
          className="
            h-10 w-10 
            rounded-full 
            flex 
            items-center 
            justify-center
            bg-sakura 
            text-neutral-900 
            font-semibold
            shadow-[0_0_14px_rgba(244,114,182,0.45)]
            hover:bg-pink-300 
            transition
          "
          aria-label="Use recording"
        >
          ✓
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------
     NORMAL TEXT MODE UI
  -------------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
      <div className="flex-1 relative">
        <textarea
          className="
            w-full 
            resize-none 
            rounded-2xl 
            border border-neutral-200/80 
            dark:border-neutral-700/80 
            bg-neutral-50/90 
            dark:bg-neutral-900/80
            px-3.5 py-2.5 
            text-sm 
            focus:outline-none 
            focus:ring-2 
            focus:ring-sakura/80 
            focus:border-transparent 
            max-h-32
          "
          rows={1}
          placeholder={
            language === "ja"
              ? "今日の予定や、服装について相談してみてください…"
              : "Ask Miyo about today’s weather, outfit, or makeup…"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      {/* Mic button */}
      <button
        type="button"
        onClick={handleMicClick}
        className="
          h-9 w-9 
          rounded-full 
          flex items-center justify-center 
          shadow-sm 
          border 
          bg-white 
          dark:bg-neutral-900 
          border-neutral-200 
          dark:border-neutral-700 
          hover:bg-neutral-100 
          dark:hover:bg-neutral-800 
          transition
        "
        aria-label="Start voice input"
      >
        🎙️
      </button>

      {/* Send button */}
      <button
        type="submit"
        className="
          h-9 px-3.5 
          rounded-full 
          bg-neutral-900 
          text-white 
          text-sm font-medium
          hover:bg-neutral-800
          dark:bg-neutral-50 
          dark:text-black 
          dark:hover:bg-neutral-200 
          transition
        "
      >
        Send
      </button>
    </form>
  );
}
