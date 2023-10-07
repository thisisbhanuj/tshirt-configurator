import React from 'react';
import { createRoot } from 'react-dom/client'
import reportWebVitals from './reportWebVitals';

import { App as Canvas } from './Canvas'
import Overlay from './Overlay'

import './index.css';

createRoot(document.getElementById('root')).render(
  <main className="app transition-all ease-in">
    <Canvas />
    <Overlay />
  </main>
)

reportWebVitals();
