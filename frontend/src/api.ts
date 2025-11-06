import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Patient API functions
export const patientAPI = {
  getMedications: async (patientId: number) => {
    const response = await api.get(`/patients/${patientId}/medications`);
    return response.data;
  },
  getMessages: async (patientId: number) => {
    const response = await api.get(`/patients/${patientId}/messages`);
    return response.data;
  },
  getPhysicians: async (patientId: number) => {
    const response = await api.get(`/patients/${patientId}/physicians`);
    return response.data;
  },
};

// Physician API functions
export const physicianAPI = {
  getPatients: async (physicianId: number) => {
    const response = await api.get(`/physicians/${physicianId}/patients`);
    return response.data;
  },
  getMessages: async (physicianId: number) => {
    const response = await api.get(`/physicians/${physicianId}/messages`);
    return response.data;
  },
  getSpecialties: async () => {
    const response = await api.get("/physicians/specialties");
    return response.data;
  },
};

export default api;
