import { useCallback, useEffect, useState } from "react";
import { ACTIVATED_EVENT, DEACTIVATED_EVENT } from ".";

export const useKeepAliveActivated = (fn: () => void, name: string) => {

  const handleEvent = useCallback((e: any) => {
    console.log('??????e=', e)
    if (e.detail.name === name) {
      fn?.()
    }
  }, [fn, name]);

  useEffect(() => {
    window.addEventListener(ACTIVATED_EVENT, handleEvent);
    return () => {
      window.removeEventListener(ACTIVATED_EVENT, handleEvent);
    };
  }, [handleEvent]);
}

export const useKeepAliveDeactivated = (fn: () => void, name: string) => { 
  const handleEvent = useCallback((e: any) => {
    if (e.detail.name === name) {
      fn?.()
    }
  }, [fn, name]);

  useEffect(() => {
    window.addEventListener(DEACTIVATED_EVENT, handleEvent);
    return () => {
      window.removeEventListener(DEACTIVATED_EVENT, handleEvent);
    };
  }, [handleEvent]);
}