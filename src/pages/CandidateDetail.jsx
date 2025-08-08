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
  CreditCard,
  Wallet,
  LogOut,
  ArrowLeftCircle,
  ArrowRightCircle
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
    vendorName: "",
    paymentStatus: "",
    rollNo: "",
    paymentProof: null,
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
    const isDropdown = id === "vendorName" || id === "paymentStatus";

    setFormData((prev) => ({
      ...prev,
      [id]: isDropdown ? value : value.toUpperCase(),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paymentProof: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isPaid = formData.paymentStatus === "PAID";
      const payload = isPaid ? new FormData() : JSON.stringify(formData);

      if (isPaid) {
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "paymentProof" && value) {
            payload.append("paymentProof", value);
          } else {
            payload.append(key, value);
          }
        });
      }

      const res = await fetch("http://localhost:5001/upload", {
        method: "POST",
        headers: isPaid ? undefined : { "Content-Type": "application/json" },
        body: payload,
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
    vendorName: <Building2 size={16} />,
    paymentStatus: <CreditCard size={16} />,
    rollNo: <Wallet size={16} />,
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-black overflow-hidden"
      style={{ backgroundImage: "url('/static/CandidateDetails-bg.jpg')" }}
    >
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="fixed bottom-6 right-6 z-50 flex gap-3"
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
    onClick={() => navigate("/upload-docx")}
    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow flex items-center gap-2"
  >
    <ArrowLeftCircle size={18} />
    {/* Back */}
  </button>
  
  <button
    onClick={() => navigate("/course-selection")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
  >
    {/* Next */}
    <ArrowRightCircle size={18} />
  </button>
</div>
</motion.div>


      {/* Form */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center items-center py-4 px-4 pt-16"
      >
        <div className="max-w-4xl w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white/40 backdrop-blur-sm p-6 shadow-xl rounded-2xl border border-white/30"
          >
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
                ["companyName", "Company Joining Name"],
                ["rollNo", "ROLL NO"],
              ].map(([id, label, type = "text"]) => (
                <div key={id} className="flex flex-col">
                  <label
                    htmlFor={id}
                    className="block font-medium mb-2 flex items-center gap-2"
                  >
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

              {/* Vendor Name dropdown */}
              <div className="flex flex-col">
                <label
                  htmlFor="vendorName"
                  className="block font-medium mb-2 flex items-center gap-2"
                >
                  Vendor Name:
                </label>
                <div className="flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-300">
                  {iconMap.vendorName}
                  <select
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    required
                    className="w-full text-sm bg-gray-50 focus:outline-none"
                  >
                    <option value="">Select Vendor</option>
                    <option value="Vendor A">Vendor A</option>
                    <option value="Vendor B">Vendor B</option>
                    <option value="Vendor C">Vendor C</option>
                  </select>
                </div>
              </div>

              {/* Payment Status dropdown */}
              <div className="flex flex-col col-span-2">
                <label
                  htmlFor="paymentStatus"
                  className="block font-medium mb-2 flex items-center gap-2"
                >
                  Payment Status:
                </label>
                <div className="flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-300">
                  {iconMap.paymentStatus}
                  <select
                    id="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                    className="w-full text-sm bg-gray-50 focus:outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="PAID">PAID</option>
                    <option value="CREDIT">CREDIT</option>
                  </select>
                </div>
              </div>

              {/* Show file input if PAID */}
              {formData.paymentStatus === "PAID" && (
                <div className="flex flex-col col-span-2">
                  <label className="block font-medium mb-2">
                    Attach Payment Screenshot:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm"
                  />
                </div>
              )}
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
