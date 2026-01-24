import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Docs from './pages/Docs';
import DocsAdmin from './pages/DocsAdmin';
import { authService } from './utils/auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
    
    // If not authenticated and trying to access protected route, redirect will happen in route
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!authService.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/admin" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/docs-admin" 
          element={
            <ProtectedRoute>
              <DocsAdmin onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
