import { chunkText } from "./chunk";
import { askLLM } from "./llm";
import { topChunks } from "./similarity";

export async function answerQuestion(document: string, question: string): Promise<string> {
    
    const chunks = chunkText(document)
    
    const best = topChunks(question, chunks, 2)

    const answer = await askLLM(best, question)

    return answer
}