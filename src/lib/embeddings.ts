let embedderPromise: Promise<any> | null = null

function getEmbedder(): Promise<any> {
    if (!embedderPromise) {
        // @ts-ignore loaded from CDN at runtime, outside Vite's bundle
        embedderPromise = import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1')
            .then(({ pipeline }) =>
                pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2')
            )
            .catch((e) => {
                embedderPromise = null
                throw e
            })
    }
    return embedderPromise
}

export async function embed(text: string): Promise<number[]> {
    const embedder = await getEmbedder()
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
}