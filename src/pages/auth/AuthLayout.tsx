
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AuthLayout = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;
