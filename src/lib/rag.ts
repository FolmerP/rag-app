import { chunkText } from "./chunk";
import { askLLM } from "./llm";
import { topChunks } from "./similarity";

type RagResult = {
    answer: string
    sources:string[]
}

export async function answerQuestion(document: string, question: string): Promise<RagResult> {
    
    const chunks = chunkText(document)
    
    const sources = topChunks(question, chunks, 2)

    const answer = await askLLM(sources, question)

    return {answer, sources}
}