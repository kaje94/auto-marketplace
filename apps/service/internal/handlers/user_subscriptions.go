package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
	"targabay/service/pkg/xata"

	"github.com/go-playground/validator/v10"
)

type UserSubscription struct {
	service_pb.UnimplementedUserSubscriptionsServiceServer
}

func (s *UserSubscription) CreateSubscription(ctx context.Context, req *service_pb.SubscriptionItem_Data) (*service_pb.CreatedIdResponse, error) {
	user := util.GetUserContext(ctx)

	userRecord, err := util.GetUserRecord(user.Email)
	if err != nil {
		return nil, err
	}

	subscriptionExpiryDate, err := util.ParseSubscriptionExpiryDate(req.SubscriptionExpiryDate)
	if err != nil {
		return nil, err
	}

	jsonData := xata.SubscriptionRecord{
		Type:                   req.Type,
		Brand:                  req.Brand,
		Trim:                   req.Trim,
		Model:                  req.Model,
		User:                   util.SanitizeEmail(user.Email),
		DisplayName:            req.DisplayName,
		MinYearOfManufacture:   int(req.MinYearOfManufacture),
		MaxYearOfManufacture:   int(req.MaxYearOfManufacture),
		MinYearOfRegistration:  int(req.MinYearOfRegistration),
		MaxYearOfRegistration:  int(req.MaxYearOfRegistration),
		MinMillage:             int(req.MinMillage),
		MaxMillage:             int(req.MaxMillage),
		Condition:              req.Condition,
		MinPrice:               int(req.MinPrice),
		MaxPrice:               int(req.MaxPrice),
		NotificationFrequency:  req.NotificationFrequency,
		SubscriptionExpiryDate: *subscriptionExpiryDate,
		CountryCode:            &userRecord.CountryCode,
		Active:                 true,
	}

	validate := validator.New()
	if err := validate.Struct(jsonData); err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	createSubscriptionResp := xata.XataCreateResponse{}
	if err := util.Xata.Call("POST", xata.SubscriptionsData, bytes.NewBuffer(postBody), &createSubscriptionResp); err != nil {
		return nil, err
	}

	return &service_pb.CreatedIdResponse{Id: createSubscriptionResp.ID}, nil
}

func (s *UserSubscription) UpdateSubscription(ctx context.Context, req *service_pb.UpdateSubscriptionRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	subscriptionRecord, err := util.GetSubscriptionRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifySubscriptionAccessible(user, subscriptionRecord)
	if err != nil {
		return nil, err
	}

	subscriptionExpiryDate, err := util.ParseSubscriptionExpiryDate(req.Data.SubscriptionExpiryDate)
	if err != nil {
		return nil, err
	}

	jsonData := xata.SubscriptionRecord{
		Type:                   req.Data.Type,
		Brand:                  req.Data.Brand,
		Trim:                   req.Data.Trim,
		Model:                  req.Data.Model,
		DisplayName:            req.Data.DisplayName,
		MinYearOfManufacture:   int(req.Data.MinYearOfManufacture),
		MaxYearOfManufacture:   int(req.Data.MaxYearOfManufacture),
		MinYearOfRegistration:  int(req.Data.MinYearOfRegistration),
		MaxYearOfRegistration:  int(req.Data.MaxYearOfRegistration),
		MinMillage:             int(req.Data.MinMillage),
		MaxMillage:             int(req.Data.MaxMillage),
		Condition:              req.Data.Condition,
		MinPrice:               int(req.Data.MinPrice),
		MaxPrice:               int(req.Data.MaxPrice),
		NotificationFrequency:  req.Data.NotificationFrequency,
		SubscriptionExpiryDate: *subscriptionExpiryDate,
	}

	validate := validator.New()
	if err := validate.Struct(jsonData); err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.SubscriptionsData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserSubscription) GetSubscriptionItem(ctx context.Context, req *service_pb.IdRequest) (*service_pb.SubscriptionItem, error) {
	user := util.GetUserContext(ctx)

	subscriptionRecord, err := util.GetSubscriptionRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifySubscriptionAccessible(user, subscriptionRecord)
	if err != nil {
		return nil, err
	}

	return &service_pb.SubscriptionItem{
		Id:        subscriptionRecord.ID,
		Active:    subscriptionRecord.Active,
		CreatedAt: subscriptionRecord.Xata.CreatedAt.String(),
		Data: &service_pb.SubscriptionItem_Data{
			DisplayName:            subscriptionRecord.DisplayName,
			Type:                   subscriptionRecord.Type,
			Brand:                  subscriptionRecord.Brand,
			Model:                  subscriptionRecord.Model,
			Trim:                   subscriptionRecord.Trim,
			MinYearOfManufacture:   int32(subscriptionRecord.MinYearOfManufacture),
			MaxYearOfManufacture:   int32(subscriptionRecord.MaxYearOfManufacture),
			MinYearOfRegistration:  int32(subscriptionRecord.MinYearOfRegistration),
			MaxYearOfRegistration:  int32(subscriptionRecord.MaxYearOfRegistration),
			MinMillage:             int32(subscriptionRecord.MinMillage),
			MaxMillage:             int32(subscriptionRecord.MaxMillage),
			Condition:              subscriptionRecord.Condition,
			MinPrice:               float32(subscriptionRecord.MinPrice),
			MaxPrice:               float32(subscriptionRecord.MaxPrice),
			NotificationFrequency:  subscriptionRecord.NotificationFrequency,
			SubscriptionExpiryDate: subscriptionRecord.SubscriptionExpiryDate.String(),
		},
		User: &service_pb.UserProfile{
			Email: util.DeSanitizeEmail(util.GetUserEmailFromSubscriptionRec(subscriptionRecord)),
			Data: &service_pb.UserProfile_ProfileData{
				CountryCode: *subscriptionRecord.CountryCode,
			},
		},
	}, nil
}

func (s *UserSubscription) DeleteSubscription(ctx context.Context, req *service_pb.IdRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	subscriptionRecord, err := util.GetSubscriptionRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifySubscriptionAccessible(user, subscriptionRecord)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("DELETE", fmt.Sprintf("%s/%s", xata.SubscriptionsData, req.Id), nil, nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserSubscription) ActivateSubscription(ctx context.Context, req *service_pb.ActivateSubscriptionRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	subscriptionRecord, err := util.GetSubscriptionRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifySubscriptionAccessible(user, subscriptionRecord)
	if err != nil {
		return nil, err
	}

	subscriptionExpiryDate, err := util.ParseSubscriptionExpiryDate(req.SubscriptionExpiryDate)
	if err != nil {
		return nil, err
	}

	jsonData := xata.SubscriptionRecord{
		SubscriptionExpiryDate: *subscriptionExpiryDate,
		Active:                 true,
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.SubscriptionsData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserSubscription) DeactivateSubscription(ctx context.Context, req *service_pb.IdRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	subscriptionRecord, err := util.GetSubscriptionRecord(req.Id)
	if err != nil {
		return nil, err
	}

	err = util.VerifySubscriptionAccessible(user, subscriptionRecord)
	if err != nil {
		return nil, err
	}

	jsonData := struct {
		Active bool `json:"active"`
	}{
		Active: false,
	}

	postBody, err := json.Marshal(jsonData)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("PATCH", fmt.Sprintf("%s/%s", xata.SubscriptionsData, req.Id), bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func (s *UserSubscription) GetUserSubscriptions(ctx context.Context, req *service_pb.GetUserSubscriptionsRequest) (*service_pb.GetSubscriptionsResponse, error) {
	user := util.GetUserContext(ctx)

	jsonData := util.GetInitialSubscriptionQueryFilterReq(int(req.Page.PageNumber), int(req.Page.PageSize))

	util.AddSubscriptionUserFilter(&jsonData, req.Filters.UserFilters)

	jsonData.Filter.User = &xata.FilterEqualsItem{Is: util.SanitizeEmail(user.Email)}

	subscriptionResp, subscriptionAggrResp, err := util.GetSubscriptionsWithTotal(jsonData, util.Xata)
	if err != nil {
		return nil, err
	}

	return util.TransformXataToSubscriptionResp(subscriptionResp, subscriptionAggrResp.Aggs.TotalCount, int(req.Page.PageSize))
}