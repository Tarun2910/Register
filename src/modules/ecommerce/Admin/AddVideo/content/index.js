import React, {useEffect, useRef, useState} from 'react';
import {Autocomplete, Box, Button, Grid, Stack, TextField} from '@mui/material';
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
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState('');

  useEffect(() => {
    async function fetchChapter() {
      try {
        const response = await axios.get(`/kms/courses/${courseId}/chapters`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });
        setChapterData(response?.data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }
    fetchChapter();
  }, []);
  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={12}>
        <AppScrollbar>
          <AppCard
            title='Video Details'
            action={
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProductSpec([
                    ...productSpec,
                    {id: productSpec.length + 1, title: '', desc: ''},
                  ]);
                }}
              >
                Add New
              </Button>
            }
          >
            <AppGridContainer spacing={4}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  id='tags-outlined'
                  sx={{
                    width: '100%',
                    my: 4,
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
              </Grid>
              {productSpec.map((productItem, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant='outlined'
                        value={productItem.title}
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        onChange={(event) => {
                          const {value} = event.target;
                          const newProductInfo = [...productSpec];
                          newProductInfo[index].title = value;
                          setProductInfo(newProductInfo);
                        }}
                        label='video Title'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant='outlined'
                        value={productItem.desc}
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        onChange={(event) => {
                          const {value} = event.target;
                          const newProductInfo = [...productSpec];
                          newProductInfo[index].desc = value;
                          setProductInfo(newProductInfo);
                        }}
                        label='Video Description'
                      />
                    </Grid>
                    <Grid item xs={12} sm={11}>
                      <input
                        style={{display: 'none'}}
                        accept='.mp4, .avi, .mov, video/*'
                        type='file'
                        onChange={(event) => {
                          const file = event.target.files[0];
                          const newProductInfo = [...productSpec];

                          if (file) {
                            newProductInfo[index].file = file;
                            setProductInfo(newProductInfo);

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              // Create a video element
                              const video = document.createElement('video');
                              video.src = event.target.result;
                              video.addEventListener('loadedmetadata', () => {
                                // Get the duration in seconds
                                const durationInSeconds = Math.floor(
                                  video.duration,
                                );
                                newProductInfo[index].duration =
                                  durationInSeconds;
                                setProductInfo(newProductInfo);

                                console.log(
                                  'Video duration:',

                                  durationInSeconds,
                                  'seconds',
                                );
                                // You can store or use this durationInSeconds as needed
                              });
                            };

                            reader.readAsDataURL(file);
                          }
                        }}
                        ref={fileInputRef}
                      />
                      <TextField
                        variant='outlined'
                        value={productItem.file ? productItem.file.name : ''}
                        label='Upload Video'
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        readOnly
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
              Add Video
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
};
