import { NotionBlock, NotionPageInfo } from "@/types/notion";

async function notionRequest(endpoint: string) {
  const url = `https://api.notion.com/v1/${endpoint}`;
  const dbKey = process.env.DB_KEY;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${dbKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, options);
  return response.json();
}

export async function fetchPage({
  id,
}: {
  id: string;
}): Promise<NotionBlock[]> {
  try {
    const data = await notionRequest(`blocks/${id}/children`);
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPageInfo({
  id,
}: {
  id: string;
}): Promise<NotionPageInfo> {
  try {
    const data = await notionRequest(`pages/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
