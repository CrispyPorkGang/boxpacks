import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

interface TelegramContextType {
  sendMessage: (message: string) => Promise<void>;
  messages: TelegramMessage[];
  isConnected: boolean;
}

interface TelegramMessage {
  id?: number;
  text: string;
  fromUser: boolean;
  timestamp: string;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      setIsConnected(false);
      return;
    }

    // Create WebSocket connection (using the same path as server)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Authenticate the user
      ws.send(JSON.stringify({
        type: 'auth',
        userId: user.id
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat') {
          setMessages(prev => [...prev, {
            text: data.message.text,
            fromUser: data.message.fromUser,
            timestamp: data.message.timestamp
          }]);
        } else if (data.type === 'history') {
          if (Array.isArray(data.messages)) {
            setMessages(data.messages.map((msg: any) => ({
              id: msg.id,
              text: msg.text,
              fromUser: msg.fromUser,
              timestamp: msg.timestamp
            })));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Chat Connection Error",
        description: "Failed to connect to chat service",
        variant: "destructive"
      });
      setIsConnected(false);
    };

    setSocket(ws);

    // Cleanup
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [user, toast]);

  const sendMessage = async (message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Chat Unavailable",
        description: "Chat connection not available",
        variant: "destructive"
      });
      return;
    }

    socket.send(JSON.stringify({
      type: 'chat',
      message
    }));

    // We don't add the message here because the server will echo it back
  };

  return (
    <TelegramContext.Provider value={{ sendMessage, messages, isConnected }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
}
