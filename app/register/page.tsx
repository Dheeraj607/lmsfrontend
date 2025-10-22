"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.post(`${API_URL}/users/create`, formData);

      // store email to use in OTP page
      localStorage.setItem("registerEmail", formData.email);

      setMessage({ type: "success", text: "✅ Registration successful! Redirecting to OTP..." });
      setTimeout(() => router.push("/verify-otp"), 1500);
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      {message && (
        <div
          className={`p-2 rounded text-center text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
      <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
      <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
