import { useState, type FormEvent } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroPromptProps {
  chatUrl: string;
  placeholder?: string;
  submitLabel?: string;
}

export default function HeroPrompt({
  chatUrl,
  placeholder = "Posez une question à SparksLyse...",
  submitLabel = "Envoyer",
}: HeroPromptProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      window.location.href = chatUrl;
      return;
    }

    const separator = chatUrl.includes("?") ? "&" : "?";
    window.location.href = `${chatUrl}${separator}q=${encodeURIComponent(trimmed)}`;
  };

  return (
    <div className="relative w-full max-w-xl group">
      {/* Halo lumineux subtil autour de l'encart */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-200/20 via-white/15 to-purple-400/20 opacity-70 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative flex w-full items-center rounded-full border border-white/30 bg-[#0a0a0a]/50 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-white/60 focus-within:bg-[#0a0a0a]/70 focus-within:ring-2 focus-within:ring-white/20 hover:border-white/45 hover:bg-[#0a0a0a]/60"
      >
        <div className="flex pl-3.5 pr-2.5 text-amber-300">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm sm:text-base font-normal text-white placeholder-white/60 focus:outline-none"
          aria-label={placeholder}
        />

        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-md transition-all duration-200 hover:bg-neutral-200 hover:scale-[1.02] active:scale-95"
          aria-label={submitLabel}
        >
          <span>{submitLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
