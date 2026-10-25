import type { Confidence, DeckState } from "./types.ts";
import { createInitialState } from "./deck.ts";

export const STORAGE_KEY = "statssunday.v1";

type StoredPayload = {
  ratings: Record<string, Confidence>;
  sessions: Record<string, Pick<DeckState, "history" | "index">>;
};

function isConfidence(value: unknown): value is Confidence {
  return value === -2 || value === -1 || value === 0 || value === 1 || value === 2;
}

function parsePayload(raw: string): StoredPayload | null {
  try {
    const data = JSON.parse(raw) as Partial<StoredPayload>;
    if (!data || typeof data !== "object") return null;
    const ratings: Record<string, Confidence> = {};
    if (data.ratings && typeof data.ratings === "object") {
      for (const [id, value] of Object.entries(data.ratings)) {
        if (isConfidence(value)) ratings[id] = value;
      }
    }
    const sessions: StoredPayload["sessions"] = {};
    if (data.sessions && typeof data.sessions === "object") {
      for (const [slug, session] of Object.entries(data.sessions)) {
        if (!session || !Array.isArray(session.history)) continue;
        const history = session.history
          .filter((entry) => entry && typeof entry.cardId === "string")
          .map((entry) => ({
            cardId: entry.cardId,
            rating: isConfidence(entry.rating) ? entry.rating : undefined,
          }));
        if (history.length === 0) continue;
        const index = Math.min(
          Math.max(0, Number(session.index) || 0),
          history.length - 1,
        );
        sessions[slug] = { history, index };
      }
    }
    return { ratings, sessions };
  } catch {
    return null;
  }
}

function readPayload(): StoredPayload {
  if (typeof window === "undefined") return { ratings: {}, sessions: {} };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return (raw && parsePayload(raw)) || { ratings: {}, sessions: {} };
}

function writePayload(payload: StoredPayload) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadSession(
  slug: string,
  cardIds: readonly string[],
  random: () => number = Math.random,
): DeckState {
  const allowed = new Set(cardIds);
  const payload = readPayload();
  const session = payload.sessions[slug];
  if (!session) {
    return {
      ...createInitialState(cardIds, random),
      ratings: { ...payload.ratings },
    };
  }

  const history = session.history.filter((entry) => allowed.has(entry.cardId));
  if (history.length === 0) {
    return {
      ...createInitialState(cardIds, random),
      ratings: { ...payload.ratings },
    };
  }

  return {
    ratings: { ...payload.ratings },
    history,
    index: Math.min(session.index, history.length - 1),
  };
}

export function saveSession(slug: string, state: DeckState) {
  if (typeof window === "undefined") return;
  const payload = readPayload();
  payload.ratings = { ...payload.ratings, ...state.ratings };
  payload.sessions[slug] = { history: state.history, index: state.index };
  writePayload(payload);
}

export function clearSessions() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
