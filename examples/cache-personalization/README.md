# Use the WPVIP Cache Personalization API

This example shows how to use WPVIP's [Cache Personalization API](https://docs.wpvip.com/technical-references/caching/the-vip-cache-personalization-api/) to implement a server-side-rendered "dark mode."

## Key concepts

The personalization API uses a cookie and the `Vary` response header to instruct WPVIP's page cache to create segments based on the cookie's value. This ensures that cached responses are distinct for each segment. Therefore, a cached "light mode" response will not be sent to a user that has requested "dark mode."

A typical user flow:

1. A user visits the site (`/`) without any cookies set.
2. The user receives a cached response for the default theme (`'light'`).
3. The user clicks a button to toggle the theme, which sends a request to `/api/toggle-theme`.
4. The API response sets a segmentation cookie (`vip-go-seg=dark`) and returns the updated theme value.
5. The page is updated client-side to reflect the new theme.
6. The user refreshes the page. The cookie is sent with the request and the user receives a cached response for the dark theme.

## Common pitfalls

- It is **critical** that cookies are not set for page responses. A `Set-Cookie` response header [effectively disables caching](https://docs.wpvip.com/technical-references/caching/cookies/) for that response.
  - Instead, delegate setting cookies to an API endpoint or client-side code that is only called when a cookie update is required.
  - Rely on default values wherever possible. Only set a `vip-go-seg` cookie if the user elects to override the default.
- The name of the segmentation cookie must be `vip-go-seg`.
- Responses that vary by segment must include a `Vary` header with value of `X-VIP-Go-Segmentation`.
  - This value is case-sensitive!
  - Only set the `Vary` header for responses that vary by segment.
- Avoid creating too many segments. Each unique value of the `vip-go-seg` cookie results in a distinct page cache object. Too many segments can quickly reduce the effectiveness of page cache.

## Extending this example

While this example creates two simple segments, you may wish to create additional segments across different categories—possibly with users belonging to multiple segments. To do this, develop a strategy for encoding these segments and segment categories in the `vip-go-seg` cookie value. For example, if you have segments for `theme` and `language`, you might set a cookie value of `Buffer.from( '{"theme":"dark","language":"pt-BR"}' ).toString( 'base64' )`.
