package util

import (
	"common/pkg/util"
	"common/pkg/xata"
	"fmt"
)

func GetUserRecord(userEmail string) (xata.UserRecord, error) {
	userRecord := xata.UserRecord{}
	if err := Xata.Call("GET", fmt.Sprintf("%s/%s", xata.UserData, util.SanitizeEmail(userEmail)), nil, &userRecord); err != nil {
		return xata.UserRecord{}, err
	}
	return userRecord, nil
}
