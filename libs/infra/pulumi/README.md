install https://www.pulumi.com/docs/install/

for Auth0
- Create new tenent
- Create machine-to-machine client
- configure tenent domain, client-id and client-secret
--  `pulumi config set auth0:domain XXXXXXXXXXXXXX`
--  `pulumi config set auth0:client_id YYYYYYYYYYYYYY --secret`
--  `pulumi config set auth0:client_secret ZZZZZZZZZZZZZZ --secret`
- run `pulumi up`
