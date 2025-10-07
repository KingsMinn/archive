"use server";
import fs from "fs";
import path from "path";
import { load } from "js-yaml";
import { NoteListData, NoteMetadata } from "@/types/note";
import { cache } from "react";

// === 파일 시스템 ===
const getNoteListAddress = (subPath?: string) =>
  subPath ? path.join(subPath) : path.join(process.cwd(), "public", "notes");

export async function readNoteFile(
  file: string,
  subPath?: string
): Promise<string> {
  try {
    const filePath = path.join(getNoteListAddress(subPath), file);
    return await fs.promises.readFile(filePath, "utf-8");
  } catch (error) {
    console.error("Error getNoteContents:", error);
    return "";
  }
}

// === 텍스트 처리 ===
function extractPreview(content: string, maxLength: number = 100): string {
  return content
    .replace(/#{1,6}\s/g, "") // # 헤딩 제거
    .replace(/\*\*(.*?)\*\*/g, "$1") // **볼드** 제거
    .replace(/\*(.*?)\*/g, "$1") // *이탤릭* 제거
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // [링크](url) → 링크
    .replace(/!\[\[(.*?)\]\]/g, "$1") // ![[이미지]] → 이미지
    .replace(/\[\[(.*?)\]\]/g, "$1") // [[링크]] → 링크
    .trim()
    .substring(0, maxLength);
}

function separateFrontmatter(content: string) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---([\s\S]*)/);

  if (frontmatterMatch) {
    return {
      yamlContent: frontmatterMatch[1],
      markdownContent: frontmatterMatch[2].trim(),
    };
  }

  return {
    yamlContent: null,
    markdownContent: content,
  };
}

// === YAML 처리 ===
function parseYamlSafely(yamlContent: string): Record<string, unknown> | null {
  try {
    return (load(yamlContent) || {}) as Record<string, unknown>;
  } catch (err) {
    console.error("Error parseYamlSafely", err);
    return null;
  }
}

function createNoteMetadata(
  parsed: Record<string, unknown> | null,
  preview: string,
  filename: string
): NoteMetadata {
  const defaultMetadata = {
    filename,
    title: "제목이 없어요",
    date: new Date().toISOString(),
    updated: new Date().toISOString(),
    tags: [],
    published: false,
    aliases: [],
    preview: "내용이 없어요",
  };

  if (!parsed) return defaultMetadata;

  return {
    filename,
    title:
      typeof parsed.title === "string" ? parsed.title : defaultMetadata.title,
    date:
      typeof parsed.date === "string" || parsed.date instanceof Date
        ? parsed.date
        : defaultMetadata.date,
    updated:
      typeof parsed.updated === "string" || parsed.updated instanceof Date
        ? parsed.updated
        : typeof parsed.date === "string" || parsed.date instanceof Date
        ? parsed.date
        : defaultMetadata.updated,
    tags: Array.isArray(parsed.tags) ? parsed.tags : defaultMetadata.tags,
    published:
      typeof parsed.published === "boolean"
        ? parsed.published
        : defaultMetadata.published,
    aliases: Array.isArray(parsed.aliases)
      ? parsed.aliases
      : defaultMetadata.aliases,
    preview: preview || defaultMetadata.preview,
  };
}

// === 공개 API ===
export const getNoteListPaths = cache(async (): Promise<string[]> => {
  const notesPath = getNoteListAddress();
  const paths: string[] = [];

  async function scanDirectory(dir: string) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        const nextPath = path.join(file.parentPath, file.name);
        await scanDirectory(nextPath);
      } else if (file.name.endsWith(".md")) {
        const relativePath = path.relative(notesPath, file.parentPath);
        const noteId = relativePath
          ? `${relativePath}/${file.name.replace(".md", "")}`
          : file.name.replace(".md", "");
        //✅ TODO: 현재 로직은 promise 스택에 쌓는 방식이 아니므로 속도가 느릴 수 있음. 추후 수정

        paths.push(noteId);
      }
    }
  }

  await scanDirectory(notesPath);
  return paths;
});

export const getNoteListFull = cache(async (): Promise<NoteListData> => {
  try {
    const notesPath = getNoteListAddress();
    const result: NoteListData = {};

    async function searchDirectory(dir: string) {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) {
          const nextPath = path.join(file.parentPath, file.name);
          await searchDirectory(nextPath);
        } else if (file.name.endsWith(".md")) {
          const relativePath = path.relative(notesPath, file.parentPath);
          const noteId = relativePath
            ? `${relativePath}/${file.name.replace(".md", "")}`
            : file.name.replace(".md", "");
          //✅ TODO: 현재 로직은 promise 스택에 쌓는 방식이 아니므로 속도가 느릴 수 있음. 추후 수정

          const metadata = await getNoteMetadata(file.name, file.parentPath);

          result[noteId] = {
            ...metadata,
            path: file.parentPath,
          };
        }
      }
    }

    await searchDirectory(notesPath);
    return result;
  } catch (err) {
    console.error("Error getNoteListFull:", err);
    return {};
  }
});

export const getNoteById = cache(async (noteId: string) => {
  try {
    const notesPath = getNoteListAddress();
    const filePath = path.join(notesPath, `${noteId}.md`);

    const rawContent = await fs.promises.readFile(filePath, "utf-8");
    const { yamlContent, markdownContent } = separateFrontmatter(rawContent);

    const parsed = yamlContent ? parseYamlSafely(yamlContent) : null;
    const preview = extractPreview(markdownContent);
    const metadata = createNoteMetadata(parsed, preview, `${noteId}.md`);

    return {
      metadata,
      content: markdownContent,
    };
  } catch (err) {
    console.error(`Error getNoteById(${noteId})`, err);
    return null;
  }
});

export async function getNoteMetadata(
  file: string,
  subPath?: string
): Promise<NoteMetadata> {
  const rawContent = await readNoteFile(file, subPath);
  const { markdownContent, yamlContent } = separateFrontmatter(rawContent);

  const parsed = yamlContent ? parseYamlSafely(yamlContent) : null;
  const preview = extractPreview(markdownContent);

  return createNoteMetadata(parsed, preview, file);
}

export async function getNoteContent(
  file: string,
  subPath?: string
): Promise<{ content: string; frontmatter: Record<string, unknown> | null }> {
  const rawContent = await readNoteFile(file, subPath);
  const { markdownContent, yamlContent } = separateFrontmatter(rawContent);

  return {
    content: markdownContent,
    frontmatter: yamlContent ? parseYamlSafely(yamlContent) : null,
  };
}
