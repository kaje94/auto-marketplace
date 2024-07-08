package handlers

import (
	"context"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
)

type AdminSubscription struct {
	service_pb.UnimplementedAdminSubscriptionsServiceServer
}

func (s *AdminSubscription) GetAllSubscriptions(ctx context.Context, req *service_pb.GetAdminSubscriptionsRequest) (*service_pb.GetSubscriptionsResponse, error) {
	jsonData := util.GetInitialSubscriptionQueryFilterReq(int(req.Page.PageNumber), int(req.Page.PageSize))

	util.AddSubscriptionUserFilter(&jsonData, req.Filters.UserFilters)

	util.AddSubscriptionAdminFilter(&jsonData, req.Filters.AdminFilters)

	subscriptionResp, subscriptionAggrResp, err := util.GetSubscriptionsWithTotal(jsonData, util.Xata)
	if err != nil {
		return nil, err
	}

	return util.TransformXataToSubscriptionResp(subscriptionResp, subscriptionAggrResp.Aggs.TotalCount, int(req.Page.PageSize))
}
