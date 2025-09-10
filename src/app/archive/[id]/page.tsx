import { fetchPage, getPageInfo } from "@/lib/notion/api";
import parseNotionBlocks from "@/lib/notion/parser";
import { NotionPageInfo, NotionPageProperties } from "@/types/notion";
import {
  extractDates,
  extractDescription,
  extractTags,
  extractTitle,
} from "@/utils/notion-helpers";
import Link from "next/link";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const contents = await fetchPage({ id });
  const pageInfo: NotionPageInfo = await getPageInfo({ id });
  const pageProperties: NotionPageProperties = pageInfo.properties;

  const pageName = extractTitle(pageProperties);
  const pageDescription = extractDescription(pageProperties);
  const pageTags = extractTags(pageProperties);
  const { start: pageStartDate, end: pageEndDate } =
    extractDates(pageProperties);

  return (
    <>
      <Link href={"/"}>이전으로</Link>
      <h1>{pageName}</h1>
      <p>{pageDescription}</p>
      <span>시작: {pageStartDate}</span>
      <span>끝: {pageEndDate}</span>
      <ul className="flex gap-2">
        {pageTags.map((tag, index) => (
          <li key={index}>{tag.name}</li>
        ))}
      </ul>
      <div>{parseNotionBlocks(contents)}</div>
    </>
  );
}
