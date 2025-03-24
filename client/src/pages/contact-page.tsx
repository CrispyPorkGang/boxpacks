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
            <div className="bg-[#0088cc]/10 p-4 rounded-full mb-4">
              <FaTelegram className="h-12 w-12 text-[#0088cc]" />
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
            <div className="bg-zinc-900 p-4 rounded-full mb-4">
              <svg className="h-12 w-12 text-gold" fill="currentColor" viewBox="0 0 260 260">
                <path d="M130 2C59.3 2 2 59.3 2 130s57.3 128 128 128 128-57.3 128-128S200.7 2 130 2zm0 22c58.9 0 106 47.1 106 106s-47.1 106-106 106S24 188.9 24 130 71.1 24 130 24z"/>
                <path d="M130.3 62c-5.3 0-8.6 3.1-8.6 8.4v59.1c0 5.7 3.3 8.4 8.6 8.4 5.2 0 8.5-2.8 8.5-8.4V70.3c0-5.2-3.3-8.4-8.5-8.4z"/>
                <circle cx="130.3" cy="179.9" r="10.7"/>
              </svg>
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