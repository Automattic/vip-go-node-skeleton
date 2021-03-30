var express = require( 'express' );
var app = express();
const PORT = process.env.PORT || 3000;

app.get( '/cache-healthcheck', function( req, res ) {
	res.sendStatus( 200 );
} );

app.get( '/', function( req, res ) {
	res.send( 'Howdy!' );
} );

app.listen( PORT, function() {
	console.log( 'App is listening on port:', PORT );
} );
