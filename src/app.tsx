import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';
import { ThemeProvider, Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/main/main';
import { NotFoundPage } from './pages/404/not-found';
import { AboutPage } from './pages/about-us/about-us';
import { MainLayout } from './components/layout/layout';
import { CatalogPage } from './pages/catalog/catalog';
import { RegistrationPage } from './pages/registration/registration';
import { AuthProvider } from './components/hooks/useAuth';
import { LoginPage } from './pages/login/login';
import { ProductsProvider } from './components/hooks/useProducts';
import { ProductPage } from './pages/product-page/product-page';
import { UserPage } from './pages/user/UserPage';
import { CartProvider } from './components/hooks/useCart';
import { CartPage } from './pages/cart/cart-page';

export function App() {
  return (
    <ThemeProvider theme="light">
      <ToasterProvider toaster={new Toaster()}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <ProductsProvider>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/catalog/:categoryKey" element={<CatalogPage />} />
                    <Route path="/catalog/:categoryKey/:subcategoryKey" element={<CatalogPage />} />
                    <Route path="/products/:productId" element={<ProductPage />} />
                    <Route path="/about-us" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registration" element={<RegistrationPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/cart" element={<CartPage />} />
                  </Route>
                </Routes>
              </ProductsProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
        <ToasterComponent />
      </ToasterProvider>
    </ThemeProvider>
  );
}
