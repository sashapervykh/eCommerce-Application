import { App } from './app';
import ReactDOM from 'react-dom/client';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'assets/favicon.ico';
document.head.appendChild(favicon);

const container = document.createElement('div');
document.body.append(container);
ReactDOM.createRoot(container).render(<App />);
