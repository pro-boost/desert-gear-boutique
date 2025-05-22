import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import BackToTopButton from "./components/BackToTopButton";
import ProductFormPage from "./pages/ProductFormPage";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

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

        {/* Auth Routes */}
        <Route
          path="/sign-in/*"
          element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignedOut>
              <SignUpPage />
            </SignedOut>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTopButton />
    </>
  );
};

// Clerk Sign In Page
const SignInPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-muted hover:bg-muted/80",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
};

// Clerk Sign Up Page
const SignUpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-muted hover:bg-muted/80",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AppRoutes;
