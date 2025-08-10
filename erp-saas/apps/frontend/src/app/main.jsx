import React from 'react';
import { createRoot } from 'react-dom/client';
import RouterConfig from './routes';
import './index.css';

createRoot(document.getElementById('root')).render(<RouterConfig />);
