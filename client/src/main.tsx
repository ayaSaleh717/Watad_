import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LangProvider } from './i18n'
import { SiteContentProvider } from './siteContent'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </LangProvider>
  </StrictMode>,
)
