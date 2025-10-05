import { useState } from "react";

function App() {
  const [EE, setEE] = useState("50"); // usare stringa
  const [PW, setPW] = useState("2");
  const [services, setServices] = useState("100000");

  const avgWage = 42658; // valore fisso

  const calculateData = () => {
    const EE_val = Number(EE) || 0;
    const PW_val = Number(PW) || 0;
    const services_val = Number(services) || 0;

    if (EE_val <= 25) return null;

    const required_OZP = EE_val * 0.04;
    const actual_pct = EE_val > 0 ? (PW_val / EE_val) * 100 : 0;
    let multiplier;
    if (actual_pct >= 3) multiplier = 1.0;
    else if (actual_pct >= 1) multiplier = 2.0;
    else multiplier = 3.5;

    const missing_before = Math.max(required_OZP - PW_val, 0);
    const substitute_equiv = avgWage > 0 ? services_val / (7 * avgWage) : 0;
    const missing_after = Math.max(required_OZP - (PW_val + substitute_equiv), 0);

    const levy_per_missing = multiplier * avgWage;
    const levy_without_services = missing_before * levy_per_missing;
    const levy_with_services = missing_after * levy_per_missing;
    const difference = levy_without_services - levy_with_services;

    return [
      ["Total employees (EE)", EE_val],
      ["Employees with disabilities (PWD)", PW_val],
      ["Average wage 2025 (CZK)", avgWage],
      ["Services purchased (CZK)", services_val],
      ["Required OZP (4%)", required_OZP.toFixed(2)],
      ["Actual % of OZP", actual_pct.toFixed(2)],
      ["Multiplier", multiplier],
      ["Missing OZP before services", missing_before.toFixed(2)],
      ["OZP equivalent from services", substitute_equiv.toFixed(2)],
      ["Missing OZP after services", missing_after.toFixed(2)],
      ["Levy without services (CZK)", Math.round(levy_without_services)],
      ["Levy with services (CZK)", Math.round(levy_with_services)],
      ["Difference / Saved (CZK)", Math.round(difference)],
    ];
  };

  const data = calculateData();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>OZP Levy Calculator</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Total employees (EE):{" "}
          <input
            type="number"
            value={EE}
            onChange={e => setEE(e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Employees with disabilities (PWD):{" "}
          <input
            type="number"
            value={PW}
            onChange={e => setPW(e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Services purchased (CZK):{" "}
          <input
            type="number"
            value={services}
            onChange={e => setServices(e.target.value)}
          />
        </label>
      </div>

      <p>Average wage (CZK): <b>{avgWage}</b> (fixed)</p>

      {Number(EE) <= 25 ? (
        <p style={{ color: "red" }}>Total employees must be greater than 25.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([param, val], i) => (
              <tr key={i}>
                <td>{param}</td>
                <td>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;