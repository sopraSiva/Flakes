import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MessagesPage } from './pages/MessagesPage';
import { CreateMessagePage } from './pages/CreateMessagePage';
import { MessageDetailPage } from './pages/MessageDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/create" element={<CreateMessagePage />} />
        <Route path="/messages/:id" element={<MessageDetailPage />} />
        <Route path="/" element={<Navigate to="/messages" replace />} />
      </Routes>
    </Router>
  );
}

export default App;