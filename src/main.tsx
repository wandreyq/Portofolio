import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client' 
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render( // folosim StrictMode pentru a activa verificări suplimentare în timpul dezvoltării
  <StrictMode> 
    <App /> // componenta principală a aplicației, care conține toate celelalte componente și logica de bază
  </StrictMode>,
)
