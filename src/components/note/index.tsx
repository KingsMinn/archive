"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getNoteContents,
  getEntireNoteMetadata,
  getNoteMetadata,
} from "@/lib/notes/getNote";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";
import { NoteMetadata } from "@/types/note";

export default function NoteLayout() {
  const [noteContent, setNoteContent] = useState("");
  const [isLoadingList, startLoadingList] = useTransition();
  const [isLoadingContent, startLoadingContent] = useTransition();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [entireNoteMetadata, setEntireNoteMetadata] = useState<NoteMetadata[]>(
    []
  );
  const [noteMetadata, setNoteMetadata] = useState<NoteMetadata | null>(null);

  useEffect(() => {
    startLoadingList(async () => {
      const metadata = await getEntireNoteMetadata();
      setEntireNoteMetadata(metadata);
    });
  }, []);

  function handleListClick(filename: string) {
    setSelectedNote(filename);
    startLoadingContent(async () => {
      const content = await getNoteContents(filename, false);
      const metadata = await getNoteMetadata(filename);
      setNoteContent(content);
      setNoteMetadata(metadata);
    });
  }

  return (
    <div className="flex gap-[48px]">
      <NoteList
        noteMetadata={entireNoteMetadata}
        handleClick={handleListClick}
        selectedNote={selectedNote}
        isPending={isLoadingList}
      />
      <NoteContent
        content={noteContent}
        metadata={noteMetadata}
        isPending={isLoadingContent}
      />
    </div>
  );
}
