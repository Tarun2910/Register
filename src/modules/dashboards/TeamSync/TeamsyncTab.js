import AppLoader from '@crema/components/AppLoader';
import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import AppGridContainer from '@crema/components/AppGridContainerOne';
import AppAnimate from '@crema/components/AppAnimate';
import CardDetails from '../Crypto/CardDetails';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import TeamsyncTable from './index';
import axios from 'axios';
import {Fonts} from '@crema/constants/AppEnums';
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Adduser from '../AdduserDashboard';

const TeamSyncTab = () => {
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');
  const [storageData, setStorageData] = useState([]);
  const [list, setList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/storageStats`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        username: sessionStorage.getItem('username'),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setStorageData(response?.data);
        const transformedData = transformApiResponse(response?.data);
        setList(transformedData);
        // setTotal(response?.data?.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlegotoupgrade = () => {
    Navigate('/upgrade');
  };

  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };

  const formatStorageData = (data) => {
    if (
      !data ||
      !data?.deptsAggregate ||
      !data?.organizationStats ||
      !data?.usersAggregate
    ) {
      return null;
    }
    return [
      {
        title: 'Departments',
        value: handleNaN(
          parseFloat(
            (
              (data?.deptsAggregate?.currentlyUsedStorage /
                data?.deptsAggregate?.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#F04F47',
        income: `${handleNaN(
          (data?.deptsAggregate?.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
      },
      {
        title: 'Organization',
        value: handleNaN(
          parseFloat(
            (
              (data?.organizationStats?.currentlyUsedStorage /
                data?.organizationStats?.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#0BBFDB',
        income: `${handleNaN(
          (
            data?.organizationStats?.currentlyUsedStorage /
            1024 /
            1024 /
            1024
          ).toFixed(2),
        )} GB`,
      },
      {
        title: 'Users',
        value: handleNaN(
          parseFloat(
            (
              (data?.usersAggregate?.currentlyUsedStorage /
                data?.usersAggregate?.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#3D5AFE',
        income: `${handleNaN(
          (data?.usersAggregate?.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
      },
    ];
  };
  const totalUserCount = storageData?.totalUserCount || 0;
  const activeUserCount = storageData?.activeUserCount || 0;

  const transformApiResponse = (data) => {
    // Map individual user stats
    const userStats = data.usersPerms.map((user) => ({
      id: user.userName,
      userId: user.userName,
      deptName: null,
      accessLevel: null,
      accessCode: null,
      displayStorage: `${(user.currentlyUsedStorage / 1024).toFixed(2)} KB`,
      allowedStorageInBytes: user.totalAllocatedStorage,
      currentStorageInBytes: user.currentlyUsedStorage,
      allowedStorageInBytesDisplay: `${(
        user.totalAllocatedStorage /
        (1024 * 1024 * 1024)
      ).toFixed(2)} GB`,
      usedPercent:
        (user.currentlyUsedStorage / user.totalAllocatedStorage) * 100,
      deptUsername: null,
      deptDisplayUsername: null,
      roleName: null,
      displayRoleName: null,
      tenantId: null,
      licenseTier: null,
      isDMS_CreateType: false,
      userOrDept: user.userOrDept,
      active: user.active,
    }));

    // Map individual department stats
    const deptStats = data.deptPerms.map((dept) => ({
      id: dept.deptName,
      userId: dept.deptName,
      deptName: dept.deptName,
      accessLevel: null,
      accessCode: null,
      displayStorage: `${(dept.currentlyUsedStorage / 1024).toFixed(2)} KB`,
      allowedStorageInBytes: dept.totalAllocatedStorage,
      currentStorageInBytes: dept.currentlyUsedStorage,
      allowedStorageInBytesDisplay: `${(
        dept.totalAllocatedStorage /
        (1024 * 1024 * 1024)
      ).toFixed(2)} GB`,
      usedPercent:
        (dept.currentlyUsedStorage / dept.totalAllocatedStorage) * 100,
      deptUsername: null,
      deptDisplayUsername: null,
      roleName: null,
      displayRoleName: null,
      tenantId: null,
      licenseTier: null,
      isDMS_CreateType: false,
      userOrDept: dept.userOrDept,
    }));

    // Combine user and department stats
    return [...userStats, ...deptStats];
  };
  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 3,
          },
        }}
      >
        <span>
          <Typography sx={{fontWeight: Fonts.SEMI_BOLD}}>TeamSync</Typography>
        </span>
        <Button
          color='primary'
          variant='outlined'
          size='small'
          onClick={handlegotoupgrade}
        >
          Activate new plan
        </Button>
      </Box>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppGridContainer>
            <Grid item xs={12} md={12} lg={5}>
              {/* <CardDetails cardDetails={cryptoData.cardDetails} /> */}
              <CardDetails
                cardDetails={formatStorageData(storageData)}
                activeUserCount={activeUserCount}
                totalUserCount={totalUserCount}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={7}>
              <TeamsyncTable storageData={list} list={list} setList={setList} />
            </Grid>
            {/* <Grid item xs={12} md={12} lg={6}>
              <Adduser />
            </Grid> */}
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default TeamSyncTab;
