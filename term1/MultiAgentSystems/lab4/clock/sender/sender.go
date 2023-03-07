package sender

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/events"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/events/contracts"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func Send(ctx context.Context, ch *amqp.Channel) error {
	q, err := ch.QueueDeclare(
		"clock_events",
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
		data := contracts.MetricsSending{
			ID:          uint64(i),
			Pulse:       50 + uint32(rand.Int31n(180-50)),
			Temperature: 32 + rand.Float32()*(42-32),
			Oxygen:      70 + rand.Float32()*(99-70),
		}

		eventData, err := events.NewEventJSON(
			events.MetricsSending,
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
