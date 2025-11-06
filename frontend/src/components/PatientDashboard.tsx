import { useState, useRef, useEffect } from "react";
import "./PatientDashboard.css";
import DateRangePicker from "./DateRangePicker";
import DoctorSearch from "./DoctorSearch";
import { patientAPI } from "../api";
import api from "../api";

interface PatientDashboardProps {
  userId?: number | null;
  userEmail?: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency?: string;
  instructions?: string;
}

interface Message {
  id: number;
  subject?: string;
  content?: string;
  physician?: {
    id: number;
    name: string;
    email: string;
  };
  sent_at?: string;
  read?: boolean;
  sender_type?: string;
}

interface Physician {
  id: number;
  name: string;
  email: string;
}

function PatientDashboard({ userId, userEmail }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "search" | "history" | "wallet">("home");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<SVGSVGElement>(null);

  // Data states
  const [medications, setMedications] = useState<Medication[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [patientId, setPatientId] = useState<number | null>(userId || null);

  // Fetch patient ID from email if not provided
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!patientId && userEmail) {
        try {
          // We'll need to get patient ID from email
          // For now, we'll use a default or try to get it from the backend
          // This is a placeholder - you may need to add an endpoint to get user by email
          setPatientId(1); // Fallback to ID 1 for demo
        } catch (err) {
          console.error("Failed to fetch patient ID:", err);
          setPatientId(1); // Fallback
        }
      }
    };

    fetchPatientId();
  }, [patientId, userEmail]);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Fetch medications, messages, and physicians in parallel
        const [medicationsRes, messagesRes, physiciansRes] = await Promise.all([
          patientAPI.getMedications(patientId).catch(() => ({ success: false, medications: [] })),
          patientAPI.getMessages(patientId).catch(() => ({ success: false, messages: [] })),
          patientAPI.getPhysicians(patientId).catch(() => ({ success: false, physicians: [] })),
        ]);

        if (medicationsRes.success) {
          setMedications(medicationsRes.medications || []);
        }

        if (messagesRes.success) {
          setMessages(messagesRes.messages || []);
        }

        if (physiciansRes.success) {
          setPhysicians(physiciansRes.physicians || []);
        }
      } catch (err: any) {
        setError("Failed to load patient data. Please try again.");
        console.error("Error fetching patient data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const dates = [
    { x: 30, label: "Nov 23" },
    { x: 60, label: "Nov 24" },
    { x: 90, label: "Nov 25" },
    { x: 120, label: "Nov 26" },
    { x: 150, label: "Nov 27" },
    { x: 180, label: "Nov 28" },
    { x: 210, label: "Nov 29" },
    { x: 270, label: "Nov 30" },
  ];

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    setIsSelecting(true);
    setRangeStart(x);
    setRangeEnd(x);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelecting || !chartRef.current || rangeStart === null) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    setRangeEnd(x);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const getSelectionRect = () => {
    if (rangeStart === null || rangeEnd === null) return null;
    const start = Math.min(rangeStart, rangeEnd);
    const end = Math.max(rangeStart, rangeEnd);
    return { x: start, width: end - start };
  };

  const selection = getSelectionRect();

  // Show DoctorSearch when search tab is active
  if (activeTab === "search") {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <button className="menu-button" aria-label="Menu" onClick={() => setActiveTab("home")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="dashboard-title">HealthConnect</h1>
          <div className="profile-picture">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#e0e0e0"/>
              <circle cx="16" cy="12" r="5" fill="#666"/>
              <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#666"/>
            </svg>
          </div>
        </header>
        <DoctorSearch />
        <nav className="bottom-nav">
          <button className="nav-item" aria-label="Home" onClick={() => setActiveTab("home")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <button className="nav-item active" aria-label="Search" onClick={() => setActiveTab("search")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button className="nav-item" aria-label="History" onClick={() => setActiveTab("history")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </button>
          <button className="nav-item" aria-label="Wallet" onClick={() => setActiveTab("wallet")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
              <path d="M17 14h.01"></path>
            </svg>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <button className="menu-button" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="dashboard-title">HealthConnect</h1>
        <div className="profile-picture">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#e0e0e0"/>
            <circle cx="16" cy="12" r="5" fill="#666"/>
            <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#666"/>
          </svg>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="date-navigation">
        <div className="date-scroll">
          {days.map((day) => (
            <button
              key={day}
              className={`date-button ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Medication Cards Row */}
        {loading ? (
          <div className="loading-message">Loading medications...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="medication-row">
            {/* Medication Reminder Card */}
            {medications.length > 0 ? (
              <div className="card medication-card">
                <h3 className="card-title">Medication Reminder</h3>
                <h4 className="medication-name">{medications[0].name}</h4>
                <p className="medication-dosage">
                  {medications[0].dosage}
                  {medications[0].frequency && `, ${medications[0].frequency}`}
                </p>
              </div>
            ) : (
              <div className="card medication-card">
                <h3 className="card-title">Medication Reminder</h3>
                <h4 className="medication-name">No medications</h4>
                <p className="medication-dosage">No medications found</p>
              </div>
            )}

            {/* Refill Alert Card */}
            <div className="card refill-card">
              <h3 className="card-title">Refill Alert</h3>
              <p className="refill-action">Click Here to Refill</p>
              <p className="refill-status">
                {medications.length > 0 ? "Check medication status" : "No medications to refill"}
              </p>
            </div>
          </div>
        )}

        {/* Lab Results Card */}
        <div className="card lab-results-card">
          <div className="lab-results-header">
            <div>
              <h3 className="card-title">Lab Results</h3>
              <p className="card-subtitle">Blood Glucose Monitoring During Hospital Stay</p>
            </div>
            <div className="date-range-picker-wrapper">
              <DateRangePicker
                onRangeSelect={(start, end) => {
                  setDateRangeStart(start);
                  setDateRangeEnd(end);
                }}
              />
            </div>
          </div>
          {dateRangeStart && dateRangeEnd && (
            <p className="selected-date-range">
              Showing data from {dateRangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} to {dateRangeEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
          <div className="chart-container">
            <svg
              ref={chartRef}
              className="chart"
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isSelecting ? "crosshair" : "default" }}
            >
              {/* Background */}
              <rect width="300" height="150" fill="#f5f5f5" />
              
              {/* Selection area */}
              {selection && (
                <rect
                  x={selection.x}
                  y="0"
                  width={selection.width}
                  height="150"
                  fill="rgba(33, 150, 243, 0.1)"
                  stroke="#2196f3"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}
              
              {/* Grid lines */}
              <line x1="0" y1="30" x2="300" y2="30" stroke="#e0e0e0" strokeWidth="1" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#e0e0e0" strokeWidth="1" />
              <line x1="0" y1="90" x2="300" y2="90" stroke="#e0e0e0" strokeWidth="1" />
              <line x1="0" y1="120" x2="300" y2="120" stroke="#e0e0e0" strokeWidth="1" />
              
              {/* Area under curve */}
              <path
                d="M 0 120 L 30 110 L 60 100 L 90 85 L 120 70 L 150 75 L 180 80 L 210 65 L 240 60 L 270 55 L 300 50 L 300 150 L 0 150 Z"
                fill="#e3f2fd"
              />
              
              {/* Line */}
              <path
                d="M 0 120 L 30 110 L 60 100 L 90 85 L 120 70 L 150 75 L 180 80 L 210 65 L 240 60 L 270 55 L 300 50"
                fill="none"
                stroke="#2196f3"
                strokeWidth="2"
              />
              
              {/* Data point highlight */}
              <circle cx="300" cy="50" r="4" fill="#2196f3" />
              
              {/* X-axis labels - rotated diagonally */}
              {dates.map((date, index) => (
                <text
                  key={index}
                  x={date.x}
                  y="145"
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                  transform={`rotate(-45 ${date.x} 145)`}
                  className="chart-date-label"
                >
                  {date.label}
                </text>
              ))}
            </svg>
          </div>
          {selection && (
            <p className="chart-selection-info">
              Selected range: {Math.round((selection.x / 300) * 100)}% - {Math.round(((selection.x + selection.width) / 300) * 100)}%
            </p>
          )}
        </div>

        {/* Secure Messaging Card */}
        <div className="card messaging-card">
          <h3 className="card-title">Secure Messaging</h3>
          
          {loading ? (
            <div className="loading-message">Loading messages...</div>
          ) : messages.length > 0 ? (
            <>
              {/* Group messages by physician */}
              {physicians.map((physician) => {
                const physicianMessages = messages.filter(
                  (msg) => msg.physician?.id === physician.id
                );
                const unreadCount = physicianMessages.filter((msg) => !msg.read).length;
                
                if (physicianMessages.length === 0) return null;

                return (
                  <div key={physician.id} className="message-entry">
                    <div className="message-avatar">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#e0e0e0"/>
                        <circle cx="20" cy="15" r="6" fill="#666"/>
                        <path d="M10 32c0-5 4.5-9 10-9s10 4 10 9" fill="#666"/>
                      </svg>
                    </div>
                    <div className="message-info">
                      <h4 className="message-name">{physician.name}</h4>
                      <p className="message-status">
                        {unreadCount > 0
                          ? `${unreadCount} New Message${unreadCount > 1 ? "s" : ""}!`
                          : `${physicianMessages.length} Message${physicianMessages.length > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* AI Summary entry */}
              <div className="message-entry">
                <div className="message-avatar ai-avatar">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#2196f3"/>
                    <path d="M20 12 L25 20 L20 28 L15 20 Z" fill="#ffffff" opacity="0.9"/>
                    <circle cx="20" cy="20" r="4" fill="#ffffff" opacity="0.7"/>
                  </svg>
                </div>
                <div className="message-info">
                  <h4 className="message-name">AI Summary</h4>
                  <p className="message-status">Available</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-messages">
              <p>No messages yet</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active" aria-label="Home" onClick={() => setActiveTab("home")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="nav-item" aria-label="Search" onClick={() => setActiveTab("search")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <button className="nav-item" aria-label="History" onClick={() => setActiveTab("history")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
        </button>
        <button className="nav-item" aria-label="Wallet" onClick={() => setActiveTab("wallet")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
            <path d="M17 14h.01"></path>
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default PatientDashboard;

