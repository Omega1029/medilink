package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/yourusername/health-connect/internal/models"
)

type AuthHandler struct {
	DB *gorm.DB
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token,omitempty"`
	Message string `json:"message,omitempty"`
}

type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

func (h *AuthHandler) generateToken(email, role string) (string, error) {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "your-secret-key-change-in-production"
	}

	claims := Claims{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}

func (h *AuthHandler) hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (h *AuthHandler) checkPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// Auth handles general authentication endpoint
func (h *AuthHandler) Auth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Auth endpoint - use /auth/patient or /auth/physician",
	})
}

// PatientLogin handles patient authentication
func (h *AuthHandler) PatientLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, LoginResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}

	var patient models.Patient
	result := h.DB.Where("email = ?", req.Email).First(&patient)

	if result.Error != nil {
		// If patient doesn't exist, return error
		c.JSON(http.StatusUnauthorized, LoginResponse{
			Success: false,
			Message: "Invalid email or password",
		})
		return
	}

	// Check password
	if !h.checkPassword(patient.Password, req.Password) {
		c.JSON(http.StatusUnauthorized, LoginResponse{
			Success: false,
			Message: "Invalid email or password",
		})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(patient.Email, "patient")
	if err != nil {
		c.JSON(http.StatusInternalServerError, LoginResponse{
			Success: false,
			Message: "Failed to generate token",
		})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Success: true,
		Token:   token,
	})
}

// PhysicianLogin handles physician authentication
func (h *AuthHandler) PhysicianLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, LoginResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}

	var physician models.Physician
	result := h.DB.Where("email = ?", req.Email).First(&physician)

	if result.Error != nil {
		// If physician doesn't exist, return error
		c.JSON(http.StatusUnauthorized, LoginResponse{
			Success: false,
			Message: "Invalid email or password",
		})
		return
	}

	// Check password
	if !h.checkPassword(physician.Password, req.Password) {
		c.JSON(http.StatusUnauthorized, LoginResponse{
			Success: false,
			Message: "Invalid email or password",
		})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(physician.Email, "physician")
	if err != nil {
		c.JSON(http.StatusInternalServerError, LoginResponse{
			Success: false,
			Message: "Failed to generate token",
		})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Success: true,
		Token:   token,
	})
}

type RegisterResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token,omitempty"`
	Message string `json:"message,omitempty"`
	ID      string `json:"id,omitempty"`
}

type PatientRegisterRequest struct {
	Username     string  `json:"username" binding:"required"`
	Email        string  `json:"email" binding:"required,email"`
	Password     string  `json:"password" binding:"required,min=6"`
	Name         string  `json:"name" binding:"required"`
	Address      string  `json:"address" binding:"required"`
	HasInsurance bool    `json:"has_insurance"`
	PhysicianID  *string `json:"physician_id,omitempty"` // Optional physician ID (UUID)
}

type PhysicianRegisterRequest struct {
	Username       string   `json:"username" binding:"required"`
	Email          string   `json:"email" binding:"required,email"`
	Password       string   `json:"password" binding:"required,min=6"`
	Name           string   `json:"name" binding:"required"`
	Address        string   `json:"address" binding:"required"`
	License        string   `json:"license" binding:"required"`
	OfficeLocation string   `json:"office_location" binding:"required"`
	Specialties    []string `json:"specialties" binding:"required,min=1"` // Array of specialty names
}

// PatientRegister handles patient registration
func (h *AuthHandler) PatientRegister(c *gin.Context) {
	var req PatientRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, RegisterResponse{
			Success: false,
			Message: "Invalid request format: " + err.Error(),
		})
		return
	}

	// Check if email already exists
	var existingPatient models.Patient
	if result := h.DB.Where("email = ?", req.Email).First(&existingPatient); result.Error == nil {
		c.JSON(http.StatusConflict, RegisterResponse{
			Success: false,
			Message: "Email already registered",
		})
		return
	}

	// Check if username already exists
	if result := h.DB.Where("username = ?", req.Username).First(&existingPatient); result.Error == nil {
		c.JSON(http.StatusConflict, RegisterResponse{
			Success: false,
			Message: "Username already taken",
		})
		return
	}

	// Hash password
	hashedPassword, err := h.hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Failed to process password",
		})
		return
	}

	// Create patient
	patient := models.Patient{
		Username:     req.Username,
		Email:        req.Email,
		Password:     hashedPassword,
		Name:         req.Name,
		Address:      req.Address,
		HasInsurance: req.HasInsurance,
		Verified:     true, // Auto-verified
	}

	// If physician ID is provided, associate the patient with the physician
	if req.PhysicianID != nil {
		var physician models.Physician
		if result := h.DB.First(&physician, *req.PhysicianID); result.Error != nil {
			c.JSON(http.StatusBadRequest, RegisterResponse{
				Success: false,
				Message: "Physician not found",
			})
			return
		}
		patient.Physicians = []models.Physician{physician}
	}

	// Save patient
	if err := h.DB.Create(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Failed to create account",
		})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(patient.Email, "patient")
	if err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Account created but failed to generate token",
		})
		return
	}

	c.JSON(http.StatusCreated, RegisterResponse{
		Success: true,
		Token:   token,
		ID:      patient.ID,
		Message: "Patient account created successfully",
	})
}

// PhysicianRegister handles physician registration
func (h *AuthHandler) PhysicianRegister(c *gin.Context) {
	var req PhysicianRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, RegisterResponse{
			Success: false,
			Message: "Invalid request format: " + err.Error(),
		})
		return
	}

	// Check if email already exists
	var existingPhysician models.Physician
	if result := h.DB.Where("email = ?", req.Email).First(&existingPhysician); result.Error == nil {
		c.JSON(http.StatusConflict, RegisterResponse{
			Success: false,
			Message: "Email already registered",
		})
		return
	}

	// Check if username already exists
	if result := h.DB.Where("username = ?", req.Username).First(&existingPhysician); result.Error == nil {
		c.JSON(http.StatusConflict, RegisterResponse{
			Success: false,
			Message: "Username already taken",
		})
		return
	}

	// Check if license already exists
	if result := h.DB.Where("license = ?", req.License).First(&existingPhysician); result.Error == nil {
		c.JSON(http.StatusConflict, RegisterResponse{
			Success: false,
			Message: "License number already registered",
		})
		return
	}

	// Hash password
	hashedPassword, err := h.hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Failed to process password",
		})
		return
	}

	// Find or create specialties
	var specialties []models.Specialty
	for _, specialtyName := range req.Specialties {
		var specialty models.Specialty
		// Try to find existing specialty
		result := h.DB.Where("name = ?", specialtyName).First(&specialty)
		if result.Error != nil {
			// Create new specialty if it doesn't exist
			specialty = models.Specialty{
				Name: specialtyName,
			}
			if err := h.DB.Create(&specialty).Error; err != nil {
				c.JSON(http.StatusInternalServerError, RegisterResponse{
					Success: false,
					Message: "Failed to create specialty: " + specialtyName,
				})
				return
			}
		}
		specialties = append(specialties, specialty)
	}

	// Create physician
	physician := models.Physician{
		Username:       req.Username,
		Email:          req.Email,
		Password:       hashedPassword,
		Name:           req.Name,
		Address:        req.Address,
		License:        req.License,
		OfficeLocation: req.OfficeLocation,
		Verified:       true, // Auto-verified
		Specialties:    specialties,
	}

	// Save physician
	if err := h.DB.Create(&physician).Error; err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Failed to create account",
		})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(physician.Email, "physician")
	if err != nil {
		c.JSON(http.StatusInternalServerError, RegisterResponse{
			Success: false,
			Message: "Account created but failed to generate token",
		})
		return
	}

	c.JSON(http.StatusCreated, RegisterResponse{
		Success: true,
		Token:   token,
		ID:      physician.ID,
		Message: "Physician account created successfully",
	})
}

