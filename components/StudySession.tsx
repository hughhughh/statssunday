"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Confidence, DeckState, StatCard, StatSet } from "@/lib/types";
import { CONFIDENCE_LABELS, CONFIDENCE_SCALE } from "@/lib/types";
import { currentEntry, goBack, rateCurrent, unseenCount } from "@/lib/deck";
import { clearSessions, loadSession, saveSession } from "@/lib/storage";
import { Flashcard } from "@/components/Flashcard";

type StudySessionProps = {
  set: StatSet;
};

export function StudySession({ set }: StudySessionProps) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(set.cards.map((card) => card.section)));
    return unique.length > 1 ? ["All", ...unique] : unique;
  }, [set.cards]);

  const [category, setCategory] = useState(categories[0] ?? "All");
  const [showSection, setShowSection] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [state, setState] = useState<DeckState | null>(null);
  const [sessionKey, setSessionKey] = useState(`${set.slug}:${categories[0] ?? "All"}`);
  const [hydrated, setHydrated] = useState(false);

  const filtered = useMemo(
    () =>
      category === "All"
        ? set.cards
        : set.cards.filter((card) => card.section === category),
    [category, set.cards],
  );
  const cardIds = useMemo(() => filtered.map((card) => card.id), [filtered]);
  const nextSessionKey = `${set.slug}:${category}`;

  if (typeof window !== "undefined" && !hydrated) {
    setHydrated(true);
    setState(loadSession(nextSessionKey, cardIds));
    setSessionKey(nextSessionKey);
  }

  if (hydrated && nextSessionKey !== sessionKey) {
    setSessionKey(nextSessionKey);
    setState(loadSession(nextSessionKey, cardIds));
    setFlipped(false);
  }

  useEffect(() => {
    if (hydrated && state) saveSession(sessionKey, state);
  }, [hydrated, sessionKey, state]);

  const entry = state ? currentEntry(state) : undefined;
  const card: StatCard | undefined = entry
    ? (filtered.find((item) => item.id === entry.cardId) ??
      set.cards.find((item) => item.id === entry.cardId))
    : undefined;

  const ratedCount = cardIds.filter((id) => state?.ratings[id] !== undefined).length;
  const unseen = state ? unseenCount(cardIds, state.ratings) : cardIds.length;
  const progress = cardIds.length === 0 ? 0 : (ratedCount / cardIds.length) * 100;

  function flip() {
    if (!card) return;
    setFlipped((current) => !current);
  }

  function rate(rating: Confidence) {
    if (!state || !card) return;
    setState(rateCurrent(state, rating, cardIds));
    setFlipped(false);
  }

  function back() {
    if (!state || state.index === 0) return;
    setState(goBack(state));
    setFlipped(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!card) return;
        setFlipped((current) => !current);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setState((current) => {
          if (!current || current.index === 0) return current;
          return goBack(current);
        });
        setFlipped(false);
      } else if (flipped && ["1", "2", "3", "4", "5"].includes(event.key)) {
        event.preventDefault();
        const value = (Number(event.key) - 3) as Confidence;
        setState((current) =>
          current ? rateCurrent(current, value, cardIds) : current,
        );
        setFlipped(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, cardIds, flipped]);

  function resetProgress() {
    clearSessions();
    setState(loadSession(nextSessionKey, cardIds));
    setFlipped(false);
  }

  return (
    <div className="study">
      <header className="study-header">
        <Link href="/" className="study-back">
          ← Sets
        </Link>
        <div className="study-heading">
          <p className="study-brand">StatsSunday</p>
          <h1>{set.title}</h1>
        </div>
        <p className="study-count">
          {state ? state.index + 1 : 0}
          <span aria-hidden="true"> · </span>
          {unseen} unseen
        </p>
      </header>

      {categories.length > 1 ? (
        <div className="category-row" role="tablist" aria-label="Sections">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`category-chip${category === item ? " is-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
              <span className="category-count">
                {item === "All"
                  ? set.cards.length
                  : set.cards.filter((c) => c.section === item).length}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {card ? (
        <Flashcard
          key={`${card.id}-${state?.index ?? 0}`}
          card={card}
          flipped={flipped}
          showSection={showSection}
          onFlip={flip}
        />
      ) : (
        <p className="study-empty">Loading the deck…</p>
      )}

      <div className="study-controls">
        <button
          type="button"
          className="control-btn"
          onClick={back}
          disabled={!state || state.index === 0}
        >
          Back
        </button>
        <button type="button" className="control-btn control-primary" onClick={flip}>
          {flipped ? "Show front" : "Flip"}
        </button>
      </div>

      {flipped && card ? (
        <div className="confidence-wrap">
          <p className="confidence-label">How confident?</p>
          <div className="confidence" role="group" aria-label="Confidence rating">
          {CONFIDENCE_SCALE.map((value) => {
            const label = CONFIDENCE_LABELS[value];
            const current = entry?.rating === value;
            return (
              <button
                key={value}
                type="button"
                className={`control-btn confidence-btn${current ? " is-current" : ""}`}
                onClick={() => rate(value)}
              >
                <span className="confidence-score">{label.title}</span>
                <span className="confidence-detail">{label.detail}</span>
              </button>
            );
          })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="control-btn"
        onClick={() => setShowSection((current) => !current)}
      >
        {showSection ? "Hide section" : "Reveal section"}
      </button>

      <div className="study-actions">
        <button type="button" className="text-btn" onClick={resetProgress}>
          Reset ratings
        </button>
        <p className="study-keys">
          Space to flip · ← back · 1–5 to rate after flip
        </p>
      </div>
    </div>
  );
}
