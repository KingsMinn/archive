import Link from "next/link";

async function fetchPage({ id }) {
  const url = `https://api.notion.com/v1/blocks/${id}/children`;
  const dbKey = process.env.DB_KEY;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${dbKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const results = data.results;
    console.log(results);
    return results;
  } catch (error) {
    console.error(error);
  }
}

function parseNotionParagraph(texts) {
  return texts.map((text, index) => {
    if (text.type === "text") {
      switch (text.annotations.bold) {
        case true:
          return <strong key={index}>{text["text"].content}</strong>;

        default:
          return text["text"].content;
      }
    } else if (text.type === "mention") {
      return (
        <Link href={"/"} key={index}>
          멘션임
        </Link>
      );
    }
  });
}

function parseNotionBlocks(blocks) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index}>
            {parseNotionParagraph(block.paragraph["rich_text"])}
          </p>
        );

      case "numbered_list_item":
        return (
          <li key={index}>
            {parseNotionParagraph(block.numbered_list_item["rich_text"])}
          </li>
        );

      case "bulleted_list_item":
        return (
          <li key={index}>
            {parseNotionParagraph(block.bulleted_list_item["rich_text"])}
          </li>
        );

      case "heading_1":
        return (
          <h1 key={index}>
            {block["heading_1"]["rich_text"][0]["text"]["content"]}
          </h1>
        );

      case "to_do":
        return (
          <p key={index}>
            <i>{block["to_do"]["rich_text"][0]["text"]["content"]}</i>
          </p>
        );
    }
  });
}

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const contents = await fetchPage({ id });
  console.log("page:", contents[11].type);
  const textparam = await parseNotionParagraph(
    contents[10].paragraph["rich_text"]
  );
  console.log("texts:", textparam);

  const a = parseNotionBlocks(contents);

  return (
    <div>
      {/* {contents.map((v) => JSON.stringify(v))} */}
      {a}
      <p>{textparam}</p>
    </div>
  );
}
