package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"sync"

	service_pb "targabay/protos"
	"targabay/service/internal/auth"
	"targabay/service/internal/handlers"

	"google.golang.org/grpc"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(2)
	go startHealthCheckServer(&wg)
	go startGRPCServer(&wg)

	wg.Wait()
}

func startGRPCServer(wg *sync.WaitGroup) {
	defer wg.Done()
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

func startHealthCheckServer(wg *sync.WaitGroup) {
	defer wg.Done()
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Ready")
	})
	port := ":3002"
	log.Printf("Health check server listening at %s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("failed to start Health Check server: %v", err)
	}
}
