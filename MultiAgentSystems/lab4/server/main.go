package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net"

	amqp "github.com/rabbitmq/amqp091-go"
	camera_events "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events"
	camera_contracts "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/events/contracts"
	camera_service_api "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/camera/pkg/api/camera"
	clock_events "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/events"
	clock_contracts "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/events/contracts"
	clock_service_api "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/clock/pkg/api/clock"
	server_service_api "github.com/um4ru-ch4n/magistracy/MultiAgentSystems/lab4/server/pkg/api/server"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

const (
	globalLogin    = "qwer"
	globalPassword = "1234"
)

type Implementation struct {
	server_service_api.UnimplementedServerServiceServer
	rabbitChannel *amqp.Channel
	cameraAPI     camera_service_api.CameraServiceClient
	clockAPI      clock_service_api.ClockServiceClient
}

func NewImplementation(
	rabbitChannel *amqp.Channel,
	cameraAPI camera_service_api.CameraServiceClient,
	clockAPI clock_service_api.ClockServiceClient,
) *Implementation {
	return &Implementation{
		rabbitChannel: rabbitChannel,
		cameraAPI:     cameraAPI,
		clockAPI:      clockAPI,
	}
}

func (i *Implementation) Auth(ctx context.Context, in *server_service_api.AuthRequest) (*server_service_api.AuthResponse, error) {
	if in.GetLogin() != globalLogin || in.GetPassword() != globalPassword {
		return nil, status.Errorf(codes.Unauthenticated, "Unauthorized")
	}

	return &server_service_api.AuthResponse{
		Token: fmt.Sprintf("token_%s_%s", in.GetLogin(), in.GetPassword()),
	}, nil
}

func (i *Implementation) StartProcess(in *server_service_api.StartProcessRequest, resp server_service_api.ServerService_StartProcessServer) error {
	cameraMsgs, err := i.rabbitChannel.Consume(
		"camera_events",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.Consume camera: %s", err.Error())
	}

	clockMsgs, err := i.rabbitChannel.Consume(
		"clock_events",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.Consume clock: %s", err.Error())
	}

	var forever chan struct{}

	go func() {
		for d := range cameraMsgs {
			var data camera_events.EventJSON
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				fmt.Printf("json.Unmarshal event: %s\n", err.Error())
			}

			var msg camera_contracts.FrameSending
			err = json.Unmarshal(data.Data, &msg)
			if err != nil {
				fmt.Printf("json.Unmarshal msg: %s\n", err.Error())
			}

			fmt.Printf("Received a message: %d - %s\n", msg.ID, msg.FrameData)
			r := server_service_api.StartProcessResponse{
				CameraMetrics: &server_service_api.StartProcessResponse_CameraMetrics{
					Status: server_service_api.Status(msg.ID%3 + 1),
				},
			}

			if err := resp.Send(&r); err != nil {
				fmt.Printf("send: %s\n", err.Error())
			}
		}

		forever <- struct{}{}
	}()

	go func() {
		for d := range clockMsgs {
			var data clock_events.EventJSON
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				fmt.Printf("json.Unmarshal event: %s\n", err.Error())
			}

			var msg clock_contracts.MetricsSending
			err = json.Unmarshal(data.Data, &msg)
			if err != nil {
				fmt.Printf("json.Unmarshal msg: %s\n", err.Error())
			}

			fmt.Printf("Received a message: %v\n", msg)
			r := server_service_api.StartProcessResponse{
				ClockMetrics: &server_service_api.StartProcessResponse_ClockMetrics{
					Pulse: &server_service_api.StartProcessResponse_ClockMetrics_Pulse{
						Status: server_service_api.Status(msg.ID%3 + 1),
						Value:  msg.Pulse,
					},
					Temperature: &server_service_api.StartProcessResponse_ClockMetrics_Temperature{
						Status: server_service_api.Status(msg.ID%3 + 1),
						Value:  msg.Temperature,
					},
					Oxygen: &server_service_api.StartProcessResponse_ClockMetrics_Oxygen{
						Status: server_service_api.Status(msg.ID%3 + 1),
						Value:  msg.Oxygen,
					},
				},
			}

			if err := resp.Send(&r); err != nil {
				fmt.Printf("send: %s\n", err.Error())
			}
		}

		forever <- struct{}{}
	}()

	go func() {
		_, err = i.cameraAPI.Spectate(context.Background(), &emptypb.Empty{})
		if err != nil {
			fmt.Printf("cameraAPI.Spectate: %s\n", err.Error())
		}
	}()

	go func() {
		_, err = i.clockAPI.Spectate(context.Background(), &emptypb.Empty{})
		if err != nil {
			fmt.Printf("clockAPI.Spectate: %s\n", err.Error())
		}
	}()

	fmt.Printf(" [*] Waiting for messages. To exit press CTRL+C\n")
	<-forever

	return nil
}

var (
	port = flag.Int("port", 50053, "The server port")
)

func main() {
	ctx := context.Background()

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

	_, err = ch.QueueDeclare(
		"camera_events",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.QueueDeclare camera: %s", err.Error())
	}

	_, err = ch.QueueDeclare(
		"clock_events",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("ch.QueueDeclare clock: %s", err.Error())
	}

	s := grpc.NewServer(
		grpc.UnaryInterceptor(authMiddleware),
		grpc.StreamInterceptor(authMiddlewareStream),
	)

	cameraConn, err := grpc.DialContext(ctx, "localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("grpc.DialContext cameraConn: %s", err.Error())
	}

	cameraClient := camera_service_api.NewCameraServiceClient(cameraConn)

	clockConn, err := grpc.DialContext(ctx, "localhost:50052", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("grpc.DialContext cameraConn: %s", err.Error())
	}

	clockClient := clock_service_api.NewClockServiceClient(clockConn)

	server_service_api.RegisterServerServiceServer(s, NewImplementation(ch, cameraClient, clockClient))
	log.Printf("server listening at %v", lis.Addr())

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func authMiddleware(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
	if info.FullMethod == "/server_service.ServerService/Auth" {
		return handler(ctx, req)
	}
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, "Retrieving metadata is failed")
	}

	authHeader, ok := md["authorization"]
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Authorization token is not supplied")
	}

	token := authHeader[0]

	err = validateToken(token)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, err.Error())
	}

	return handler(ctx, req)
}

func authMiddlewareStream(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) (err error) {
	if info.FullMethod == "/server_service.ServerService/Auth" {
		return handler(srv, ss)
	}
	ctx := ss.Context()

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return status.Errorf(codes.InvalidArgument, "Retrieving metadata is failed")
	}

	authHeader, ok := md["authorization"]
	if !ok {
		return status.Errorf(codes.Unauthenticated, "Authorization token is not supplied")
	}

	token := authHeader[0]
	// validateToken function validates the token
	err = validateToken(token)
	if err != nil {
		return status.Errorf(codes.Unauthenticated, err.Error())
	}

	return handler(srv, ss)
}

func validateToken(token string) error {
	if token != fmt.Sprintf("token_%s_%s", globalLogin, globalPassword) {
		return fmt.Errorf("invalid token")
	}

	return nil
}
