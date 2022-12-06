package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	amqp "github.com/rabbitmq/amqp091-go"
	clock_service_api "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/pkg/api/clock"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/sender"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Implementation struct {
	clock_service_api.UnimplementedClockServiceServer
	ch *amqp.Channel
}

func NewImplementation(ch *amqp.Channel) *Implementation {
	return &Implementation{
		ch: ch,
	}
}

func (i *Implementation) Spectate(ctx context.Context, in *emptypb.Empty) (*emptypb.Empty, error) {
	go func() {
		err := sender.Send(ctx, i.ch)
		if err != nil {
			fmt.Printf("send: %s\n", err.Error())
		}
	}()

	return &emptypb.Empty{}, nil
}

var (
	port = flag.Int("port", 50052, "The server port")
)

func main() {
	flag.Parse()

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("amqp.Dial: %s", err.Error())
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("conn.Channel: %s", err.Error())
	}
	defer ch.Close()

	s := grpc.NewServer()
	clock_service_api.RegisterClockServiceServer(s, NewImplementation(ch))
	log.Printf("server listening at %v", lis.Addr())

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
