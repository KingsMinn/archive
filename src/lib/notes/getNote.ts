"use server";
import fs from "fs";
import path from "path";
import { load } from "js-yaml";

const getNoteListAddress = (subPath?: string) =>
  subPath ? path.join(subPath) : path.join(process.cwd(), "public", "notes");

export async function getNoteList(subPath?: string) {
  try {
    const notesPath = getNoteListAddress(subPath);
    const directories = [];
    const result = {};

    async function searchDirectory(dir: string) {
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      console.log("🚨🚨🚨🚨🚨🚨path 내 파일들", files);

      for (const file of files) {
        if (file.isDirectory()) {
          const nextPath = file.parentPath + "/" + file.name;
          directories.push(nextPath);
          await searchDirectory(nextPath);
        } else {
          const name = file.name.replace(".md", "");
          const metadata = await getNoteMetadata(file.name, file.parentPath);
          console.log("🎉🎉🎉🎉🎉🎉🎉🎉받은 메타데이터:", metadata);

          result[name] = {
            ...metadata,
            path: file.parentPath,
          };
        }
      }
    }
    await searchDirectory(notesPath);
    console.log("🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶파일 디렉토리", result);
    return result;
  } catch (error) {
    console.error("Error getNoteList:", error);
    return [];
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

    return { ...(load(yamlContent) || {}), preview: preview };
  } catch (err) {
    console.error("Error extractYaml", err);
    return {};
  }
}

export async function getNoteMetadata(file: string, subPath?: string) {
  const content = await getNoteContents(file, subPath);
  const yamlData = extractYaml(content);
  // console.log("✅✅✅✅✅✅✅ yaml", yamlData);

  return {
    filename: file,
    ...yamlData,
  };
}

// export async function getEntireNoteMetadata() {
//   try {
//     const noteList = await getNoteList();
//     console.log("🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯", noteList);

//     const result = await Promise.all(
//       noteList.map((note) => getNoteMetadata(note.name))
//     );
//     console.log("result: ", result);
//     return result;
//   } catch (err) {
//     console.error("Error getNoteMetadata", err);
//     return [];
//   }
// }

// export async function getAllNotes() {
//   let directories = [];
//   let result = {};

//   async function searchDirectory(directory: string) {
//     try {
//       const noteList = await getNoteList();
//       console.log(noteList);

//       noteList.forEach((note) => {
//         if (note.isDirectory()) {
//           directories.push(note);
//           directories = directories.concat(searchDirectory(note));
//         } else {
//           const metadata = await getNoteMetadata(note);
//           const id = await metadata.filename;
//           result[id] = {
//             ...metadata,
//           };
//         }
//       });
//     } catch (err) {
//       console.error("Error getNoteProperties", err);
//       return {};
//     }
//   }
//   searchDirectory(getNoteListAddress());

//   return result;
// }
