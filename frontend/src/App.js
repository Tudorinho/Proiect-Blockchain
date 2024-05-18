import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AvailablePhones from './pages/AvailablePhones';
import MyPhones from './pages/MyPhones';
import ConnnectWallet from './pages/ConnnectWallet';


function App() {
  return (
    <UserProvider>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Available Phones</Link></li>
            <li><Link to="/my-phones">My Phones</Link></li>
            <li><Link to="/connect-wallet">Connect Wallet</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<AvailablePhones />} />
          <Route path="/my-phones" element={<MyPhones />} />
          <Route path="/connect-wallet" element={<ConnnectWallet />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
