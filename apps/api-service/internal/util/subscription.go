package util

import (
	"bytes"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"
	service_pb "targabay/protos"
	"targabay/service/internal/auth"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func VerifySubscriptionAccessible(user auth.User, subscriptionRecord xata.SubscriptionRecord) error {
	if !user.IsAdmin && subscriptionRecord.User.(map[string]interface{})["id"].(string) != commonUtil.SanitizeEmail(user.Email) {
		return status.Error(codes.PermissionDenied, "Only authors and admins are allowed to access this record")
	}
	return nil
}

func GetSubscriptionRecord(subscriptionId string) (xata.SubscriptionRecord, error) {
	subscriptionRecord := xata.SubscriptionRecord{}
	if err := Xata.Call("GET", fmt.Sprintf("%s/%s", xata.SubscriptionsData, subscriptionId), nil, &subscriptionRecord); err != nil {
		return xata.SubscriptionRecord{}, err
	}
	return subscriptionRecord, nil
}

func ParseSubscriptionExpiryDate(expiryDate string) (*time.Time, error) {
	subscriptionExpiryDate, err := time.Parse(time.RFC3339, expiryDate)
	if err != nil {
		return nil, err
	}

	if subscriptionExpiryDate.Before(time.Now().AddDate(0, 0, 7)) {
		return nil, status.Error(codes.InvalidArgument, "Expiry date needs to be at least 1 week from now")
	}
	return &subscriptionExpiryDate, nil
}

func GetInitialSubscriptionQueryFilterReq(pageNumber int, pageSize int) xata.SubscriptionFilterRequest {
	return xata.SubscriptionFilterRequest{
		Page: xata.SearchPage{
			Offset: (pageNumber - 1) * pageSize,
			Size:   pageSize,
		},
		Filter: xata.SubscriptionSearchFilter{},
		Sort: &xata.CreatedAtSort{
			CreatedAt: "desc",
		}}
}

func AddSubscriptionAdminFilter(request *xata.SubscriptionFilterRequest, filters *service_pb.SubscriptionFilters_AdminSubscriptionFilters) {
	if filters.UserEmail != "" {
		request.Filter.User = &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(filters.UserEmail)}
	}
}

func AddSubscriptionUserFilter(request *xata.SubscriptionFilterRequest, filters *service_pb.SubscriptionFilters_UserSubscriptionFilters) {
	if filters.ActiveStatus != "" {
		activeStatusBool, err := strconv.ParseBool(filters.ActiveStatus)
		if err == nil {
			request.Filter.Active = &activeStatusBool
		}
	}

	if filters.NotificationFrequency != "" {
		request.Filter.NotificationFrequency = &xata.FilterEqualsItem{Is: filters.NotificationFrequency}
	}
}

func GetSubscriptionQueryResp(subscriptionFilterReq xata.SubscriptionFilterRequest, fetchListResp *xata.FetchSubscriptionsResponse, xataClient *xata.XataClient) error {
	postBodyList, err := json.Marshal(subscriptionFilterReq)
	if err != nil {
		return nil
	}

	if err := xataClient.Call("POST", xata.SubscriptionQuery, bytes.NewBuffer(postBodyList), fetchListResp); err != nil {
		return err
	}

	return nil
}

func GetSubscriptionAggrResp(subscriptionFilterReq xata.SubscriptionFilterRequest, aggrResp *xata.AggregationResponse, xataClient *xata.XataClient) error {
	postBodyTotalCount, err := json.Marshal(xata.AggregationRequest{
		Aggs: xata.Aggr{TotalCount: xata.AggrTotalCount{Count: xata.AggrCount{Filter: subscriptionFilterReq.Filter}}},
	})

	if err != nil {
		return nil
	}

	if strings.Contains(string(postBodyTotalCount), `"filter":{}`) {
		postBodyTotalCount, err = json.Marshal(xata.AggregationRequest{
			Aggs: xata.Aggr{TotalCount: xata.AggrTotalCount{Count: "*"}},
		})
		if err != nil {
			return nil
		}
	}

	if err := xataClient.Call("POST", xata.SubscriptionAggregate, bytes.NewBuffer(postBodyTotalCount), aggrResp); err != nil {
		return err
	}

	return nil
}

func GetSubscriptionsWithTotal(subscriptionFilterReq xata.SubscriptionFilterRequest, xataClient *xata.XataClient) (xata.FetchSubscriptionsResponse, xata.AggregationResponse, error) {

	subscriptionResp := xata.FetchSubscriptionsResponse{}
	subscriptionAggrResp := xata.AggregationResponse{}

	// Create channels for communication
	subscriptionRespChan := make(chan error)
	subscriptionAggrRespChan := make(chan error)

	// Call util.Xata.Call for subscriptio search in a goroutine
	go func() {
		subscriptionRespChan <- GetSubscriptionQueryResp(subscriptionFilterReq, &subscriptionResp, xataClient)
	}()

	// Call util.Xata.Call for subscriptio aggregation in a goroutine
	go func() {
		subscriptionAggrRespChan <- GetSubscriptionAggrResp(subscriptionFilterReq, &subscriptionAggrResp, xataClient)
	}()

	// Wait for both calls to complete
	err1 := <-subscriptionRespChan
	err2 := <-subscriptionAggrRespChan

	// Check for errors
	if err1 != nil {
		return xata.FetchSubscriptionsResponse{}, xata.AggregationResponse{}, nil
	}
	if err2 != nil {
		return xata.FetchSubscriptionsResponse{}, xata.AggregationResponse{}, nil
	}
	return subscriptionResp, subscriptionAggrResp, nil
}

func TransformXataToSubscriptionResp(xataDaa xata.FetchSubscriptionsResponse, totalCount int, pageSize int) (*service_pb.GetSubscriptionsResponse, error) {
	page := &service_pb.PaginatedResponse{TotalCount: int32(totalCount), TotalPages: int32(math.Ceil(float64(totalCount) / float64(pageSize)))}
	items := []*service_pb.SubscriptionItem{}

	for _, record := range xataDaa.Records {
		items = append(items, &service_pb.SubscriptionItem{
			Id:        record.ID,
			Active:    record.Active,
			CreatedAt: record.Xata.CreatedAt.String(),
			Data: &service_pb.SubscriptionItem_Data{
				Type:                   record.Type,
				Brand:                  record.Brand,
				Model:                  record.Model,
				Trim:                   record.Trim,
				DisplayName:            record.DisplayName,
				MinYearOfManufacture:   int32(record.MinYearOfManufacture),
				MaxYearOfManufacture:   int32(record.MaxYearOfManufacture),
				MinYearOfRegistration:  int32(record.MinYearOfRegistration),
				MaxYearOfRegistration:  int32(record.MaxYearOfRegistration),
				MinMillage:             int32(record.MinMillage),
				MaxMillage:             int32(record.MaxMillage),
				Condition:              record.Condition,
				MinPrice:               float32(record.MinPrice),
				MaxPrice:               float32(record.MaxPrice),
				NotificationFrequency:  record.NotificationFrequency,
				SubscriptionExpiryDate: record.SubscriptionExpiryDate.String(),
			},
			User: &service_pb.UserProfile{
				Data: &service_pb.UserProfile_ProfileData{
					CountryCode: *record.CountryCode,
				},
				Email: commonUtil.DeSanitizeEmail(GetUserEmailFromSubscriptionRec(record)),
			},
		})
	}

	return &service_pb.GetSubscriptionsResponse{Page: page, Items: items}, nil
}

func GetUserEmailFromSubscriptionRec(subscriptionRecord xata.SubscriptionRecord) string {
	return commonUtil.DeSanitizeEmail(subscriptionRecord.User.(map[string]interface{})["id"].(string))
}
