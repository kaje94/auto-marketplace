package util

import (
	"bytes"
	"common/pkg/xata"
	"encoding/json"
	"math"
	"strings"
	service_pb "targabay/protos"
	"time"
)

func GetInitialNotificationQueryFilterReq(pageNumber int, pageSize int, userEmail string) xata.NotificationsFilterRequest {
	return xata.NotificationsFilterRequest{
		Page: xata.SearchPage{
			Offset: (pageNumber - 1) * pageSize,
			Size:   pageSize,
		},
		Filter: xata.NotificationsFilter{
			User: &xata.FilterEqualsItem{
				Is: userEmail,
			},
		},
		Sort: &xata.CreatedAtSort{
			CreatedAt: "desc",
		},
	}
}

func AddUserNotificationsFilter(request *xata.NotificationsFilterRequest, notificationFilters *service_pb.NotificationFilters_UserNotificationFilters) {
	if notificationFilters.StartDate != "" || notificationFilters.EndDate != "" {
		layout := "2006-01-02"
		startDate, _ := time.Parse(layout, notificationFilters.StartDate)
		startDateStr := startDate.Format(time.RFC3339)

		endDate, _ := time.Parse(layout, notificationFilters.EndDate)
		endDateStr := endDate.Format(time.RFC3339)

		if notificationFilters.StartDate != "" && notificationFilters.EndDate != "" {
			dateFilter := &xata.FilterGeLe{Ge: startDateStr, Le: endDateStr}
			request.Filter.CreatedAt = dateFilter
		} else if notificationFilters.StartDate != "" {
			dateFilter := &xata.FilterGe{Ge: startDateStr}
			request.Filter.CreatedAt = dateFilter
		} else if notificationFilters.EndDate != "" {
			dateFilter := &xata.FilterLe{Le: endDateStr}
			request.Filter.CreatedAt = dateFilter
		}
	}

}

func GetNotificationsQueryResp(notificationFilterReq xata.NotificationsFilterRequest, fetchListResp *xata.FetchNotificationsResponse, xataClient *xata.XataClient) error {
	postBodyList, err := json.Marshal(notificationFilterReq)
	if err != nil {
		return nil
	}

	if err := xataClient.Call("POST", xata.NotificationQuery, bytes.NewBuffer(postBodyList), fetchListResp); err != nil {
		return err
	}

	return nil
}

func GetNotificationsAggrResp(notificationsFilterReq xata.NotificationsFilterRequest, aggrResp *xata.AggregationResponse, xataClient *xata.XataClient) error {
	postBodyTotalCount, err := json.Marshal(xata.AggregationRequest{
		Aggs: xata.Aggr{TotalCount: xata.AggrTotalCount{Count: xata.AggrCount{Filter: notificationsFilterReq.Filter}}},
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

	if err := xataClient.Call("POST", xata.NotificationAggregate, bytes.NewBuffer(postBodyTotalCount), aggrResp); err != nil {
		return err
	}

	return nil
}

func GetNotificationsWithTotal(notificationFilterReq xata.NotificationsFilterRequest, xataClient *xata.XataClient) (xata.FetchNotificationsResponse, xata.AggregationResponse, error) {

	notificationResp := xata.FetchNotificationsResponse{}
	notificationAggrResp := xata.AggregationResponse{}

	// Create channels for communication
	notificationRespChan := make(chan error)
	notificationAggrRespChan := make(chan error)

	// Call util.Xata.Call for notification search in a goroutine
	go func() {
		notificationRespChan <- GetNotificationsQueryResp(notificationFilterReq, &notificationResp, xataClient)
	}()

	// Call util.Xata.Call for notification aggregation in a goroutine
	go func() {
		notificationAggrRespChan <- GetNotificationsAggrResp(notificationFilterReq, &notificationAggrResp, xataClient)
	}()

	// Wait for both calls to complete
	err1 := <-notificationRespChan
	err2 := <-notificationAggrRespChan

	// Check for errors
	if err1 != nil {
		return xata.FetchNotificationsResponse{}, xata.AggregationResponse{}, nil
	}
	if err2 != nil {
		return xata.FetchNotificationsResponse{}, xata.AggregationResponse{}, nil
	}
	return notificationResp, notificationAggrResp, nil
}

func TransformXataToNotificationResp(xataDaa xata.FetchNotificationsResponse, totalCount int, pageSize int) (*service_pb.GetNotificationResponse, error) {
	page := &service_pb.PaginatedResponse{TotalCount: int32(totalCount), TotalPages: int32(math.Ceil(float64(totalCount) / float64(pageSize)))}
	items := []*service_pb.NotificationItem{}

	for _, record := range xataDaa.Records {
		items = append(items, &service_pb.NotificationItem{
			Id:           record.ID,
			Title:        record.Title,
			Body:         record.Body,
			Type:         record.Type,
			RedirectPath: record.RedirectPath,
			IsShown:      record.IsShown,
			CreatedAt:    record.Xata.CreatedAt.String(),
		})
	}

	return &service_pb.GetNotificationResponse{Page: page, Items: items}, nil
}
