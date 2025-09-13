import { useEffect, useState } from "react";
import { getExtensionsForMimeType } from "../../../../utils/mime-lookup";


interface FileViewProps {
    file: { 
        type: string;
        size: number;
    }
    editMode: boolean;
}

type FileType = 'archive' | 'other'

const FileView: React.FC<FileViewProps> = ({ file, editMode }) => {
    const [fileType, setFileType] = useState<FileType>();
    const extensions = getExtensionsForMimeType(file.type);

    const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];

    function formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1000
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PiB', 'EiB', 'ZiB', 'YiB']

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
        <>
            <p>{fileType}</p>
            <p>{formatBytes(file.size)}</p>
        </>
    )
}

export default FileView;