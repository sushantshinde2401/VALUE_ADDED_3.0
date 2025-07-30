import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  BookOpenText,
  Info,
  Loader2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CourseSelection() {
  const [companyName, setCompanyName] = useState(() => localStorage.getItem("companyName") || "");
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("courses")) || [""]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeFields, setShakeFields] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [companyName, courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const addCourseField = () => {
    if (courses.length < 4) {
      setCourses([...courses, ""]);
    }
  };

  const removeCourseField = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
  };

  const updateCourse = (index, value) => {
    const updated = [...courses];
    updated[index] = value;
    setCourses(updated);
  };

  const resetFields = () => {
    setCompanyName("");
    setCourses([""]);
    setSubmitted(false);
    localStorage.removeItem("companyName");
    localStorage.removeItem("courses");
  };

  const handleSave = () => {
    const emptyIndexes = courses.map((c, i) => c.trim() === "" ? i : null).filter(i => i !== null);
    if (emptyIndexes.length > 0) {
      setShakeFields(emptyIndexes);
      setTimeout(() => setShakeFields([]), 1000);
      return;
    }
    alert("Courses saved successfully!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-gray-900 transition-colors duration-300 overflow-hidden"
      style={{ backgroundImage: "url('/static/bg-ocean.jpg')" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 bg-[#0b2545] text-white shadow-md h-[70px] z-50">
        <img src="static/logo.png" alt="Logo" className="h-20" />
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="hover:underline">
            Back
          </button>
          <button
            onClick={() => navigate("/upload-docx")}
            className="hover:text-[#fcd34d] text-white font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="pt-[100px] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`bg-white bg-opacity-90 shadow-xl rounded-2xl w-full max-w-3xl p-6 mb-6`}
        >
          <h1 className="text-2xl font-semibold text-center text-blue-800 mb-6">
            Company Course Organizer
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Select Company
              </label>
              <select
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-sm"
                disabled={submitted}
              >
                <option value="">-- Choose Company --</option>
                <option value="INFOSYS">INFOSYS</option>
                <option value="TCS">TCS</option>
                <option value="WIPRO">WIPRO</option>
                <option value="ACCENTURE">ACCENTURE</option>
                <option value="IBM">IBM</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={loading || submitted}
                className="bg-blue-600 text-white px-5 py-1.5 rounded-full hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Generating..." : "Generate Fields"}
              </button>
              <button
                type="button"
                onClick={resetFields}
                className="text-sm text-red-500 hover:underline"
              >
                Reset
              </button>
            </div>
          </form>
        </motion.div>

        {/* Course Input Fields */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl h-auto"
            >
              <div className="bg-white bg-opacity-90 shadow-md rounded-xl p-4 mb-4 border border-blue-100">
                <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <BookOpenText className="w-5 h-5 text-blue-500" />
                  {companyName} Courses
                </h2>

                <div className="space-y-2">
                  {courses.map((course, i) => (
                    <motion.div
                      key={i}
                      className={`relative ${shakeFields.includes(i) ? 'animate-shake' : ''}`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <input
                        type="text"
                        placeholder={`e.g. STCW Fire Prevention`}
                        value={course}
                        onChange={(e) => updateCourse(i, e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        Course name should match the certificate.
                      </p>
                      {courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourseField(i)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {courses.length < 4 && (
                  <button
                    type="button"
                    onClick={addCourseField}
                    className="text-blue-600 hover:underline text-sm mt-4"
                  >
                    + Add Another Course
                  </button>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-4 text-center">
                <button
                  className="bg-green-600 text-white px-5 py-1.5 rounded-full hover:bg-green-700 transition text-sm"
                  onClick={handleSave}
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>
        {`
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }

          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default CourseSelection;
