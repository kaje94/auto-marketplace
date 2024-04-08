package util

import (
	"context"
	"strings"
	"targabay/service/internal/auth"
	"targabay/service/internal/config"
	"targabay/service/pkg/xata"
)

var Xata = xata.NewXataClient(config.Config.Xata.ApiKey, config.Config.Xata.DbUrl, config.Config.Xata.Branch)

func GetUserContext(ctx context.Context) auth.User {
	return ctx.Value(auth.CtxUser).(auth.User)
}

func SanitizeEmail(email string) string {
	return strings.ReplaceAll(strings.ReplaceAll(email, "@", ":a"), ".", ":d")
}

func DeSanitizeEmail(email string) string {
	return strings.ReplaceAll(strings.ReplaceAll(email, ":a", "@"), ":d", ".")
}
