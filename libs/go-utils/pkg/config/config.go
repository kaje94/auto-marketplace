package config

import (
	"log"
	"os"
	"strconv"
	"strings"
)

var Config = rootConfig{
	EnvName:              getEnvVariable("ENV_NAME"),
	WebAppUrl:            getEnvVariable("AUTH0_BASE_URL"),
	MaxUserListings:      getEnvIntVariable("MAX_USER_LISTINGS"),
	MaxUserSubscriptions: getEnvIntVariable("MAX_USER_SUBSCRIPTIONS"),
	AdminEmails:          getStrSliceEnvVariables("ADMIN_EMAILS"),
	Xata: xataConfig{
		ApiKey: getEnvVariable("XATA_API_KEY"),
		DbUrl:  getEnvVariable("XATA_DATABASE_URL"),
		Branch: getEnvVariable("XATA_BRANCH"),
	},
	Auth0: auth0Config{
		IssuerUrl:    getEnvVariable("AUTH0_ISSUER_BASE_URL"),
		ClientId:     getEnvVariable("AUTH0_API_CLIENT_ID"),
		ClientSecret: getEnvVariable("AUTH0_API_CLIENT_SECRET"),
		Domain:       getEnvVariable("AUTH0_DOMAIN"),
	},
	AWS: awsConfig{
		AccessKey:    getEnvVariable("AWS_ACCESS_KEY"),
		AccessSecret: getEnvVariable("AWS_ACCESS_SECRET"),
		S3BucketName: getEnvVariable("AWS_S3_BUCKET"),
		S3Region:     getEnvVariable("AWS_S3_REGION"),
	},
}

func getEnvVariable(key string) string {
	envVal := os.Getenv(key)
	if envVal == "" {
		log.Fatalf("env for %s is required", key)
	}
	return envVal
}

func getOptionalEnvVariable(key string) string {
	return os.Getenv(key)
}

func getStrSliceEnvVariables(key string) []string {
	val := os.Getenv(key)
	if val == "" {
		return []string{}
	}
	return strings.Split(val, ",")
}

func getEnvIntVariable(key string) int {
	envVal := os.Getenv(key)
	if envVal == "" {
		log.Fatalf("env for %s is required", key)
	}
	envValInt, err := strconv.Atoi((envVal))
	if err != nil {
		log.Fatalf("failed to parse %s into an int", key)

	}
	return envValInt
}
