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

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const contents = await fetchPage({ id });

  return <div>{contents.map((v) => JSON.stringify(v))}</div>;
}
