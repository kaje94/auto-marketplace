package main

import (
	"expire-listings/internal"
)

func main() {
	// Get listings that should be marked as expired
	expiredListings := internal.GetExpiredListings()

	if len(expiredListings) > 0 {
		// Update the listing status as expired
		internal.UpdateListingStatus(expiredListings)

		// Get the users who should be notified
		userNames := internal.GetUserNames(expiredListings)

		// Send email notifications to those users
		internal.SendEmails(expiredListings, userNames)

		// Create a notification record in the database
		internal.CreateNotifications(expiredListings)
	}
}
