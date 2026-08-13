import Button from "@/components/common/Button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    RangeSelection,
    SELECTION_CHANGE_COMMAND,
    TextFormatType,
    TextNode,
} from "lexical";
import { useEffect, useState, useCallback } from "react";

type ActiveFormats = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
};

const LexicalToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
    });

    const getActiveFormats = (selection: RangeSelection): ActiveFormats => {
        const nodes = selection.getNodes();
        const hasFormat = (format: TextFormatType) =>
            nodes.some(node => node instanceof TextNode && node.hasFormat(format));
    
        return {
            bold: hasFormat('bold') || selection.hasFormat('bold'),
            italic: hasFormat('italic') || selection.hasFormat("italic"),
            underline: hasFormat('underline') || selection.hasFormat("underline"),
            strikethrough: hasFormat('strikethrough') || selection.hasFormat("strikethrough"),
        };
    };

    const updateActiveFormats = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
                setActiveFormats({
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false,
                });
                return;
            }
            setActiveFormats(getActiveFormats(selection));
        });
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateActiveFormats();
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, updateActiveFormats]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updateActiveFormats();
        });
    }, [editor, updateActiveFormats]);

    const toggleFormat = (format: "bold" | "italic" | "underline" | "strikethrough") => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    return (
        <div className="messenger__input--tools flex-row gap-xs">
            <Button icon={<b>B</b>} inline data-active={activeFormats.bold} onClick={() => toggleFormat("bold")} />
            <Button icon={<i>I</i>} inline data-active={activeFormats.italic} onClick={() => toggleFormat("italic")} />
            <Button icon={<u>U</u>} inline data-active={activeFormats.underline} onClick={() => toggleFormat("underline")} />
            <Button icon={<s>S</s>} inline data-active={activeFormats.strikethrough} onClick={() => toggleFormat("strikethrough")} />
        </div>
    );
};

export default LexicalToolbarPlugin;