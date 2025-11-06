package models

import (
	"time"

	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	PatientID   *uint     `json:"patient_id,omitempty"`
	Patient     *Patient  `gorm:"foreignKey:PatientID" json:"patient,omitempty"`
	PhysicianID *uint     `json:"physician_id,omitempty"`
	Physician   *Physician `gorm:"foreignKey:PhysicianID" json:"physician,omitempty"`
	Subject     string    `json:"subject"`
	Content     string    `gorm:"type:text" json:"content"`
	SentAt      time.Time `json:"sent_at"`
	Read        bool      `gorm:"default:false" json:"read"`
	SenderType  string    `gorm:"not null" json:"sender_type"` // "patient" or "physician"
}

