import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";
import {
  User,
  Calendar,
  Home,
  Fingerprint,
  ShieldCheck,
  BadgeCheck,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

function CandidateDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    dob: "",
    address: "",
    passport: "",
    cdcNo: "",
    indosNo: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const handleFill = async () => {
    try {
      const res = await fetch("structured_passport_data.json");
      const data = await res.json();
      const front = data["Front Image"];
      const back = data["Back Image"];

      setFormData((prev) => ({
        ...prev,
        lastName: front["Surname"] || "",
        firstName: front["Given Name(s)"] || "",
        dob: convertToDate(front["Date of Birth"]),
        address: back["Address"] || "",
        passport: front["Passport No."] || "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  const convertToDate = (dateStr) => {
    if (!dateStr) return "";
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value.toUpperCase(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert("Form submitted successfully!");
      console.log(result);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  const iconMap = {
    lastName: <User size={16} />,
    firstName: <User size={16} />,
    dob: <Calendar size={16} />,
    address: <Home size={16} />,
    passport: <Fingerprint size={16} />,
    cdcNo: <ShieldCheck size={16} />,
    indosNo: <BadgeCheck size={16} />,
    email: <Mail size={16} />,
    phone: <Phone size={16} />,
    companyName: <Building2 size={16} />,
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0b2545] text-white shadow-md h-[70px]">
        <img src="/static/logo.png" alt="Logo" className="h-10" />
        <div className="flex gap-4 text-sm">
          <button onClick={() => navigate("/")} className="hover:underline">
            Logout
          </button>
          <button onClick={() => navigate("/upload-docx")} className="hover:underline">
            Back
          </button>
          <button onClick={() => navigate("/certificate-form")} className="hover:underline">
            Next
          </button>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center items-center py-4 px-4 pt-16"
      >
        <div className="max-w-4xl w-full">
          <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-blue-700 dark:text-blue-400 mb-8">
              Candidate Details
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {[
                ["lastName", "Last Name"],
                ["firstName", "First Name"],
                ["dob", "Date of Birth", "date"],
                ["address", "Permanent Address"],
                ["passport", "Passport No."],
                ["cdcNo", "CDC No."],
                ["indosNo", "INDOS No."],
                ["email", "Email ID", "email"],
                ["phone", "Phone No.", "tel"],
                ["companyName", "Company Name"],
              ].map(([id, label, type = "text"]) => (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="block font-medium mb-2 flex items-center gap-2">
                    {label}:
                  </label>
                  <div className="flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-300">
                    {iconMap[id]}
                    <input
                      type={type}
                      id={id}
                      value={formData[id]}
                      onChange={handleChange}
                      required
                      className="w-full text-sm bg-gray-50 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 pt-8">
              <button
                type="submit"
                className="bg-green-600 text-sm px-6 py-2 rounded-full hover:bg-green-700 transition"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={handleFill}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Fill
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default CandidateDetails;
