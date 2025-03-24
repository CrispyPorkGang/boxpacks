import HeroSection from "@/components/home/hero-section";
import OrderStepsCarousel from "@/components/home/order-steps-carousel";
import CurrentSales from "@/components/home/current-sales";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <OrderStepsCarousel />
      <CurrentSales />
      
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-montserrat mb-4">Premium Quality Products</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Explore our extensive collection of premium quality products. We source only the finest selections to ensure customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                We provide only the highest quality products sourced from trusted growers and producers.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Choose between standard shipping or overnight options for quick delivery to your doorstep.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Support</h3>
              <p className="text-muted-foreground">
                Get assistance through our chat feature or connect with us directly via Telegram or Signal.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="default" 
              className="bg-accent hover:bg-accent/90 text-primary"
              asChild
            >
              <Link href="/shop">
                <a className="flex items-center">
                  Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
