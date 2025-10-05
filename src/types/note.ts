export interface NoteMetadata {
  filename: string;
  title: string;
  date: string | Date;
  updated: string | Date;
  tags: string[];
  published: boolean;
  aliases: string[];
  preview?: string;
}

export interface NoteData extends NoteMetadata {
  path: string;
}

export type NoteListData = Record<string, NoteData>;

interface HandleListClick {
  handleClick: (filename: string, subPath: string) => void;
}

export interface NoteListProps extends HandleListClick {
  noteMetadata: NoteListData;
  selectedNote: string | null;
  isPending?: boolean;
}

export interface NoteCardProps extends HandleListClick {
  selectedNote: string | null;
  note: NoteData;
}
