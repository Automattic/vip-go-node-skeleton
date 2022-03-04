/**
 * A foundry that forges integers.
 */
class IntegerForge {
	/**
	 * The mysterious source of all integers. 🔮
	 */
	counter = 0;

	/**
	 * Interval in milliseconds.
	 */
	interval = 1000;

	/**
	 * Interval timer.
	 */
	timer = null;

	/**
	 * Constructor
	 */
	constructor( interval = 1000 ) {
		this.interval = interval;
	}

	createInteger() {
		this.counter++;
		return this.counter;
	}

	start( callback ) {
		// Is forge already running?
		if ( this.timer ) {
			return;
		}

		console.log( 'Bringing forge online....' );

		this.timer = setInterval( () => {
			callback( this.createInteger() );
		}, this.interval );
	}

	stop() {
		console.log( 'Shutting down the forge....' );

		clearInterval( this.timer );
		this.timer = null;
	}
}

module.exports = IntegerForge;
