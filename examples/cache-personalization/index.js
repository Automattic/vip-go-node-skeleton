/**
 * This example uses the WPVIP Cache Personalization API to vary cache based
 * on the presence of a cookie. See README.md for details.
 *
 * https://docs.wpvip.com/technical-references/caching/the-vip-cache-personalization-api/
 */

const express = require( 'express' );
const cookieParser = require( 'cookie-parser' );

const PORT = process.env.PORT || 3000;
const BASEURL = process.env.BASEURL || 'http://localhost';

// In order to be recognized by WPVIP's page cache, segments must be stored in a
// cookie named "vip-go-seg".
const COOKIE_NAME = 'vip-go-seg';

const app = express();

// "cookie-parser" provides easier access to cookies sent with the request.
app.use( cookieParser() );

/**
 * WPVIP health check
 *
 * https://docs.wpvip.com/technical-references/node-js/health-checks/
 */
app.get( '/cache-healthcheck', function (req, res) {
	res.status( 200 ).send( 'Ok' );
} );

// Homepage route
app.get( '/', function ( req, res ) {
	// Get the currently selected theme from the cookie (or use the default).
	const theme = getSafeThemeValue( req.cookies[ COOKIE_NAME ] );

	// Assemble the response, respecting the current theme. Provide a button that
	// allows the user to update the theme via an API endpoint (implemented below).
	const html = `
<!doctype html>
<html data-theme="${ theme }">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>WPVIP Cache Personalization API Example</title>
		<style>
			/* Server-side rendered theme */
			:root {
					--background-color: #F9F9F9;
					--text-color: #000000;
					--theme-name: 'light';
			}

			html[data-theme='dark'] {
					--background-color: #000000;
					--text-color: #F9F9F9;
					--theme-name: 'dark';
			}

			body {
				background-color: var(--background-color);
				color: var(--text-color);
			}

			span#theme::after {
				content: var(--theme-name);
			}
		</style>
		<script>
			/* Client-side theme toggle */
			function toggleTheme() {
				fetch( '/api/toggle-theme', { method: 'post' } )
					.then( response => response.json() )
					.then( payload => document.documentElement.dataset.theme = payload.theme );
			}
		</script>
	</head>
	<body>
		<h1>WPVIP Cache Personalization API Example</h1>
		<p>Current theme: <span id="theme"></span></p>

		<!-- Update the theme and rerender -->
		<button onClick="toggleTheme();">
			Toggle theme
		</button>
	</body>
</html>`.trim();

	// This header value is case-sensitive!
	res.setHeader( 'Vary', 'X-VIP-Go-Segmentation' );

	res.status( 200 ).send( html );
} );

// API endpoint route
app.post( '/api/toggle-theme', function ( req, res ) {
	// Get the currently selected theme from the cookie (or use the default).
	const currentTheme = getSafeThemeValue( req.cookies[ COOKIE_NAME ] );

	// Toggle the theme.
	const newTheme = 'dark' === currentTheme ? 'light' : 'dark';

	const cookieOptions = {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // one year in seconds
				sameSite: 'strict',
    };

	// Set a cookie that will be sent with subsequent requests.
	res.cookie( COOKIE_NAME, newTheme, cookieOptions );

	// The application will use this response to rerender the page with the new theme.
	res.status( 200 ).json( { theme: newTheme } );
} );

// This function ensures that users cannot inject an unsupported theme value.
function getSafeThemeValue( themeInput = '' ) {
	if ( 'dark' === themeInput.toLowerCase() ) {
		return 'dark';
	}

	// Default value for requests without a cookie or malformed cookies.
	return 'light';
}

app.listen( PORT, () => {
	console.log( `Example listening on ${BASEURL}:${PORT}` );
} );
