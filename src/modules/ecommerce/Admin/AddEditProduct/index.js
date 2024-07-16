import React, {useEffect, useState} from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Fonts} from '@crema/constants/AppEnums';
import {Box} from '@mui/material';
import BlogSidebar from './Sidebar';
import ProductContent from './Content';
import {Form, Formik} from 'formik';
import {useInfoViewActionsContext} from '@crema/context/AppContextProvider/InfoViewContextProvider';
import {postDataApi, putDataApi} from '@crema/hooks/APIHooks';
import {useNavigate, useParams} from 'react-router-dom';
import {getStringFromHtml} from '@crema/helpers/StringHelper';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import axios from 'axios';
import {toast} from 'react-toastify';

export const AddEditProduct = ({selectedProd}) => {
  const {id} = useParams();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedVidFiles, setUploadedVidFiles] = useState([]);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = React.useState([
    {id: 1, title: '', desc: ''},
  ]);
  const [productSpec, setProductSpec] = React.useState([
    {id: 1, title: '', desc: ''},
  ]);

  useEffect(() => {
    if (selectedProd) {
      // setSelectedTags(selectedProd?.tag || []);
      // setUploadedFiles(
      //   selectedProd?.image.map((img) => ({...img, preview: img.src})),
      // );
      // setProductInfo(selectedProd?.productInfo);
      // setProductSpec(selectedProd?.productSpec);
      // setSelectedCoordinator(selectedProd?.coordinator);
      setSelectedAdmin(selectedProd?.admins);
      // setSelectedCreator(selectedProd?.creator);
      // setFieldValue('title', selectedProd?.courseName);
      // setFieldValue('activeEndDate', selectedProd?.activeEndDate);
      // setFieldValue('activeStartDate', selectedProd?.activeStartDate);
    }
  }, [selectedProd]);

  const Admin = selectedAdmin.map((item) => {
    return item.id;
  });

  const Creator = selectedCreator.map((item) => {
    return item.id;
  });

  const Coordinator = selectedCoordinator.id;

  const Tags = selectedTags.map((item) => {
    return item.name;
  });

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        {selectedProd ? 'Edit Course' : 'Create a new Course'}
      </Box>

      <Formik
        // validateOnChange={true}
        initialValues={
          selectedProd
            ? {
                ...selectedProd,
                category: selectedProd?.category || 1,
              }
            : {
                title: '',
                SKU: '',
                category: 1,
                mrp: 0,
                salemrp: 0,
                discount: 0,
                type: '',
                inStock: false,
                activeStartDate: '',
                activeEndDate: '',
              }
        }
        onSubmit={(data, {setSubmitting, resetForm}) => {
          console.log(data, selectedProd, 'data');
          setSubmitting(true);
          if (selectedProd) {
            const updatedProd = {
              ...selectedProd,
              ...data,
            };
            const formData = new FormData();
            formData.append('type', selectedProd.type);
            formData.append('courseName', selectedProd.title);
            formData.append(
              'courseDescription',
              getStringFromHtml(selectedProd.description),
            );
            // formData.append('coordinator', '1202');
            formData.append('activeStartDate', updatedProd.activeStartDate);
            formData.append('activeEndDate', updatedProd.activeEndDate);
            formData.append('admins', Admin);
            formData.append('creators', Creator);
            formData.append('coordinator', Coordinator);
            formData.append('tags', Tags);
            // Append the uploaded file to the FormData
            formData.append('file', uploadedFiles);
            axios
              .put(`/kms/courses/${id}`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
              .then(() => {
                infoViewActionsContext.showMessage('Course Edit successfully!');
                // navigate('/signin/ecommerce/product-listing');
              })
              .catch((error) => {
                infoViewActionsContext.fetchError(error.error);
              });
            // putDataApi('/api/ecommerce/list/update', infoViewActionsContext, {
            //   product: updatedProd,
            // })
            //   .then(() => {
            //     navigate('/ecommerce/product-listing');
            //     infoViewActionsContext.showMessage(
            //       'Product updated successfully!',
            //     );
            //   })
            //   .catch((error) => {
            //     infoViewActionsContext.fetchError(error.message);
            //   });
          } else {
            // postDataApi('/api/ecommerce/list/add', infoViewActionsContext, {
            //   product: {
            //     ...data,
            //     description: getStringFromHtml(data.description),
            //     image: uploadedFiles.map((file, index) => ({
            //       id: index,
            //       src: file.preview,
            //       rating: 0,
            //       reviews: 0,
            //     })),
            //     createdAt: dayjs().format('DD MMM YYYY'),
            //     inStock: data?.inStock || false,
            //     tag: selectedTags,
            //     productInfo,
            //     productSpec,
            //   },
            // })
            const formData = new FormData();

            // Append form values to the FormData
            formData.append('type', data.type);
            formData.append('courseName', data.title);
            formData.append(
              'courseDescription',
              getStringFromHtml(data.description),
            );
            // formData.append('coordinator', '1202');
            formData.append('activeStartDate', data.activeStartDate);
            formData.append('activeEndDate', data.activeEndDate);
            formData.append('admins', Admin);
            formData.append('creators', Creator);
            formData.append('coordinator', Coordinator);
            formData.append('tags', Tags);
            // Append the uploaded file to the FormData
            formData.append('file', uploadedFiles);
            formData.append('previewVideo', uploadedVidFiles);
            axios
              .post(`/kms/courses`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })

              .then(() => {
                const targetURL = '/signin/ecommerce/product-listing';
                navigate(targetURL);
                toast.success('Course created successfully!');
              })
              .catch((error) => {
                toast.error('Error');
              });
          }
          setSubmitting(false);
          resetForm();
        }}
      >
        {({setFieldValue}) => (
          <Form noValidate autoComplete='off'>
            <AppGridContainer>
              <ProductContent
                content={selectedProd?.description || ''}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                uploadedVidFiles={uploadedVidFiles}
                setUploadedVidFiles={setUploadedVidFiles}
                setFieldValue={setFieldValue}
              />
              <BlogSidebar
                isEdit={!!selectedProd}
                inStock={false}
                selectedTags={selectedTags}
                selectedAdmin={selectedAdmin}
                selectedCoordinator={selectedCoordinator}
                selectedCreator={selectedCreator}
                productInfo={productInfo}
                productSpec={productSpec}
                setProductInfo={setProductInfo}
                setFieldValue={setFieldValue}
                setSelectedTags={setSelectedTags}
                setSelectedAdmin={setSelectedAdmin}
                setSelectedCreator={setSelectedCreator}
                setSelectedCoordinator={setSelectedCoordinator}
                setProductSpec={setProductSpec}
              />
            </AppGridContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddEditProduct;

AddEditProduct.propTypes = {
  selectedProd: PropTypes.object,
};
