import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { default as Home } from './pages/Home';
import SearchPG from './pages/SearchPG';
import PGDetails from './pages/PGDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import QRCodePage from './pages/owner/QRCodePage';
import Profile from './pages/user/Profile';
import Booking from './pages/user/Booking';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPG />} />
                <Route path="/pg/:id" element={<PGDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/booking/:pgId" element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } />
                
                {/* Owner Routes */}
                <Route path="/owner/dashboard" element={
                  <ProtectedRoute requiredRole="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/owner/qr/:id" element={
                  <ProtectedRoute requiredRole="owner">
                    <QRCodePage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
