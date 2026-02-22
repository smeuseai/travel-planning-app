import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary, ErrorFallback } from './components/ErrorFallback'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:20px;font-family:system-ui">Travel Planning App: root element missing.</div>'
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = ''
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)
    ReactDOM.createRoot(div).render(
      <ErrorFallback error={err instanceof Error ? err : new Error(String(err))} message="App failed to start." />,
    )
  }
}
