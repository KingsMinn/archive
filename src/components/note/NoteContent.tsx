import ReactMarkdown from "react-markdown";
import Loading from "../ui/Loading";
import { NoteMetadata } from "@/types/note";
import NoteDate from "./NoteDate";

export function NoteContent({
  content,
  isPending,
  metadata,
}: {
  content: string;
  isPending: boolean;
  metadata: NoteMetadata | null;
}) {
  if (isPending) return <Loading />;
  return (
    <div className="flex grow h-[100vh] justify-center overflow-scroll">
      <article className="w-[540px] min-w-[540px]">
        {metadata ? (
          <>
            <h1>{metadata.title}</h1>
            <NoteDate date={metadata.date} />
          </>
        ) : (
          <p>게시글 속성을 불러오지 못했어요</p>
        )}
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
