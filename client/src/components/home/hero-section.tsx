import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Award, Truck, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pb-16 pt-24 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-black/95 to-black pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuNSA1OS41di01OWgtNTl2NTloNTl6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI4LDEyOCwxMjgsMC4wNykiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 flex items-center justify-center">
              <img src="/BOXPACKSLA_Logo-01.png" alt="BoxPacksLA" className="h-full" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <span className="text-white">Box<span className="text-gold">PacksLA</span></span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-zinc-200">
            Premium Cannabis Products Delivered
          </h2>
          
          <p className="text-lg mb-10 max-w-2xl mx-auto text-zinc-400 leading-relaxed">
            Experience top-quality cannabis products with discreet nationwide shipping. 
            Fast delivery, exceptional service, and premium quality guaranteed.
          </p>
          
          <div className="flex flex-wrap gap-5 justify-center mb-16">
            <Button
              size="lg"
              className="button-gold text-lg px-8 h-14 rounded-md shadow-lg shadow-gold/10"
              asChild
            >
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 hover:border-gold text-zinc-200 hover:text-gold text-lg px-8 h-14 rounded-md bg-black/20"
              asChild
            >
              <a href="#how-to-order">
                How To Order <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-black/30 border border-zinc-800/50 rounded-lg p-6 flex flex-col items-center text-center">
              <Award className="h-8 w-8 text-gold mb-3" />
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Premium Quality</h3>
              <p className="text-zinc-400 text-sm">Lab-tested products, hand-selected for potency and purity</p>
            </div>
            
            <div className="bg-black/30 border border-zinc-800/50 rounded-lg p-6 flex flex-col items-center text-center">
              <Truck className="h-8 w-8 text-gold mb-3" />
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Discreet Shipping</h3>
              <p className="text-zinc-400 text-sm">Secure, vacuum-sealed packaging with nationwide delivery</p>
            </div>
            
            <div className="bg-black/30 border border-zinc-800/50 rounded-lg p-6 flex flex-col items-center text-center">
              <Clock className="h-8 w-8 text-gold mb-3" />
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Fast Service</h3>
              <p className="text-zinc-400 text-sm">Quick processing and responsive customer support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
