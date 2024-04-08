package config

type xataConfig struct {
	ApiKey string
	DbUrl  string
	Branch string
}

type auth0Config struct {
	IssuerUrl    string
	Audience     string
	ClientId     string
	ClientSecret string
	Domain       string
}

type s3Config struct {
	Key    string
	Secret string
	Bucket string
	Region string
}

type rootConfig struct {
	Port  int32
	Xata  xataConfig
	Auth0 auth0Config
	S3    s3Config
}
