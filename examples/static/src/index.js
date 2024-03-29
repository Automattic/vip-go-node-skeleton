/**
 * This example uses Express to serve static files
 */

const express = require( 'express' );
const path = require( 'path' );

const app = express();

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
 * Serve the files in ./public under the root (/) path
 */
app.use( '/', express.static( path.join( __dirname, 'public') ) );

app.listen( PORT, () => {
	console.log( `Static example listening on ${BASEURL}:${PORT}` );
})