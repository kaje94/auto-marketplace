package handlers

import (
	"common/pkg/config"
	"context"
	"crypto/md5"
	"fmt"
	"strconv"
	"strings"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ImageService struct {
	service_pb.UnimplementedImageServiceServer
}

func (s *ImageService) GenerateSignedUrl(ctx context.Context, req *service_pb.GenerateSignedUrlRequest) (*service_pb.GenerateSignedUrlResponse, error) {
	user := util.GetUserContext(ctx)

	h := md5.New()
	content := strings.NewReader("")
	content.WriteTo(h)

	// Initialize a session in us-west-2 that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials.
	sessionInstance, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		return nil, err
	}

	// Create S3 service client
	svc := s3.New(sessionInstance)

	items := []*service_pb.GenerateSignedUrlResponse_Item{}
	itemCh := make(chan *service_pb.GenerateSignedUrlResponse_Item)

	for _, item := range req.Items {
		go func(item *service_pb.GenerateSignedUrlRequest_Item) {
			contentLength, err := strconv.ParseInt(item.FileSize, 10, 64)
			if err != nil {
				fmt.Println("error presigning request", err)
				itemCh <- nil
				return
			}

			imageName := fmt.Sprintf("images/%s/%s.webp", user.Email, item.FileKey)

			req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
				Bucket:        &config.Config.AWS.S3BucketName,
				Key:           &imageName,
				ContentType:   &item.FileType,
				ContentLength: &contentLength,
			})
			str, err := req.Presign(1 * time.Minute)
			if err != nil {
				fmt.Println("error presigning request", err)
				itemCh <- nil
				return
			}

			itemCh <- &service_pb.GenerateSignedUrlResponse_Item{
				Bucket: config.Config.AWS.S3BucketName,
				Key:    item.FileKey,
				Region: config.Config.AWS.S3Region,
				Url:    str,
				Name:   imageName,
			}
		}(item)
	}

	for range req.Items {
		item := <-itemCh
		if item != nil {
			items = append(items, item)
		}
	}

	return &service_pb.GenerateSignedUrlResponse{Items: items}, nil
}

func (s *ImageService) DeleteS3Images(ctx context.Context, req *service_pb.DeleteS3ImagesRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	if !user.IsAdmin {
		for _, key := range req.Keys {
			if !strings.Contains(key, user.Email) {
				return nil, status.Error(codes.PermissionDenied, "Not allowed to delete image")
			}
		}
	}

	err := deleteS3Images(req.Keys)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to delete images")
	}

	return &service_pb.EmptyResponse{}, nil
}

func deleteS3Images(imageNames []string) error {
	sess, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		return err
	}

	svc := s3.New(sess)

	objects := []*s3.ObjectIdentifier{}
	for _, item := range imageNames {
		objects = append(objects, &s3.ObjectIdentifier{Key: &item})
	}

	_, err = svc.DeleteObjects(&s3.DeleteObjectsInput{
		Bucket: &config.Config.AWS.S3BucketName,
		Delete: &s3.Delete{
			Objects: objects,
		},
	})
	if err != nil {
		return err
	}

	return nil
}
