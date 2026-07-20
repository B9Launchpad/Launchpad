import Button from "@/components/common/Button";
import { useMemo, useRef, useState } from "react";
import MessengerIconFormatting from "../Icons/Formatting";
import IconUpload from "@/components/icons/Upload";
import MessengerIconSend from "../Icons/Send";


const InputMessenger = () => {
    const placeholder = "Type something here..."
    const editableRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const checkEmpty = () => {
        const element = editableRef.current;
        if(!element) return;

        const text = element.innerText.trim();

        const hasContent = text.length > 0 || element.querySelector('*:not(br)');

        setIsEmpty(!hasContent);
    }

    const handleInput = () => checkEmpty();

    return (
        <div className="messenger__input-box flex-row gap-sm">
            <div className="messenger__input--wrap">
                <div 
                    className="messenger__input--editable" 
                    contentEditable 
                    data-placeholder={placeholder} 
                    data-touched={!isEmpty}
                    aria-placeholder={placeholder} 
                    spellCheck 
                    role={"textbox"} 
                    aria-multiline
                    ref={editableRef}
                    onInput={handleInput}
                />
                <div className="messenger__input--tools flex-row gap-xs">
                    <Button icon={<MessengerIconFormatting/>} inline/>
                    <Button icon={<IconUpload/>} inline/>
                </div>
            </div>
            <span className="messenger__input--send-wrap">
                <Button icon={<MessengerIconSend/>}/>
            </span>
        </div>
    )
}

export default InputMessenger;