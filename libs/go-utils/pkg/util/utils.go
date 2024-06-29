package util

import (
	"common/pkg/xata"
	"fmt"
	"strconv"
	"strings"
)

func SanitizeEmail(email string) string {
	return strings.ReplaceAll(strings.ReplaceAll(email, "@", ":a"), ".", ":d")
}

func DeSanitizeEmail(email string) string {
	return strings.ReplaceAll(strings.ReplaceAll(email, ":a", "@"), ":d", ".")
}

func GetUserEmailFromListingRec(listingRecord xata.ListingRecord) string {
	return DeSanitizeEmail(listingRecord.User.(map[string]interface{})["id"].(string))
}

func GetListingTitleFromRec(listingRec xata.ListingRecord) string {
	if listingRec.Trim != "" {
		return fmt.Sprintf("%s %s %s %s", listingRec.Brand, listingRec.Model, listingRec.Trim, strconv.Itoa(listingRec.YearOfManufacture))
	} else {
		return fmt.Sprintf("%s %s %s", listingRec.Brand, listingRec.Model, strconv.Itoa(listingRec.YearOfManufacture))
	}
}
