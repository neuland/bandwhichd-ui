import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

import 'modern-normalize/modern-normalize.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('bandwhichd-root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)