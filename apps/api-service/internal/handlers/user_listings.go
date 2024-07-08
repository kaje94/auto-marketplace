package handlers

import (
	"bytes"
	"common/pkg/config"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"context"
	"encoding/json"
	"fmt"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
	"time"

	"github.com/go-playground/validator/v10"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type UserListings struct {
	service_pb.UnimplementedUserListingsServiceServer
}

func (s *UserListings) CreateListing(ctx context.Context, req *service_pb.ListingItem_Data) (*service_pb.CreatedIdResponse, error) {
	user := util.GetUserContext(ctx)

	canCreate, err := s.CanCreateListing(ctx, nil)
	if err != nil {
		return nil, err
	}

	if !canCreate.Value {
		return nil, status.Error(codes.PermissionDenied, "Maximum number of listings reached")
	}

	userRecord, err := util.GetUserRecord(user.Email)
	if err != nil {
		return nil, err
	}

	vehicleImageStr, err := util.TransformListingImagesToStr(req.VehicleImages)
	if err != nil {
		return nil, err
	}

	jsonData := xata.ListingRecord{
		Type:               req.Type,
		Brand:              req.Brand,
		Trim:               req.Trim,
		Model:              req.Model,
		YearOfManufacture:  int(req.YearOfManufacture),
		YearOfRegistration: int(req.YearOfRegistration),
		Mileage:            int(req.Mileage),
		Condition:          req.Condition,
		TransmissionType:   req.TransmissionType,
		FuelType:           req.FuelType,
		EngineCapacity:     int(req.EngineCapacity),
		VehicleImages:      string(vehicleImageStr),
		Features:           req.Features,
		Description:        req.Description,
		ExpiryDate:         time.Now().AddDate(0, 1, 0), // 1 month to the current date
		Status:             "UnderReview",
		User:               commonUtil.SanitizeEmail(user.Email),
		Price:              int(req.Price),
		PriceNegotiable:    req.PriceNegotiable,
		City:               &userRecord.City,
		State:              &userRecord.State,
		CountryCode:        &userRecord.CountryCode,
		Ada002:             req.Embeddings,
	}

	validate := validator.New()
	if err := validate.Struct(jsonData); err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	createListingResp := xata.XataCreateResponse{}
	if err := util.Xata.Call("POST", xata.ListingData, bytes.NewBuffer(postBody), &createListingResp); err != nil {
		return nil, err
	}

	return &service_pb.CreatedIdResponse{Id: createListingResp.ID}, nil
}

func (s *UserListings) GetUserListings(ctx context.Context, req *service_pb.GetUserListingsRequest) (*service_pb.GetListingsResponse, error) {
	user := util.GetUserContext(ctx)

	jsonData := util.GetInitialListingQueryFilterReq(int(req.Page.PageNumber), int(req.Page.PageSize))

	util.AddPublicFilter(&jsonData, req.Filters.PublicFilters)

	util.AddUserFilter(&jsonData, req.Filters.UserFilters)

	jsonData.Filter.CountryCode = nil

	jsonData.Filter.User = &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(user.Email)}

	listingResp, listingAggrResp, err := util.GetListingsWithTotal(jsonData, util.Xata)
	if err != nil {
		return nil, err
	}

	return util.TransformXataToListingsResp(listingResp, listingAggrResp.Aggs.TotalCount, int(req.Page.PageSize))
}

func (s *UserListings) DeleteListing(ctx context.Context, req *service_pb.IdRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	images, err := commonUtil.TransformStrToListingImages(listingRecord.VehicleImages)
	if err != nil {
		return nil, err
	}

	imageKeys := []string{}
	for _, imageItem := range images {
		imageKeys = append(imageKeys, imageItem.Name)
	}

	err = util.VerifyListingAccessible(user, listingRecord)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("DELETE", fmt.Sprintf("%s/%s", xata.ListingData, req.Id), nil, nil); err != nil {
		return nil, err
	}

	if len(imageKeys) > 0 {
		err = deleteS3Images(imageKeys)
		if err != nil {
			return nil, err
		}
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserListings) GetUserListingItem(ctx context.Context, req *service_pb.IdRequest) (*service_pb.ListingItem, error) {
	user := util.GetUserContext(ctx)

	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifyListingAccessible(user, listingRecord)
	if err != nil {
		return nil, err
	}

	userRecord, err := util.GetUserRecord(commonUtil.GetUserEmailFromListingRec(listingRecord))
	if err != nil {
		return nil, err
	}

	return util.TransformXataToListingItemResp(listingRecord, &userRecord)
}

func (s *UserListings) UpdateListing(ctx context.Context, req *service_pb.UpdateListingRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifyListingAccessible(user, listingRecord)
	if err != nil {
		return nil, err
	}

	vehicleImageStr, err := util.TransformListingImagesToStr(req.Data.VehicleImages)
	if err != nil {
		return nil, err
	}

	jsonData := xata.ListingRecord{
		Type:               req.Data.Type,
		Brand:              req.Data.Brand,
		Trim:               req.Data.Trim,
		Model:              req.Data.Model,
		YearOfManufacture:  int(req.Data.YearOfManufacture),
		YearOfRegistration: int(req.Data.YearOfRegistration),
		Mileage:            int(req.Data.Mileage),
		Condition:          req.Data.Condition,
		TransmissionType:   req.Data.TransmissionType,
		FuelType:           req.Data.FuelType,
		EngineCapacity:     int(req.Data.EngineCapacity),
		VehicleImages:      string(vehicleImageStr),
		Features:           req.Data.Features,
		Description:        req.Data.Description,
		ExpiryDate:         time.Now().AddDate(0, 1, 0), // 1 month to the current date
		Status:             "UnderReview",
		Price:              int(req.Data.Price),
		PriceNegotiable:    req.Data.PriceNegotiable,
		AdminReview:        nil,
		Ada002:             req.Data.Embeddings,
	}

	validate := validator.New()
	if err := validate.Struct(jsonData); err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.ListingData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserListings) RenewListing(ctx context.Context, req *service_pb.IdRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifyListingAccessible(user, listingRecord)
	if err != nil {
		return nil, err
	}

	jsonData := xata.ListingRecord{
		ExpiryDate: time.Now().AddDate(0, 1, 0), // 1 month to the current date
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.ListingData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserListings) UnListListing(ctx context.Context, req *service_pb.UnListListingRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifyListingAccessible(user, listingRecord)
	if err != nil {
		return nil, err
	}

	validate := validator.New()
	err = validate.Var(req.Status, "oneof=Sold TemporarilyUnlisted PermanentlyRemoved")
	if err != nil {
		return nil, err
	}

	jsonData := xata.ListingRecord{
		Status: req.Status,
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.ListingData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserListings) CanCreateListing(ctx context.Context, req *service_pb.EmptyRequest) (*service_pb.BooleanResponse, error) {
	user := util.GetUserContext(ctx)

	summarizeCountReq := xata.SummarizeRequest{
		Filter: xata.ListingSearchFilter{User: &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(user.Email)}},
		Summaries: xata.CountSummarizeReq{
			Count: struct {
				Count string "json:\"count,omitempty\""
			}{Count: "*"},
		},
	}

	postBodyList, err := json.Marshal(summarizeCountReq)
	if err != nil {
		return nil, err
	}

	fetchListResp := xata.CountSummarizeResponse{}
	if err := util.Xata.Call("POST", xata.ListingSummarize, bytes.NewBuffer(postBodyList), &fetchListResp); err != nil {
		return nil, err
	}

	canCreate := fetchListResp.Summaries[0].Count < config.Config.MaxUserListings

	return &service_pb.BooleanResponse{Value: canCreate}, nil
}
