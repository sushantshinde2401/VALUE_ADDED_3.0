import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { ChevronRight, ChevronLeft, Download, LogOut, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function DualCertificate3() {
  const navigate = useNavigate();
  const canvasLeftRef = useRef(null);
  const canvasRightRef = useRef(null);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const leftImage = new Image();
    const rightImage = new Image();

    leftImage.src = '/static/H2S VERIFICATION.jpg';
    rightImage.src = '/static/angelmaritime3.jpg';

    leftImage.onload = () => {
      const ctx = canvasLeftRef.current.getContext('2d');
      ctx.drawImage(leftImage, 0, 0, 595, 842);
    };

    rightImage.onload = () => {
      const ctx = canvasRightRef.current.getContext('2d');
      ctx.drawImage(rightImage, 0, 0, 595, 842);
    };
  }, []);

  const handleDownloadLeft = () => {
    const canvas = canvasLeftRef.current;
    const imgData = canvas.toDataURL('image/jpeg');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
    pdf.save('H2S_VERIFICATION.pdf');
  };

  const handleDownloadRight = () => {
    const canvas = canvasRightRef.current;
    const imgData = canvas.toDataURL('image/jpeg');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
    pdf.save('ANGELMARITIME3.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-4 bg-[#0b2545] text-white shadow-md min-h-[70px]">
        <div className="flex items-center gap-4">
          <img src="/static/logo.png" alt="Logo" className="h-10" />

          {/* Moved download/show buttons to left */}
          <motion.div
            className="absolute left-[42%] transform -translate-x-1/2 flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button onClick={handleDownloadLeft} className="px-4 py-2 rounded-full flex items-center gap-1 text-sm">
              <Download size={14} /> Left PDF
            </button>

            <button
              onClick={() => setShowRight(!showRight)}
              className="px-4 py-2 rounded-full flex items-center gap-1 text-sm"
            >
              {showRight ? <><ChevronLeft size={14} /> Hide</> : <><ChevronRight size={14} /> Show Second</>}
            </button>

            {showRight && (
              <motion.button
                onClick={handleDownloadRight}
                className="px-4 py-2 rounded-full flex items-center gap-1 text-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Download size={14} /> Right PDF
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Navigation buttons: Logout, Back, Next */}
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/')} className="hover:underline flex items-center gap-1 text-sm">
            <LogOut size={14} /> Logout
          </button>

          <button onClick={() => navigate('/dual-certificate-2')} className="hover:underline flex items-center gap-1 text-sm">
            <ArrowLeft size={14} /> Back
          </button>

          <button onClick={() => navigate('/dual-certificate-4')} className="hover:underline flex items-center gap-1 text-sm">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="flex flex-col items-center gap-6 py-10 px-4">
        <div className="flex items-center transition-all duration-700">
          <canvas
            ref={canvasLeftRef}
            width={595}
            height={842}
            className="border shadow-md"
          ></canvas>

          {/* Right Canvas */}
          <div
            className={`transition-all duration-700 overflow-hidden ${showRight ? 'w-[595px] ml-6 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10'}`}
          >
            <canvas
              ref={canvasRightRef}
              width={595}
              height={842}
              className={`border shadow-md ${showRight ? 'block' : 'hidden'}`}
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DualCertificate3;
