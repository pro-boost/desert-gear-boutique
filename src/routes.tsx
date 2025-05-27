import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import BackToTopButton from "@/components/ui/BackToTopButton";

// Lazy load all pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const ProductFormPage = lazy(() => import("./pages/ProductFormPage"));

// Loading component for routes
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Protected route component using Clerk
const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <RouteLoadingFallback />;
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  if (adminOnly && !user.publicMetadata.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />

          {/* Auth Routes */}
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
              </SignedOut>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <SignedIn>
                <CartPage />
              </SignedIn>
            }
          />
          <Route
            path="/favorites"
            element={
              <SignedIn>
                <FavoritesPage />
              </SignedIn>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute adminOnly>
                <ProductFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <ProductFormPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <BackToTopButton />
    </>
  );
};

export default AppRoutes;
