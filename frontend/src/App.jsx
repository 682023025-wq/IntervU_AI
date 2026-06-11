import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CV from './pages/CV';
import Interview from './pages/Interview';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';

// Components
import Layout from './components/Layout';

function App() {
  // State sederhana untuk simulasi login (nanti diganti logic backend)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Fungsi mock login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Fungsi mock logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Layout user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cv" element={<CV />} />
          <Route path="interview" element={<Interview />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;