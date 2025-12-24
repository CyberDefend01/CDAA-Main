import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseEditor from "./pages/admin/AdminCourseEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLearningPaths from "./pages/admin/AdminLearningPaths";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminPlatformSettings from "./pages/admin/AdminPlatformSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/courses" element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
          <Route path="/admin/courses/new" element={<AdminProtectedRoute><AdminCourseEditor /></AdminProtectedRoute>} />
          <Route path="/admin/courses/:id/edit" element={<AdminProtectedRoute><AdminCourseEditor /></AdminProtectedRoute>} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
          <Route path="/admin/messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
          <Route path="/admin/testimonials" element={<AdminProtectedRoute><AdminTestimonials /></AdminProtectedRoute>} />
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
          <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
          <Route path="/admin/learning-paths" element={<AdminProtectedRoute><AdminLearningPaths /></AdminProtectedRoute>} />
          <Route path="/admin/certificates" element={<AdminProtectedRoute><AdminCertificates /></AdminProtectedRoute>} />
          <Route path="/admin/blog" element={<AdminProtectedRoute><AdminBlogPosts /></AdminProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<AdminProtectedRoute><AdminAuditLogs /></AdminProtectedRoute>} />
          <Route path="/admin/platform-settings" element={<AdminProtectedRoute><AdminPlatformSettings /></AdminProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;