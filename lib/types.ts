export type Confidence = -2 | -1 | 0 | 1 | 2;

export type StatCard = {
  id: string;
  section: string;
  front: string;
  back: string;
};

export type StatSetMeta = {
  slug: string;
  title: string;
  description: string;
  cardCount: number;
};

export type StatSet = StatSetMeta & {
  cards: StatCard[];
};

export type HistoryEntry = {
  cardId: string;
  rating?: Confidence;
};

export type DeckState = {
  ratings: Record<string, Confidence>;
  history: HistoryEntry[];
  index: number;
};

export const CONFIDENCE_LABELS: Record<
  Confidence,
  { title: string; detail: string }
> = {
  [-2]: { title: "−2", detail: "Really not confident / needs work" },
  [-1]: { title: "−1", detail: "Not confident / could use work" },
  [0]: { title: "0", detail: "Neutral" },
  [1]: { title: "1", detail: "Got this / see less" },
  [2]: { title: "2", detail: "Really got it" },
};

export const CONFIDENCE_SCALE: Confidence[] = [-2, -1, 0, 1, 2];
