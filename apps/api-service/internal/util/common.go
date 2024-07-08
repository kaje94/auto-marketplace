package util

import (
	"common/pkg/config"
	"common/pkg/xata"
	"context"
	"targabay/service/internal/auth"
)

var Xata = xata.NewXataClient(config.Config.Xata.ApiKey, config.Config.Xata.DbUrl, config.Config.Xata.Branch)

func GetUserContext(ctx context.Context) auth.User {
	return ctx.Value(auth.CtxUser).(auth.User)
}
