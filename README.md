# Grounded

A small Retrieval-Augmented Generation (RAG) web app. You give it a document, ask questions about it, and it answers grounded in the document. Citing the exact passages each answer is drawn from, and saying clearly when the answer isn't in the document.

**[Live demo](https://rag-app-ten-gamma.vercel.app/)**

## What it does

1. You paste in a document.
2. You ask a question about it.
3. The app finds the most relevant passages in the document and sends only those to the language model, along with your question.
4. The model answers using only those passages, cites them by number (`[1]`, `[2]`), and the app highlights the matching passages below the answer. If the passages don't contain the answer, it says so instead of guessing.

The point of citing the passages is trust: you can see where an answer came from instead of taking it at face value.

## How it works

The retrieval pipeline is written from scratch, with each step in its own module under `src/lib/`. It runs in two phases:

**Indexing (once per document)**
- **`chunk.ts`** — splits the document into passages on sentence boundaries, grouping whole sentences up to a target size (~500 chars) so chunks are never cut mid-word or mid-sentence.
- **`embeddings.ts`** — turns a passage (or the question) into a vector using a multilingual sentence-transformer model (`paraphrase-multilingual-MiniLM-L12-v2`) that runs in the browser via Transformers.js. It's multilingual because the app is also used on Danish documents, where an English-only model retrieved poorly. Running in the browser also means the full document is never uploaded just to be embedded, only the top matching passages and the question ever reach the backend.
- **`similarity.ts`** (`embedChunks`) — embeds every chunk once and caches the vectors, so the document isn't re-embedded on every question.

**Answering (per question)**
- **`similarity.ts`** (`cosineSimilarity`, `topChunks`) — embeds only the question, scores it against the cached chunk vectors with cosine similarity, and returns the top-k passages.
- **`rag.ts`** — orchestrates the two phases: `buildIndex` for the document, `answerQuestion` for each question.
- **`llm.ts`** — calls the app's own `/api/ask` endpoint with the chosen passages and the question.

The call to the language model goes through a serverless proxy (`api/ask.ts`) rather than straight from the browser. The function validates and size-limits the input, builds a grounded prompt (numbered excerpts in XML tags, with instructions to answer only from them, cite them, and reply in the question's language), calls the Anthropic API, and handles upstream errors. The API key lives in a server-side environment variable and is never exposed to the client.

## Tech stack

- **Frontend:** React + TypeScript (Vite)
- **Embeddings:** Transformers.js (`paraphrase-multilingual-MiniLM-L12-v2`), in-browser
- **Backend:** Vercel serverless function (`api/ask.ts`)
- **Model:** Anthropic API

## Running locally

```bash
npm install
npx vercel dev
```

`vercel dev` runs both the frontend and the serverless function locally. The function needs an `ANTHROPIC_API_KEY`. With `vercel dev` this must live in the Vercel project's **Development** environment:

```bash
npx vercel env add ANTHROPIC_API_KEY development
```

(A plain `.env.local` is only picked up by the Vite frontend, not by the serverless function.)

## Known limitations / next steps

- **Multi-part questions.** Retrieval uses a single query vector, so a compound question (e.g. asking about two unrelated facts at once) averages its sub-topics and can miss a passage a focused question would find. Production approaches: query decomposition or multi-query retrieval.
- **No vector database.** Similarity is computed in memory over one document's chunks, which  fine at this scale. A larger corpus would move to a vector database (e.g. pgvector, Qdrant).
- **Hand-tuned retrieval parameters.** Chunk size (~500 chars) and `k` (4) are set by feel, not against a labelled eval set yet.
- **No rate limiting.** `/api/ask` validates and size-caps input, but proper per-client rate limiting is not made.
- **Planned:** unit tests (Vitest) for the pure functions and a CI workflow (GitHub Actions) running lint, build and tests; a small retrieval eval (question → expected-passage pairs, scored by hit-rate@k) to tune chunk size and `k` with data; and tracing/observability around the LLM calls.