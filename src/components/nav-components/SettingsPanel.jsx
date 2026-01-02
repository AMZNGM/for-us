"use client";

import { motion } from "motion/react";
import CloseBtn from "@/components/ui/buttons/CloseBtn";

export default function SettingsPanel({
  isOpen,
  isVisible,
  onClose,
  dockSettings,
  setDockSettings,
}) {
  if (!isOpen) return null;

  const toggleColor = () => {
    const currentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-main")
      .trim();
    if (currentColor === "#faf000") {
      document.documentElement.style.setProperty("--color-main", "#c9a159");
    } else {
      document.documentElement.style.setProperty("--color-main", "#faf000");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y:
          dockSettings.position === "bottom"
            ? isVisible
              ? 0
              : 100
            : isVisible
            ? 0
            : -100,
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute right-1/2 w-80 bg-bg/95 rounded-2xl shadow-2xl border border-main/10 z-50 p-4
        ${dockSettings.position === "bottom" ? "bottom-18" : "top-18"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-text">Dock Settings</h3>
        <CloseBtn onClick={onClose} />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-text/75 mb-2">
            Scale: {dockSettings.scale * 100}%
          </label>
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={dockSettings.scale * 100}
            onChange={(e) =>
              setDockSettings((s) => ({
                ...s,
                scale: parseInt(e.target.value) / 100,
              }))
            }
            className={`w-full h-2 bg-main/20 accent-main rounded-lg appearance-none cursor-grab active:cursor-grabbing
              `}
          />
        </div>

        <div>
          <label className="block text-sm text-text/75 mb-2">
            Dock Position
          </label>
          <div className="flex gap-2">
            {["bottom", "top"].map((pos) => (
              <button
                key={pos}
                onClick={() =>
                  setDockSettings((s) => ({ ...s, position: pos }))
                }
                className={`flex-1 bg-main rounded-xl transition-all cursor-pointer py-2 px-4
                  ${
                    dockSettings.position === pos
                      ? "text-bg"
                      : "bg-text/10 text-text/70 hover:bg-text/20"
                  }
                `}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/75 mb-2">Theme</label>
          <div className="flex gap-2">
            {["glass", "dark", "colorful"].map((theme) => (
              <button
                key={theme}
                onClick={() => setDockSettings((s) => ({ ...s, theme }))}
                className={`flex-1 bg-main text-sm rounded-xl transition-all cursor-pointer py-2 px-4
                   ${
                     dockSettings.theme === theme
                       ? "text-bg"
                       : "bg-text/10 text-text/70 hover:bg-text/20"
                   }
                `}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/75 mb-2">Color</label>
          <div className="flex gap-2">
            {["yellow", "gold"].map((color) => (
              <button
                key={color}
                onClick={() => {
                  toggleColor();
                  setDockSettings((s) => ({ ...s, color }));
                }}
                className={`flex-1 bg-main text-sm rounded-xl transition-all cursor-pointer py-2 px-4 ${
                  dockSettings.color === color
                    ? "text-bg"
                    : "bg-text/10 text-text/70 hover:bg-text/20"
                }
                `}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text/75">Auto-hide</span>
          <button
            onClick={() =>
              setDockSettings((s) => ({ ...s, autoHide: !s.autoHide }))
            }
            className={`w-12 h-6 bg-main rounded-full transition-colors relative ${
              dockSettings.autoHide ? "" : "bg-text/20"
            }
            `}
          >
            <motion.div
              animate={{ x: dockSettings.autoHide ? 24 : 0 }}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-text rounded-full cursor-pointer"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
