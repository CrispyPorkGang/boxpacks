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
    <footer className="bg-secondary pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold font-montserrat mb-4">ChronicHub</h3>
            <p className="text-gray-400 mb-4">Premium quality products delivered discreetly to your doorstep.</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-foreground hover:text-accent transition"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-accent transition"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/yourusername" 
                className="text-foreground hover:text-accent transition"
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-accent transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  <a className="text-gray-400 hover:text-accent transition">Shop</a>
                </Link>
              </li>
              <li>
                <Link href="/account">
                  <a className="text-gray-400 hover:text-accent transition">My Account</a>
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  <a className="text-gray-400 hover:text-accent transition">Categories</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <FaTelegram className="w-5 text-accent mr-2" />
                <a 
                  href="https://t.me/yourusername" 
                  className="hover:text-accent transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @yourusername
                  <ExternalLink className="inline-block ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <FaComment className="w-5 text-accent mr-2" />
                <a 
                  href="https://signal.me/#eu/example" 
                  className="hover:text-accent transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Signal
                  <ExternalLink className="inline-block ml-1 h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="w-5 text-accent mr-2" />
                <a 
                  href="mailto:info@chronichub.com" 
                  className="hover:text-accent transition"
                >
                  info@chronichub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ChronicHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
