import { useEffect } from "react";

const useKeyPress = (targetKey: string, enabled: boolean, callback: () => void) => {
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTextInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
    
      if (isTextInput) return;

      if (e.shiftKey && (e.key === targetKey.toLowerCase() || e.key === targetKey.toUpperCase())) {
        callback(); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetKey, enabled, callback]);
};

export default useKeyPress;