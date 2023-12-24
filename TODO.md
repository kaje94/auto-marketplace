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
-   [] go through all the loading screens and make sure that the parents have animate pulse class
-   [] refer create t3 structure and eslint
-   [] add watermark to uploaded image
-   [] use links instead of router push ?
-   [] fix chrome third party cookies blocked warning
-   [] update displayname and signature in zoho mail
-   [] fix meta tags in all pages
-   [] when selecting range, need to validate
-   [] make sure meta tags are from layouts
-   [] update all docs about how featured adverts work
-   [] get consent from footer above
-   [] move all links to command util function
-   [] renew button should be next to 'Advert will expire on January 2, 2024' alert
-   [] remove warning: app-index.js:32 Warning: Removing a style property during rerender (backgroundSize) when a conflicting property is set (background) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values
-   [] fix token not refreshing
-   [] have `rm public/robots.prod.txt` and `mv public/robots.prod.txt public/robots.txt` to npm scripts
-   [] show view counter in listings (for owner and admins)

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




> Update next 14
-   https://nextjs.org/blog/next-14
-   https://nextjs.org/blog/security-nextjs-server-components-actions
-   https://www.google.com/search?q=useOptimistic+nextjs&sca_esv=577069831&sxsrf=AM9HkKl0JJWRR2DdtSSLbVHT4AmJA5u_aw%3A1698382865056&ei=EUQ7ZbyLA_XCkPIPyYSlwAI&ved=0ahUKEwj81_SauZWCAxV1IUQIHUlCCSgQ4dUDCBA&uact=5&oq=useOptimistic+nextjs&gs_lp=Egxnd3Mtd2l6LXNlcnAiFHVzZU9wdGltaXN0aWMgbmV4dGpzMgUQABiABDIIEAAYFhgeGAoyCBAAGBYYHhgKSMgNUMACWL8McAF4AZABAJgB7AKgAeQNqgEDMy01uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICChAAGIoFGLADGEPCAgcQABiABBgKwgIGEAAYHhgKwgIIEAAYBRgeGAriAwQYACBBiAYBkAYK&sclient=gws-wiz-serp
-   https://www.google.com/search?q=useformstate+nextjs&sca_esv=577069831&sxsrf=AM9HkKlXzXTdtiS0i24ryrvOEp6sfjRWpw%3A1698382869133&ei=FUQ7ZcvkB9_AkPIP6__W6Qo&oq=useFormState+ne&gs_lp=Egxnd3Mtd2l6LXNlcnAiD3VzZUZvcm1TdGF0ZSBuZSoCCAAyBRAAGIAESOczUOoEWJEHcAF4AZABAJgB6gKgAakIqgEDMy0zuAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICChAAGIoFGLADGEPCAgoQABiABBgUGIcCwgIHEAAYigUYQ8ICBhAAGBYYHuIDBBgAIEGIBgGQBgk&sclient=gws-wiz-serp
-   https://www.google.com/search?q=useFormStatus+nextjs&sca_esv=577069831&sxsrf=AM9HkKkgd25RRusBkihkQcRbdAx9pu63Sw%3A1698382873110&ei=GUQ7ZbWwBpfvkPIP8q6OyAk&ved=0ahUKEwj1oOCeuZWCAxWXN0QIHXKXA5kQ4dUDCBA&uact=5&oq=useFormStatus+nextjs&gs_lp=Egxnd3Mtd2l6LXNlcnAiFHVzZUZvcm1TdGF0dXMgbmV4dGpzMgcQABiABBgKMggQABgWGB4YCkjAFlC0AVjHC3ABeAGQAQCYAYUDoAH6E6oBAzMtN7gBA8gBAPgBAcICChAAGEcY1gQYsAPCAgoQABiKBRiwAxhDwgIFEAAYgATiAwQYACBBiAYBkAYJ&sclient=gws-wiz-serp
-   https://nextjs.org/docs/app/api-reference/functions/generate-viewport
-   https://nextjs.org/docs/app/api-reference/functions/unstable_cache


> Update auth welcome text to one of the following
Select your preferred login method to access Targabay
Choose your login method to access Targabay
Select how you want to log in to Targabay.


> Analytics
https://posthog.com/
https://plausible.io/#pricing