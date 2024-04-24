import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const apiKey = process.env.PINECONE_API_KEY;

  const pinecone = new Pinecone({
    apiKey: apiKey!,
  });

  const index = await pinecone.Index("papertalk");

  try {
    const namespace = convertToAscii(fileKey);
    const queryResponse = await index.namespace(namespace).query({
      vector: embeddings,
      topK: 5,
      includeMetadata: true,
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string,
    pageNumbe: number
  }

  let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)

  return docs.join("\n").substring(0,3000)
}