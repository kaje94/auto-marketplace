package auth

import (
	"context"
	"fmt"
	"targabay/service/internal/config"

	"github.com/auth0/go-auth0/authentication"
)

func ValidateAuth0Token(ctx context.Context, token string) (user User, err error) {
	authAPI, err := authentication.New(
		ctx,
		config.Config.Auth0.IssuerUrl,
		authentication.WithClientID(config.Config.Auth0.ClientId),
	)
	if err != nil {
		return User{}, fmt.Errorf("failed to generate auth0 client")
	}

	userInfo, err := authAPI.UserInfo(ctx, token) // TODO: Cache the response for 5 minutes
	if err != nil {
		return User{}, fmt.Errorf("failed to get user information")
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
