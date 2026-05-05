package graph

import (
	"net/http"
	"os"
	"strings"
)

// authTokenCookieOptions returns Path, SameSite, and Secure for the auth_token cookie.
// When AUTH_COOKIE_CROSS_SITE=1, uses SameSite=None and Secure (needed for cross-site
// credentialed fetches to HTTPS APIs). Default SameSite=Lax works when the browser's
// origin matches the API host (including via a same-origin dev proxy to /query).
func authTokenCookieOptions() (path string, sameSite http.SameSite, secure bool) {
	path = "/"
	if strings.TrimSpace(os.Getenv("AUTH_COOKIE_CROSS_SITE")) == "1" {
		return path, http.SameSiteNoneMode, true
	}
	return path, http.SameSiteLaxMode, false
}
