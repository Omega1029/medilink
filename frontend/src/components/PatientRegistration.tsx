import { useState } from "react";
import "./PatientRegistration.css";
import api from "../api";

interface PatientRegistrationProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

function PatientRegistration({ onSuccess, onBack }: PatientRegistrationProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    address: "",
    hasInsurance: false,
    physicianId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        address: formData.address.trim(),
        has_insurance: formData.hasInsurance,
      };

      // Add physician_id only if provided
      if (formData.physicianId.trim()) {
        const physicianId = parseInt(formData.physicianId.trim());
        if (!isNaN(physicianId) && physicianId > 0) {
          payload.physician_id = physicianId;
        }
      }

      const response = await api.post("/auth/register/patient", payload);

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-content">
        <h1 className="app-title">HealthConnect</h1>
        <h2 className="registration-subtitle">Patient Registration</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="email@domain.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="form-input"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="form-input form-textarea"
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hasInsurance"
                checked={formData.hasInsurance}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>I have health insurance coverage</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="physicianId">Physician ID (Optional)</label>
            <input
              type="number"
              id="physicianId"
              name="physicianId"
              value={formData.physicianId}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your physician ID if you have one"
              min="1"
            />
            <small className="form-help">Leave blank if you don't have a physician yet</small>
          </div>

          <div className="form-actions">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="back-button"
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="legal-text">
          By registering, you agree to our{" "}
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

export default PatientRegistration;

