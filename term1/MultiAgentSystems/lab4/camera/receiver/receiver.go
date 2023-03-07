package main

import (
	"encoding/json"
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events/contracts"
)

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("amqp.Dial: %s", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("conn.Cannel: %s", err.Error())
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"camera_events",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.QueueDeclare: %s", err.Error())
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.Consume: %s", err.Error())
	}

	var forever chan struct{}

	go func() {
		for d := range msgs {
			var data events.EventJSON
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				fmt.Printf("json.Unmarshal event: %s\n", err.Error())
			}

			var msg contracts.FrameSending
			err = json.Unmarshal(data.Data, &msg)
			if err != nil {
				fmt.Printf("json.Unmarshal msg: %s\n", err.Error())
			}

			fmt.Printf("Received a message: %d - %s\n", msg.ID, msg.FrameData)
		}

		forever <- struct{}{}
	}()

	fmt.Printf(" [*] Waiting for messages. To exit press CTRL+C\n")
	<-forever
}
