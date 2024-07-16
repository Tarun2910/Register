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

export const AddChapter = ({selectedProd}) => {
  const {id} = useParams();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = React.useState([
    {id: 1, title: '', desc: '', file: null, duration: ''},
  ]);
  const [productSpec, setProductSpec] = React.useState([
    {id: 1, title: '', desc: '', file: null, duration: ''},
  ]);
  const [chapterId, setChapterId] = useState('');

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

  console.log(productSpec, 'addchapter');

  const handleGoToCourse = () => {
    navigate('signin/ecommerce/product-listing');
  };

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
        {selectedProd ? 'Edit Chapter' : 'Create a new Chapter'}
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
            axios
              .put(`/kms/courses/${id}`, updatedProd, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
              .then(() => {
                infoViewActionsContext.showMessage('Course Edit successfully!');
                const targetURL = '/signin/ecommerce/product-listing';
                navigate(targetURL);
              })
              .catch((error) => {
                infoViewActionsContext.fetchError(error.error);
              });
          } else {
            const Data = [
              {
                title: data.title,
                description: getStringFromHtml(data.description),
              },
            ];
            axios
              .post(`/kms/courses/${id}/chapters`, Data, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })

              .then((response) => {
                console.log(response);

                const targetURL = '/signin/ecommerce/product-listing';
                navigate(targetURL);
                toast.success('Chapter Added Successfully');
              })
              .catch((error) => {
                infoViewActionsContext.fetchError(error.error);
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
                setFieldValue={setFieldValue}
                productInfo={productInfo}
                productSpec={productSpec}
                setProductInfo={setProductInfo}
                setProductSpec={setProductSpec}
              />
              {/* <BlogSidebar
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
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              /> */}
            </AppGridContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddChapter;

AddChapter.propTypes = {
  selectedProd: PropTypes.object,
};
