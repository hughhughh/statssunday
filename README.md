# StatsSunday

Personal HSC-style economics stats flashcards. Blanked lines on the front, filled figures on the back, with an endless adaptive practise deck.

## Getting started

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

Tap a card to flip it, then rate how confident you feel (−2 to +2). That rating advances the deck. Low-confidence and unseen cards come up more often; the Back button walks the exact history, never a reshuffle. Ratings and history stay in `localStorage`.

## Data

Cards live in `lib/stats.ts`, grouped by section. Pairing notes are in `UNMATCHED.md`.
