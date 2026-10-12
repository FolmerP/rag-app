# RAG App

A small Retrieval-Augmented Generation (RAG) web app. You give it a document, ask questions about it, and it answers grounded in the document and highlights which passages the answer came from.

**[Live demo](https://rag-app-ten-gamma.vercel.app/)**

## What it does

1. You paste in a document.
2. You ask a question about it.
3. The app finds the most relevant passages in the document and sends only those to the language model, along with your question.
4. The model answers based on those passages and the app shows which passages the answer was drawn from.

## How it works

The retrieval pipeline is written from scratch, with each step in its own module under `src/lib/`:

- **`chunk.ts`** — splits the document into smaller passages.
- **`embeddings.ts`** — turns a chunk (or the question) into a numeric vector so they can be compared.
- **`similarity.ts`** — cosine similarity between two vectors, plus selecting the top-k most similar chunks.
- **`rag.ts`** — orchestrates the pipeline: chunk the document, find the best-matching chunks for the question, and ask the model.
- **`llm.ts`** — calls the app's own backend endpoint with the chosen chunks and the question.

The call to the language model goes through a serverless proxy (`api/ask.ts`) rather than straight from the browser. The API key lives server-side in an environment variable and is never exposed to the client. The browser only talks to the app's own `/api/ask` endpoint, which forwards the request to the Anthropic API.

## Tech stack

- **Frontend:** React + TypeScript
- **Backend:** Vercel serverless function (`api/ask.ts`)
- **Model:** Anthropic API

## Known limitations / next steps

- The embeddings in `embeddings.ts` are currently a simplified version, so matching is more surface-level than based on real meaning. The main planned improvement is swapping in proper semantic embeddings, because the pipeline is kept in separate layers, that change is contained to `embeddings.ts`.
