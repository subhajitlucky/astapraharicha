"use client";

import { useEffect, useRef } from "react";
import { usePrahariStore } from "@/store/prahariStore";

export default function SwipeController() {
  const { currentPrahari, setPrahari, isTransitioning, setTransitioning, totalRotation, setTotalRotation } = usePrahariStore();
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;
      
      const distance = touchStart.current - touchEnd.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        changePrahari(currentPrahari.id === 8 ? 1 : currentPrahari.id + 1, 1);
      }
      if (isRightSwipe) {
        changePrahari(currentPrahari.id === 1 ? 8 : currentPrahari.id - 1, -1);
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    const changePrahari = (id: number, direction: number) => {
      if (isTransitioning) return;
      setTransitioning(true);
      
      const newRotation = totalRotation + (direction * 45);
      setTotalRotation(newRotation);
      
      setPrahari(id);
      setTimeout(() => setTransitioning(false), 1200);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPrahari.id, isTransitioning, setPrahari, setTransitioning]);

  return null; // Invisible component
}