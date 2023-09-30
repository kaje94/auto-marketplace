> await new Promise((resolve) => setTimeout(resolve, 10000));

> admin user id: 'c1485d4a-0f38-4b11-bd06-7b428288dedd'

> Setting up s3
> https://next-s3-upload.codingvalue.com/setup

> API changes

-   [] add a new field `hash` to image entity and have max length of 100(even though actually needed is less than 25)
-   [] always sort images to make the preview image as the first image (specially in the detail screen)
-   [] vehicle description needs to be at least 1000 characters?
-   [] make Trim as an optional field

> Web app todo list

-   [] check max length of all strings in schema file
-   [] get vehicle brands and models from API
-   [] add clearable prop to form elements
-   [] check if we can have only one provider for searching
-   [] brand and models needs to come from API
-   [] try out the date picker package for year select
-   [] contact us section
-   [] view more adverts button in featured adverts
-   [] fix Entire page /search deopted into client-side rendering.

-   [] fix hydration ui issues in dashboard listing ui items
-   [] report button showing for user who created the advert
-   [] reduce input loading opacity
-   [] checkbox not visible
-   [] fix scroll when page change (always top)
-   [] fix picture in image listing
-   [] move user details above specification in user details
-   [] show safety tips similar to ikman under item details description
-   [] subscription create failing
-   [] modal footer make opacity 1
-   [] phone number click to call in advert details

> Need to verify
-   [] loading bug when changing query (while loading type something) (Added a possible fix)

> Web app performance improvements

-   [] separate out into different files in order to reduce the cost of imports
-   [] enable bundle size library while doing so
-   [] https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
-   [] add react memo throughout
-   [] remove async from components if not needed
-   [] contact us section?
-   [] make auth0 run fully on edge


//
UserDto(
    string UserId,
    string FirstName,
    string LastName,
    string FullName,
    string Picture,
    bool IsDealership,
    Address Address,
    string UserName,
    string Email,
    bool EmailConfirmed,
    string Phone,
    bool PhoneConfirmed);
)