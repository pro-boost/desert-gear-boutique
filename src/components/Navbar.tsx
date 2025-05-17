import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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

          {/* Search Bar */}
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
                className="w-full px-4 py-2 pl-10 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23f97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cline%20x1%3D%2218%22%20y1%3D%226%22%20x2%3D%226%22%20y2%3D%2218%22%2F%3E%3Cline%20x1%3D%226%22%20y1%3D%226%22%20x2%3D%2218%22%20y2%3D%2218%22%2F%3E%3C%2Fsvg%3E')] [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:mr-2 [&::-webkit-search-cancel-button]:cursor-pointer"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center">
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

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="User Dropdown"
                  >
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem className="font-medium">
                        {t("yourAccount")}: {user.username}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/favorites">{t("favorites")}</Link>
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">{t("admin")}</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          window.location.href = "/";
                        }}
                      >
                        {t("logout")}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/auth/login">{t("login")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/auth/signup">{t("signup")}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center ">
              {/* Favorites */}
              <Link to="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Favorites"
                >
                  <Heart size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 z-10">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className=" absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
                aria-label="Mobile Menu Toggle"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-primary" />
                ) : (
                  <Menu size={20} />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-16 left-0 w-full z-50 md:hidden bg-background px-4 py-4 border-t border-border space-y-4 shadow-lg"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2 py-4">
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("search")}
                    className="w-full px-4 py-2 pl-10 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23f97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cline%20x1%3D%2218%22%20y1%3D%226%22%20x2%3D%226%22%20y2%3D%2218%22%2F%3E%3Cline%20x1%3D%226%22%20y1%3D%226%22%20x2%3D%2218%22%20y2%3D%2218%22%2F%3E%3C%2Fsvg%3E')] [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:mr-2 [&::-webkit-search-cancel-button]:cursor-pointer"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </form>
              <nav className="flex flex-col gap-4 px-4 py-4 border-t border-border space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1 hover:bg-muted rounded-md transition-colors"
                >
                  {t("home")}
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1 hover:bg-muted rounded-md transition-colors"
                >
                  {t("products")}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1 hover:bg-muted rounded-md transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </nav>
              <div className="flex justify-between items-end px-4  border-t border-border  space-y-4 ">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-foreground hover:text-primary"
                  aria-label="Theme Toggle"
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

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="User Dropdown"
                    >
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user ? (
                      <>
                        <DropdownMenuItem className="font-medium">
                          {t("yourAccount")}: {user.username}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/favorites">{t("favorites")}</Link>
                        </DropdownMenuItem>
                        {user.isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link to="/admin">{t("admin")}</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            window.location.href = "/";
                          }}
                        >
                          {t("logout")}
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/auth/login">{t("login")}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/auth/signup">{t("signup")}</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
