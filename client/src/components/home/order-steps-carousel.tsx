import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShoppingCart,
  Camera,
  Send,
  CreditCard,
  ShieldCheck
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: {
    text: string;
    url: string;
  };
}

const steps: Step[] = [
  {
    number: 1,
    title: "ADD ITEMS TO CART",
    description: "Browse our shop and add your desired products to the cart.",
    icon: <ShoppingCart className="h-6 w-6 text-gold" />
  },
  {
    number: 2,
    title: "SCREENSHOT YOUR CART",
    description: "Take a screenshot of your final cart with all selected items.",
    icon: <Camera className="h-6 w-6 text-gold" />
  },
  {
    number: 3,
    title: "SEND TO SIGNAL",
    description: "Contact us via Signal with your shopping cart screenshot.",
    icon: <Send className="h-6 w-6 text-gold" />
  },
  {
    number: 4,
    title: "COMPLETE PAYMENT",
    description: "Follow payment instructions and receive tracking information.",
    icon: <CreditCard className="h-6 w-6 text-gold" />
  },
  {
    number: 5,
    title: "GET VERIFIED",
    description: "Complete verification through our secure process to finalize your order.",
    icon: <ShieldCheck className="h-6 w-6 text-gold" />,
    link: {
      text: "Open Signal App",
      url: "https://signal.me/#eu/example"
    }
  }
];

export default function OrderStepsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = steps.length;
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-to-order" className="py-24 bg-gradient-to-b from-black to-zinc-900 relative">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuNSA1OS41di01OWgtNTl2NTloNTl6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTAsNTAsNTAsMC4xKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">How To <span className="text-gold">Order</span></h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">Follow these simple steps to place your order</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div 
              ref={slideContainerRef}
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="bg-black/40 border border-zinc-800/70 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                          <div className="rounded-full w-16 h-16 bg-black/60 border border-gold/30 flex items-center justify-center mb-4">
                            {step.icon}
                          </div>
                          <div className="bg-gold text-black text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                            {step.number}
                          </div>
                        </div>
                        
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold mb-3 text-gold tracking-wide">{step.title}</h3>
                          <p className="text-zinc-300 mb-3 text-base">{step.description}</p>
                          {step.link && (
                            <a 
                              href={step.link.url} 
                              className="inline-flex items-center text-gold hover:text-gold/80 transition-colors font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {step.link.text} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 left-2 md:-left-5 transform -translate-y-1/2 border-zinc-700 bg-black/50 hover:bg-black hover:border-gold text-zinc-300 hover:text-gold p-2 rounded-full z-10 transition-colors"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 right-2 md:-right-5 transform -translate-y-1/2 border-zinc-700 bg-black/50 hover:bg-black hover:border-gold text-zinc-300 hover:text-gold p-2 rounded-full z-10 transition-colors"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-gold" : "bg-zinc-700 hover:bg-zinc-600"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <Button 
            variant="outline" 
            className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white border-[#0088cc] w-full md:w-auto h-12 px-6 rounded-md" 
            asChild
          >
            <a 
              href="https://t.me/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm2.692 14.889c.161.12.361.18.561.18.227 0 .454-.071.649-.213.365-.266.52-.723.379-1.14l-1.883-5.647 4.601-3.073c.336-.225.476-.645.345-1.021-.132-.377-.519-.622-.924-.603l-5.5.255-1.651-5.098c-.124-.384-.479-.646-.881-.646s-.757.262-.881.646l-1.651 5.098-5.5-.255c-.404-.02-.792.226-.924.603-.132.376.009.796.345 1.021l4.601 3.073-1.883 5.647c-.141.417.015.874.379 1.14.195.142.423.213.649.213.2 0 .4-.059.561-.18l4.593-3.092 4.593 3.092z" />
              </svg>
              Contact on Telegram
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-black/30 hover:bg-black/50 text-white border-gold/70 hover:border-gold w-full md:w-auto h-12 px-6 rounded-md" 
            asChild
          >
            <a 
              href="https://signal.me/#eu/example" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 260 260">
                <path d="M130 2C59.3 2 2 59.3 2 130s57.3 128 128 128 128-57.3 128-128S200.7 2 130 2zm0 22c58.9 0 106 47.1 106 106s-47.1 106-106 106S24 188.9 24 130 71.1 24 130 24z"/>
                <path d="M130.3 62c-5.3 0-8.6 3.1-8.6 8.4v59.1c0 5.7 3.3 8.4 8.6 8.4 5.2 0 8.5-2.8 8.5-8.4V70.3c0-5.2-3.3-8.4-8.5-8.4z"/>
                <circle cx="130.3" cy="179.9" r="10.7"/>
              </svg>
              Contact on Signal
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
