import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

// Lazy load Clerk components
const ClerkLoaded = lazy(() =>
  import("@clerk/clerk-react").then((mod) => ({ default: mod.ClerkLoaded }))
);
const ClerkLoading = lazy(() =>
  import("@clerk/clerk-react").then((mod) => ({ default: mod.ClerkLoading }))
);

// Lazy load routes
const AppRoutes = lazy(() => import("@/routes"));

// Loading component for Clerk
const ClerkLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ClerkProvider publishableKey={clerkPubKey}>
          <Suspense fallback={<ClerkLoadingFallback />}>
            <ClerkLoading>
              <ClerkLoadingFallback />
            </ClerkLoading>
            <ClerkLoaded>
              <BrowserRouter>
                <CartProvider>
                  <FavoritesProvider>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-grow">
                        <Suspense fallback={<ClerkLoadingFallback />}>
                          <AppRoutes />
                        </Suspense>
                      </main>
                      <Footer />
                      <Toaster />
                    </div>
                  </FavoritesProvider>
                </CartProvider>
              </BrowserRouter>
            </ClerkLoaded>
          </Suspense>
        </ClerkProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
