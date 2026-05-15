import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spokes } from "@/components/ui/spokes";

const PagePreloader = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    let loadFired = document.readyState === 'complete';
    let cancelled = false;

    const tryDismiss = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const delay = Math.max(200, 500 - elapsed);
      setTimeout(() => { if (!cancelled) setVisible(false); }, delay);
    };

    if (loadFired) {
      tryDismiss();
    }

    window.addEventListener('load', () => {
      loadFired = true;
      tryDismiss();
    });

    const fallback = setTimeout(() => {
      if (!loadFired) {
        loadFired = true;
        tryDismiss();
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      window.removeEventListener('load', tryDismiss);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <Spokes className="w-12 h-12 text-yellow-400" style={{ "--duration": "0.6s" } as React.CSSProperties} />
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                BuildMate
              </h1>
              <p className="text-sm text-yellow-400/70 mt-1 font-medium tracking-wider uppercase">
                Loading
              </p>
            </div>
            <div className="w-24 h-0.5 rounded-full bg-white/10 overflow-hidden mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PagePreloader;
