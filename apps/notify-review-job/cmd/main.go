package main

import (
	"common/pkg/config"
	"notify-review/internal"
)

func main() {
	listingCount := internal.GetUnderReviewListingCount()

	if listingCount > 0 && len(config.Config.AdminEmails) > 0 {
		internal.SendEmail(listingCount)
	}
}
