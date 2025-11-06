package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/yourusername/health-connect/internal/handlers"
	"github.com/yourusername/health-connect/internal/models"
)

func initDB() *gorm.DB {
	// Try to load .env file (optional for SQLite)
	_ = godotenv.Load()

	// Use SQLite database file
	// Can be overridden with DB_PATH environment variable
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "healthconnect.db"
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate models
	err = db.AutoMigrate(
		&models.Patient{},
		&models.Physician{},
		&models.Medication{},
		&models.Message{},
		&models.Specialty{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed specialties if they don't exist
	seedSpecialties(db)

	log.Printf("SQLite database connected successfully: %s", dbPath)
	return db
}

// seedSpecialties seeds the database with medical specialties
func seedSpecialties(db *gorm.DB) {
	for _, specialtyName := range models.MedicalSpecialties {
		var specialty models.Specialty
		result := db.Where("name = ?", specialtyName).First(&specialty)
		if result.Error != nil {
			// Specialty doesn't exist, create it
			specialty = models.Specialty{
				Name: specialtyName,
			}
			if err := db.Create(&specialty).Error; err != nil {
				log.Printf("Failed to seed specialty: %s", specialtyName)
			}
		}
	}
	log.Println("Medical specialties seeded successfully")
}

func main() {
	// Initialize database
	db := initDB()

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)
	patientHandler := handlers.NewPatientHandler(db)
	physicianHandler := handlers.NewPhysicianHandler(db)

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to Health Connect API 🚀",
		})
	})

	// Auth routes
	auth := r.Group("/auth")
	{
		auth.GET("", authHandler.Auth)
		auth.POST("/patient", authHandler.PatientLogin)
		auth.POST("/physician", authHandler.PhysicianLogin)
		auth.POST("/register/patient", authHandler.PatientRegister)
		auth.POST("/register/physician", authHandler.PhysicianRegister)
	}

	// Patient routes
	patients := r.Group("/patients")
	{
		patients.GET("/:id/medications", patientHandler.GetPatientMedications)
		patients.GET("/:id/messages", patientHandler.GetPatientMessages)
		patients.GET("/:id/physicians", patientHandler.GetPatientPhysicians)
	}

	// Physician routes
	physicians := r.Group("/physicians")
	{
		physicians.GET("/:id/patients", physicianHandler.GetPhysicianPatients)
		physicians.GET("/:id/messages", physicianHandler.GetPhysicianMessages)
		physicians.GET("/specialties", physicianHandler.GetSpecialties)
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}
