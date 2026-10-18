import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './readability.css'
import './mobile-performance.css'
import './resume-download.css'

// Keep the original fonts without making first paint wait for an external stylesheet.
const fontStyles = document.getElementById('portfolio-fonts') as HTMLLinkElement | null
if (fontStyles) {
  const activateFonts = () => { fontStyles.media = 'all' }
  fontStyles.addEventListener('load', activateFonts, { once: true })
  if (fontStyles.sheet) activateFonts()
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
