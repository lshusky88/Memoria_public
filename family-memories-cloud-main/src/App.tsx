
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import NewMemoryPage from "./pages/NewMemoryPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import FamilyPage from "./pages/FamilyPage";
import MemoriesPage from "./pages/MemoriesPage";
import MilestonesPage from "./pages/MilestonesPage";
import PhotoBooksPage from "./pages/PhotoBooksPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/memory/new" element={
                <ProtectedRoute>
                  <NewMemoryPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/family" element={
                <ProtectedRoute>
                  <FamilyPage />
                </ProtectedRoute>
              } />
              <Route path="/memories" element={
                <ProtectedRoute>
                  <MemoriesPage />
                </ProtectedRoute>
              } />
              <Route path="/milestones" element={
                <ProtectedRoute>
                  <MilestonesPage />
                </ProtectedRoute>
              } />
              <Route path="/photobooks" element={
                <ProtectedRoute>
                  <PhotoBooksPage />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
