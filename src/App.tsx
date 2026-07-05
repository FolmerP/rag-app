import { useState } from 'react'
import DocumentInput from './components/DocumentInput';
import QuestionBox from './components/QuestionBox';
import { answerQuestion } from './lib/rag';
import './App.css'


function App() {
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const result = await answerQuestion(document, question);
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
