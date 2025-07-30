import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, BookOpen, Database } from 'lucide-react';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();

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
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/static/Home-bg.jpg')" }}
    >
      {/* Overlay (optional) */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      {/* ✅ Fixed Navbar */}
      {/* <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 bg-[#0b2545] text-white shadow-md h-[70px] z-50">
        <img src="/static/logo.png" alt="Logo" className="h-20" />
      </div> */}

      {/* ✅ Centered content below navbar */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-[1px] px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl font-bold text-white mb-12">
          VALUE ADDED
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <motion.button
              onClick={() => navigate('/course-selection')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center justify-center text-blue-700 text-xl font-semibold gap-2"
            >
              <Briefcase className="w-10 h-10 mx-auto" />
              OPERATION
            </motion.button>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <motion.button
              onClick={() => console.log('BOOK-KEEPING clicked')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center justify-center text-green-700 text-xl font-semibold gap-2"
            >
              <BookOpen className="w-10 h-10 mx-auto" />
              BOOK-KEEPING
            </motion.button>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <motion.button
              onClick={() => console.log('MANAGE & DATABASE clicked')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center justify-center text-purple-700 text-xl font-semibold gap-2"
            >
              <Database className="w-10 h-10 mx-auto" />
              MANAGE & DATABASE
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
