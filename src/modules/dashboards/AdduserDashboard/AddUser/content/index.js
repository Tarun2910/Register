import React, {useEffect, useRef, useState} from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppCard from '@crema/components/AppCard';
import styled from '@emotion/styled';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AppScrollbar from '@crema/components/AppScrollbar';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import AppGridContainer from '@crema/components/AppGridContainer';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Divider from '@mui/material/Divider';

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
  courseId,
  setChapterId,
  chapterId,
  setDifficulty,
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState('');

  const Difficult = ['Easy', 'Medium', 'Hard'];
  const difficultyMapping = {
    Easy: 0,
    Medium: 1,
    Hard: 2,
  };

  console.log(productSpec, 'productspec');

  const handleDifficultyChange = (event, value) => {
    // Check if a difficulty option is selected
    if (value) {
      const difficultyValue = difficultyMapping[value];
      setDifficulty(difficultyValue);
    } else {
      // Handle the case where no option is selected (optional)
      setDifficulty(null);
    }
  };

  const handleDownloadClick = () => {
    // Create a workbook and add a worksheet
    console.log('download Clicked');
  };

  const handleUploadClick = () => {
    // Add logic to handle the file upload
    // You can use an input element with type="file" and handle the change event.
    // Example:
    // const handleFileUpload = (event) => {
    //   const file = event.target.files[0];
    //   // Process the uploaded file
    // };
    // <input type="file" onChange={handleFileUpload} />
  };

  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={12}>
        <AppScrollbar>
          <AppCard
            title='Add Users via Excel '
            sx={{
              width: '100%',
              my: 4,
            }}
            action={
              <>
                <Button
                  sx={{marginRight: 2}}
                  variant='contained'
                  color='primary'
                  onClick={handleDownloadClick}
                >
                  Download
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleUploadClick}
                >
                  Upload
                </Button>
              </>
            }
          ></AppCard>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              my: 4,
            }}
          >
            <Divider sx={{width: '45%', height: '1px'}} />
            <Typography variant='subtitle1' sx={{mx: 2}}>
              OR
            </Typography>
            <Divider sx={{width: '45%', height: '1px'}} />
          </Box>
          <AppCard
            title='Add Users'
            action={
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProductSpec([
                    ...productSpec,
                    {
                      id: productSpec.length + 1,
                      Question: '',
                      choice1: '',
                      choice2: '',
                      choice3: '',
                      choice4: '',
                      correct: '',
                    },
                  ]);
                }}
              >
                Add New
              </Button>
            }
          >
            <AppGridContainer spacing={4}>
              {/* <Grid item xs={12} sm={12}>
                <Autocomplete
                  id='tags-outlined'
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  options={chapterData ? chapterData : []}
                  getOptionLabel={(option) => (option ? option?.title : [])}
                  onChange={(event, value) => setChapterId(value)}
                  renderOption={(props, option) => (
                    <Box
                      component='li'
                      sx={{display: 'flex', alignItems: 'center'}}
                      {...props}
                    >
                      <Box ml={4}>{option?.title}</Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Select Chapter'
                      fullWidth
                    />
                  )}
                />
              </Grid> */}
              {productSpec.map((productItem, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant='outlined'
                        value={productItem.Question}
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        onChange={(event) => {
                          const {value} = event.target;
                          const newProductInfo = [...productSpec];
                          newProductInfo[index].Question = value;
                          setProductInfo(newProductInfo);
                        }}
                        label={'User Name'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        variant='outlined'
                        value={productItem.choice1}
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        onChange={(event) => {
                          const {value} = event.target;
                          const newProductInfo = [...productSpec];
                          newProductInfo[index].choice1 = value;
                          setProductInfo(newProductInfo);
                        }}
                        label='User Email'
                      />
                    </Grid>

                    {index > 0 && (
                      <Grid item xs={12} sm={1}>
                        <Button
                          variant='contained'
                          color='secondary'
                          sx={{
                            my: 2,
                          }}
                          onClick={() => {
                            const newProductInfo = [...productSpec];
                            newProductInfo.splice(index, 1);
                            setProductSpec(newProductInfo);
                          }}
                        >
                          Remove
                        </Button>
                      </Grid>
                    )}
                  </React.Fragment>
                );
              })}
            </AppGridContainer>
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
              Add
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
  courseId: PropTypes.any,
  setChapterId: PropTypes.func,
  chapterId: PropTypes.any,
  setDifficulty: PropTypes.any,
};
