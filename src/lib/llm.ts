
export async function askLLM(chunks: string[], question: string): Promise<string> {
    const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chunks, question })
    })

    if (!res.ok) { 
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Request to /api/ask failed") 
    }


    const data = await res.json()
    return data.answer
}