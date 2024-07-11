/* eslint-disable max-lines */
import * as auth0 from "@pulumi/auth0";
import * as aws from "@pulumi/aws";
import { Template } from "@pulumi/aws/ses";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import { z } from "zod";

const envSchema = z.object({
    ENV_NAME: z.string().optional().default("dev"),
    AUTH0_DOMAIN: z.string().min(1),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    WEBAPP_URLS: z.string().min(1),
    GOOGLE_AUTH_CLIENT_ID: z.string().optional(),
    GOOGLE_AUTH_CLIENT_SECRET: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
});

const env = envSchema.parse({
    ENV_NAME: process.env.ENV_NAME,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    WEBAPP_URLS: process.env.WEBAPP_URLS,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
});

const webAppUrls = env.WEBAPP_URLS.split(",").map((item) => item.trim());

const apiClient = new auth0.Client("targabay-api-client", {
    name: "Targabay-API",
    appType: "non_interactive",
});

new auth0.ClientCredentials("targabay-api-client-secret", {
    clientId: apiClient.clientId,
    authenticationMethod: "client_secret_post",
});

const webAppClient = new auth0.Client("targabay-webapp-client", {
    name: "Targabay-WebApp",
    appType: "regular_web",
    customLoginPageOn: true,
    callbacks: webAppUrls.map((item: string) => `${item}/api/auth/callback`),
    allowedLogoutUrls: webAppUrls,
    oidcConformant: true,
    refreshToken: {
        leeway: 3600,
        tokenLifetime: 31557600,
        rotationType: "rotating",
        expirationType: "expiring",
        infiniteTokenLifetime: false,
        infiniteIdleTokenLifetime: true,
        idleTokenLifetime: 2592000,
    },
    jwtConfiguration: { alg: "RS256", lifetimeInSeconds: 36000, secretEncoded: false },
    grantTypes: ["authorization_code", "implicit", "refresh_token", "client_credentials"],
});

const postLoginAction = new auth0.Action("post-login-action", {
    name: "post-login-action",
    code: `
        exports.onExecutePostLogin = async (event, api) => {
            if (event.authorization) {
                const isAdmin = event.authorization.roles.includes('Administrator')
                // Claim to enable admin functionality within the webapp
                api.idToken.setCustomClaim('isAdmin', isAdmin);
                // Claim to redirect & show the initial welcome/onboarding screen to new users
                api.idToken.setCustomClaim('new_user',event.stats.logins_count <= 1)
            }
        };
    `,
    deploy: true,
    supportedTriggers: { id: "post-login", version: "v3" },
});

new auth0.TriggerAction("post-login-action-trigger", { trigger: "post-login", actionId: postLoginAction.id });

new auth0.BrandingTheme("brandingThemeResource", {
    borders: {
        buttonBorderRadius: 8,
        buttonBorderWeight: 1,
        buttonsStyle: "rounded",
        inputBorderRadius: 3,
        inputBorderWeight: 1,
        inputsStyle: "rounded",
        showWidgetShadow: true,
        widgetBorderWeight: 0,
        widgetCornerRadius: 8,
    },
    colors: {
        primaryButton: "#18182F",
        primaryButtonLabel: "#ffffff",
        secondaryButtonBorder: "#c9cace",
        secondaryButtonLabel: "#1e212a",
        baseFocusColor: "#635dff",
        baseHoverColor: "#000000",
        linksFocusedComponents: "#635dff",
        header: "#18182F",
        icons: "#65676e",
        error: "#d03c38",
        success: "#13a688",
        inputBorder: "#c9cace",
        inputBackground: "#ffffff",
        bodyText: "#5c5e66",
        widgetBackground: "#ffffff",
        widgetBorder: "#c9cace",
        inputLabelsPlaceholders: "#65676e",
        inputFilledText: "#000000",
    },
    fonts: {
        bodyText: { bold: false, size: 87.5 },
        buttonsText: { bold: false, size: 100 },
        inputLabels: { bold: false, size: 100 },
        links: { bold: false, size: 87.5 },
        subtitle: { bold: false, size: 87.5 },
        title: { bold: false, size: 150 },
        fontUrl: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw0aXpsog.woff2",
        referenceTextSize: 16,
    },
    pageBackground: { backgroundColor: "#000033", backgroundImageUrl: "", pageLayout: "center" },
    widget: {
        headerTextAlignment: "center",
        logoHeight: 80,
        logoPosition: "center",
        logoUrl: "https://targabay.com/images/logo-transparent-bg-500x150.png",
        socialButtonsLayout: "bottom",
    },
    displayName: "targabay-theme",
});

new auth0.Role("admin-role", { name: "Administrator" });

if (env.GOOGLE_AUTH_CLIENT_ID && env.GOOGLE_AUTH_CLIENT_SECRET) {
    const googleOauth2 = new auth0.Connection("google_oauth2", {
        name: "Google-OAuth2-Connection",
        strategy: "google-oauth2",
        options: {
            clientId: env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
        },
    });

    new auth0.ConnectionClient("my_conn_client_assoc", {
        connectionId: googleOauth2.id,
        clientId: webAppClient.id,
    });
}

// S3

const bucket = new aws.s3.BucketV2("bucket", { bucket: `targabay-images-pulumi-${env.ENV_NAME}` });

const bucketOwnershipControls = new aws.s3.BucketOwnershipControls("ownership-controls", {
    bucket: bucket.id,
    rule: { objectOwnership: "BucketOwnerPreferred" },
});

const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
});

const bucketAclV2 = new aws.s3.BucketAclV2(
    "bucket-acl",
    { bucket: bucket.id, acl: "public-read" },
    { dependsOn: [bucketOwnershipControls, bucketPublicAccessBlock] },
);

new aws.s3.BucketCorsConfigurationV2(
    "bucket-cors",
    {
        bucket: bucket.bucket,
        corsRules: [
            {
                allowedHeaders: ["*"],
                allowedMethods: ["PUT", "POST"],
                allowedOrigins: ["*"],
                exposeHeaders: ["ETag"],
            },
        ],
    },
    { dependsOn: [bucketAclV2, bucketOwnershipControls, bucketPublicAccessBlock] },
);

new aws.s3.BucketPolicy("bucket-policy", {
    bucket: bucket.id,
    policy: pulumi.all([bucket.bucket]).apply(([bucketName]) =>
        JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "Statement1",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        }),
    ),
});

// SES
const emailTemplates: Template[] = [];

const listingApprovedTemplate = new aws.ses.Template("targabay-listing-approved-template", {
    name: `targabay-listing-approved-template-${env.ENV_NAME}`,
    subject: "Listing advert for {{listingTitle}} has been approved",
    html: fs.readFileSync("./out/html/targabay-listing-approved.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-listing-approved.txt", "utf8"),
});
emailTemplates.push(listingApprovedTemplate);

const listingExpiredTemplate = new aws.ses.Template("targabay-listing-expired-template", {
    name: `targabay-listing-expired-template-${env.ENV_NAME}`,
    subject: "Listing advert for {{listingTitle}} has been expired",
    html: fs.readFileSync("./out/html/targabay-listing-expired.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-listing-expired.txt", "utf8"),
});
emailTemplates.push(listingExpiredTemplate);

const listingRejectTemplate = new aws.ses.Template("targabay-listing-rejected-template", {
    name: `targabay-listing-rejected-template-${env.ENV_NAME}`,
    subject: "Listing advert for {{listingTitle}} has been rejected",
    html: fs.readFileSync("./out/html/targabay-listing-rejected.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-listing-rejected.txt", "utf8"),
});
emailTemplates.push(listingRejectTemplate);

const listingTakenDownTemplate = new aws.ses.Template("targabay-listing-taken-down-template", {
    name: `targabay-listing-taken-down-${env.ENV_NAME}`,
    subject: "Listing advert for {{listingTitle}} has been taken down",
    html: fs.readFileSync("./out/html/targabay-listing-taken-down.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-listing-taken-down.txt", "utf8"),
});
emailTemplates.push(listingTakenDownTemplate);

const listingToReviewTemplate = new aws.ses.Template("targabay-listing-to-review", {
    name: `targabay-listing-to-review-${env.ENV_NAME}`,
    subject: "{{ count }} new listings needs to be reviewed'",
    html: fs.readFileSync("./out/html/targabay-listing-to-review.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-listing-to-review.txt", "utf8"),
});
emailTemplates.push(listingToReviewTemplate);

const subscriptionTemplate = new aws.ses.Template("targabay-subscription-template", {
    name: `targabay-subscription-template-${env.ENV_NAME}`,
    subject: "New Listings Matching Your Subscription Preferences for '{{subscriptionName}}'",
    html: fs.readFileSync("./out/html/targabay-subscription-notification.html", "utf8"),
    text: fs.readFileSync("./out/text/targabay-subscription-notification.txt", "utf8"),
});
emailTemplates.push(subscriptionTemplate);

// IAM
const user = new aws.iam.User(`targabay-user`, { name: `targabay-user-${env.ENV_NAME}` });

new aws.iam.UserPolicy(`targabay-user-policy`, {
    user: user.name,
    policy: pulumi
        .all([bucket.bucket, pulumi.output(aws.getCallerIdentity({})).accountId, emailTemplates.map((item) => item.arn)])
        .apply(([bucketName, accountId, templates]) =>
            JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "STSToken",
                        Effect: "Allow",
                        Action: "sts:GetFederationToken",
                        Resource: [`arn:aws:sts::${accountId}:federated-user/S3UploadWebToken`],
                    },
                    {
                        Sid: "S3UploadAssets",
                        Effect: "Allow",
                        Action: "s3:*",
                        Resource: [`arn:aws:s3:::${bucketName}`, `arn:aws:s3:::${bucketName}/*.webp`],
                    },
                    {
                        Sid: "SesSendMail",
                        Effect: "Allow",
                        Action: ["ses:SendBulkTemplatedEmail", "ses:SendTemplatedEmail"],
                        Resource: [...templates, `arn:aws:ses:${env.AWS_REGION}:${accountId}:identity/targabay.com`],
                        Condition: {
                            StringEquals: {
                                "ses:FromAddress": "notifications@targabay.com",
                            },
                        },
                    },
                ],
            }),
        ),
});

const imageKitUser = new aws.iam.User(`imagekit-user`, { name: `imagekit-targabay-user-${env.ENV_NAME}` });

new aws.iam.UserPolicy(`imagekit-user-policy`, {
    user: imageKitUser.name,
    policy: pulumi.all([bucket.bucket]).apply(([bucketName]) =>
        JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "ImagekitReadTargabayS3",
                    Effect: "Allow",
                    Action: "s3:GetObject",
                    Resource: [`arn:aws:s3:::${bucketName}`, `arn:aws:s3:::${bucketName}/*`],
                },
            ],
        }),
    ),
});

// Auth0 export
export const AUTH0_ISSUER_BASE_URL = pulumi.interpolate`https://${env.AUTH0_DOMAIN}`;
export const AUTH0_DOMAIN = env.AUTH0_DOMAIN;
export const AUTH0_API_CLIENT_ID = apiClient.clientId;
export const AUTH0_API_CLIENT_SECRET = "<Retrieve from Auth0 console>";
export const AUTH0_SECRET = "<long random value>";
export const AUTH0_BASE_URL = "<http://localhost:3000 or webapp URL>";
export const AUTH0_CLIENT_ID = webAppClient.clientId;
export const AUTH0_CLIENT_SECRET = "<Retrieve from Auth0 console>";
export const AUTH0_SCOPE = "openid profile email offline_access";
// S3 export
export const AWS_S3_BUCKET = bucket.bucket;
export const AWS_S3_REGION = bucket.region;
// IAM exports
export const AWS_ACCESS_USER_NAME = pulumi.interpolate`Generate key for user ${user.name} in AWS console`;
export const AWS_ACCESS_SECRET = pulumi.interpolate`Generate secret for user ${user.name} in AWS console`;
export const IMAGE_KIT_USER = pulumi.interpolate`Generate credentials for user ${imageKitUser.name} in AWS console`;
// SES exports
export const EMAIL_TEMPLATES = emailTemplates.map((item) => item.arn);
