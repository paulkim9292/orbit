import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

function GlobalPending() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <div
        style={{
          height: '2px',
          background: 'var(--color-text-primary)',
          animation: 'pending-progress 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 30_000,
  defaultViewTransition: true,
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
  defaultPendingComponent: GlobalPending,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
