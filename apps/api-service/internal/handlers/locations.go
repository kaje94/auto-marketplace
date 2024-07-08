package handlers

import (
	"bytes"
	"common/pkg/xata"
	"context"
	"encoding/json"
	"fmt"
	service_pb "targabay/protos"
	"targabay/service/internal/util"
)

type Locations struct {
	service_pb.LocationsServiceServer
}

func (s *Locations) GetStates(ctx context.Context, req *service_pb.GetStatesRequest) (*service_pb.GetStatesResponse, error) {

	citiesOfCountryReq := xata.LocationsFilterRequest{
		Filter:  xata.LocationsFilter{CountryCode: &xata.FilterEqualsItem{Is: req.CountryCode}},
		Columns: []string{"id", "stateName"},
	}

	postBodyList, err := json.Marshal(citiesOfCountryReq)
	if err != nil {
		return nil, err
	}

	locationsResp := xata.FetchLocationsResponse{}
	if err := util.Xata.Call("POST", xata.LocationsQuery, bytes.NewBuffer(postBodyList), &locationsResp); err != nil {
		return nil, err
	}

	states := []*service_pb.GetStatesResponse_StateItem{}
	for _, record := range locationsResp.Records {
		states = append(states, &service_pb.GetStatesResponse_StateItem{
			Id:        record.ID,
			StateName: record.StateName,
		})
	}

	return &service_pb.GetStatesResponse{States: states}, nil
}

func (s *Locations) GetCities(ctx context.Context, req *service_pb.GetCitiesRequest) (*service_pb.GetCitiesResponse, error) {
	locationsResp := xata.LocationRecord{}
	if err := util.Xata.Call("GET", fmt.Sprintf("%s/%s", xata.LocationsData, req.StateCode), nil, &locationsResp); err != nil {
		return nil, err
	}

	return &service_pb.GetCitiesResponse{Cities: locationsResp.Cities}, nil
}
