import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  ImageUp,
  PenLine,
  BadgeHelp,
  FileImage,
  IdCard,
  FileCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

function UploadDocx() {
  const navigate = useNavigate();

  return (
    <motion.div
      
      className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Fixed Navbar */}
<motion.div
  className="fixed top-0 left-0 right-0 h-[70px] z-50 flex items-center justify-between px-6 bg-[#0b2545] text-white shadow-md"
>
  <img src="static/logo.png" alt="Logo" className="h-20" />
  <div className="flex gap-4 items-center text-sm">
    <button onClick={() => navigate('/')} className="hover:underline">
      Logout
    </button>
    <button onClick={() => navigate('/course-selection')} className="hover:underline">
      Back
    </button>
    <button
      onClick={() => navigate('/candidate-details')}
      className="hover:text-[#fcd34d] text-white font-medium"
    >
      Next →
    </button>
  </div>
</motion.div>


      {/* Page Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center items-center py-10 px-4 pt-32"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-5xl">
          <h2 className="text-3xl font-semibold text-center text-blue-700 dark:text-blue-400 mb-10">
            Upload Documents
          </h2>

          <form
            id="uploadForm"
            action="http://127.0.0.1:5000/uploads"
            method="POST"
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <ImageUp className="mr-2 h-4 w-4" /> Upload Photo <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <PenLine className="mr-2 h-4 w-4" /> Upload Signature <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  name="signature"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <IdCard className="mr-2 h-4 w-4" /> Passport Front Image <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  name="frontImage"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <BadgeHelp className="mr-2 h-4 w-4" /> Passport Back Image <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  name="backImage"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <FileImage className="mr-2 h-4 w-4" /> CDC Image
                </label>
                <input
                  type="file"
                  name="cdcImage"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <FileCheck className="mr-2 h-4 w-4" /> Upload Marksheet
                </label>
                <input
                  type="file"
                  name="marksheet"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-xl cursor-pointer focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-3 pt-8 flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all flex items-center gap-2"
              >
                <UploadCloud size={18} /> Upload Documents
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UploadDocx;
