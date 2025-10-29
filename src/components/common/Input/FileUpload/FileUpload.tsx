import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadIcon from "../../../icons/Upload";
import useGetSupportedFormats from "../../../../functions/getSupportedFormats";
import Button from "../../Button";
import FilePreview from "./File";


interface FileUploadProps {
    title?: string;
    description?: string;
    isMandatory?: boolean;
    error?: string;
    disabled?: boolean;
    accept: string;
    allowMultiple?: boolean;
    onFilesSelected?: (files: FileList | null) => void;
    ariaLabel?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    title,
    description,
    isMandatory = false,
    error = null,
    disabled = false,
    accept,
    allowMultiple,
    onFilesSelected,
    ariaLabel = "File upload"
}) => {
    const { t } = useTranslation("components");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
    const [rejectedFilesCount, setRejectedFilesCount] = useState<number>(0);
    const { supportedFormats, mimeExtensions } = useGetSupportedFormats(accept);
    const [errorMessage, setErrorMessage] = useState<string | null>(error);

    const checkIsAllowed = (file: File): boolean => {
        return mimeExtensions.includes(file.type);
    }

    // inside FileUpload component

    // TO DO: 1. FIXED — Preview files get removed if new ones get dragged, this needs to be fixed.
    //        2. Read file contents and arrange them into base64 or other viable form to transmit to backend.
    //        3. PARTIALLY IMPLEMENTED: Implement delete button functionality (including small button as shown in Figma designs for File Previews)

    const processFiles = (files: File[]) => {
        setErrorMessage(null);
        const filteredFiles = files.filter(checkIsAllowed);
        const rejectedCount = files.length - filteredFiles.length;

        const dataTransfer = new DataTransfer();
        filteredFiles.forEach(file => dataTransfer.items.add(file));


        if (allowMultiple) {
            setUploadedFiles(prev => [
                ...prev,
                ...Array.from(dataTransfer.files),
            ]);
        } else {
            if (rejectedCount === 0) {
                setUploadedFiles(Array.from(dataTransfer.files));
            }
        }

        if (onFilesSelected) onFilesSelected(dataTransfer.files)
        if (rejectedCount > 0) {
            setErrorMessage(t('fileupload.errorRejectedFiles', { count: rejectedCount }));
        } else {
            setErrorMessage('')
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);

        if (allowMultiple) {
            processFiles(files);
        } else {
            processFiles([files[0]]);
        }
        setIsDraggedOver(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        processFiles(files);
    };

    const handleDelete = (index: number) => {
        if (!fileInputRef.current) return;
        const files = [...uploadedFiles];
        files.splice(index, 1)
        setUploadedFiles(files);
        fileInputRef.current.value = "";
    }


    const handleClick = () => {
        if (!disabled) fileInputRef.current?.click();
    };

    return (
        <div className="input__wrap">
            <div className="input__content">
                {title && (<span className="input__title-content">
                    <p className="input__title">{title}</p>
                    {isMandatory && <p className="input__mandatory">*</p>}
                </span>)}
                <p className="input__description">{description} {t('fileupload.supportedFormats', { formats: supportedFormats.join(", ") })}</p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple={allowMultiple}
                accept={mimeExtensions}
                onChange={handleChange}
                disabled={disabled}
                style={{ display: "none" }}
                aria-label={ariaLabel}
            />

            <div
                className={`input__file-upload ${errorMessage ? "error" : ""} ${isDraggedOver ? "dragged" : ""}`}
                onClick={handleClick}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (Array.from(e.dataTransfer.types).includes("Files")) {
                        setIsDraggedOver(true);
                    }
                }}
                onDragStart={() => setIsDraggedOver(true)}
                onDragLeave={() => setIsDraggedOver(false)}
                onDrop={handleDrop}
            >
                <UploadIcon />
                <em>{t("fileupload.drag", { count: allowMultiple ? 2 : 1 })}</em>
                <small>{t("or", { ns: "general" })}</small>
                <Button type="button" disabled={disabled}>
                    {t("fileupload.browse")}
                </Button>
            </div>

            {errorMessage && <p className="input__error-message">{errorMessage}</p>}

            {uploadedFiles && (
                <div className="input__file-list">
                    {Array.from(uploadedFiles).map((file, index) => (
                        <div key={index}>
                            <FilePreview file={file} editMode={true} handleClick={() => handleDelete(index)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;