import {
  createBrowserRouter,
  RouterProvider,
  type FutureConfig,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { routes } from "@/routes";

// Lazy load Clerk components
const ClerkLoaded = lazy(() =>
  import("@clerk/clerk-react").then((mod) => ({ default: mod.ClerkLoaded }))
);
const ClerkLoading = lazy(() =>
  import("@clerk/clerk-react").then((mod) => ({ default: mod.ClerkLoading }))
);

// Loading component for Clerk
const ClerkLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Create router with future flags
const router = createBrowserRouter(
  [
    {
      element: (
        <CartProvider>
          <FavoritesProvider>
            <div className="min-h-screen flex flex-col">
              <ScrollToTop />
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<ClerkLoadingFallback />}>
                  <Outlet />
                </Suspense>
              </main>
              <Footer />
              <Toaster />
            </div>
          </FavoritesProvider>
        </CartProvider>
      ),
      children: routes,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    } as Partial<FutureConfig>,
  }
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
              <RouterProvider router={router} />
            </ClerkLoaded>
          </Suspense>
        </ClerkProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
