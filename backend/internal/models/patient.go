package models

import (
	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
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
}

