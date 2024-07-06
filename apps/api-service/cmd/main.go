package main

import (
	"fmt"
	"log"
	"net"

	service_pb "targabay/protos"
	"targabay/service/internal/auth"
	"targabay/service/internal/handlers"

	"google.golang.org/grpc"
)

func main() {
	port := 3001
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("failed to listen on port %d: %v", port, err)
	}

	s := grpc.NewServer(grpc.ChainUnaryInterceptor(
		auth.UnaryServerInterceptor(auth.ValidateUser),
	))
	service_pb.RegisterAdminListingsServiceServer(s, &handlers.AdminListings{})
	service_pb.RegisterPublicListingsServiceServer(s, &handlers.PublicListings{})
	service_pb.RegisterUserListingsServiceServer(s, &handlers.UserListings{})
	service_pb.RegisterUserProfileServiceServer(s, &handlers.UserProfile{})
	service_pb.RegisterUserSubscriptionsServiceServer(s, &handlers.UserSubscription{})
	service_pb.RegisterAdminSubscriptionsServiceServer(s, &handlers.AdminSubscription{})
	service_pb.RegisterImageServiceServer(s, &handlers.ImageService{})
	service_pb.RegisterNotificationsServiceServer(s, &handlers.Notifications{})
	service_pb.RegisterLocationsServiceServer(s, &handlers.Locations{})

	log.Printf("gRPC server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
