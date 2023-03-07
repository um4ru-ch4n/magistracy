package sender

import (
	"context"
	"fmt"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events/contracts"
)

func Send(ctx context.Context, ch *amqp.Channel) error {
	q, err := ch.QueueDeclare(
		"camera_events",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("ch.QueueDeclare: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	for i := 0; i < 1000000; i++ {
		// select {
		// case <-ctx.Done():
		// 	return nil
		// default:
		// }
		data := contracts.FrameSending{
			ID:        uint64(i),
			FrameData: []byte(fmt.Sprintf("Frame data: %d", i)),
		}

		eventData, err := events.NewEventJSON(
			events.FrameSending,
			data,
		)
		if err != nil {
			return fmt.Errorf("events.NewEventJSON: %w", err)
		}

		err = ch.PublishWithContext(
			ctx,
			"",
			q.Name,
			false,
			false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        eventData,
			},
		)
		if err != nil {
			return fmt.Errorf("ch.PublishWithContext: %w", err)
		}

		fmt.Printf(" [x] Sent %s\n", eventData)

		time.Sleep(5 * time.Second)
	}

	return nil
}
