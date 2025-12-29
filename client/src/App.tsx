import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { CartPage } from './pages/CartPage';
import { Dashboard } from './pages/Admin/Dashboard';
import { ProductManager } from './pages/Admin/ProductManager';
import { ProtectedRoute } from './components/ProtectedRoute';

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-wood-50 font-sans text-wood-900">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/produtos" element={<div className="p-4">Produtos (Em breve)</div>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route index element={<Dashboard />} />
                  <Route path="produtos" element={<ProductManager />} />
                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
