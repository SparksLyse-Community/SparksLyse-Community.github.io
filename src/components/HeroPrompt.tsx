import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Sparkles, CornerDownLeft } from "lucide-react";

interface HeroPromptProps {
  chatUrl: string;
  placeholder?: string;
  submitLabel?: string;
  examples?: string[];
}

export default function HeroPrompt({
  chatUrl,
  placeholder = "Posez une question à SparksLyse...",
  submitLabel = "Envoyer",
  examples = [],
}: HeroPromptProps) {
  const [question, setQuestion] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Défilement automatique périodique avec transition douce
  useEffect(() => {
    if (examples.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [examples.length, isHovered]);

  const goToChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      window.location.href = chatUrl;
      return;
    }
    const separator = chatUrl.includes("?") ? "&" : "?";
    window.location.href = `${chatUrl}${separator}q=${encodeURIComponent(trimmed)}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goToChat(question);
  };

  const handleNextCard = () => {
    if (examples.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }
  };

  return (
    <div className="relative flex w-full max-w-xl flex-col items-center gap-6">
      {/* Barre de saisie principale */}
      <div className="relative w-full group">
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

      {/* Cartes d'idées empilées animées (Stacked Cards) */}
      {examples.length > 0 && (
        <div
          className="relative w-full max-w-lg h-22 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {examples.map((prompt, index) => {
            // Position relative par rapport à la carte active (0 = haut, 1 = dessous, etc.)
            const position = (index - currentIndex + examples.length) % examples.length;

            if (position > 2) return null;

            const isTop = position === 0;

            return (
              <div
                key={index}
                onClick={isTop ? () => goToChat(prompt) : handleNextCard}
                style={{
                  transform: `translateY(${position * 10}px) scale(${1 - position * 0.04})`,
                  zIndex: 30 - position,
                  opacity: isTop ? 1 : 0.85 - position * 0.25,
                }}
                className={`absolute inset-x-0 top-0 flex items-center justify-between rounded-2xl border px-4 py-3.5 backdrop-blur-xl transition-all duration-500 ease-out cursor-pointer ${
                  isTop
                    ? "border-white/30 bg-[#0a0a0c]/60 text-white shadow-2xl shadow-black/60 hover:border-white/50 hover:bg-[#0a0a0c]/70 hover:-translate-y-0.5"
                    : "border-white/15 bg-[#0a0a0c]/40 text-white/80 shadow-md"
                }`}
                title={isTop ? "Cliquer pour poser cette question" : "Cliquer pour afficher"}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-xs border border-amber-300/30">
                    💡
                  </span>
                  <p className="truncate text-xs sm:text-sm font-medium tracking-wide text-white">
                    « {prompt} »
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2 text-white/70">
                  <span className="hidden sm:inline text-xs font-medium text-white/60">Demander</span>
                  <CornerDownLeft className="h-4 w-4 text-amber-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
