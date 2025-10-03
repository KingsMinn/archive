"use client";
import { useEffect, useState, useTransition } from "react";
import { getNoteContents, getNoteList } from "@/app/utils/getNote";
import { generateKey } from "@/app/utils/generateKey";
import ReactMarkdown from "react-markdown";

interface NoteListProps {
  noteList: string[];
  handleClick: (e: React.MouseEvent<HTMLUListElement>) => void;
  selectedNote: string | null;
  isPending?: boolean;
}

function NoteList({
  noteList,
  handleClick,
  selectedNote,
  isPending,
}: NoteListProps) {
  if (isPending) return <div>로딩 중...</div>;
  return (
    <ul onClick={handleClick}>
      {noteList.map((note) => (
        <li
          key={note}
          className={`cursor-pointer ${
            selectedNote === note ? "text-blue-800" : ""
          }`}
        >
          {note}
        </li>
      ))}
    </ul>
  );
}

function NoteContent({
  noteContent,
  isPending,
}: {
  noteContent: string;
  isPending: boolean;
}) {
  return (
    <ReactMarkdown>{isPending ? "로딩 중..." : noteContent}</ReactMarkdown>
  );
}

export default function NoteLayout() {
  const [noteContent, setNoteContent] = useState("");
  const [noteList, setNoteList] = useState<string[]>([]);
  const [isLoadingList, startLoadingList] = useTransition();
  const [isLoadingContent, startLoadingContent] = useTransition();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  useEffect(() => {
    startLoadingList(async () => {
      const list = await getNoteList();
      setNoteList(list);
    });
  }, []);

  function handleListClick(e: React.MouseEvent<HTMLUListElement>) {
    const target = e.target as HTMLLIElement;
    const noteName = target.innerText;
    setSelectedNote(noteName);
    startLoadingContent(async () => {
      const content = await getNoteContents(noteName);
      setNoteContent(content);
    });
  }

  return (
    <>
      <NoteList
        noteList={noteList}
        handleClick={handleListClick}
        selectedNote={selectedNote}
        isPending={isLoadingList}
      />
      <NoteContent noteContent={noteContent} isPending={isLoadingContent} />
    </>
  );
}
