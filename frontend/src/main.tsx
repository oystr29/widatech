import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router/lazy'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './lib/redux-store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </StrictMode>
)
