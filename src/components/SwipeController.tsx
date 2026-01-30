"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePrahariStore } from "@/store/prahariStore";

export default function SwipeController() {
  const { currentPrahari, setPrahari, isTransitioning, setTransitioning, totalRotation, setTotalRotation } = usePrahariStore();
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const totalRotationRef = useRef(totalRotation);

  const minSwipeDistance = 50;

  // Sync ref with store value in effect to avoid React 19 ref mutation error
  useEffect(() => {
    totalRotationRef.current = totalRotation;
  }, [totalRotation]);

  const changePrahari = useCallback((id: number, direction: number) => {
    if (isTransitioning) return;
    setTransitioning(true);
    
    const newRotation = totalRotationRef.current + (direction * 45);
    setTotalRotation(newRotation);
    
    setPrahari(id);
    setTimeout(() => setTransitioning(false), 1200);
  }, [isTransitioning, setPrahari, setTotalRotation, setTransitioning]);

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

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPrahari.id, changePrahari]);

  return null; // Invisible component
}
