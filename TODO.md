> await new Promise((resolve) => setTimeout(resolve, 10000));


> Setting up s3
> https://next-s3-upload.codingvalue.com/setup

> API changes
-   [] always sort images to make the preview image as the first image (specially in the detail screen)
-   [] bot detection in auth0 enabled(recaptcha)
-   [] check max length of all strings in schema file
-   [] an api for contact us form (name, email, subject & message)
-   [] contact us email should be moved to api layer

> Web app todo list
-   [] renew button should be next to 'Advert will expire on January 2, 2024' alert
-   [] implement make featured listing feature
-   [] show view counter in listings (for owner and admins)
-   [] go through all the loading screens and make sure that the parents have animate pulse class
-   [] refer create t3 structure and eslint
-   [] use links instead of router push ?
-   [] fix chrome third party cookies blocked warning
-   [] update displayname and signature in zoho mail
-   [] fix meta tags in all pages
-   [] make sure meta tags are from layouts
-   [] get consent from footer above
-   [] remove warning: app-index.js:32 Warning: Removing a style property during rerender (backgroundSize) when a conflicting property is set (background) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values
-   [] fix token not refreshing

> After deploy
-   [] Add sentry
-   [] Add monitors
-   [] minify manifest after changes!

> optional tod list
-   [] add pwa?
-   [] update manifest https://web.dev/articles/add-manifest
-   [] show counter in textarea listing create
-   [] lazily load calender and combobox?
-   [] laziliy load filters?
-   [] lazily load landing searchbar?

> Web app performance improvements

-   [] separate out into different files in order to reduce the cost of imports
-   [] enable bundle size library while doing so
-   [] https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
-   [] add react memo throughout
-   [] remove async from components if not needed

> SEO Todo list
-   [] https://webmasters.stackexchange.com/questions/104987/how-to-change-which-image-from-website-is-shown-in-google-search-result




> Update auth welcome text to one of the following
Select your preferred login method to access Targabay
Choose your login method to access Targabay
Select how you want to log in to Targabay.


> Analytics
https://posthog.com/
https://plausible.io/#pricing