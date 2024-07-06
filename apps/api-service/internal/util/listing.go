package util

import (
	"bytes"
	commonUtil "common/pkg/util"
	"common/pkg/xata"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"
	service_pb "targabay/protos"
	"targabay/service/internal/auth"
	"time"

	"github.com/go-playground/validator/v10"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TransformXataToListingsResp(xataDaa xata.FetchListingsResponse, totalCount int, pageSize int) (*service_pb.GetListingsResponse, error) {
	page := &service_pb.PaginatedResponse{TotalCount: int32(totalCount), TotalPages: int32(math.Ceil(float64(totalCount) / float64(pageSize)))}
	items := []*service_pb.ListingItem{}

	for _, record := range xataDaa.Records {
		images, err := commonUtil.TransformStrToListingImages(record.VehicleImages)
		if err != nil {
			return nil, err
		}
		var thumbnailImage *service_pb.ListingItem_Data_Image
		for _, imageItem := range images {
			if imageItem.IsThumbnail {
				thumbnailImage = imageItem
				break
			}
		}
		if thumbnailImage == nil && len(images) > 0 {
			thumbnailImage = images[0]
		}

		items = append(items, &service_pb.ListingItem{
			Id:         record.ID,
			Status:     record.Status,
			ExpiryDate: record.ExpiryDate.String(),
			CreatedAt:  record.Xata.CreatedAt.String(),
			Data: &service_pb.ListingItem_Data{
				Type:               record.Type,
				Brand:              record.Brand,
				Model:              record.Model,
				Trim:               record.Trim,
				YearOfManufacture:  int32(record.YearOfManufacture),
				YearOfRegistration: int32(record.YearOfRegistration),
				Mileage:            int32(record.Mileage),
				EngineCapacity:     int32(record.EngineCapacity),
				Description:        record.Description,
				Condition:          record.Condition,
				TransmissionType:   record.TransmissionType,
				FuelType:           record.FuelType,
				Features:           record.Features,
				Price:              float32(record.Price),
				PriceNegotiable:    record.PriceNegotiable,
				VehicleImages:      []*service_pb.ListingItem_Data_Image{thumbnailImage},
				Embeddings:         record.Ada002,
			},
			User: &service_pb.UserProfile{
				Data: &service_pb.UserProfile_ProfileData{
					City:        *record.City,
					State:       *record.State,
					CountryCode: *record.CountryCode,
				},
				Email: commonUtil.DeSanitizeEmail(commonUtil.GetUserEmailFromListingRec(record)),
			},
		})
	}

	return &service_pb.GetListingsResponse{Page: page, Items: items}, nil
}

func TransformXataToListingItemResp(xataDaa xata.ListingRecord, userRecord *xata.UserRecord) (*service_pb.ListingItem, error) {
	listingImages, err := commonUtil.TransformStrToListingImages(xataDaa.VehicleImages)
	if err != nil {
		return nil, err
	}

	user := &service_pb.UserProfile{}
	if userRecord == nil {
		user = &service_pb.UserProfile{
			Data: &service_pb.UserProfile_ProfileData{
				City:        *xataDaa.City,
				State:       *xataDaa.State,
				CountryCode: *xataDaa.CountryCode,
			},
			Email: commonUtil.DeSanitizeEmail(commonUtil.GetUserEmailFromListingRec(xataDaa)),
		}
	} else {
		user = &service_pb.UserProfile{
			Data: &service_pb.UserProfile_ProfileData{
				Phone:         userRecord.Phone,
				City:          userRecord.City,
				State:         userRecord.State,
				PostalCode:    userRecord.PostalCode,
				CountryCode:   userRecord.CountryCode,
				VehicleDealer: userRecord.VehicleDealer,
			},
			Name:    userRecord.Name,
			Email:   commonUtil.DeSanitizeEmail(commonUtil.GetUserEmailFromListingRec(xataDaa)),
			Picture: userRecord.Picture,
		}
	}

	reviewComment := ""
	if xataDaa.AdminReview != nil {
		reviewComment = *xataDaa.AdminReview
	}

	return &service_pb.ListingItem{
		Id:         xataDaa.ID,
		ExpiryDate: xataDaa.ExpiryDate.String(),
		CreatedAt:  xataDaa.Xata.CreatedAt.String(),
		User:       user,
		Status:     xataDaa.Status,
		Data: &service_pb.ListingItem_Data{
			Type:               xataDaa.Type,
			Brand:              xataDaa.Brand,
			Model:              xataDaa.Model,
			Trim:               xataDaa.Trim,
			YearOfManufacture:  int32(xataDaa.YearOfManufacture),
			YearOfRegistration: int32(xataDaa.YearOfRegistration),
			Mileage:            int32(xataDaa.Mileage),
			EngineCapacity:     int32(xataDaa.EngineCapacity),
			Description:        xataDaa.Description,
			Condition:          xataDaa.Condition,
			TransmissionType:   xataDaa.TransmissionType,
			FuelType:           xataDaa.FuelType,
			Features:           xataDaa.Features,
			VehicleImages:      listingImages,
			Price:              float32(xataDaa.Price),
			PriceNegotiable:    xataDaa.PriceNegotiable,
			Embeddings:         xataDaa.Ada002,
		},
		ReviewComment: reviewComment,
	}, nil
}

func GetInitialListingQueryFilterReq(pageNumber int, pageSize int) xata.ListingSearchRequest {
	return xata.ListingSearchRequest{
		Page: xata.SearchPage{
			Offset: (pageNumber - 1) * pageSize,
			Size:   pageSize,
		},
		Filter: xata.ListingSearchFilter{},
		Sort: &xata.CreatedAtSort{
			CreatedAt: "desc",
		},
	}
}

func GetFeaturedQueryFilterReq(countryCode string) xata.ListingFeaturedRequest {
	return xata.ListingFeaturedRequest{
		Page: xata.SearchPage{
			Offset: 0,
			Size:   12,
		},
		Filter: xata.ListingSearchFilter{
			CountryCode: &xata.FilterEqualsItem{Is: countryCode},
			Status:      "Posted",
		},
		Sort: &xata.ViewsSort{
			Views: "desc",
		},
	}
}

func GetRelatedQueryFilterReq(queryVector []float32, countryCode string) xata.ListingRelatedRequest {
	return xata.ListingRelatedRequest{
		QueryVector: queryVector,
		Size:        13,
		Filter: xata.ListingSearchFilter{
			CountryCode: &xata.FilterEqualsItem{Is: countryCode},
			Status:      "Posted",
		},
		Column: "ada002",
	}
}

func GetInitialQuerySearchReq(search string, pageNumber int, pageSize int) xata.ListingSearchRequest {
	return xata.ListingSearchRequest{
		Query: search,
		Page: xata.SearchPage{
			Offset: (pageNumber - 1) * pageSize,
			Size:   pageSize,
		},
		Filter:    xata.ListingSearchFilter{},
		Fuzziness: 1,
		Target: []xata.SearchTarget{
			{Column: "brand", Weight: 5},
			{Column: "model", Weight: 5},
			{Column: "trim", Weight: 5},
			{Column: "yearOfManufacture", Weight: 3},
			{Column: "description", Weight: 1},
			{Column: "features", Weight: 1},
			{Column: "city", Weight: 1},
			{Column: "state", Weight: 1},
		},
		Boosters: []xata.SearchNumericBooster{
			{NumericBooster: xata.NumericBooster{Column: "views", Factor: 2}},
		},
	}
}

func AddAdminFilter(request *xata.ListingSearchRequest, userFilters *service_pb.ListingFilters_AdminListingsFilters) {
	if userFilters.UserEmail != "" {
		request.Filter.User = &xata.FilterEqualsItem{Is: commonUtil.SanitizeEmail(userFilters.UserEmail)}
	}
}

func AddUserFilter(request *xata.ListingSearchRequest, userFilters *service_pb.ListingFilters_UserListingsFilters) {
	if userFilters.Status != "" {
		request.Filter.Status = userFilters.Status
	}

	if userFilters.Brand != "" {
		request.Filter.Brand = &xata.FilterEqualsItem{Is: userFilters.Brand}
	}

	if userFilters.Model != "" {
		request.Filter.Model = &xata.FilterIgnoreCaseItem{Contains: userFilters.Model}
	}
}

func AddPublicFilter(request *xata.ListingSearchRequest, publicFilters *service_pb.ListingFilters_PublicListingsFilters) {
	if publicFilters.CountryCode != "" {
		request.Filter.CountryCode = &xata.FilterEqualsItem{Is: publicFilters.CountryCode}
	}

	if publicFilters.City != "" {
		request.Filter.City = &xata.FilterIgnoreCaseItem{Contains: publicFilters.City}
	}

	if publicFilters.State != "" {
		request.Filter.State = &xata.FilterIgnoreCaseItem{Contains: publicFilters.State}
	}

	if publicFilters.VehicleType != "" {
		request.Filter.Type = &xata.FilterEqualsItem{Is: publicFilters.VehicleType}
	}

	if publicFilters.Condition != "" {
		request.Filter.Condition = &xata.FilterEqualsItem{Is: publicFilters.Condition}
	}

	if publicFilters.TransmissionType != "" {
		request.Filter.TransmissionType = &xata.FilterEqualsItem{Is: publicFilters.TransmissionType}
	}

	if publicFilters.FuelType != "" {
		request.Filter.FuelType = &xata.FilterEqualsItem{Is: publicFilters.FuelType}
	}

	if publicFilters.MinPrice != 0 || publicFilters.MaxPrice != 0 {
		if publicFilters.MinPrice != 0 && publicFilters.MaxPrice != 0 {
			priceFilter := &xata.FilterGeLe{Ge: int(publicFilters.MinPrice), Le: int(publicFilters.MaxPrice)}
			request.Filter.Price = priceFilter
		} else if publicFilters.MinPrice != 0 {
			priceFilter := &xata.FilterGe{Ge: int(publicFilters.MinPrice)}
			request.Filter.Price = priceFilter
		} else if publicFilters.MaxPrice != 0 {
			priceFilter := &xata.FilterLe{Le: int(publicFilters.MaxPrice)}
			request.Filter.Price = priceFilter
		}
	}

	if publicFilters.YomStartDate != "" || publicFilters.YomEndDate != "" {
		startYear, _ := strconv.Atoi(publicFilters.YomStartDate)
		endYear, _ := strconv.Atoi(publicFilters.YomEndDate)

		if endYear != 0 && startYear != 0 {
			yearFilter := &xata.FilterGeLe{Ge: startYear, Le: endYear}
			request.Filter.YearOfRegistration = yearFilter
		} else if startYear != 0 {
			yearFilter := &xata.FilterGe{Ge: startYear}
			request.Filter.YearOfRegistration = yearFilter
		} else if endYear != 0 {
			yearFilter := &xata.FilterLe{Le: endYear}
			request.Filter.YearOfRegistration = yearFilter
		}
	}

	if publicFilters.StartCreatedDate != "" || publicFilters.EndCreatedDate != "" {
		layout := "2006-01-02"
		startDate, _ := time.Parse(layout, publicFilters.StartCreatedDate)
		startDateStr := startDate.Format(time.RFC3339)

		endDate, _ := time.Parse(layout, publicFilters.EndCreatedDate)
		endDateStr := endDate.Format(time.RFC3339)

		if publicFilters.StartCreatedDate != "" && publicFilters.EndCreatedDate != "" {
			dateFilter := &xata.FilterGeLe{Ge: startDateStr, Le: endDateStr}
			request.Filter.CreatedAt = dateFilter
		} else if publicFilters.StartCreatedDate != "" {
			dateFilter := &xata.FilterGe{Ge: startDateStr}
			request.Filter.CreatedAt = dateFilter
		} else if publicFilters.EndCreatedDate != "" {
			dateFilter := &xata.FilterLe{Le: endDateStr}
			request.Filter.CreatedAt = dateFilter
		}
	}
}

func TransformListingImagesToStr(VehicleImages []*service_pb.ListingItem_Data_Image) (string, error) {
	validate := validator.New()

	listingImages := make([]xata.ListingImageItem, 0)
	for _, img := range VehicleImages {
		listingImages = append(listingImages, xata.ListingImageItem{
			Name:        img.Name,
			URL:         img.Url,
			Color:       img.Color,
			Hash:        img.Hash,
			IsThumbnail: img.IsThumbnail,
		})
	}
	if err := validate.Var(listingImages, "min=1,max=10,dive,required"); err != nil {
		return "", err
	}

	listingImagesJSON, err := json.Marshal(listingImages)
	if err != nil {
		return "", err
	}

	return string(listingImagesJSON), nil
}

func GetListingRecord(listingId string) (xata.ListingRecord, error) {
	listingRecord := xata.ListingRecord{}
	if err := Xata.Call("GET", fmt.Sprintf("%s/%s", xata.ListingData, listingId), nil, &listingRecord); err != nil {
		return xata.ListingRecord{}, err
	}
	return listingRecord, nil
}

func VerifyListingAccessible(user auth.User, listingRecord xata.ListingRecord) error {
	if !user.IsAdmin && commonUtil.GetUserEmailFromListingRec(listingRecord) != user.Email {
		return status.Error(codes.PermissionDenied, "Only authors and admins are allowed to access this record")
	}
	return nil
}

func GetListingsQueryResp(listingFilterReq xata.ListingSearchRequest, fetchListResp *xata.FetchListingsResponse, xataClient *xata.XataClient) error {
	postBodyList, err := json.Marshal(listingFilterReq)
	if err != nil {
		return nil
	}

	if err := xataClient.Call("POST", xata.ListingQuery, bytes.NewBuffer(postBodyList), fetchListResp); err != nil {
		return err
	}

	return nil
}

func GetListingsAggrResp(listingFilterReq xata.ListingSearchRequest, aggrResp *xata.AggregationResponse, xataClient *xata.XataClient) error {
	postBodyTotalCount, err := json.Marshal(xata.AggregationRequest{
		Aggs: xata.Aggr{TotalCount: xata.AggrTotalCount{Count: xata.AggrCount{Filter: listingFilterReq.Filter}}},
	})

	if err != nil {
		return nil
	}

	if strings.Contains(string(postBodyTotalCount), `"filter":{}`) {
		postBodyTotalCount, err = json.Marshal(xata.AggregationRequest{
			Aggs: xata.Aggr{TotalCount: xata.AggrTotalCount{Count: "*"}},
		})
		if err != nil {
			return nil
		}

	}

	if err := xataClient.Call("POST", xata.ListingAggregate, bytes.NewBuffer(postBodyTotalCount), aggrResp); err != nil {
		return err
	}

	return nil
}

func GetListingsWithTotal(listingFilterReq xata.ListingSearchRequest, xataClient *xata.XataClient) (xata.FetchListingsResponse, xata.AggregationResponse, error) {

	listingResp := xata.FetchListingsResponse{}
	listingAggrResp := xata.AggregationResponse{}

	// Create channels for communication
	listingRespChan := make(chan error)
	listingAggrRespChan := make(chan error)

	// Call util.Xata.Call for listing search in a goroutine
	go func() {
		listingRespChan <- GetListingsQueryResp(listingFilterReq, &listingResp, xataClient)
	}()

	// Call util.Xata.Call for listing aggregation in a goroutine
	go func() {
		listingAggrRespChan <- GetListingsAggrResp(listingFilterReq, &listingAggrResp, xataClient)
	}()

	// Wait for both calls to complete
	err1 := <-listingRespChan
	err2 := <-listingAggrRespChan

	// Check for errors
	if err1 != nil {
		return xata.FetchListingsResponse{}, xata.AggregationResponse{}, nil
	}
	if err2 != nil {
		return xata.FetchListingsResponse{}, xata.AggregationResponse{}, nil
	}
	return listingResp, listingAggrResp, nil
}
