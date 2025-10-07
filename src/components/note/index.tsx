"use client";
import { useEffect, useState, useTransition } from "react";
import { getNoteListFull } from "@/lib/notes/getNote";
import { NoteList } from "./NoteList";
import { NoteListData } from "@/types/note";

export default function NoteLayout() {
  const [isLoadingList, startLoadingList] = useTransition();
  const [entireNoteMetadata, setEntireNoteMetadata] = useState<NoteListData>(
    {}
  );

  useEffect(() => {
    startLoadingList(async () => {
      const metadata = await getNoteListFull();
      setEntireNoteMetadata(metadata);
    });
  }, []);

  return (
    <div className="flex gap-[48px] relative">
      <NoteList noteMetadata={entireNoteMetadata} isPending={isLoadingList} />
    </div>
  );
}
