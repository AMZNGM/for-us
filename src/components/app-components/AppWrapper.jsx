"use client";

import { AlertProvider } from "@/lib/AlertContext";
import { AuthProvider } from "@/lib/AuthContext";
import { LoadingProvider } from "@/components/loading-components/LoadingContext";
import { useAppLoading } from "@/hooks/useAppLoading";
import LoadingScreen from "@/components/loading-components/LoadingScreen";
import Banner from "@/components/app-components/banner";
import LocomotiveScrollSetup from "@/components/app-components/LocomotiveScrollSetup";
import Navbar from "@/components/nav-components/Navbar";
import ScrollToTopBtn from "@/components/app-components/ScrollToTopBtn";
import Footer from "@/components/footer-components/Footer";
import WelcomeMessage from "@/components/app-components/WelcomeMessage";
import ToggleableLoveElements from "@/components/app-components/ToggleableLoveElements";
import LoveCounter from "@/components/app-components/LoveCounter";
import InstaMessages from "@/components/app-components/InstaMessages";
import RomanticTodoList from "@/components/ui/RomanticTodoList";

function AppContent({ children }) {
  useAppLoading();

  return (
    <>
      <LoadingScreen />
      <Banner />
      <LocomotiveScrollSetup />
      <Navbar />
      <WelcomeMessage />
      <ToggleableLoveElements />
      <LoveCounter />
      <InstaMessages />
      <RomanticTodoList />
      {children}
      <ScrollToTopBtn />
      <Footer />
    </>
  );
}

export default function AppWrapper({ children }) {
  return (
    <AlertProvider>
      <AuthProvider>
        <LoadingProvider>
          <AppContent>{children}</AppContent>
        </LoadingProvider>
      </AuthProvider>
    </AlertProvider>
  );
}
