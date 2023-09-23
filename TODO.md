- [ ] mjs instead of js for root configs
// await new Promise((resolve) => setTimeout(resolve, 10000));
// admin user id: 'c1485d4a-0f38-4b11-bd06-7b428288dedd'

// setting up s3
https://next-s3-upload.codingvalue.com/setup

// API changes
rename image `color` as `hash` and have max length of 100(even though actually needed is less than 25)
vehicle description needs to be at least 1000 characters

//
Add a plus button when no ads created by user
remove @formkit/auto-animate, fast-average-color package
my listings should have 3 buttons edit, delete, unlist(modal with 3 buttons(temp unlist, permanent unlist, sold))
in item detail view, break price into two different boxes(price and location)
in create form, default image could have a border and click on entire image to mark it as default. can also have a text under images label explaining this
add asterisk in form if its a required field
show error or something when create adverts fails
use type Props = PropTypeImage | PropTypeLoading pattern whenever loading is done or group all non loading related ones as seperate prop
add react memo for all components after everything!
use daisyui Indicators instead of badges in my ads maybe
use use-mutation like function yourself instead of using react-query
replace clsx with tailwind-merge+clsx: https://www.youtube.com/watch?v=re2JFITR7TI
check max length of all strings in schema file
remove async from components if not needed
add react memo throughout
if expired or temporary unlisted, then can renew
notifications changes
invalidate notification after admin approves or rejects
refactor layout,page,error component export formats
search all awaits and check to see if you can call in parallel

// performance
// separate out into different files in order to reduce the cost of imports
// enable bundle size library while doing so
// https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading

// api informed
when toggling subscriptions off, why do we need an expiry date
related listings min 5, max maybe 10
Active search field in all subscription listing is not working (works fine in my subscription list)
filter for start end dates in dashboard listing is not working
milage needs a measurement unit