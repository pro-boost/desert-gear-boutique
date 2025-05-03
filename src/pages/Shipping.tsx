
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, PackageCheck, Clock } from 'lucide-react';

const Shipping = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-8">{t('shipping')}</h1>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="p-6 rounded-lg bg-card">
              <Truck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('standardDelivery')}</h3>
              <p className="text-muted-foreground">3-5 {t('businessDays')}</p>
              <p className="text-muted-foreground">{t('freeForOrders')} {'>'}500 DH</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card">
              <PackageCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('orderTracking')}</h3>
              <p className="text-muted-foreground">{t('realTimeTracking')}</p>
              <p className="text-muted-foreground">{t('emailNotifications')}</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('expressDelivery')}</h3>
              <p className="text-muted-foreground">1-2 {t('businessDays')}</p>
              <p className="text-muted-foreground">{t('surcharge')} 50 DH</p>
            </div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-heading font-semibold mb-4">{t('deliveryZones')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('deliveryZonesDescription')}
            </p>
            
            <h2 className="text-2xl font-heading font-semibold mb-4">{t('importantToKnow')}</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>{t('ordersProcessed')}</li>
              <li>{t('confirmationEmail')}</li>
              <li>{t('differentAddress')}</li>
              <li>{t('customerSupport')}</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
