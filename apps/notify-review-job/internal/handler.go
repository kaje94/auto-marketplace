package internal

import (
	"bytes"
	"common/pkg/config"
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

var Xata = xata.NewXataClient(config.Config.Xata.ApiKey, config.Config.Xata.DbUrl, config.Config.Xata.Branch)

func GetUnderReviewListingCount() int {
	summarizeCountReq := xata.SummarizeRequest{
		Filter: xata.ListingSearchFilter{Status: "UnderReview"},
		Summaries: xata.CountSummarizeReq{
			Count: struct {
				Count string "json:\"count,omitempty\""
			}{Count: "*"},
		},
	}

	postBodyList, err := json.Marshal(summarizeCountReq)
	if err != nil {
		log.Fatalln(err.Error())
	}

	fetchListResp := xata.CountSummarizeResponse{}
	if err := Xata.Call("POST", xata.ListingSummarize, bytes.NewBuffer(postBodyList), &fetchListResp); err != nil {
		log.Fatalln(err.Error())
	}

	return fetchListResp.Summaries[0].Count
}

func SendEmail(listingCount int) error {
	sessionInstance, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		return err
	}

	sesSession := ses.New(sessionInstance)

	emailContent := EmailTemplateContent{
		ListingUrl: fmt.Sprintf(`%s/ctry/dashboard/listings?status=UnderReviews`, config.Config.WebAppUrl),
		Count:      strconv.Itoa(listingCount),
	}

	templateName := fmt.Sprintf(`targabay-listing-to-review-%s`, config.Config.EnvName)

	emailSource := "Targabay <notifications@targabay.com>"
	emailContentMarshalled, err := json.Marshal(emailContent)
	if err != nil {
		return err
	}
	emailContentStr := string(emailContentMarshalled)

	adminEmailPointers := make([]*string, 0, len(config.Config.AdminEmails))
	for _, email := range config.Config.AdminEmails {
		adminEmailPointers = append(adminEmailPointers, &email)
	}

	_, err = sesSession.SendTemplatedEmail(&ses.SendTemplatedEmailInput{
		Template:     &templateName,
		Destination:  &ses.Destination{ToAddresses: adminEmailPointers},
		Source:       &emailSource,
		TemplateData: &emailContentStr,
	})
	if err != nil {
		return err
	}

	return nil
}
