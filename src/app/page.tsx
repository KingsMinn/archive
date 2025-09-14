import Image from "next/image";
import Link from "next/link";

function Card({ card, key }: { card: any; key: number }) {
  const title = card.properties.Name.title[0]["plain_text"];
  const tags = card.properties.Tag.multi_select.map((v: any) => v.name);
  const dates = card.properties.Date.date;
  const description = card.properties.Description["rich_text"][0]["plain_text"];
  const thumbnail = card.properties.Thumbnail.files[0].file.url;
  const id = card.id;

  return (
    <Link href={`/archive/${id}`}>
      <article key={key}>
        <h2>{title}</h2>
        <Image src={thumbnail} alt="" width={480} height={480} />
        <div>
          tags:
          {tags.map((v, ii) => (
            <div key={ii}>{v}</div>
          ))}
        </div>
        <p>description: {description}</p>
        <p>start: {dates.start}</p>
        <p>end: {dates.end}</p>
      </article>
    </Link>
  );
}

async function fetchCard() {
  const url = process.env.DB_URL;
  const dbKey = process.env.DB_KEY;
  const options = {
    method: "POST",
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

export default async function Home() {
  const cards = await fetchCard();

  return (
    <>
      <section>
        <span>김승민 Kim Seungmin</span>
        <h1>
          경험을 설계하고, 인터랙션으로 생명력을 불어넣고, 코드로 구현합니다.
        </h1>
        <h2>Interactive Front-end Developer, Motion Graphic Designer</h2>
        <span>smin2020@icloud.com</span>
      </section>
      <section>
        <h2>Works</h2>
        {cards.map((card, i) => (
          <Card card={card} key={i} />
        ))}
      </section>
    </>
  );
}
