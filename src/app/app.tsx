import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login-page';
import HomePage from '../pages/main-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
