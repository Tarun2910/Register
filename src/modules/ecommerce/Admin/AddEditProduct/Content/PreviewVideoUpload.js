import React, {useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import AppGrid from '@crema/components/AppGrid';
import {Box} from '@mui/material';
import {Fonts} from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';
import {
  PreviewThumb,
  UploadModern,
} from '../../../../thirdParty/reactDropzone/components';
import FileRow from '../../../../thirdParty/reactDropzone/components/FileRow';

const VidUpload = ({uploadedVidFiles, setUploadedVidFiles}) => {
  const dropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4', '.avi', '.mov'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedVidFiles(
          Object.assign(file, {preview: URL.createObjectURL(file)}),
        );
      }
    },
  });

  useEffect(() => {
    if (dropzone.acceptedFiles.length > 0) {
      setUploadedVidFiles(dropzone.acceptedFiles[0]);
    } else {
      setUploadedVidFiles('');
    }
  }, [dropzone.acceptedFiles, setUploadedVidFiles]);

  const onDeleteUploadFile = () => {
    setUploadedVidFiles(null); // Clear the uploaded file
  };

  return (
    <section className='container' style={{cursor: 'pointer'}}>
      <UploadModern
        setUploadedVidFiles={setUploadedVidFiles}
        dropzone={dropzone}
        customContent={
          <>
            <img
              src={'/assets/icon/upload.svg'}
              width={40}
              height={40}
              alt='upload'
            />
            <p>
              <Box
                component='span'
                sx={{color: 'primary.main', fontWeight: Fonts.MEDIUM}}
              >
                Click to upload
              </Box>{' '}
              or drag and drop
            </p>
            <Box component='p' sx={{mt: 1}}>
              Image (max. size: 800x400px)
            </Box>
          </>
        }
      />
      {uploadedVidFiles && (
        <AppGrid
          sx={{
            maxWidth: 500,
          }}
          data={[uploadedVidFiles]}
          column={1}
          itemPadding={5}
          renderRow={(file) => (
            <FileRow
              file={file}
              onDeleteUploadFile={onDeleteUploadFile}
              key={file.path}
            />
          )}
        />
      )}
    </section>
  );
};

export default VidUpload;

VidUpload.propTypes = {
  uploadedVidFiles: PropTypes.object,
  setUploadedVidFiles: PropTypes.func,
};
