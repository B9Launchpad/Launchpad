import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadIcon from "../icons/Upload";
import useGetSupportedFormats from "../../functions/getSupportedFormats";
import Button from "./Button";


interface FileUploadProps {
    title: string;
    description?: string;
    isMandatory?: boolean;
    error?: string;
    disabled?: boolean;
    accept: string;
    allowMultiple: boolean;
    onFilesSelected?: (files: FileList | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    title,
    description,
    isMandatory = false,
    error = null,
    disabled = false,
    accept,
    allowMultiple,
    onFilesSelected
}) => {
    const { t } = useTranslation("components");
    const fileInputRef = useRef<HTMLInputElement>(null);    
    const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);  
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
    const [rejectedFilesCount, setRejectedFilesCount] = useState<number>(0);
    const { supportedFormats, mimeExtensions } = useGetSupportedFormats(accept);
    const [errorMessage, setErrorMessage] = useState<string | null>(error);

    const checkIsAllowed = (file: File): boolean => {
      return mimeExtensions.includes(file.type);
    }

// inside FileUpload component

const processFiles = (files: File[]) => {
  setErrorMessage(null);
  const filteredFiles = files.filter(checkIsAllowed);
  const rejectedCount = files.length - filteredFiles.length;

  const dataTransfer = new DataTransfer();
  filteredFiles.forEach(file => dataTransfer.items.add(file));

  setUploadedFiles(dataTransfer.files);
  if (onFilesSelected) onFilesSelected(dataTransfer.files);
  if (rejectedCount > 0) {
    setErrorMessage(t('fileupload.errorRejectedFiles', {count: rejectedCount}));
  } else {
    setErrorMessage('')
  }
};

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    alert(files.length)

    if (allowMultiple) {
      processFiles(files);
    } else if (files.length > 1) {
      processFiles([files[0]]);
    }
    setIsDraggedOver(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    processFiles(files);
  };


  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div className="input__wrap">
      <div className="input__content">
        <span className="input__title-content">
          <p className="input__title">{title}</p>
          {isMandatory && <p className="input__mandatory">*</p>}
        </span>
        {description && <p className="input__description">{description} {t('fileupload.supportedFormats', {formats: supportedFormats.join(", ")})}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={allowMultiple}
        accept={mimeExtensions}
        onChange={handleChange}
        disabled={disabled}
        style={{ display: "none" }}
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
        <em>{t("fileupload.drag")}</em>
        <small>{t("or", { ns: "general" })}</small>
        <Button type="button"  disabled={disabled}>
            {t("fileupload.browse")}
        </Button>
    </div>

      {errorMessage && <p className="input__error-message">{errorMessage}</p>}

      {/*uploadedFiles && (
        <ul className="input__file-list">
          {Array.from(uploadedFiles).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )*/}
    </div>
  );
};

export default FileUpload;