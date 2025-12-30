import { AuthProvider } from "@/lib/AuthContext";
import { AlertProvider } from "@/lib/AlertContext";
// import ErrorBoundary from "@/components/app-components/ErrorBoundary";
import Banner from "@/components/app-components/banner";
import LocomotiveScrollSetup from "@/components/app-components/LocomotiveScrollSetup";
import Navbar from "@/components/nav-components/Navbar";
import ScrollToTopBtn from "@/components/app-components/ScrollToTopBtn";
// import FooterWrapper from '@/components/footer-components/FooterWrapper'

export default function AppWrapper({ children }) {
  return (
    <AlertProvider>
      <AuthProvider>
        {/* <ErrorBoundary> */}
        <Banner />
        <LocomotiveScrollSetup />
        <Navbar />
        {children}
        <ScrollToTopBtn />
        {/* <FooterWrapper /> */}
        {/* </ErrorBoundary> */}
      </AuthProvider>
    </AlertProvider>
  );
}
