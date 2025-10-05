"use server";
import fs from "fs";
import path from "path";
import { load } from "js-yaml";
import { NoteListData, NoteMetadata } from "@/types/note";

const getNoteListAddress = (subPath?: string) =>
  subPath ? path.join(subPath) : path.join(process.cwd(), "public", "notes");

export async function getNoteList(subPath?: string) {
  try {
    const notesPath = getNoteListAddress(subPath);
    const result: NoteListData = {};

    async function searchDirectory(dir: string) {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) {
          const nextPath = path.join(file.parentPath, file.name);
          await searchDirectory(nextPath);
        } else {
          const name = file.name.replace(".md", "");
          const metadata = await getNoteMetadata(file.name, file.parentPath);
          //✅ TODO: 현재 로직은 promise 스택에 쌓는 방식이 아니므로 속도가 느릴 수 있음. 추후 수정

          result[name] = {
            ...metadata,
            path: file.parentPath,
          };
        }
      }
    }
    await searchDirectory(notesPath);
    return result;
  } catch (error) {
    console.error("Error getNoteList:", error);
    return {};
  }
}

export async function getNoteContents(
  file: string,
  subPath?: string,
  frontmatter: boolean = true
) {
  try {
    const filePath = path.join(getNoteListAddress(subPath), file);
    const contents = await fs.promises.readFile(filePath, "utf-8");
    if (!frontmatter) return contents.replace(/^---\n[\s\S]*?\n---\n?/, "");
    return contents;
  } catch (error) {
    console.error("Error getNoteContents:", error);
    return "";
  }
}

const extractPreview = (content: string) =>
  content
    .replace(/#{1,6}\s/g, "") // # 헤딩 제거
    .replace(/\*\*(.*?)\*\*/g, "$1") // **볼드** 제거
    .replace(/\*(.*?)\*/g, "$1") // *이탤릭* 제거
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // [링크](url) → 링크
    .replace(/!\[\[(.*?)\]\]/g, "$1") // ![[이미지]] → 이미지
    .replace(/\[\[(.*?)\]\]/g, "$1") // [[링크]] → 링크
    .trim();

function extractYaml(content: string): Omit<NoteMetadata, "filename"> {
  const frontmatterMatch = content.match(
    /^---\n([\s\S]*?)\n---([\s\S]{0,100})/
  );

  if (frontmatterMatch) {
    try {
      const yamlContent = frontmatterMatch[1];
      const preview = extractPreview(frontmatterMatch[2]);
      const parsed: Record<string, unknown> = (load(yamlContent) ||
        {}) as Record<string, unknown>;

      return {
        title:
          typeof parsed.title === "string" ? parsed.title : "제목이 없어요",
        date:
          typeof parsed.date === "string" || parsed.date instanceof Date
            ? parsed.date
            : new Date().toISOString(),
        updated:
          typeof parsed.updated === "string" || parsed.updated instanceof Date
            ? parsed.updated
            : typeof parsed.date === "string" || parsed.date instanceof Date
            ? parsed.date
            : new Date().toISOString(),
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        published:
          typeof parsed.published === "boolean" ? parsed.published : false,
        aliases: Array.isArray(parsed.aliases) ? parsed.aliases : [],
        preview: preview || "내용이 없어요",
      };
    } catch (err) {
      console.error("Error extractYaml", err);
    }
  }

  return {
    title: "제목이 없어요",
    date: new Date().toISOString(),
    updated: new Date().toISOString(),
    tags: [],
    published: false,
    aliases: [],
    preview: "내용이 없어요",
  };
}

export async function getNoteMetadata(file: string, subPath?: string) {
  try {
    const content = await getNoteContents(file, subPath);
    const yamlData = extractYaml(content);

    return {
      filename: file,
      ...yamlData,
    };
  } catch (err) {
    console.error("Error getNoteMetadata", err);
    return {
      filename: file,
      title: "제목이 없어요",
      date: new Date().toISOString(),
      updated: new Date().toISOString(),
      tags: [],
      published: false,
      aliases: [],
      preview: "내용이 없어요",
    };
  }
}
