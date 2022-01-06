/**
 * This example uses Express to serve static files
 */

const express = require( 'express' );
const path = require( 'path' );

const app = express();

/**
 * set up the POST and BASEURL from env vars
 * (or use defaults when testing)
 */
const PORT = process.env.PORT || 3000;
const BASEURL = process.env.BASEURL || 'http://localhost';

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
});

/**
 * Serve the React build (in client/build/) under the root (/) path
 */
app.use( '/', express.static( path.join( __dirname, '../client/build') ) );

/**
 * Listen for connections on the designated port
 * Each request is handled above
 */
app.listen( PORT, () => {
	console.log( `Static React example listening on ${BASEURL}:${PORT}` );
})