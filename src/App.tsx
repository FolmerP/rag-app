import { useState } from 'react'
import DocumentInput from './components/DocumentInput';
import QuestionBox from './components/QuestionBox';
import { answerQuestion } from './lib/rag';
import './App.css'


function App() {
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  async function handleAsk() {
    const result = await answerQuestion(document, question);
    setAnswer(result.answer)
    setSources(result.sources)
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
  
    <div>
      <h3>Kilder</h3>
      {sources.map((source, index) => (
        <p key={index}>{source}</p>
      ))}
    </div>
    
    </div>
  )

}

export default App
