package main

import (
	"fmt"
	"log"
	"os"
	"subscriptions/internal"
	"time"
)

const (
	Daily             = "Daily"
	Weekly            = "Weekly"
	OnceEveryTwoWeeks = "OnceEveryTwoWeeks"
	Monthly           = "Monthly"
)

func main() {
	if len(os.Args) < 2 || (os.Args[1] != Daily && os.Args[1] != Weekly && os.Args[1] != OnceEveryTwoWeeks && os.Args[1] != Monthly) {
		log.Fatalln(fmt.Printf(`Ar argument of %s,%s,%s or %s needs to be passed`, Daily, Weekly, OnceEveryTwoWeeks, Monthly))
	}
	arg := os.Args[1]

	subscriptions := internal.GetSubscriptions(arg)

	if len(subscriptions) > 0 {
		geTime := time.Now()

		if arg == Daily {
			geTime = time.Now().AddDate(0, 0, -2)
		} else if arg == Weekly {
			geTime = time.Now().AddDate(0, 0, -8)
		} else if arg == OnceEveryTwoWeeks {
			geTime = time.Now().AddDate(0, 0, -15)
		} else if arg == Monthly {
			geTime = time.Now().AddDate(0, -1, 0)
		}

		// Get listings recently added
		newListings := internal.GetNewListings(geTime)
		if len(newListings) > 0 {
			// Map new listings with subscriptions
			userListingsMap := internal.GenUserListingsMap(subscriptions, newListings)
			if len(userListingsMap) > 0 {
				// Get user details for the subscriptions
				userNames := internal.GetUserNames(userListingsMap)
				// Filter in the listings matching location states
				userListingsMapFiltered := internal.FilterByUserState(userListingsMap, userNames)
				if len(userListingsMapFiltered) > 0 {
					// Get top 5 listings recently added
					userListingsMapFiltered := internal.GetTopListings(userListingsMapFiltered)
					// Send email notifications to the user
					internal.SendEmails(userListingsMapFiltered, userNames)
					// Create notification records in the database
					internal.CreateNotifications(userListingsMapFiltered)
				}
			}
		}
	}
}
