import { useState } from 'react'
import DocumentInput from './components/DocumentInput';
import QuestionBox from './components/QuestionBox';
import { chunkText } from './lib/chunk';
import { embed } from './lib/embeddings';
import { cosineSimilarity, topChunks } from './lib/similarity';
import { answerQuestion } from './lib/rag';
import './App.css'


function App() {
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function handleAsk() {
    const result = answerQuestion(document, question);
    setAnswer(result)
  }

  return(
    <div>
    <DocumentInput
    document={document}
    onDocumentChange={setDocument}
    />
    <QuestionBox
    question={question}
    onQuestionChange={setQuestion}
    />
    <button onClick={handleAsk}>Spørg</button>

    <p>{answer}</p>

    <p>{document.length}</p>
    <p>{question}</p>
    </div>
  )

}

export default App
