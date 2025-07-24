import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MessagesPage } from './pages/MessagesPage';
import { CreateMessagePage } from './pages/CreateMessagePage';
import { MessageDetailPage } from './pages/MessageDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/create"
            element={
              <ProtectedRoute>
                <CreateMessagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute>
                <MessageDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/messages" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;