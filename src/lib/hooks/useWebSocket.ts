"use client";

import { useEffect, useMemo } from "react";
import { useWsStore, type MessageHandler } from "@/stores/wsStore";

/**
 * Hook for subscribing to websocket updates within React components.
 */
export const useWebSocket = (options?: {
  autoConnect?: boolean;
  onMessage?: MessageHandler;
}) => {
  const { connect, disconnect, addGlobalListener, removeGlobalListener, isConnected } = useWsStore();

  useEffect(() => {
    if (options?.autoConnect) {
      connect();
    }
    return () => {
      if (options?.onMessage) {
        removeGlobalListener(options.onMessage);
      }
    };
  }, [options?.autoConnect, connect, options?.onMessage, removeGlobalListener]);

  useEffect(() => {
    if (!options?.onMessage) return;
    addGlobalListener(options.onMessage);
    return () => {
      removeGlobalListener(options.onMessage!);
    };
  }, [addGlobalListener, options?.onMessage, removeGlobalListener]);

  return useMemo(
    () => ({ connect, disconnect, isConnected }),
    [connect, disconnect, isConnected]
  );
};

export const useSessionWebSocket = (sessionId: string, handler: MessageHandler) => {
  const wsStore = useWsStore();
  const { addSessionListener, removeSessionListener } = wsStore;

  useEffect(() => {
    if (!sessionId) return;
    addSessionListener(sessionId, handler);
    return () => {
      removeSessionListener(sessionId, handler);
    };
  }, [sessionId, handler, addSessionListener, removeSessionListener]);
};
