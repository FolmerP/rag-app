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
      <header className='app-header'>
        <h1 className='app-title'>Grounded</h1>
        <p className='app-subtitle'>Get answers with sources</p>
      </header>

    <DocumentInput
    document={document}
    onDocumentChange={setDocument}
    />
    <QuestionBox
    question={question}
    onQuestionChange={setQuestion}
    />
    <button className='ask-button' onClick={handleAsk}>Ask</button>

{answer && (
  <div className='result'>
    <p className='answer'>{answer}</p>

    <div className='sources'>
      <span className='sources-label'>Found in the document</span>
      {sources.map((source, index) => (
        <p key={index} className='source-mark'>{source}</p>
      ))}
      </div>
    </div>
)}

   </div>
  )

}

export default App
