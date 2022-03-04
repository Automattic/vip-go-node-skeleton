const { WebSocketServer } = require( 'ws' );
const IntegerForge = require( './integers' );

/**
 * A WebSocket server that produces integers and provides them to connected
 * clients. The same integers are provided to all connected clients. If no
 * clients are connected, integer-producing is paused.
 */
class IntegerSocketServer {
	/**
	 * IntegerForge
	 */
	forge = null;

	/**
	 * WebSocketServer instance.
	 */
	wss = null;

	/**
	 * Constructor
	 */
	constructor() {
		/**
		 * Create a single, shared instance of IntegerForge that will create
		 * integers for all connected clients.
		 */
		this.forge = new IntegerForge();

		/**
		 * Create a "headless" WebSocketServer that we will use to handle connection
		 * upgrade requests. When Express receives a request to upgrade to a websocket,
		 * we will pass it to this server instance.
		 */
		this.wss = new WebSocketServer( { noServer: true } );
	}

	/**
	 * Handle a newly connected client.
	 */
	onConnect( socket, req ) {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
		console.log( `WebSocket connection established from ${ ip }...` );

		socket.on( 'close', this.onClose.bind( this ) );
		socket.on( 'message', this.onMessage.bind( this ) );

		// Callback to send the created integer to each connected client.
		const sendInteger = ( integer ) => {
			this.wss.clients.forEach( client => client.send( integer ) );
		}

		// Start the forge.
		this.forge.start( sendInteger );
	}

	/**
	 * Pass connection upgrade requests to the WebSocketServer.
	 */
	onConnectionUpgrade ( request, socket, head ) {
		this.wss.handleUpgrade( request, socket, head, this.onConnect.bind( this ) );
	}

	/**
	 * Handle (ignore) any messages sent by connected clients.
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

		console.log( 'No more clients!' );
		this.forge.stop();
	}
}

module.exports = IntegerSocketServer;
