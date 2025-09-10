import { NotionPageProperties } from "@/types/notion";

export function extractTitle(properties: NotionPageProperties): string {
  return properties.Name.title[0].text.content || "제목 없음";
}
export function extractTags(
  properties: NotionPageProperties
): Array<{ name: string }> {
  return properties.Tag.multi_select.map((v: any) => v.name) || [];
}
export function extractDates(properties: NotionPageProperties) {
  return {
    start: properties.Date.date.start || "",
    end: properties.Date.date.end || "",
  };
}
export function extractDescription(properties: NotionPageProperties): string {
  return properties.Description["rich_text"][0].text.content || "내용 없음";
}
export function extractThumbnail(properties: NotionPageProperties): string {
  return properties.Thumbnail.files[0].file.url;
}
