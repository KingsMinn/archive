"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getNoteContents,
  getNoteMetadata,
  getNoteList,
} from "@/lib/notes/getNote";
import { NoteList } from "./NoteList";
import { NoteContent } from "./NoteContent";
import { NoteListData, NoteMetadata } from "@/types/note";

export default function NoteLayout() {
  const [noteContent, setNoteContent] = useState("");
  const [isLoadingList, startLoadingList] = useTransition();
  const [isLoadingContent, startLoadingContent] = useTransition();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [entireNoteMetadata, setEntireNoteMetadata] = useState<NoteListData>(
    {}
  );
  const [noteMetadata, setNoteMetadata] = useState<NoteMetadata | null>(null);

  useEffect(() => {
    startLoadingList(async () => {
      const metadata = await getNoteList();
      setEntireNoteMetadata(metadata);
    });
  }, []);

  function handleListClick(filename: string, subPath: string) {
    setSelectedNote(filename);
    startLoadingContent(async () => {
      const content = await getNoteContents(filename, subPath, false);
      const metadata = await getNoteMetadata(filename, subPath);
      setNoteContent(content);
      setNoteMetadata(metadata);
    });
  }

  return (
    <div className="flex gap-[48px] relative">
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
