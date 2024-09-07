import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from './pages/Auth';
import Signin from './pages/SignIn';
import TurfBookingApp from './pages/Booking2';
import Booking3 from './pages/Booking3';
import PlaygroundDisplay from './pages/Playground';
import Booking from './pages/Booking';
import { Home } from './pages/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:playgroundName/:playgroundId" element={<PlaygroundDisplay />} />
        <Route path="/book/:playgroundId" element={<Booking />} />
        <Route path="/book" element={<TurfBookingApp />} />
        <Route path="/book2" element={<Booking3 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}