package internal

import (
	"bytes"
	"common/pkg/config"
	"common/pkg/util"
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"os"
	"sort"
	"strings"
	service_pb "targabay/protos"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

var Xata = xata.NewXataClient(config.Config.Xata.ApiKey, config.Config.Xata.DbUrl, config.Config.Xata.Branch)

func CreateNotifications(userListingsMap map[string]SubscriptionListings) {
	transactions := xata.TransactionRequest{}

	for mapKey, subListings := range userListingsMap {
		transactions.Operations = append(transactions.Operations, xata.InsertTransaction{
			Insert: xata.InsertTransactionData{
				Table: xata.NotificationsTableName,
				Record: xata.NotificationRecord{
					Title:        fmt.Sprintf(`New listings matching your subscription %s`, subListings.Subscription.DisplayName),
					IsShown:      false,
					User:         util.SanitizeEmail(mapKey),
					RedirectPath: getSearchStr(subListings.Subscription),
					Type:         "ListingSubscriptionAlert",
					Body:         fmt.Sprintf(`%d New listings found matching your subscription preference for %s. You can modify your subscription preference by visiting your subscriptions page.`, len(subListings.Listings), subListings.Subscription.DisplayName),
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

func GetTopListings(userListingsMap map[string]SubscriptionListings) map[string]SubscriptionListings {
	newUserListingsMap := make(map[string]SubscriptionListings)

	for mapKey, subListings := range userListingsMap {
		listings := subListings.Listings
		// Sort listings by Views in descending order
		sort.Slice(listings, func(i, j int) bool {
			if listings[i].Views == nil {
				return false
			}
			if listings[j].Views == nil {
				return true
			}
			return *listings[i].Views > *listings[j].Views
		})

		// Get top 5 listings
		topListings := listings
		if len(listings) > 5 {
			topListings = listings[:5]
		}

		newUserListingsMap[mapKey] = SubscriptionListings{
			Subscription: subListings.Subscription,
			Listings:     topListings,
		}
	}
	return newUserListingsMap
}

func FilterByUserState(userListingsMap map[string]SubscriptionListings, userNames map[string]UserData) map[string]SubscriptionListings {
	newUserListingsMap := make(map[string]SubscriptionListings)

	for mapKey, subListings := range userListingsMap {
		var filtered []xata.ListingRecord
		userId := subListings.Subscription.User.(map[string]interface{})["id"].(string)

		for _, listingItem := range subListings.Listings {
			if *listingItem.State == userNames[userId].State {
				filtered = append(filtered, listingItem)
			}
		}
		if len(filtered) > 0 {
			newUserListingsMap[mapKey] = SubscriptionListings{
				Subscription: subListings.Subscription,
				Listings:     filtered,
			}
		}
	}

	return newUserListingsMap
}

func GenUserListingsMap(subscriptions []xata.SubscriptionRecord, newListings []xata.ListingRecord) map[string]SubscriptionListings {
	userListingsMap := make(map[string]SubscriptionListings)

	for _, subscription := range subscriptions {
		for _, record := range newListings {
			userEmail := util.GetUserEmailFromListingRec(record)

			if record.User.(map[string]interface{})["id"].(string) == subscription.User.(map[string]interface{})["id"].(string) {
				continue
			}

			if record.Type != subscription.Type {
				continue
			}

			if *record.CountryCode != *subscription.CountryCode {
				continue
			}

			if subscription.Brand != "" && subscription.Brand != record.Brand {
				continue
			}

			if subscription.Model != "" && !strings.EqualFold(subscription.Model, record.Model) {
				continue
			}

			if subscription.Trim != "" && !strings.EqualFold(subscription.Trim, record.Trim) {
				continue
			}

			if subscription.Condition != "" && subscription.Condition != record.Condition {
				continue
			}

			if subscription.MinYearOfManufacture != 0 && subscription.MaxYearOfManufacture != 0 {
				if subscription.MinYearOfManufacture > record.YearOfManufacture || subscription.MaxYearOfManufacture < record.YearOfManufacture {
					continue
				}
			} else if subscription.MinYearOfManufacture != 0 {
				if subscription.MinYearOfManufacture > record.YearOfManufacture {
					continue
				}
			} else if subscription.MaxYearOfManufacture != 0 {
				if subscription.MaxYearOfManufacture < record.YearOfManufacture {
					continue
				}
			}

			if subscription.MinYearOfRegistration != 0 && subscription.MaxYearOfRegistration != 0 {
				if subscription.MinYearOfRegistration > record.YearOfRegistration || subscription.MaxYearOfRegistration < record.YearOfRegistration {
					continue
				}
			} else if subscription.MinYearOfRegistration != 0 {
				if subscription.MinYearOfRegistration > record.YearOfRegistration {
					continue
				}
			} else if subscription.MaxYearOfRegistration != 0 {
				if subscription.MaxYearOfRegistration < record.YearOfRegistration {
					continue
				}
			}

			if subscription.MinMillage != 0 && subscription.MaxMillage != 0 {
				if subscription.MinMillage > record.Mileage || subscription.MaxMillage < record.Mileage {
					continue
				}
			} else if subscription.MinMillage != 0 {
				if subscription.MinMillage > record.Mileage {
					continue
				}
			} else if subscription.MaxMillage != 0 {
				if subscription.MaxMillage < record.Mileage {
					continue
				}
			}

			if subscription.MinPrice != 0 && subscription.MaxPrice != 0 {
				if subscription.MinPrice > record.Price || subscription.MaxPrice < record.Price {
					continue
				}
			} else if subscription.MinPrice != 0 {
				if subscription.MinPrice > record.Price {
					continue
				}
			} else if subscription.MaxPrice != 0 {
				if subscription.MaxPrice < record.Price {
					continue
				}
			}

			if len(userListingsMap[userEmail].Listings) > 0 {
				userListingsMap[userEmail] = SubscriptionListings{
					Subscription: subscription,
					Listings:     append(userListingsMap[userEmail].Listings, record),
				}
			} else {
				userListingsMap[userEmail] = SubscriptionListings{
					Subscription: subscription,
					Listings:     []xata.ListingRecord{record},
				}
			}
		}

	}

	return userListingsMap
}

func GetUserNames(userMap map[string]SubscriptionListings) map[string]UserData {
	userMapInserted := make(map[string]bool)
	usersTransactions := xata.TransactionRequest{}

	for userEmail, _ := range userMap {
		userRecord := userMapInserted[userEmail]
		if !userRecord {
			usersTransactions.Operations = append(usersTransactions.Operations, xata.GetTransaction{
				Get: xata.GetTransactionData{
					Table:   xata.UsersTableName,
					ID:      util.SanitizeEmail(userEmail),
					Columns: []string{"id", "name", "state"},
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

	userNames := make(map[string]UserData)
	for _, record := range usersTransactionResp.Results {
		if userNames[record.Columns["id"]].Name == "" && record.Columns["name"] != "" {
			userNames[record.Columns["id"]] = UserData{
				Name:  record.Columns["name"],
				State: record.Columns["state"],
			}
		}
	}

	return userNames
}

func GetSubscriptions(subFrequency string) []xata.SubscriptionRecord {
	subscriptionFilterReq := xata.SubscriptionFilterRequest{
		Filter: xata.SubscriptionSearchFilter{NotificationFrequency: &xata.FilterEqualsItem{Is: subFrequency}},
	}

	postBodyList, err := json.Marshal(subscriptionFilterReq)
	if err != nil {
		log.Fatalln(err.Error())
	}

	fetchListResp := xata.FetchSubscriptionsResponse{}
	if err := Xata.Call("POST", xata.SubscriptionQuery, bytes.NewBuffer(postBodyList), &fetchListResp); err != nil {
		log.Fatalln(err.Error())
	}

	return fetchListResp.Records
}

func GetNewListings(geTimeStr time.Time) []xata.ListingRecord {
	listingsFilterReq := xata.ListingSearchRequest{
		Filter: xata.ListingSearchFilter{CreatedAt: &xata.FilterGe{Ge: geTimeStr}, Status: "Posted"},
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

func SendEmails(userMap map[string]SubscriptionListings, userName map[string]UserData) error {
	sessionInstance, err := session.NewSession(&aws.Config{
		Region:      &config.Config.AWS.S3Region,
		Credentials: credentials.NewStaticCredentials(config.Config.AWS.AccessKey, config.Config.AWS.AccessSecret, ""),
	})
	if err != nil {
		log.Fatalln(err.Error())
	}

	sesSession := ses.New(sessionInstance)

	destinations := []*ses.BulkEmailDestination{}

	for userEmail, mapVal := range userMap {
		listings := []EmailTemplateListingContent{}

		for _, record := range mapVal.Listings {
			imageUrl, imageColor := getImageUrl(record)
			listings = append(listings, EmailTemplateListingContent{
				Title:      util.GetListingTitleFromRec(record),
				ListingUrl: fmt.Sprintf(`%s/%s/search/%s`, config.Config.WebAppUrl, *record.CountryCode, record.ID),
				Location:   fmt.Sprintf(`%s, %s`, *record.City, *record.State),
				DaysAgo:    timeAgo(record.Xata.CreatedAt),
				ImageUrl:   imageUrl,
				ImageColor: imageColor,
			})
		}

		searchStr := ""
		if len(listings) > 5 {
			searchStr = getSearchStr(mapVal.Subscription)
		}
		emailContent := EmailTemplateContent{
			UserName:         userName[util.SanitizeEmail(userEmail)].Name,
			Listings:         listings,
			MoreListingLink:  searchStr,
			SubscriptionName: mapVal.Subscription.DisplayName,
		}

		emailContentMarshalled, err := json.Marshal(emailContent)
		if err != nil {
			log.Fatalln(err.Error())
		}
		emailContentStr := string(emailContentMarshalled)

		fmt.Println(emailContentStr)

		destinations = append(destinations, &ses.BulkEmailDestination{
			Destination:             &ses.Destination{ToAddresses: []*string{&userEmail}},
			ReplacementTemplateData: &emailContentStr,
		})
	}

	emailSource := "Targabay <notifications@targabay.com>"
	templateName := fmt.Sprintf(`targabay-subscription-template-%s`, config.Config.EnvName)

	defaultEmailContent := EmailTemplateContent{
		UserName:         "Targabay User",
		Listings:         []EmailTemplateListingContent{},
		SubscriptionName: "Targabay Subscription",
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

func timeAgo(t time.Time) string {
	now := time.Now()
	duration := now.Sub(t)

	switch {
	case duration < 0:
		return "in the future"
	case duration < 24*time.Hour:
		if t.Day() == now.Day() {
			return "today"
		}
		return "yesterday"
	case duration < 48*time.Hour:
		return "yesterday"
	case duration < 7*24*time.Hour:
		days := int(duration.Hours() / 24)
		return fmt.Sprintf("%d days ago", days)
	case duration < 30*24*time.Hour:
		weeks := int(duration.Hours() / (24 * 7))
		return fmt.Sprintf("%d weeks ago", weeks)
	case duration < 365*24*time.Hour:
		months := int(duration.Hours() / (24 * 30))
		return fmt.Sprintf("%d months ago", months)
	default:
		years := int(duration.Hours() / (24 * 365))
		return fmt.Sprintf("%d years ago", years)
	}
}

func getSearchStr(subscription xata.SubscriptionRecord) string {

	params := map[string]string{
		"vehicleType": subscription.Type,
	}

	var queryItems []string

	if subscription.Brand != "" {
		queryItems = append(queryItems, subscription.Brand)
	}

	if subscription.Model != "" {
		queryItems = append(queryItems, subscription.Model)
	}

	if subscription.Trim != "" {
		queryItems = append(queryItems, subscription.Trim)
	}

	query := strings.Join(queryItems, ", ")

	if query != "" {
		params["query"] = query

	}

	if subscription.Condition != "" {
		params["condition"] = subscription.Condition
	}
	if subscription.MinYearOfManufacture != 0 {
		params["yomStartDate"] = fmt.Sprintf(`%d`, subscription.MinYearOfManufacture)
	}
	if subscription.MaxYearOfManufacture != 0 {
		params["yomEndDate"] = fmt.Sprintf(`%d`, subscription.MaxYearOfManufacture)
	}
	if subscription.MinPrice != 0 {
		params["minPrice"] = fmt.Sprintf(`%d`, subscription.MinPrice)
	}
	if subscription.MaxPrice != 0 {
		params["maxPrice"] = fmt.Sprintf(`%d`, subscription.MaxPrice)
	}

	values := url.Values{}
	for key, value := range params {
		values.Set(key, value)
	}
	return fmt.Sprintf(`%s/%s/search?%s`, config.Config.WebAppUrl, *subscription.CountryCode, values.Encode())
}

func getImageUrl(record xata.ListingRecord) (string, string) {
	images, _ := util.TransformStrToListingImages(record.VehicleImages)

	var thumbnailImage *service_pb.ListingItem_Data_Image
	for _, imageItem := range images {
		if imageItem.IsThumbnail {
			thumbnailImage = imageItem
			break
		}
	}
	if thumbnailImage == nil && len(images) > 0 {
		thumbnailImage = images[0]
	}

	if thumbnailImage != nil {
		cdnBase := os.Getenv("IMAGE_CDN_BASE")
		if cdnBase == "" {
			return thumbnailImage.Url, thumbnailImage.Color
		}

		return fmt.Sprintf(`%s/%s?q=50&tr=120`, cdnBase, thumbnailImage.Name), thumbnailImage.Color
	}

	return "", ""
}
