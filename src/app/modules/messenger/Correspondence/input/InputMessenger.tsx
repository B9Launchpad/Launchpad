import Button from "@/components/common/Button";
import { RefObject, useMemo, useRef, useState } from "react";
import MessengerIconFormatting from "../../icons/Formatting";
import IconUpload from "@/components/icons/Upload";
import MessengerIconSend from "../../icons/Send";
import { useSpring, animated } from "react-spring";
import SpringConfig from "@/utils/SpringConfig";

// LEXICAL

import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { lexicalTheme } from "./util/lexicalTheme";
import LexicalToolbarPlugin from "./util/LexicalToolbarPlugin";
import { $getRoot, EditorState } from "lexical";

const InputMessenger = () => {
    const placeholder = "Type something here..."
    const editableRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);

    const handleInput = (editorState: EditorState) => {
        const hasContent = editorState.read(() => {
            const root = $getRoot();
            const children = root.getChildren();
            return children.some(child => {
                if (child.getType() === 'paragraph') {
                    return child.getTextContent().trim() !== '';
                }
                return true;
            });
        });
        setIsEmpty(!hasContent);
    }

    const formattingSpringStyle = useSpring({
        height: isFormatting ? "auto" : 0,
        config: SpringConfig
    })

    const onLexicalError = (e: any): void => {
        console.error(e);
    }

    const lexicalConfig: InitialConfigType = {
        namespace: "messenger-input",
        theme: lexicalTheme,
        onError: onLexicalError
    }

    return (
        <div className="messenger__input-box flex-row gap-sm">
            <LexicalComposer initialConfig={lexicalConfig}>
                <div className="messenger__input--wrap">
                    <animated.div style={formattingSpringStyle} data-active={isFormatting} className="messenger__input--formatting">
                        <LexicalToolbarPlugin/>
                    </animated.div>
                    <div className="messenger__input--content">
                        <div className="messenger__input--editable-wrap">
                                <RichTextPlugin contentEditable={
                                    <ContentEditable
                                        className="messenger__input--editable" 
                                        contentEditable 
                                        data-placeholder={placeholder} 
                                        data-touched={!isEmpty}
                                        aria-placeholder={placeholder} 
                                        spellCheck 
                                        role={"textbox"} 
                                        aria-multiline
                                        ref={editableRef}
                                        //onInput={handleInput}
                                        placeholder={<></>}
                                    />}

                                    ErrorBoundary={LexicalErrorBoundary}
                                    >
                                </RichTextPlugin>
                                {/*<LinkPlugin/>*/}
                                <OnChangePlugin onChange={handleInput}/>
                            {/*<div
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
                            />*/}
                        </div>
                        <div className="messenger__input--tools flex-row gap-xs">
                            <Button onClick={() => {setIsFormatting(!isFormatting)}} icon={<MessengerIconFormatting/>} inline/>
                            <Button icon={<IconUpload/>} inline/>
                        </div>
                    </div>
                </div>
            </LexicalComposer>
            <span className="messenger__input--send-wrap">
                <Button icon={<MessengerIconSend/>}/>
            </span>
        </div>
    )
}

export default InputMessenger;