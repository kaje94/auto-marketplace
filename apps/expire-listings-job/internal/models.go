package internal

type EmailTemplateContent struct {
	UserName     string `json:"userName"`
	ListingTitle string `json:"listingTitle,omitempty"`
	ListingUrl   string `json:"listingUrl,omitempty"`
}
