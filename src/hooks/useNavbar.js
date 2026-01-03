import { useState, useEffect } from "react";
import { useMotionValue } from "motion/react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, onAuthChange } from "@/lib/firebase";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Home,
  Rss,
  UserCircle,
  Settings,
  Sparkles,
  Palette,
  Plus,
} from "lucide-react";

export function useNavbar() {
  const pathname = usePathname();
  const mouseX = useMotionValue(null);
  const isMobile = useIsMobile(768);
  const [isVisible, setIsVisible] = useState(true);
  const [userState, setUserState] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfilePopup, setshowProfilePopup] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showSettings, setshowSettings] = useState(false);
  const [dockSettings, setDockSettings] = useState({
    scale: 1,
    position: "bottom",
    theme: "glass",
    color: "yellow",
    autoHide: false,
  });

  const navLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/factoftheday", icon: Rss, label: "Fact of the day" },
    { href: "/new-post", icon: Plus, label: "Add New fact" },
    { href: "/yassirasart", icon: Palette, label: "Yassira's Art" },
    { href: "/yassirita", icon: Sparkles, label: "Yassirita" },
  ];

  // Update dock position based on mobile state
  useEffect(() => {
    const newPosition = isMobile ? "top" : "bottom";
    setDockSettings((prev) => ({
      ...prev,
      position: newPosition,
    }));
  }, [isMobile]);

  // Auth state management
  useEffect(() => {
    const unsub = onAuthChange((u) => setUserState(u));
    return unsub;
  }, []);

  // Profile loading
  useEffect(() => {
    async function load() {
      if (!userState) return setProfile(null);
      const ref = doc(db, "users", userState.uid);
      const snap = await getDoc(ref);
      setProfile(snap.exists() ? snap.data() : null);
    }
    load();
  }, [userState]);

  // Auto-hide functionality
  useEffect(() => {
    if (!dockSettings.autoHide) {
      setIsVisible(true);
      return;
    }

    let timeout;
    const handleMouseMove = (e) => {
      const threshold =
        dockSettings.position === "bottom" ? window.innerHeight - 100 : 100;
      if (
        dockSettings.position === "bottom"
          ? e.clientY > threshold
          : e.clientY < threshold
      ) {
        setIsVisible(true);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsVisible(false);
          setShowNotificationPopup(false);
          setshowProfilePopup(false);
          setshowSettings(false);
        }, 2000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [dockSettings.autoHide, dockSettings.position]);

  // Click outside handler for notification popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotificationPopup &&
        !event.target.closest(".notification-container")
      ) {
        setShowNotificationPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotificationPopup]);

  const getThemeClasses = (returnType = "classes") => {
    const theme = dockSettings.theme;
    const themeClasses = {
      glass: "bg-bg/30 border-text/10 backdrop-blur-2xl text-main",
      dark: "bg-bg/90 border-main/10 backdrop-blur-xl text-main",
      colorful:
        "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-2xl border-white/20 text-red-400",
    };

    if (returnType === "name") {
      return theme;
    }
    return themeClasses[theme] || themeClasses.glass;
  };

  const shouldHide = pathname === "/" || pathname === "/login";

  return {
    // State
    mouseX,
    isVisible,
    userState,
    profile,
    showNotificationPopup,
    showProfilePopup,
    showSettings,
    dockSettings,
    navLinks,
    shouldHide,

    // Actions
    setShowNotificationPopup,
    setshowProfilePopup,
    setshowSettings,
    setDockSettings,
    getThemeClasses,
  };
}
