import React, {useRef} from 'react';
import {Box, Button, Grid, Stack, TextField} from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppCard from '@crema/components/AppCard';
import ImgUpload from './VideoUpload';
import styled from '@emotion/styled';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AppScrollbar from '@crema/components/AppScrollbar';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import AppGridContainer from '@crema/components/AppGridContainer';
import {useNavigate} from 'react-router-dom';

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
  productInfo,
  productSpec,
  setProductInfo,
  setProductSpec,
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  console.log(productSpec, 'productSpec');
  const [chapterName, setChapterName] = React.useState([
    {id: 1, chaptername: '', desc: ''},
  ]);
  const [chapterSpec, setChapterSpec] = React.useState([
    {id: 1, chaptername: '', desc: ''},
  ]);
  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={12}>
        <AppScrollbar>
          <AppCard title='Chapter Details'>
            <AppTextField
              name='title'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
              }}
              label='Chapter Name'
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
          </AppCard>

          <Stack
            spacing={3}
            direction='row'
            sx={{justifyContent: 'flex-end', mt: 4}}
          >
            <Button
              sx={{
                minWidth: 100,
                color: 'text.secondary',
              }}
              variant='text'
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              sx={{
                display: 'block',
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              type='submit'
            >
              Add Chapter
            </Button>
          </Stack>
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
  setFieldValue: PropTypes.func,
  selectedTags: PropTypes.array,
  productInfo: PropTypes.array,
  productSpec: PropTypes.array,
  setProductSpec: PropTypes.func,
  setProductInfo: PropTypes.func,
};
