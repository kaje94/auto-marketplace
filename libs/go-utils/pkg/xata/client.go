package xata

import (
	"bytes"
	"common/pkg/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func NewXataClient(apiKey, dbUrl, branch string) *XataClient {
	return &XataClient{
		apiKey: apiKey,
		dbUrl:  dbUrl,
		branch: branch,
	}
}

func (c *XataClient) Call(method, path string, bodyData *bytes.Buffer, target interface{}) error {
	var req *http.Request
	var err error

	url := fmt.Sprintf("%s:%s%s", c.dbUrl, c.branch, path)

	reqStr := bodyData.String()

	if method == "GET" || method == "DELETE" {
		req, err = http.NewRequest(method, url, nil)
	} else {
		req, err = http.NewRequest(method, url, bodyData)
	}

	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	resp, err := (&http.Client{}).Do(req)

	if err != nil {
		return err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if config.Config.EnvName != "prod" {
		fmt.Printf("Xata \nReq: %s %s %s, \nResp:%s\n", method, path, reqStr, string(body))
	}

	if resp.StatusCode == 404 {
		return status.Error(codes.NotFound, codes.NotFound.String())
	} else if resp.StatusCode == 400 {
		return status.Error(codes.InvalidArgument, "DB bad request")
	} else if resp.StatusCode >= 300 {
		return status.Error(codes.Internal, "Failed to make db call")
	}

	defer resp.Body.Close()

	if target != nil {
		err = json.Unmarshal(body, target)
		if err != nil {
			return err
		}
	}

	return nil
}
