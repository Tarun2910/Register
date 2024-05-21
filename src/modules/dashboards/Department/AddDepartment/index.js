import React, {useEffect, useState} from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Fonts} from '@crema/constants/AppEnums';
import {Box} from '@mui/material';
import ProductContent from './content';
import {Form, Formik} from 'formik';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';
import {toast} from 'react-toastify';

export const AddChapter = ({selectedProd, isEdit}) => {
  const {id} = useParams();
  const location = useLocation();
  const {deptName} = location.state || {};
  const pathSegments = location.pathname.split('/');
  const editDepartment = pathSegments[pathSegments.length - 2];
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
      Question: '',
      choice1: '',
      choice2: '',
      choice3: '',
      choice4: '',
      correct: '',
    },
  ]);
  const [chapterId, setChapterId] = useState('');
  const [branch, setBranch] = useState('');
  const [cau, setCau] = useState('');
  const [department, setDepartment] = useState('');
  const [deptDisplayName, setDeptDisplayName] = useState('');
  const [fromblock, setFromBlock] = useState('');
  const [toblock, setToBlock] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(editDepartment, 'IsEdit');

  useEffect(() => {
    if (selectedProd) {
      setSelectedAdmin(selectedProd?.admins);
    }
  }, [selectedProd]);

  useEffect(() => {
    if (editDepartment === 'edit-department') {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/multitenant/adminportal/api/getDeptId',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf8',
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          deptId: id,
          userName: sessionStorage.getItem('AdminName'),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setLoading(false);
          console.log(JSON.stringify(response.data));
          setBranch(response.data.branch);
          setDepartment(response.data.pklDirectorate);
          setFromBlock(response.data.fromBlock);
          setToBlock(response.data.toBlock);
          setDeptDisplayName(response.data.deptDisplayName);
          setCau(response.data.cau);
          const formattedData = Object.entries(response.data.subSec).map(
            ([key, value], index) => ({
              Question: Object.keys(response.data.subSec)[index], // Get question at current index
              choice1: Object.values(response.data.subSec)[index], // Get choice at current index
            }),
          );
          setProductSpec(formattedData);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  console.log(productInfo, 'productInfo');

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
            label='Adduser'
            link={`/addUser`}
            showComponentName={window.location.pathname === `/addUser`}
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
          if (editDepartment === 'edit-department') {
            const subSec = productSpec.reduce((acc, item) => {
              acc[item.Question] = item.choice1;
              return acc;
            }, {});

            const metaData = [
              {
                subSec: subSec,
                branch: branch,
                cau: cau,
                deptDisplayName: deptDisplayName,
                fromBlock: fromblock,
                toBlock: toblock,
                pklDirectorate: department,
                id: id,
                independent: false,
                deptName: deptName,
              },
            ];

            const metaDataString = JSON.stringify(metaData);

            axios
              .put(
                `/multitenant/adminportal/api/editDepartmentPortal`,
                metaDataString,
                {
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf8',
                    Authorization: `Bearer ${sessionStorage.getItem(
                      'jwt_token',
                    )}`,
                  },
                },
              )
              .then(() => {
                toast.success('Department Edit successfully!');
                navigate(-1);
              })
              .catch((error) => {
                toast.error('error');
              });
          } else {
            setLoading(true);
            const formData = new FormData();
            // const metaData = productSpec.map((item) => ({
            //   subSec: [{[item.Question]: item.choice1}],
            //   branch: branch,
            //   cau: cau,
            //   deptDisplayName: deptDisplayName,
            //   fromBlock: fromblock,
            //   toBlock: toblock,
            //   pklDirectorate: department,
            // }));

            const subSec = productSpec.reduce((acc, item) => {
              acc[item.Question] = item.choice1;
              return acc;
            }, {});

            const metaData = [
              {
                subSec: subSec,
                branch: branch,
                cau: cau,
                deptDisplayName: deptDisplayName,
                fromBlock: fromblock,
                toBlock: toblock,
                pklDirectorate: department,
              },
            ];

            productSpec.forEach((item) => {
              formData.append('files', item.file);
            });

            const metaDataString = JSON.stringify(metaData);

            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: '/multitenant/adminportal/api/createDepartment',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
              },
              data: metaDataString,
            };

            axios
              .request(config)
              .then((response) => {
                setLoading(false);
                console.log(JSON.stringify(response.data));
                toast.success('Department Created successfully!');
                navigate(-1);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
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
                setDifficulty={setDifficulty}
                loading={loading}
                setBranch={setBranch}
                branch={branch}
                setCau={setCau}
                cau={cau}
                setDepartment={setDepartment}
                department={department}
                setDeptDisplayName={setDeptDisplayName}
                deptDisplayName={deptDisplayName}
                fromblock={fromblock}
                setFromBlock={setFromBlock}
                toblock={toblock}
                setToBlock={setToBlock}
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
  isEdit: PropTypes.any,
};
