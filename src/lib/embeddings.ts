let embedder: any = null

export async function embed(text: string): Promise<number[]> {
    if (!embedder) {
        // @ts-ignore - loades fra CDN, uden for Vites bundler
        const { pipeline } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1')
        embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2')
    }
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
}