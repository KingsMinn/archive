export interface NoteMetadata {
  filename: string;
  title: string;
  date: Date;
  updated: string;
  tags: string[];
  published: boolean;
  aliasis: string[];
  preview?: string;
}

export interface NoteListProps {
  noteMetadata: NoteMetadata[];
  handleClick: (filename: string) => void;
  selectedNote: string | null;
  isPending?: boolean;
}

export interface NoteCardProps {
  handleClick: (filename: string) => void;
  selectedNote: string | null;
  note: NoteMetadata;
}
