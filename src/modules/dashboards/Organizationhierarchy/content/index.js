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
import {useNavigate, useParams} from 'react-router-dom';
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
  setUserId,
  userId,
  setDifficulty,
  list,
  triggerApi,
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const {id} = useParams();
  const [chapterData, setChapterData] = useState([
    {id: '1', title: 'Tarun'},
    {id: '2', title: 'Vishal'},
  ]);

  const [filteredOptions, setFilteredOptions] = useState([]);

  // useEffect(() => {
  //   // Filter the list to exclude items where the id matches
  //   const filteredList = list.filter(
  //     (option) =>
  //       option.id !== id && !option.subordinates.some((subId) => subId === id),
  //   );
  //   setFilteredOptions(filteredList);
  // }, [id, list]);

  console.log(filteredOptions, 'jjj');

  useEffect(() => {
    // Find the user object with the specified id
    const selectedUser = list.find((user) => user.id === id);
    if (selectedUser) {
      // Filter the list to exclude the selected user, their subordinates, and the user who reports to them
      const filteredList = list.filter((user) => {
        console.log(user.id, selectedUser.id, 'hhjsj');
        return (
          user.id !== selectedUser.id &&
          !selectedUser.subordinates.includes(user.id) &&
          selectedUser.reportsTo !== user.id
        );
      });
      setFilteredOptions(filteredList);
    }
  }, [id, list]);

  console.log(list, 'listggg');

  useEffect(() => {
    if (triggerApi || !triggerApi) {
      setUserId([]);
    }
  }, [triggerApi]);

  console.log(triggerApi, 'trigger');

  const Difficult = ['Easy', 'Medium', 'Hard'];
  const difficultyMapping = {
    Easy: 0,
    Medium: 1,
    Hard: 2,
  };

  console.log(userId.length, 'userID');

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

  return (
    <Slide direction='right' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={12}>
        <AppScrollbar>
          <AppCard title='Assign Subordinates '>
            <AppGridContainer spacing={4}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  multiple
                  id='tags-outlined'
                  sx={{
                    width: '100%',
                    my: 4,
                  }}
                  options={filteredOptions}
                  value={userId}
                  getOptionLabel={(option) => (option ? option?.name : [])}
                  onChange={(event, value) => setUserId(value)}
                  renderOption={(props, option) => (
                    <Box
                      component='li'
                      sx={{display: 'flex', alignItems: 'center'}}
                      {...props}
                    >
                      <Box ml={4}>{option?.name}</Box>
                    </Box>
                  )}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Select Subordinates'
                      fullWidth
                    />
                  )}
                />
              </Grid>
              {/* {productSpec.map((productItem, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={8}>
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
                        label={`Select user `}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        id='tags-outlined'
                        sx={{
                          width: '100%',
                          my: 2,
                        }}
                        options={Difficult}
                        getOptionLabel={(option) => option}
                        onChange={handleDifficultyChange}
                        renderOption={(props, option) => (
                          <Box
                            component='li'
                            sx={{display: 'flex', alignItems: 'center'}}
                            {...props}
                          >
                            <Box ml={4}>{option}</Box>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Report to '
                            fullWidth
                          />
                        )}
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
              })} */}
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
              disabled={userId.length === 0}
            >
              Save Change
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
  setUserId: PropTypes.func,
  userId: PropTypes.any,
  setDifficulty: PropTypes.any,
  list: PropTypes.any,
  triggerApi: PropTypes.any,
};
