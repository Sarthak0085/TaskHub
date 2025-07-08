import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ReactQueryProvider from './providers/react-query-provider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ReactQueryProvider>
                <App />
            </ReactQueryProvider>
        </BrowserRouter>
    </StrictMode>
);
