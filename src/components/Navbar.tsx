import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import {
  useUser,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Heart,
  Target,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { items: cartItems } = useCart();
  const { items: favoriteItems } = useFavorites();
  const { user, isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const cartItemsCount = cartItems.length;
  const favoriteItemsCount = favoriteItems.length;

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // Close mobile menu if it's open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between gap-2 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-[160px]">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-xl md:text-2xl font-heading font-bold text-primary tracking-tight">
              {t("siteTitle")}
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden lg:block"
          >
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("search")}
                className="w-full px-4 py-2 pl-10 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label={t("search")}
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={t("search")}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-auto">
            <Link to="/" className="nav-link">
              {t("home")}
            </Link>
            <Link to="/products" className="nav-link">
              {t("products")}
            </Link>
            <Link to="/contact" className="nav-link">
              {t("contactUs")}
            </Link>
            {isSignedIn && user?.publicMetadata.isAdmin && (
              <Link to="/admin" className="nav-link">
                {t("admin")}
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Cart and Favorites - Always visible */}
            <Link to="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Favorites"
              >
                <Heart size={20} />
                {favoriteItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {favoriteItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Theme, Language, and User - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground hover:text-primary"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Language Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Language Dropdown"
                  >
                    <Globe size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("fr")}>
                    Français {language === "fr" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")}>
                    العربية {language === "ar" && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop User Menu */}
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "flex",
                      userButtonTrigger: "flex",
                      userButtonPopoverCard: "w-[240px]",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="icon" aria-label="Sign In">
                    <User size={20} />
                  </Button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Mobile Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 left-0 w-full bg-background border-b border-border md:hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="w-full mb-4">
                  <div className="relative">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("search")}
                      className="w-full px-4 py-2 pl-10 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label={t("search")}
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={t("search")}
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-1 mb-4">
                  <Link
                    to="/"
                    className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("home")}
                  </Link>
                  <Link
                    to="/products"
                    className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("products")}
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("contactUs")}
                  </Link>
                </nav>

                {/* Mobile Theme and Language */}
                <div className="flex items-center gap-2 px-4 py-2 mb-4 border-t border-border pt-4">
                  {/* Theme Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-foreground hover:text-primary"
                  >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  </Button>

                  {/* Language Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Language Dropdown"
                      >
                        <Globe size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLanguage("fr")}>
                        Français {language === "fr" && "✓"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage("ar")}>
                        العربية {language === "ar" && "✓"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile User Menu */}
                <div className="pt-4 border-t border-border">
                  {isSignedIn ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2">
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              userButtonBox: "w-full flex justify-start",
                              userButtonTrigger: "w-full flex justify-start",
                              userButtonPopoverCard: "w-[240px]",
                            },
                          }}
                        />
                      </div>
                      {user?.publicMetadata.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-muted rounded-md transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t("admin")}
                        </Link>
                      )}
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2"
                      >
                        {t("login")}
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
