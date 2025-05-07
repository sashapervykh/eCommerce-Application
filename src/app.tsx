import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';
import { ThemeProvider } from '@gravity-ui/uikit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/main/main';
import LoginPage from './pages/login/login';

function App() {
  return (
    <ThemeProvider theme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
