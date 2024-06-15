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
