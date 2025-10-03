"use server";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

const getNoteListAddress = () => path.join(process.cwd(), "public", "notes");

export async function getNoteList() {
  try {
    const notesPath = getNoteListAddress();
    const files = await fs.promises.readdir(notesPath);
    return files.filter((file) => file.endsWith(".md"));
  } catch (error) {
    console.error("Error getNoteList:", error);
    return [];
  }
}

export async function getNoteContents(
  file: string,
  frontmatter: boolean = true
) {
  try {
    const filePath = path.join(getNoteListAddress(), file);
    const contents = await fs.promises.readFile(filePath, "utf-8");
    if (!frontmatter) return contents.replace(/^---\n[\s\S]*?\n---\n?/, "");
    return contents;
  } catch (error) {
    console.error("Error getNoteContents:", error);
    return "";
  }
}

function extractYaml(content: string) {
  try {
    const frontmatterMatch = content.match(
      /^---\n([\s\S]*?)\n---([\s\S]{0,100})/
    );
    if (!frontmatterMatch) return {};
    const yamlContent = frontmatterMatch[1];
    const preview = frontmatterMatch[2]
      .replace(/#{1,6}\s/g, "") // # 헤딩 제거
      .replace(/\*\*(.*?)\*\*/g, "$1") // **볼드** 제거
      .replace(/\*(.*?)\*/g, "$1") // *이탤릭* 제거
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // [링크](url) → 링크
      .replace(/!\[\[(.*?)\]\]/g, "$1") // ![[이미지]] → 이미지
      .replace(/\[\[(.*?)\]\]/g, "$1") // [[링크]] → 링크
      .trim();

    return { ...yaml.load(yamlContent), preview: preview };
  } catch (err) {
    console.error("Error extractYaml", err);
    return {};
  }
}

export async function getNoteMetadata(file: string) {
  const content = await getNoteContents(file);
  const yamlData = extractYaml(content);
  return {
    filename: file,
    ...yamlData,
  };
}

export async function getEntireNoteMetadata() {
  try {
    const noteList = await getNoteList();
    const result = await Promise.all(
      noteList.map((file) => getNoteMetadata(file))
    );
    return result;
  } catch (err) {
    console.error("Error getNoteProperties", err);
    return [];
  }
}
