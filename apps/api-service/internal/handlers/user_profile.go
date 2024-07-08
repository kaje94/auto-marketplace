package handlers

import (
	"bytes"
	"common/pkg/config"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
	"time"

	"github.com/go-playground/validator/v10"
)

type UserProfile struct {
	service_pb.UnimplementedUserProfileServiceServer
}

var accessTokenResp struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
}

var accessTokenExpiresAt time.Time

func (s *UserProfile) UpdateUserProfile(ctx context.Context, req *service_pb.UserProfile_ProfileData) (*service_pb.UpdateUserProfileResponse, error) {
	user := util.GetUserContext(ctx)

	userRecord := xata.UserRecord{
		Phone:         req.Phone,
		City:          req.City,
		State:         req.State,
		PostalCode:    req.PostalCode,
		CountryCode:   req.CountryCode,
		VehicleDealer: req.VehicleDealer,
		Name:          user.Name,
		Picture:       user.Picture,
	}

	validate := validator.New()
	if err := validate.Struct(userRecord); err != nil {
		return nil, err
	}

	transactions := xata.TransactionRequest{}

	transactions.Operations = append(transactions.Operations, xata.UpdateTransaction{
		Update: xata.UpdateTransactionData{
			Table:  xata.UsersTableName,
			ID:     commonUtil.SanitizeEmail(user.Email),
			Upsert: true,
			Fields: userRecord,
		},
	})

	listingResp := xata.FetchListingsResponse{}
	err := util.GetListingsQueryResp(xata.ListingSearchRequest{
		Filter: xata.ListingSearchFilter{User: &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(user.Email)}},
	}, &listingResp, util.Xata)

	if err != nil {
		return nil, err
	}

	listingIds := make([]string, 0)

	for _, record := range listingResp.Records {
		listingIds = append(listingIds, record.ID)
		transactions.Operations = append(transactions.Operations, xata.UpdateTransaction{
			Update: xata.UpdateTransactionData{
				Table:  xata.ListingsTableName,
				ID:     record.ID,
				Fields: xata.ListingRecord{City: &userRecord.City, State: &userRecord.State, CountryCode: &userRecord.CountryCode},
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

	return &service_pb.UpdateUserProfileResponse{ListingIds: listingIds}, nil
}

func (s *UserProfile) GetUserProfile(ctx context.Context, req *service_pb.EmptyRequest) (*service_pb.UserProfile, error) {
	user := util.GetUserContext(ctx)

	userRecord, _ := util.GetUserRecord(user.Email)

	return &service_pb.UserProfile{
		Name: userRecord.Name,
		Data: &service_pb.UserProfile_ProfileData{
			Phone:         userRecord.Phone,
			City:          userRecord.City,
			State:         userRecord.State,
			CountryCode:   userRecord.CountryCode,
			PostalCode:    userRecord.PostalCode,
			VehicleDealer: userRecord.VehicleDealer,
		},
		Email:   user.Email,
		Picture: userRecord.Picture,
	}, nil
}

func (s *UserProfile) CloseAccount(ctx context.Context, req *service_pb.EmptyRequest) (*service_pb.EmptyResponse, error) {
	user := util.GetUserContext(ctx)

	if accessTokenExpiresAt.IsZero() || accessTokenExpiresAt.After(time.Now()) {
		payload := strings.NewReader(fmt.Sprintf("grant_type=client_credentials&client_id=%s&client_secret=%s&audience=%s",
			config.Config.Auth0.ClientId,
			config.Config.Auth0.ClientSecret,
			url.PathEscape(fmt.Sprintf("https://%s/api/v2/", config.Config.Auth0.Domain)),
		))

		tokenReq, _ := http.NewRequest("POST", fmt.Sprintf("https://%s/oauth/token", config.Config.Auth0.Domain), payload)

		tokenReq.Header.Add("content-type", "application/x-www-form-urlencoded")

		res, _ := http.DefaultClient.Do(tokenReq)

		body, err := io.ReadAll(res.Body)
		if err != nil {
			return &service_pb.EmptyResponse{}, err
		}

		err = json.Unmarshal(body, &accessTokenResp)
		if err != nil {
			return &service_pb.EmptyResponse{}, err
		}

		accessTokenExpiresAt = time.Now().Add(time.Duration(accessTokenResp.ExpiresIn) * time.Second)

		defer res.Body.Close()
	}

	// Delete user from auth0
	deleteReq, _ := http.NewRequest("DELETE", fmt.Sprintf("https://%s/api/v2/users/%s", config.Config.Auth0.Domain, url.PathEscape(user.Id)), nil)

	deleteReq.Header.Add("content-type", "application/json")
	deleteReq.Header.Add("authorization", fmt.Sprintf("Bearer %s", accessTokenResp.AccessToken))

	deleteResp, err := http.DefaultClient.Do(deleteReq)
	if err != nil {
		return &service_pb.EmptyResponse{}, err
	}

	defer deleteResp.Body.Close()

	if deleteResp.StatusCode != 204 {
		return &service_pb.EmptyResponse{}, fmt.Errorf("failed to delete user")
	}

	transactions := xata.TransactionRequest{}
	imageKeys := []string{}

	// delete listings
	listingReqFilter := xata.ListingSearchRequest{
		Filter: xata.ListingSearchFilter{
			User: &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(user.Email)},
		},
	}
	listingResp := xata.FetchListingsResponse{}
	util.GetListingsQueryResp(listingReqFilter, &listingResp, util.Xata)

	for _, record := range listingResp.Records {
		images, err := commonUtil.TransformStrToListingImages(record.VehicleImages)
		if err != nil {
			return nil, err
		}

		for _, imageItem := range images {
			imageKeys = append(imageKeys, imageItem.Name)
		}

		transactions.Operations = append(transactions.Operations, xata.DeleteTransaction{
			Delete: xata.DeleteTransactionData{Table: xata.ListingsTableName, ID: record.ID},
		})
	}

	// Delete subscriptions
	subscriptionsReqFilter := xata.SubscriptionFilterRequest{
		Filter: xata.SubscriptionSearchFilter{
			User: &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(user.Email)},
		},
	}
	subscriptionsResp := xata.FetchSubscriptionsResponse{}
	util.GetSubscriptionQueryResp(subscriptionsReqFilter, &subscriptionsResp, util.Xata)

	for _, record := range subscriptionsResp.Records {
		transactions.Operations = append(transactions.Operations, xata.DeleteTransaction{
			Delete: xata.DeleteTransactionData{Table: xata.SubscriptionsTableName, ID: record.ID},
		})
	}

	// Delete user record
	transactions.Operations = append(transactions.Operations, xata.DeleteTransaction{
		Delete: xata.DeleteTransactionData{Table: xata.UsersTableName, ID: commonUtil.SanitizeEmail(user.Email)},
	})

	postBody, err := json.Marshal(transactions)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	// Delete s3 images
	if len(imageKeys) > 0 {
		err = deleteS3Images(imageKeys)
		if err != nil {
			return nil, err
		}
	}

	return &service_pb.EmptyResponse{}, nil
}
