package xata

import "time"

type XataCreateResponse struct {
	ID   string               `json:"id"`
	Xata XataResponseMetadata `json:"xata"`
}

type XataResponseMetadata struct {
	Version   int       `json:"version"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type XataClient struct {
	apiKey string
	dbUrl  string
	branch string
}

type CreatedAtSort struct {
	CreatedAt string `json:"xata.createdAt,omitempty"`
}

type ViewsSort struct {
	Views string `json:"views,omitempty"`
}

type FilterIgnoreCaseItem struct {
	Contains string `json:"$iContains,omitempty"`
}

type FilterEqualsItem struct {
	Is string `json:"$is,omitempty"`
}

type FilterGe struct {
	Ge any `json:"$ge,omitempty"`
}

type FilterLe struct {
	Le any `json:"$le,omitempty"`
}

type FilterGeLe struct {
	Ge any `json:"$ge,omitempty"`
	Le any `json:"$le,omitempty"`
}

type SearchTarget struct {
	Column string `json:"column,omitempty"`
	Weight int    `json:"weight,omitempty"`
}

type NumericBooster struct {
	Column string `json:"column,omitempty"`
	Factor int    `json:"factor,omitempty"`
}

type SearchNumericBooster struct {
	NumericBooster NumericBooster `json:"numericBooster,omitempty"`
}

type SearchPage struct {
	Size   int `json:"size"`
	Offset int `json:"offset"`
}

type ListingSearchFilter struct {
	Status             string                `json:"status,omitempty"`
	City               *FilterIgnoreCaseItem `json:"city,omitempty"`
	State              *FilterIgnoreCaseItem `json:"state,omitempty"`
	CountryCode        *FilterEqualsItem     `json:"countryCode,omitempty"`
	Type               *FilterEqualsItem     `json:"type,omitempty"`
	Condition          *FilterEqualsItem     `json:"condition,omitempty"`
	TransmissionType   *FilterEqualsItem     `json:"transmissionType,omitempty"`
	FuelType           *FilterEqualsItem     `json:"fuelType,omitempty"`
	User               *FilterEqualsItem     `json:"user,omitempty"`
	Brand              *FilterEqualsItem     `json:"brand,omitempty"`
	Model              *FilterIgnoreCaseItem `json:"model,omitempty"`
	Price              any                   `json:"price,omitempty"`
	YearOfRegistration any                   `json:"yearOfRegistration,omitempty"`
	CreatedAt          any                   `json:"xata.createdAt,omitempty"`
	ExpiryDate         *FilterLe             `json:"expiryDate,omitempty"`
}

type SubscriptionSearchFilter struct {
	User                  *FilterEqualsItem `json:"user,omitempty"`
	NotificationFrequency *FilterEqualsItem `json:"notificationFrequency,omitempty"`
	Active                *bool             `json:"active,omitempty"`
}

type NotificationsFilter struct {
	User      *FilterEqualsItem `json:"user,omitempty"`
	CreatedAt any               `json:"xata.createdAt,omitempty"`
	IsShown   *bool             `json:"isShown,omitempty"`
}

type LocationsFilter struct {
	CountryCode *FilterEqualsItem `json:"countryCode,omitempty"`
	StateId     *FilterEqualsItem `json:"id,omitempty"`
}

type AggrResp struct {
	TotalCount int `json:"totalCount,omitempty"`
}

type AggregationResponse struct {
	Aggs AggrResp `json:"aggs"`
}

type AggrCount struct {
	Filter any `json:"filter,omitempty"`
}

type AggrTotalCount struct {
	Count any `json:"count,omitempty"` // if no filters us `"*"`, else use AggrCount
}

type Aggr struct {
	TotalCount AggrTotalCount `json:"totalCount,omitempty"`
}

type AggregationRequest struct {
	Aggs Aggr `json:"aggs"`
}

type SummarizeRequest struct {
	Summaries CountSummarizeReq   `json:"summaries,omitempty"`
	Filter    ListingSearchFilter `json:"filter,omitempty"`
}

type CountSummarizeReq struct {
	Count struct {
		Count string `json:"count,omitempty"`
	} `json:"count,omitempty"`
}

type CountSummaries struct {
	Count int `json:"count"`
}

type CountSummarizeResponse struct {
	Summaries []CountSummaries `json:"summaries"`
}

type ListingSearchRequest struct {
	Query     string                 `json:"query,omitempty"`
	Filter    ListingSearchFilter    `json:"filter,omitempty"`
	Page      SearchPage             `json:"page"`
	Target    []SearchTarget         `json:"target,omitempty"`
	Fuzziness int                    `json:"fuzziness,omitempty"`
	Boosters  []SearchNumericBooster `json:"boosters,omitempty"`
	Sort      *CreatedAtSort         `json:"sort,omitempty"`
}

type ListingFeaturedRequest struct {
	Filter ListingSearchFilter `json:"filter,omitempty"`
	Page   SearchPage          `json:"page"`
	Sort   *ViewsSort          `json:"sort,omitempty"`
}

type ListingRelatedRequest struct {
	QueryVector []float32           `json:"queryVector"`
	Column      string              `json:"column"`
	Size        int                 `json:"size,omitempty"`
	Filter      ListingSearchFilter `json:"filter,omitempty"`
}

type SubscriptionFilterRequest struct {
	Filter SubscriptionSearchFilter `json:"filter,omitempty"`
	Page   SearchPage               `json:"page"`
	Sort   *CreatedAtSort           `json:"sort,omitempty"`
}

type NotificationsFilterRequest struct {
	Filter NotificationsFilter `json:"filter,omitempty"`
	Page   SearchPage          `json:"page"`
	Sort   *CreatedAtSort      `json:"sort,omitempty"`
}

type LocationsFilterRequest struct {
	Filter  LocationsFilter `json:"filter,omitempty"`
	Columns []string        `json:"columns,omitempty"`
}

type FetchListingsResponse struct {
	TotalCount int             `json:"totalCount,omitempty"`
	Records    []ListingRecord `json:"records,omitempty"`
}

type FetchSubscriptionsResponse struct {
	TotalCount int                  `json:"totalCount,omitempty"`
	Records    []SubscriptionRecord `json:"records,omitempty"`
}

type FetchNotificationsResponse struct {
	TotalCount int                  `json:"totalCount,omitempty"`
	Records    []NotificationRecord `json:"records,omitempty"`
}

type FetchLocationsResponse struct {
	Records []LocationRecord `json:"records,omitempty"`
}

type TransactionRequest struct {
	Operations []any `json:"operations"`
}

type UpdateTransaction struct {
	Update UpdateTransactionData `json:"update"`
}

type UpdateTransactionData struct {
	Table  string `json:"table"`
	ID     string `json:"id"`
	Fields any    `json:"fields,omitempty"`
	Upsert bool   `json:"upsert,omitempty"`
}

type InsertTransaction struct {
	Insert InsertTransactionData `json:"insert"`
}

type InsertTransactionData struct {
	Table  string `json:"table"`
	Record any    `json:"record,omitempty"`
}

type DeleteTransaction struct {
	Delete DeleteTransactionData `json:"delete"`
}

type DeleteTransactionData struct {
	Table string `json:"table"`
	ID    string `json:"id"`
}

type GetTransaction struct {
	Get GetTransactionData `json:"get"`
}

type GetTransactionData struct {
	Table   string   `json:"table"`
	ID      string   `json:"id"`
	Columns []string `json:"columns"`
}

type TransactionRespItem struct {
	Operation string            `json:"operation"`
	Columns   map[string]string `json:"columns"`
}

type ListingRecord struct {
	ID                 string                `json:"id,omitempty"`
	Type               string                `json:"type,omitempty" validate:"oneof=Car Van SUV Jeep Bus Truck ThreeWheeler Motorcycle Other"`
	Brand              string                `json:"brand,omitempty" validate:"min=1,max=50"`
	Trim               string                `json:"trim,omitempty" validate:"min=0,max=50"`
	Model              string                `json:"model,omitempty" validate:"min=1,max=50"`
	YearOfManufacture  int                   `json:"yearOfManufacture,omitempty" validate:"gte=1960,lte=2100"`
	YearOfRegistration int                   `json:"yearOfRegistration,omitempty" validate:"gte=0,lte=2100"`
	Mileage            int                   `json:"mileage,omitempty" validate:"gte=0"`
	Condition          string                `json:"condition,omitempty" validate:"oneof=BrandNew Registered Reconditioned"`
	TransmissionType   string                `json:"transmissionType,omitempty" validate:"oneof=Automatic Manual"`
	FuelType           string                `json:"fuelType,omitempty" validate:"oneof=Petrol Diesel Hybrid Electric"`
	EngineCapacity     int                   `json:"engineCapacity,omitempty" validate:"gt=0"`
	VehicleImages      string                `json:"vehicleImages,omitempty"`
	Features           []string              `json:"features,omitempty"`
	Description        string                `json:"description,omitempty" validate:"min=1,max=2000"`
	ExpiryDate         time.Time             `json:"expiryDate,omitempty"`
	Status             string                `json:"status,omitempty" validate:"oneof=UnderReview Posted Declined Expired Sold TemporarilyUnlisted PermanentlyRemoved"`
	User               any                   `json:"user,omitempty"`
	Price              int                   `json:"price,omitempty" validate:"gt=0"`
	PriceNegotiable    bool                  `json:"priceNegotiable"`
	City               *string               `json:"city,omitempty"`
	State              *string               `json:"state,omitempty"`
	CountryCode        *string               `json:"countryCode,omitempty"`
	Views              *int                  `json:"views,omitempty"`
	Ada002             []float32             `json:"ada002,omitempty"`
	AdminReview        *string               `json:"adminReview,omitempty"`
	Xata               *XataResponseMetadata `json:"xata,omitempty"`
}

type ListingImageItem struct {
	Name        string `json:"name" validate:"min=1,max=100"`
	URL         string `json:"url" validate:"http_url,min=1,max=200"`
	Color       string `json:"color" validate:"min=2,max=10"`
	Hash        string `json:"hash" validate:"min=1,max=50"`
	IsThumbnail bool   `json:"isThumbnail"`
}

type UserRecord struct {
	Phone         string `json:"phone,omitempty" validate:"min=1,max=20"`
	Name          string `json:"name,omitempty" validate:"min=1,max=150"`
	City          string `json:"city,omitempty" validate:"min=1,max=100"`
	State         string `json:"state,omitempty" validate:"min=1,max=100"`
	PostalCode    string `json:"postalCode,omitempty" validate:"min=1,max=25"`
	CountryCode   string `json:"countryCode,omitempty" validate:"len=2"`
	Picture       string `json:"picture,omitempty"`
	VehicleDealer bool   `json:"vehicleDealer"`
}

type ReportRecord struct {
	Listing any    `json:"listing,omitempty"`
	Email   string `json:"email,omitempty" validate:"email"`
	Message string `json:"message,omitempty" validate:"min=1,max=1000"`
	Reason  string `json:"reason,omitempty" validate:"oneof=AlreadySold Fraud Duplicate Spam WrongCategory"`
}

type SubscriptionRecord struct {
	ID                     string                `json:"id,omitempty"`
	DisplayName            string                `json:"displayName,omitempty" validate:"min=1,max=100"`
	Type                   string                `json:"type,omitempty" validate:"omitempty,oneof=Car Van SUV Jeep Bus Truck ThreeWheeler Motorcycle Other"`
	Brand                  string                `json:"brand,omitempty" validate:"omitempty,min=1,max=50"`
	Trim                   string                `json:"trim,omitempty" validate:"omitempty,min=0,max=50"`
	Model                  string                `json:"model,omitempty" validate:"omitempty,min=1,max=50"`
	MinYearOfManufacture   int                   `json:"minYearOfManufacture,omitempty" validate:"omitempty,gte=1960,lte=2100"`
	MaxYearOfManufacture   int                   `json:"maxYearOfManufacture,omitempty" validate:"omitempty,gte=1960,lte=2100"`
	MinYearOfRegistration  int                   `json:"minYearOfRegistration,omitempty" validate:"omitempty,gte=1960,lte=2100"`
	MaxYearOfRegistration  int                   `json:"maxYearOfRegistration,omitempty" validate:"omitempty,gte=1960,lte=2100"`
	MinMillage             int                   `json:"minMillage,omitempty" validate:"omitempty,gte=0"`
	MaxMillage             int                   `json:"maxMillage,omitempty" validate:"omitempty,gte=0"`
	Condition              string                `json:"condition,omitempty" validate:"omitempty,oneof=BrandNew Registered Reconditioned"`
	MinPrice               int                   `json:"minPrice,omitempty" validate:"omitempty,gt=0"`
	MaxPrice               int                   `json:"maxPrice,omitempty" validate:"omitempty,gt=0"`
	NotificationFrequency  string                `json:"notificationFrequency,omitempty" validate:"oneof=Daily Weekly OnceEveryTwoWeeks Monthly"`
	SubscriptionExpiryDate time.Time             `json:"subscriptionExpiryDate,omitempty"`
	Active                 bool                  `json:"active,omitempty"`
	User                   any                   `json:"user,omitempty"`
	CountryCode            *string               `json:"countryCode,omitempty"`
	Xata                   *XataResponseMetadata `json:"xata,omitempty"`
}

type NotificationRecord struct {
	ID           string                `json:"id,omitempty"`
	Title        string                `json:"title,omitempty"`
	Body         string                `json:"body,omitempty"`
	Type         string                `json:"type,omitempty"`
	RedirectPath string                `json:"redirectPath,omitempty"`
	IsShown      bool                  `json:"isShown,omitempty"`
	User         any                   `json:"user,omitempty"`
	Xata         *XataResponseMetadata `json:"xata,omitempty"`
}

type LocationRecord struct {
	ID          string                `json:"id,omitempty"`
	StateName   string                `json:"stateName,omitempty"`
	CountryCode string                `json:"countryCode,omitempty"`
	Cities      []string              `json:"cities,omitempty"`
	Xata        *XataResponseMetadata `json:"xata,omitempty"`
}
