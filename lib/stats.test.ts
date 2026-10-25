import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cards,
  everyFrontHasBack,
  sectionOrder,
  sectionSets,
} from "./stats.ts";

describe("stat card pairing", () => {
  it("gives every front a distinct filled back", () => {
    assert.equal(everyFrontHasBack(cards), true);
    assert.equal(cards.length, 77);
  });

  it("keeps unique ids and grouped sections", () => {
    const ids = cards.map((card) => card.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.deepEqual(
      sectionSets.map((set) => set.title),
      sectionOrder,
    );
    const grouped = sectionSets.reduce((sum, set) => sum + set.cardCount, 0);
    assert.equal(grouped, cards.length);
  });

  it("fills blanks with figures rather than leaving underscores", () => {
    for (const card of cards) {
      assert.match(card.front, /_/);
      assert.doesNotMatch(card.back.trim(), /^_+$/);
      assert.match(card.back, /[0-9]/);
    }
  });
});
