import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONFIDENCE_WEIGHTS,
  createInitialState,
  goBack,
  pickNextCardId,
  rateCurrent,
  weightFor,
} from "./deck.ts";
import type { Confidence } from "./types.ts";

function sequence(values: number[]): () => number {
  let i = 0;
  return () => {
    const value = values[i] ?? 0.999;
    i += 1;
    return value;
  };
}

describe("adaptive weighting", () => {
  it("weights unseen and low confidence far above mastered cards", () => {
    assert.equal(weightFor(undefined), CONFIDENCE_WEIGHTS.unseen);
    assert.ok(weightFor(-2) > weightFor(0));
    assert.ok(weightFor(-1) > weightFor(0));
    assert.ok(weightFor(0) > weightFor(1));
    assert.ok(weightFor(1) > weightFor(2));
    assert.equal(CONFIDENCE_WEIGHTS[2], 1);
  });

  it("usually draws unseen or weak cards when a strong card is in the mix", () => {
    const cardIds = ["weak", "ok", "strong"];
    const ratings: Record<string, Confidence> = {
      weak: -2,
      ok: 0,
      strong: 2,
    };

    const counts = { weak: 0, ok: 0, strong: 0 };
    for (let i = 0; i < 10_000; i += 1) {
      const picked = pickNextCardId(cardIds, ratings);
      counts[picked as keyof typeof counts] += 1;
    }

    assert.ok(counts.weak > counts.ok * 2);
    assert.ok(counts.ok > counts.strong);
    assert.ok(counts.strong < 500);
  });

  it("avoids immediately repeating the excluded card when others exist", () => {
    const cardIds = ["a", "b"];
    const picked = pickNextCardId(cardIds, {}, "a", () => 0.1);
    assert.equal(picked, "b");
  });
});

describe("history navigation", () => {
  const cardIds = ["a", "b", "c"];

  it("appends the next card and walks back through the exact history", () => {
    let state = createInitialState(cardIds, sequence([0]));
    assert.equal(state.history[0]?.cardId, "a");
    assert.equal(state.index, 0);

    state = rateCurrent(state, -2, cardIds, sequence([0.99]));
    assert.equal(state.history.length, 2);
    assert.equal(state.history[0]?.rating, -2);
    assert.equal(state.index, 1);
    const second = state.history[1]?.cardId;
    assert.ok(second);
    assert.notEqual(second, "a");

    const afterBack = goBack(state);
    assert.equal(afterBack.index, 0);
    assert.deepEqual(
      afterBack.history.map((entry) => entry.cardId),
      state.history.map((entry) => entry.cardId),
    );
    assert.equal(afterBack.history[0]?.cardId, "a");
  });

  it("updates the rating when a history card is rated again", () => {
    let state = createInitialState(cardIds, sequence([0]));
    state = rateCurrent(state, -2, cardIds, sequence([0]));
    state = goBack(state);
    state = rateCurrent(state, 2, cardIds, sequence([0]));

    assert.equal(state.ratings.a, 2);
    assert.equal(state.history[0]?.rating, 2);
    assert.equal(state.index, 1);
    assert.equal(state.history.length, 2);
  });

  it("does not reshuffle earlier cards when going back", () => {
    let state = createInitialState(cardIds, sequence([0]));
    state = rateCurrent(state, 0, cardIds, sequence([0.5]));
    state = rateCurrent(state, 1, cardIds, sequence([0.2]));
    const snapshot = state.history.map((entry) => entry.cardId);

    state = goBack(state);
    state = goBack(state);
    assert.deepEqual(
      state.history.map((entry) => entry.cardId),
      snapshot,
    );
    assert.equal(state.index, 0);
  });
});
