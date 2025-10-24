"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const API_URL =
  process.env.NEXT_PUBLIC_API_URL_TUNNEL ||
  process.env.NEXT_PUBLIC_API_URL_LOCAL ||
  "http://localhost:5000";
;

  const downloadInvoice = async () => {
    if (!transactionId) {
      alert("Transaction ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/payment-requests/pdfinvoice/${transactionId}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed to fetch invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed:", err);
      alert("Error downloading invoice.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment Successful!</h1>
      <p style={styles.text}>
        Your Transaction ID: <strong>{transactionId}</strong>
      </p>
      <button onClick={downloadInvoice} style={styles.button}>
        Download Invoice
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  heading: {
    fontSize: 28,
    color: "green",
  },
  text: {
    marginTop: 12,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default SuccessPage;










// // app/success/page.tsx
// "use client";

// import React from "react";
// import { useSearchParams } from "next/navigation";

// const SuccessPage: React.FC = () => {
//   const searchParams = useSearchParams();
//   const transactionId = searchParams.get("transactionId");

//   const downloadInvoice = async () => {
//     if (!transactionId) {
//       alert("Transaction ID not found.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5000/payment-requests/pdfinvoice/${transactionId}`,
//         { method: "GET" }
//       );

//       if (!response.ok) throw new Error("Failed to fetch invoice");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `invoice-${transactionId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url); // Clean up
//     } catch (err) {
//       console.error("Invoice download failed:", err);
//       alert("Error downloading invoice.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Payment Successful!</h1>
//       <p style={styles.text}>
//         Your Transaction ID: <strong>{transactionId}</strong>
//       </p>
//       <button onClick={downloadInvoice} style={styles.button}>
//         Download Invoice
//       </button>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: 40,
//   },
//   heading: {
//     fontSize: 28,
//     color: "green",
//   },
//   text: {
//     marginTop: 12,
//     fontSize: 18,
//   },
//   button: {
//     marginTop: 20,
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },
// };

// export default SuccessPage;
