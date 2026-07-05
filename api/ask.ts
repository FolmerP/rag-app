
export default async function handler(request, response) {

    const { chunks, question } = request.body

    const apiKey = process.env.ANTHROPIC_API_KEY

    const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
         },
        body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 1000,
            messages: [
                { role: "user", content: `Her er nogle uddrag fra et dokument: ${chunks.join(";" )}. Svar på dette spørgsmål: ${question} udelukkende ud fra uddragene.`}
            ]
        })
    })

    const data = await apiResponse.json()

    const answer = data.content[0].text

    response.status(200).json({ answer })

}