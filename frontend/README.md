# 🏥 HealthConnect - Frontend

**HealthConnect** is a modern, responsive medical web application built with React and TypeScript. It provides a secure platform for patients and physicians to manage healthcare interactions, view medical records, and communicate securely.

---

## 🚀 Features

### Authentication & Registration
- **Patient Sign In**: Secure authentication for patients
- **Physician Sign In**: Secure authentication for physicians
- **Patient Registration**: Complete registration form with:
  - Username, Email, Password
  - Full Name, Address
  - Health Insurance coverage option
  - Optional Physician ID linking
- **Physician Registration**: Complete registration form with:
  - Username, Email, Password
  - Full Name, Address
  - License Number
  - Office Location
  - Specialty Selection (multi-select dropdown with 39 medical specialties)

### Patient Dashboard
- **Medication Reminder**: View current medications
- **Refill Alert**: Track medication refill status
- **Lab Results**: Interactive blood glucose monitoring chart with:
  - Date range picker (past dates only)
  - Interactive range selection on chart
  - Visual data representation
- **Secure Messaging**: View messages from physicians
- **Doctor Search**: Map-based interface to find and view doctors

### Physician Dashboard
- **Patient Alerts**: View assigned patients
- **Patient Refill Alerts**: Monitor patient medication needs
- **Review Patient Lab Results**: Interactive chart for reviewing patient data
- **Secure Messaging**: View messages from patients
- **Doctor Search**: Map-based interface

### UI/UX Features
- **Fully Responsive**: Dynamic sizing using `clamp()` for fluid typography and spacing
- **Mobile Optimized**: Uses `100dvh` for proper mobile viewport height
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Modern Design**: Clean, professional interface matching HealthConnect branding

---

## 🛠️ Tech Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite 7.7.7
- **HTTP Client**: Axios
- **Styling**: CSS with responsive design patterns

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medilink/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   The API base URL is configured in `src/api.ts`. By default, it points to:
   ```typescript
   baseURL: "http://localhost:8080"
   ```
   
   Update this if your backend runs on a different port or domain.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SignIn.tsx              # Sign in page for patients and physicians
│   │   ├── PatientRegistration.tsx  # Patient registration form
│   │   ├── PhysicianRegistration.tsx # Physician registration form
│   │   ├── PatientDashboard.tsx     # Patient dashboard with medications, lab results, messages
│   │   ├── PhysicianDashboard.tsx   # Physician dashboard with patients, lab results, messages
│   │   ├── DateRangePicker.tsx      # Calendar-based date range picker
│   │   ├── DoctorSearch.tsx         # Map-based doctor search interface
│   │   └── *.css                    # Component-specific styles
│   ├── api.ts                       # API configuration and service functions
│   ├── App.tsx                      # Main app component with routing
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles
│   └── App.css                      # App-specific styles
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

---

## 🔌 API Integration

### API Service Functions

The app includes pre-configured API service functions in `src/api.ts`:

#### Patient API
- `patientAPI.getMedications(patientId)` - Get patient medications
- `patientAPI.getMessages(patientId)` - Get patient messages
- `patientAPI.getPhysicians(patientId)` - Get patient's physicians

#### Physician API
- `physicianAPI.getPatients(physicianId)` - Get physician's patients
- `physicianAPI.getMessages(physicianId)` - Get physician messages
- `physicianAPI.getSpecialties()` - Get available medical specialties

### Backend Endpoints

The frontend expects the following backend endpoints:

#### Authentication
- `POST /auth/patient` - Patient login
- `POST /auth/physician` - Physician login
- `POST /auth/register/patient` - Patient registration
- `POST /auth/register/physician` - Physician registration

#### Patient Endpoints
- `GET /patients/:id/medications` - Get patient medications
- `GET /patients/:id/messages` - Get patient messages
- `GET /patients/:id/physicians` - Get patient physicians

#### Physician Endpoints
- `GET /physicians/:id/patients` - Get physician patients
- `GET /physicians/:id/messages` - Get physician messages
- `GET /physicians/specialties` - Get available specialties

---

## 🎨 Component Details

### SignIn Component
- Dual authentication forms (Patient and Physician)
- Email and password validation
- Error handling and loading states
- Links to registration forms

### Registration Components

#### PatientRegistration
- Form fields: Username, Email, Password, Name, Address
- Health insurance checkbox
- Optional Physician ID field
- Form validation and error handling

#### PhysicianRegistration
- Form fields: Username, Email, Password, Name, Address, License, Office Location
- Multi-select specialty dropdown (39 specialties)
- Specialty validation (at least one required)
- Form validation and error handling

### Dashboard Components

#### PatientDashboard
- **Medication Cards**: Display current medications from API
- **Lab Results Chart**: Interactive SVG chart with:
  - Date range selection
  - Mouse-based range selection
  - Visual feedback
- **Secure Messaging**: Grouped messages by physician
- **Doctor Search**: Map interface with doctor markers

#### PhysicianDashboard
- **Patient Alerts**: Display assigned patients from API
- **Lab Results Chart**: Review patient data with date filtering
- **Secure Messaging**: Grouped messages by patient
- **Doctor Search**: Map interface

### DateRangePicker Component
- Calendar-based date selection
- Past dates only (future dates disabled)
- Range selection support
- Auto-close on selection
- Click-outside detection

### DoctorSearch Component
- Map-based interface
- Randomly generated doctor markers
- Click markers to view doctor details
- Popup with doctor information

---

## 🎯 Usage

### Sign In

1. **Patient Sign In**
   - Email: `demo@example.com`
   - Password: `password`
   - Or use any registered patient credentials

2. **Physician Sign In**
   - Email: `doctor@example.com`
   - Password: `password`
   - Or use any registered physician credentials

### Registration

1. **Patient Registration**
   - Click "Register as Patient" on sign-in page
   - Fill in all required fields
   - Optionally link to a physician by entering Physician ID
   - Submit to create account

2. **Physician Registration**
   - Click "Register as Physician" on sign-in page
   - Fill in all required fields
   - Select at least one specialty from the dropdown (hold Ctrl/Cmd for multiple)
   - Submit to create account

### Dashboard Features

- **View Medications**: See current medications in the medication reminder card
- **View Lab Results**: Use the date range picker to filter lab results by date
- **Select Date Range**: Click and drag on the chart to select a specific range
- **View Messages**: See messages grouped by physician (patients) or patient (physicians)
- **Search Doctors**: Navigate to the search tab to view doctors on a map

---

## 🎨 Styling

The application uses a responsive design approach:

- **Fluid Typography**: `clamp()` function for responsive font sizes
- **Dynamic Spacing**: Viewport-based padding and margins
- **Mobile-First**: Optimized for mobile devices with `100dvh` support
- **Consistent Design**: Unified color scheme and spacing throughout

### Responsive Breakpoints

- Mobile: `< 480px` - Single column layouts
- Tablet: `768px - 1024px` - Multi-column grids
- Desktop: `> 1024px` - Full-width layouts

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Proper TypeScript typing throughout

---

## 🐛 Troubleshooting

### API Connection Issues

If the app can't connect to the backend:

1. Ensure the backend is running on `http://localhost:8080`
2. Check CORS settings in the backend
3. Verify the API base URL in `src/api.ts`

### Build Issues

If you encounter build errors:

1. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check TypeScript errors:
   ```bash
   npm run build
   ```

### Styling Issues

If styles aren't loading correctly:

1. Clear browser cache
2. Check that CSS files are imported in components
3. Verify responsive breakpoints match your screen size

---

## 📝 Notes

- The app uses demo credentials for quick testing
- All API calls include error handling and fallbacks
- User ID is passed from registration/login to dashboards
- Specialties are hardcoded in the physician registration form (39 specialties)

---

## 🚧 Future Enhancements

- [ ] Real-time message notifications
- [ ] Medication refill request functionality
- [ ] Enhanced doctor search with filters
- [ ] Patient-physician appointment scheduling
- [ ] AI-powered health insights
- [ ] Offline mode support
- [ ] Progressive Web App (PWA) features

---

## 👥 Team

- **Justin Williams** - Developer / Tech Lead
- **Derrien Hudson** - UI / QA Tester
- **Christina Washington** - Project Manager
- **Savannah Shannon** - Business Analyst

---

## 📄 License

Developed under **Clark Atlanta University's Department of Cyber-Physical Systems (2025)**.

---

## 🔗 Related Documentation

- [Backend README](../backend/README.md) - Backend API documentation
- [Main README](../README.md) - Project overview and architecture
