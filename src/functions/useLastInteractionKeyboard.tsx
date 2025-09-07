import { useEffect, useState } from "react";

function useLastInteractionKeyboard(): boolean {
  const [isKeyboard, setIsKeyboard] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => setIsKeyboard(true);
    const handleMouseDown = () => setIsKeyboard(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboard;
}

export default useLastInteractionKeyboard;