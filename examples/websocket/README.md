# Implement a WebSocket server

This example shows how to use [WebSockets][websockets] on WordPress VIP. WebSocket connections are supported only on specific paths:

- Paths starting with `/_ws/`
- Paths starting with `/socket.io/` (for compatibility with [`socket.io`][socket])

It is the responsibility of your application to enforce the usage of allowed paths.

Client requests must set the following request headers (the standard for most WebSocket client implementations):

```
Upgrade: websocket
Connection: upgrade
```

## Socket.io and polling

Note that, [by default, Socket.io first establishes a connection via long-polling][socket-polling] before (possibly) upgrading to a WebSocket. This polling transport is not supported on WordPress VIP because it requires that consecutive requests be routed automatically to the same container (sometimes called "sticky sessions").

To avoid this issue, as noted in the documentation linked above, configure your clients to only use the WebSocket transport:

```js
const socket = io( 'https://io.yourhost.com', {
  transports: [ 'websocket' ],
} );
```

## Autoreconnect

While WebSocket connections are long-lived, they do not last forever. Normal application lifecycle events such as deploys and autoscaling will destroy open connections without warning. You must instruct your clients to automatically reestablish connection when it is disrupted.

## Example: Integers as a service

This example starts an HTTP server and listens for WebSocket connections on any path starting with `/_ws/` or `/socket.io/`. It uses the [`ws`][ws] library to implement the WebSocket protocol and upgrade client requests.

It is a service that creates auto-incrementing integers. It only creates integers when a client is connected; otherwise it idles, waiting for the next connection. If multiple clients are connected, they each get the same integers. This example simulates multiple clients connecting to a common event source.

Just as a single HTTP server handles all HTTP connections, a single instance of our WebSocket server and integer service is shared by all client connections. Accidentially creating new resources for each connection will quickly lead to performance issues.

## Start the server

```sh
npm install
npm start
```

## Create a WebSocket connection

These commands use [`websocat`][websocat] to establish a WebSocket connection in the terminal. Experiment with multiple connections and connecting and disconnecting.

```sh
websocat "ws://localhost:3000/_ws/"
websocat "ws://localhost:3000/_ws/foo"
websocat "ws://localhost:3000/socket.io/"
websocat "ws://localhost:3000/socket.io/bar"
```

[socket]: https://socket.io
[socket-polling]: https://socket.io/docs/v4/using-multiple-nodes/
[websocat]: https://github.com/vi/websocat
[websockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
[ws]: https://github.com/websockets/ws
