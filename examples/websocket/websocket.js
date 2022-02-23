const { WebSocketServer } = require( 'ws' );

/**
 * A factory that produces integers and provides them to connected clients. The
 * factory only operates when clients are connected.
 *
 * The factory can produce two types of integers: odd and even. If the initial
 * seed is odd, it will continue to produce odd integers (west-coast-style). If
 * the integer is even (east-coast-style), then even integers come out.
 */
class IntegerService {
	/**
	 * The mysterious source of all integers.
	 */
	counter = 1;

	/**
	 * Interval in milliseconds.
	 */
	interval = 1000;

	/**
	 * WebSocketServer instance.
	 */
	wss = null;

	/**
	 * Constructor
	 */
	constructor( initialSeed = 1 ) {
		this.counter = parseInt( initialSeed, 10 );

		/**
		 * Create a "headless" WebSocketServer that we will use to handle connection
		 * upgrade requests. When Express receives a request to upgrade to a websocket,
		 * we will pass it to this server instance.
		 */
		this.wss = new WebSocketServer( { noServer: true } );
	}

	createInteger() {
		this.counter += 2;
		return this.counter;
	}

	/**
	 * Handle a newly connected client.
	 */
	onConnect( socket, req ) {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
		console.log( `WebSocket connection established from ${ ip }...` );

		socket.on( 'close', this.onClose.bind( this ) );
		socket.on( 'message', this.onMessage.bind( this ) );

		// Is the factory already online?
		if ( this.timer ) {
			return;
		}

		console.log( 'Bringing factory online....' );

		this.timer = setInterval( () => {
			this.wss.clients.forEach( client => client.send( this.createInteger() ) );
		}, this.interval );
	}

	/**
	 * Pass connection upgrade requests to the WebSocketServer.
	 */
	onConnectionUpgrade ( request, socket, head ) {
		this.wss.handleUpgrade( request, socket, head, this.onConnect.bind( this ) );
	}

	/**
	 * Handle any messages sent by connected clients.
	 */
	onMessage( message ) {
		console.log(`Received message from client: ${ message.toString() }`);
	}

	/**
	 * Cleanup when a client disconnects.
	 */
	onClose() {
		// There are still clients connected.
		if ( this.wss.clients.size ) {
			return;
		}

		console.log( 'No more clients, shutting down the factory....' );

		clearInterval( this.timer );
		this.timer = null;
	}
}

module.exports = IntegerService;
