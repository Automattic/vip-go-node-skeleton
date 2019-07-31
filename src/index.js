import { server } from '@automattic/vip-go';

const requestHandler = ( req, res ) => {
    res.end( 'Hello from VIP Node Skeleton' );
};

const myServer = server( requestHandler );

myServer.listen();