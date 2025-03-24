import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-gray-900 min-h-[500px] flex items-center">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4 leading-tight">
            Premium Quality <span className="text-accent">Products</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Shop our exclusive collection with overnight shipping available. Premium quality, exceptional service.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="default"
              className="bg-accent hover:bg-accent/90 text-primary font-medium py-3 px-6 transition transform hover:scale-105"
              asChild
            >
              <Link href="/shop">
                <a>Shop Now</a>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-foreground hover:border-accent text-foreground hover:text-accent font-medium py-3 px-6 transition"
              asChild
            >
              <a href="#how-to-order">
                How To Order
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-30 bg-gray-900" />
    </section>
  );
}
