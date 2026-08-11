import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requirements from './pages/Requirements';
import Modules from './pages/Modules';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RobiWidget from './components/RobiWidget';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requirements" element={<Requirements />} />
                <Route path="/modules" element={<Modules />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <RobiWidget />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
