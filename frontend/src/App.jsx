import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CircuitMaker from './CircuitMaker';
import StudyGuide from './StudyGuide';
import AdminDashboard from './AdminDashboard';
import UpdateSuccess from './UpdateSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<CircuitMaker />} />
        <Route path="/study" element={<StudyGuide />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/success" element={<UpdateSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
