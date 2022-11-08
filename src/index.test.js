const assert = require( 'node:assert' );
const { describe, it } = require( 'node:test' );

describe( 'my application', () => {
  it( 'exists in a world where 1 = 1', () => {
    assert.strictEqual( 1, 1 );
  } );
} );
