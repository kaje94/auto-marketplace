package main

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

type EmailTemplateContent struct {
	UserName     string `json:"userName"`
	ListingTitle string `json:"listingTitle,omitempty"`
	ListingUrl   string `json:"listingUrl,omitempty"`
}

func main() {
	// Get listings that should be marked as expired
	expiredListings := getExpiredListings()

	if len(expiredListings) > 0 {
		// Update the listing status as expired
		updateListingStatus(expiredListings)

		// Get the users who should be notified
		userNames := getUserNames(expiredListings)

		// Send email notifications to those users
		sendEmails(expiredListings, userNames)
	}
}

func updateListingStatus(listingRecords []xata.ListingRecord) {
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

func getUserNames(listingRecords []xata.ListingRecord) map[string]string {
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

func getExpiredListings() []xata.ListingRecord {
	subscriptionFilterReq := xata.ListingSearchRequest{
		Filter: xata.ListingSearchFilter{ExpiryDate: &xata.FilterLe{Le: time.Now()}, Status: "Posted"},
	}

	postBodyList, err := json.Marshal(subscriptionFilterReq)
	if err != nil {
		log.Fatalln(err.Error())
	}

	fetchListResp := xata.FetchListingsResponse{}
	if err := Xata.Call("POST", xata.ListingQuery, bytes.NewBuffer(postBodyList), &fetchListResp); err != nil {
		log.Fatalln(err.Error())
	}

	return fetchListResp.Records
}

func sendEmails(listingRecords []xata.ListingRecord, userMap map[string]string) error {
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
