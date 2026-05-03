import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "@/lib/firebase"; // Initialize Firebase
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";

const queryClient = new QueryClient();

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Store scroll position on every route change (except when coming back from product detail)
    const handleScroll = () => {
      if (!location.pathname.startsWith('/product/')) {
        sessionStorage.setItem(`scrollPos_${location.pathname}`, window.scrollY.toString());
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Restore scroll position for non-product pages
    if (!location.pathname.startsWith('/product/')) {
      const savedScrollPos = sessionStorage.getItem(`scrollPos_${location.pathname}`);
      if (savedScrollPos && parseInt(savedScrollPos, 10) > 0) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScrollPos, 10), behavior: 'instant' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    // Store scroll position when component unmounts (navigation away)
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (!location.pathname.startsWith('/product/')) {
        sessionStorage.setItem(`scrollPos_${location.pathname}`, window.scrollY.toString());
      }
    };
  }, [location.pathname]); // Only depend on pathname to avoid unnecessary re-runs

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollManager />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
