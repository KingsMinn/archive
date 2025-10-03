import Loading from "../ui/Loading";

interface NoteMetadata {
  filename: string;
  title: string;
  date: string;
  updated: string;
  tags: string[];
  published: boolean;
  aliasis: string[];
  preview?: string;
}

interface NoteListProps {
  noteMetadata: NoteMetadata[];
  handleClick: (filename: string) => void;
  selectedNote: string | null;
  isPending?: boolean;
}

interface NoteCardProps {
  handleClick: (filename: string) => void;
  selectedNote: string | null;
  note: NoteMetadata;
}

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
      <p>{note.preview}</p>
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
    <ul className="min-w-[380px] max-w-[380px]">
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
