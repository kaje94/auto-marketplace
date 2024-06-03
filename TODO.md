delete vercel.json
rename auto-store-client as targabay
todo move .env to root level
validate e2e-test envs
add renovate
add trivy checks or alternative
remove client stuff within email mgr
make countries & ctry lowercase
move email templates to libs, dont need seperate service
open graph image showing root level image. also check into opengraph image templates
Add back sitemap.ts
fix sentry error by loading it using webworker & add it back
show a warning if user is in a different country specially in the my listings page
use handles instead of id for listing details
when viewing posted listing details, if not posted, show meaningful error
avoid complex metadata generation
add readiness/liveness probes and set max memory requests and limits
Check for incomplete profile even in subscription form


IMPORTAANT!
have a tsconfig.base.json and add 
paths:{
    "@targabay/product-list":["libs/products/src/index"]
}


