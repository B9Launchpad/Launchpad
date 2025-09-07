import { useEffect, useState } from "react";


function useIsDarkTheme(): boolean {
  const [ isDark, setIsDark ] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
      
        const getIsDark = () =>
          document.documentElement.classList.contains("dark");
      
        // Set initial value on mount
        setIsDark(getIsDark());
    
        // Watch for changes
        const observer = new MutationObserver(() => {
          setIsDark(getIsDark());
        });
      
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      
        return () => observer.disconnect();
  }, [])

  return isDark;
}

export default useIsDarkTheme;