import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink 
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  link?: {
    text: string;
    url: string;
  };
}

const steps: Step[] = [
  {
    number: 1,
    title: "ADD ITEMS TO SHOPPING CART",
    description: "Browse our shop and add your desired products to the cart."
  },
  {
    number: 2,
    title: "SCREEN SHOT YOUR SHOPPING CART",
    description: "Take a screenshot of your final cart before checkout."
  },
  {
    number: 3,
    title: "SEND SCREEN SHOT TO SIGNAL",
    description: "Contact us via Signal with your shopping cart screenshot."
  },
  {
    number: 4,
    title: "SEND PAYMENT AND GET TRACKING",
    description: "Complete your payment and receive tracking information."
  },
  {
    number: 5,
    title: "GET VERIFIED",
    description: "Get verified through our secure process to complete your order.",
    link: {
      text: "Open Signal App",
      url: "https://signal.me/#eu/example"
    }
  }
];

export default function OrderStepsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = steps.length;

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
    <section id="how-to-order" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-montserrat mb-2">How To Order</h2>
          <p className="max-w-2xl mx-auto">Follow these simple steps to place your order</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div key={index} className="min-w-full p-4">
                  <Card className="bg-primary border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="bg-accent text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                          {step.number}
                        </div>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p>{step.description}</p>
                          {step.link && (
                            <a 
                              href={step.link.url} 
                              className="inline-block mt-2 text-accent hover:underline flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {step.link.text} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="default" 
            size="icon" 
            className="absolute top-1/2 left-0 -ml-4 transform -translate-y-1/2 bg-accent text-primary p-2 rounded-full shadow-lg z-10 hover:bg-accent/90"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="absolute top-1/2 right-0 -mr-4 transform -translate-y-1/2 bg-accent text-primary p-2 rounded-full shadow-lg z-10 hover:bg-accent/90"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="flex justify-center mt-6 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-accent" : "bg-gray-700"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button 
            variant="outline" 
            className="bg-[#0088cc] hover:bg-[#0099dd] text-white border-[#0088cc] w-full sm:w-auto" 
            asChild
          >
            <a 
              href="https://t.me/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm2.692 14.889c.161.12.361.18.561.18.227 0 .454-.071.649-.213.365-.266.52-.723.379-1.14l-1.883-5.647 4.601-3.073c.336-.225.476-.645.345-1.021-.132-.377-.519-.622-.924-.603l-5.5.255-1.651-5.098c-.124-.384-.479-.646-.881-.646s-.757.262-.881.646l-1.651 5.098-5.5-.255c-.404-.02-.792.226-.924.603-.132.376.009.796.345 1.021l4.601 3.073-1.883 5.647c-.141.417.015.874.379 1.14.195.142.423.213.649.213.2 0 .4-.059.561-.18l4.593-3.092 4.593 3.092z" />
              </svg>
              Contact on Telegram
            </a>
          </Button>
          <Button 
            variant="outline" 
            className="bg-[#3a76f0] hover:bg-[#4a86ff] text-white border-[#3a76f0] w-full sm:w-auto" 
            asChild
          >
            <a 
              href="https://signal.me/#eu/example" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm-3.5 9.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm3.5 0c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm3.5 0c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5z" />
              </svg>
              Contact on Signal
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
