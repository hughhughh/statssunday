import type { Confidence, DeckState, HistoryEntry } from "./types.ts";

/** Unseen and shaky cards dominate; 1s are rare and 2s almost never. */
export const CONFIDENCE_WEIGHTS: Record<Confidence | "unseen", number> = {
  unseen: 40,
  [-2]: 36,
  [-1]: 28,
  [0]: 8,
  [1]: 2,
  [2]: 1,
};

export function weightFor(rating: Confidence | undefined): number {
  if (rating === undefined) return CONFIDENCE_WEIGHTS.unseen;
  return CONFIDENCE_WEIGHTS[rating];
}

export function pickNextCardId(
  cardIds: readonly string[],
  ratings: Readonly<Record<string, Confidence>>,
  excludeId: string | null = null,
  random: () => number = Math.random,
): string {
  if (cardIds.length === 0) {
    throw new Error("Cannot pick from an empty deck");
  }

  const weights = cardIds.map((id) => {
    if (excludeId && id === excludeId && cardIds.length > 1) return 0;
    return weightFor(ratings[id]);
  });

  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return cardIds[0];

  let ticket = random() * total;
  for (let i = 0; i < cardIds.length; i += 1) {
    ticket -= weights[i];
    if (ticket <= 0) return cardIds[i];
  }
  return cardIds[cardIds.length - 1];
}

export function createInitialState(
  cardIds: readonly string[],
  random: () => number = Math.random,
): DeckState {
  const first = pickNextCardId(cardIds, {}, null, random);
  return {
    ratings: {},
    history: [{ cardId: first }],
    index: 0,
  };
}

export function rateCurrent(
  state: DeckState,
  rating: Confidence,
  cardIds: readonly string[],
  random: () => number = Math.random,
): DeckState {
  const current = state.history[state.index];
  if (!current) return state;

  const ratings = { ...state.ratings, [current.cardId]: rating };
  const history: HistoryEntry[] = state.history.map((entry, i) =>
    i === state.index ? { ...entry, rating } : entry,
  );

  if (state.index < history.length - 1) {
    return { ratings, history, index: state.index + 1 };
  }

  const nextId = pickNextCardId(cardIds, ratings, current.cardId, random);
  return {
    ratings,
    history: [...history, { cardId: nextId }],
    index: state.index + 1,
  };
}

export function goBack(state: DeckState): DeckState {
  if (state.index <= 0) return state;
  return { ...state, index: state.index - 1 };
}

export function currentEntry(state: DeckState): HistoryEntry | undefined {
  return state.history[state.index];
}

export function unseenCount(
  cardIds: readonly string[],
  ratings: Readonly<Record<string, Confidence>>,
): number {
  return cardIds.filter((id) => ratings[id] === undefined).length;
}
