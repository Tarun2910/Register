import React from 'react';
import {Box, Grid} from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppCard from '@crema/components/AppCard';
import ImgUpload from './ImageUpload';
import VidUpload from './PreviewVideoUpload';
import styled from '@emotion/styled';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AppScrollbar from '@crema/components/AppScrollbar';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';

const ReactQuillWrapper = styled(ReactQuill)(() => {
  return {
    '& .ql-editor, & .ql-container': {
      maxHeight: '100% !important',
    },
    '& .ql-toolbar': {
      borderRadius: '8px 8px 0 0',
    },
    '& .ql-container': {
      borderRadius: '0 0 8px 8px',
      minHeight: 150,
      maxHeight: 200,
    },
  };
});

const ProductContent = ({
  content,
  uploadedFiles,
  setUploadedFiles,
  setFieldValue,
  setUploadedVidFiles,
  uploadedVidFiles,
}) => {
  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={8}>
        <AppScrollbar style={{height: '700px'}}>
          <AppCard>
            <AppTextField
              name='title'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
              }}
              label='Course Name'
            />

            <Box component='p' sx={{mt: 3, fontSize: 16}}>
              Description*
            </Box>
            <Box
              sx={{
                width: '100%',
                my: 2,
              }}
            >
              <ReactQuillWrapper
                defaultValue={content}
                theme='snow'
                placeholder='Description here'
                onChange={(value) => setFieldValue('description', value)}
              />
            </Box>
            <Box component='p' sx={{mt: 3, mb: 2, fontSize: 16}}>
              Image
            </Box>
            <ImgUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
            <Box component='p' sx={{mt: 3, mb: 2, fontSize: 16}}>
              Preview video
            </Box>
            <VidUpload
              uploadedVidFiles={uploadedVidFiles}
              setUploadedVidFiles={setUploadedVidFiles}
            />
          </AppCard>
        </AppScrollbar>
      </Grid>
    </Slide>
  );
};

export default ProductContent;
ProductContent.propTypes = {
  content: PropTypes.string,
  uploadedFiles: PropTypes.array,
  setUploadedFiles: PropTypes.func,
  uploadedVidFiles: PropTypes.func,
  setUploadedVidFiles: PropTypes.func,
  setFieldValue: PropTypes.func,
  selectedTags: PropTypes.array,
};
