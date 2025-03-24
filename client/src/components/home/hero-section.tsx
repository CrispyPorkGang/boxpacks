import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero-section py-20 md:py-28 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gold-gradient">BoxPacks</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-zinc-200">
            Premium Cannabis Products Delivered
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-zinc-400">
            Experience top-quality cannabis products with discreet nationwide shipping. 
            Fast delivery, exceptional service, and premium quality guaranteed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="button-gold text-lg px-8 rounded-md"
              asChild
            >
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary text-lg px-8 rounded-md"
              asChild
            >
              <a href="#how-to-order">
                How To Order <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}
