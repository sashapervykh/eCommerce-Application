import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';
import { ThemeProvider, Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/main/main';
import LoginPage from './pages/login/login';
import RegistrationPage from './pages/registration/registration';
import CatalogPage from './pages/catalog/catalog';
import AboutPage from './pages/about-us/about-us';
import NotFoundPage from './pages/404/not-found';
import './style.css';

function App() {
  return (
    <ThemeProvider theme="light">
      <ToasterProvider toaster={new Toaster()}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <ToasterComponent />
      </ToasterProvider>
    </ThemeProvider>
  );
}

export default App;
