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

const ImgUpload = ({uploadedFiles, setUploadedFiles}) => {
  const dropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4', '.avi', '.mov'],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles, 'accept');
      setUploadedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });
  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  return (
    <section className='container' style={{cursor: 'pointer'}}>
      <UploadModern
        setUploadedFiles={setUploadedFiles}
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
              MP4, AVI or MOV (max. 800x400px)
            </Box>
          </>
        }
      />
      <AppGrid
        sx={{
          maxWidth: 500,
        }}
        data={uploadedFiles}
        column={4}
        itemPadding={5}
        renderRow={(file, index) => (
          <PreviewThumb
            file={file}
            onDeleteUploadFile={onDeleteUploadFile}
            key={index + file.path}
          />
        )}
      />
    </section>
  );
};

export default ImgUpload;

ImgUpload.propTypes = {
  uploadedFiles: PropTypes.array,
  setUploadedFiles: PropTypes.func,
};
