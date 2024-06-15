rename auto-store-client as targabay
validate e2e-test envs, fix e2e test
add renovate
add trivy checks or alternative
Add back sitemap.ts
fix sentry error by loading it using webworker & add it back
show a warning if user is in a different country specially in the my listings page
when viewing posted listing details, if not posted, show meaningful error
add readiness/liveness probes and set max memory requests and limits
Check for incomplete profile even in subscription form


crons
subscription check
delete old one
scrap and create

IMPORTAANT!
have a tsconfig.base.json and add 
paths:{
    "@targabay/product-list":["libs/products/src/index"]
}


//
Update readme and go through all code