package auth

import (
	"context"
	"regexp"
	"strings"

	"github.com/grpc-ecosystem/go-grpc-middleware/v2/metadata"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	headerAuthorize = "Authorization"
	CtxUser         = "ctx_user"
)

// AuthFunc is the pluggable function that performs authentication.
//
// The passed in `Context` will contain the gRPC metadata.MD object (for header-based authentication) and
// the peer.Peer information that can contain transport-based credentials (e.g. `credentials.AuthInfo`).
//
// The returned context will be propagated to handlers, allowing user changes to `Context`. However,
// please make sure that the `Context` returned is a child `Context` of the one passed in.
//
// If error is returned, its `grpc.Code()` will be returned to the user as well as the verbatim message.
// Please make sure you use `codes.Unauthenticated` (lacking auth) and `codes.PermissionDenied`
// (authed, but lacking perms) appropriately.
type AuthFunc func(ctx context.Context) (context.Context, error)

// ServiceAuthFuncOverride allows a given gRPC service implementation to override the global `AuthFunc`.
//
// If a service implements the AuthFuncOverride method, it takes precedence over the `AuthFunc` method,
// and will be called instead of AuthFunc for all method invocations within that service.
type ServiceAuthFuncOverride interface {
	AuthFuncOverride(ctx context.Context, fullMethodName string) (context.Context, error)
}

// UnaryServerInterceptor returns a new unary server interceptors that performs per-request auth.
// NOTE(bwplotka): For more complex auth interceptor see https://github.com/grpc/grpc-go/blob/master/authz/grpc_authz_server_interceptors.go.
func UnaryServerInterceptor(authFunc AuthFunc) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
		if shouldAuthCheckSkip(info.FullMethod) {
			return handler(ctx, req)
		}

		var newCtx context.Context
		var err error
		if overrideSrv, ok := info.Server.(ServiceAuthFuncOverride); ok {
			newCtx, err = overrideSrv.AuthFuncOverride(ctx, info.FullMethod)
		} else {
			newCtx, err = authFunc(ctx)
		}

		if err != nil {
			return nil, err
		}

		user := newCtx.Value(CtxUser).(User)
		if strings.Contains(strings.ToLower(info.FullMethod), "admin") && !user.IsAdmin {
			return nil, status.Error(codes.PermissionDenied, "Admin role is required")
		}

		return handler(newCtx, req)
	}
}

// authFromMD is a helper function for extracting the :authorization header from the gRPC metadata of the request.
//
// It expects the `:authorization` header to be of a certain scheme (e.g. `basic`, `bearer`), in a
// case-insensitive format (see rfc2617, sec 1.2). If no such authorization is found, or the token
// is of wrong scheme, an error with gRPC status `Unauthenticated` is returned.
func authFromMD(ctx context.Context, expectedScheme string) (string, error) {
	val := metadata.ExtractIncoming(ctx).Get(headerAuthorize) // returns `Bearer abc`
	if val == "" {
		return "", status.Error(codes.Unauthenticated, "Request unauthenticated with "+expectedScheme)
	}
	scheme, token, found := strings.Cut(val, " ")
	if !found {
		return "", status.Error(codes.Unauthenticated, "Bad authorization string")
	}
	if !strings.EqualFold(scheme, expectedScheme) {
		return "", status.Error(codes.Unauthenticated, "Request unauthenticated with "+expectedScheme)
	}
	return token, nil
}

// Middleware to validate token and inject user_email & is_admin properties into context
func ValidateUser(ctx context.Context) (context.Context, error) {
	token, err := authFromMD(ctx, "Bearer")
	if err != nil {
		return nil, err
	}

	user, err := ValidateAuth0Token(ctx, token)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid auth token")
	}

	ctx = context.WithValue(ctx, CtxUser, user)

	return ctx, nil
}

// Skip auth checks for publicly accessible services
func shouldAuthCheckSkip(method string) bool {
	publicListingsPattern := regexp.MustCompile(`protos\.service\.PublicListingsService`)
	locationsPattern := regexp.MustCompile(`protos\.service\.LocationsService`)
	return publicListingsPattern.MatchString(method) || locationsPattern.MatchString(method)
}
