package main

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "targabay/protos"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedServiceServer
}

func (s *server) Print(ctx context.Context, in *pb.PrintRequest) (*pb.PrintResponse, error) {
	fmt.Println(`Incomming req`, in.Message)
	return &pb.PrintResponse{}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen on port 50051: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterServiceServer(s, &server{})
	log.Printf("gRPC server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
