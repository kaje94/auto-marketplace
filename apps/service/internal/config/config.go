package config

import (
	"log"
	"os"
)

var Config = rootConfig{
	Port: 50051,
	Xata: xataConfig{
		ApiKey: getEnvVariable("XATA_API_KEY"),
		DbUrl:  getEnvVariable("XATA_DATABASE_URL"),
		Branch: getEnvVariable("XATA_BRANCH"),
	},
	Auth0: auth0Config{
		IssuerUrl:    getEnvVariable("AUTH0_ISSUER_BASE_URL"),
		Audience:     getEnvVariable("AUTH0_AUDIENCE"),
		ClientId:     getEnvVariable("AUTH0_API_CLIENT_ID"),
		ClientSecret: getEnvVariable("AUTH0_API_CLIENT_SECRET"),
		Domain:       getEnvVariable("AUTH0_DOMAIN"),
	},
	S3: s3Config{
		Key:    getEnvVariable("S3_KEY"),
		Secret: getEnvVariable("S3_SECRET"),
		Bucket: getEnvVariable("S3_BUCKET"),
		Region: getEnvVariable("S3_REGION"),
	},
}

func getEnvVariable(key string) string {
	envVal := os.Getenv(key)
	if envVal == "" {
		log.Fatalf("env for %s is required", key)
	}
	return envVal
}
