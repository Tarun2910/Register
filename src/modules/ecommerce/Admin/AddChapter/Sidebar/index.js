import React, {useEffect, useState} from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppCard from '@crema/components/AppCard';
import IntlMessages from '@crema/helpers/IntlMessages';
import {productCategory} from '@crema/mockapi/fakedb/ecommerce/ecommerceData';
import {useNavigate} from 'react-router-dom';
import AppGridContainer from '@crema/components/AppGridContainer';
import AppScrollbar from '@crema/components/AppScrollbar';
import {Field} from 'formik';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DateTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import axios from 'axios';
import CourseChapterTable from './courseChapterTable';
import ImgUpload from '../Content/VideoUpload';

const TagList = [
  {
    id: 1,
    name: 'programming basics',
  },
  {
    id: 2,
    name: 'backend development',
  },
  {
    id: 3,
    name: 'frontend development',
  },
  {
    id: 4,
    name: 'devops',
  },
  {
    id: 5,
    name: 'data structures and algorithms',
  },
  {
    id: 6,
    name: 'system design',
  },
];
const BlogSidebar = ({
  isEdit,
  inStock,
  productInfo,
  productSpec,
  setProductSpec,
  setFieldValue,
  setProductInfo,
  selectedTags,
  selectedAdmin,
  selectedCreator,
  selectedCoordinator,
  setSelectedTags,
  setSelectedAdmin,
  setSelectedCreator,
  setSelectedCoordinator,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const inputLabel = React.useRef(null);
  const navigate = useNavigate();
  const [value, setValue] = React.useState(new Date());
  const [user, setUser] = React.useState([]);
  const [publish, setPublish] = useState(false);

  const handlePublishToggle = (event) => {
    setPublish(event.target.checked);
  };

  console.log(inStock, 'instock');
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/users`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });
        setUser(response?.data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }
    fetchData();
  }, []);

  const formatDate = (inputDate) => {
    if (!(inputDate instanceof Date)) {
      console.error('Input date is not a valid Date object');
      return null; // or handle the error as needed
    }

    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0');
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const seconds = inputDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  return (
    <Slide direction='left' in mountOnEnter unmountOnExit>
      <Grid item xs={12} lg={12}>
        <AppScrollbar style={{height: '700px'}}>
          <AppCard title='Video Details'>
            <AppTextField
              name='type'
              variant='outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              onChange={(event) => {
                console.log(event);
                setFieldValue('type', event.target.value);
              }}
              label='Video Title'
            />
            <AppTextField
              name='type'
              variant='outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              onChange={(event) => {
                console.log(event);
                setFieldValue('type', event.target.value);
              }}
              label='Video Description'
            />
            <Box component='p' sx={{mt: 3, mb: 2, fontSize: 16}}>
              Videos
            </Box>
            <ImgUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          </AppCard>
        </AppScrollbar>
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
            {isEdit ? 'Edit' : 'Add'} Chapter
          </Button>
        </Stack>
      </Grid>
    </Slide>
  );
};

export default BlogSidebar;

BlogSidebar.propTypes = {
  isEdit: PropTypes.bool,
  inStock: PropTypes.bool,
  productInfo: PropTypes.array,
  productSpec: PropTypes.array,
  setProductSpec: PropTypes.func,
  setFieldValue: PropTypes.func,
  setProductInfo: PropTypes.func,
  selectedTags: PropTypes.array,
  selectedAdmin: PropTypes.array,
  selectedCreator: PropTypes.array,
  selectedCoordinator: PropTypes.string,
  setSelectedTags: PropTypes.func,
  setSelectedAdmin: PropTypes.func,
  setSelectedCoordinator: PropTypes.func,
  setSelectedCreator: PropTypes.func,
  uploadedFiles: PropTypes.func,
  setUploadedFiles: PropTypes.func,
};
