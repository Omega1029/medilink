import { useState } from "react";
import "./SignIn.css";
import api from "../api";

interface SignInProps {
  onPatientSignIn?: (email: string) => void;
  onPhysicianSignIn?: (email: string) => void;
}

function SignIn({ onPatientSignIn, onPhysicianSignIn }: SignInProps) {
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [physicianEmail, setPhysicianEmail] = useState("");
  const [physicianPassword, setPhysicianPassword] = useState("");
  const [patientError, setPatientError] = useState("");
  const [physicianError, setPhysicianError] = useState("");
  const [patientLoading, setPatientLoading] = useState(false);
  const [physicianLoading, setPhysicianLoading] = useState(false);

  const handlePatientContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError("");
    setPatientLoading(true);

    try {
      // Basic hashmap check: if user == 'demo' and password == 'password'
      if (patientEmail.trim() === "demo@example.com" && patientPassword === "password") {
        onPatientSignIn?.(patientEmail);
      } else {
        // Try API call
        const response = await api.post("/auth/patient", {
          email: patientEmail,
          password: patientPassword,
        });
        
        if (response.data.success) {
          onPatientSignIn?.(patientEmail);
        } else {
          setPatientError("Invalid email or password");
        }
      }
    } catch (error: any) {
      // If API fails, fall back to demo check
      if (patientEmail.trim() === "demo@example.com" && patientPassword === "password") {
        onPatientSignIn?.(patientEmail);
      } else {
        setPatientError("Invalid email or password");
      }
    } finally {
      setPatientLoading(false);
    }
  };

  const handlePhysicianContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhysicianError("");
    setPhysicianLoading(true);

    try {
      // Basic hashmap check: if user == 'doctor@example.com' and password == 'password'
      if (physicianEmail.trim() === "doctor@example.com" && physicianPassword === "password") {
        onPhysicianSignIn?.(physicianEmail);
      } else {
        // Try API call
        const response = await api.post("/auth/physician", {
          email: physicianEmail,
          password: physicianPassword,
        });
        
        if (response.data.success) {
          onPhysicianSignIn?.(physicianEmail);
        } else {
          setPhysicianError("Invalid email or password");
        }
      }
    } catch (error: any) {
      // If API fails, fall back to demo check
      if (physicianEmail.trim() === "doctor@example.com" && physicianPassword === "password") {
        onPhysicianSignIn?.(physicianEmail);
      } else {
        setPhysicianError("Invalid email or password");
      }
    } finally {
      setPhysicianLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <h1 className="app-title">HealthConnect</h1>
        <h2 className="sign-in-subtitle">Secure Sign In</h2>

        {/* Patient Section */}
        <div className="sign-in-section">
          <h3 className="section-heading">Patient</h3>
          <p className="section-instruction">
            Enter your email to sign into this app
          </p>
          <form onSubmit={handlePatientContinue}>
            <input
              type="email"
              className="email-input"
              placeholder="email@domain.com"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="email-input"
              placeholder="Password"
              value={patientPassword}
              onChange={(e) => setPatientPassword(e.target.value)}
              required
            />
            {patientError && <p className="error-message">{patientError}</p>}
            <button 
              type="submit" 
              className="continue-button"
              disabled={patientLoading}
            >
              {patientLoading ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>

        {/* Separator */}
        <div className="separator">
          <div className="separator-line"></div>
          <span className="separator-text">or</span>
          <div className="separator-line"></div>
        </div>

        {/* Physician Section */}
        <div className="sign-in-section">
          <h3 className="section-heading">Physician</h3>
          <p className="section-instruction">
            Enter your email to sign into this app
          </p>
          <form onSubmit={handlePhysicianContinue}>
            <input
              type="email"
              className="email-input"
              placeholder="email@domain.com"
              value={physicianEmail}
              onChange={(e) => setPhysicianEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="email-input"
              placeholder="Password"
              value={physicianPassword}
              onChange={(e) => setPhysicianPassword(e.target.value)}
              required
            />
            {physicianError && <p className="error-message">{physicianError}</p>}
            <button 
              type="submit" 
              className="continue-button"
              disabled={physicianLoading}
            >
              {physicianLoading ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>

        {/* Legal Text */}
        <p className="legal-text">
          By clicking continue, you agree to our{" "}
          <a href="#" className="legal-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="legal-link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

