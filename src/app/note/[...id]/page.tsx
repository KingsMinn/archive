import ReactMarkdown from "react-markdown";
import NoteDate from "@/components/note/NoteDate";
import { getNoteById, getNoteListPaths } from "@/lib/notes/getNote";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60; // 1분마다 재검증, ISR

export async function generateStaticParams() {
  const paths = await getNoteListPaths();

  return paths.map((noteId) => ({
    id: noteId.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string[] };
}): Promise<Metadata> {
  const noteId = params.id.join("/");
  const noteData = await getNoteById(noteId);

  if (!noteData) return { title: "노트를 찾을 수 없어요" };

  return {
    title: noteData.metadata.title,
    description: noteData.metadata.preview,
  };
}

export default async function NotePage({
  params,
}: {
  params: { id: string[] };
}) {
  const noteId = params.id.join("/");
  const noteData = await getNoteById(noteId);

  if (!noteData) notFound();

  const { metadata, content } = noteData;

  return (
    <div className="flex grow h-[100vh] justify-center overflow-scroll">
      <article className="w-[540px] min-w-[540px]">
        <h1 className="text-[48px]">{metadata.title}</h1>
        <NoteDate date={metadata.date} />
        <hr />
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
