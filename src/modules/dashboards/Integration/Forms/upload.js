import React, {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import {useDropzone} from 'react-dropzone';

import AppList from '@crema/components/AppList';
import FileRow from 'modules/thirdParty/reactDropzone/components/FileRow';
import {UploadModern} from 'modules/thirdParty/reactDropzone/components';

const Basic = () => {
  const dropzone = useDropzone();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  return (
    <Box sx={{position: 'relative'}}>
      <UploadModern
        uploadText='Drag n drop SSL files here, or click to select files'
        dropzone={dropzone}
      />
      <aside>
        <AppList
          data={uploadedFiles}
          renderRow={(file, index) => (
            <FileRow
              key={index + file.path}
              file={file}
              onDeleteUploadFile={onDeleteUploadFile}
            />
          )}
        />
      </aside>
    </Box>
  );
};

export default Basic;
