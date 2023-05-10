import { useState, useEffect } from "react";

const useKeyboardControls = () => {
  const [movement, setMovement] = useState({ moveForward: false, moveBackward: false, moveLeft: false, moveRight: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w") setMovement(m => ({ ...m, moveForward: true }));
      if (e.key === "s") setMovement(m => ({ ...m, moveBackward: true }));
      if (e.key === "a") setMovement(m => ({ ...m, moveLeft: true }));
      if (e.key === "d") setMovement(m => ({ ...m, moveRight: true }));
      if (e.key === " ") setMovement(m => ({ ...m, jump: true }));

    };

    const handleKeyUp = (e) => {
      if (e.key === "w") setMovement(m => ({ ...m, moveForward: false }));
      if (e.key === "s") setMovement(m => ({ ...m, moveBackward: false }));
      if (e.key === "a") setMovement(m => ({ ...m, moveLeft: false }));
      if (e.key === "d") setMovement(m => ({ ...m, moveRight: false }));
      if (e.key === " ") setMovement(m => ({ ...m, jump: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

export default useKeyboardControls;