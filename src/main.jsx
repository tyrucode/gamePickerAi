import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//css
import './index.css'
//app
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
