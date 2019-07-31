import { server, logger } from '@automattic/vip-go';

const log = logger( 'vip-node-skeleton:server-requests' );

const requestHandler = ( req, res ) => {
    log.info( `New request ${ req.method } to ${ req.url }` );
    res.end( 'Hello from VIP Node Skeleton' );
};

const myServer = server( requestHandler );

myServer.listen();