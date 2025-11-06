package models

import (
	"gorm.io/gorm"
)

type Physician struct {
	gorm.Model
	Username      string    `gorm:"uniqueIndex;not null" json:"username"`
	Email         string    `gorm:"uniqueIndex;not null" json:"email"`
	Password      string    `gorm:"not null" json:"-"`
	Name          string    `json:"name"`
	Address       string    `json:"address"`
	License       string    `gorm:"uniqueIndex;not null" json:"license"`
	OfficeLocation string   `json:"office_location"`
	Verified      bool      `gorm:"default:true" json:"verified"` // Auto-verified for now
	Messages      []Message `gorm:"foreignKey:PhysicianID" json:"messages,omitempty"`
	Patients      []Patient `gorm:"many2many:patient_physicians;" json:"patients,omitempty"`
}

