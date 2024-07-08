package internal

import "common/pkg/xata"

type EmailTemplateContent struct {
	UserName         string                        `json:"userName"`
	Listings         []EmailTemplateListingContent `json:"listings_Items,omitempty"`
	MoreListingLink  string                        `json:"moreListingLink,omitempty"`
	SubscriptionName string                        `json:"subscriptionName,omitempty"`
}

type EmailTemplateListingContent struct {
	Title      string `json:"title"`
	ListingUrl string `json:"listingUrl,omitempty"`
	Location   string `json:"location,omitempty"`
	DaysAgo    string `json:"daysAgo,omitempty"`
	ImageUrl   string `json:"imageUrl,omitempty"`
	ImageColor string `json:"imageColor,omitempty"`
}

type SubscriptionListings struct {
	Subscription xata.SubscriptionRecord `json:"subscription,omitempty"`
	Listings     []xata.ListingRecord    `json:"listings,omitempty"`
}

type UserData struct {
	Name  string `json:"name"`
	State string `json:"state,omitempty"`
}
