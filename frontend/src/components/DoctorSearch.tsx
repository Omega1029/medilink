import { useState, useEffect } from "react";
import "./DoctorSearch.css";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: number;
  price: number;
  x: number; // Map position (0-100)
  y: number; // Map position (0-100)
}

function DoctorSearch() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchLocation, setSearchLocation] = useState("San Francisco");

  const specialties = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedist",
    "Pediatrician",
    "Psychiatrist",
    "Oncologist",
    "Gastroenterologist",
    "Endocrinologist",
    "Rheumatologist",
  ];

  const firstNames = [
    "Dr. Sarah", "Dr. Michael", "Dr. Emily", "Dr. James", "Dr. Jennifer",
    "Dr. David", "Dr. Lisa", "Dr. Robert", "Dr. Maria", "Dr. William",
    "Dr. Jessica", "Dr. Christopher", "Dr. Amanda", "Dr. Daniel", "Dr. Nicole",
  ];

  const lastNames = [
    "Johnson", "Williams", "Brown", "Jones", "Garcia",
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez",
    "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
  ];

  // Generate random doctors
  useEffect(() => {
    const generateDoctors = (): Doctor[] => {
      const doctorList: Doctor[] = [];
      const numDoctors = 8 + Math.floor(Math.random() * 7); // 8-14 doctors

      for (let i = 0; i < numDoctors; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const specialty = specialties[Math.floor(Math.random() * specialties.length)];
        const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
        const reviews = Math.floor(50 + Math.random() * 950); // 50-1000
        const distance = 0.5 + Math.random() * 4.5; // 0.5-5.0 miles
        const price = 100 + Math.floor(Math.random() * 400); // $100-$500

        doctorList.push({
          id: `doctor-${i}`,
          name: `${firstName} ${lastName}`,
          specialty,
          rating: Math.round(rating * 10) / 10,
          reviews,
          distance: Math.round(distance * 10) / 10,
          price,
          x: 10 + Math.random() * 80, // Random position on map
          y: 10 + Math.random() * 80,
        });
      }

      return doctorList;
    };

    setDoctors(generateDoctors());
  }, []);

  const handleMarkerClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close popup if clicking on map (not on marker)
    if (e.target === e.currentTarget) {
      setSelectedDoctor(null);
    }
  };

  const handleClosePopup = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="doctor-search-container">
      {/* Search Bar */}
      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <div className="search-info">
          <div className="search-location">{searchLocation}</div>
          <div className="search-params">Near me • Available today</div>
        </div>
        <button className="edit-button" aria-label="Edit search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="filter-sort-bar">
        <button className="filter-button">
          Filter
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <button className="sort-button">
          Sort
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div className="results-count">{doctors.length} results</div>
      </div>

      {/* Map Section */}
      <div className="map-container" onClick={handleMapClick}>
        <div className="map-background">
          {/* Map grid pattern */}
          <svg className="map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Streets */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="40" y1="0" x2="40" y2="100" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="60" y1="0" x2="60" y2="100" stroke="#d0d0d0" strokeWidth="0.5" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#d0d0d0" strokeWidth="0.5" />
            
            {/* Parks (green areas) */}
            <rect x="10" y="10" width="15" height="15" fill="#c8e6c9" opacity="0.5" />
            <rect x="70" y="25" width="20" height="20" fill="#c8e6c9" opacity="0.5" />
            <rect x="30" y="65" width="25" height="25" fill="#c8e6c9" opacity="0.5" />
          </svg>

          {/* Doctor Markers */}
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              className={`doctor-marker ${selectedDoctor?.id === doctor.id ? "selected" : ""}`}
              style={{
                left: `${doctor.x}%`,
                top: `${doctor.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(doctor);
              }}
              aria-label={`${doctor.name} - ${doctor.specialty}`}
            >
              ${doctor.price}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Detail Card */}
      {selectedDoctor && (
        <div className="doctor-card">
          <button className="close-button" onClick={handleClosePopup} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Image placeholder */}
          <div className="doctor-image">
            <div className="image-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="image-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="doctor-info">
            <h3 className="doctor-name">{selectedDoctor.name}</h3>
            <p className="doctor-specialty">{selectedDoctor.specialty}</p>
            <div className="doctor-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{selectedDoctor.rating}</span>
              <span className="reviews">({selectedDoctor.reviews} reviews)</span>
              <span className="distance">• {selectedDoctor.distance} miles</span>
            </div>
            <div className="doctor-price">${selectedDoctor.price} / visit</div>
          </div>

          {/* Lorem Ipsum Content */}
          <div className="doctor-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          {/* Action Button */}
          <button className="select-button">Select</button>
        </div>
      )}
    </div>
  );
}

export default DoctorSearch;

