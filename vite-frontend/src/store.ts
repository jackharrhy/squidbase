import { create } from "zustand";

type SocketState = "connecting" | "connected" | "disconnected";

type Store = {
  ws?: WebSocket;
  messages: object[];
  socketState: SocketState;
  setupWs: () => void;
};

export const useStore = create<Store>()((set, get) => ({
  ws: undefined,
  socketState: "disconnected",
  messages: [],
  setupWs: () => {
    if (get().ws !== undefined) {
      throw new Error("ws already set up");
    }

    const socket = new WebSocket("ws://localhost:4040");
    set({ ws: socket, socketState: "connecting" });

    socket.addEventListener("open", () => {
      set({ socketState: "connected" });
    });

    socket.addEventListener("close", () => {
      set({ socketState: "disconnected" });
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      const data = JSON.parse(event.data);
      set((state) => ({ messages: [...state.messages, data] }));
    });
  },
}));

useStore.getState().setupWs();
