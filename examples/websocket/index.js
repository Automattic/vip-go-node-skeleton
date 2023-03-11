const http = require( 'http' );
const IntegerSocketServer = require( './websocket' );

const PORT = process.env.PORT || 3000;

const app = http.createServer( ( req, res ) => {
	const baseUrl = `http://${ req.headers.host }`;
	const { pathname: requestPath } = new URL( req.url, baseUrl );

	/**
	 * Handle health checks
	 * https://docs.wpvip.com/technical-references/vip-platform/node-js/
	 *
	 * This is a requirement for any application running on WordPress VIP:
	 *
	 * - must handle url "/cache-healthcheck?" with trailing question mark
	 * - must respond with a 200 status code
	 * - must send a short response (e.g., "ok")
	 * - must respond immediately, without delay
	 * - must prioritize this above other routes
	 *
	 * Test: curl -v "https://example.com/cache-healthcheck?"
	 */
	if ( '/cache-healthcheck' === requestPath && [ 'GET', 'HEAD' ].includes( req.method ) ) {
		res.writeHead( 200 );
		res.end( 'ok' );
		return;
	}
	
	if ( '/' === requestPath && [ 'GET', 'HEAD' ].includes( req.method ) ) {
		res.writeHead( 200 );
    	res.end( 'Howdy!' );
		return;
	}

	res.writeHead( 404 );
	res.end();
} );

app.on( 'listening', () => {
	console.log( 'App is listening on port:', PORT );
	console.log( 'Try this command in another terminal window:\n' );
	console.log( `websocat "ws://localhost:${ PORT }/_ws/"` );
} );

// Create a single, shared WebSocket server.
const socketServer = new IntegerSocketServer();

app.on( 'upgrade', ( req, socket, head ) => {
	const baseUrl = `http://${ req.headers.host }`;
	const { pathname: requestPath } = new URL( req.url, baseUrl );

  if ( requestPath.startsWith( '/socket.io/' ) || requestPath.startsWith( '/_ws/' ) ) {
		socketServer.onConnectionUpgrade( req, socket, head );
    return;
  }

	// WebSocket connections are not supported on VIP at any other path.
  socket.destroy();
} );

app.listen( PORT );
