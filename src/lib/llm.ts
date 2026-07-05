
export async function askLLM(chunks: string[], question: string): Promise<string> {
    const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chunks, question })
    })

    const data = await res.json()
    return data.answer
}