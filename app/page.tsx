import { HomeClient } from "@/components/HomeClient";
import { getAllSets, ALL_SLUG } from "@/lib/stats";

export default function HomePage() {
  const sets = getAllSets();
  const practise = sets.find((set) => set.slug === ALL_SLUG);
  const sections = sets.filter((set) => set.slug !== ALL_SLUG);

  if (!practise) {
    throw new Error("Practise set is missing");
  }

  return <HomeClient practise={practise} sections={sections} />;
}
