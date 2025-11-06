package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Medication struct {
	ID           string     `gorm:"type:char(36);primary_key" json:"id"`
	PatientID    string     `gorm:"type:char(36);not null" json:"patient_id"`
	Patient      Patient    `gorm:"foreignKey:PatientID" json:"-"`
	Name         string     `gorm:"not null" json:"name"`
	Dosage       string     `json:"dosage"`
	Frequency    string     `json:"frequency"`
	Instructions string     `json:"instructions"`
	StartDate    time.Time  `json:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	PrescribedBy string     `json:"prescribed_by"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate hook to generate UUID
func (m *Medication) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}

