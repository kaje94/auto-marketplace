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

Check for incomplete profile even in subscription form

getting started
1. install protoc


service structure
- internal
- - config
- - api
- - middleware
- - auth
- - handlers
- - core common models of the org
- - grpc
- - - server server config


IMPORTAANT!
have a tsconfig.base.json and add 
paths:{
    "@targabay/product-list":["libs/products/src/index"]
}


Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.
  {: {items: [...]}}

  Warning: Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.
  <... isOwner={true} listingItem={{id: ..., status: ..., expiryDate: ..., createdAt: ..., reviewComment: ..., data: ..., user: ...}}>