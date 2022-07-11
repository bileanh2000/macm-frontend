import React, { useEffect, useState, useCallback } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import styles from './UploadFile.module.scss';

const fileTypes = ['CSV'];

function DragDrop() {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };
    return (
        <div className="dragdrop">
            <FileUploader
                multiple={true}
                onTypeError={(err) => console.log(err)}
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                classes="drop-area"
            />
            <p>{file ? `File name: ${file[0].name}` : ''}</p>
        </div>
    );
}

export default DragDrop;
