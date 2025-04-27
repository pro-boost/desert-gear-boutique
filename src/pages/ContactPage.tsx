
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ContactPage = () => {
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {t('contactUs')}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted">
                <h2 className="font-semibold">Send us a message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Message subject" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Type your message here..." 
                    rows={5} 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Map */}
              <MapComponent />
              
              {/* Contact Details */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted">
                  <h2 className="font-semibold">{t('contactUs')}</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Mail className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t('email')}</h3>
                      <a href="mailto:contact@nidalboots.com" className="text-muted-foreground hover:text-primary">
                        contact@nidalboots.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Phone className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t('phone')}</h3>
                      <a href="tel:+212123456789" className="text-muted-foreground hover:text-primary">
                        +212 123-456789
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <MapPin className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t('address')}</h3>
                      <p className="text-muted-foreground">
                        123 Rue Exemple, Casablanca, Maroc
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium mb-3">{t('findUsOn')}</h3>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted/80 text-foreground p-2 rounded-full"
                      >
                        <Instagram size={20} />
                      </a>
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted/80 text-foreground p-2 rounded-full"
                      >
                        <Facebook size={20} />
                      </a>
                    </div>
                  </div>
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

export default ContactPage;
