"use client";

import type { StatCard } from "@/lib/types";

type FlashcardProps = {
  card: StatCard;
  flipped: boolean;
  showSection: boolean;
  onFlip: () => void;
};

export function Flashcard({
  card,
  flipped,
  showSection,
  onFlip,
}: FlashcardProps) {
  return (
    <button
      type="button"
      className="flashcard"
      onClick={onFlip}
      aria-label={flipped ? "Show the blanked stat" : "Show the filled stat"}
    >
      <div className={`flashcard-inner${flipped ? " is-flipped" : ""}`}>
        <div className="flashcard-face flashcard-front">
          <div className="flashcard-scroll">
            <p className="flashcard-text">{card.front}</p>
            {showSection ? <p className="flashcard-category">{card.section}</p> : null}
          </div>
        </div>
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-scroll">
            <p className="flashcard-text">{card.back}</p>
            {showSection ? <p className="flashcard-category">{card.section}</p> : null}
          </div>
        </div>
      </div>
    </button>
  );
}
