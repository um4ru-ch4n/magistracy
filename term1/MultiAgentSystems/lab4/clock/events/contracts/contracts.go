package contracts

import "encoding/json"

// MetricsSending - contract on case when ozonID created in first time
type MetricsSending struct {
	ID          uint64  `json:"id"`
	Pulse       uint32  `json:"pulse"`
	Temperature float32 `json:"temperature"`
	Oxygen      float32 `json:"oxygen"`
}

// Value - ...
func (f MetricsSending) Value() (json.RawMessage, error) {
	jsonData, err := json.Marshal(f)
	return jsonData, err
}
