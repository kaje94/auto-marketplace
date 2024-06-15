Auth0
0.Install Pulumi[https://www.pulumi.com/docs/install/]
1.cd into libs/infra/pulumi
1.Run `direnv allow`
1.Create a tenant in Auth0
2.Create machine-to-machine application with all permissions
3.Update the .env file with following values
```
AUTH0_DOMAIN="<tenant-name>.eu.auth0.com"
AUTH0_CLIENT_ID="<client-id>"
AUTH0_CLIENT_SECRET="<client-secret>"
```
4.Run `pulumi up`

after Auth0 creation, set your user role as Administrator in Auth0 UI
also modify connections if needed

// applications


// create a client
// create user & group


AWS