import ReactMarkdown from "react-markdown";
import Loading from "../ui/Loading";

export function NoteContent({
  content,
  isPending,
  metadata,
}: {
  content: string;
  isPending: boolean;
  metadata: string[];
}) {
  if (isPending) return <Loading />;
  return (
    <article className="w-[540px] min-w-[540px]">
      <p>{JSON.stringify(metadata)}</p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
