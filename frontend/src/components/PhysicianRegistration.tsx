import { useState } from "react";
import "./PhysicianRegistration.css";
import api from "../api";

interface PhysicianRegistrationProps {
  onSuccess?: (userId?: number) => void;
  onBack?: () => void;
}

const SPECIALTIES = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Critical Care Medicine",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Medical Genetics",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Nuclear Medicine",
  "Obstetrics and Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Orthopedics",
  "Otolaryngology (ENT)",
  "Pathology",
  "Pediatrics",
  "Physical Medicine and Rehabilitation",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiation Oncology",
  "Radiology",
  "Rheumatology",
  "Sports Medicine",
  "Thoracic Surgery",
  "Urology",
  "Vascular Surgery",
];

function PhysicianRegistration({ onSuccess, onBack }: PhysicianRegistrationProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    address: "",
    license: "",
    officeLocation: "",
    specialties: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      specialties: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate specialties
    if (formData.specialties.length === 0) {
      setError("Please select at least one specialty.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        address: formData.address.trim(),
        license: formData.license.trim(),
        office_location: formData.officeLocation.trim(),
        specialties: formData.specialties,
      };

      const response = await api.post("/auth/register/physician", payload);

      if (response.data.success) {
        onSuccess?.(response.data.id);
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
        <h2 className="registration-subtitle">Physician Registration</h2>

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
              placeholder="Dr. Jane Smith"
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
              placeholder="456 Medical Blvd, City, State 12345"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="license">License Number *</label>
            <input
              type="text"
              id="license"
              name="license"
              value={formData.license}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="MD123456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="officeLocation">Office Location *</label>
            <textarea
              id="officeLocation"
              name="officeLocation"
              value={formData.officeLocation}
              onChange={handleChange}
              required
              className="form-input form-textarea"
              placeholder="789 Health Center, Suite 200"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialties">Specialties *</label>
            <select
              id="specialties"
              name="specialties"
              multiple
              value={formData.specialties}
              onChange={handleSpecialtyChange}
              required
              className="form-input form-select"
              size={8}
            >
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <small className="form-help">
              {formData.specialties.length === 0
                ? "Hold Ctrl (Windows) or Cmd (Mac) to select multiple specialties"
                : `${formData.specialties.length} specialty${formData.specialties.length > 1 ? "ies" : ""} selected`}
            </small>
            {formData.specialties.length === 0 && (
              <small className="form-help error">Please select at least one specialty</small>
            )}
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

export default PhysicianRegistration;

