import { useEffect, useState } from "react";
import { getLastFiveEntries } from "../firebaseDiary";
import { auth } from "../firebase";
import jsPDF from "jspdf";
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
        console.log("Fetched last 5 diary entries:", fetchedEntries);
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
    if (!entries || entries.length === 0) {
      setReport("No diary entries to analyze.");
      return;
    }

    setAiLoading(true);
    setReport("");

    try {
      const payload = Array.isArray(entries) ? { entries } : { entries: [entries] };

      const res = await fetch(
        "https://heal-hub-healing-3.onrender.com/api/weekly-insight",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

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

  // Extract sentiment keywords from report
  const getSentimentSummary = () => {
    const summary = { Positive: 0, Negative: 0, Neutral: 0 };
    const lowerReport = report.toLowerCase();

    if (lowerReport.includes("positive")) summary.Positive += 1;
    if (lowerReport.includes("negative")) summary.Negative += 1;
    if (lowerReport.includes("neutral")) summary.Neutral += 1;

    return summary;
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("HealHub Emotional Insight Report", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("You are not alone.", 20, 30);

    doc.setDrawColor(180);
    doc.line(20, 35, 190, 35);

    // Sentiment Graph
    const sentimentSummary = getSentimentSummary();
    const sentiments = Object.keys(sentimentSummary);
    const maxValue = Math.max(...Object.values(sentimentSummary));
    const graphTop = 45;
    const barHeight = 6;
    const barSpacing = 10;

    doc.setFontSize(13);
    doc.text("Sentiment Overview:", 20, graphTop);

    sentiments.forEach((type, i) => {
      const count = sentimentSummary[type];
      const barWidth = (count / maxValue || 1) * 100;
      const y = graphTop + 10 + i * barSpacing;

      const colors = {
        Positive: [76, 175, 80],
        Negative: [244, 67, 54],
        Neutral: [158, 158, 158]
      };

      doc.setFillColor(...colors[type]);
      doc.rect(20, y, barWidth, barHeight, "F");
      doc.text(`${type} (${count})`, 125, y + 5);
    });

    // Report Text
    const lines = doc.splitTextToSize(report, 170);
    doc.text(lines, 20, graphTop + 10 + sentiments.length * barSpacing + 10);

    doc.save(`HealHub_AI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
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
            <>
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

              <button
                className="btn secondary-btn"
                onClick={handleDownloadReport}
                style={{ marginTop: "1rem" }}
              >
                📥 Download AI Report
              </button>
            </>
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