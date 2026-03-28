import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import Spots from "./pages/Spots";
import SpotDetail from "./pages/SpotDetail";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import SearchResults from "./pages/SearchResults";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSpots from "./pages/admin/AdminSpots";
import AdminSpotForm from "./pages/admin/AdminSpotForm";
import AdminLists from "./pages/admin/AdminLists";
import AdminListForm from "./pages/admin/AdminListForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="spots" element={<AdminSpots />} />
              <Route path="spots/new" element={<AdminSpotForm />} />
              <Route path="spots/:id" element={<AdminSpotForm />} />
              <Route path="lists" element={<AdminLists />} />
              <Route path="lists/new" element={<AdminListForm />} />
              <Route path="lists/:id" element={<AdminListForm />} />
            </Route>

            {/* Public routes */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="min-h-screen">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/spots" element={<Spots />} />
                      <Route path="/spot/:slug" element={<SpotDetail />} />
                      <Route path="/lists" element={<Lists />} />
                      <Route path="/list/:slug" element={<ListDetail />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
