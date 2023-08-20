- [ ] mjs instead of js for root configs
// await new Promise((resolve) => setTimeout(resolve, 10000));

// setting up s3
https://next-s3-upload.codingvalue.com/setup

// API changes
rename image `color` as `hash` and have max length of 100(even though actually needed is less than 25)
createdAt field is missing in listing response
milage needs a measurement unit
decide which lists to take to backend
vehicle description needs to be at least 1000 characters
filter for start end dates in dashboard listing is not working

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
