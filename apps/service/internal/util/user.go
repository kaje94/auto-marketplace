package util

import (
	"fmt"
	"targabay/service/pkg/xata"
)

func GetUserRecord(userEmail string) (xata.UserRecord, error) {
	userRecord := xata.UserRecord{}
	if err := Xata.Call("GET", fmt.Sprintf("%s/%s", xata.UserData, SanitizeEmail(userEmail)), nil, &userRecord); err != nil {
		return xata.UserRecord{}, err
	}
	return userRecord, nil
}
