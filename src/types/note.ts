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

export interface NoteListProps {
  noteMetadata: NoteListData;
  isPending?: boolean;
}

export interface NoteCardProps {
  note: NoteData;
  noteId: string;
}
