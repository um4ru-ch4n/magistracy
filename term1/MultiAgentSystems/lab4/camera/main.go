package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	amqp "github.com/rabbitmq/amqp091-go"
	camera_service_api "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/pkg/api/camera"
	"github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/sender"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Implementation struct {
	camera_service_api.UnimplementedCameraServiceServer
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
	port = flag.Int("port", 50051, "The server port")
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
	camera_service_api.RegisterCameraServiceServer(s, NewImplementation(ch))
	log.Printf("server listening at %v", lis.Addr())

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
