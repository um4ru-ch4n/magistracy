package events

import (
	"encoding/json"
	"fmt"
)

// EventID alias
type EventID int8

// EventID enum
const (
	Unknown        EventID = 0
	MetricsSending EventID = 1
)

// EventIDToHumanReadable  human-readable event types
var EventIDToHumanReadable = map[EventID]string{
	Unknown:        "Unknown",
	MetricsSending: "MetricsSending",
}

// Meta struct
type Meta struct {
	TypeID    EventID `json:"typeId"`
	TypeHuman string  `json:"typeHuman"`
}

// EventJSON struct
type EventJSON struct {
	Meta Meta            `json:"meta"`
	Data json.RawMessage `json:"data"`
}

// JSONer interface that provides json representation
type JSONer interface {
	Value() (json.RawMessage, error)
}

// NewEventJSON prepares new json for kafka
func NewEventJSON(eventID EventID, data JSONer) ([]byte, error) {
	meta := Meta{
		TypeID:    eventID,
		TypeHuman: EventIDToHumanReadable[eventID],
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	event := EventJSON{
		Meta: meta,
		Data: jsonData,
	}
	return json.Marshal(event)
}

// GetEventIDByName - check existence of specific event name and return it's id
func GetEventIDByName(eventName string) (EventID, error) {
	for k, v := range EventIDToHumanReadable {
		if eventName == v {
			return k, nil
		}
	}

	return 0, fmt.Errorf("event with such name doesn't exist")
}
