> await new Promise((resolve) => setTimeout(resolve, 10000));

> admin user id: 'c1485d4a-0f38-4b11-bd06-7b428288dedd'

> Setting up s3
https://next-s3-upload.codingvalue.com/setup

> API changes
- [] add a new field `hash` to image entity and have max length of 100(even though actually needed is less than 25)
- [] always sort images to make the preview image as the first image (specially in the detail screen)
- [] vehicle description needs to be at least 1000 characters?
- [] make Trim as an optional field

> Web app todo list
- [] use use-mutation like function yourself instead of using react-query
- [] replace clsx with tailwind-merge+clsx: https://www.youtube.com/watch?v=re2JFITR7TI
- [] check max length of all strings in schema file
- [] invalidate notification after admin approves or rejects
- [] get vehicle brands and models from API


> Web app performance improvements
- [] separate out into different files in order to reduce the cost of imports
- [] enable bundle size library while doing so
- [] https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- [] add react memo throughout
- [] remove async from components if not needed



