rename auto-store-client as targabay
validate e2e-test envs, fix e2e test
add renovate
add trivy checks or alternative
Add back sitemap.ts
fix sentry error by loading it using webworker & add it back
show a warning if user is in a different country specially in the my listings page
when viewing posted listing details, if not posted, show meaningful error
add readiness/liveness probes and set max memory requests and limits

emails
listing taken down - maybe
listing expire
subscriptions

crons
subscription check
delete old one

separate repo
crawl/scrap and create

IMPORTAANT!
have a tsconfig.base.json and add 
paths:{
    "@targabay/product-list":["libs/products/src/index"]
}


//
Update readme and go through all code

//
add limits to listing create and subscriptions