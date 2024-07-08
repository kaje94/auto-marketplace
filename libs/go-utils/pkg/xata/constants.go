package xata

import "fmt"

const ListingsTableName = "listings"
const UsersTableName = "users"
const ReportsTableName = "reports"
const SubscriptionsTableName = "subscriptions"
const NotificationsTableName = "notifications"
const LocationsTableName = "locations"

var ListingData = fmt.Sprintf("/tables/%s/data", ListingsTableName)
var ListingQuery = fmt.Sprintf("/tables/%s/query", ListingsTableName)
var ListingSearch = fmt.Sprintf("/tables/%s/search", ListingsTableName)
var ListingAggregate = fmt.Sprintf("/tables/%s/aggregate", ListingsTableName)
var ListingVectorSearch = fmt.Sprintf("/tables/%s/vectorSearch", ListingsTableName)
var ListingSummarize = fmt.Sprintf("/tables/%s/summarize", ListingsTableName)
var UserData = fmt.Sprintf("/tables/%s/data", UsersTableName)
var ReportsData = fmt.Sprintf("/tables/%s/data", ReportsTableName)
var SubscriptionsData = fmt.Sprintf("/tables/%s/data", SubscriptionsTableName)
var SubscriptionAggregate = fmt.Sprintf("/tables/%s/aggregate", SubscriptionsTableName)
var SubscriptionSummarize = fmt.Sprintf("/tables/%s/summarize", SubscriptionsTableName)
var SubscriptionQuery = fmt.Sprintf("/tables/%s/query", SubscriptionsTableName)
var NotificationQuery = fmt.Sprintf("/tables/%s/query", NotificationsTableName)
var NotificationAggregate = fmt.Sprintf("/tables/%s/aggregate", NotificationsTableName)
var LocationsQuery = fmt.Sprintf("/tables/%s/query", LocationsTableName)
var LocationsData = fmt.Sprintf("/tables/%s/data", LocationsTableName)

const Transaction = "/transaction"
