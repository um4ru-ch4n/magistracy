// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: api/camera/camera.proto

package camera_service

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

// CameraServiceClient is the client API for CameraService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type CameraServiceClient interface {
	Spectate(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error)
}

type cameraServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewCameraServiceClient(cc grpc.ClientConnInterface) CameraServiceClient {
	return &cameraServiceClient{cc}
}

func (c *cameraServiceClient) Spectate(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/camera_service.CameraService/Spectate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// CameraServiceServer is the server API for CameraService service.
// All implementations should embed UnimplementedCameraServiceServer
// for forward compatibility
type CameraServiceServer interface {
	Spectate(context.Context, *emptypb.Empty) (*emptypb.Empty, error)
}

// UnimplementedCameraServiceServer should be embedded to have forward compatible implementations.
type UnimplementedCameraServiceServer struct {
}

func (UnimplementedCameraServiceServer) Spectate(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Spectate not implemented")
}

// UnsafeCameraServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to CameraServiceServer will
// result in compilation errors.
type UnsafeCameraServiceServer interface {
	mustEmbedUnimplementedCameraServiceServer()
}

func RegisterCameraServiceServer(s grpc.ServiceRegistrar, srv CameraServiceServer) {
	s.RegisterService(&CameraService_ServiceDesc, srv)
}

func _CameraService_Spectate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CameraServiceServer).Spectate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/camera_service.CameraService/Spectate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CameraServiceServer).Spectate(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

// CameraService_ServiceDesc is the grpc.ServiceDesc for CameraService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var CameraService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "camera_service.CameraService",
	HandlerType: (*CameraServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Spectate",
			Handler:    _CameraService_Spectate_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/camera/camera.proto",
}