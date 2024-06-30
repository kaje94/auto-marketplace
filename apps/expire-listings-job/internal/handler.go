package internal

import (
	"bytes"
	"common/pkg/config"
	"common/pkg/util"
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

var Xata = xata.NewXataClient(config.Config.Xata.ApiKey, config.Config.Xata.DbUrl, config.Config.Xata.Branch)

func UpdateListingStatus(listingRecords []xata.ListingRecord) {
	transactions := xata.TransactionRequest{}

	for _, record := range listingRecords {
		transactions.Operations = append(transactions.Operations, xata.UpdateTransaction{
			Update: xata.UpdateTransactionData{
				Table:  xata.ListingsTableName,
				ID:     record.ID,
				Upsert: true,
				Fields: xata.ListingRecord{Status: "Expired", ExpiryDate: record.ExpiryDate}},
		})
	}

	postBody, err := json.Marshal(transactions)
	if err != nil {
		log.Fatalln(err.Error())
	}

	if err := Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), nil); err != nil {
		log.Fatalln(err.Error())
	}
}

func GetUserNames(listingRecords []xata.ListingRecord) map[string]string {
	userMapInserted := make(map[string]bool)
	usersTransactions := xata.TransactionRequest{}

	for _, record := range listingRecords {
		userEmail := util.GetUserEmailFromListingRec(record)
		userRecord := userMapInserted[userEmail]
		if !userRecord {
			usersTransactions.Operations = append(usersTransactions.Operations, xata.GetTransaction{
				Get: xata.GetTransactionData{
					Table:   xata.UsersTableName,
					ID:      record.User.(map[string]interface{})["id"].(string),
					Columns: []string{"id", "name"},
				},
			})
			userMapInserted[userEmail] = true
		}
	}

	postBody, err := json.Marshal(usersTransactions)
	if err != nil {
		log.Fatalln(err.Error())
	}

	var usersTransactionResp struct {
		Results []xata.TransactionRespItem `json:"results"`
	}

	if err := Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), &usersTransactionResp); err != nil {
		log.Fatalln(err.Error())
	}

	userNames := make(map[string]string)
	for _, record := range usersTransactionResp.Results {
		if userNames[record.Columns["id"]] == "" && record.Columns["name"] != "" {
			userNames[record.Columns["id"]] = record.Columns["name"]
		}
	}

	return userNames
}

func GetExpiredListings() []xata.ListingRecord {
	listingsFilterReq := xata.ListingSearchRequest{
		Filter: xata.ListingSearchFilter{ExpiryDate: &xata.FilterLe{Le: time.Now()}, Status: "Posted"},
	}

	postBodyList, err := json.Marshal(listingsFilterReq)
	if err != nil {
		log.Fatalln(err.Error())
	}

	fetchListResp := xata.FetchListingsResponse{}
	if err := Xata.Call("POST", xata.ListingQuery, bytes.NewBuffer(postBodyList), &fetchListResp); err != nil {
		log.Fatalln(err.Error())
	}

	return fetchListResp.Records
}

func SendEmails(listingRecords []xata.ListingRecord, userMap map[string]string) error {
	sessionInstance, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		log.Fatalln(err.Error())
	}

	sesSession := ses.New(sessionInstance)

	destinations := []*ses.BulkEmailDestination{}

	for _, record := range listingRecords {
		userEmail := util.DeSanitizeEmail(util.GetUserEmailFromListingRec(record))

		emailContent := EmailTemplateContent{
			UserName:     userMap[record.User.(map[string]interface{})["id"].(string)],
			ListingTitle: util.GetListingTitleFromRec(record),
			ListingUrl:   fmt.Sprintf(`%s/%s/dashboard/my-listings/%s`, config.Config.WebAppUrl, *record.CountryCode, record.ID),
		}

		emailContentMarshalled, err := json.Marshal(emailContent)
		if err != nil {
			log.Fatalln(err.Error())
		}
		emailContentStr := string(emailContentMarshalled)

		destinations = append(destinations, &ses.BulkEmailDestination{
			Destination:             &ses.Destination{ToAddresses: []*string{&userEmail}},
			ReplacementTemplateData: &emailContentStr,
		})
	}

	emailSource := "Targabay <notifications@targabay.com>"
	templateName := fmt.Sprintf(`targabay-listing-expired-template-%s`, config.Config.EnvName)

	defaultEmailContent := EmailTemplateContent{
		UserName:     "Targabay User",
		ListingTitle: "your advert",
		ListingUrl:   fmt.Sprintf(`%s/ctry/dashboard/my-listings`, config.Config.WebAppUrl),
	}
	efaultEmailContentMarshalled, err := json.Marshal(defaultEmailContent)
	if err != nil {
		log.Fatalln(err.Error())
	}
	defaultEmailContentStr := string(efaultEmailContentMarshalled)

	_, err = sesSession.SendBulkTemplatedEmail(&ses.SendBulkTemplatedEmailInput{
		Template:            &templateName,
		Destinations:        destinations,
		Source:              &emailSource,
		DefaultTemplateData: &defaultEmailContentStr,
	})

	if err != nil {
		fmt.Println(err)
	}

	return nil
}

func CreateNotifications(listingRecords []xata.ListingRecord) {
	transactions := xata.TransactionRequest{}

	for _, record := range listingRecords {
		userEmail := util.DeSanitizeEmail(util.GetUserEmailFromListingRec(record))

		transactions.Operations = append(transactions.Operations, xata.InsertTransaction{
			Insert: xata.InsertTransactionData{
				Table: xata.NotificationsTableName,
				Record: xata.NotificationRecord{
					Title:        fmt.Sprintf(`Listing for %s has expired`, util.GetListingTitleFromRec(record)),
					IsShown:      false,
					User:         util.SanitizeEmail(userEmail),
					RedirectPath: fmt.Sprintf(`%s/%s/dashboard/my-listings/%s`, config.Config.WebAppUrl, *record.CountryCode, record.ID),
					Type:         "ListingExpired",
					Body:         fmt.Sprintf(`Your listing for %s has expired and will no longer be visible to the public. You can still renew it if you want to keep the listing active.`, util.GetListingTitleFromRec(record)),
				},
			},
		})
	}

	postBody, err := json.Marshal(transactions)
	if err != nil {
		log.Fatalln(err.Error())
	}

	if err := Xata.Call("POST", xata.Transaction, bytes.NewBuffer(postBody), nil); err != nil {
		log.Fatalln(err.Error())
	}
}
