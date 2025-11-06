import { useState } from "react";
import SignIn from "./components/SignIn";
import PatientDashboard from "./components/PatientDashboard";
import PhysicianDashboard from "./components/PhysicianDashboard";
import "./App.css";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userType, setUserType] = useState<"patient" | "physician" | null>(null);

  const handlePatientSignIn = (email: string) => {
    console.log("Patient sign in:", email);
    setUserType("patient");
    setIsSignedIn(true);
  };

  const handlePhysicianSignIn = (email: string) => {
    console.log("Physician sign in:", email);
    setUserType("physician");
    setIsSignedIn(true);
  };

  if (isSignedIn && userType === "patient") {
    return <PatientDashboard />;
  }

  if (isSignedIn && userType === "physician") {
    return <PhysicianDashboard />;
  }

  return (
    <SignIn
      onPatientSignIn={handlePatientSignIn}
      onPhysicianSignIn={handlePhysicianSignIn}
    />
  );
}

export default App;
