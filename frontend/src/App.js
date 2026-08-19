import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requirements from './pages/Requirements';
import Modules from './pages/Modules';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1117',
              color: '#e2e8f0',
              border: '1px solid #1e293b',
              borderRadius: '8px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="modules" element={<Modules />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
