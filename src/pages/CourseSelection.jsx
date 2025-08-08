import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Loader2,
  CheckCircle,
  RotateCcw,
  LogOut,
  ArrowLeftCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CourseSelection() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [""];
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [shakeIndices, setShakeIndices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyIndices = courses
      .map((course, index) => (course.trim() === "" ? index : -1))
      .filter((i) => i !== -1);

    if (!courses.length || courses.every(course => !course)) {
      setValidationError("Please enter at least one course.");
      return;
    }

    if (emptyIndices.length > 0) {
      setValidationError("All course fields must be filled.");
      setShakeIndices(emptyIndices);
      setTimeout(() => setShakeIndices([]), 600); // Remove shake after animation
      return;
    }

    setValidationError("");
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    const emptyIndices = courses
      .map((course, index) => (course.trim() === "" ? index : -1))
      .filter((i) => i !== -1);

    if (!courses.length || courses.every(course => !course)) {
      setValidationError("Please enter at least one course before saving.");
      return;
    }

    if (emptyIndices.length > 0) {
      setValidationError("All course fields must be filled before saving.");
      setShakeIndices(emptyIndices);
      setTimeout(() => setShakeIndices([]), 600);
      return;
    }

    localStorage.setItem("courses", JSON.stringify(courses));
    navigate("/course-preview");
  };

  const resetFields = () => {
    setCourses([""]);
    setSubmitted(false);
    setValidationError("");
    localStorage.removeItem("courses");
  };

  const addCourseField = () => {
    if (courses.length < 10) {
      setCourses([...courses, ""]);
    }
  };

  const removeCourseField = (index) => {
    if (courses.length > 1) {
      const updated = courses.filter((_, i) => i !== index);
      setCourses(updated);
    }
  };

  const updateCourse = (index, value) => {
    const updated = [...courses];
    updated[index] = value;
    setCourses(updated);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-gray-900 transition-colors duration-300 overflow-hidden"
      style={{ backgroundImage: "url('/static/bg-ocean.jpg')" }}
    >
{/* Floating Action Buttons (FAB) */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="fixed bottom-6 right-6 flex gap-3 z-50"
>
<div className="flex gap-4">
  <button
    onClick={() => navigate("/")}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
  >
    <LogOut size={18} />
    {/* Logout */}
  </button>

  <button
    onClick={() => navigate("/candidate-details")}
    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow flex items-center gap-2"
  >
    <ArrowLeftCircle size={18} />
    {/* Back */}
  </button>

  {/* <button
    onClick={() => navigate("")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
  >
    Next
    <ArrowRightCircle size={18} />
  </button> */}
</div>

</motion.div>


      <div className="pt-[100px] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-3xl p-6 mb-6 border border-white/30"
        >
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
            Course Selection
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter the courses you wish to preview
          </p>

          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                {validationError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                animate={shakeIndices.includes(index) ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <label className="block font-semibold mb-2">Course {index + 1}</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => updateCourse(index, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:border-blue-500 transition-colors text-base"
                  disabled={submitted}
                  placeholder="Enter course name"
                />
                {courses.length > 1 && !submitted && (
                  <button
                    type="button"
                    onClick={() => removeCourseField(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </motion.div>
            ))}

            {courses.length < 10 && (
              <button
                type="button"
                onClick={addCourseField}
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mt-3 flex items-center gap-1"
                disabled={submitted}
              >
                <span>+ Add Another Course</span>
              </button>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  if (courses.some(c => c)) {
                    handleSubmit(new Event("submit"));
                  } else {
                    setValidationError("Please enter at least one course.");
                  }
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetFields}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/30"              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">
                    Selection Confirmed
                  </h2>
                  <p className="text-gray-600">
                    Please review your selection before proceeding
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2">
                    {courses.map((course, index) => (
                      <p key={index} className="text-base text-gray-800 font-semibold">
                        Course {index + 1}: {course}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Edit Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CourseSelection;
