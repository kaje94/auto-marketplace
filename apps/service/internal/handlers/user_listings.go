package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
	"targabay/service/pkg/xata"
	"time"

	"github.com/go-playground/validator/v10"
)

type UserListings struct {
	service_pb.UnimplementedUserListingsServiceServer
}

func (s *UserListings) CreateListing(ctx context.Context, req *service_pb.ListingItem_Data) (*service_pb.CreatedIdResponse, error) {
	user := util.GetUserContext(ctx)

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
		User:               util.SanitizeEmail(user.Email),
		Price:              int(req.Price),
		PriceNegotiable:    req.PriceNegotiable,
		City:               &userRecord.City,
		State:              &userRecord.State,
		CountryCode:        &userRecord.CountryCode,
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

	jsonData.Filter.User = &xata.FilterEqualsItem{Is: util.SanitizeEmail(user.Email)}

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

	images, err := util.TransformStrToListingImages(listingRecord.VehicleImages)
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

	userRecord, err := util.GetUserRecord(util.GetUserEmailFromListingRec(listingRecord))
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
