
import { embed } from "./embeddings";

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

export function topChunks(question:string, chunks: string[], k: number): string[] {

    const scored = chunks.map((chunk) => ({chunk: chunk, score: cosineSimilarity(embed(question), embed(chunk))}))

    return scored.sort((x, y) => y.score - x.score).slice(0,k).map((item) => item.chunk)
}