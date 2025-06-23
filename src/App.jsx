// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import CheckinPage from './pages/ChekinPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Importa el protector

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckinPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>  {/* <-- Envuelve el panel */}
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;