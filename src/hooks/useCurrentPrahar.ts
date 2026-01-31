"use client";

import { useState, useEffect } from 'react';
import { getCurrentPrahar, getTimeRemainingInPrahar, FESTIVAL_CONFIG } from '@/lib/memoryService';

interface PraharStatus {
  currentPrahar: number | null;
  timeRemaining: { hours: number; minutes: number; seconds: number } | null;
  isFestivalActive: boolean;
  isAllowedDate: boolean;
}

export function useCurrentPrahar(): PraharStatus {
  const [status, setStatus] = useState<PraharStatus>({
    currentPrahar: null,
    timeRemaining: null,
    isFestivalActive: false,
    isAllowedDate: false,
  });

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const isAllowedDate = FESTIVAL_CONFIG.allowedDates.includes(todayStr) || FESTIVAL_CONFIG.devMode;

      const currentPrahar = getCurrentPrahar();
      const timeRemaining = getTimeRemainingInPrahar();
      
      setStatus({
        currentPrahar,
        timeRemaining,
        isFestivalActive: currentPrahar !== null,
        isAllowedDate,
      });
    };

    // Initial update
    updateStatus();

    // Update every second
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
