"use client";

import { create } from "zustand";

export type WebSocketMessage = {
  message_status: "start_of_message" | "in_progress" | "end_of_message" | "error";
  agent_response: string;
  session_id?: string;
  [key: string]: unknown;
};

export type MessageHandler = (data: WebSocketMessage) => void;

export type WebSocketState = {
  socket: WebSocket | null;
  isConnected: boolean;
  pendingQueue: string[];
};

export type WebSocketActions = {
  connect: (url?: string) => void;
  send: (payload: Record<string, unknown>) => Promise<void>;
  disconnect: () => void;
  addGlobalListener: (cb: MessageHandler) => void;
  removeGlobalListener: (cb: MessageHandler) => void;
  addSessionListener: (sessionId: string, cb: MessageHandler) => void;
  removeSessionListener: (sessionId: string, cb: MessageHandler) => void;
};

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;
const HEARTBEAT_INTERVAL = 25000;

let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let lastUrl: string | null = null;
let manualClose = false;

const globalListeners = new Set<MessageHandler>();
const sessionListeners = new Map<string, Set<MessageHandler>>();

export const useWsStore = create<WebSocketState & WebSocketActions>((set, get) => ({
  socket: null,
  isConnected: false,
  pendingQueue: [],
  connect: (url) => {
    const runtimeUrl = url || process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
    if (!runtimeUrl) {
      console.error("[WebSocket] Missing URL");
      return;
    }

    const { socket } = get();
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (socket && socket.readyState === WebSocket.CLOSING) {
      setTimeout(() => get().connect(runtimeUrl), 200);
      return;
    }

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    manualClose = false;
    lastUrl = runtimeUrl;

    const ws = new WebSocket(runtimeUrl);
    set({ socket: ws });

    ws.onopen = () => {
      set({ isConnected: true });
      reconnectAttempts = 0;
      startHeartbeat();
      flushQueue();
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        const sessionId = data.session_id;
        if (sessionId && sessionListeners.has(sessionId)) {
          sessionListeners.get(sessionId)!.forEach((cb) => cb(data));
        }
        globalListeners.forEach((cb) => cb(data));
      } catch (error) {
        console.error("[WebSocket] Failed to parse message", error);
      }
    };

    ws.onerror = () => {
      console.error("[WebSocket] Error");
    };

    ws.onclose = () => {
      set({ isConnected: false, socket: null });
      stopHeartbeat();
      if (manualClose) {
        return;
      }
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts += 1;
        const delay = Math.min(30000, RECONNECT_DELAY * reconnectAttempts);
        reconnectTimer = setTimeout(() => {
          get().connect(lastUrl || undefined);
        }, delay);
      }
    };
  },
  send: async (payload) => {
    const { socket, pendingQueue } = get();
    const message = JSON.stringify(payload);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      return;
    }
    if (socket && socket.readyState === WebSocket.CONNECTING) {
      set({ pendingQueue: [...pendingQueue, message] });
      return;
    }
    console.warn("[WebSocket] Not connected, queueing message");
    set({ pendingQueue: [...pendingQueue, message] });
  },
  disconnect: () => {
    const { socket } = get();
    manualClose = true;
    stopHeartbeat();
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (socket) {
      socket.close();
    }
    set({ socket: null, isConnected: false });
  },
  addGlobalListener: (cb) => {
    globalListeners.add(cb);
  },
  removeGlobalListener: (cb) => {
    globalListeners.delete(cb);
  },
  addSessionListener: (sessionId, cb) => {
    if (!sessionListeners.has(sessionId)) {
      sessionListeners.set(sessionId, new Set());
    }
    sessionListeners.get(sessionId)!.add(cb);
  },
  removeSessionListener: (sessionId, cb) => {
    const listeners = sessionListeners.get(sessionId);
    if (!listeners) return;
    listeners.delete(cb);
    if (listeners.size === 0) {
      sessionListeners.delete(sessionId);
    }
  },
}));

function flushQueue() {
  const store = useWsStore.getState();
  const { socket, pendingQueue } = store;
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  if (!pendingQueue.length) return;

  pendingQueue.forEach((message) => {
    try {
      socket.send(message);
    } catch (error) {
      console.error("[WebSocket] Failed to send queued message", error);
    }
  });
  store.pendingQueue.length = 0;
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    const { socket } = useWsStore.getState();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: "keepalive" }));
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}
