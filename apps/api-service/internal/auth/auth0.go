package auth

import (
	"common/pkg/config"
	"context"
	"fmt"
	"time"

	"github.com/auth0/go-auth0/authentication"
	"github.com/patrickmn/go-cache"
)

var c = cache.New(15*time.Minute, 30*time.Minute)

func ValidateAuth0Token(ctx context.Context, token string) (user User, err error) {
	authAPI, err := authentication.New(
		ctx,
		config.Config.Auth0.IssuerUrl,
		authentication.WithClientID(config.Config.Auth0.ClientId),
	)
	if err != nil {
		return User{}, fmt.Errorf("failed to generate auth0 client")
	}

	var userInfo *authentication.UserInfoResponse

	if x, found := c.Get(token); found {
		userInfo = x.(*authentication.UserInfoResponse)
	} else {
		userInfo, err = authAPI.UserInfo(ctx, token)
		if err != nil {
			return User{}, fmt.Errorf("failed to get user information")
		}
		c.Set(token, userInfo, cache.DefaultExpiration)
	}

	user = User{
		Email:   userInfo.Email,
		IsAdmin: userInfo.AdditionalClaims["isAdmin"].(bool),
		Name:    userInfo.Name,
		Picture: userInfo.Picture,
		Id:      userInfo.Sub,
	}

	return user, nil
}
