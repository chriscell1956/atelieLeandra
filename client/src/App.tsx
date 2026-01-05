import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { CartPage } from './pages/CartPage';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Dashboard } from './pages/Admin/Dashboard';
import { ProductManager } from './pages/Admin/ProductManager';
import { ProtectedRoute } from './components/ProtectedRoute';

import { CartProvider } from './context/CartContext';

import { SiteContentProvider } from './context/SiteContentContext';
import { WhatsAppButton } from './components/WhatsAppButton';

import { ProductsPage } from './pages/ProductsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteContentProvider>
          <Router>
            <div className="min-h-screen font-sans text-wood-900">
              <Navbar />
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/produtos" element={<ProductsPage />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/sobre" element={<About />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute />}>
                    <Route index element={<Dashboard />} />
                    <Route path="produtos" element={<ProductManager />} />
                  </Route>
                </Routes>
              </div>
              <WhatsAppButton />
            </div>
          </Router>
        </SiteContentProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
