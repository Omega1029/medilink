package models

import (
	"time"

	"gorm.io/gorm"
)

type Medication struct {
	gorm.Model
	PatientID    uint      `gorm:"not null" json:"patient_id"`
	Patient      Patient   `gorm:"foreignKey:PatientID" json:"-"`
	Name         string    `gorm:"not null" json:"name"`
	Dosage       string    `json:"dosage"`
	Frequency    string    `json:"frequency"`
	Instructions string    `json:"instructions"`
	StartDate    time.Time `json:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	PrescribedBy string    `json:"prescribed_by"`
}

