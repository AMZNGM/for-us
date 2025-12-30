"use client";

import { motion } from "framer-motion";

export default function SettingsPanel({
  isOpen,
  onClose,
  dockSettings,
  setDockSettings,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="absolute bottom-24 right-4 w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Dock Settings</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          <span className="text-white text-lg">×</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-white/70 mb-2 block">
            Icon Size: {dockSettings.magnification}px
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={dockSettings.magnification}
            onChange={(e) =>
              setDockSettings((s) => ({
                ...s,
                magnification: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-white/70 mb-2 block">
            Magnification Distance: {dockSettings.distance}px
          </label>
          <input
            type="range"
            min="100"
            max="200"
            value={dockSettings.distance}
            onChange={(e) =>
              setDockSettings((s) => ({
                ...s,
                distance: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-white/70 mb-2 block">
            Dock Position
          </label>
          <div className="flex gap-2">
            {["bottom", "top"].map((pos) => (
              <button
                key={pos}
                onClick={() =>
                  setDockSettings((s) => ({ ...s, position: pos }))
                }
                className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                  dockSettings.position === pos
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70 mb-2 block">Theme</label>
          <div className="flex gap-2">
            {["glass", "dark", "colorful"].map((theme) => (
              <button
                key={theme}
                onClick={() => setDockSettings((s) => ({ ...s, theme }))}
                className={`flex-1 py-2 px-4 rounded-xl transition-all text-sm ${
                  dockSettings.theme === theme
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Show Labels</span>
          <button
            onClick={() =>
              setDockSettings((s) => ({ ...s, showLabels: !s.showLabels }))
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              dockSettings.showLabels ? "bg-blue-500" : "bg-white/20"
            }`}
          >
            <motion.div
              animate={{ x: dockSettings.showLabels ? 24 : 0 }}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Auto-hide</span>
          <button
            onClick={() =>
              setDockSettings((s) => ({ ...s, autoHide: !s.autoHide }))
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              dockSettings.autoHide ? "bg-blue-500" : "bg-white/20"
            }`}
          >
            <motion.div
              animate={{ x: dockSettings.autoHide ? 24 : 0 }}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
