"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db, onAuthChange } from "@/lib/firebase";
import {
  Home,
  Rss,
  UserCircle,
  Settings,
  Sparkles,
  Palette,
  Plus,
} from "lucide-react";
import DockIcon from "@/components/nav-components/DockIcon";
import NotificationIcon from "@/components/nav-components/NotificationIcon";
import NotificationPopup from "@/components/nav-components/NotificationPopup";
import ProfilePopup from "@/components/nav-components/ProfilePopup";
import SettingsPanel from "@/components/nav-components/SettingsPanel";

export default function Navbar() {
  const pathname = usePathname();
  const mouseX = useMotionValue(null);
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
    autoHide: false,
  });
  const getThemeClasses = (returnType = "classes") => {
    const theme = dockSettings.theme;
    const themeClasses = {
      glass: "bg-bg/30 border-text/10 backdrop-blur-2xl",
      dark: "bg-bg/90 border-main/50 backdrop-blur-xl",
      colorful:
        "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-2xl border-white/20",
    };

    if (returnType === "name") {
      return theme;
    }
    return themeClasses[theme] || themeClasses.glass;
  };
  const navLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/feed", icon: Rss, label: "Feed" },
    { href: "/new-post", icon: Plus, label: "Create New Post" },
    { href: "/yassirasart", icon: Palette, label: "Yassira's Art" },
    { href: "/yassirita", icon: Sparkles, label: "Yassirita" },
  ];

  useEffect(() => {
    const unsub = onAuthChange((u) => setUserState(u));
    return unsub;
  }, []);

  useEffect(() => {
    async function load() {
      if (!userState) return setProfile(null);
      const ref = doc(db, "users", userState.uid);
      const snap = await getDoc(ref);
      setProfile(snap.exists() ? snap.data() : null);
    }
    load();
  }, [userState]);

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
        timeout = setTimeout(() => setIsVisible(false), 2000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [dockSettings.autoHide, dockSettings.position]);

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

  if (pathname === "/1" || pathname === "/login") {
    return null;
  }

  return (
    <motion.nav
      initial={false}
      animate={{
        y:
          dockSettings.position === "bottom"
            ? isVisible
              ? 0
              : 100
            : isVisible
            ? 0
            : -100,
        scale: dockSettings.scale,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // onMouseMove={(e) => mouseX.set(e.clientX)}
      // onMouseLeave={() => mouseX.set(null)}
      className={`fixed left-1/2 -translate-x-1/2 z-50 max-md:scale-80 ${
        dockSettings.position === "bottom" ? "bottom-4" : "top-4"
      }`}
    >
      <div
        className={`flex items-center border rounded-3xl shadow-2xl gap-2 p-2 ${getThemeClasses()}`}
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <div key={link.href} className="group relative">
              <DockIcon
                href={link.href}
                mouseX={mouseX}
                isActive={isActive}
                scale={dockSettings.scale}
              >
                <Icon
                  strokeWidth={1.5}
                  className={`w-5 h-5 ${
                    getThemeClasses("name") === "dark"
                      ? "text-main"
                      : getThemeClasses("name") === "colorful"
                      ? "text-main"
                      : "text-text"
                  }`}
                />

                <div
                  className={`absolute left-1/2 -translate-x-1/2 bg-bg text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 px-3 py-1 ${
                    dockSettings.position === "bottom"
                      ? "bottom-full mb-4"
                      : "top-full mt-4"
                  }`}
                >
                  {link.label}
                </div>
              </DockIcon>
            </div>
          );
        })}

        <div
          className={`w-px h-8 mx-1 ${
            getThemeClasses("name") === "dark" ? "bg-main/25" : "bg-text/25"
          }`}
        />

        {userState && (
          <>
            <div className="group relative">
              <DockIcon
                mouseX={mouseX}
                scale={dockSettings.scale}
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              >
                <NotificationIcon getThemeClasses={getThemeClasses} />
              </DockIcon>

              <div
                className={`absolute left-1/2 -translate-x-1/2 bg-bg text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 px-3 py-1 ${
                  dockSettings.position === "bottom"
                    ? "bottom-full mb-4"
                    : "top-full mt-4"
                }`}
              >
                Notifications
              </div>

              {showNotificationPopup && (
                <NotificationPopup
                  onClose={() => setShowNotificationPopup(false)}
                  dockSettings={dockSettings}
                  isVisible={isVisible}
                />
              )}
            </div>

            <div className="group relative">
              <DockIcon
                mouseX={mouseX}
                scale={dockSettings.scale}
                onClick={() => setshowProfilePopup(!showProfilePopup)}
              >
                {profile?.avatarUrl || userState.photoURL ? (
                  <img
                    src={profile?.avatarUrl || userState.photoURL}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                  />
                ) : (
                  <UserCircle strokeWidth={1.5} className="w-5 h-5 text-text" />
                )}
              </DockIcon>

              <div
                className={`absolute left-1/2 -translate-x-1/2 bg-bg text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 px-3 py-1 ${
                  dockSettings.position === "bottom"
                    ? "bottom-full mb-4"
                    : "top-full mt-4"
                }`}
              >
                My Profile
              </div>

              {showProfilePopup && (
                <div onClick={() => setshowProfilePopup(false)}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ProfilePopup
                      onClose={() => setshowProfilePopup(false)}
                      dockSettings={dockSettings}
                      isVisible={isVisible}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="group relative">
          <DockIcon
            mouseX={mouseX}
            isActive={showSettings}
            scale={dockSettings.scale}
            onClick={() => setshowSettings(!showSettings)}
          >
            <Settings
              strokeWidth={1.5}
              className={`w-5 h-5 ${
                getThemeClasses("name") === "dark"
                  ? "text-main"
                  : getThemeClasses("name") === "colorful"
                  ? "text-main"
                  : "text-text"
              }`}
            />
          </DockIcon>

          <div
            className={`absolute left-1/2 -translate-x-1/2 bg-bg text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 px-3 py-1 ${
              dockSettings.position === "bottom"
                ? "bottom-full mb-4"
                : "top-full mt-4"
            }`}
          >
            Settings
          </div>

          <SettingsPanel
            isOpen={showSettings}
            isVisible={isVisible}
            dockSettings={dockSettings}
            setDockSettings={setDockSettings}
            onClose={() => setshowSettings(false)}
          />
        </div>
      </div>
    </motion.nav>
  );
}
