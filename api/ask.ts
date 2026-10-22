import type { VercelRequest, VercelResponse } from '@vercel/node'


//Limits that protect API key from abuse
const MAX_QUESTION_LENGTH = 2000
const MAX_CHUNKS = 8
const MAX_CHUNK_LENGTH = 1500

export default async function handler(request: VercelRequest, response: VercelResponse) {

    //Only allow POST
    if (request.method !== "POST") {
        return response.status(405).json({ error: "Method not allowed" })
    }

    //validate an limit input
    const body = request.body
    if (!body || typeof body !== "object") {
        return response.status(400).json({ error: "Missing request body" })
    }

    const { chunks, question } = body

    if (typeof question !== "string" || question.trim().length === 0) {
        return response.status(400).json({ error: "question must be a non-empty string" })
    }

    if (question.length > MAX_QUESTION_LENGTH) {
        return response.status(400).json({ error: "question is too long" })
    }

    if (!Array.isArray(chunks) || chunks.length === 0) {
        return response.status(400).json({ error: "chunks must be a non-empty array" })
    }

    if (chunks.length > MAX_CHUNKS) {
        return response.status(400).json({ error: "too many chunks" })
    }

    if (!chunks.every((c) => typeof c === "string" && c.length <= MAX_CHUNK_LENGTH)) {
        return response.status(400).json({ error: "each chunk must be a string within the size limit" })
    }

    //API key must be configured server-side
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        return response.status(500).json({ error: "API key not configured" })
    }

    const excerpts = chunks
        .map((c, i) => `<excerpt id="${i + 1}">${c}</excerpt>`)
        .join("\n")

    const systemPrompt =
        "You answer questions strictly based on the provided document excerpts. " +
        "Use only the information in the excerpts and never rely on outside knowledge. " +
        "If the excerpts do not contain the answer, clearly say that the answer is not in the document. " +
        "Always cite the excerpts you rely on by their id in square brackets, e.g. [1] or [2]. " +
        "Answer in the same language as the question."

    const userContent =
        `Here are excerpts from a document:\n\n${excerpts}\n\n` +
        `Question: ${question}`

    //wrapped call to Anthropic, so function doenst crash if there is network failure
    let apiResponse: Response
    try {
        apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-sonnet-5-5",
                max_tokens: 1000,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userContent }
                ]
            })
        })
    } catch {
        return response.status(502).json({ error: "could not reach the language model" })
    }

    //handle error from anthropic
    if (!apiResponse.ok) {
        return response.status(502).json({ error: "the language model returned an error" })
    }

    //read the answer defensively
    const data = await apiResponse.json()
    const answer = data?.content?.[0]?.text
    if (typeof answer !== "string") {
        return response.status(502).json({ error: "Unexepected response from the language model" })
    }

    response.status(200).json({ answer })
}