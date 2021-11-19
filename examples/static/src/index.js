/**
 * This example uses Express to serve static files
 */

const express = require( 'express' );
const path = require( 'path' );

const app = express();

const PORT = process.env.PORT || 3000;
const BASEURL = process.env.BASEURL || 'http://localhost/';

/**
 * Handle healthcheck requests
 * 
 * This must be declared before any other routes
 * to ensure it has priority
 */
app.get( '/cache-healthcheck?', function (req, res) {
	res.status( 200 ).send( 'Ok' );
});

/**
 * uncomment this block to test
 */
/*
app.get( '/', (req, res) => {
	res.send( 'Hello!' );
})
*/

/**
 * Serve the files in public under the root (/) path
 */
app.use( '/', express.static( path.join( __dirname, 'public') ) );

app.listen( PORT, () => {
	console.log( `Static example listening on ${BASEURL}:${PORT}` );
})