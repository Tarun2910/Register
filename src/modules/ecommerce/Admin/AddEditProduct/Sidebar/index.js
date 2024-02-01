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
      <Grid item xs={12} lg={4}>
        <AppScrollbar style={{height: '700px'}}>
          <AppCard title='Course Details'>
            <FormControlLabel
              control={
                <Switch
                  checked={publish}
                  onChange={handlePublishToggle}
                  name='Publish'
                />
              }
              label='Publish'
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='Active Start Date'
                sx={{
                  width: '100%',
                  my: 4,
                }}
                value={value}
                disabled={publish}
                onChange={(newValue) => {
                  console.log(formatDate(newValue), 'new');
                  publish
                    ? setFieldValue('activeStartDate', null)
                    : setFieldValue('activeStartDate', formatDate(newValue));
                }}
                minDate={new Date()}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='Active End Date'
                sx={{
                  width: '100%',
                  my: 4,
                }}
                value={value}
                disabled={publish}
                onChange={(newValue) => {
                  publish
                    ? setFieldValue('activeEndDate', null)
                    : setFieldValue('activeEndDate', formatDate(newValue));
                }}
              />
            </LocalizationProvider>

            {/* <AppTextField
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
              label='Type'
            /> */}

            {/* <FormControl
              sx={{
                width: '100%',
              }}
              variant='outlined'
            >
              <InputLabel
                ref={inputLabel}
                id='demo-simple-select-outlined-label'
              >
                <IntlMessages id='common.category' />
              </InputLabel>
              <Field
                name='category'
                label={<IntlMessages id='common.category' />}
                labelId='label-select-outlined-label'
                as={Select}
                onChange={(event) =>
                  setFieldValue('category', event.target.value)
                }
              >
                {productCategory.map((category) => {
                  return (
                    <MenuItem
                      value={category.id}
                      key={category.id}
                      sx={{
                        cursor: 'pointer',
                        inputVariant: 'outlined',
                      }}
                    >
                      {category.name}
                    </MenuItem>
                  );
                })}
              </Field>
            </FormControl> */}

            <Autocomplete
              multiple
              id='tags-outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              options={TagList}
              autoHighlight
              getOptionLabel={(option) => option.name}
              value={selectedTags}
              onChange={(event, value) => setSelectedTags(value)}
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
                  label='Tags'
                  fullWidth
                />
              )}
            />
          </AppCard>

          <AppCard title='Assign Courses' sxStyle={{mt: 7}}>
            {/* <AppTextField
              name='mrp'
              type='number'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
                '& .MuiInputBase-input': {
                  pl: 2,
                },
              }}
              InputProps={{
                startAdornment: '$',
              }}
              label='Regular Price'
            /> */}
            {/* <AppTextField
              name='salemrp'
              type='number'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
                '& .MuiInputBase-input': {
                  pl: 2,
                },
              }}
              InputProps={{
                startAdornment: '$',
              }}
              label='Sale Price'
            /> */}

            <Autocomplete
              multiple
              id='tags-outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              options={user}
              autoHighlight
              getOptionLabel={(option) => option.id}
              value={selectedAdmin}
              onChange={(event, value) => setSelectedAdmin(value)}
              renderOption={(props, option) => (
                <Box
                  component='li'
                  sx={{display: 'flex', alignItems: 'center'}}
                  {...props}
                >
                  <Box ml={4}>{option?.id}</Box>
                </Box>
              )}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Assign Admin'
                  fullWidth
                />
              )}
            />
            <Autocomplete
              multiple
              id='tags-outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              options={user}
              autoHighlight
              getOptionLabel={(option) => option.id}
              value={selectedCreator}
              onChange={(event, value) => setSelectedCreator(value)}
              renderOption={(props, option) => (
                <Box
                  component='li'
                  sx={{display: 'flex', alignItems: 'center'}}
                  {...props}
                >
                  <Box ml={4}>{option?.id}</Box>
                </Box>
              )}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Assign creator'
                  fullWidth
                />
              )}
            />
            <Autocomplete
              id='tags-outlined'
              sx={{
                width: '100%',
                my: 4,
              }}
              options={user}
              autoHighlight
              getOptionLabel={(option) => (option ? option.id : '')}
              onChange={(event, value) => setSelectedCoordinator(value)}
              renderOption={(props, option) => (
                <Box
                  component='li'
                  sx={{display: 'flex', alignItems: 'center'}}
                  {...props}
                >
                  <Box ml={4}>{option?.id}</Box>
                </Box>
              )}
              // filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Assign Coordinator'
                  fullWidth
                />
              )}
            />
            {/* <FormControlLabel
              control={
                <Switch
                  value='checkedA'
                  inputProps={{'aria-label': 'secondary checkbox'}}
                  name='inStock'
                />
              }
              label='Tax Inclusive'
            /> */}

            {/* <AppTextField
              type='number'
              name='discount'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
              }}
              label='Discount %'
            /> */}
          </AppCard>

          {/* <AppCard
            title='Product Specification'
            sxStyle={{mt: 7}}
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
                        label='Product Label'
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
                        label='Product Value'
                      />
                    </Grid>
                  </React.Fragment>
                );
              })}
            </AppGridContainer>
          </AppCard> */}

          {/* <AppCard
            title='Product Details'
            sxStyle={{mt: 7}}
            action={
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProductInfo([
                    ...productInfo,
                    {id: productInfo.length + 1, title: '', desc: ''},
                  ]);
                }}
              >
                Add New
              </Button>
            }
          >
            <AppGridContainer spacing={4}>
              {productInfo.map((productItem, index) => {
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
                          const newProductInfo = [...productInfo];
                          newProductInfo[index].title = value;
                          setProductInfo(newProductInfo);
                        }}
                        label='Product Label'
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
                          const newProductInfo = [...productInfo];
                          newProductInfo[index].desc = value;
                          setProductInfo(newProductInfo);
                        }}
                        label='Product Value'
                      />
                    </Grid>
                  </React.Fragment>
                );
              })}
            </AppGridContainer>
          </AppCard> */}
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
            {isEdit ? 'Edit' : 'Add'} course
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
};
