package contracts

import "encoding/json"

// FrameSending - contract on case when ozonID created in first time
type FrameSending struct {
	ID        uint64  `json:"id"`
	FrameData []byte `json:"frame_data"`
}

// Value - ...
func (f FrameSending) Value() (json.RawMessage, error) {
	jsonData, err := json.Marshal(f)
	return jsonData, err
}
