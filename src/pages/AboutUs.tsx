
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-8">{t('aboutUs')}</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="mb-12">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                alt="About Nidal Boots"
                className="w-full h-[400px] object-cover rounded-lg mb-8"
              />
              
              <p className="text-lg text-muted-foreground mb-6">
                {t('equipmentDescription')}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-heading font-semibold">Mission</h3>
                  <p className="text-muted-foreground">
                    Nous nous engageons à fournir des équipements militaires et tactiques de la plus haute qualité, en mettant l'accent sur la durabilité et la performance.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-heading font-semibold">Vision</h3>
                  <p className="text-muted-foreground">
                    Devenir le leader de référence dans le domaine des équipements militaires et tactiques au Maroc et en Afrique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
