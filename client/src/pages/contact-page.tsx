import { FaTelegram } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            We're here to help with any questions you may have. Reach out to us through one of our secure messaging platforms below.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Telegram Contact Card */}
          <div className="bg-black/30 border border-zinc-800 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="bg-[#0088cc]/10 p-4 rounded-full mb-4 flex items-center justify-center">
              <img 
                src="/icons/telegram.png" 
                alt="Telegram" 
                className="h-12 w-12 object-contain" 
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Telegram</h3>
            <p className="text-zinc-400 mb-6">
              Fastest response times. Reach us instantly through our Telegram channel.
            </p>
            <Button 
              className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white border-[#0088cc] w-full md:w-auto h-12 px-6 rounded-md" 
              asChild
            >
              <a 
                href="https://t.me/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Contact on Telegram
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Signal Contact Card */}
          <div className="bg-black/30 border border-zinc-800 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="bg-zinc-900 p-4 rounded-full mb-4 flex items-center justify-center">
              <img 
                src="/icons/signal.png" 
                alt="Signal" 
                className="h-12 w-12 object-contain" 
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Signal</h3>
            <p className="text-zinc-400 mb-6">
              For the most secure and private communications, contact us through Signal.
            </p>
            <Button 
              className="bg-black/30 hover:bg-black/50 text-white border-gold/70 hover:border-gold w-full md:w-auto h-12 px-6 rounded-md" 
              asChild
            >
              <a 
                href="https://signal.me/#eu/example" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Contact on Signal
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}