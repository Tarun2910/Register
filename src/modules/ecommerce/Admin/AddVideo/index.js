import React, {useEffect, useState} from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Fonts} from '@crema/constants/AppEnums';
import {Box} from '@mui/material';
import ProductContent from './content/index';
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
      setSelectedAdmin(selectedProd?.admins);
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

  console.log(chapterId.id, 'chapterid');

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
        {selectedProd ? 'Edit Chapter' : 'Uplaod a new Video'}
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
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'jwt_token',
                  )}`,
                },
              })
              .then(() => {
                toast.success('Course Edit successfully!');
                const targetURL = '/signin/ecommerce/product-listing';
                navigate(targetURL);
              })
              .catch((error) => {
                toast.error('error');
              });
          } else {
            const formData = new FormData();
            const metaData = productSpec.map((item) => ({
              videoTitle: item.title,
              videoDesc: item.desc,
              courseId: id,
              videoLength: item.duration,
              chapterId: chapterId.id,
            }));

            productSpec.forEach((item) => {
              formData.append('files', item.file);
            });

            const metaDataString = JSON.stringify(metaData);

            formData.append('metadataList', metaDataString);
            axios
              .post(`/kms/courses/upload`, formData, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'jwt_token',
                  )}`,
                },
              })

              .then(() => {
                const targetURL = '/signin/ecommerce/product-listing';
                navigate(targetURL);
                toast.success('video Uploaded successfully!');
              })
              .catch((error) => {
                toast.error('error');
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
                courseId={id}
                setChapterId={setChapterId}
                chapterId={chapterId}
              />
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
