package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Specialty struct {
	ID        string     `gorm:"type:char(36);primary_key" json:"id"`
	Name      string     `gorm:"uniqueIndex;not null" json:"name"`
	Physicians []Physician `gorm:"many2many:physician_specialties;" json:"physicians,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate hook to generate UUID
func (s *Specialty) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

