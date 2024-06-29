package handlers

import (
	"bytes"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"context"
	"encoding/json"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
)

type Notifications struct {
	service_pb.NotificationsServiceServer
}

func (s *Notifications) GetUserNotifications(ctx context.Context, req *service_pb.GetUserNotificationsRequest) (*service_pb.GetNotificationResponse, error) {
	user := util.GetUserContext(ctx)

	jsonData := util.GetInitialNotificationQueryFilterReq(int(req.Page.PageNumber), int(req.Page.PageSize), commonUtil.SanitizeEmail(user.Email))

	util.AddUserNotificationsFilter(&jsonData, req.Filters.UserFilters)

	listingResp, listingAggrResp, err := util.GetNotificationsWithTotal(jsonData, util.Xata)
	if err != nil {
		return nil, err
	}

	return util.TransformXataToNotificationResp(listingResp, listingAggrResp.Aggs.TotalCount, int(req.Page.PageSize))
}

func (s *Notifications) MarkAllNotificationsShown(ctx context.Context, req *service_pb.EmptyRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	allUserNotificationReq := xata.NotificationsFilterRequest{
		Filter: xata.NotificationsFilter{
			User: &xata.FilterEqualsItem{
				Is: commonUtil.SanitizeEmail(user.Email),
			},
		},
	}

	postBodyList, err := json.Marshal(allUserNotificationReq)
	if err != nil {
		return nil, err
	}

	notificationResp := xata.FetchNotificationsResponse{}
	if err := util.Xata.Call("POST", xata.NotificationQuery, bytes.NewBuffer(postBodyList), &notificationResp); err != nil {
		return nil, err
	}

	transactions := xata.TransactionRequest{}
	for _, record := range notificationResp.Records {
		transactions.Operations = append(transactions.Operations, xata.UpdateTransaction{
			Update: xata.UpdateTransactionData{
				Table:  xata.NotificationsTableName,
				ID:     record.ID,
				Fields: xata.NotificationRecord{IsShown: true},
			},
		})
	}

	postBody, err := json.Marshal(transactions)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}
