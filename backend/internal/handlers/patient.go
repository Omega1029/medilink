package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/yourusername/health-connect/internal/models"
)

type PatientHandler struct {
	DB *gorm.DB
}

func NewPatientHandler(db *gorm.DB) *PatientHandler {
	return &PatientHandler{DB: db}
}

// GetPatientMedications gets all medications for a patient
func (h *PatientHandler) GetPatientMedications(c *gin.Context) {
	patientID := c.Param("id")

	var medications []models.Medication
	result := h.DB.Where("patient_id = ?", patientID).Find(&medications)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch medications",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"medications": medications,
	})
}

// GetPatientMessages gets all messages for a patient
func (h *PatientHandler) GetPatientMessages(c *gin.Context) {
	patientID := c.Param("id")

	var messages []models.Message
	result := h.DB.Where("patient_id = ?", patientID).
		Preload("Physician").
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

// GetPatientPhysicians gets all physicians for a patient
func (h *PatientHandler) GetPatientPhysicians(c *gin.Context) {
	patientID := c.Param("id")

	var patient models.Patient
	result := h.DB.Preload("Physicians").Preload("Physicians.Specialties").First(&patient, patientID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Patient not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"physicians": patient.Physicians,
	})
}

