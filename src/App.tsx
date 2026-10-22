import { useState } from 'react'
import DocumentInput from './components/DocumentInput';
import QuestionBox from './components/QuestionBox';
import { answerQuestion, buildIndex } from './lib/rag';
import type { Indexed } from './lib/similarity';
import './App.css'


function App() {
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState<Indexed[]>([]);
  const [indexedDoc, setIndexedDoc] = useState("");
  const [error, setError] = useState("");

  async function handleAsk() {
    setLoading(true)
    setError("");
    try {
      let currentIndex = index;
      //rebuild only if the document has changed
      if (indexedDoc !== document){
        currentIndex = await buildIndex(document);
        setIndex(currentIndex);
        setIndexedDoc(document);
      }
      const result = await answerQuestion(currentIndex, question);
      setAnswer(result.answer);
      setSources(result.sources);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setAnswer("");
      setSources([]);
    } finally {
      setLoading(false)
    }
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
    <button className='ask-button' onClick={handleAsk} disabled={loading}>
      {loading ? "Thinking..." : "Ask"}
      </button>
{error && (
  <div className='error'>
    <p>{error}</p>
    </div>
)}

{answer && (
  <div className='result'>
    <p className='answer'>{answer}</p>

    <div className='sources'>
      <span className='sources-label'>Found in the document</span>
      {sources.map((source, index) => (
        <p key={index} className='source-line'>
          <span className='source-mark'><strong>[{index+1}]</strong>{source}</span>
        </p>
      ))}
      </div>
    </div>
)}

   </div>
  )

}

export default App
