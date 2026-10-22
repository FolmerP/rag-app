
import { embed } from "./embeddings";

export type Indexed = {
    chunk: string;
    vector: number[];
};

export function dot(a: number[], b: number[]): number {
    let sum = 0
    for (let i = 0; i < a.length; i++) {      
        sum += a[i] * b[i];
    }
    return sum;
}

export function cosineSimilarity(a: number[], b: number[]): number {
    const dotP = dot(a, b);
    const lengthA = Math.sqrt(dot(a,a));
    const lengthB = Math.sqrt(dot(b,b));
    return dotP / (lengthA * lengthB);
}

export async function embedChunks(chunks: string[]): Promise<Indexed[]>{
    return Promise.all(
        chunks.map(async (chunk) => ({
            chunk,
            vector: await embed(chunk),
        }))
    );
}

export async function topChunks(question:string, index: Indexed[], k: number): Promise<string[]> {
    const questionVector = await embed(question);

    const scored = index.map((item) => ({
        chunk: item.chunk,
        score: cosineSimilarity(questionVector, item.vector),
    }))

    return scored.sort((x, y) => y.score - x.score).slice(0,k).map((item) => item.chunk);
}