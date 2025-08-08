import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import certificateMap from "./certificateMap";
import { ArrowLeft, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CoursePreview() {
  const [courses, setCourses] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [statusFlags, setStatusFlags] = useState({});
  const navigate = useNavigate();

  // Load courses and status
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      setCourses(parsedCourses);

      const flags = {};
      parsedCourses.forEach((course) => {
        const key = `status_${course}`;
        let visited = localStorage.getItem(key);
        if (visited === null) {
          localStorage.setItem(key, "false"); // first time = not visited
          visited = "false";
        }
        flags[course] = visited === "true";
      });
      setStatusFlags(flags);
    }
  }, []);

  // Navigate and set status visited
  const handleCourseClick = (course) => {
    localStorage.setItem(`status_${course}`, "true");
    navigate(certificateMap[course]);
  };

  // Toggle menu per card
  const toggleMenu = (course) => {
    setOpenMenus((prev) => ({
      ...prev,
      [course]: !prev[course],
    }));
  };

  // Reset all status flags
  const handleEditSelection = () => {
    courses.forEach((course) => {
      localStorage.removeItem(`status_${course}`);
    });
    navigate("/course-selection");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-10">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 bg-[#0b2545] text-white shadow-md h-[70px] z-50">
        <img src="/static/logo.png" alt="Logo" className="h-20" />
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="hover:underline">
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <motion.div
        className="pt-[100px] flex flex-col items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-blue-900 mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Course Preview
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full items-start">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-2">
                <motion.button
                  onClick={() => handleCourseClick(course)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-blue-700 text-xl font-semibold text-left"
                >
                  {course}
                </motion.button>

                <button
                  onClick={() => toggleMenu(course)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Inline status section */}
              <AnimatePresence>
                {openMenus[course] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>STATUS</span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          statusFlags[course] ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>VERIFICATION</span>
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>COURSE IN CLOUD</span>
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Edit Button */}
        <div className="mt-10 flex justify-center">
          <motion.button
            onClick={handleEditSelection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit Selection
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default CoursePreview;
