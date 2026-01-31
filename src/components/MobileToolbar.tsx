"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrahariStore } from "@/store/prahariStore";
import { 
  Camera, 
  Images, 
  BookOpen, 
  Play, 
  Sparkles,
  X
} from "lucide-react";

interface ToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface MobileToolbarProps {
  onOpenMemories: () => void;
  onOpenCorridor: () => void;
  onOpenStories: () => void;
  onStartSlideshow: () => void;
}

export default function MobileToolbar({
  onOpenMemories,
  onOpenCorridor,
  onOpenStories,
  onStartSlideshow,
}: MobileToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentPrahari } = usePrahariStore();

  const actions: ToolbarAction[] = [
    {
      id: "memories",
      icon: <Camera className="w-5 h-5" />,
      label: "Memories",
      action: onOpenMemories,
    },
    {
      id: "corridor",
      icon: <Images className="w-5 h-5" />,
      label: "Gallery",
      action: onOpenCorridor,
    },
    {
      id: "stories",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Lore",
      action: onOpenStories,
    },
    {
      id: "slideshow",
      icon: <Play className="w-5 h-5" />,
      label: "Slideshow",
      action: onStartSlideshow,
    },
  ];

  const handleAction = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Mobile Toolbar - Only visible on mobile, positioned above navigation */}
      <div className="fixed bottom-[72px] right-3 z-40 md:hidden flex flex-col items-end gap-2">
        <AnimatePresence>
          {isExpanded && (
            <>
              {actions.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  onClick={() => handleAction(item.action)}
                  className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full shadow-lg"
                  style={{
                    borderColor: `${currentPrahari.colors.accent}40`,
                  }}
                >
                  <span className="text-white/80">{item.icon}</span>
                  <span className="text-xs text-white/70 font-medium">{item.label}</span>
                </motion.button>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
          style={{
            backgroundColor: isExpanded ? currentPrahari.colors.accent : "rgba(0,0,0,0.6)",
            borderWidth: 2,
            borderColor: `${currentPrahari.colors.accent}50`,
          }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isExpanded ? 45 : 0 }}
        >
          {isExpanded ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </div>
    </>
  );
}
