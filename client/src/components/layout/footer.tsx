import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import { 
  FaTelegram, 
  FaInstagram, 
  FaTwitter, 
  FaEnvelope, 
  FaComment
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black pt-12 pb-6 border-t border-zinc-800/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Box<span className="text-gold">Packs</span></h3>
            <p className="text-zinc-400 mb-4">Premium quality products delivered discreetly to your doorstep.</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-zinc-400 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-zinc-400 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/yourusername" 
                className="text-zinc-400 hover:text-gold transition-colors"
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick <span className="text-gold">Links</span></h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-zinc-400 hover:text-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-zinc-400 hover:text-gold transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-zinc-400 hover:text-gold transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-zinc-400 hover:text-gold transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-gold transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact <span className="text-gold">Us</span></h3>
            <ul className="space-y-2">
              <li className="flex items-center text-zinc-400">
                <FaTelegram className="w-5 text-gold mr-2" />
                <a 
                  href="https://t.me/yourusername" 
                  className="hover:text-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @yourusername
                  <ExternalLink className="inline-block ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center text-zinc-400">
                <FaComment className="w-5 text-gold mr-2" />
                <a 
                  href="https://signal.me/#eu/example" 
                  className="hover:text-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Signal
                  <ExternalLink className="inline-block ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center text-zinc-400">
                <FaEnvelope className="w-5 text-gold mr-2" />
                <a 
                  href="mailto:info@boxpacks.com" 
                  className="hover:text-gold transition-colors"
                >
                  info@boxpacks.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800/50 pt-6 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} <span className="text-gold">BoxPacks</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
