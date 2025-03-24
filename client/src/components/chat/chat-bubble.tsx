import { useState, useRef, useEffect } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { useAuth } from "@/hooks/use-auth";
import {
  MessageSquare,
  X,
  SendHorizontal,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { sendMessage, messages, isConnected } = useTelegram();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    await sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <Button
        onClick={toggleChat}
        className="bg-accent hover:bg-accent/90 text-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition transform hover:scale-110"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-primary rounded-lg shadow-xl overflow-hidden border border-border">
          <div className="bg-secondary p-4 flex justify-between items-center">
            <h3 className="font-bold">Chat with Us</h3>
            <span className={`inline-block w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></span>
          </div>
          
          <ScrollArea className="h-80 p-4">
            {messages.length === 0 ? (
              <div className="flex mb-3">
                <div className="bg-secondary max-w-[80%] rounded-lg p-3">
                  <p className="text-sm">Hi there! How can we help you today?</p>
                  <span className="text-xs text-gray-400 mt-1 block">Support Team • Just now</span>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex mb-3 ${msg.fromUser ? 'justify-end' : ''}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.fromUser ? 'bg-accent text-primary' : 'bg-secondary'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {msg.fromUser ? 'You' : 'Support Team'} • {
                        formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })
                      }
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {!user ? (
            <div className="p-3 border-t border-gray-700">
              <p className="text-sm text-center mb-2">
                Please sign in to chat with us
              </p>
              <Button 
                variant="default" 
                className="w-full"
                asChild
              >
                <a href="/auth">Sign In</a>
              </Button>
            </div>
          ) : (
            <div className="p-3 border-t border-gray-700">
              <Separator className="mb-3" />
              <p className="text-xs text-muted-foreground mb-3">
                You can also reach us directly:
              </p>
              <div className="flex gap-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs flex-1"
                  asChild
                >
                  <a 
                    href="https://t.me/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Telegram <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs flex-1"
                  asChild
                >
                  <a 
                    href="https://signal.me/#eu/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Signal <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
              <div className="flex">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 rounded-r-none"
                  disabled={!isConnected}
                />
                <Button 
                  className="bg-accent hover:bg-accent/90 text-primary rounded-l-none"
                  onClick={handleSendMessage}
                  disabled={!isConnected || !message.trim()}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
