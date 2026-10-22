import { chunkText } from "./chunk";
import { askLLM } from "./llm";
import { embedChunks, topChunks, type Indexed } from "./similarity";

type RagResult = {
    answer: string
    sources:string[]
}

//build once per document. Chunk and embed all chunks
export async function buildIndex(document: string): Promise<Indexed[]> {
    const chunks = chunkText(document);
    return embedChunks(chunks);
}

//per question. reuse the cached index, embed only the question
export async function answerQuestion(index: Indexed[], question: string): Promise<RagResult> {
    const sources = await topChunks(question, index, 4)
    const answer = await askLLM(sources, question)

    return {answer, sources}
}