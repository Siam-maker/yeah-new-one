import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseReader } from "@/components/learning/course-reader";
import { learningTracks } from "@/lib/content/learning-index";
import { languageAlternates } from "@/lib/i18n/routing";

type Props = { params: Promise<{track: string}> };
export function generateStaticParams() { return learningTracks.map(({id}) => ({track:id})); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { track:id } = await params;
  const track = learningTracks.find((item) => item.id === id);
  return track ? {title:track.title, description:track.deck, alternates:languageAlternates(`/learn/${track.id}`,"en")} : {};
}

export default async function CoursePage({params}: Props) {
  const {track:id} = await params;
  const track = learningTracks.find((item) => item.id === id);
  if (!track) notFound();
  return <CourseReader id={track.id} />;
}
