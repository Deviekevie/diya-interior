import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ProtectedRoute from "./Admin/ProtectedRoute";
import { ToastContainer } from "react-toastify";

import GalleryUnit from "./Pages/GalleryUnit";
import GalleryUpload from "./Admin/GalleryUpload";

// Lazy loaded pages
const Home = React.lazy(() => import("./Pages/Home"));
const About = React.lazy(() => import("./Pages/About"));
const Works = React.lazy(() => import("./Pages/Works"));
const Contact = React.lazy(() => import("./Pages/Contact"));
const Admin = React.lazy(() => import("./Admin/Admin"));
const AdminLogin = React.lazy(() => import("./Admin/AdminLogin"));

// Loading fallback
const Loading = () => (
  <div style={{ textAlign: "center", padding: "100px", fontSize: "18px" }}>
    Loading...</div>);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Gallery */}
          <Route path="/gallery/:category" element={<GalleryUnit />} />

          {/* Admin */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery-upload"
            element={
              <ProtectedRoute>
                <GalleryUpload />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                Page Not Found</h2>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <ToastContainer />
    </Router>
  );
}
