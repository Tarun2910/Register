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
import AppCard from '@crema/components/AppCardOne';
import styled from '@emotion/styled';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AppScrollbar from '@crema/components/AppScrollbar';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import AppGridContainer from '@crema/components/AppGridContainerOne';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import {saveAs} from 'file-saver';
import {toast} from 'react-toastify';

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
  loading,
  setLoading,
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loadingupload, setLoadingupload] = useState(false);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    handleUploadClick(file);
  };

  const handleDownloadClick = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users/template`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      responseType: 'blob', // Ensure response is treated as a blob
    };

    axios
      .request(config)
      .then((response) => {
        // Use file-saver to save the blob
        saveAs(response.data, 'template.xlsx');
      })
      .catch((error) => {
        console.error('Error during file download:', error);
      });
  };

  const handleUploadClick = (file) => {
    setLoadingupload(true);
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users/template`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        setLoadingupload(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        }
        toast.success('File uploaded successfully');
        console.log('File uploaded successfully', response.data);
      })
      .catch((error) => {
        setLoadingupload(false);
        toast.error('Error uploading file');
        console.error('Error uploading file:', error);
      });
  };
  const validateForm = (productSpec) => {
    let isValid = true;
    for (const item of productSpec) {
      if (!item.Question || !item.choice1 || !isValidEmail(item.choice1)) {
        isValid = false;
        break;
      }
    }
    setIsFormValid(isValid);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    validateForm(productSpec);
  }, [productSpec]);

  const handleInputChange = (event, index, field) => {
    const {value} = event.target;
    const newProductSpec = [...productSpec];
    newProductSpec[index][field] = value;
    setProductSpec(newProductSpec);
    validateForm(newProductSpec);
  };

  return (
    <>
      <Slide direction='right' in mountOnEnter unmountOnExit>
        <Grid item xs={12} lg={12}>
          <AppScrollbar>
            <AppCard
              title='Add Users via Excel'
              sx={{width: '100%'}}
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
                  <input
                    type='file'
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    id='file-upload'
                  />
                  <label htmlFor='file-upload'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                      disabled={loadingupload}
                    >
                      Upload
                    </Button>
                  </label>
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
                {productSpec.map((productItem, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant='outlined'
                        value={productItem.Question}
                        sx={{width: '100%', my: 2}}
                        onChange={(event) =>
                          handleInputChange(event, index, 'Question')
                        }
                        label={'Name'}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={index === 0 ? 12 : 6}
                      sm={index === 0 ? 6 : 5}
                    >
                      <TextField
                        variant='outlined'
                        value={productItem.choice1}
                        sx={{width: '100%', my: 2}}
                        onChange={(event) =>
                          handleInputChange(event, index, 'choice1')
                        }
                        label='Email'
                        error={
                          productItem.choice1 &&
                          !isValidEmail(productItem.choice1)
                        }
                        helperText={
                          productItem.choice1 &&
                          !isValidEmail(productItem.choice1)
                            ? 'Invalid email format'
                            : ''
                        }
                      />
                    </Grid>
                    {index > 0 && (
                      <Grid item xs={12} sm={1}>
                        <Button
                          variant='contained'
                          color='secondary'
                          sx={{my: 2}}
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
                ))}
              </AppGridContainer>
            </AppCard>
            <Stack
              spacing={3}
              direction='row'
              sx={{justifyContent: 'flex-end', mt: 4}}
            >
              <Button
                sx={{minWidth: 100, color: 'text.secondary'}}
                variant='text'
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                sx={{display: 'block', minWidth: 100}}
                color='primary'
                variant='contained'
                type='submit'
                disabled={loading || !isFormValid} // Disable button if loading or form is invalid
              >
                {loading ? 'Loading...' : 'ADD'}
              </Button>
            </Stack>
          </AppScrollbar>
        </Grid>
      </Slide>
    </>
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
  loading: PropTypes.any,
  setLoading: PropTypes.any,
};
