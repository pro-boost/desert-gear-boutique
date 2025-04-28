
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RotateCcw, ShieldCheck, MessageCircle } from 'lucide-react';

const Returns = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold mb-8">{t('returns')}</h1>
          
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="p-6 rounded-lg bg-card">
              <RotateCcw className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">30 Jours</h3>
              <p className="text-muted-foreground">Pour retourner vos articles</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Garantie</h3>
              <p className="text-muted-foreground">Produits garantis 1 an</p>
            </div>
            
            <div className="p-6 rounded-lg bg-card">
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-muted-foreground">Assistance dédiée</p>
            </div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-heading font-semibold mb-4">Politique de Retour</h2>
            <p className="text-muted-foreground mb-6">
              Nous acceptons les retours dans les 30 jours suivant la réception de votre commande. Les articles doivent être dans leur état d'origine, non utilisés et dans leur emballage d'origine.
            </p>
            
            <h2 className="text-2xl font-heading font-semibold mb-4">Comment Retourner un Article</h2>
            <ol className="list-decimal pl-6 space-y-4 text-muted-foreground">
              <li>Contactez notre service client pour initier le retour</li>
              <li>Emballez soigneusement l'article avec tous les accessoires</li>
              <li>Utilisez l'étiquette de retour fournie</li>
              <li>Déposez le colis au point de collecte indiqué</li>
            </ol>
            
            <h2 className="text-2xl font-heading font-semibold mb-4">Remboursements</h2>
            <p className="text-muted-foreground mb-6">
              Le remboursement sera effectué sous 5-10 jours ouvrables après réception et vérification du retour. Le montant sera crédité sur le mode de paiement utilisé lors de l'achat.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Returns;
