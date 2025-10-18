import { useUser } from "@/contexts/UserContext";
import getNameForKeyValue from "@/utils/keycaps/keycap-lookup";
import { useContext, useEffect, useRef } from "react";

/* TO DO: Prevent listening when focused on something (e.g. input field, checkbox)
 * Must also use useUser hook to translate modifier keys between operating systems (e.g. Ctrl and Meta).
*/

type KeyName =   
    | "Backspace"
    | "Tab"
    | "Enter"
    | "Shift"
    | "Control"
    | "Meta"
    | "Alt"
    | "Pause"
    | "CapsLock"
    | "Escape"
    | " "
    
    // Navigation keys
    | "PageUp"
    | "PageDown"
    | "Home"
    | "End"
    | "Insert"
    | "Delete"
    | "ArrowUp"
    | "ArrowDown"
    | "ArrowLeft"
    | "ArrowRight"
    
    | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
    
    | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" 
    | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" 
    | "U" | "V" | "W" | "X" | "Y" | "Z"
  
    | "`" | "~"
    | "-" | "_"
    | "=" | "+"
    | "[" | "{"
    | "]" | "}"
    | "\\" | "|"
    | ";" | ":"
    | "'" | "\""
    | "," | "<"
    | "." | ">"
    | "/" | "?"

interface KeyCapProps {
    keyName: KeyName;
    onKeyPress?: () => void;
}

const KeyCap: React.FC<KeyCapProps> = ({ keyName, onKeyPress }) => {
    const keyRef = useRef<HTMLDivElement>(null);
    const { os } = useUser();
    if(keyName === "Control" && os === "MacOS") {
        keyName = "Meta"
    } else if (keyName === "Meta" && os !== "MacOS") {
        keyName = "Control"
    }

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if(!onKeyPress) return;
            if (e.key === keyName) {
                keyRef.current?.classList.add("active");
            }
        };
        
        const handleGlobalKeyUp = (e: KeyboardEvent) => {
            if(!onKeyPress) return;
            if(e.key === keyName) {
                keyRef.current?.classList.remove("active");
                onKeyPress();
            }
        }

        const handleMouseDown = () => {
            keyRef.current?.classList.add("active");
        }

        const handleMouseUp = () => {
            keyRef.current?.classList.remove("active")
            if(!onKeyPress) return;
            onKeyPress();
        }

        const handleMouseLeave = () => {
            keyRef.current?.classList.remove("active")
        }

        keyRef.current?.addEventListener('mousedown', handleMouseDown);
        keyRef.current?.addEventListener('mouseup', handleMouseUp);
        keyRef.current?.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('keydown', handleGlobalKeyDown);
        document.addEventListener('keyup', handleGlobalKeyUp)

        return () => {
            keyRef.current?.removeEventListener('mousedown', handleMouseDown);
            keyRef.current?.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.removeEventListener('keyup', handleGlobalKeyUp)
        };
    }, [keyName]);

    useEffect(() => {
        if(onKeyPress) {
            keyRef.current?.classList.add("clickable");
        }
    })

    const { name, systemFont } = getNameForKeyValue(keyName, os)

    return (
        <div ref={keyRef} className="keycap--wrap">
            <p className={`keycap--display ${systemFont ? 'system-font' : ''}`}>{name}</p>
        </div>
    )
}

export default KeyCap;