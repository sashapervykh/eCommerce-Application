import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';
import { ThemeProvider } from '@gravity-ui/uikit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/main/main';
import LoginPage from './pages/login/login';
import RegistrationPage from './pages/registration/registration';
import CatalogPage from './pages/catalog/catalog';
import AboutPage from './pages/about-us/about-us';
import NotFoundPage from './pages/404/not-found';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
