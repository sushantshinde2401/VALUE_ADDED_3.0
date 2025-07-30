import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';                // ⬅️ New import
import CourseSelection from './pages/CourseSelection';
import CandidateDetail from './pages/CandidateDetail';
import UploadDocx from './pages/UploadDocx';
import DualCertificate from './pages/DualCertificate';
import DualCertificate2 from './pages/DualCertificate2';
import DualCertificate3 from './pages/DualCertificate3';
import DualCertificate4 from './pages/DualCertificate4';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />                     {/* ⬅️ New home page */}
        <Route path="/course-selection" element={<CourseSelection />} />
        <Route path="/candidate-details" element={<CandidateDetail />} />
        <Route path="/upload-docx" element={<UploadDocx />} />
        <Route path="/certificate-form" element={<DualCertificate />} />
        <Route path="/dual-certificate-2" element={<DualCertificate2 />} />
        <Route path="/dual-certificate-3" element={<DualCertificate3 />} />
        <Route path="/dual-certificate-4" element={<DualCertificate4 />} />
      </Routes>
    </Router>
  );
}

export default App;
