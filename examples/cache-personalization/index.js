/**
 * This example uses the WPVIP Cache Personalization API to vary cache based
 * on the presence of a cookie. See README.md for details.
 *
 * https://docs.wpvip.com/technical-references/caching/the-vip-cache-personalization-api/
 */

const express = require( 'express' );
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;
const BASEURL = process.env.BASEURL || 'http://localhost';

// The cookie name must be "vip-go-seg"
const COOKIE_NAME = 'vip-go-seg';

const app = express();

app.use(cookieParser());

/**
 * Handle healthcheck requests
 * 
 * This is a requirement for any application running
 * in the VIP environment:
 * - must handle url "/cache-healthcheck?" with trailing question mark
 * - must respond with 200 status
 * - must only send a short response eg "ok"
 * - must respond immediately, without delay
 * - must prioritize this above other routes
 * - should not execute significant code before, during, or after
 * - must end the request/response (send the response, which fulfills the request)
 * 
 * Test: curl -v "https://example.com/cache-healthcheck?"
 */
app.get( '/cache-healthcheck', function (req, res) {
	res.status( 200 ).send( 'Ok' );
} );

app.get( '/', function ( req, res ) {
	const theme = getSafeThemeValue( req.cookies[ COOKIE_NAME ] );
	const html = `
<!doctype html>
<html>
	<head>
		<title>WPVIP Cache Personalization API Example</title>
		<style>
			body {
				background-color: ${ 'dark' === theme ? '#000000' : '#F9F9F9' };
				color: ${ 'dark' === theme ? '#F9F9F9' : '#000000' };
			}
		</style>
	</head>
	<body>
		<h1>WPVIP Cache Personalization API Example</h1>
		<p>Current theme: ${ theme }</p>
		<button onClick="fetch( '/api/toggle-theme', { method: 'post' } ).then( () => location.reload() );">
			Toggle theme
		</button>
	</body>
</html>`.trim();

	// This header value is case-sensitive!
	res.setHeader( 'Vary', 'X-VIP-Go-Segmentation' );

	res.status( 200 ).send( html );
} );

app.post( '/api/toggle-theme', function ( req, res ) {
	const currentTheme = getSafeThemeValue( req.cookies[ COOKIE_NAME ] );
	const newTheme = 'dark' === currentTheme ? 'light' : 'dark';

	const options = {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // one year in seconds
				sameSite: 'strict',
    };

	res.cookie( COOKIE_NAME, newTheme, options );
	res.status( 200 ).send( newTheme );
} );

function getSafeThemeValue( themeInput = '' ) {
	if ( 'dark' === themeInput.toLowerCase() ) {
		return 'dark';
	}

	return 'light';
}

app.listen( PORT, () => {
	console.log( `Example listening on ${BASEURL}:${PORT}` );
} );
