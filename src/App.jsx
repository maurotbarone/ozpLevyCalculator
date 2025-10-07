import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // ✅ Valori iniziali modificabili dall'utente
  const [EE, setEE] = useState(950);
  const [PW, setPW] = useState(5);
  const [services, setServices] = useState(122000);
  const avgWage = 48161;

  const [result, setResult] = useState(null);

  useEffect(() => {
    const EE_val = parseFloat(EE) || 0;
    const PW_val = parseFloat(PW) || 0;
    const services_val = parseFloat(services) || 0;

    if (EE_val > 25) {
      const requiredOZP = EE_val * 0.04;
      const actualPct = (PW_val / EE_val) * 100;
      //const multiplier = actualPct >= 3 ? 1.0 : actualPct >= 1 ? 2.0 : 3.5;

      const missingBefore = Math.max(requiredOZP - PW_val, 0);
      const substituteEquiv = services_val / (7 * avgWage);
      const missingAfter = Math.max(requiredOZP - (PW_val + substituteEquiv), 0);
      
      //parti aggiunte per aggiornare il multiplier in base agli OZP efettivi+equivalenti
      const actualPctPwEq = ((PW_val + substituteEquiv)/EE_val) * 100;
      const multiplier = actualPctPwEq >= 3 ? 1.0 : actualPctPwEq >= 1 ? 2.0 : 3.5;
      
      const levyPerMissing = multiplier * avgWage;
      const levyWithout = missingBefore * levyPerMissing;
      const levyWith = missingAfter * levyPerMissing;
      const difference = levyWithout - levyWith;

      setResult({
        "Total employees (EE)": EE_val.toLocaleString(),
        "Employees with disabilities (PWD)": PW_val.toLocaleString(),
        "Average wage 2025 Q1-Q2 (CZK)": avgWage.toLocaleString(),
        "Services purchased (CZK)": services_val.toLocaleString(),
        "Required OZP (4%)": requiredOZP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Actual % of OZP": actualPct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Multiplier": multiplier,
        "Missing OZP before services": missingBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "OZP equivalent from services": substituteEquiv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Actual % of OZP + Equivalent": actualPctPwEq.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Missing OZP after services": missingAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "Levy without services (CZK)": levyWithout.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        "Levy with services (CZK)": levyWith.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        "Difference / Saved (CZK)": difference.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      });
    } else {
      setResult(null);
    }
  }, [EE, PW, services]);

  // ✅ Reset valori iniziali
  const resetForm = () => {
    setEE(650);
    setPW(5);
    setServices(122000);
    setResult(null);
  };

  return (
    <div className="container">
      <h1>OZP Levy Calculation</h1>

      {/* Input centrati e in orizzontale */}
      <div className="inputs-horizontal">
        <div className="input-block">
          <label>Total employees (EE)</label>
          <input
            type="number"
            value={EE}
            onChange={(e) => setEE(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label>EE's with disabilities (PWD)</label>
          <input
            type="number"
            value={PW}
            onChange={(e) => setPW(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label>Services purchased (CZK)</label>
          <input
            type="number"
            value={services}
            onChange={(e) => setServices(e.target.value)}
          />
        </div>
      </div>

      <button className="reset-btn" onClick={resetForm}>
        Reset
      </button>

      {/* Messaggio warning se EE <= 25 */}
      {EE && parseFloat(EE) <= 25 ? (
        <p className="warning">
          Total employees must be greater than 25 to be subject to the mandatory share.
        </p>
      ) : result ? (
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th className="header-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td className="value-cell">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default App;