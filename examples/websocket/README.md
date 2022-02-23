# Implement a WebSocket server

This example shows how to use WebSockets on WordPress VIP. WebSocket connections are supported only on specific paths:

- Paths starting with `/_ws`
- Paths starting with `/socket.io` (for compatibility with [`socket.io`][socket])

It is the responsibility of your server to enforce the usage of allowed paths.

Client requests must set the following request headers (the standard for most WebSocket client implementations):

```
Upgrade: websocket
Connection: upgrade
```

## Autoreconnect

While WebSocket connections are long-lived, they do not last forever. Normal application lifecycle events such as deploys and autoscaling will destroy open connections without warning. You must instruct your clients to automatically reestablish connection when it is disrupted.

## Integers as a service

This example starts an HTTP server and listens for WebSocket connections on any path starting with `/_ws` or `/socket.io`. It uses the [`ws`][ws] library to implement the WebSocket protocol and upgrade client requests.

It is a service that creates auto-incrementing integers of two types: odd and even. It only creates integers when a client is connected; otherwise it idles, waiting for the next connection. If multiple clients are connected, they each get the same integers (of their preferred type).

This simulates multiple clients connecting to a common event source. Note that we do not create a new instance of our integer service for each connection. This is especially important so that your WebSocket implementation can remain performant even under heavy load.

## Start the server

- `npm install`
- `npm start`

## Create a WebSocket connection

These examples use [`websocat`][websocat] to establish a WebSocket connection in the terminal. Experiment with multiple connections and connecting and disconnecting.

```
websocat "ws://localhost:3000/_ws/"
websocat "ws://localhost:3000/_ws/?even"
websocat "ws://localhost:3000/socket.io/foo"
websocat "ws://localhost:3000/socket.io/bar?even"
```

[socket]: https://socket.io
[websocat]: https://github.com/vi/websocat
[ws]: https://github.com/websockets/ws
