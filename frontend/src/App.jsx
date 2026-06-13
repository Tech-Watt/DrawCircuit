import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import StudyGuide from './StudyGuide';
import AdminDashboard from './AdminDashboard';
import UpdateSuccess from './UpdateSuccess';
import Events from './Events';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<StudyGuide />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/success" element={<UpdateSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
