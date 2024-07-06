package handlers

import (
	"bytes"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"context"
	"encoding/json"
	"fmt"
	service_pb "targabay/protos"
	"targabay/service/internal/util"

	"github.com/go-playground/validator/v10"
)

type PublicListings struct {
	service_pb.UnimplementedPublicListingsServiceServer
}

func (s *PublicListings) IncrementListingViews(ctx context.Context, req *service_pb.IdRequest) (*service_pb.EmptyResponse, error) {
	type IncrementListingView struct {
		Views any `json:"views"`
	}

	jsonData := IncrementListingView{
		Views: struct {
			Increment int "json:\"$increment\""
		}{Increment: 1},
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("POST", fmt.Sprintf("%s/%s", xata.ListingData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *PublicListings) GetPublicListingItem(ctx context.Context, req *service_pb.IdRequest) (*service_pb.ListingItem, error) {
	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	if listingRecord.Status == "Posted" {
		userRecord, err := util.GetUserRecord(commonUtil.GetUserEmailFromListingRec(listingRecord))
		if err != nil {
			return nil, err
		}
		return util.TransformXataToListingItemResp(listingRecord, &userRecord)
	}

	return &service_pb.ListingItem{Id: listingRecord.ID, Status: listingRecord.Status,
		User: &service_pb.UserProfile{Data: &service_pb.UserProfile_ProfileData{CountryCode: *listingRecord.CountryCode}},
		Data: &service_pb.ListingItem_Data{Embeddings: listingRecord.Ada002}}, nil
}

func (s *PublicListings) GetPublicListings(ctx context.Context, req *service_pb.GetPublicListingsRequest) (*service_pb.GetListingsResponse, error) {
	jsonData := util.GetInitialQuerySearchReq(req.Query, int(req.Page.PageNumber), int(req.Page.PageSize))

	util.AddPublicFilter(&jsonData, req.Filters.PublicFilters)

	jsonData.Filter.Status = "Posted"

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	listingResp := xata.FetchListingsResponse{}
	if err := util.Xata.Call("POST", xata.ListingSearch, bytes.NewBuffer(postBody), &listingResp); err != nil {
		return nil, err
	}

	return util.TransformXataToListingsResp(listingResp, listingResp.TotalCount, int(req.Page.PageSize))
}

func (s *UserListings) ReportListing(ctx context.Context, req *service_pb.ReportListingRequest) (*service_pb.EmptyResponse, error) {

	jsonData := xata.ReportRecord{
		Listing: req.ListingId,
		Email:   req.Email,
		Message: req.Message,
		Reason:  req.Message,
	}

	validate := validator.New()
	if err := validate.Struct(jsonData); err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("POST", xata.ReportsData, bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *PublicListings) GetFeaturedListings(ctx context.Context, req *service_pb.CountryCodeRequest) (*service_pb.GetListingsResponse, error) {
	jsonData := util.GetFeaturedQueryFilterReq(req.CountryCode)

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	listingResp := xata.FetchListingsResponse{}
	if err := util.Xata.Call("POST", xata.ListingQuery, bytes.NewBuffer(postBody), &listingResp); err != nil {
		return nil, err
	}

	return util.TransformXataToListingsResp(listingResp, listingResp.TotalCount, 1)
}

func (s *PublicListings) GetRelatedListings(ctx context.Context, req *service_pb.GetRelatedListingsRequest) (*service_pb.GetListingsResponse, error) {
	jsonData := util.GetRelatedQueryFilterReq(req.Embeddings, req.CountryCode)

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	listingResp := xata.FetchListingsResponse{}
	if err := util.Xata.Call("POST", xata.ListingVectorSearch, bytes.NewBuffer(postBody), &listingResp); err != nil {
		return nil, err
	}

	var filteredRecs []xata.ListingRecord
	for _, item := range listingResp.Records {
		if item.ID != req.Id {
			filteredRecs = append(filteredRecs, item)
		}
	}
	listingResp.Records = filteredRecs

	return util.TransformXataToListingsResp(listingResp, listingResp.TotalCount, 1)
}
