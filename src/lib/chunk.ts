export function chunkText(text: string): string[] {
    const targetSize = 500;

    //split into sentences at . ! or ? 
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
        //if adding this sentence would push past the target size,
        //close off the current chunk and start a fresh one.
        if (current.length > 0 && current.length + sentence.length > targetSize) {
            chunks.push(current);
            current = sentence;
        } else {
            current = current.length === 0 ? sentence : `${current} ${sentence}`;
        }
    }

    //ensure the final chunk is not lost.
    if (current.length > 0) {
        chunks.push(current);
    }

    return chunks;
}