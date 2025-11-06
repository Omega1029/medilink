

# ⚙️ Health Connect — Backend (GoLang)

The **Health Connect Backend** is a RESTful API built with **Go (Golang)** that powers the Health Connect medical application.  
It manages user authentication, secure communication, and health data exchange between patients and healthcare providers.  

This backend is lightweight, fast, and ready to integrate with any SQL database and ReactJS frontend.

---

## 🚀 Tech Stack

- **Go (Golang)** — Backend language  
- **Gin** — HTTP web framework  
- **GORM** — ORM for database operations  
- **SQLite** — File-based database (no configuration needed)  
- **JWT** — JSON Web Tokens for authentication  
- **bcrypt** — Password hashing  
- **UUID** — Universally Unique Identifiers for secure IDs  
- **godotenv** — Environment configuration (optional)  
- **CORS Middleware** — Enables frontend access  
- **JSON-based APIs** — Secure data exchange  

---

## 📁 Project Structure

```bash
backend/
│
├── main.go                 # Entry point and route setup
├── go.mod                  # Module definition
├── go.sum                  # Dependency checksums
├── .env                    # Environment variables (optional)
├── healthconnect.db        # SQLite database (auto-generated)
└── internal/
    ├── models/             # Database models
    │   ├── patient.go
    │   ├── physician.go
    │   ├── medication.go
    │   ├── message.go
    │   ├── specialty.go
    │   └── specialties.go
    └── handlers/           # Request handlers
        ├── auth.go
        ├── patient.go
        └── physician.go
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/health-connect.git
cd health-connect/backend
```

### 2️⃣ Initialize Go Module

```bash
go mod init github.com/yourusername/health-connect
```

### 3️⃣ Install Dependencies

```bash
go get github.com/gin-gonic/gin
go get github.com/joho/godotenv
go get gorm.io/gorm
go get gorm.io/driver/sqlite
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
go get github.com/google/uuid
```

---

## 🧾 Environment Variables

Environment variables are **optional** for SQLite. The database file (`healthconnect.db`) will be created automatically.

Optional `.env` file:

```
# Optional: Custom database path (defaults to healthconnect.db)
DB_PATH=healthconnect.db

# Optional: JWT secret key (defaults to a development key)
JWT_SECRET=your-secret-key-change-in-production
```

---

## ▶️ Run the Server

```bash
go run main.go
```

Then visit:
👉 [http://localhost:8080](http://localhost:8080)

Expected output:

```json
{"message": "Welcome to Health Connect API 🚀"}
```

---

## 🌐 Connecting to the Frontend

The ReactJS frontend connects to this backend through REST API endpoints.
Ensure both apps run locally:

| App              | Port | Command          |
| ---------------- | ---- | ---------------- |
| Backend (Go)     | 8080 | `go run main.go` |
| Frontend (React) | 5173 | `npm run dev`    |

Frontend requests are sent to:

```
http://localhost:8080/
```

---

## 📡 API Endpoints

### Health Check

**GET** `/`

Returns a welcome message.

**Response:**
```json
{
  "message": "Welcome to Health Connect API 🚀"
}
```

---

### Authentication Endpoints

#### Patient Login

**POST** `/auth/patient`

Authenticate a patient and receive a JWT token.

**Request:**
```json
{
  "email": "patient@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### Physician Login

**POST** `/auth/physician`

Authenticate a physician and receive a JWT token.

**Request:**
```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### Patient Registration

**POST** `/auth/register/patient`

Register a new patient account. Account is automatically verified.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "address": "123 Main St, City, State 12345",
  "has_insurance": true,
  "physician_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Note:** `physician_id` is optional (UUID format). If provided, the patient will be linked to that physician.

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Patient account created successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

#### Physician Registration

**POST** `/auth/register/physician`

Register a new physician account. Account is automatically verified. Physicians must select at least one medical specialty.

**Request:**
```json
{
  "username": "drjane",
  "email": "jane@example.com",
  "password": "password123",
  "name": "Dr. Jane Smith",
  "address": "456 Medical Blvd, City, State 12345",
  "license": "MD123456",
  "office_location": "789 Health Center, Suite 200",
  "specialties": ["Cardiology", "Internal Medicine"]
}
```

**Note:** `specialties` is required and must contain at least one specialty name. Available specialties include: Allergy and Immunology, Anesthesiology, Cardiology, Dermatology, Emergency Medicine, Endocrinology, Family Medicine, Gastroenterology, General Surgery, Geriatrics, Hematology, Infectious Disease, Internal Medicine, Medical Genetics, Nephrology, Neurology, Neurosurgery, Nuclear Medicine, Obstetrics and Gynecology, Oncology, Ophthalmology, Orthopedic Surgery, Orthopedics, Otolaryngology (ENT), Pathology, Pediatrics, Physical Medicine and Rehabilitation, Plastic Surgery, Psychiatry, Pulmonology, Radiation Oncology, Radiology, Rheumatology, Sports Medicine, Thoracic Surgery, Urology, Vascular Surgery, and more.

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Physician account created successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "License number already registered"
}
```

---

### Patient Endpoints

#### Get Patient Medications

**GET** `/patients/:id/medications`

Retrieve all medications for a specific patient. The `:id` parameter should be a UUID.

**Response:**
```json
{
  "success": true,
  "medications": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "patient_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Aspirin",
      "dosage": "81mg",
      "frequency": "Once daily",
      "instructions": "Take with food",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": null,
      "prescribed_by": "Dr. Smith"
    }
  ]
}
```

---

#### Get Patient Messages

**GET** `/patients/:id/messages`

Retrieve all messages for a specific patient. The `:id` parameter should be a UUID.

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "patient_id": "550e8400-e29b-41d4-a716-446655440001",
      "physician_id": "550e8400-e29b-41d4-a716-446655440002",
      "subject": "Follow-up Appointment",
      "content": "Please schedule a follow-up appointment...",
      "sent_at": "2024-01-15T10:30:00Z",
      "read": false,
      "sender_type": "physician",
      "physician": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Dr. Smith",
        "email": "dr.smith@example.com"
      }
    }
  ]
}
```

---

#### Get Patient Physicians

**GET** `/patients/:id/physicians`

Retrieve all physicians associated with a specific patient. The `:id` parameter should be a UUID. Includes physician specialties.

**Response:**
```json
{
  "success": true,
  "physicians": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "drjane",
      "email": "jane@example.com",
      "name": "Dr. Jane Smith",
      "address": "456 Medical Blvd",
      "license": "MD123456",
      "office_location": "789 Health Center, Suite 200",
      "verified": true,
      "specialties": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "name": "Cardiology"
        },
        {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "name": "Internal Medicine"
        }
      ]
    }
  ]
}
```

---

### Physician Endpoints

#### Get Physician Patients

**GET** `/physicians/:id/patients`

Retrieve all patients associated with a specific physician. The `:id` parameter should be a UUID.

**Response:**
```json
{
  "success": true,
  "patients": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "address": "123 Main St",
      "has_insurance": true,
      "verified": true
    }
  ]
}
```

---

#### Get Physician Messages

**GET** `/physicians/:id/messages`

Retrieve all messages for a specific physician. The `:id` parameter should be a UUID.

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "patient_id": "550e8400-e29b-41d4-a716-446655440001",
      "physician_id": "550e8400-e29b-41d4-a716-446655440002",
      "subject": "Question about medication",
      "content": "I have a question about my prescription...",
      "sent_at": "2024-01-15T14:20:00Z",
      "read": false,
      "sender_type": "patient",
      "patient": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

#### Get Available Specialties

**GET** `/physicians/specialties`

Retrieve all available medical specialties that physicians can select during registration.

**Response:**
```json
{
  "success": true,
  "specialties": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Allergy and Immunology"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "Anesthesiology"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "name": "Cardiology"
    }
  ]
}
```

**Note:** This endpoint returns all 38+ medical specialties available in the system, sorted alphabetically.

---

## 🔒 Security Features

- **UUID-based IDs** — All entities use UUIDs instead of sequential IDs to prevent enumeration attacks
- **Password Hashing** — All passwords are hashed using bcrypt before storage
- **JWT Authentication** — Secure token-based authentication for all users
- **Auto-verification** — Accounts are automatically verified (can be extended for email verification)

## 🏥 Medical Specialties

The system includes 38+ medical specialties that physicians can select during registration:

Allergy and Immunology, Anesthesiology, Cardiology, Cardiothoracic Surgery, Critical Care Medicine, Dermatology, Emergency Medicine, Endocrinology, Family Medicine, Gastroenterology, General Surgery, Geriatrics, Hematology, Infectious Disease, Internal Medicine, Medical Genetics, Nephrology, Neurology, Neurosurgery, Nuclear Medicine, Obstetrics and Gynecology, Oncology, Ophthalmology, Orthopedic Surgery, Orthopedics, Otolaryngology (ENT), Pathology, Pediatrics, Physical Medicine and Rehabilitation, Plastic Surgery, Psychiatry, Pulmonology, Radiation Oncology, Radiology, Rheumatology, Sports Medicine, Thoracic Surgery, Urology, Vascular Surgery

Specialties are automatically seeded into the database on server startup.

## 🧱 Future Expansion

| Feature                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| **Message Creation**     | POST endpoints for creating messages                 |
| **Medication Management** | POST/PUT/DELETE endpoints for medications          |
| **Patient-Physician Linking** | Endpoints to manage relationships                  |
| **Email Verification**   | Add email verification workflow for new accounts     |
| **AI Integration**       | Connect to DeepMind or OpenAI APIs for summarization |
| **Logging & Monitoring** | Add structured logging and performance metrics       |
| **Docker Deployment**    | Containerize backend for scalability                 |

---

## 🧹 .gitignore

```
# Database files
*.db
*.db-shm
*.db-wal
healthconnect.db

# Environment variables
.env

# Build artifacts
*.out
*.exe
*.dll
*.so
*.dylib

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Logs
*.log

# OS
.DS_Store
Thumbs.db
```

---

## 🧰 Recommended Tools

* **VS Code** — Development
* **Postman** — API testing
* **Go Playground** — Quick prototyping
* **Docker** *(optional)* — Containerization
* **GitHub Actions** *(optional)* — CI/CD automation

---

## 👥 Authors

| Name                     | Role                  |
| ------------------------ | --------------------- |
| **Justin Williams**      | Developer / Tech Lead |
| **Derrien Hudson**       | UI / QA Tester        |
| **Christina Washington** | Project Manager       |
| **Savannah Shannon**     | Business Analyst      |

---

## 🩺 License

Developed under **Clark Atlanta University’s Department of Cyber-Physical Systems (2025)**.


