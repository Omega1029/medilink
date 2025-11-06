package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Patient struct {
	ID           string       `gorm:"type:char(36);primary_key" json:"id"`
	Username     string       `gorm:"uniqueIndex;not null" json:"username"`
	Email        string       `gorm:"uniqueIndex;not null" json:"email"`
	Password     string       `gorm:"not null" json:"-"`
	Name         string       `json:"name"`
	Address      string       `json:"address"`
	HasInsurance bool         `gorm:"default:false" json:"has_insurance"`
	Verified     bool         `gorm:"default:true" json:"verified"` // Auto-verified for now
	Medications  []Medication `gorm:"foreignKey:PatientID" json:"medications,omitempty"`
	Messages     []Message    `gorm:"foreignKey:PatientID" json:"messages,omitempty"`
	Physicians   []Physician  `gorm:"many2many:patient_physicians;" json:"physicians,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate hook to generate UUID
func (p *Patient) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}

