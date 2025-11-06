import { useState } from "react";
import SignIn from "./components/SignIn";
import PatientDashboard from "./components/PatientDashboard";
import PhysicianDashboard from "./components/PhysicianDashboard";
import PatientRegistration from "./components/PatientRegistration";
import PhysicianRegistration from "./components/PhysicianRegistration";
import "./App.css";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userType, setUserType] = useState<"patient" | "physician" | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showPatientRegister, setShowPatientRegister] = useState(false);
  const [showPhysicianRegister, setShowPhysicianRegister] = useState(false);

  const handlePatientSignIn = (email: string, id?: number) => {
    console.log("Patient sign in:", email, id);
    setUserEmail(email);
    setUserId(id || null);
    setUserType("patient");
    setIsSignedIn(true);
  };

  const handlePhysicianSignIn = (email: string, id?: number) => {
    console.log("Physician sign in:", email, id);
    setUserEmail(email);
    setUserId(id || null);
    setUserType("physician");
    setIsSignedIn(true);
  };

  const handlePatientRegisterSuccess = (id?: number) => {
    // After successful registration, automatically sign in
    setShowPatientRegister(false);
    setUserId(id || null);
    setUserType("patient");
    setIsSignedIn(true);
  };

  const handlePhysicianRegisterSuccess = (id?: number) => {
    // After successful registration, automatically sign in
    setShowPhysicianRegister(false);
    setUserId(id || null);
    setUserType("physician");
    setIsSignedIn(true);
  };

  if (isSignedIn && userType === "patient") {
    return <PatientDashboard userId={userId} userEmail={userEmail} />;
  }

  if (isSignedIn && userType === "physician") {
    return <PhysicianDashboard userId={userId} userEmail={userEmail} />;
  }

  if (showPatientRegister) {
    return (
      <PatientRegistration
        onSuccess={handlePatientRegisterSuccess}
        onBack={() => setShowPatientRegister(false)}
      />
    );
  }

  if (showPhysicianRegister) {
    return (
      <PhysicianRegistration
        onSuccess={handlePhysicianRegisterSuccess}
        onBack={() => setShowPhysicianRegister(false)}
      />
    );
  }

  return (
    <SignIn
      onPatientSignIn={handlePatientSignIn}
      onPhysicianSignIn={handlePhysicianSignIn}
      onPatientRegister={() => setShowPatientRegister(true)}
      onPhysicianRegister={() => setShowPhysicianRegister(true)}
    />
  );
}

export default App;
