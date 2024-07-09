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

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/go-playground/validator/v10"
)

type AdminListings struct {
	service_pb.UnimplementedAdminListingsServiceServer
}

func (s *AdminListings) GetAllListings(ctx context.Context, req *service_pb.GetAdminListingsRequest) (*service_pb.GetListingsResponse, error) {
	jsonData := util.GetInitialListingQueryFilterReq(int(req.Page.PageNumber), int(req.Page.PageSize))

	util.AddPublicFilter(&jsonData, req.Filters.PublicFilters)

	util.AddUserFilter(&jsonData, req.Filters.UserFilters)

	util.AddAdminFilter(&jsonData, req.Filters.AdminFilters)

	listingResp, listingAggrResp, err := util.GetListingsWithTotal(jsonData, util.Xata)
	if err != nil {
		return nil, err
	}

	return util.TransformXataToListingsResp(listingResp, listingAggrResp.Aggs.TotalCount, int(req.Page.PageSize))
}

func (s *AdminListings) ReviewListing(ctx context.Context, req *service_pb.ReviewListingRequest) (*service_pb.EmptyResponse, error) {
	listingRecord, err := util.GetListingRecord(req.Id)
	if err != nil {
		return nil, err
	}

	userRecord, err := util.GetUserRecord(commonUtil.GetUserEmailFromListingRec(listingRecord))
	if err != nil {
		return nil, err
	}

	validate := validator.New()
	err = validate.Var(req.Status, "oneof=Posted Declined")
	if err != nil {
		return nil, err
	}

	transactions := xata.TransactionRequest{}

	transactions.Operations = append(transactions.Operations, xata.UpdateTransaction{
		Update: xata.UpdateTransactionData{
			Table:  xata.ListingsTableName,
			ID:     req.Id,
			Upsert: true,
			Fields: xata.ListingRecord{
				Status:      req.Status,
				AdminReview: &req.AdminReview,
				ExpiryDate:  listingRecord.ExpiryDate,
			},
		},
	})

	listingTitle := commonUtil.GetListingTitleFromRec(listingRecord)
	notificationType := "ListingApproved"
	notificationTitle := fmt.Sprintf(`Your Vehicle Listing '%s' Has Been Approved`, listingTitle)
	notificationBody := fmt.Sprintf(`Exciting news! Your listing for '%s' has been approved and is now live on our marketplace. Thank you for choosing our platform. If you have any questions, feel free to reach out. Happy selling!`, listingTitle)

	if req.Status == "Declined" {
		notificationType = "ListingRejected"
		notificationTitle = fmt.Sprintf(`Your Vehicle Listing '%s' Has Been Rejected`, listingTitle)
		notificationBody = fmt.Sprintf(`We regret to inform you that your vehicle listing titled '%s' has been rejected by our admin team due to '%s'. You may update the listing according to our guidelines and resubmit it for approval. Thank you for your understanding.`, listingTitle, req.AdminReview)
	}

	transactions.Operations = append(transactions.Operations, xata.InsertTransaction{
		Insert: xata.InsertTransactionData{
			Table: xata.NotificationsTableName,
			Record: xata.NotificationRecord{
				Title:        notificationTitle,
				IsShown:      false,
				User:         commonUtil.SanitizeEmail(commonUtil.GetUserEmailFromListingRec(listingRecord)),
				RedirectPath: fmt.Sprintf("/%s/dashboard/listings/%s", *listingRecord.CountryCode, listingRecord.ID),
				Type:         notificationType,
				Body:         notificationBody,
			},
		},
	})

	postBody, err := json.Marshal(transactions)
	if err != nil {
		return nil, err
	}

	if err := util.Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), nil); err != nil {
		return nil, err
	}

	err = sendEmail(userRecord, listingRecord, req.Status == "Declined", req.AdminReview)
	if err != nil {
		return nil, err
	}

	return &service_pb.EmptyResponse{}, nil
}

func sendEmail(userRecord xata.UserRecord, listingRecord xata.ListingRecord, rejected bool, reviewComment string) error {
	sessionInstance, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		return err
	}

	sesSession := ses.New(sessionInstance)

	emailContent := struct {
		UserName       string `json:"userName"`
		ListingTitle   string `json:"listingTitle,omitempty"`
		ListingUrl     string `json:"listingUrl,omitempty"`
		RejectionCause string `json:"rejectionCause,omitempty"`
	}{
		UserName:     userRecord.Name,
		ListingTitle: commonUtil.GetListingTitleFromRec(listingRecord),
		ListingUrl:   fmt.Sprintf(`%s/%s/dashboard/my-listings/%s`, config.Config.WebAppUrl, userRecord.CountryCode, listingRecord.ID),
	}

	templateName := fmt.Sprintf(`targabay-listing-approved-template-%s`, config.Config.EnvName)
	if rejected {
		emailContent.RejectionCause = reviewComment
		templateName = fmt.Sprintf(`targabay-listing-rejected-template-%s`, config.Config.EnvName)
	}
	userEmail := commonUtil.DeSanitizeEmail(commonUtil.GetUserEmailFromListingRec(listingRecord))
	emailSource := "Targabay <notifications@targabay.com>"
	emailContentMarshalled, err := json.Marshal(emailContent)
	if err != nil {
		return err
	}
	emailContentStr := string(emailContentMarshalled)

	_, err = sesSession.SendTemplatedEmail(&ses.SendTemplatedEmailInput{
		Template:     &templateName,
		Destination:  &ses.Destination{ToAddresses: []*string{&userEmail}},
		Source:       &emailSource,
		TemplateData: &emailContentStr,
	})
	if err != nil {
		return err
	}

	return nil
}
