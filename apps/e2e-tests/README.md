# End-to-End Tests

This directory contains end-to-end tests for the project using [Playwright](https://playwright.dev/).

### Requirements
- Generate a test admin user credentials in Auth0 and provide following as env variables
```
TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=
```

### How to run
```
pnpm test:e2e
or
pnpm test:e2e:ui
```

## Listings

### 1.1 Login

_Ensure that the user can log in successfully._

### 1.2 Cleanup Existing Listings

_Remove any existing listings to start with a clean slate._

### 1.3 Create a New Listing

_Test the process of creating a new listing._

### 1.4 Verify Dashboard Listing Details Page

_Check if the details page of a listing in the dashboard displays the correct information._

### 1.5 Approve New Listing

_Verify that a newly created listing can be successfully approved._

### 1.6 View Posted Listing Details Page

_Ensure that the details page of a posted listing is accessible and displays the correct information._

### 1.7 View and Filter My List

_Check if the user can view and filter their own listings._

### 1.8 View and Filter All List

_Check if the user can view and filter all listings._

### 1.9 Revalidate Posted Listing List Cache

_Ensure that the cache for posted listings is revalidated successfully._

### 1.10 Search & View Newly Posted Listing

_Test the search functionality for newly posted listings._

### 1.11 View Related Adverts

_Verify that related adverts are displayed when viewing a listing._

### 1.12 Update & Delete Listing

_Test the process of updating and deleting a listing._

## Subscriptions

### 2.1 Login

_Ensure that the user can log in successfully._

### 2.2 Cleanup My Existing Subscriptions

_Remove any existing subscriptions to start with a clean slate._

### 2.3 Create a New Subscription

_Test the process of creating a new subscription._

### 2.4 Verify Created Subscription

_Check if the newly created subscription is displayed correctly._

### 2.5 Visible in My List with Filters

_Verify that the subscription is visible in the user's list with applied filters._

### 2.6 Visible in All List with Filters

_Verify that the subscription is visible in the overall list with applied filters._

### 2.7 Update Subscription

_Test the process of updating a subscription._

### 2.8 Activate and Deactivate Subscription

_Verify that a subscription can be successfully activated and deactivated._

### 2.9 Delete Subscription

_Test the process of deleting a subscription._

## Profile

### 3.1 Login

_Ensure that the user can log in successfully._

### 3.2 Update Profile

_Test the process of updating user profile information._

### 3.3 Verify Updated Profile

_Check if the updated profile information is displayed correctly._

## TODO

### Mark Advert as a Featured Advert

_Implement and test the functionality to mark an advert as a featured advert._

### Renew Listing

_Implement and test the functionality to renew a listing._

### Reject Newly Created Advert

_Implement and test the functionality to reject a newly created advert._

### Unlist and Relist Adverts

_Implement and test the functionality to unlist and relist adverts._

### Notification View

_Implement and test the functionality to view notifications._
