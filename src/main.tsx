import App from './app';
import ReactDOM from 'react-dom/client';

// Создаем корневой контейнер
const appContainer = document.createElement('div');
appContainer.id = 'root';
document.body.append(appContainer);

ReactDOM.createRoot(appContainer).render(<App />);
