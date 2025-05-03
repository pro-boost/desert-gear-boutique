
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import MapComponent from '@/components/MapComponent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFeaturedProducts, getNewArrivals } from '@/services/productService';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const { t } = useLanguage();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollingDown = useRef(true);
  
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const newArrivals = getNewArrivals(4);
  
  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Select all elements that should be animated
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Set up scroll snap - only when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollingDown.current = currentScrollY > lastScrollY;
      setLastScrollY(currentScrollY);
      
      // Only apply scroll snapping when scrolling down
      if (scrollingDown.current) {
        const scrollPosition = currentScrollY + window.innerHeight / 2;
        
        let closestSection = null;
        let minDistance = Number.MAX_VALUE;
        
        sectionsRef.current.forEach((section) => {
          if (!section) return;
          
          const sectionTop = section.offsetTop;
          const distance = Math.abs(scrollPosition - sectionTop);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });
        
        if (closestSection && minDistance < 300) {
          closestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [lastScrollY]);
  
  // Simple debounce function
  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  
  
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Navbar />
      
      <main className="flex-grow snap-y snap-mandatory">
        {/* Hero Section with animated background */}
        <section 
          ref={(el) => (sectionsRef.current[0] = el)}
          className="relative bg-muted py-16 md:py-24 snap-start h-screen flex items-center overflow-hidden"
        >
          {/* Animated background */}
          <div className="hero-animated-bg absolute inset-0 w-full h-full">
            <div className="animate-float absolute top-10 left-[10%] w-32 h-32 rounded-full bg-primary/20 blur-2xl"></div>
            <div className="animate-float-delay absolute bottom-10 right-[10%] w-40 h-40 rounded-full bg-secondary/30 blur-3xl"></div>
            <div className="animate-float-slow absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-accent/20 blur-xl"></div>
            <div className="animate-pulse absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/10 blur-2xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 scroll-animate">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  {t('welcomeMessage')}
                </h1>
                <p className="text-lg mb-8 text-muted-foreground max-w-md">
                  {t('bestEquipment')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all">
                    <Link to="/products">{t('shopNow')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all">
                    <Link to="/contact">{t('contactUs')}</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 scroll-animate">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <img 
                    src="/placeholder.svg" 
                    alt={t("equipmentDescription")} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section 
          ref={(el) => (sectionsRef.current[1] = el)}
          className="py-16 snap-start min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold mb-8 scroll-animate">{t('featured')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className={`scroll-animate transition-all duration-300 delay-${index * 100}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-10 text-center scroll-animate">
              <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all">
                <Link to="/products">{t('exploreProducts')}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* New Arrivals Section */}
        <section 
          ref={(el) => (sectionsRef.current[2] = el)}
          className="py-16 bg-muted snap-start min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold mb-8 scroll-animate">{t('newArrivals')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, index) => (
                <div key={product.id} className={`scroll-animate transition-all duration-300 delay-${index * 100}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* About/Contact Section */}
        <section 
          ref={(el) => (sectionsRef.current[3] = el)}
          className="py-16 snap-start min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="scroll-animate">
                <h2 className="text-3xl font-heading font-bold mb-6">{t('aboutUs')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('aboutUsDescription')}
                </p>
                <p className="text-muted-foreground mb-6">
                  {t('productSelection')}
                </p>
                <Button asChild className="hover:scale-105 transition-all">
                  <Link to="/contact">{t('contactUs')}</Link>
                </Button>
              </div>
              <div className="scroll-animate">
                <MapComponent />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
