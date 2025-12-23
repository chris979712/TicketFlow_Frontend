import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

const preventAriaHidden = () => {
  const observer = new MutationObserver(() => {
    const root = document.getElementById('root');
    if (root?.hasAttribute('aria-hidden')) {
      root.removeAttribute('aria-hidden');
    }
  });

  const root = document.getElementById('root');
  if (root) {
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['aria-hidden']
    });
  }
}

preventAriaHidden();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
