// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: api/server/server.proto

package server_service

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ServerServiceClient is the client API for ServerService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ServerServiceClient interface {
	Auth(ctx context.Context, in *AuthRequest, opts ...grpc.CallOption) (*AuthResponse, error)
	StartProcess(ctx context.Context, in *StartProcessRequest, opts ...grpc.CallOption) (ServerService_StartProcessClient, error)
}

type serverServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewServerServiceClient(cc grpc.ClientConnInterface) ServerServiceClient {
	return &serverServiceClient{cc}
}

func (c *serverServiceClient) Auth(ctx context.Context, in *AuthRequest, opts ...grpc.CallOption) (*AuthResponse, error) {
	out := new(AuthResponse)
	err := c.cc.Invoke(ctx, "/server_service.ServerService/Auth", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *serverServiceClient) StartProcess(ctx context.Context, in *StartProcessRequest, opts ...grpc.CallOption) (ServerService_StartProcessClient, error) {
	stream, err := c.cc.NewStream(ctx, &ServerService_ServiceDesc.Streams[0], "/server_service.ServerService/StartProcess", opts...)
	if err != nil {
		return nil, err
	}
	x := &serverServiceStartProcessClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type ServerService_StartProcessClient interface {
	Recv() (*StartProcessResponse, error)
	grpc.ClientStream
}

type serverServiceStartProcessClient struct {
	grpc.ClientStream
}

func (x *serverServiceStartProcessClient) Recv() (*StartProcessResponse, error) {
	m := new(StartProcessResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// ServerServiceServer is the server API for ServerService service.
// All implementations should embed UnimplementedServerServiceServer
// for forward compatibility
type ServerServiceServer interface {
	Auth(context.Context, *AuthRequest) (*AuthResponse, error)
	StartProcess(*StartProcessRequest, ServerService_StartProcessServer) error
}

// UnimplementedServerServiceServer should be embedded to have forward compatible implementations.
type UnimplementedServerServiceServer struct {
}

func (UnimplementedServerServiceServer) Auth(context.Context, *AuthRequest) (*AuthResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Auth not implemented")
}
func (UnimplementedServerServiceServer) StartProcess(*StartProcessRequest, ServerService_StartProcessServer) error {
	return status.Errorf(codes.Unimplemented, "method StartProcess not implemented")
}

// UnsafeServerServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ServerServiceServer will
// result in compilation errors.
type UnsafeServerServiceServer interface {
	mustEmbedUnimplementedServerServiceServer()
}

func RegisterServerServiceServer(s grpc.ServiceRegistrar, srv ServerServiceServer) {
	s.RegisterService(&ServerService_ServiceDesc, srv)
}

func _ServerService_Auth_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AuthRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ServerServiceServer).Auth(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/server_service.ServerService/Auth",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ServerServiceServer).Auth(ctx, req.(*AuthRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _ServerService_StartProcess_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(StartProcessRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(ServerServiceServer).StartProcess(m, &serverServiceStartProcessServer{stream})
}

type ServerService_StartProcessServer interface {
	Send(*StartProcessResponse) error
	grpc.ServerStream
}

type serverServiceStartProcessServer struct {
	grpc.ServerStream
}

func (x *serverServiceStartProcessServer) Send(m *StartProcessResponse) error {
	return x.ServerStream.SendMsg(m)
}

// ServerService_ServiceDesc is the grpc.ServiceDesc for ServerService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ServerService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "server_service.ServerService",
	HandlerType: (*ServerServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Auth",
			Handler:    _ServerService_Auth_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "StartProcess",
			Handler:       _ServerService_StartProcess_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "api/server/server.proto",
}