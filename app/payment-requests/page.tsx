

"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [purpose, setPurpose] = useState("Course Subscription");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get verified user details from localStorage
    setName(localStorage.getItem("verifiedName") || "");
    setEmail(localStorage.getItem("verifiedEmail") || "");
    setPhone(localStorage.getItem("verifiedPhone") || "");

    // Get selected package info from localStorage (stored in Verify OTP page)
    const pkgName = localStorage.getItem("selectedPackageName");
    const pkgRate = localStorage.getItem("selectedPackageRate");

    if (pkgName) setPurpose(pkgName); // autofill purpose as package name
    if (pkgRate) setAmount(Number(pkgRate)); // autofill amount as package rate
  }, []);

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    const vendorDetails = {
      vendor_name: "Vendor A",
      vendor_address: "123 Business Street",
      vendor_email: "vendor@example.com",
      vendor_contact_no: "9876543210",
      vendor_gst_no: "22ABCDE1234F2Z5",
    };

    const customerDetails = {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_address: "",
    };

    const body = {
      externalId: `TXN_${Date.now()}`,
      amount: Number(amount),
      gst: 0,
      basicamount: Number(amount),
      successUrl: window.location.origin + "/payment-success",
      failureUrl: window.location.origin + "/payment-failed",
      purpose,
      ...vendorDetails,
      ...customerDetails,
    };

    try {
      const res = await fetch(`${API_URL}/payment-requests/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: any = await res.json();
      console.log("Payment order response:", data);

      if (data.paymentRequest?.transaction_id) {
        toast.success("Payment order created successfully!");
        window.location.href = `/make-payment?transactionId=${data.paymentRequest.transaction_id}`;
      } else {
        toast.error("❌ Could not create payment order");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating payment order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Payment Details</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Amount (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Purpose</label>
          <input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
      >
        {loading ? "Processing..." : "Pay Now 💳"}
      </button>

      <ToastContainer
        position="top-center"
        style={{ width: "auto", maxWidth: "300px", fontSize: "12px", padding: "10px 15px", zIndex: 9999 }}
        autoClose={3000}
        hideProgressBar
        draggable
        theme="dark"
      />
    </div>
  );
}








// "use client";

// import { useEffect, useState } from "react";

// export default function PaymentRequestsPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   useEffect(() => {
//     // 🧠 Get verified user details from localStorage
//     setName(localStorage.getItem("verifiedName") || "");
//     setEmail(localStorage.getItem("verifiedEmail") || "");
//     setPhone(localStorage.getItem("verifiedPhone") || "");
//   }, []);

//   const handlePay = () => {
//     alert(`Payment initiated for:
// Name: ${name}
// Email: ${email}
// Phone: ${phone}`);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-semibold text-center mb-4">Payment Details</h2>

//       <div className="space-y-3">
//         <div>
//           <label className="text-sm font-medium text-gray-600">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your name"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium text-gray-600">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your email"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium text-gray-600">Phone Number</label>
//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your phone"
//           />
//         </div>
//       </div>

//       <button
//         onClick={handlePay}
//         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
//       >
//         Pay Now 💳
//       </button>
//     </div>
//   );
// }
