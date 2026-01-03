"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Settings, UserCircle } from "lucide-react";
import { useNavbar } from "@/hooks/useNavbar";
import DockIcon from "@/components/nav-components/DockIcon";
import NotificationIcon from "@/components/nav-components/NotificationIcon";
import NotificationPopup from "@/components/nav-components/NotificationPopup";
import ProfilePopup from "@/components/nav-components/ProfilePopup";
import SettingsPanel from "@/components/nav-components/SettingsPanel";

export default function Navbar() {
  const pathname = usePathname();
  const {
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
    setShowNotificationPopup,
    setshowProfilePopup,
    setshowSettings,
    setDockSettings,
    getThemeClasses,
  } = useNavbar();

  if (shouldHide) {
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
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
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
                <Icon strokeWidth={1.5} className="w-5 h-5" />

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

        <div className="w-px h-8 mx-1 bg-text/25" />

        {userState && (
          <>
            <div className="group relative">
              <DockIcon
                mouseX={mouseX}
                scale={dockSettings.scale}
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              >
                <NotificationIcon dockSettings={dockSettings} />
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
                  <UserCircle strokeWidth={1.5} className="w-5 h-5" />
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
            <Settings strokeWidth={1.5} className="w-5 h-5" />
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
