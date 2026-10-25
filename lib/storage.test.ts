import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { clearSessions, loadSession, saveSession, STORAGE_KEY } from "./storage.ts";
import { createInitialState, goBack, rateCurrent } from "./deck.ts";

const store = new Map<string, string>();

function installMemoryStorage() {
  const localStorage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
  (globalThis as { window?: unknown }).window = { localStorage };
}

describe("session persistence", () => {
  beforeEach(() => {
    store.clear();
    installMemoryStorage();
  });

  it("reloads ratings and the exact history after mount", () => {
    const cardIds = ["a", "b", "c"];
    let state = createInitialState(cardIds, () => 0);
    state = rateCurrent(state, -2, cardIds, () => 0.99);
    saveSession("practise:All", state);

    const reloaded = loadSession("practise:All", cardIds, () => 0.5);
    assert.deepEqual(
      reloaded.history.map((entry) => entry.cardId),
      state.history.map((entry) => entry.cardId),
    );
    assert.equal(reloaded.history[0]?.rating, -2);
    assert.equal(reloaded.index, state.index);
    assert.equal(reloaded.ratings.a, -2);
    assert.ok(store.has(STORAGE_KEY));
  });

  it("walks back through the persisted history without reshuffling", () => {
    const cardIds = ["a", "b", "c"];
    let state = createInitialState(cardIds, () => 0);
    state = rateCurrent(state, -1, cardIds, () => 0.5);
    saveSession("inflation", state);

    const reloaded = loadSession("inflation", cardIds);
    const snapshot = reloaded.history.map((entry) => entry.cardId);
    const backed = goBack(reloaded);
    assert.deepEqual(
      backed.history.map((entry) => entry.cardId),
      snapshot,
    );
    assert.equal(backed.index, 0);
  });

  it("clears stored ratings", () => {
    saveSession("practise:All", createInitialState(["a"], () => 0));
    clearSessions();
    assert.equal(store.has(STORAGE_KEY), false);
  });
});
