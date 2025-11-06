package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Message struct {
	ID          string     `gorm:"type:char(36);primary_key" json:"id"`
	PatientID   *string    `gorm:"type:char(36)" json:"patient_id,omitempty"`
	Patient     *Patient   `gorm:"foreignKey:PatientID" json:"patient,omitempty"`
	PhysicianID *string    `gorm:"type:char(36)" json:"physician_id,omitempty"`
	Physician   *Physician  `gorm:"foreignKey:PhysicianID" json:"physician,omitempty"`
	Subject     string     `json:"subject"`
	Content     string     `gorm:"type:text" json:"content"`
	SentAt      time.Time  `json:"sent_at"`
	Read        bool       `gorm:"default:false" json:"read"`
	SenderType  string     `gorm:"not null" json:"sender_type"` // "patient" or "physician"
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate hook to generate UUID
func (m *Message) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}

