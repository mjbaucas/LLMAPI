
import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!prompt.trim()) return

    setLoading(true)
    setResponse('')
    setError('')

    try {
      const result = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await result.json()

      if (!result.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setResponse(data.response)
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>LLM-API</h1>
      <p>Ask a question and get an AI-generated response.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Enter your question here..."
          rows={5}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Generating...' : 'Submit'}
        </button>
      </form>

      {loading && <p>Waiting for the LLM response...</p>}

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <section className="response">
          <h2>Response</h2>
          <p>{response}</p>
        </section>
      )}
    </main>
  )
}

export default App
