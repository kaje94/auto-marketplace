import * as auth0 from "@pulumi/auth0";
import { domain } from "@pulumi/auth0/config";
// import * as pulumi from "@pulumi/pulumi";

const client = new auth0.Client("client1c", {
    name:"client-somename2",
    allowedLogoutUrls: ["https://www.example.com/logout"],
    allowedOrigins: ["https://www.example.com"],
    callbacks: ["https://example.com/auth/callback"],
    appType: "regular_web",
    jwtConfiguration: {
        alg: "RS256"
    },

})

export const deployerClientId = client.clientId
export const auth0Domain = domain
