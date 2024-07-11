package config

type xataConfig struct {
	ApiKey string
	DbUrl  string
	Branch string
}

type auth0Config struct {
	IssuerUrl    string
	ClientId     string
	ClientSecret string
	Domain       string
}

type awsConfig struct {
	AccessKey    string
	AccessSecret string
	S3BucketName string
	S3Region     string
}

type rootConfig struct {
	EnvName              string
	MaxUserListings      int
	MaxUserSubscriptions int
	AdminEmails          []string
	WebAppUrl            string
	Xata                 xataConfig
	Auth0                auth0Config
	AWS                  awsConfig
}
