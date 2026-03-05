import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import AppRoutes from './routes'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AppRoutes />
  </HashRouter>
)
