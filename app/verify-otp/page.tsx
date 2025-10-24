"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_TUNNEL ||
  process.env.NEXT_PUBLIC_API_URL_LOCAL ||
  "http://localhost:5000";
;

export default function VerifyOtpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // New state for package info
  const [packageName, setPackageName] = useState("");
  const [packageRate, setPackageRate] = useState("");

  const router = useRouter();

  useEffect(() => {
    // get data stored from Register page
    setName(localStorage.getItem("registerName") || "");
    setEmail(localStorage.getItem("registerEmail") || "");
    setPhone(localStorage.getItem("registerPhone") || "");

    // get selected package info
    setPackageName(localStorage.getItem("selectedPackageName") || "");
    setPackageRate(localStorage.getItem("selectedPackageRate") || "");
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await axios.post(`${API_URL}/users/verify-otp`, { email, otp });

    // OTP verified, store verified* keys
    localStorage.setItem("verifiedName", name);
    localStorage.setItem("verifiedEmail", email);
    localStorage.setItem("verifiedPhone", phone);

    // ✅ Also store selected package info for Payment page
    localStorage.setItem("selectedPackageName", packageName);
    localStorage.setItem("selectedPackageRate", packageRate);

    alert("✅ OTP verified successfully! Redirecting to payment...");
    router.push("/payment-requests"); // go to payment page
  } catch (error: any) {
    alert(error.response?.data?.message || "❌ OTP verification failed.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-96 mx-auto mt-10 space-y-3"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>

      {/* <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
        <p><strong>Name:</strong> {name || "—"}</p>
        <p><strong>Email:</strong> {email || "—"}</p>
        <p><strong>Phone:</strong> {phone || "—"}</p>
        <hr className="my-2" />
        <p><strong>Selected Package:</strong> {packageName || "—"}</p>
        <p><strong>Rate:</strong> {packageRate ? `${packageRate} INR` : "—"}</p>
      </div> */}

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full p-2 mb-3 border rounded"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}











// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export default function VerifyOtpForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // get data stored from Register page
//     const storedName = localStorage.getItem("registerName") || "";
//     const storedEmail = localStorage.getItem("registerEmail") || "";
//     const storedPhone = localStorage.getItem("registerPhone") || "";

//     setName(storedName);
//     setEmail(storedEmail);
//     setPhone(storedPhone);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post(`${API_URL}/users/verify-otp`, { email, otp });
//       alert("✅ OTP verified successfully! You can now log in.");

//       // clear stored data after verification
//       localStorage.removeItem("registerName");
//       localStorage.removeItem("registerEmail");
//       localStorage.removeItem("registerPhone");

//       router.push("/login");
//     } catch (error: any) {
//       alert(error.response?.data?.message || "❌ OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded-xl shadow-md w-96 mx-auto mt-10 space-y-3"
//     >
//       <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>

//       {/* ✅ Show data from register page */}
//       {/* <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
//         <p><strong>Name:</strong> {name || "—"}</p>
//         <p><strong>Email:</strong> {email || "—"}</p>
//         <p><strong>Phone:</strong> {phone || "—"}</p>
//       </div> */}

//       <input
//         type="text"
//         placeholder="Enter OTP"
//         className="w-full p-2 mb-3 border rounded"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         required
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>
//     </form>
//   );
// }








// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export default function VerifyOtpForm() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // get registered email from localStorage
//     const storedEmail = localStorage.getItem("registerEmail") || "";
//     setEmail(storedEmail);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post(`${API_URL}/users/verify-otp`, { email, otp });
//       alert("✅ OTP verified successfully! You can now log in.");
//       router.push("/login"); // navigate to login page
//     } catch (error: any) {
//       alert(error.response?.data?.message || "❌ OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96 mx-auto mt-10">
//       <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

//       <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" value={email} readOnly />
//       <input type="text" placeholder="Enter OTP" className="w-full p-2 mb-3 border rounded" value={otp} onChange={e => setOtp(e.target.value)} required />

//       <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400">
//         {loading ? "Verifying..." : "Verify OTP"}
//       </button>
//     </form>
//   );
// }
