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
import Table from './Table';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

export const organizationhierarchy = ({selectedProd}) => {
  const {id} = useParams();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = React.useState([
    {
      id: 1,
      Question: '',
      choice1: '',
      choice2: '',
      choice3: '',
      choice4: '',
      correct: '',
    },
  ]);
  const [productSpec, setProductSpec] = React.useState([
    {
      id: 1,
      title: '',
      choice1: '',
      choice2: '',
      choice3: '',
      choice4: '',
      correct: '',
    },
  ]);
  const [userId, setUserId] = useState([]);
  const [chapterId, setChapterId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [list, setList] = useState([]);
  const [triggerApi, setTriggerApi] = useState(false);
  const [showUser, setShowUser] = useState([]);

  const AdmName = sessionStorage.getItem('AdminName');

  useEffect(() => {
    if (selectedProd) {
      setSelectedAdmin(selectedProd?.admins);
    }
  }, [selectedProd]);

  console.log(list, 'adminname');

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const filteredList = response.data.content.filter(
          (user) => user.name !== AdmName,
        );
        setList(filteredList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [triggerApi]);

  // useEffect(() => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/users/free`,
  //     headers: {
  //       Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  //     },
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       const filteredList = response.data.filter(
  //         (user) => user.name !== AdmName,
  //       );
  //       setShowUser(filteredList);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [triggerApi]);

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

  const handleDeleteSubordinate = (value) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/hierarchy`,
      headers: {
        userId: id,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      data: [value],
    };

    axios
      .request(config)
      .then((response) => {
        setList(list.filter((item) => item.id !== value));
        toast.success('Deleted Successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let userIds = userId ? userId.map((item) => item.id) : [];
  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <span>
          <CustomizedBreadcrumbs
            label='AddSubordinates'
            link={`/hierarchy/${id}`}
            showComponentName={window.location.pathname === `/hierarchy/${id}`}
          />
        </span>
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
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
            // const formData = new FormData();
            // const metaData = productSpec.map((item) => ({
            //   Question: item.Question,
            //   choices: [item.choice1, item.choice2, item.choice3, item.choice4],
            //   correctAnswer: item.choice1,
            //   chapterId: chapterId.id,
            //   difficulty: difficulty,
            // }));

            // productSpec.forEach((item) => {
            //   formData.append('files', item.file);
            // });

            // const metaDataString = JSON.stringify(metaData);

            // formData.append('metadataList', metaDataString);
            // axios
            //   .post(`/tenants/hierarchy`, userId.id, {
            //     headers: {
            //       Authorization: `Bearer ${sessionStorage.getItem(
            //         'token',
            //       )}`,
            //       userId: id,
            //     },
            //   })

            //   .then(() => {
            //     toast.success('Subordinates Added successfully!');
            //   })
            //   .catch((error) => {
            //     toast.error(error.message);
            //   });

            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/hierarchy`,
              headers: {
                userId: id,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              },
              data: JSON.stringify(userIds),
            };

            axios
              .request(config)
              .then((response) => {
                toast.success('Subordinates Added successfully!');
                setTriggerApi((prevState) => !prevState);
              })
              .catch((error) => {
                toast.error(error.message);
              });
          }
          setSubmitting(false);
          resetForm();
        }}
      >
        {({setFieldValue}) => (
          <Form noValidate autoComplete='off'>
            {/* <AppGridContainer> */}
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
              setUserId={setUserId}
              userId={userId}
              setDifficulty={setDifficulty}
              list={showUser}
              triggerApi={triggerApi}
            />

            <Table
              list={list}
              setList={setList}
              handleDeleteSubordinate={handleDeleteSubordinate}
            />
            {/* </AppGridContainer> */}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default organizationhierarchy;

organizationhierarchy.propTypes = {
  selectedProd: PropTypes.object,
};
