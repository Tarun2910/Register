import React, {useEffect, useRef, useState} from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
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
  deptName,
  setRoles,
  roles,
  user,
  setUser,
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
      setUser('');
      setRoles('');
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
          <AppCard title={`Add Roles in ${deptName.toUpperCase()}`}>
            <AppGridContainer spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={roles}
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {`${deptName.toUpperCase()}`}
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setRoles(value);
                  }}
                  label={'Role'}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant='outlined'
                  value={user}
                  sx={{
                    width: '100%',
                    my: 2,
                  }}
                  onChange={(event) => {
                    const {value} = event.target;
                    setUser(value);
                  }}
                  label={'User'}
                />
              </Grid>
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
              disabled={user === '' && roles === ''}
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
  deptName: PropTypes.any,
  setUser: PropTypes.any,
  setRoles: PropTypes.any,
  roles: PropTypes.any,
  user: PropTypes.any,
};
