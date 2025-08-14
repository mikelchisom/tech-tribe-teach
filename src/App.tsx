import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import StudentDashboard from "./pages/StudentDashboard";
import AdminCourseManager from "./pages/AdminCourseManager";
import LiveClasses from "./pages/LiveClasses";
import LiveClassDetails from "./pages/LiveClassDetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/admin-courses" element={<AdminCourseManager />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/live-classes/:id" element={<LiveClassDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
