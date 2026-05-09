// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import PublicShopLayout from './pages/public/PublicShopLayout';
import PublicShopPage from './pages/public/PublicShopPage';
import PublicProductDetail from './pages/public/PublicProductDetail';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

import StoreLayout from './pages/store/StoreLayout';
import StoreProducts from './pages/store/StoreProducts';
import StoreProductCreate from './pages/store/StoreProductCreate';
import StoreProductEdit from './pages/store/StoreProductEdit';

import ClientLayout from './pages/client/ClientLayout';
import ShopPage from './pages/client/ShopPage';
import CartPage from './pages/client/CartPage';
import OrdersPage from './pages/client/OrdersPage';
import ClientProductDetail from './pages/client/ClientProductDetail';

import PackerLayout from './pages/packer/PackerLayout';
import PackerOrders from './pages/packer/PackerOrders';

import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryOrders from './pages/delivery/DeliveryOrders';

const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-gray-400 mt-2">Page en construction...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — page d'accueil */}
          <Route path="/" element={<PublicShopLayout />}>
            <Route index element={<PublicShopPage />} />
            <Route path="product/:id" element={<PublicProductDetail />} />
          </Route>

          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin - nested routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Store Owner */}
          <Route
            path="/store"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <StoreLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<StoreProducts />} />
            <Route path="products/create" element={<StoreProductCreate />} />
            <Route path="products/edit/:id" element={<StoreProductEdit />} />
          </Route>

          {/* Packer */}
          <Route
            path="/packer"
            element={
              <ProtectedRoute allowedRoles={['PACKER']}>
                <PackerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PackerOrders />} />
            <Route path="orders" element={<PackerOrders />} />
          </Route>

          {/* Delivery */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <DeliveryLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DeliveryOrders />} />
            <Route path="orders" element={<DeliveryOrders />} />
          </Route>

          {/* Normal User / Client */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ShopPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="product/:id" element={<ClientProductDetail />} />
          </Route>

          <Route path="/unauthorized" element={<PlaceholderPage title="Accès non autorisé" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
