## Pulumi infrastructure

Setup Auth0 & AWS related resources needed to run Targabay.

1. Install [Pulumi](https://www.pulumi.com/docs/install/)
2. Change directory into `libs/pulumi`

```
cd libs/pulumi
```

3. Allow direnv to read the .env file within the directory

```
direnv allow
```

4. Create a `.env` file similar to `.env.example`
5. Create a new tenant in Auth0.
6. Create a machine-to-machine client with all permissions within that tenant
7. Copy over the auth0 domain, client_id and client secret into .env file or set them via `pulumi config set ...`
8. Create an administrative user or user with permissions to manage S3, IAM and SES resources and copy over the access key and secret into the .env file or set them via `pulumi config set ...`
9. (Optional) Google auth client id and secret needed for Auth0 Login and update the .env file
10. To create the resources via Pulumi

```
pnpm deploy
# or
pulumi up
```

11. Once the resources are created, you will need to head over to aws IAM and Auth0 to retrieve the secrets and access keys needed to run Targabay.
12. Assign `Administrator` role for your user via Auth0 console UI.
13. (Optional) Configure Imagekit with the S3. Head over to AWS IAM to create access key and secret for the Imagekit user created. Use those credentials along with s3 bucket name to create an external storage in Imagekit.

### To modify the email templates

1. Start the development server for react email

```
pnpm email-dev
```

2. After updating the emails, to generate the new templates

```
pnpm email-export-html && pnpm email-export-text
```

3. Upload the templates to SES

```
pnpm deploy
# or
pulumi up
```
