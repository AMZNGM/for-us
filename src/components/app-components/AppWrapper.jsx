import { Suspense } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { AlertProvider } from "@/lib/AlertContext";
import Banner from "@/components/app-components/banner";
import LocomotiveScrollSetup from "@/components/app-components/LocomotiveScrollSetup";
import Navbar from "@/components/nav-components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ScrollToTopBtn from "@/components/app-components/ScrollToTopBtn";
import Footer from "@/components/footer-components/Footer";

export default function AppWrapper({ children }) {
  return (
    <AlertProvider>
      <AuthProvider>
        <Banner />
        <LocomotiveScrollSetup />
        <Navbar />
        <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
        <ScrollToTopBtn />
        <Footer />
      </AuthProvider>
    </AlertProvider>
  );
}
