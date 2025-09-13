import { useEffect, useState } from "react";
import { getExtensionsForMimeType } from "../../../../utils/mime-lookup";
import IconFileTypeArchive from "../../../icons/Files/Archive";
import IconFileTypeOther from "../../../icons/Files/Other";
import Button from "../../Button";
import IconSecurity from "../../../icons/Security";
import IconBin from "../../../icons/Bin";


interface FilePreviewProps {
    file: { 
        name: string;
        type: string;
        size: number;
    }
    editMode: boolean;
}

type FileType = 'archive' | 'other'

const FilePreview: React.FC<FilePreviewProps> = ({ file, editMode }) => {
    const [fileType, setFileType] = useState<FileType>();
    const extensions = getExtensionsForMimeType(file.type);

    const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];

    function formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1000
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    useEffect(() => {
        if(extensions?.some(ext => archiveExtensions.includes(ext)) ) {
            setFileType('archive');
        } else {
            setFileType('other');
        }
    }, []);
    

    return (
        <div className="file-preview__wrap">
            <div className="file-preview__main">
                {fileType === 'archive' ? (
                    <IconFileTypeArchive className="file-preview__icon"></IconFileTypeArchive>
                ) : (
                    <IconFileTypeOther className="file-preview__icon"></IconFileTypeOther>
                )}
                <div className="file-preview__content">
                    <p><strong className="file-preview__name">{file.name}</strong></p>
                    <small>{formatBytes(file.size)}</small>
                </div>
            </div>
            <div className="file-preview__controls">
                <Button variant={editMode === true ? 'critical' : 'primary'} icon={editMode === true ? <IconBin></IconBin> : <IconSecurity></IconSecurity>}>
                    Hello
                </Button>
            </div>
        </div>
    )
}

export default FilePreview;