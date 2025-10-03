import { NoteCardProps, NoteListProps } from "@/types/note";
import Loading from "../ui/Loading";
import { relativeDate } from "@/lib/utils/relativeDate";

function NoteCard({ note, handleClick, selectedNote }: NoteCardProps) {
  return (
    <li
      key={note.filename}
      onClick={() => handleClick(note.filename)}
      className={`cursor-pointer ${
        selectedNote === note.filename ? "text-blue-800" : ""
      }`}
    >
      <h3>{note.title}</h3>
      <p>{note.preview}...</p>
      <span>{relativeDate(note.date)}</span>
    </li>
  );
}

export function NoteList({
  noteMetadata: noteMetadata,
  handleClick,
  selectedNote,
  isPending,
}: NoteListProps) {
  if (isPending) return <Loading />;
  return (
    <ul className="min-w-[380px] max-w-[380px] flex flex-col gap-[24px]">
      {noteMetadata.map((note) => (
        <NoteCard
          key={note.filename}
          note={note}
          handleClick={handleClick}
          selectedNote={selectedNote}
        />
      ))}
    </ul>
  );
}
