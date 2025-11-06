package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/yourusername/health-connect/internal/models"
)

type PhysicianHandler struct {
	DB *gorm.DB
}

func NewPhysicianHandler(db *gorm.DB) *PhysicianHandler {
	return &PhysicianHandler{DB: db}
}

// GetPhysicianPatients gets all patients for a physician
func (h *PhysicianHandler) GetPhysicianPatients(c *gin.Context) {
	physicianID := c.Param("id")

	var physician models.Physician
	result := h.DB.Preload("Patients").First(&physician, physicianID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Physician not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"patients": physician.Patients,
	})
}

// GetPhysicianMessages gets all messages for a physician
func (h *PhysicianHandler) GetPhysicianMessages(c *gin.Context) {
	physicianID := c.Param("id")

	var messages []models.Message
	result := h.DB.Where("physician_id = ?", physicianID).
		Preload("Patient").
		Order("sent_at DESC").
		Find(&messages)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch messages",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"messages": messages,
	})
}

// GetSpecialties gets all available medical specialties
func (h *PhysicianHandler) GetSpecialties(c *gin.Context) {
	var specialties []models.Specialty
	result := h.DB.Order("name ASC").Find(&specialties)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch specialties",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"specialties": specialties,
	})
}

