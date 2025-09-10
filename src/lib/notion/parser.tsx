import Image from "next/image";
import Link from "next/link";

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
        <Link href={`/archive/${text["mention"]["page"]["id"]}`} key={index}>
          {text["plain_text"]}로 이동
        </Link>
      );
    }
  });
}

export default function parseNotionBlocks(blocks) {
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

      case "callout":
        return (
          <div key={index}>
            {block.callout["icon"]["emoji"]}
            {parseNotionParagraph(block.callout["rich_text"])}
          </div>
        );

      case "heading_1":
        return (
          <h2 key={index}>
            {block["heading_1"]["rich_text"][0]["text"]["content"]}
          </h2>
        );

      case "heading_2":
        return (
          <h3 key={index}>
            {block["heading_2"]["rich_text"][0]["text"]["content"]}
          </h3>
        );

      case "heading_3":
        return (
          <h4 key={index}>
            {block["heading_3"]["rich_text"][0]["text"]["content"]}
          </h4>
        );

      case "code":
        return (
          <div key={index}>
            {block["code"]["rich_text"][0]["text"]["content"]}
          </div>
        );

      case "to_do":
        return (
          <p key={index}>
            <i>{block["to_do"]["rich_text"][0]["text"]["content"]}</i>
          </p>
        );

      case "divider":
        return <hr key={index} />;

      case "image":
        return (
          <Image
            width={300}
            height={300}
            key={index}
            alt=""
            src={block["image"]["file"]["url"]}
          />
        );

      case "file":
        return (
          <a key={index} href={block["file"]["file"]["url"]}>
            파일 {block["file"]["name"]} 다운로드
          </a>
        );
    }
  });
}
