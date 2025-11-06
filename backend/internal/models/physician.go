package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Physician struct {
	ID            string     `gorm:"type:char(36);primary_key" json:"id"`
	Username      string     `gorm:"uniqueIndex;not null" json:"username"`
	Email         string     `gorm:"uniqueIndex;not null" json:"email"`
	Password      string     `gorm:"not null" json:"-"`
	Name          string     `json:"name"`
	Address       string     `json:"address"`
	License       string     `gorm:"uniqueIndex;not null" json:"license"`
	OfficeLocation string    `json:"office_location"`
	Verified      bool       `gorm:"default:true" json:"verified"` // Auto-verified for now
	Messages      []Message  `gorm:"foreignKey:PhysicianID" json:"messages,omitempty"`
	Patients      []Patient  `gorm:"many2many:patient_physicians;" json:"patients,omitempty"`
	Specialties   []Specialty `gorm:"many2many:physician_specialties;" json:"specialties,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate hook to generate UUID
func (p *Physician) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}

