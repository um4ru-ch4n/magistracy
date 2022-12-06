// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: api/clock/clock.proto

package clock_service

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ClockServiceClient is the client API for ClockService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ClockServiceClient interface {
	Spectate(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error)
}

type clockServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewClockServiceClient(cc grpc.ClientConnInterface) ClockServiceClient {
	return &clockServiceClient{cc}
}

func (c *clockServiceClient) Spectate(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/clock_service.ClockService/Spectate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ClockServiceServer is the server API for ClockService service.
// All implementations should embed UnimplementedClockServiceServer
// for forward compatibility
type ClockServiceServer interface {
	Spectate(context.Context, *emptypb.Empty) (*emptypb.Empty, error)
}

// UnimplementedClockServiceServer should be embedded to have forward compatible implementations.
type UnimplementedClockServiceServer struct {
}

func (UnimplementedClockServiceServer) Spectate(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Spectate not implemented")
}

// UnsafeClockServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ClockServiceServer will
// result in compilation errors.
type UnsafeClockServiceServer interface {
	mustEmbedUnimplementedClockServiceServer()
}

func RegisterClockServiceServer(s grpc.ServiceRegistrar, srv ClockServiceServer) {
	s.RegisterService(&ClockService_ServiceDesc, srv)
}

func _ClockService_Spectate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ClockServiceServer).Spectate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/clock_service.ClockService/Spectate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ClockServiceServer).Spectate(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

// ClockService_ServiceDesc is the grpc.ServiceDesc for ClockService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ClockService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "clock_service.ClockService",
	HandlerType: (*ClockServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Spectate",
			Handler:    _ClockService_Spectate_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/clock/clock.proto",
}
