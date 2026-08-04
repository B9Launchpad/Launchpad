import Button from "@/components/common/Button";
import { useMemo, useRef, useState } from "react";
import MessengerIconFormatting from "../Icons/Formatting";
import IconUpload from "@/components/icons/Upload";
import MessengerIconSend from "../Icons/Send";
import { useSpring, animated } from "react-spring";
import SpringConfig from "@/utils/SpringConfig";


const InputMessenger = () => {
    const placeholder = "Type something here..."
    const editableRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);

    const checkEmpty = () => {
        const element = editableRef.current;
        if(!element) return;

        const text = element.innerText.trim();

        const hasContent = text.length > 0 || element.querySelector('*:not(br)');

        setIsEmpty(!hasContent);
    }

    const handleInput = () => checkEmpty();

    const formattingSpringStyle = useSpring({
        height: isFormatting ? "auto" : 0,
        config: SpringConfig
    })

    return (
        <div className="messenger__input-box flex-row gap-sm">
            <div className="messenger__input--wrap">
                <animated.div style={formattingSpringStyle} data-active={isFormatting} className="messenger__input--formatting">
                    <div className="messenger__input--tools flex-row gap-xs">
                        <Button icon={<strong>B</strong>} inline/>
                        <Button icon={<i>I</i>} inline/>
                        <Button icon={<u>U</u>} inline/>
                        <Button icon={<s>S</s>} inline/>
                    </div>
                </animated.div>
                <div className="messenger__input--content">
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
                        <Button onClick={() => {setIsFormatting(!isFormatting)}} icon={<MessengerIconFormatting/>} inline/>
                        <Button icon={<IconUpload/>} inline/>
                    </div>
                </div>
            </div>
            <span className="messenger__input--send-wrap">
                <Button icon={<MessengerIconSend/>}/>
            </span>
        </div>
    )
}

export default InputMessenger;