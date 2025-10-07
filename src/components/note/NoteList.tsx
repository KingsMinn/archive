import { NoteCardProps, NoteListProps } from "@/types/note";
import Loading from "../ui/Loading";
import { relativeDate } from "@/lib/utils/relativeDate";
import Link from "next/link";

function NoteCard({ note, noteId }: NoteCardProps) {
  return (
    <li key={note.filename} className={`cursor-pointer`}>
      <Link href={`note/${noteId}`}>
        <p>{note.path}</p>
        <h3>{note.title}</h3>
        <p>{note.preview}...</p>
        <span>{relativeDate(note.date)}</span>
      </Link>
    </li>
  );
}

export function NoteList({ noteMetadata, isPending }: NoteListProps) {
  if (isPending) return <Loading />;
  return (
    <ul className="max-w-[960px] flex flex-col gap-[24px]">
      {Object.keys(noteMetadata).map((note) => (
        <NoteCard key={note} note={noteMetadata[note]} noteId={note} />
      ))}
    </ul>
  );
}
