var express = require( 'express' );
var app = express();
const PORT = process.env.PORT || 3000;

// Used by the monitoring system on VIP to verify the health of the app
// Should return 200 when the app is healthy
// https://docs.wpvip.com/technical-references/vip-platform/node-js/
app.get( '/cache-healthcheck', function( req, res ) {
	res.sendStatus( 200 );
} );

app.get( '/', function( req, res ) {
	res.send( 'Howdy!' );
} );

app.listen( PORT, function() {
	console.log( 'App is listening on port:', PORT );
} );
