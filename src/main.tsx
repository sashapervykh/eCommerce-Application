import { createRoot } from 'react-dom/client';
import App from './app/app';

// Инициализация только в браузерной среде
if (typeof document !== 'undefined') {
  const appContainer = document.createElement('div');
  appContainer.id = 'app-root';
  document.body.append(appContainer);

  const root = createRoot(appContainer);
  root.render(<App />);
}
