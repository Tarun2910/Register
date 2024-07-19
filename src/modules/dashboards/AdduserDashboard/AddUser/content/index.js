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
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
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
import MinHeightTextarea from 'modules/muiComponents/utils/Text/MinHeightTextarea';

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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const StyledIconButton = styled(IconButton)(({theme}) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
    width: 30,
    height: 30,
    '& .MuiSvgIcon-root': {
      fontSize: 15,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const RemoveStyledIconButton = styled(StyledIconButton)(({theme}) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  }));

  const FloatingIconButton = styled(IconButton)(({disabled}) => ({
    backgroundColor: disabled ? '#d3d3d3' : '#FF8C00', // Orange when enabled, light grey when disabled
    color: '#fff',
    borderRadius: '50%',
    width: 40,
    height: 40,
    position: 'fixed',
    bottom: 20,
    right: 10,
    zIndex: 1,
    display: disabled ? 'none' : 'inline-flex',
    '& .MuiSvgIcon-root': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: disabled ? '#d3d3d3' : '#FF4500', // Darker orange on hover
    },
  }));

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
                  <Tooltip title='Download Template'>
                    <StyledIconButton
                      sx={{marginRight: 2}}
                      onClick={handleDownloadClick}
                    >
                      <DownloadIcon />
                    </StyledIconButton>
                  </Tooltip>
                  <input
                    type='file'
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    id='file-upload'
                  />
                  <label htmlFor='file-upload'>
                    <Tooltip title='Upload Excel'>
                      <StyledIconButton
                        component='span'
                        disabled={loadingupload}
                      >
                        <UploadIcon />
                      </StyledIconButton>
                    </Tooltip>
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
              <Divider sx={{width: '45%'}} />
              <Typography variant='subtitle1' sx={{mx: 2}}>
                OR
              </Typography>
              <Divider sx={{width: '45%'}} />
            </Box>
            <AppCard
              sxStyle={{height: '55vh'}}
              title='Add Users'
              action={
                <Tooltip title='Add New User'>
                  <StyledIconButton
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
                    <AddIcon />
                  </StyledIconButton>
                </Tooltip>
              }
            >
              <AppScrollbar>
                <Box>
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
                            label={'FullName'}
                          />
                        </Grid>
                        <Grid item xs={index === 0 ? 12 : 6} sm={5}>
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
                            <Tooltip title='Remove User'>
                              <RemoveStyledIconButton
                                onClick={() => {
                                  const newProductInfo = [...productSpec];
                                  newProductInfo.splice(index, 1);
                                  setProductSpec(newProductInfo);
                                }}
                              >
                                <RemoveIcon />
                              </RemoveStyledIconButton>
                            </Tooltip>
                          </Grid>
                        )}
                      </React.Fragment>
                    ))}
                  </AppGridContainer>
                </Box>
              </AppScrollbar>
            </AppCard>
            <Box
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Tooltip title='Cancel'>
                <FloatingIconButton
                  onClick={() => navigate(-1)}
                  disabled={false}
                >
                  <CancelIcon />
                </FloatingIconButton>
              </Tooltip>
              {!(loading || !isFormValid) && (
                <Tooltip title='Add User'>
                  <FloatingIconButton
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
                    disabled={loading || !isFormValid}
                  >
                    <CheckIcon />
                  </FloatingIconButton>
                </Tooltip>
              )}
            </Box>
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
