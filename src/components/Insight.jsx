import { useEffect, useState } from "react";
import { getLastFiveEntries } from "../firebaseDiary";
import { auth } from "../firebase";
import "../styles/global.css";

export default function Insight() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to view diary entries.");
        setLoading(false);
        return;
      }

      try {
        const fetchedEntries = await getLastFiveEntries(user.uid);
        setEntries(fetchedEntries);
      } catch (err) {
        console.error("Error fetching diary entries:", err);
        setError("Failed to fetch diary entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleSelectEntry = (entry) => setSelectedEntry(entry);
  const handleBack = () => setSelectedEntry(null);

  const generateReport = async () => {
    if (entries.length === 0) {
      setReport("No diary entries to analyze.");
      return;
    }

    setAiLoading(true);
    setReport("");

    try {
      const res = await fetch("http://localhost:5000/api/weekly-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      const data = await res.json();
      const insightText = data.insight || "AI couldn't generate an insight this time.";

      setReport(
        insightText +
          "\n\nDisclaimer: At HealHub, we rely heavily on technology. We might misjudge entries or make mistakes sometimes."
      );
    } catch (err) {
      console.error(err);
      setReport("Failed to generate AI report. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div>Loading diary entries...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="insight-container">
      {!selectedEntry && (
        <>
          <h3>Last 5 Diary Entries</h3>
          <ul className="diary-list" style={{ padding: 0, listStyle: "none" }}>
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="diary-item"
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                <button
                  className="diary-title-btn"
                  onClick={() => handleSelectEntry(entry)}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginRight: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#2c3e50",
                  }}
                >
                  {entry.title || "Untitled Entry"}
                </button>
                <span className="diary-date" style={{ color: "#888" }}>
                  {entry.date || "No date"}
                </span>
              </li>
            ))}
          </ul>

          <button
            className="btn primary-btn"
            onClick={generateReport}
            style={{ marginTop: "1.5rem" }}
            disabled={aiLoading}
          >
            {aiLoading ? "Generating AI Report..." : "Generate Full Insight Report"}
          </button>

          {report && (
            <pre
              style={{
                marginTop: "1rem",
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {report}
            </pre>
          )}
        </>
      )}

      {selectedEntry && (
        <div className="diary-detail" style={{ marginTop: "1rem" }}>
          <h3>{selectedEntry.title || "Untitled Entry"}</h3>
          <p>
            <strong>Date:</strong> {selectedEntry.date || "No date"}
          </p>
          <p>{selectedEntry.entry}</p>
          <button
            className="btn secondary-btn"
            onClick={handleBack}
            style={{ marginTop: "1rem" }}
          >
            Back to entries
          </button>
        </div>
      )}
    </div>
  );
}
