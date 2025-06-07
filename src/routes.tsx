import { RouteObject, Navigate, Outlet } from "react-router-dom";
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

// Define routes configuration
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/shipping",
    element: <Shipping />,
  },
  {
    path: "/returns",
    element: <Returns />,
  },
  {
    path: "/sign-in/*",
    element: (
      <SignedOut>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </SignedOut>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <SignedOut>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </SignedOut>
    ),
  },
  {
    path: "/cart",
    element: (
      <SignedIn>
        <CartPage />
      </SignedIn>
    ),
  },
  {
    path: "/favorites",
    element: (
      <SignedIn>
        <FavoritesPage />
      </SignedIn>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Export a component that renders the routes with Suspense
const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Outlet />
      </Suspense>
      <BackToTopButton />
    </>
  );
};

export default AppRoutes;
