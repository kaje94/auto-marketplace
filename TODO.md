> await new Promise((resolve) => setTimeout(resolve, 10000));

> admin user id: 'c1485d4a-0f38-4b11-bd06-7b428288dedd'

> Setting up s3
> https://next-s3-upload.codingvalue.com/setup

> API changes
-   [] add a new field `hash` to image entity and have max length of 100(even though actually needed is less than 25)
-   [] always sort images to make the preview image as the first image (specially in the detail screen)
-   [] vehicle description needs to be at least 1000 characters?
// new!
-   [] only return name for city api call, only return name and state code for state api call, remove id from country list & detail api call
-   [] is lease field really necessary?
-   [] vehicle brands have duplicate values
-   [] return empty array instead of 404 if no cities or states found
-   [] state city sql query should also use like instead of ==
-   [] featured listing needs a country path param
-   [] user phone and address null in listing details response

> Web app todo list

-   [] check max length of all strings in schema file
-   [] add clearable prop to form elements
-   [] check if we can have only one provider for searching
-   [] brand needs to come from API
-   [] try out the date picker package for year select
-   [] fix Entire page /search deopted into client-side rendering.
-   [] move user details above specification in user details
-   [] show safety tips similar to ikman under item details description
-   [] add web3 forms or similar to contact us
-   [] go through all the loading screens and make sure that the parents have animate pulse class
-   [] avoid session?.user?.sub!
-   [] verify how emtpy, unauthorized and error component redirects & links work
-   [] refer create t3 structure and eslint
-   [] add watermark to uploaded image
-   [] frequently going fowrard and backward in search screen triggers loading bug
-   [] having debouncer in search inputs in search screen causes issues when page load during typing
-   [] show expiry date in listings throughout. specially when renewing listings
-   [] handle when visting posted listing from different country
-   [] review all dynamic usage and try to use it at higher levels that in lower level

> Need to verify
-   [] loading bug when changing query (while loading type something) (Added a possible fix)
-   [] fix scroll when page change (always top)

> Web app performance improvements

-   [] separate out into different files in order to reduce the cost of imports
-   [] enable bundle size library while doing so
-   [] https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
-   [] add react memo throughout
-   [] remove async from components if not needed
-   [] contact us section?
-   [] make auth0 run fully on edge

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

