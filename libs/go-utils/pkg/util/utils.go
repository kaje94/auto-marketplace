package util

import (
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"
	service_pb "targabay/protos"
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

func TransformStrToListingImages(imgStr string) ([]*service_pb.ListingItem_Data_Image, error) {
	listingImages := make([]*service_pb.ListingItem_Data_Image, 0)
	if err := json.Unmarshal([]byte(imgStr), &listingImages); err != nil {
		return nil, err
	}

	sort.SliceStable(listingImages, func(i, j int) bool {
		return listingImages[i].IsThumbnail
	})

	return listingImages, nil
}
