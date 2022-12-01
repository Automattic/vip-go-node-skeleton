/**
 * We are using the built-in Node.js `http` module to create a Web server that
 * will respond to requests. HTTPS connections with end users are implemented
 * by the VIP Platform; applications should implement regular HTTP.
 */
const http = require( 'http' );

/**
 * Respect dynamic PORT
 * https://docs.wpvip.com/technical-references/node-js/#h-dynamic-port
 *
 * Applications must listen on the port assigned by VIP, which is provided as
 * an environment variable. This code falls back to a value of 3000 when the
 * environment variable has not been defined (i.e., in local development).
 */
const PORT = process.env.PORT || 3000;

const app = http.createServer( ( req, res ) => {
	/**
	 * Extract the pathname, without any query parameters, from the request. This
	 * allows us to implement routing based purely on the requested path.
	 */
	const { pathname } = new URL( req.url, `http://${ req.headers.host }` );

	/**
	 * Handle health checks
	 * https://docs.wpvip.com/technical-references/node-js/health-checks/
	 *
	 * This is a requirement for any application running on WordPress VIP:
	 *
	 * - must respond to "/cache-healthcheck?" with trailing question mark
	 * - must respond with a 200 status code
	 * - must respond immediately, without delay
	 * - must prioritize this above other routes
	 */
	if ( '/cache-healthcheck' === pathname && [ 'GET', 'HEAD' ].includes( req.method ) ) {
		res.writeHead( 200 );
		res.end();
		return;
	}

	// Route: /
	if ( '/' === pathname && [ 'GET', 'HEAD' ].includes( req.method ) ) {
		res.writeHead( 200 );
		res.end( 'Howdy!' );
		return;
	}

	// Fallback route: Not found
	res.writeHead( 404 );
	res.end();
} );

// Print a message when the application is ready to accept requests.
app.on( 'listening', () => {
	console.log( `App is listening on port ${ PORT }` );
} );

app.listen( PORT );
