import Link from "next/link";
import type { StatSetMeta } from "@/lib/types";
import { ALL_SLUG } from "@/lib/stats";

type HomeClientProps = {
  practise: StatSetMeta;
  sections: StatSetMeta[];
};

export function HomeClient({ practise, sections }: HomeClientProps) {
  return (
    <div className="home">
      <div className="home-atmosphere" aria-hidden="true" />
      <main className="home-main">
        <p className="home-brand">StatsSunday</p>
        <h1 className="home-title">Economics flashcards</h1>
        <p className="home-lede">
          Blanked stat lines on the front, figures on the back. Rate each card
          and the deck keeps serving the ones that still need work.
        </p>

        <section className="set-group">
          <h2 className="set-group-title">Adaptive deck</h2>
          <ul className="set-list">
            <li>
              <Link
                href={`/study/${ALL_SLUG}`}
                className="set-link set-link-practise"
              >
                <span className="set-link-title">{practise.title}</span>
                <span className="set-link-meta">
                  {practise.cardCount} stats
                </span>
                <span className="set-link-desc">{practise.description}</span>
                <span className="set-link-cta">Practise again →</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="set-group">
          <h2 className="set-group-title">Sections</h2>
          <ul className="set-list">
            {sections.map((set) => (
              <li key={set.slug}>
                <Link href={`/study/${set.slug}`} className="set-link">
                  <span className="set-link-title">{set.title}</span>
                  <span className="set-link-meta">{set.cardCount} stats</span>
                  <span className="set-link-desc">{set.description}</span>
                  <span className="set-link-cta">Practise →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
