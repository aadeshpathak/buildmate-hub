import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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
    // Store scroll position on every route change
    const handleScroll = () => {
      try {
        sessionStorage.setItem(`scrollPos_${location.pathname}`, window.scrollY.toString());
      } catch (e) {
        // Ignore storage errors
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Restore scroll position only for non-product pages (dashboard, index, etc.)
    // Product detail pages should always start at top
    if (!location.pathname.startsWith('/product/')) {
      const deferFlag = sessionStorage.getItem(`scrollDefer_${location.pathname}`);
      if (!deferFlag) {
        const savedScrollPos = sessionStorage.getItem(`scrollPos_${location.pathname}`);
        if (savedScrollPos && parseInt(savedScrollPos, 10) > 0) {
          setTimeout(() => {
            window.scrollTo({ top: parseInt(savedScrollPos, 10), behavior: 'instant' });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    }
    // For product pages: explicitly ensure top position (no restoration)
    else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (!location.pathname.startsWith('/product/')) {
        try {
          sessionStorage.setItem(`scrollPos_${location.pathname}`, window.scrollY.toString());
        } catch (e) {
          // Ignore storage errors
        }
      }
    };
  }, [location.pathname]);

  return null;
};

const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
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
