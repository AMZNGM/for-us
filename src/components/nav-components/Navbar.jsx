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
import ProfilePopup from "@/components/nav-components/ProfilePopup";
import SettingsPanel from "@/components/nav-components/SettingsPanel";

export default function Navbar() {
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [userState, setUserState] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);
  const mouseX = useMotionValue(null);
  const [dockSettings, setDockSettings] = useState({
    magnification: 60,
    distance: 140,
    position: "bottom",
    theme: "glass",
    showLabels: true,
    autoHide: false,
  });
  const getThemeClasses = () => {
    switch (dockSettings.theme) {
      case "glass":
        return "bg-black/30 backdrop-blur-2xl border-white/10";
      case "dark":
        return "bg-slate-900/90 backdrop-blur-xl border-white/5";
      case "colorful":
        return "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-2xl border-white/20";
      default:
        return "bg-black/30 backdrop-blur-2xl border-white/10";
    }
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

  if (pathname === "/" || pathname === "/login") {
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
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed ${
        dockSettings.position === "bottom" ? "bottom-4" : "top-4"
      } left-1/2 -translate-x-1/2 z-50`}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
    >
      <div className={`${getThemeClasses()} border rounded-3xl shadow-2xl p-2`}>
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <div key={link.href} className="relative group">
                <DockIcon
                  mouseX={mouseX}
                  href={link.href}
                  isActive={isActive}
                  magnification={dockSettings.magnification}
                  distance={dockSettings.distance}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </DockIcon>

                {dockSettings.showLabels && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    className={`absolute ${
                      dockSettings.position === "bottom"
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    } left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap pointer-events-none`}
                  >
                    {link.label}
                  </motion.div>
                )}
              </div>
            );
          })}

          <div className="w-px h-8 bg-white/20 mx-1" />

          {userState && (
            <>
              <div className="relative group">
                {/* <NotificationIcon /> */}
                <DockIcon
                  mouseX={mouseX}
                  onClick={() => setNotificationCount(0)}
                  magnification={dockSettings.magnification}
                  distance={dockSettings.distance}
                >
                  <NotificationIcon count={notificationCount} />
                </DockIcon>
                {dockSettings.showLabels && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    className={`absolute ${
                      dockSettings.position === "bottom"
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    } left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap pointer-events-none`}
                  >
                    Notifications
                  </motion.div>
                )}
              </div>

              <div className="relative group">
                <DockIcon
                  mouseX={mouseX}
                  onClick={() => setOpenProfile(!openProfile)}
                  magnification={dockSettings.magnification}
                  distance={dockSettings.distance}
                >
                  {profile?.avatarUrl || userState.photoURL ? (
                    <img
                      src={profile?.avatarUrl || userState.photoURL}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle
                      className="w-5 h-5 text-white"
                      strokeWidth={1.5}
                    />
                  )}
                </DockIcon>

                {dockSettings.showLabels && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    className={`absolute ${
                      dockSettings.position === "bottom"
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    } left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap pointer-events-none`}
                  >
                    Profile
                  </motion.div>
                )}

                {openProfile && (
                  <div onClick={() => setOpenProfile(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ProfilePopup onClose={() => setOpenProfile(false)} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="relative group">
            <DockIcon
              mouseX={mouseX}
              onClick={() => setOpenSettings(!openSettings)}
              isActive={openSettings}
              magnification={dockSettings.magnification}
              distance={dockSettings.distance}
            >
              <motion.div
                animate={{ rotate: openSettings ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Settings className="w-5 h-5 text-white" strokeWidth={1.5} />
              </motion.div>
            </DockIcon>

            {dockSettings.showLabels && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: -10 }}
                className={`absolute ${
                  dockSettings.position === "bottom"
                    ? "bottom-full mb-2"
                    : "top-full mt-2"
                } left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap pointer-events-none`}
              >
                Settings
              </motion.div>
            )}

            <SettingsPanel
              isOpen={openSettings}
              onClose={() => setOpenSettings(false)}
              dockSettings={dockSettings}
              setDockSettings={setDockSettings}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
