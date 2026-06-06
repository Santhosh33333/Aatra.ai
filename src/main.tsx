import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn('[v0] Clerk publishable key missing. Add VITE_CLERK_PUBLISHABLE_KEY to .env')
}

try {
  console.log('[v0] Starting React app...')
  const root = document.getElementById('root')!
  console.log('[v0] Root element:', root)
  
  createRoot(root).render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY || 'pk_test_placeholder'}
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#ffb340',
            colorBackground: '#0d1117',
            colorInputBackground: 'rgba(255,255,255,0.05)',
            colorInputText: '#ffffff',
            colorText: '#ffffff',
            colorTextSecondary: '#6b7280',
            borderRadius: '0.875rem',
            fontFamily: 'Sora, sans-serif',
          },
          elements: {
            card: 'bg-[#0d1117] border border-white/10 shadow-2xl',
            headerTitle: 'text-white font-bold text-2xl',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
            formButtonPrimary: 'bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold hover:opacity-90',
            footerActionLink: 'text-amber-400 hover:text-amber-300',
            identityPreviewEditButton: 'text-amber-400',
            formFieldInput: 'bg-white/5 border-white/10 text-white',
            dividerLine: 'bg-white/10',
            dividerText: 'text-gray-500',
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>,
  )
  console.log('[v0] React app rendered successfully')
} catch (error) {
  const errorMsg = (error as Error).message
  console.error('[v0] Error rendering app:', error)
  const root = document.getElementById('root')!
  root.innerHTML = `<div style="color: #ffb340; padding: 20px; background: #080c18; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: monospace;">
    <div style="max-width: 600px; padding: 40px; background: rgba(255,255,255,0.05); border: 1px solid #ffb340; border-radius: 8px;">
      <h2 style="color: #ff6b6b; margin-bottom: 20px;">Astra App Error</h2>
      <pre style="color: #ffb340; font-size: 12px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${errorMsg}</pre>
      <p style="color: #888; font-size: 12px; margin-top: 20px;">Check the browser console for more details</p>
    </div>
  </div>`
}
