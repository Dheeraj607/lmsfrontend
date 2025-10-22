"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // import router

type TeacherPackage = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  imageName?: string | null;
};

type PackagePointItem = { id: number; point?: string | null; packageId: number };
type PackagePricingItem = { id: number; rate: string; packageId: number };
type PackagePricingSettingItem = {
  id: number;
  packagePricingId: number;
  discount?: string | null; // percentage discount
  specialPrice?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
};

export default function TeacherPackagePage() {
  const [packages, setPackages] = useState<TeacherPackage[]>([]);
  const [pointsMap, setPointsMap] = useState<Map<number, string[]>>(new Map());
  const [rateMap, setRateMap] = useState<Map<number, number>>(new Map());
  const [pricingMap, setPricingMap] = useState<Map<number, PackagePricingSettingItem>>(new Map());
  const [packagePricingMap, setPackagePricingMap] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // initialize router

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [pkgRes, ptsRes, priceRes, priceSettingRes] = await Promise.all([
          fetch("http://localhost:5000/teacher-packages/"),
          fetch("http://localhost:5000/package-points"),
          fetch("http://localhost:5000/package-pricing"),
          fetch("http://localhost:5000/package-pricing-settings"),
        ]);

        if (!pkgRes.ok) throw new Error(`Packages fetch failed: ${pkgRes.status}`);
        if (!ptsRes.ok) throw new Error(`Points fetch failed: ${ptsRes.status}`);
        if (!priceRes.ok) throw new Error(`Pricing fetch failed: ${priceRes.status}`);
        if (!priceSettingRes.ok) throw new Error(`Pricing settings fetch failed: ${priceSettingRes.status}`);

        const pkgData: TeacherPackage[] = await pkgRes.json();
        const ptsData: PackagePointItem[] = await ptsRes.json();
        const priceData: PackagePricingItem[] = await priceRes.json();
        const priceSettingData: PackagePricingSettingItem[] = await priceSettingRes.json();

        setPackages(pkgData);

        const pointsMapTemp = new Map<number, string[]>();
        ptsData.forEach(pt => {
          const pid = pt.packageId;
          const text = pt.point ?? "";
          if (!pointsMapTemp.has(pid)) pointsMapTemp.set(pid, [text]);
          else pointsMapTemp.get(pid)!.push(text);
        });
        setPointsMap(pointsMapTemp);

        const rateMapTemp = new Map<number, number>();
        const packagePricingMapTemp = new Map<number, number>();
        priceData.forEach(pr => {
          rateMapTemp.set(pr.packageId, parseFloat(pr.rate));
          packagePricingMapTemp.set(pr.packageId, pr.id);
        });
        setRateMap(rateMapTemp);
        setPackagePricingMap(packagePricingMapTemp);

        const pricingMapTemp = new Map<number, PackagePricingSettingItem>();
        priceSettingData.forEach(ps => {
          pricingMapTemp.set(ps.packagePricingId, ps);
        });
        setPricingMap(pricingMapTemp);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading all packages...</p>;
  if (packages.length === 0) return <p style={{ padding: 20 }}>No packages found</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>All Teacher Packages</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {packages.map(pkg => {
          const pkgPoints = pointsMap.get(pkg.id) ?? [];
          const pkgRate = rateMap.get(pkg.id) ?? 0;
          const packagePricingId = packagePricingMap.get(pkg.id);
          const pricingSetting = packagePricingId ? pricingMap.get(packagePricingId) : null;

          let finalPrice = pkgRate;
          let priceLabel = "";
          if (pricingSetting) {
            if (pricingSetting.specialPrice) {
              finalPrice = parseFloat(pricingSetting.specialPrice);
              priceLabel = `Special Price: ${finalPrice.toFixed(2)} INR`;
            } else if (pricingSetting.discount) {
              const discountPercent = parseFloat(pricingSetting.discount);
              finalPrice = pkgRate - (pkgRate * discountPercent / 100);
              priceLabel = `Discounted Price: ${finalPrice.toFixed(2)} INR (${discountPercent}% off)`;
            }
          }

          return (
            <div
              key={pkg.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                transition: "transform .2s, box-shadow .2s",
              }}
            >
              {pkg.imageName ? (
                <img src={`http://localhost:5000/uploads/${pkg.imageName}`} alt={pkg.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", color: "#999" }}>No image</div>
              )}

              <div style={{ padding: 15, flex: 1, display: "flex", flexDirection: "column" }}>
                <h2 style={{ margin: "0 0 10px", fontSize: 18, color: "#222" }}>{pkg.name}</h2>
                <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#444" }}>{pkg.tagline}</p>
                <p style={{ margin: "0 0 12px", color: "#666", fontSize: 14 }}>{pkg.description}</p>

                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "#333" }}>Points</h4>
                  {pkgPoints.length === 0 ? (
                    <p style={{ margin: 0, color: "#999", fontSize: 13 }}>No points available</p>
                  ) : (
                    <ul style={{ margin: "6px 0 0 18px", padding: 0, color: "#444", fontSize: 14 }}>
                      {pkgPoints.map((pText, idx) => (
                        <li key={idx} style={{ marginBottom: 6, lineHeight: 1.4 }}>{pText}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ marginTop: "auto" }}>
                  <strong>Rate:</strong>{" "}
                  {pricingSetting ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#999" }}>{pkgRate.toFixed(2)} INR</span>{" "}
                      <span style={{ marginLeft: 8, color: "#d9534f", fontWeight: 600 }}>{priceLabel}</span>
                    </>
                  ) : (
                    <span>{pkgRate.toFixed(2)} INR</span>
                  )}

                  {/* Purchase button */}
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color .2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#007bff")}
                      onClick={() => router.push("/register")} // navigate to register page
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}









// "use client";

// import { useEffect, useState } from "react";

// type TeacherPackage = {
//   id: number;
//   name: string;
//   tagline: string;
//   description: string;
//   imageName?: string | null;
// };

// type PackagePointItem = { id: number; point?: string | null; packageId: number };
// type PackagePricingItem = { id: number; rate: string; packageId: number };
// type PackagePricingSettingItem = {
//   id: number;
//   packagePricingId: number;
//   discount?: string | null; // percentage discount
//   specialPrice?: string | null;
//   fromDate?: string | null;
//   toDate?: string | null;
// };

// export default function TeacherPackagePage() {
//   const [packages, setPackages] = useState<TeacherPackage[]>([]);
//   const [pointsMap, setPointsMap] = useState<Map<number, string[]>>(new Map());
//   const [rateMap, setRateMap] = useState<Map<number, number>>(new Map());
//   const [pricingMap, setPricingMap] = useState<Map<number, PackagePricingSettingItem>>(new Map());
//   const [packagePricingMap, setPackagePricingMap] = useState<Map<number, number>>(new Map());
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchAll() {
//       setLoading(true);
//       try {
//         const [pkgRes, ptsRes, priceRes, priceSettingRes] = await Promise.all([
//           fetch("http://localhost:5000/teacher-packages/"),
//           fetch("http://localhost:5000/package-points"),
//           fetch("http://localhost:5000/package-pricing"),
//           fetch("http://localhost:5000/package-pricing-settings"),
//         ]);

//         if (!pkgRes.ok) throw new Error(`Packages fetch failed: ${pkgRes.status}`);
//         if (!ptsRes.ok) throw new Error(`Points fetch failed: ${ptsRes.status}`);
//         if (!priceRes.ok) throw new Error(`Pricing fetch failed: ${priceRes.status}`);
//         if (!priceSettingRes.ok) throw new Error(`Pricing settings fetch failed: ${priceSettingRes.status}`);

//         const pkgData: TeacherPackage[] = await pkgRes.json();
//         const ptsData: PackagePointItem[] = await ptsRes.json();
//         const priceData: PackagePricingItem[] = await priceRes.json();
//         const priceSettingData: PackagePricingSettingItem[] = await priceSettingRes.json();

//         setPackages(pkgData);

//         // Points map
//         const pointsMapTemp = new Map<number, string[]>();
//         ptsData.forEach(pt => {
//           const pid = pt.packageId;
//           const text = pt.point ?? "";
//           if (!pointsMapTemp.has(pid)) pointsMapTemp.set(pid, [text]);
//           else pointsMapTemp.get(pid)!.push(text);
//         });
//         setPointsMap(pointsMapTemp);

//         // Rate map & packagePricingId map
//         const rateMapTemp = new Map<number, number>();
//         const packagePricingMapTemp = new Map<number, number>();
//         priceData.forEach(pr => {
//           rateMapTemp.set(pr.packageId, parseFloat(pr.rate));
//           packagePricingMapTemp.set(pr.packageId, pr.id);
//         });
//         setRateMap(rateMapTemp);
//         setPackagePricingMap(packagePricingMapTemp);

//         // Pricing settings map
//         const pricingMapTemp = new Map<number, PackagePricingSettingItem>();
//         priceSettingData.forEach(ps => {
//           pricingMapTemp.set(ps.packagePricingId, ps);
//         });
//         setPricingMap(pricingMapTemp);

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAll();
//   }, []);

//   if (loading) return <p style={{ padding: 20 }}>Loading all packages...</p>;
//   if (packages.length === 0) return <p style={{ padding: 20 }}>No packages found</p>;

//   return (
//     <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
//       <h1 style={{ textAlign: "center", marginBottom: 30 }}>All Teacher Packages</h1>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
//         {packages.map(pkg => {
//           const pkgPoints = pointsMap.get(pkg.id) ?? [];
//           const pkgRate = rateMap.get(pkg.id) ?? 0;
//           const packagePricingId = packagePricingMap.get(pkg.id);
//           const pricingSetting = packagePricingId ? pricingMap.get(packagePricingId) : null;

//           // Calculate final price for discount
//           let finalPrice = pkgRate;
//           let priceLabel = "";
//           if (pricingSetting) {
//             if (pricingSetting.specialPrice) {
//               finalPrice = parseFloat(pricingSetting.specialPrice);
//               priceLabel = `Special Price: ${finalPrice.toFixed(2)} INR`;
//             } else if (pricingSetting.discount) {
//               const discountPercent = parseFloat(pricingSetting.discount);
//               finalPrice = pkgRate - (pkgRate * discountPercent / 100);
//               priceLabel = `Discounted Price: ${finalPrice.toFixed(2)} INR (${discountPercent}% off)`;
//             }
//           }

//           return (
//             <div
//               key={pkg.id}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
//                 backgroundColor: "#fff",
//                 display: "flex",
//                 flexDirection: "column",
//                 transition: "transform .2s, box-shadow .2s",
//               }}
//             >
//               {pkg.imageName ? (
//                 <img src={`http://localhost:5000/uploads/${pkg.imageName}`} alt={pkg.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
//               ) : (
//                 <div style={{ width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", color: "#999" }}>No image</div>
//               )}

//               <div style={{ padding: 15, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <h2 style={{ margin: "0 0 10px", fontSize: 18, color: "#222" }}>{pkg.name}</h2>
//                 <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#444" }}>{pkg.tagline}</p>
//                 <p style={{ margin: "0 0 12px", color: "#666", fontSize: 14 }}>{pkg.description}</p>

//                 <div>
//                   <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "#333" }}>Points</h4>
//                   {pkgPoints.length === 0 ? (
//                     <p style={{ margin: 0, color: "#999", fontSize: 13 }}>No points available</p>
//                   ) : (
//                     <ul style={{ margin: "6px 0 0 18px", padding: 0, color: "#444", fontSize: 14 }}>
//                       {pkgPoints.map((pText, idx) => (
//                         <li key={idx} style={{ marginBottom: 6, lineHeight: 1.4 }}>{pText}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 <div style={{ marginTop: "auto" }}>
//                   <strong>Rate:</strong>{" "}
//                   {pricingSetting ? (
//                     <>
//                       <span style={{ textDecoration: "line-through", color: "#999" }}>{pkgRate.toFixed(2)} INR</span>{" "}
//                       <span style={{ marginLeft: 8, color: "#d9534f", fontWeight: 600 }}>{priceLabel}</span>
//                     </>
//                   ) : (
//                     <span>{pkgRate.toFixed(2)} INR</span>
//                   )}

//                   {/* Purchase button */}
//                   <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
//                     <button
//                       style={{
//                         backgroundColor: "#007bff",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         padding: "10px 20px",
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         transition: "background-color .2s",
//                       }}
//                       onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
//                       onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#007bff")}
//                       onClick={() => alert(`Purchased package: ${pkg.name} for ${finalPrice.toFixed(2)} INR`)}
//                     >
//                       Purchase
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
