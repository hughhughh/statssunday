import { notFound } from "next/navigation";
import { StudySession } from "@/components/StudySession";
import { getAllSets, getSetBySlug } from "@/lib/stats";

export function generateStaticParams() {
  return getAllSets().map((set) => ({ slug: set.slug }));
}

type StudyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudyPage({ params }: StudyPageProps) {
  const { slug } = await params;
  const set = getSetBySlug(slug);
  if (!set) {
    notFound();
  }

  return (
    <div className="study-page">
      <div className="home-atmosphere" aria-hidden="true" />
      <StudySession set={set} />
    </div>
  );
}
