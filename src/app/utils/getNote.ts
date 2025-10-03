"use server";
import fs from "fs";
import path from "path";

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

export async function getNoteContents(file: string) {
  try {
    const filePath = path.join(getNoteListAddress(), file);
    const contents = await fs.promises.readFile(filePath, "utf-8");
    return contents;
  } catch (error) {
    console.error("Error getNoteContents:", error);
    return "";
  }
}
