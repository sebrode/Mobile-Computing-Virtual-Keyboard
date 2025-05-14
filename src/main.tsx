// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom';

// 1️⃣ default keyboard styles
//import 'simple-keyboard/build/css/index.css'

// 2️⃣ your global styles (if you have them)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
