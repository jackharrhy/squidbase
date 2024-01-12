import type { ServerWebSocket } from "bun";

const clients = new Set<ServerWebSocket<unknown>>();

setInterval(() => {
  for (const client of clients) {
    const data = JSON.stringify({ hello: "world" });
    client.send(data);
  }
}, 1000 * 5);

Bun.serve({
  port: 4040,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log("message");
    },
    open(ws) {
      clients.add(ws);
    },
    close(ws, code, message) {
      clients.delete(ws);
      console.log("close");
    },
    drain(ws) {
      console.log("drain");
    },
  },
});
