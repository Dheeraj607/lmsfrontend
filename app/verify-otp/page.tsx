"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function VerifyOtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // get registered email from localStorage
    const storedEmail = localStorage.getItem("registerEmail") || "";
    setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/users/verify-otp`, { email, otp });
      alert("✅ OTP verified successfully! You can now log in.");
      router.push("/login"); // navigate to login page
    } catch (error: any) {
      alert(error.response?.data?.message || "❌ OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96 mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

      <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" value={email} readOnly />
      <input type="text" placeholder="Enter OTP" className="w-full p-2 mb-3 border rounded" value={otp} onChange={e => setOtp(e.target.value)} required />

      <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
