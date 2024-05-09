import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AvailablePhones from './pages/AvailablePhones';
import MyPhones from './pages/MyPhones';

function App() {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<AvailablePhones />} />
          <Route path="/my-phones" element={<MyPhones />} />
        </Routes>
    </UserProvider>
  );
}

export default App;
