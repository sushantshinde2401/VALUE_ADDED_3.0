import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  ChevronRight,
  ChevronLeft,
  Download,
  LogOut,
  ArrowLeft,
  QrCode,
} from "lucide-react";
import { motion } from "framer-motion";

function DualCertificate() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const canvasLeftRef = useRef(null);
  const canvasRightRef = useRef(null);
  const [showRight, setShowRight] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [qrPosition, setQrPosition] = useState({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState({ width: 120, height: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const leftImage = new Image();
    const rightImage = new Image();

    leftImage.src = "/static/BST VERIFICATION.jpg";
    rightImage.src = "/static/angelmaritime1.jpg";

    leftImage.onload = () => {
      const ctx = canvasLeftRef.current.getContext("2d");
      ctx.drawImage(leftImage, 0, 0, 595, 842);
    };

    rightImage.onload = () => {
      const ctx = canvasRightRef.current.getContext("2d");
      ctx.drawImage(rightImage, 0, 0, 595, 842);
    };
  }, []);

  const handleDownloadLeft = async () => {
    try {
      setIsUploading(true);
      const canvas = canvasLeftRef.current;

      // Convert canvas to image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      // Create PDF from canvas
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      pdf.addImage(imgData, "JPEG", 0, 0, 595.28, 841.89);

      // Download PDF locally first
      pdf.save("BST_VERIFICATION.pdf");

      // Convert to blob for upload
      const pdfBlob = pdf.output("blob");

      // Upload to Google Drive
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "BST_VERIFICATION.pdf");

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setDriveLink(data.drive_link);
        setQrUrl(`data:image/png;base64,${data.qr_image}`);

        // Log the actual Drive link for reference
        console.log("Google Drive Link:", data.drive_link);

        if (data.storage_type === "google_drive") {
          alert(
            `PDF downloaded and uploaded to Google Drive!\nDrive Link: ${data.drive_link}\n\nQR code will work on any device.`
          );
        } else {
          alert(
            `PDF downloaded and saved locally.\nWarning: QR code may only work on this network.\n\n${
              data.warning || ""
            }`
          );
        }
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in handleDownloadLeft:", error);
      console.error("Full error details:", error);
      alert(
        `Error: ${error.message}\n\nCheck browser console for more details.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowSecond = () => {
    setShowRight(!showRight);
  };

  const handleGenerateQR = () => {
    if (qrUrl && showRight) {
      setQrVisible(true);
    } else if (!qrUrl) {
      alert(
        "QR not available. Please click 'Left PDF' first to generate QR code."
      );
    } else if (!showRight) {
      alert("Please click 'Show Second' to display the second image first.");
    }
  };

  const handleDownloadRight = () => {
    if (!showRight) {
      alert("Please click 'Show Second' to display the right canvas first.");
      return;
    }

    const canvas = canvasRightRef.current;
    const ctx = canvas.getContext("2d");

    // Create a temporary canvas to combine the certificate and QR code
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 595;
    tempCanvas.height = 842;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw the certificate background
    tempCtx.drawImage(canvas, 0, 0);

    // If QR is visible, draw it on the canvas
    if (qrVisible && qrUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        // Draw QR code at the specified position and size
        tempCtx.drawImage(
          qrImg,
          qrPosition.x,
          qrPosition.y,
          qrSize.width,
          qrSize.height
        );

        // Generate PDF
        const imgData = tempCanvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({ unit: "pt", format: "a4" });
        pdf.addImage(imgData, "JPEG", 0, 0, 595.28, 841.89);
        pdf.save("Certificate_with_QR.pdf");
      };
      qrImg.src = qrUrl;
    } else {
      // No QR code, just download the certificate
      const imgData = tempCanvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      pdf.addImage(imgData, "JPEG", 0, 0, 595.28, 841.89);
      pdf.save("Certificate.pdf");
    }
  };

  // Custom drag handlers
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("qr-drag-handle")) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - qrPosition.x,
        y: e.clientY - qrPosition.y,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setQrPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
    if (isResizing) {
      const newWidth = Math.max(
        60,
        Math.min(250, resizeStart.width + (e.clientX - resizeStart.x))
      );
      const newHeight = Math.max(
        60,
        Math.min(250, resizeStart.height + (e.clientY - resizeStart.y))
      );
      setQrSize({ width: newWidth, height: newWidth }); // Keep it square
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: qrSize.width,
      height: qrSize.height,
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-4 bg-[#0b2545] text-white shadow-md min-h-[70px]">
        {/* Left section: Logo */}
        <div className="flex items-center gap-4">
          <img src="/static/logo.png" alt="Logo" className="h-10" />
        </div>

        {/* Center section: 3 main buttons */}
        <motion.div
          className="flex items-center gap-3 flex-wrap"
          animate={{ x: showRight ? 80 : 0 }} // Shift right by 80px
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-full text-sm bg-white text-black border hover:bg-gray-100"
          />

          <button
            onClick={handleDownloadLeft}
            disabled={isUploading}
            className={`px-4 py-2 rounded-full flex items-center gap-1 text-sm ${
              isUploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <Download size={14} /> {isUploading ? "Uploading..." : "Left PDF"}
          </button>

          <button
            onClick={handleShowSecond}
            className="px-4 py-2 rounded-full flex items-center gap-1 text-sm bg-white text-black hover:bg-gray-100"
          >
            {showRight ? (
              <>
                <ChevronLeft size={14} /> Hide
              </>
            ) : (
              <>
                <ChevronRight size={14} /> Show Second
              </>
            )}
          </button>

          {showRight && (
            <>
              <motion.button
                onClick={handleGenerateQR}
                className="px-4 py-2 rounded-full flex items-center gap-1 text-sm bg-white text-black hover:bg-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <QrCode size={14} /> Generate QR
              </motion.button>

              <motion.button
                onClick={handleDownloadRight}
                className="px-4 py-2 rounded-full flex items-center gap-1 text-sm bg-white text-black hover:bg-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Download size={14} /> Right PDF
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Right section: Navigation buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/")}
            className="hover:underline flex items-center gap-1 text-sm"
          >
            <LogOut size={14} /> Logout
          </button>

          <button
            onClick={() => navigate("/course-preview")}
            className="hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={() => navigate("/dual-certificate-2")}
            className="hover:underline flex items-center gap-1 text-sm"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Canvas section */}
      <div className="flex flex-col items-center gap-6 py-10 px-4">
        <div className="flex items-center transition-all duration-700">
          <canvas
            ref={canvasLeftRef}
            width={595}
            height={842}
            className="border shadow-md"
          ></canvas>

          {/* Right canvas + QR */}
          <div
            className={`relative transition-all duration-700 overflow-hidden ${
              showRight
                ? "w-[595px] ml-6 opacity-100 translate-x-0"
                : "w-0 opacity-0 translate-x-10"
            }`}
          >
            <canvas
              ref={canvasRightRef}
              width={595}
              height={842}
              className={`border shadow-md ${showRight ? "block" : "hidden"}`}
            ></canvas>

            {qrVisible && qrUrl && showRight && (
              <div
                className="absolute z-10"
                style={{
                  left: qrPosition.x,
                  top: qrPosition.y,
                  width: qrSize.width,
                  height: qrSize.height,
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="relative w-full h-full">
                  {/* Drag handle */}
                  <div className="qr-drag-handle absolute inset-0 cursor-move flex items-center justify-center">
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>

                  {/* Resize handle - only visible on hover */}
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity cursor-se-resize"
                    onMouseDown={handleResizeStart}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DualCertificate;
