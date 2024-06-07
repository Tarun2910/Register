import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {debounce} from 'lodash';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {toast} from 'react-toastify';
import PropTypes from 'prop-types';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';

const validationSchema = yup.object({
  Orgname: yup.string().required(<IntlMessages id='validation.nameRequired' />),
  adminemail: yup
    .string()
    // .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
  adminName: yup
    .string()
    .required(<IntlMessages id='validation.adminnameRequired' />),
  confirmPassword: yup
    .string()
    .required(<IntlMessages id='validation.reTypePassword' />),
});

const AddDomain = () =>
  //   {
  //   setLoading,
  //   setDomain,
  //   setDomainStatus,
  //   domain,
  //   loading,
  //   domainStatus,
  //   },
  {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [domain, setDomain] = useState('');
    const [domainStatus, setDomainStatus] = useState(null);

    const updateDomain = (event) => {
      const {value} = event.target;
      setDomain(value);
    };

    useEffect(() => {
      if (domain === '') {
        setDomainStatus(null);
      }
    }, [domain]);

    useEffect(() => {
      const checkDomainAvailability = debounce(() => {
        setLoading(true);
        axios
          .get(
            `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/domains?emailDomain=@${domain}`,
          )
          .then((response) => {
            setLoading(false);
            console.log(response, 'response');
            if (response.status === 200) {
              setDomainStatus('available');
            } else if (response.status === 409) {
              setDomainStatus('unavailable');
            }
          })
          .catch((error) => {
            setLoading(false);
            setDomainStatus('unavailable');
          });
      }, 500); // Debounce time in milliseconds

      if (domain) {
        checkDomainAvailability();
      }

      return () => {
        checkDomainAvailability.cancel();
      };
    }, [domain]);

    return (
      <>
        <Formik
          initialValues={{
            Domain: '',
          }}
          //   validationSchema={validationSchema}
          onSubmit={(data, {setErrors, resetForm}) => {
            setLoading(true);
            if (data.password !== data.confirmPassword) {
              setLoading(false);
              setErrors({
                confirmPassword: (
                  <IntlMessages id='validation.passwordMisMatch' />
                ),
              });
            } else {
              // resetForm();
              let formdata = new FormData();
              formdata.append('orgName', data.Orgname);
              formdata.append('adminName', data.adminName);
              formdata.append(
                'adminEmail',
                `${data.adminemail.toLowerCase()}@${domain}`,
              );
              formdata.append('password', data.password);

              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/tenants/public/register`,
                headers: {},
                data: formdata,
              };

              axios
                .request(config)
                .then((response) => {
                  setLoading(false);
                  console.log(JSON.stringify(response.data));
                  navigate('/signin');
                })
                .catch((error) => {
                  toast.error(error.message);
                  console.log(error);
                  setLoading(false);
                });
            }
          }}
        >
          {({isSubmitting}) => (
            <Form noValidate autoComplete='off'>
              <TextField
                label={<IntlMessages id='common.domain' />}
                name='Domain'
                variant='outlined'
                sx={{
                  width: '100%',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {loading && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <CircularProgress
                            size={24}
                            color='inherit'
                            style={{marginRight: '5px'}}
                          />
                          <span style={{color: 'grey'}}>
                            Checking Availability ...
                          </span>
                        </div>
                      )}

                      {domainStatus === 'available' && !loading && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <DoneIcon
                            fontSize='small'
                            style={{marginRight: '5px', color: 'green'}}
                          />
                          <span style={{color: 'green'}}>Domain available</span>
                        </div>
                      )}
                      {domainStatus === 'unavailable' && !loading && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <WarningAmberIcon
                            fontSize='small'
                            style={{marginRight: '5px', color: 'red'}}
                          />
                          <span style={{color: 'red'}}>
                            Domain already Registered
                          </span>
                        </div>
                      )}
                      {domainStatus === null && ''}
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position='start'>@</InputAdornment>
                  ),
                }}
                onChange={updateDomain}
              />
            </Form>
          )}
        </Formik>
      </>
    );
  };

export default AddDomain;

AddDomain.propTypes = {
  setDomain: PropTypes.any,
  setLoading: PropTypes.any,
  setDomainStatus: PropTypes.any,
  domain: PropTypes.any,
  domainStatus: PropTypes.any,
  loading: PropTypes.any,
};
