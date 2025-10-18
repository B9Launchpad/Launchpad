import { useEffect, useRef } from "react";

/* TO DO: Prevent listening when focused on something (e.g. input field, checkbox)
 * Must also use useUser hook to translate modifier keys between operating systems (e.g. Ctrl and Meta).
*/
interface KeyCapProps {
    keyName: string;
    onKeyPress?: () => void;
}

const KeyCap: React.FC<KeyCapProps> = ({ keyName, onKeyPress }) => {
    const keyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!onKeyPress) return;
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === keyName) {
                keyRef.current?.classList.add("active");
            }
        };
        
        const handleGlobalKeyUp = (e: KeyboardEvent) => {
            if(e.key === keyName) {
                keyRef.current?.classList.remove("active");
                onKeyPress();
            }
        }

        document.addEventListener('keydown', handleGlobalKeyDown);
        document.addEventListener('keyup', handleGlobalKeyUp)

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.removeEventListener('keyup', handleGlobalKeyUp)
        };
    }, [keyName]);

    useEffect(() => {
        if(onKeyPress) {
            keyRef.current?.classList.add("clickable");
        }
    })

    const handleClick = () => {
        if(onKeyPress) { 
            keyRef.current?.classList.add("active");
            onKeyPress();
            keyRef.current?.classList.remove("active");
        }
    }

    return (
        <div ref={keyRef} onClick={handleClick} className="keycap--wrap">
            <p className="keycap--display">{keyName}</p>
        </div>
    )
}

export default KeyCap;