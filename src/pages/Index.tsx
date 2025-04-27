
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import MapComponent from '@/components/MapComponent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFeaturedProducts, getNewArrivals } from '@/services/productService';

const Index = () => {
  const { t } = useLanguage();
  
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const newArrivals = getNewArrivals(4);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  {t('welcomeMessage')}
                </h1>
                <p className="text-lg mb-8 text-muted-foreground max-w-md">
                  Le meilleur équipement militaire et tactique pour les professionnels et les passionnés.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary">
                    <Link to="/products">{t('shopNow')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/contact">{t('contactUs')}</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/placeholder.svg" 
                    alt="Military Boots" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold mb-8">{t('featured')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/products">{t('exploreProducts')}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* New Arrivals Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold mb-8">{t('newArrivals')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* About/Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">{t('aboutUs')}</h2>
                <p className="text-muted-foreground mb-4">
                  Nidal Boots est votre destination de confiance pour l'équipement militaire et tactique de haute qualité. Depuis notre fondation, nous nous sommes engagés à fournir les meilleurs produits aux professionnels et aux passionnés.
                </p>
                <p className="text-muted-foreground mb-6">
                  Notre sélection comprend des bottes militaires robustes, des vestes tactiques et des accessoires essentiels, tous soigneusement choisis pour leur qualité et leur durabilité.
                </p>
                <Button asChild>
                  <Link to="/contact">{t('contactUs')}</Link>
                </Button>
              </div>
              <div>
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
